Page({
  data: {
    images: [],
    leftColumn: [],
    rightColumn: [],
    page: 1,
    pageSize: 10,
    totalPages: 1
  },

  onLoad() {
    this.loadTotalPages();
    this.loadImages();
  },

  loadTotalPages() {
    wx.cloud.database().collection("fonts").count({
      success: res => {
        this.setData({ totalPages: Math.ceil(res.total / this.data.pageSize) });
      },
      fail: err => {
        console.error("获取总页数失败", err);
      }
    });
  },

  loadImages() {
    const { page, pageSize } = this.data;
    wx.cloud.database().collection("fonts")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get({
        success: res => {
          const images = res.data.map(item => ({
            id: item._id,
            url: item.url
          }));

          let leftColumn = [];
          let rightColumn = [];
          images.forEach((img, index) => {
            if (index % 2 === 0) {
              leftColumn.push(img);
            } else {
              rightColumn.push(img);
            }
          });

          this.setData({ images, leftColumn, rightColumn });
        },
        fail: err => {
          console.error("加载图片失败", err);
        }
      });
  },

  goToDetail(event) {
    const { id, url } = event.currentTarget.dataset;
    console.log("跳转传递的图片 URL：", url);
    wx.navigateTo({
      url: `/pages/detail/detail?imageId=${id}&url=${encodeURIComponent(url)}`
    });
  },

  prevPage() {
    if (this.data.page > 1) {
      this.setData({ page: this.data.page - 1 }, this.loadImages);
    }
  },

  nextPage() {
    if (this.data.page < this.data.totalPages) {
      this.setData({ page: this.data.page + 1 }, this.loadImages);
    }
  },

  goToFirstPage() {
    this.setData({ page: 1 }, this.loadImages);
  },

  goToLastPage() {
    this.setData({ page: this.data.totalPages }, this.loadImages);
  }
});