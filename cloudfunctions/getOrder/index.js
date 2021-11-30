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
  const mode = event.mode

  if(mode === 'undone'){
    return db.collection("orders").where({
      vipId: openId,
      orderStatus: _.neq("已完成")
    }).get()
  }else if(mode === 'done'){
    return db.collection("orders").where({
      vipId: openId,
      orderStatus: "已完成"
    }).get()
  }else if(mode === 'admin'){
    return db.collection("orders").where({
      orderStatus: _.neq("已完成")
    }).get()
  }
}