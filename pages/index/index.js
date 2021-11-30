// index.js

Page({
  data: {
    background: [],
    announcement: ''
  },
  onLoad:function() {
    wx.cloud.init({
      env: "cloud1-8gtq80g57c7f2b5a"
    })
    const db = wx.cloud.database()
    db.collection("staticData").get()
    .then(res => {
      this.setData({
        background: res.data[0].swiper,
        announcement: res.data[0].announcement
      })
      let staticData =  res.data[0]
      delete staticData.swiper
      wx.setStorage({
        key: "staticData",
        data: res.data[0]
      })
    })
    wx.cloud.callFunction({
      name: 'getVip'
    })
    .then(res => {
      wx.setStorageSync('vip', res.result)
    })
  },
  goToSelf:function(){
    wx.navigateTo({
      url: '/pages/list/list?mode=self-help',
    })
  },
  goToDelivery:function(){
    wx.navigateTo({
      url: '/pages/list/list?mode=delivery',
    })
  }
})
