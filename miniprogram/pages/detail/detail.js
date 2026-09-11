Page({
  data: {
    imageUrl: '',
    imageId: '',
    rating: 0,
    commentText: '',
    comments: []
  },

  onLoad(options) {
    this.setData({
      imageUrl: decodeURIComponent(options.url),
      imageId: options.imageId
    });
    this.loadComments();
  },

  setRating(event) {
    this.setData({
      rating: event.currentTarget.dataset.value
    });
  },

  onCommentInput(event) {
    this.setData({
      commentText: event.detail.value
    });
  },

  submitComment() {
    const { imageId, rating, commentText } = this.data;
    if (!commentText.trim()) {
      wx.showToast({ title: '评论不能为空', icon: 'none' });
      return;
    }
    wx.cloud.database().collection('comments').add({
      data: {
        imageId: imageId,
        username: '微信用户',
        avatarUrl: '/images/avatar.png',
        rating: rating,
        text: commentText,
        timestamp: new Date()
      },
      success: res => {
        wx.showToast({ title: '评论成功', icon: 'success' });
        this.setData({ commentText: '', rating: 0 });
        this.loadComments();
      },
      fail: err => {
        console.error('评论失败', err);
      }
    });
  },

  loadComments() {
    wx.cloud.database().collection('comments')
      .where({ imageId: this.data.imageId })
      .orderBy('timestamp', 'desc')
      .get({
        success: res => {
          this.setData({ comments: res.data });
        },
        fail: err => {
          console.error('加载评论失败', err);
        }
      });
  }
});
