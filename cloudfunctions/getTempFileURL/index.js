// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.getTempFileURL({
      fileList: event.fileList
    })
    return result
  } catch (err) {
    console.error('获取临时URL失败:', err)
    return {
      errCode: 1,
      errMsg: err.message
    }
  }
}