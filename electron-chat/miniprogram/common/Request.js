const nodeApi = 'https://localhost:3000/';

class Request {
  request(url, params, header, method = 'POST', customUrl = false) {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    if (!customUrl) {
      url = nodeApi + url;
    }
    if (method.toUpperCase() === 'POST') {
      header = {
        ...header,
        ...{
          'content-type': 'application/x-www-form-urlencoded'
        }
      }
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: params,
        header: header,
        method: method.toUpperCase(),
        success(res) {
		  wx.hideLoading();
          res = res.data;
          if (res.code == 200) {
            resolve(res);
          } else {
            reject();
            wx.showToast({
              title: res.msg,
              icon: 'none',
              mask: true,
              duration: 2000
            });
          }
        },
        fail(error) {
          reject();
          wx.hideLoading();
          console.log(error);
          wx.showToast({
            title: '系统忙，请稍候再试',
            icon: 'none',
            mask: true,
            duration: 2000
          });
        }
      });
    }).catch((e) => {
       wx.hideLoading();
    });
  }
}

export default Request;