// pages/dizhiguanli/dizhiguanli.js
Page({
  data:{
    addrList:[]
  },
  onShow: function(){
    let addrs = wx.getStorageSync('vip').addrs
    this.setData({
      addrList: addrs
    })
  },
  goToAddAddr:function(){
    wx.navigateTo({
      url: '/pages/addAddr/addAddr'
    })
  },
  setAddr: function(e){
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/addAddr/addAddr?index='+index,
    })
  },
  deleteAddr: function(e){
    let index = e.currentTarget.dataset.index
    wx.cloud.callFunction({
      name: 'deleteAddr',
      data: {
        addrs: wx.getStorageSync('vip').addrs,
        index: this.data.index
      }
    })
    .then(()=>{
      return wx.cloud.callFunction({
        name: 'getVip'
      })
    })
    .then(res => {
      wx.setStorageSync('vip', res.result)
      this.setData({
        addrList: wx.getStorageSync('vip').addrs
      })
    })
  }
})