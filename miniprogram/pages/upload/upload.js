Page({
  data: {
    imageUrl: "",
    userInfo: {}
  },

  onLoad() {
    // 从本地缓存获取用户信息
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      console.log("用户已登录：", userInfo);
      this.setData({ userInfo });
    } else {
      wx.showToast({ title: "请先登录", icon: "none" });
      setTimeout(() => {
        wx.switchTab({ url: "/pages/index/index" }); // 跳转到首页
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

    const cloudPath = `calligraphy/${Date.now()}-${Math.random().toString(36).slice(-6)}.png`;

    try {
      // 上传到云存储
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath,
        filePath: this.data.imageUrl
      });

      console.log("上传成功：", uploadRes.fileID);

      // 存储到数据库 `fonts`
      const db = wx.cloud.database();
      await db.collection("fonts").add({
        data: {
          url: uploadRes.fileID,
          uploadTime: new Date(),
          uploader: this.data.userInfo.nickName, // 记录上传者
          uploaderAvatar: this.data.userInfo.avatarUrl // 记录上传者头像
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
