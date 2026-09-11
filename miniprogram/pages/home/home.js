Page({
  data: {
    userInfo: {} // 存储用户信息
  },

  onLoad() {
    const userInfo = wx.getStorageSync("userInfo") || {}; // 取缓存，避免 null
    this.setData({ userInfo });
  },

  // 跳转到作品集
  goToPortfolio() {
    if (!this.data.userInfo.openid) {
      wx.showToast({ title: "请先登录", icon: "none" });
      return;
    }
    wx.navigateTo({ url: "/pages/portfolio/portfolio" });
  },

  // 让用户登录
  login() {
    wx.getUserProfile({
      desc: "获取用户信息",
      success: profileRes => {
        console.log("用户信息", profileRes);
        const userInfo = profileRes.userInfo;

        wx.cloud.callFunction({
          name: "login",
          success: res => {
            userInfo.openid = res.result.openid;
            wx.setStorageSync("userInfo", userInfo);
            this.setData({ userInfo });
            wx.showToast({ title: "登录成功", icon: "success" });
          }
        });
      },
      fail: err => console.error("用户拒绝授权", err)
    });
  }
});
