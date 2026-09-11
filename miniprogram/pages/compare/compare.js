Page({
  data: {
    systemImageUrl: '', // 从 masterdisplay.js 传入的原始URL
    userImagePath: '',  // 用户选择的临时路径
    loading: false,
    result: ''
  },

  onLoad(options) {
    console.log("跳转参数：", options);

    this.setData({
      systemImageUrl: decodeURIComponent(options.systemImageUrl),
      systemImageId: decodeURIComponent(options.systemImageId)
    });
  },

  // 用户选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: res => {
        this.setData({ 
          userImagePath: res.tempFiles[0].tempFilePath,
          result: '' 
        });
        this.uploadUserImage(); // 上传到云存储
      }
    });
  },

  // 上传用户图片到云存储
  uploadUserImage() {
    this.setData({ loading: true });
    wx.showLoading({ title: '上传中...' });

    const cloudPath = `compare/${Date.now()}.jpg`;
    wx.cloud.uploadFile({
      cloudPath,
      filePath: this.data.userImagePath,
      success: res => {
        this.callCompareFunction(res.fileID); // 调用云函数
      },
      fail: () => {
        this.setData({ loading: false });
        wx.hideLoading();
      }
    });
  },

  // 调用云函数进行对比
  callCompareFunction(userFileID) {
    wx.cloud.callFunction({
      name: 'calligraphyCompare',
      data: {
        systemImageId: this.data.systemImageId, // 原作品的云存储ID
        userFileID: userFileID // 用户图片的云存储ID
      },
      success: res => {
        this.setData({ 
          result: res.result?.result || '分析完成',
          loading: false 
        });
        wx.hideLoading();
      },
      fail: err => {
        this.setData({ 
          result: `分析失败: ${err.errMsg}`,
          loading: false 
        });
        wx.hideLoading();
      }
    });
  }
});