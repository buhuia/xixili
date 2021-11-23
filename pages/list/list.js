Page({
  distance: 0,
  heightArr: [],
  GETRPX: 0,
  data: {
    listData:{}, //总的数据，云数据库获得。
    selectIndex: 0, //左侧menu所选的index
    listIndex: "l0",  //右侧列表跳转的index
    mode:"", //首页传入，表明是自提还是外卖。影响地址管理
    cartData:[], //购物车数据，提交后上传数据库
    detailItemNumber:{},
    totalPrice:0, //总价
    totalNumber:0,
    showCart:false,
    addr:{},
    shopAddr:{}
  },
  //获取云端数据，初始化自适应比率，滚动节点高度等。
  onLoad:function(e){
    //首页传入参数，确定工作模式是现场还是外卖。决定购物车是否带地址。
    this.setData({
      mode: e.mode,
      shopAddr: wx.getStorageSync('staticData').shopLocation
    })

    //自适应宽度
    let winWidth = wx.getSystemInfoSync().windowWidth
    this.GETRPX = 750 / winWidth

    //通过云函数从后台获取listData并设置滚动时的节点高度
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
      let heightArr=[]
      let sum = 0
      this.data.listData.map(x => {
        sum += x.content.length * 250 + 42
        heightArr.push(sum)
      })
      this.heightArr = heightArr
    })

    //检查缓存，是否包含购物车数据。
    if(wx.getStorageSync('cartData')){
      this.setData({
        cartData:wx.getStorageSync('cartData')
      },()=>{
        this.updateTotalPriceAndNumber()
        this.updateDetailItemNumber()
      })
    }
  }, 
  onShow:function(){
    this.setData({
      addr: wx.getStorageSync('vip').addrs[0]
    })
  },
  onUnload:function(){
    //退出页面时保存购物车数据到缓存。
    wx.setStorageSync('cartData', this.data.cartData)
  },
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
    this.setData({
      listIndex:"l" + listIndexNumber,
      selectIndex:listIndexNumber
    })
  },
  //跳转详情页
  goToDetail:function(e){
    let param="_id="+e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/xiangqing/xiangqing?" + param,
    })
  },
  itemIndexInCart:function(item, cartData){
    for(let i = 0; i < cartData.length; i++){
      if(item.foodName === cartData[i].foodName){
        if(!item.hasOwnProperty('detail')){
          return i
        }else{
          if(this.scalarArrayEquals(item.detail,  cartData[i].detail)){
            return i
          }
        }
      }
    }
    //-1表示不存在cartData中
    return -1
  },
  //更新总价。在每次添加，删除操作之后调用此方法，更新总价。
  updateTotalPriceAndNumber:function(){
    let cartData = this.data.cartData
    let totalPrice = 0
    let totalNumber = 0
    for(let i = 0; i < cartData.length; i++){
      totalPrice += cartData[i].price*cartData[i].number
      totalNumber += cartData[i].number
    }
    if(totalPrice === 0){
      this.setData({
        showCart:false,
        totalPrice:totalPrice,
        totalNumber:totalNumber
      })
    }else{
      this.setData({
        totalPrice:totalPrice,
        totalNumber:totalNumber
      })
    }
  },
  updateDetailItemNumber:function(){
    let cartData = this.data.cartData
    let detailItemNumber = {}
    if(cartData.length > 0){
      for(let i = 0; i < cartData.length; i++){
        if(cartData[i].hasOwnProperty("detail")){
          if(detailItemNumber.hasOwnProperty(cartData[i].foodName)){
            detailItemNumber[cartData[i].foodName] += cartData[i].number
          }else{
            detailItemNumber[cartData[i].foodName] = cartData[i].number
          }
        }
      }
     }
     this.setData({
      detailItemNumber: detailItemNumber
    })
  },
  addItem:function(e){
    let item = e.currentTarget.dataset.item
    let cartData = this.data.cartData
    let number = e.currentTarget.dataset.hasOwnProperty('number')? e.currentTarget.dataset.number: 1
    let itemIndex = this.itemIndexInCart(item, cartData)
    if(itemIndex === -1){
      let addItem = {}
      addItem.foodName = item.foodName
      addItem.image = item.images[0]
      addItem.price = item.price
      addItem.number = number
      if(item.hasOwnProperty('detail')){
        addItem.detail = item.detail
      }
      cartData.push(addItem)
      this.setData({
        cartData:cartData
      },()=>{
        this.updateTotalPriceAndNumber()
        this.updateDetailItemNumber()
      })
    }else{
      let addNumber = cartData[itemIndex].number + number
      let updateNumber = `cartData[${itemIndex}].number`
      this.setData({
        [updateNumber]:addNumber
      },() => {
        this.updateTotalPriceAndNumber()
        this.updateDetailItemNumber()
      })
    }
  },
  deleteItem:function(e){
    let item = e.currentTarget.dataset.item
    let cartData = this.data.cartData
    let itemIndex = this.itemIndexInCart(item, cartData)
    if(cartData[itemIndex].number > 1){
      let number = cartData[itemIndex].number - 1
      let updateNumber = `cartData[${itemIndex}].number`
      this.setData({
        [updateNumber]:number
      },() => {
        this.updateTotalPriceAndNumber()
        this.updateDetailItemNumber()
      })
    }else if(cartData[itemIndex].number === 1){
      cartData.splice(itemIndex, 1)
      this.setData({
        cartData:cartData
      },() => {
        this.updateTotalPriceAndNumber()
        this.updateDetailItemNumber()
      })
    }else{
      throw new Error("商品数量出错")
    }
  },
  scalarArrayEquals:function(array1,array2) {
    return array1.length==array2.length && array1.every(function(v,i) { return v === array2[i]});
  },
  showCart:function(){
    if(this.data.cartData.length > 0){
      if(this.data.showCart){
        this.setData({
          showCart:false
        })
      }else{
        this.setData({
          showCart:true
        })
      }
    }
  },
  closeCart:function(){
    this.setData({
      showCart:false
    })
  },
  clearCart:function(){
    this.setData({
      cartData:[]
    },()=>{
      this.updateTotalPriceAndNumber()
      this.updateDetailItemNumber()
    })
  },
  submitOrder:function(){
    wx.navigateTo({
      url: '/pages/zhifu/zhifu',
    })
  },
  goToAddrManage:function(){
    wx.navigateTo({
      url: '/pages/addrManager/addrManager'
    })
  },
  openMap:function(){
    wx.openLocation({
      latitude: this.data.shopAddr.latitude,
      longitude: this.data.shopAddr.longitude,
      address: "店铺地址"
    })
  }
})
