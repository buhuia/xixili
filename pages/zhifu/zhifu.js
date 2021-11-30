Page({
  data:{
    cartData: [],
    mode: "",
    totalPrice: 0,
    addr: {},
    note: "",
    addr:{},
    shopAddr:{},
    points: 0,
    checked: false
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
      addr: wx.getStorageSync('vip').addrs[0],
      points: parseInt(wx.getStorageSync('vip').points/100) * 5 
    })
  },
  submitOrder:function(){
    let mode = ''
    let addr = {}
    if(this.data.mode ===  'self-help'){
      mode = '到店订单'
      addr = this.data.shopAddr
    }else{
      mode = '外卖订单'
      addr = this.data.addr
    }
    wx.cloud.callFunction({
      name: "submitOrder",
      data: {
        orderContent: this.data.cartData,
        orderStatus: "待接单",
        addr: addr,
        mode: mode,
        note: this.data.note,
        totalPrice: this.data.totalPrice,
        orgPoints: wx.getStorageSync('vip').points,
        usedPoints: this.data.points*20,
        changePoints: this.data.checked
      }
    })
    .then(()=>{
      console.log("上传订单成功")
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      prevPage.setData({
        cartData: []
      })
      wx.cloud.callFunction({
        name: 'getVip'
      })
      .then(res => {
        wx.setStorageSync('vip', res.result)
      })
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
  },
  onChange:function(event){
    let newTotalPrice = this.data.totalPrice - this.data.points
    this.setData({
      checked: event.detail,
      totalPrice: newTotalPrice
    });
  },
  setNote:function(e){
    this.setData({
      note: e.detail.value
    })
  }
})