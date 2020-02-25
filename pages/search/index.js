// pages/search/index.js
// 搜索页面

import { request } from "../../request/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchResult: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  handleInput: function (e) {
    let {value: query} = e.detail
    request({ url: "/goods/qsearch" , data: {query}})
      .then(res => {
        this.setData({
          searchResult: res
        })
      })
  }
})