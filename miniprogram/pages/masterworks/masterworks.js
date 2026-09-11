Page({
  data: {
    authorList: []
  },

  onLoad() {
    wx.showLoading({ title: "加载中..." });

    // 手动赋值作者列表
    const authorList = [
      { name: "王羲之", imageUrl: "cloud://cloud1-3g8k0qpw6d5d7fbf.636c-cloud1-3g8k0qpw6d5d7fbf-1350468256/author/wangxizhi.jpg" },
      { name: "颜真卿", imageUrl: "cloud://cloud1-3g8k0qpw6d5d7fbf.636c-cloud1-3g8k0qpw6d5d7fbf-1350468256/author/yanzhenqin.jpg" },
      { name: "欧阳询", imageUrl: "cloud://cloud1-3g8k0qpw6d5d7fbf.636c-cloud1-3g8k0qpw6d5d7fbf-1350468256/author/ouyangxun.jpg" },
      { name: "赵孟頫", imageUrl: "cloud://cloud1-3g8k0qpw6d5d7fbf.636c-cloud1-3g8k0qpw6d5d7fbf-1350468256/author/zhaomengfu.jpg" },
      { name: "苏轼", imageUrl: "cloud://cloud1-3g8k0qpw6d5d7fbf.636c-cloud1-3g8k0qpw6d5d7fbf-1350468256/author/sushi.jpg" },
      { name: "柳公权", imageUrl: "cloud://cloud1-3g8k0qpw6d5d7fbf.636c-cloud1-3g8k0qpw6d5d7fbf-1350468256/author/liugongquan.jpg" },
      { name: "董其昌", imageUrl: "cloud://cloud1-3g8k0qpw6d5d7fbf.636c-cloud1-3g8k0qpw6d5d7fbf-1350468256/author/dongqichang.jpg" }
    ];

    this.setData({ authorList });
    wx.hideLoading();
  },

  // 选择作者并跳转到 masterdisplay 页面
  selectAuthor(event) {
    const author = event.currentTarget.dataset.author;
    console.log("选中的作者：", author);

    wx.navigateTo({
      url: `/pages/masterdisplay/masterdisplay?author=${encodeURIComponent(author)}`
    });
  }
});
