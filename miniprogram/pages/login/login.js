Page({
  data: {},

  onLoad() {
    // 页面加载时检查是否已登录
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      console.log("已登录用户：", userInfo);
      wx.switchTab({ url: "/pages/index/index" });
    }
  },

  // 获取用户信息并存入数据库
  login() {
    wx.getUserProfile({
      desc: "获取用户信息",
      success: profileRes => {
        console.log("用户信息", profileRes);
        const userInfo = profileRes.userInfo; // 获取用户信息
        
        wx.cloud.callFunction({
          name: "login",
          success: res => {
            const openid = res.result.openid;
            this.saveUserInfo(openid, userInfo);
          }
        });
      },
      fail: err => {
        console.error("用户拒绝授权", err);
      }
    });    
  },

  // 存入数据库并缓存用户信息
  saveUserInfo(openid, userInfo) {
    const db = wx.cloud.database();

    db.collection("users").where({ openid }).get({
      success: queryRes => {
        if (queryRes.data.length === 0) {
          // 用户不存在，存入数据库
          db.collection("users").add({
            data: {
              openid: openid,
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl,
              createTime: new Date()
            },
            success: addRes => {
              console.log("用户信息存储成功", addRes);
              wx.setStorageSync("userInfo", { openid, ...userInfo }); // ✅ 存入本地缓存
              wx.showToast({ title: "登录成功", icon: "success" });

              // 跳转到首页
              wx.switchTab({ url: "/pages/index/index" });
            },
            fail: err => console.error("存储用户信息失败", err)
          });
        } else {
          console.log("用户已存在", queryRes.data);
          wx.setStorageSync("userInfo", { openid, ...queryRes.data[0] }); // ✅ 也存本地缓存
          wx.switchTab({ url: "/pages/index/index" });
        }
      },
      fail: err => console.error("查询用户失败", err)
    });
  }
});
