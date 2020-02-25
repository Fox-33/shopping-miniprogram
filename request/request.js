export const request = (params) => {
  const basedUrl = "https://api.zbztb.cn/api/public/v1"
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url : basedUrl + params.url,
      success: (res) => {
        resolve(res.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete: (res) => {},
    })
  })
}

export const authorize = (params) => {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: params,
      success (res) {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      complete: (res) => {},
    })
  })
}

export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success (res) {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      complete: (res) => {},
    })
  })
}

export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success (res) {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      complete: (res) => {},
    })
  })
}

export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: pay.timeStamp,
      nonceStr: pay.nonceStr,
      package: pay.package,
      signType: pay.signType,
      paySign: pay.paySign,
      success (res) {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      complete: (res) => {},
    })
  })
}