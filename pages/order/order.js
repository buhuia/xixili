Page({
  data:{
    name: 'undone',
    isAdmin: true,
    orders: [],
    show: false,
    item: {}
  },
  onShow: function(){
    this.getUndone()
  },
  //todo： 管理员校验，小程序操作订单后续的接单、制作、送达。
  checkAdmin: function(){
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
    console.log(e.currentTarget.dataset.item)
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