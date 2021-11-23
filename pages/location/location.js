// pages/location/location.js
let QQMapWX = require('../../utils/qqmap-wx-jssdk1.2/qqmap-wx-jssdk')
let qqmapsdk
Page({
  data:{
    show: true,
    targetPosition: {},
    selectedNumber: -1,
    suggestion: [],
    poi: [],
    markers: [],
    backfill: ''
  },
  onLoad:function(){
    let that = this
    qqmapsdk = new QQMapWX({
      key: 'IX6BZ-URKCP-EO3DO-VT36E-EZXJ6-JKBMU'
    })
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          markers:[{
            longitude: longitude,
            latitude: latitude
          }],
        },() => {
          that.updataReverseGeocoder()
        })
      },
      fail:function(){
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  updataReverseGeocoder:function(){
    let that = this
    qqmapsdk.reverseGeocoder({
      location: {
        longitude: this.data.markers[0].longitude,
        latitude: this.data.markers[0].latitude
      },
      get_poi: 1,
      poi_options: 'address_format=short;radius=5000',
      success: function(res){
        let result = res.result
        let poi = []
        poi.push(that.data.targetPosition)
        for (var i = 0; i < result.pois.length; i++) {
          poi.push({
              title: result.pois[i].title,
              addr: result.pois[i].address,
              latitude: result.pois[i].location.lat,
              longitude: result.pois[i].location.lng
          })
        }
        that.setData({
          poi: poi
        })
      }
    })
  },
  hiddenOrtherView:function(){
    this.setData({
      show: false,
      suggestion: []
    })
  },
  backfill: function (e) {
    let id = e.currentTarget.id
    for (let i = 0; i < this.data.suggestion.length;i++){
      if(i == id){
        this.setData({
          targetPosition: this.data.suggestion[i],
          markers:[{
            longitude: this.data.suggestion[i].longitude,
            latitude: this.data.suggestion[i].latitude
          }],
          show: true,
          suggestion: [],
          backfill: "",
          selectedNumber: 0
        },() => {
          this.updataReverseGeocoder()
        })
      }  
    }
  },
  getsuggest: function(e) {
    var _this = this
    //调用关键词提示接口
    if(e.detail.value === ''){
      this.setData({
        suggestion: []
      })
      return
    }
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      region:'长治', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function(res) {//搜索成功后的回调
        var sug = []
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            addr: res.data[i].address,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          })
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug,
        })
      },
      fail: function(error) {
        console.error(error)
      }
    })
  },
  confirm:function(){
    let targetPosition = this.data.targetPosition
    let shopPosition = wx.getStorageSync('staticData').shopLocation
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    qqmapsdk.calculateDistance({
      from: `${targetPosition.latitude},${targetPosition.longitude}`,
      to: `${shopPosition.latitude},${shopPosition.longitude}`,
      success: function(res){
        targetPosition.distance = parseInt(res.result.elements[0].distance/1000)
        if(prevPage.data.addr.title){
          prevPage.setData({
            'addr.title': targetPosition.title,
            'addr.addr': targetPosition.addr,
            'addr.latitude': targetPosition.latitude,
            'addr.longitude': targetPosition.longitude,
            'addr.distance': targetPosition.distance
          },() => {
            wx.navigateBack({
              delta: 1,
            })
          })
        }else{
          prevPage.setData({
            addr: targetPosition
          },() => {
            wx.navigateBack({
              delta: 1,
            })
          })
        }
      },
      fail: function(error) {
        console.error(error);
      }
    })
  },
  showOrtherView:function(e){
    this.setData({
      show: true,
      backfill: ''
    })
  },
  choosePoint:function(e){
    let id = e.currentTarget.id
    let poi = this.data.poi[id]
    this.setData({
      targetPosition: poi,
      markers: [{
        longitude: poi.longitude,
        latitude: poi.latitude
      }],
      selectedNumber: id
    })
  }
})