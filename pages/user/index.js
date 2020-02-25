// pages/user/index.js

import { request, authorize, getUserInfo, login } from "../../request/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    collectNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser()
  },
  
  getUser: async function () {
    // 0. 获取用户信息
    await authorize("scope.userInfo")
    let {userInfo, encryptedData, rawData, iv, signature} = await getUserInfo()
    userInfo = {
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl
    }
    // 1. 获取用户收藏的商品数
    let collectNum = wx.getStorageSync('collect').length;
    this.setData({
      userInfo,
      collectNum
    })
  }

})