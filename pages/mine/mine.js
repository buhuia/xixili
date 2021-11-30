Page({
  data: {
    vipPoints: 0 ,
  },

  onShow() {
    this.setData({
      vipPoints: wx.getStorageSync('vip').points
    })
  },
  goToAddrManage:function(){
    wx.navigateTo({
      url: '/pages/addrManager/addrManager'
    })
  },
  call:function(){
    wx.makePhoneCall({
      phoneNumber: '12345678910',
    })
  }
})