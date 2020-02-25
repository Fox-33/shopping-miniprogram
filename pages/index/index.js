//index.js
// 首页

import { request } from "../../request/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperData: [],
    catItems: [],
    floorData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取轮播图数据
    this.getSwiperData()
    // 获取⾸⻚分类菜单数据
    this.getCatItems()
    // 获取⾸⻚楼层数据
    this.getFloorData()
    // 购物车本地缓存
    wx.setStorageSync('cart', []);
    // 收藏夹本地缓存
    wx.setStorageSync('collect', []);
  },
  
  /**
   * 获取轮播图数据
   */
  getSwiperData: function () {
    request({ url: "/home/swiperdata" })
      .then(res => {
        this.setData({
          swiperData: res
        })
      })
  },
  
  /**
   * 获取⾸⻚分类菜单数据
   */
  getCatItems: async function () {
    request({ url: "/home/catitems" })
      .then(res => {
        this.setData({
          catItems: res
        })
      })
  },
  /**
   * 获取⾸⻚楼层数据
   */
  getFloorData: async function () {
    request({ url: "/home/floordata" })
      .then(res => {
        this.setData({
          floorData: res
        })
      })
  },

})
