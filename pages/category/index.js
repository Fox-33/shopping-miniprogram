// pages/category/index.js
// 分类页面

import { request } from "../../request/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左边菜单列表
    leftMenu: [],
    // 激活的index => 选中的菜单选项
    activeIndex: 0,
    // 右边对应内容
    rightContent: [],
    // 右边滚动条位置
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getCategoriesData()
  },

  /**
   * 获取分类⻚⾯数据
   */
  getCategoriesData: function () {
    request({ url: "/categories" })
      .then(res => {
        // 获取左边菜单列表
        let leftMenu = res.map(item => item.cat_name)
        // 获取右边对应内容
        let rightContent = res[this.data.activeIndex].children
        // 将数据存入本地data中
        this.setData({
          leftMenu,
          rightContent
        })
        // 将数据存入缓存中
        wx.setStorageSync('cat', res);
      })
  },

  /**
   * 处理右边列表点击事件 => 切换菜单选项 
      => 1. 改变 activeIndex
         2. 改变右边对应内容
         3. 重置滚动条的位置至顶部 => scrollTop = 0
   * @param {*} e 
   */
  handleTap: function (e) {
    let {index: activeIndex} = e.currentTarget.dataset
    let cat = wx.getStorageSync('cat');
    let rightContent = cat[activeIndex].children 
    this.setData({
      activeIndex,
      rightContent,
      scrollTop: 0
    })
  }
})