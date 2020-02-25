// pages/goods_list/index.js
// 商品列表

import { request } from "../../request/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: []
  },

  queryInfo: {
      query: '',
      pagenum: 1,
      pagesize: 10
  },

  total: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {cid} = options
    this.queryInfo.cid = cid
    this.getGoodsList()
  },

  /**
   * 获取商品列表
   * => item in goodsList : {
   *                          goods_id,
   *                          goods_name,
   *                          goods_price,
   *                          goods_small_logo
   *                        }
   */
  getGoodsList: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    request({ url: "/goods/search", data: this.queryInfo })
      .then(res => {
        this.total = res.total
        let goodsList = res.goods.map(item => {
          return {
            goods_id: item.goods_id,
            goods_name: item.goods_name,
            goods_price: item.goods_price,
            goods_small_logo: item.goods_small_logo
          }
        })
        this.setData({
            goodsList: [...this.data.goodsList, ...goodsList]
          }, () => {
            wx.hideLoading();
          })
      })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 0. 重置商品列表 => goodsList = [] 
   * 1. 重置商品页面 => pagenum = 1
   * 2. 获取商品列表
   */
  onPullDownRefresh: function () {
    this.queryInfo.pagenum = 1
    this.setData({
      goodsList: []
    }, () => {
      this.getGoodsList()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   * 0. 判断是否有下一页
   *      => 比较 当前页数pagenum 和 总页数totalpage
   *                                => 总页数 = 总商品数 / 页面显示的商品数 (向上取整)
   *                                => totalpage = total / pagesize
   * 1. 如果有下一页 <= pagenum < totalpage 
   *      => pagenum++ 
   *      => 请求新页面的goodslist
   *      => 合并goodslist
   * 2. 没有下一页   <= pagenum >= totalpage
   *      => 提示已经到底
   */
  onReachBottom: function () {
    let totalpage = Math.ceil(this.total / this.queryInfo.pagesize)
    if(this.queryInfo.pagenum < totalpage){
      this.queryInfo.pagenum++;
      this.getGoodsList()
    }else{
      wx.showToast({
        title: '已经到底了',
        mask: true
      });
        
    }
  },

})