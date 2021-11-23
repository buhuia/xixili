// pages/tianjiadizhi/tianjiadizhi.js
Page({
  data: {
    addr: {},
    index: -1
  },
  onLoad: function(e){
    if(e.index){
      let addr = wx.getStorageSync('vip').addrs[e.index]
      this.setData({
        addr: addr,
        index: e.index
      })
    }
  },
  goToLocation: function(){
    wx.navigateTo({
      url: '/pages/location/location',
    })
  },
  submitForm: function(e){
    const submitObj = e.detail.value
    if(!this.checkSubmit(submitObj)){
      return
    }
    let addr = this.data.addr
    //wx.getStorage(staticData).deliverFees是配送价格的列表，deliverFees[0]表示0-1KM的配送费，依此类推，deliverFees.length则表示配送的最远距离。
    if(addr.distance > wx.getStorageSync('staticData').deliverFees.length){
      wx.showToast({
        title: '超出配送距离',
        icon: 'none'
      })
      return
    }
    //判断是修改还是添加，如果是修改则删除选中地址再执行添加。
    if(this.data.index !== -1){
      wx.cloud.callFunction({
        name: 'deleteAddr',
        data: {
          addrs: wx.getStorageSync('vip').addrs,
          index: this.data.index
        }
      })
      .then(()=>{
        this.addAddr(submitObj)
      })
    }else{
      this.addAddr(submitObj)
    }
  },
  addAddr: function(submitObj){
    let addr = this.data.addr
    addr.callNumber = submitObj.callNumber
    addr.name = submitObj.name
    addr.detailAddr = submitObj.detailAddr
    addr.default = submitObj.default
    wx.cloud.callFunction({
      name: 'addAddr',
      data: {
        addr: addr
      }
    })
    .then(()=>{
      return wx.cloud.callFunction({
        name: 'getVip'
      })
    })
    .then(res => {
      wx.setStorageSync('vip', res.result)
      wx.navigateBack({
        delta: 1,
      })
    })
  },
  checkSubmit: function(obj){
    if(obj.name === ''){
      wx.showToast({
        icon: 'none',
        title: '请输入联系人姓名'
      })
      return false
    }
    if(obj.callNumber.length !== 11){
      wx.showToast({
        icon: 'none',
        title: '请输入11位手机号'
      })
      return false
    }
    if(obj.addr === ''){
      wx.showToast({
        icon: 'none',
        title: '请选择收货地址'
      })
      return false
    }
    if(obj.detailAddr === ''){
      wx.showToast({
        icon: 'none',
        title: '请输入详细地址'
      })
      return false
    }
    return true
  }
})