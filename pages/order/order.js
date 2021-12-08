Page({
  data:{
    name: 'undone',
    isAdmin: true,//默认都可以操作订单，如需限制改为false，配合后台在statiData.admin中添加自己的openid即可
    orders: [],
    show: false,
    item: {}
  },
  onLoad: function(){
    this.checkAdmin()
  },
  onShow: function(){
    this.getUndone()
  },
  //todo： 这版本安全性不好，简易版本，直接取localstorage对比了。如果是管理员，进入页面是会设置为true，就可以操作订单了。不是管理员则显示当前订单和历史订单。
  checkAdmin: function(){
    const adminList = wx.getStorageSync('staticData').admin
    if(adminList.indexOf(wx.getStorageSync('vip')._id) >= 0){
      this.setData({
        isAdmin: true
      })
    }
  },
  getOrders:function(e){
    const name = e.detail.name
    if(name === 'undone'){
      this.getUndone()
    }
    if(name === 'done'){
      this.getDone()
    }
    if(name === 'admin'){
      this.AdminGetUndone()
    }
  },
  getUndone:function(){
    wx.cloud.callFunction({
      name: 'getOrder',
      data: {
        mode: 'undone'
      }
    })
    .then((res)=>{
      console.log(res)
      this.setData({
        orders: res.result.data
      })
    })
  },
  getDone:function(){
    wx.cloud.callFunction({
      name: 'getOrder',
      data: {
        mode: 'done'
      }
    })
    .then((res)=>{
      console.log(res)
      this.setData({
        orders: res.result.data
      })
    })
  },
  AdminGetUndone:function(){
    wx.cloud.callFunction({
      name: 'getOrder',
      data: {
        mode: 'admin'
      }
    })
    .then((res)=>{
      console.log(res)
      this.setData({
        orders: res.result.data
      })
    })
  },
  showOrder:function(e){
    this.setData({
      show: true,
      item: e.currentTarget.dataset.item
    })
  },
  onClose() {
    this.setData({
      show: false,
      item: {}
    });
  },
  changeStatus:function(e){
    let that = this
    let item = e.currentTarget.dataset.item
    let status = item.orderStatus
    let _id = item._id
    let targetStatus = ""
    switch(status) {
      case "待接单":
        targetStatus = "已接单"
         break;
      case "已接单":
        targetStatus = "配送中"
         break;
      case "配送中":
        targetStatus = "已完成"
        break;
      default:
        return
    }
    wx.showActionSheet({
      alertText: `确认由${status}转为${targetStatus}`,
      itemList: ['确认'],
      success(){
        wx.showLoading({
          title: '状态更改中',
        })
        wx.cloud.callFunction({
          name: "changeOrderStatus",
          data: {
            _id: _id,
            targetStatus: targetStatus
          }
        })
        .then(()=>{
          that.AdminGetUndone()
          return
        })
        .then(()=>{
          wx.hideLoading()
        })
      }
    })
  },
})