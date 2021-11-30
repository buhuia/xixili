// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const _id = event._id
  const targetStatus = event.targetStatus
  return db.collection("orders").doc(_id).update({
    data: {
      orderStatus: targetStatus
    }
  })
}