const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const { OpenAI } = require('openai')
const fs = require('fs')

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
})

exports.main = async (event, context) => {
  try {
    console.log('收到的参数:', event)

    // 1. 检查 fileID 是否存在
    if (!event.systemImageId || !event.userFileID) {
      throw new Error('缺少 systemImageId 或 userFileID')
    }

    // 2. 下载文件并转 Base64（修改后的版本）
    const downloadFileAsBase64 = async (fileID) => {
      try {
        console.log('正在下载文件:', fileID)
        const result = await cloud.downloadFile({ 
          fileID: fileID
        })
        
        // 关键修改：直接使用 result.fileContent 作为 Buffer
        if (!result.fileContent) {
          throw new Error('下载文件内容为空')
        }
        
        // 如果是 Buffer 直接转换
        const buffer = Buffer.isBuffer(result.fileContent) 
          ? result.fileContent 
          : Buffer.from(result.fileContent, 'binary')
          
        return `data:image/jpeg;base64,${buffer.toString('base64')}`
      } catch (err) {
        console.error('下载文件失败:', err)
        throw new Error(`文件下载失败: ${err.message}`)
      }
    }

    // 3. 并行下载两个文件
    const [systemImageBase64, userImageBase64] = await Promise.all([
      downloadFileAsBase64(event.systemImageId),
      downloadFileAsBase64(event.userFileID)
    ])

    console.log('文件下载完成，开始调用AI分析')

    // 4. 调用大模型
    const response = await openai.chat.completions.create({
      model: "qwen-vl-max-latest",
      messages: [
        {
          role: "system",
          content: [{ type: "text", text: "你是一个专业的书法图片分析助手，请对比这两幅作品，并给出一个相似度评分，最低0，最高100。" }]
        },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: systemImageBase64 } },
            { type: "image_url", image_url: { url: userImageBase64 } },
            { type: "text", text: "请从笔画、结构、风格三方面分析相似度..." }
          ]
        }
      ],
      max_tokens: 3000
    })

    return { 
      success: true, 
      result: response.choices[0].message.content 
    }

  } catch (error) {
    console.error('云函数执行失败:', error)
    return { 
      success: false, 
      error: error.message 
    }
  }
}