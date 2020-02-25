// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let collect = wx.getStorageSync('collect');
    this.setData({
      collect
    })
  },

})