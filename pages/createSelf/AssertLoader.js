/**
 * @module 资源加载器
 */
let globalData = getApp().globalData;
const MyHttp =  globalData.MyHttp;
const MyDownload = globalData.MyDownload;
const MyStorage = globalData.MyStorage;
const selfAPI = globalData.selfAPI;

/**
 * @class AssertLoader  资源加载器
 */

class AssertLoader {
    constructor() {
       
    }

    /**
     * @method getPersonImg 获取到对应性别的图片路径
     * @for AssertLoader
     * @arguments {String} sex 传入性别 获取相应的图片
     * @return {Promise(url)} 
     */
    static findImgBySex(sex) {
       return MyHttp.request({
          url: selfAPI.findImgBySex,
          data: {
             imgSex: sex
          },
         header: {
           'content-type': 'application/x-www-form-urlencoded',
           'Cookie': getApp().globalData.LOGIN_COOKIE
         },
       })
    }

    /**
     * @method downloadAFile  下载人图片
     * @for AssertLoader
     * @arguments {String} imgPath 下载图片路径
     * @return {Promise}
     */
    static downloadAFile(path) {
       return MyDownload.download(path)
    }

    /**
     * @method downloadPersonImg 下载图片
     * @for AssertLoader
     * @arguments {Array} imgArr 图片的map 名字 图片名 => 路径
     * return {Promise}
     */

    static download(imgMap) {
       let downloadQueue = [];

       for(let [key, value] of imgMap) {
          downloadQueue.push(AssertLoader.downloadAFile(value));
       }

       return Promise.all(downloadQueue);
    }

   /**
     * @method saveAFile 下载人图片
     * @for AssertLoader
     * @arguments {String} imgPath 保存图片路径
     * @return {Promise}
     */

    static saveAFile(tempFile) {
         return MyDownload.saveFile(tempFile);
    }

    /**
     * @method save 保存图片到本地
     * @for AssertLoader
     * @arguments {Array} imgArr 图片的map 名字 图片名 => 路径
     * return {Promise} 
     */

    static save(imgArr) {
      let saveQueue = [];

      imgArr.forEach((imgPath) => {
        saveQueue.push(AssertLoader.saveAFile(imgPath));
      })


      return Promise.all(saveQueue)
    }

    /**
     * @method storageToCache  将信息存储到缓存之中
     * @for AssertLoader
     * @arguments imgArr 图片本地路径的数组
     * @return {Promise}
     */

    static storageToCache(imgArr) {
          let personImg = {};
          personImg.hair = imgArr[0].savedFilePath;
          personImg.cloth = imgArr[1].savedFilePath;
          personImg.body = imgArr[2].savedFilePath;
          
          
          return MyStorage.setItem('personImg', personImg);
    }
}

export {
  AssertLoader
}