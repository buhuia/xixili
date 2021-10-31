// index.js

Page({
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    userInfo:''
  },
  onShow() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  }
})
