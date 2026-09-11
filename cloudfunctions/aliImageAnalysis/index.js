const cloud = require('wx-server-sdk')
const prompts = require('./calligraphyPrompts')
cloud.init()

const { OpenAI } = require('openai')
const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
})

exports.main = async (event, context) => {
  try {
    // 1. 获取云存储文件的临时URL（有效期4小时）
    const fileID = event.fileID
    const fileUrl = await cloud.getTempFileURL({
      fileList: [fileID]
    })
    const imageUrl = fileUrl.fileList[0].tempFileURL

    // 2. 直接使用URL调用API
    const response = await openai.chat.completions.create({
      model: "qwen-vl-max-latest",
      messages: [
        {
          role: "system",
          content: [{
            type: "text",
            text: "你是一个专业的书法图片分析助手，请提供详细分析。"
          }]
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl // 直接使用临时URL
              }
            },
            {
              type: "text",
              text: `${prompts.mainPrompt}\n\n参考案例：${JSON.stringify(prompts.examples)}`
            }
          ]
        }
      ],
      max_tokens: 2000
    })

    // 3. 返回结果
    return {
      success: true,
      result: response.choices[0].message.content
    }

  } catch (error) {
    console.error('云函数错误:', error)
    return {
      success: false,
      error: error.message
    }
  }
}