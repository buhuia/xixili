// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext()
  let openId = wxContext.OPENID
  let orgPoints = event.orgPoints
  let usedPoints = event.usedPoints
  let changePoints = event.changePoints
  delete event.orgPoints
  delete event.usedPoints
  delete event.userInfo
  delete event.changePoints
  event.vipId = openId
  console.log(event)
  db.collection("orders").add({
    data: event
  })
  .then(()=>{
    if(changePoints){
      return db.collection('vip').doc(openId).update({
        data:{
          points: orgPoints - usedPoints
        }
      })
    }else{
      return db.collection('vip').doc(openId).update({
        data:{
          points: orgPoints + event.totalPrice
        }
      })
    }
  })
}