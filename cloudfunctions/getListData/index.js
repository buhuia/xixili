// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let kinds = event.kinds
  let res=[]
  for(let i = 0; i < kinds.length; i++){
    let promise = db.collection('listData').where({
      kind:kinds[i],
      stock: _.gt(0)
    }).get()
    res.push(promise)
  }
  let output = await Promise.all(res)
  return output
}