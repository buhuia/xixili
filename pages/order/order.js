Page({
  data:{
    isAdmin: false
  },
  onLoad: function(){
    this.checkAdmin()
  },
  checkAdmin: function(){
    let admins = wx.getStorageSync('staticData').admin
    if(admins.indexOf(wx.getStorageSync('vip')._id) !== -1){
      this.setData({
        isAdmin: true
      })
    }
  }
})