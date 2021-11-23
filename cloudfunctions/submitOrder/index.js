// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  delete event.userInfo
  event.vipId = wxContext.OPENID
  console.log(event)
  return db.collection("orders").add({
    data: event
  })
}