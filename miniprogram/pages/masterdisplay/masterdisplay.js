Page({
  data: {
    author: "",
    imageList: [],
    page: 0,
    pageSize: 10,
    hasMore: true
  },

  onLoad(options) {
    if (options.author) {
      this.setData({ author: decodeURIComponent(options.author) });
      this.loadArtworks();
    }
  },

  loadArtworks() {
    if (!this.data.hasMore) return;

    wx.showLoading({ title: "加载中..." });

    const db = wx.cloud.database();
    db.collection("artworks")
      .where({ author: this.data.author })
      .orderBy("uploadTime", "desc")
      .skip(this.data.page * this.data.pageSize)
      .limit(this.data.pageSize)
      .get({
        success: res => {
          console.log("获取到的作品数据:", res.data);

          const newImages = res.data.map(item => ({
            id: item.url,
            displayUrl: item.url // 用于展示的URL
          }));

          this.setData({
            imageList: [...this.data.imageList, ...newImages],
            page: this.data.page + 1,
            hasMore: res.data.length === this.data.pageSize
          });
          wx.hideLoading();
        },
        fail: err => {
          console.error("获取作品失败", err);
          wx.hideLoading();
          wx.showToast({ title: "加载失败", icon: "none" });
        }
      });
  },

  handleImageTap(e) {
    const { id, displayUrl } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/compare/compare?systemImageId=${encodeURIComponent(id)}&systemImageUrl=${encodeURIComponent(displayUrl)}`
    });
  },

  onReachBottom() {
    this.loadArtworks();
  }
});