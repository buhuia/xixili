Page({
  data: {
    userInfo:'',
  },

  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.login()
    console.log(11111)
  },
  login(){
    wx.getUserProfile({
      desc: '展示用户信息',
      success: res => {
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  logout(){
    this.setData({
      userInfo:''
    })
    wx.setStorageSync('userInfo', '')
  },
  goToAddrManage:function(){
    wx.navigateTo({
      url: '/pages/addrManager/addrManager'
    })
  }
})