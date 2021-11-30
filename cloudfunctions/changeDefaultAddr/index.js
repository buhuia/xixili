// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const openId = cloud.getWXContext().OPENID
  let newAddrs = event.addrs
  return db.collection('vip').doc(openId).update({
    data:{
      addrs: newAddrs
    }
  })
}