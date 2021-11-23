// index.js

Page({
  data: {
    background: [],
  },
  onLoad:function() {
    wx.cloud.init({
      env: "cloud1-8gtq80g57c7f2b5a"
    })
    const db = wx.cloud.database()
    db.collection("staticData").get()
    .then(res => {
      this.setData({
        background: res.data[0].swiper
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
  }
})
