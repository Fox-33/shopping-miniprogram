// pages/goods_detail/index.js
// 商品页面

import { request } from "../../request/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodDetail: {},
    isCollect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {goodsid} = options
    this.getGoodDetail(goodsid)
    let collect = wx.getStorageSync('collect');
    let index = collect.findIndex(val => {
      return val.goods_id == goodsid
    })
    if(index !== -1){
      this.setData({
        isCollect: true
      })
    }
  },

  /**
   * 获取商品详情
   * goodDetail: {
   *                goods_id
   *                goods_small_logo
   *                pics,
   *                goods_price,
   *                goods_name,
   *                goods_introduce
   *             }
   */
  getGoodDetail: function (goodsid) {
    request({ url: "/goods/detail", data: {goods_id: goodsid} })
      .then(res => {
        let {goods_id, goods_small_logo, pics, goods_price, goods_name, goods_introduce} = res
        this.setData({
          goodDetail: {
            goods_id,
            goods_small_logo,
            pics,
            goods_price,
            goods_name,
            goods_introduce
          }
        })
      })
  },

  /**
   * 处理轮播图点击事件 => 预览大图
   * @param {*} e 
   */
  handleTapPic: function (e) {
    let urls = this.data.goodDetail.pics.map(v => v.pics_big)
    let {index} = e.currentTarget.dataset
    wx.previewImage({
      current: urls[index],
      urls,
    });
  },

  /**
   * 处理点击 收藏按钮 事件 
   *  0. 获取本地缓存 collect
   *  1. 判断缓存 collect 中是否存在当前商品 
   *      1. isCollect = true => 已收藏 
   *          => 作取消收藏处理
   *              => 1. isCollect = false
   *              => 2. collect 中删除该商品
   *              => 3. 将 collect 存入缓存中 
   *      2. isCollect = false => 未收藏
   *          => 作收藏处理
   *              => 1. isCollect = true
   *              => 2. collect 中添加该商品
   *              => 3. 将 collect 存入缓存中
   */
  handleTapCollect: function () {
    let {goods_id, goods_small_logo, goods_price, goods_name} = this.data.goodDetail
    let collect = wx.getStorageSync('collect');
    if(this.data.isCollect){
      this.setData({
        isCollect: false
      }, () => {
        wx.showToast({
          title: '取消收藏',
          icon: 'none',
          image: '../../icon/warning.png',
          mask: true
        });
      })
      let index = collect.findIndex(val => {
        return val.goods_id == goods_id
      })
      collect.splice(index, 1)
    }else{
      this.setData({
        isCollect: true
      }, () => {
        wx.showToast({
          title: '已收藏',
          mask: true
        });
      })
      let good = {
        goods_id,
        goods_small_logo,
        goods_price,
        goods_name
      }
      collect = [...collect, good]
    }
    wx.setStorageSync('collect', collect);
  },

  /**
   * 处理点击 加入购物车 事件
   *  0. 获取本地缓存 cart
   *  1. 判断缓存 cart 中是否存在当前商品
   *      => item of cart 中是否存在 当前goods_id
   *          => 1. 存在 
   *                  => 1. 添加购物车中该商品的数量
   *                          => cart 中 当前商品 num++
   *                  => 2. 将 cart 存入缓存中
   *          => 2. 不存在
   *                  => 1. 向购物车添加该商品 并添加数量属性 及 选择属性
   *                          => goodDetail.num = 1
   *                          => goodDetail.checked = false
   *                          => cart add goodDetail
   *                  => 2. 将 cart 存入缓存中
   */
  handleTapCart: function () {
    let cart = wx.getStorageSync('cart');
    let index = cart.findIndex(val => {
      return val.goods_id == this.data.goodDetail.goods_id
    })
    if(index == -1){
      let {goods_id, goods_small_logo, goods_price, goods_name} = this.data.goodDetail
      let good = {
        goods_id,
        goods_small_logo,
        goods_price,
        goods_name,
        num: 1,
        checked: false
      }
      cart = [...cart, good]
    }else{
      cart[index].num++
    }
    wx.showToast({
      title: '加入购物车成功',
      mask: true
    });
    wx.setStorageSync('cart', cart);
  }
})