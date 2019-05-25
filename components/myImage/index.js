// components/MyImage/index.js
let globalData = getApp().globalData;
const MyStorage = globalData.MyStorage;
const MyDownload = globalData.MyDownload;
const imgPathMap = globalData.imgPathMap;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      img: {
        type: String,
        value: '',
        //传入的newValue是一个事先记录在map中的imgName，他有对应的路径，先从缓存中读取，如果缓存中有，则取本地，如果没有，则远程访问。
        observer: function(newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          if (newValue === undefined || newValue === null || newValue === '') {
            return;
          }

          let remotePath = imgPathMap.get(newValue);
          let that = this;
          MyStorage.getItem(newValue)
                   .then((res) => {
                       let data = res.data;
                       let localPath = data.localPath;
                       if(localPath !== undefined && localPath !== null && localPath !== '') {
                         that.setData({
                           src: localPath
                         });

                         return Promise.reject({       //有缓存，终止promise链
                           noRealError: true
                         });     
                       }
                        
                       return that._loadAFile(remotePath);       //没有cache 从远程下载
                   }, (err) => {
                      if(err && err.noRealError) {
                        return Promise.reject(err);       
                      } 

                     return that._loadAFile(remotePath);       //没有cache 从远程下载
                   }).then((res) => {                           //下载并保存成功
                        
                       let localPath = res.savedFilePath;
                       that.setData({
                         src: localPath
                       })
                       return that._storageToCache(newValue, remotePath, localPath);
                   }, (err) => {                                //下载失败
                        
                        return Promise.reject(err);
                   }).then((res) => {
                         
                         console.log(res);
                   }, (err) => {
                       
                        return Promise.reject(err);
                   })
                   .catch(err => {
                     if(err && err.noRealError) {
                       return;
                     } 
                     console.error(err);
                   })
                                     

          
        }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
     src: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    //存储文件到缓存中
    _storageToCache(filename, remotePath, localPath) {
      return MyStorage.setItem(filename, {
        remotePath: remotePath,
        localPath: localPath
      })
    },

    //下载文件并保存到本地
    _loadAFile(filepath) {
      let that = this;
      return MyDownload.download(filepath, 'image')
        .then(res => {
          if(res.statusCode !== 200) {
            return Promise.reject();
          }
          return MyDownload.saveFile(res.tempFilePath);
        }, err => {
          return Promise.reject();
        })
    }
  }
})
