const app = getApp()

Page({
  data:{
    foodDetail:{}
  },
  onLoad(e){
    wx.cloud.init({
      env: "cloud1-8gtq80g57c7f2b5a"
    })
  }
})