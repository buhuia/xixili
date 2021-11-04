const app = getApp()
function itemIndexInCart(foodName, cartData){
  for(let i = 0; i < cartData.length; i++){
    if(foodName === cartData[i].foodName){
      return i
    }
  }
  //-1表示不存在cartData中
  return -1
}

Page({
  distance: 0,
  heightArr: [],
  GETRPX: 0,
  data: {
    listData:{}, //总的数据，云数据库获得。
    selectIndex: 0, //左侧menu所选的index
    listIndex: "l0",  //右侧列表跳转的index
    model:"", //首页传入，表明是自提还是外卖。影响地址管理
    cartData:[], //购物车数据，提交后上传数据库
    totalPrice:0, //总价
    showCart:false
  },
  //获取云端数据，初始化自适应比率，滚动节点高度等。
  onLoad:function(e){
    //首页传入参数，确定工作模式是现场还是外卖。决定购物车是否带地址。
    this.setData({
      model:e.model
    })

    //自适应宽度
    let winWidth = wx.getSystemInfoSync().windowWidth
    this.GETRPX=750/winWidth

    //通过云函数从后台获取listData并设置滚动时的节点高度
    wx.cloud.init({
      env: "cloud1-8gtq80g57c7f2b5a"
    })
    wx.cloud.callFunction({
      name: 'getKinds',
    })
    .then(res => {
      let orgKinds = res.result.data
      let resKinds = []
      for(let i = 0; i < orgKinds.length; i++){
        resKinds.push(orgKinds[i].kind)
      }
      return resKinds
    })
    .then(res => {
      return wx.cloud.callFunction({
        name: 'getListData',
        data: {
          kinds:res
        }
      })
    })
    .then(res => {
      let orgList = res.result
      let listData = []
      for(let i = 0; i < orgList.length; i++){
        if(orgList[i].data.length === 0){
          continue
        }
        let temObj={}
        let kind = orgList[i].data[0].kind
        temObj["kind"] = kind 
        temObj["content"] = orgList[i].data
        listData.push(temObj)
      }
      this.setData({
        listData:listData
      })
    })
    .then(()=>{
      console.log(this.data.listData)
      let heightArr=[]
      let sum = 0
      this.data.listData.map(x => {
        sum += x.content.length * 250 + 42
        heightArr.push(sum)
      })
      this.heightArr = heightArr
    })
  }, 
  //滚动右侧切换左侧菜单列表
  scroll:function(e){
    if (this.heightArr.length == 0) {
      return;
    }
    let scrollTop = e.detail.scrollTop*this.GETRPX;
    let selectIndex = this.data.selectIndex;
    if (scrollTop >= this.distance) { //页面向上滑动
      //如果右侧当前可视区域最底部到顶部的距离 超过 当前列表选中项距顶部的高度（且没有下标越界），则更新左侧选中项
      if (selectIndex + 1 < this.heightArr.length && scrollTop >= this.heightArr[selectIndex]) {
        this.setData({
          selectIndex: selectIndex + 1
        })
      }
    } else { //页面向下滑动
      //如果右侧当前可视区域最顶部到顶部的距离 小于 当前列表选中的项距顶部的高度，则更新左侧选中项
      if (selectIndex - 1 >= 0 && scrollTop < this.heightArr[selectIndex - 1]) {
        this.setData({
          selectIndex: selectIndex - 1
        })
      }
    }
    //更新到顶部的距离
    this.distance = scrollTop;
  },
  //左侧菜单点击切换右侧列表
  selectMenu:function(e){
    let listIndexNumber = e.currentTarget.dataset.index
    console.log(listIndexNumber)
    this.setData({
      listIndex:"l" + listIndexNumber,
      selectIndex:listIndexNumber
    },()=>{
      console.log(this.data.listIndex)
    })
  },
  //跳转详情页
  goToDetail:function(e){
    console.log(e)
    let param="firstIndex="+e.currentTarget.dataset.firstindex + "&foodsIndex=" + e.currentTarget.dataset.foodindex
    wx.navigateTo({
      url: "/pages/xiangqing/xiangqing?" + param,
    })
  },
  //更新总价。在每次添加，删除操作之后调用此方法，更新总价。
  updateTotalPrice:function(){
    let cartData = this.data.cartData
    let totalPrice = 0
    for(let i = 0; i < cartData.length; i++){
      totalPrice += cartData[i].price*cartData[i].number
    }
    this.setData({
      totalPrice:totalPrice
    })
  },
  addItem:function(e){
    let item = e.currentTarget.dataset.item
    let itemIndex = itemIndexInCart(item.foodName, this.data.cartData)
    if(itemIndex === -1){
      let addItem = {}
      let cartData=this.data.cartData
      addItem.foodName = item.foodName
      addItem.image = item.images[0]
      addItem.price = item.price
      addItem.number = 1
      cartData.push(addItem)
      this.setData({
        cartData:cartData
      },()=>{
        this.updateTotalPrice()
      })
    }else{
      let number = this.data.cartData[itemIndex].number + 1
      let updateNumber = `cartData[${itemIndex}].number`
      this.setData({
        [updateNumber]:number
      },() => {
        this.updateTotalPrice()
      })
    }
  },
  deleteItem:function(e){
    let foodName = e.currentTarget.dataset.item
    let cartData = this.data.cartData
    let itemIndex = itemIndexInCart(foodName, cartData)
    if(cartData[itemIndex].number > 1){
      let number = cartData[itemIndex].number - 1
      let updateNumber = `cartData[${itemIndex}].number`
      this.setData({
        [updateNumber]:number
      },() => {
        this.updateTotalPrice()
      })
    }else if(cartData[itemIndex].number === 1){
      cartData.splice(itemIndex, 1)
      this.setData({
        cartData:cartData
      },() => {
        this.updateTotalPrice()
      })
    }else{
      throw new Error("商品数量出错")
    }
  },
  showCart:function(){
    this.setData({
      showCart:true
    })
  },
  closeCart:function(){
    this.setData({
      showCart:false
    })
  }
})
