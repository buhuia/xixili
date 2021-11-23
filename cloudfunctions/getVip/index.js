// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 获取vip信息存入缓存，若无信息则创建新的vip用户,_id设为openid
exports.main = async (event, context) => {
  const openId = cloud.getWXContext().OPENID
  return db.collection("vip").doc(openId).get()
  .then(res => {
      return res.data
    }
  )
  .catch(() => {
    let creatVipData = {
      _id: openId,
      points: 0,
      addrs: []
    }
    return db.collection("vip").add({
      data: creatVipData})
    .then(res => {
      return creatVipData
    })
  }
  )
}