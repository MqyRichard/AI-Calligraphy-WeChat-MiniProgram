Page({
  goToDisplay() {
    wx.navigateTo({
      url: '/pages/display/display'
    });
  },
  goToUpload() {
    wx.navigateTo({
      url: '/pages/upload/upload'
    });
  },
  goToSelectAuthor() {
    wx.navigateTo({
      url: '/pages/selectauthor/selectauthor',
    });
  }
});
