let globalData = getApp().globalData;
const MyStorage = globalData.MyStorage;
const MyHttp = globalData.MyHttp;
const dairyAPI = globalData.dairyAPI;

let dairyObj = {
  "emotionId": null,
  "content": "",
  "emotionValue": null,
  "title": "",
  "createTime": null,
  "userId": null
};

class Dairy {
  constructor() {
      this.view;
  }

  init(view) {
      this.view = view;

  }

  hasDairy() {
     return MyHttp.request({
       url: dairyAPI.isEmotionExist,
       header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       },
     })
  }

  save(obj) {
    return MyStorage.setItem('dairy', obj);
  }

  write(obj, imagePath) {
    obj = Object.assign(dairyObj, obj);
     
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: dairyAPI.insertEmotionText,
        filePath: imagePath,
        name: 'emotionImg',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': getApp().globalData.LOGIN_COOKIE
        },
        formData: {
          emotionStr: JSON.stringify(obj),
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  }

  update(obj, imagePath) {
    
    obj = Object.assign(dairyObj, obj);
    console.log(JSON.stringify(obj));
    console.log(obj.emotionId);
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: dairyAPI.updateEmotionText,
        filePath: imagePath,
        name: 'emotionImg',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': getApp().globalData.LOGIN_COOKIE
        },
        formData: {
          emotionStr: JSON.stringify(obj),
          emotionId: obj.emotionId,
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  }
}

export {
  Dairy
}