// pages/dizhiguanli/dizhiguanli.js
Page({
  data:{
    addrList:[],
    show: false,
    defaultIndex: 0
  },
  onShow: function(){
    let vip = wx.getStorageSync('vip')
    let addrs = vip.addrs
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
    wx.showLoading({
      title: '删除中',
    })
    let that = this
    let index = e.currentTarget.dataset.index
    wx.cloud.callFunction({
      name: 'deleteAddr',
      data: {
        addrs: that.data.addrList,
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
      },()=>{
        wx.hideLoading()
      })
    })
  },
  delete:function(e){
    let that = this
    let event = e
    wx.showActionSheet({
      alertText: "选中地址删除后无法恢复",
      itemList: ['确认'],
      success(){
        that.deleteAddr(event)
      }
    })
  },
  setDefault:function(e){
    wx.showLoading({
      title: '设置中',
    })
    let index = parseInt(e.currentTarget.id)
    let newAddrList = this.data.addrList
    newAddrList.unshift(newAddrList.splice(index , 1)[0])
    wx.cloud.callFunction({
      name: "changeDefaultAddr",
      data: {
        addrs: newAddrList
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
        defaultIndex: index
      },()=>{
        wx.hideLoading()
      })
    })
  },
  confirm:function(){
    wx.navigateBack({
      delta: 1,
    })
  }
})