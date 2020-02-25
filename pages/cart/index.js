// pages/cart/index.js
// 购物车

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
    addressInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   * 0. 获取收货地址 addressInfo
   *      => 1. 有收货地址 
   *              => 显示收货地址
   *         2. 没有收货地址
   *              => 显示添加收货地址按钮
   * 1. 获取购物车列表 cart
   * 2. 计算已勾选的 商品总价totalPrice 和 商品总数totalNum
   * 3. 判断是否全选 allChecked = ?
   */
  onLoad: function () {
    let addressInfo = wx.getStorageSync('addressInfo');
    let cart = wx.getStorageSync('cart');
    let totalPrice = 0
    let totalNum = 0
    let allChecked = true
    cart.forEach(good => {
      if(good.checked == true){
        totalPrice += good.goods_price * good.num
        totalNum += good.num
      }else{
        allChecked = false
      }
    });
    this.setData({
      addressInfo,
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
  },

  /**
   * 处理购物车列表 勾选(/取消勾选) 商品的事件
   *  0. 获取当前商品 <= 由index从cart中获取
   *  1. 判断商品的 checked 属性
   *      => 1. checked = true 
   *              => 商品已勾选
   *                => 执行取消勾选操作
   *                    => 1. 设置当前商品的 checked = false
   *                       2. 重新计算 商品总价totalPrice 和 商品总数totalNum
   *                       3. allChecked = false
   *                       4. 将 cart 存入缓存
   *      => 2. checked = false
   *              => 商品未勾选
   *                => 执行勾选操作
   *                    => 1. 设置当前商品的 checked = true 
   *                       2. 重新计算 商品总价totalPrice 和 商品总数totalNum
   *                       3. 判断是否全选 allChecked = ?
   *                       4. 将 cart 存入缓存
   * @param {*} e 
   */
  handleRadioChange: function (e) {
    let {index} = e.currentTarget.dataset
    let cart = this.data.cart
    let {checked} = cart[index]
    let totalPrice = 0
    let totalNum = 0
    let allChecked = true
    if(checked){
      cart[index].checked =false
      allChecked = false
      cart.forEach(good => {
        if(good.checked == true){
          totalPrice += good.goods_price * good.num
          totalNum += good.num
        }
      });
    }else{
      cart[index].checked = true
      cart.forEach(good => {
        if(good.checked == true){
          totalPrice += good.goods_price * good.num
          totalNum += good.num
        }else{
          allChecked = false
        }
      });
    }
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync('cart', cart);
  },

  /**
   * 处理购物车列表点击 全选 商品的事件
   *  0. 判断是 全选 还是 取消全选 
   *      => 判断 allChecked
   *          => allChecked = false => 未全选
   *              => 执行全选操作
   *                  => 0. 设置 allChecked = true
   *                  => 1. 设置所有商品的 checked = true
   *                  => 2. 重新计算 商品总价totalPrice 和 商品总数totalNum
   *                  => 3. 将 cart 存入缓存
   *          => allChecked = true => 已全选
   *              => 执行取消全选操作
   *                  => 0. 设置 allChecked = false
   *                  => 1. 设置所有商品的 checked = false
   *                  => 2. 设置 商品总价totalPrice = 0 和 商品总数totalNum = 0
   *                  => 3. 将 cart 存入缓存
   */
  handleAllRadioChange: function () {
    let allChecked = this.data.allChecked
    let cart = this.data.cart
    let totalPrice = 0
    let totalNum = 0
    allChecked = !allChecked
    if(allChecked){
      cart.forEach(good => {
        good.checked = true
        totalPrice += good.goods_price * good.num
        totalNum += good.num
      })
    }else{
      cart.forEach(good => {
        good.checked = false
      })
    }
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync('cart', cart);
  },

  /**
   * 获取收货地址
   *  0. 查看是否授权 scope.address = ?
   *      1. 未授权 => scope.address = undefined
   *          => 直接调用获取地址接口
   *          => 将地址存入 data 及 缓存 中
   *      2. 已授权 => scope.address = true
   *          => 直接调用获取地址接口
   *          => 将地址存入 data 及 缓存 中
   *      3. 取消授权 => scope.adddress = false
   *          => 1. 获取用户授权
   *          => 2. 调用获取地址接口
   *          => 将地址存入 data 及 缓存 中
   */
  getAddress: function () {
    console.log("获取收货地址")
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']==false) {
          wx.openSetting({
            success (res) {
              res.authSetting = {
                "scope.address": true,
              }
              wx.chooseAddress({
                success: (res) => {
                  console.log(res)
                  let {userName, telNumber, provinceName, cityName, countyName, detailInfo} = res
                  let addressInfo = {
                    userName,
                    telNumber,
                    address: provinceName+cityName+countyName+detailInfo
                  }
                  that.setData({
                    addressInfo
                  })
                  wx.setStorageSync('addressInfo', addressInfo);
                },
                fail: () => {},
                complete: () => {}
              });
            }
          })
        }else{
          wx.chooseAddress({
            success: (res) => {
              let {userName, telNumber, provinceName, cityName, countyName, detailInfo} = res
              let addressInfo = {
                userName,
                telNumber,
                address: provinceName+cityName+countyName+detailInfo
              }
              that.setData({
                addressInfo
              })
              wx.setStorageSync('addressInfo', addressInfo);
            },
            fail: () => {},
            complete: () => {}
          });
        }
      }
    })      
  },

  /**
   * 处理点击 支付 事件
   *  0. 判断是否有收货地址
   *      1. 没有 => 提示信息
   *      2. 有 => 执行下一步
   *  1. 判断是否有勾选的商品
   *      1. 没有 => 提示信息
   *      2. 有 => 执行下一步
   *  2. 跳转至支付页面
   */
  handlePayTap: function () {
    // 0. 判断是否有收货地址
    if(!this.data.addressInfo.userName){
      wx.showToast({
        title: '未添加收货地址',
        icon: 'none',
        image: '../../icon/warning.png',
        mask: true,
      });
      return
    }
    // 1. 判断是否有勾选的商品
    let checklist = this.data.cart.map(v => v.checked)
    let hasGood = checklist.some(ischecked => {
      return ischecked==true
    })
    if(!hasGood){
      wx.showToast({
        title: '未选择商品',
        icon: 'none',
        image: '../../icon/warning.png',
        mask: true,
      });
      return
    }
    // 2. 跳转至支付页面
    wx.navigateTo({
      url: '../pay/index'
    });
  }
})