


class MyDownload {
  constructor() {

  }

  /**
   * @method download 下载一个文件
   * @for DownLoadUtil 
   * @param {String} 文件的地址
   * @type  {String} 文件的类型 包括image，audio，video等
   * @return {Promise}
   */

  download(url, type) {
    return MyDownload.download(url, type);
  }

  saveFile(url) {
    return MyDownload.saveFile(url);
  }

  static download(url, type) {
     return new Promise((resolve, reject) => {
       wx.downloadFile({
         url: url,
         type: type || 'image',
         success: function(res) {
           resolve(res);
         },
         fail: function(err) {
           reject(err);
         }
       })
     });
  }

  static saveFile(url) {
     return new Promise((resolve, reject) => {
        wx.saveFile({
          tempFilePath: url,
          success: function(res) {
             resolve(res);
          },
          error: function(err) {
            console.error(`保存文件出错`);
            console.log(err);
            reject(err);
          }
        })
     })
  }


  static getSavedFileList() {
     return new Promise((resolve, reject) => {
       wx.getSavedFileList({
         success: function(res) {
           reject(res);
         },
         error: function(err) {
           reject(err);
         }
       })
     });
  }
}

export {
  MyDownload
}