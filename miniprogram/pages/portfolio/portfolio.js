Page({
  data: {
    imageList: []
  },

  onLoad() {
    const userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.showToast({ title: "请先登录", icon: "none" });
      wx.redirectTo({ url: "/pages/login/login" });
      return;
    }

    console.log("当前用户 OpenID:", userInfo.openid);
    this.fetchUserImages(userInfo.openid);
  },

  // 获取当前用户上传的图片
  fetchUserImages(openid) {
    wx.cloud.database().collection("fonts")
      .where({ _openid: openid }) // 🚀 这里用 uploadUser
      .get({
        success: res => {
          console.log("查询到的数据：", res.data);

          if (res.data.length === 0) {
            wx.showToast({ title: "没有作品记录", icon: "none" });
          }

          const imageList = res.data.map(item => ({
            id: item._id,
            url: item.url // 直接使用云存储的 URL
          }));
          this.setData({ imageList });
        },
        fail: err => {
          console.error("获取作品失败", err);
          wx.showToast({ title: "获取作品失败", icon: "none" });
        }
      });
  },

  // 查看详情 -> 跳转到 detail 页面
  viewDetail(e) {
    const { id, url } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?imageId=${id}&url=${encodeURIComponent(url)}`
    });
  }
});
