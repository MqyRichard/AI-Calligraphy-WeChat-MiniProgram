// evaluate.js
Page({
  data: {
    imageUrl: '',
    loading: false,
    result: ''
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({ 
          imageUrl: tempFilePath,
          result: '' // 清空旧结果
        })
        this.uploadImage(tempFilePath)
      }
    })
  },

  uploadImage(filePath) {
    this.setData({ loading: true })
    wx.showLoading({ title: '上传中...' })

    const cloudPath = `evaluate/${Date.now()}.jpg`
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        this.callAnalysisFunction(res.fileID)
      },
      fail: () => {
        this.setData({ loading: false })
        wx.hideLoading()
      }
    })
  },

  callAnalysisFunction(fileID) {
    wx.cloud.callFunction({
      name: 'aliImageAnalysis',
      data: { fileID },
      success: res => {
        console.log('API原始响应:', res)
        
        // 深度提取结果
        const rawResult = res.result?.result || res.result
        const displayText = typeof rawResult === 'string' 
          ? rawResult 
          : (rawResult?.content || JSON.stringify(rawResult, null, 2))

        this.setData({ 
          result: displayText,
          loading: false 
        }, () => {
          console.log('当前页面数据:', this.data)
          wx.hideLoading()
        })
      },
      fail: err => {
        this.setData({ 
          result: `分析失败: ${err.errMsg || '未知错误'}`,
          loading: false 
        })
        wx.hideLoading()
      }
    })
  }
})