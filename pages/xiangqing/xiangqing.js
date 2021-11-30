Page({
  data:{
    foodItem: {},
    number: 1,//初始化数目
    detail: {},
    selectDetailList: {},
    introduce: ""
  },
  onLoad(e){
    //初始化，通过_id获取详情。
    const db = wx.cloud.database()
    db.collection('listData').where({
      _id: e._id
    }).get().then(res => {
      this.setData({
        foodItem: res.data[0]
      },()=>{
        console.log(e._id)
        if(this.data.foodItem.hasOwnProperty("detail")){
          this.classifyDetail(this.data.foodItem.detail)
        }
      })
    })
    this.setData({
      introduce: wx.getStorageSync('staticData').introduce
    })
  },
  classifyDetail:function(detailArr){
    // 将后台获取的detail细节分类，便于wxml按照分类渲染。{key：[特点1，特点2，...]}
    let resObj = {}
    // 新建数据结构，用于后续实现同类型只能选一个的功能。{key:index}
    let keyObj = {}
    let detail = detailArr.map((item)=>{
      return item.split("-")
    })
    for(let i = 0; i < detail.length; i++){
      let tmpKey = detail[i][0]
      if(!resObj.hasOwnProperty(tmpKey)){
        resObj[tmpKey] = [detail[i][1]]
        //默认选项为列表中的第一项。
        keyObj[tmpKey] = 0
      }else{
        resObj[tmpKey].push(detail[i][1])
      }
    }
    this.setData({
      detail:resObj,
      selectDetailList:keyObj
    })
  },
  selectDetail:function(e){
    let key = e.currentTarget.dataset.key
    let index =  e.currentTarget.dataset.index
    let selectDetailList = this.data.selectDetailList
    selectDetailList[key] = index
    this.setData({
      selectDetailList:selectDetailList
    })
  },
  add:function(){
    let number = this.data.number
    number++
    this.setData({
      number: number
    })
  },
  sub:function(){
    let number = this.data.number
    if(number > 1){
      number--
    }
    this.setData({
      number: number
    })
  },
  addToCart:function(e){
    console.log(e)
    let item = e.currentTarget.dataset.item
    let selectdetaillist = e.currentTarget.dataset.selectdetaillist
    let detail = []
    for(let k in selectdetaillist){
      detail.push(this.data.detail[k][selectdetaillist[k]])
    }
    console.log(item)
    item.detail = detail

    //修改上一页的cartData
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.addItem(e)
    wx.navigateBack({
      delta: 1
    })
  }
})