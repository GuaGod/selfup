/**
 * @class Http 请求类，将微信小程序的request请求封装成一个promise，其他对象继承Http
 */
class MyHttp {
  /**
   * @method request    发送一个http请求
   * @for Http
   * @param {Object} req 请求对象，包括url，data，回调函数
   * @return {Void}
   */
  request(req) {
    return MyHttp.request(req);
  }

  static request(req) {
    if (req.url === undefined) {
      console.error(`请求地址不能为空`);
      return;
    }

    let promise = new Promise((resolve, reject) => {
      wx.request({
        url: req.url,
        data: req.data || {},
        method: req.method || 'GET',
        dataType: req.dataType || 'json',
        header: req.header || { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.success === false) {
            console.error(`当前访问的API为${req.url},服务器返回success为false`);
            reject({
              msg: `${req.url}服务器返回success为false`
            });
          }
          resolve(res.data);
        },
        fail: function (err) {
          console.error(`当前访问的API为${req.url},出现错误${err}`);
          reject(err);
        }
      });
    })

    return promise;
  }
}


export {
  MyHttp
}