Page({
  data:{
    cartData: [],
    mode: "",
    totalPrice: 0,
    addr: {},
    note: "",
    addr:{},
    shopAddr:{}
  },
  onLoad:function(){
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let cartData = prevPage.data.cartData
    let mode = prevPage.data.mode
    let totalPrice = prevPage.data.totalPrice
    this.setData({
      cartData: cartData,
      mode: mode,
      totalPrice: totalPrice,
      shopAddr: wx.getStorageSync('staticData').shopLocation,
      addr: wx.getStorageSync('vip').addrs[0]
    },()=>{
      console.log(typeof(this.data.mode) ,this.data.mode)
    })
  },
  submitOrder:function(){
    wx.cloud.callFunction({
      name: "submitOrder",
      data: {
        orderContent: this.data.cartData,
        orderStatus: "daijiedan",
        addr: this.data.addr,
        mode: this.data.mode,
        note: this.data.note
      }
    })
    .then(()=>{
      console.log("上传订单成功")
      wx.navigateBack({
        delta: 2,
      })
    })
  },
  openMap:function(e){
    let addr = e.currentTarget.dataset.item
    wx.openLocation({
      latitude: addr.latitude,
      longitude: addr.longitude
    })
  }
})