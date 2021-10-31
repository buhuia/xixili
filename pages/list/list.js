const app = getApp()

Page({
  distance: 0,
  heightArr: [],
  GETRPX: 0,
  data: {
    listData:{},
    selectIndex: 0,
    listIndex: "l0",
    model:"",
    totalPrice:"0"
  },
  //计算生产滚动切换的target距离。
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
        sum += x.content.length * 200 + 41
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

})
