// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  try {
    // 验证输入
    if (!event.fileList || !Array.isArray(event.fileList)) {
      throw new Error('参数格式错误：需要fileList数组');
    }

    // 过滤无效fileID
    const validFiles = event.fileList.filter(
      item => item.fileID && item.fileID.startsWith('cloud://')
    );

    if (validFiles.length === 0) {
      return { fileList: [] };
    }

    // 获取临时URL
    const result = await cloud.getTempFileURL({
      fileList: validFiles
    });

    return {
      ...result,
      errCode: 0
    };
  } catch (err) {
    console.error('云函数错误:', err);
    return {
      errCode: 1,
      errMsg: err.message,
      fileList: []
    };
  }
}