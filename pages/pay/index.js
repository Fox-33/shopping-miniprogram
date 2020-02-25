// pages/pay/index.js
// 支付页面

import { request, authorize, getUserInfo, login } from "../../request/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {},
    goods: [],
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let addressInfo = wx.getStorageSync('addressInfo');
    let goods = wx.getStorageSync('cart')
                .filter(good => {
                  return good.checked == true
                })
    let totalPrice = 0
    let totalNum = 0
    goods.forEach(good => {
      totalPrice += good.goods_price * good.num
      totalNum += good.num
    });
    this.setData({
      addressInfo,
      goods,
      totalPrice,
      totalNum
    })
  },

  /**
  * 处理点击 支付 事件
  *  0. 获取用户token  => 获取 token
  *        <= 请求参数：{encryptedData, rawData, iv, signature, code}
  *              => 1. {encryptedData, rawData, iv, signature} 
  *                      <= 执行小程序获取用户信息得到 wx.getUserInfo
  *                 2. {code}
  *                      <= 执行小程序登录后获取 wx.
  *  1. 创建订单 => 获取订单编号 order_number
  *        <= 1. 请求头参数：{Authorization: token}
  *           2. 请求体参数: {
  *                            order_price: totalPrice,   //订单总价格
  *                            consignee_addr: addressInfo,    //收货地址
  *                            goods     //订单数组        
  *                         }
  *                              <= item in goods:  { goods_id,    //商品id
  *                                                   goods_number,    //购买的数量
  *                                                   goods_price    //单价
  *                                                 }                          
  *  2. 获取支付参数 => 获取 pay 
  *        <= 1. 请求头参数：{Authorization: token}
  *           2. 请求体参数: {order_number: order_number}
  *  3. 发起微信支付 => wx.requestPayment
  */
  handlePayTap: async function (e) {
    // 0. 获取用户token
    //     => 判断缓存中是否有token
    //         => 1. 有 => 直接使用
    //            2. 没有 => 获取用户 token 并存入缓存中
    let token = wx.getStorageSync('token');
    if(!token){
      await authorize("scope.userInfo")
      let {encryptedData, rawData, iv, signature} = await getUserInfo()
      let {code} = await login()
      let queryData = {
        encryptedData,
        rawData,
        iv,
        signature,
        code
      }
      let res = await request({ url: "/users/wxlogin", data: queryData, method:'POST'	})
      token = res.token
      wx.setStorageSync('token', token);
    }
    // 1. 创建订单 获取订单编号 order_number
    let goods = this.data.goods.map(val => {
      let good = {
        goods_id: val.goods_id,
        goods_number: val.num,
        goods_price: val.goods_price
      }
      return good
    })
    queryData = {
      order_price: this.data.totalPrice,
      consignee_addr: this.data.addressInfo,
      goods
    }
    let queryHeader = {Authorization: token}
    let {order_number} = await request({ url: "/my/orders/create", data: queryData, header: queryHeader, method:'POST' })
    // 2. 获取支付参数 pay
    queryData = {order_number}
    let {pay} = await request({ url: "/my/orders/req_unifiedorder", data: queryData, header: queryHeader, method:'POST' })
    // 3. 发起微信支付请求
    await requestPayment(pay)
    // 4. 查询订单支付状态
    let res = await request({ url: "/my/orders/chkOrder", data: queryData, header: queryHeader, method:'POST' })
    wx.showToast({
      title: res,
      mask: true
    });
      
  }
})
