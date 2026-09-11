Page({
  data: {
    imageUrl: "",
    userInfo: {},
    author: ""
  },

  onLoad(options) {
    console.log("收到的参数：", options);
    if (options.author) {
      this.setData({ author: decodeURIComponent(options.author) });
    }

    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({ userInfo });
    } else {
      wx.showToast({ title: "请先登录", icon: "none" });
      setTimeout(() => {
        wx.switchTab({ url: "/pages/index/index" });
      }, 1500);
    }
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        this.setData({ imageUrl: res.tempFiles[0].tempFilePath });
      }
    });
  },

  async uploadToCloud() {
    if (!this.data.imageUrl) {
      wx.showToast({ title: "请先选择图片", icon: "none" });
      return;
    }

    wx.showLoading({ title: "上传中..." });

    const cloudPath = `artworks/${Date.now()}-${Math.random().toString(36).slice(-6)}.png`;

    try {
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath,
        filePath: this.data.imageUrl
      });

      console.log("上传成功：", uploadRes.fileID);

      const db = wx.cloud.database();
      await db.collection("artworks").add({
        data: {
          url: uploadRes.fileID,
          uploadTime: new Date(),
          uploader: this.data.userInfo.nickName,
          uploaderAvatar: this.data.userInfo.avatarUrl,
          author: this.data.author // 存储作者信息
        }
      });

      wx.hideLoading();
      wx.showToast({ title: "上传成功", icon: "success" });

      this.setData({ imageUrl: "" });

    } catch (err) {
      console.error("上传失败：", err);
      wx.hideLoading();
      wx.showToast({ title: "上传失败", icon: "none" });
    }
  }
});
