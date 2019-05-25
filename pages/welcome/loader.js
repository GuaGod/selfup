import assertsPath from './assetsPath.js'
let globalData = getApp().globalData;
const MyDownload = globalData.MyDownload;
const MyHttp = globalData.MyHttp;
const MyStorage = globalData.MyStorage;
const selfAPI = globalData.selfAPI;

const Loader = function(context) {
  let _loadNum = 0; 
  let _loadLock = false;

  class Loader {

    constructor(context) {
      this.context;
      this.files;
      this.total;

      this.init(context);
    }

    init(context) {
      this.context = context;
      this.files = assertsPath;
      this.loadNum = 0;
      this.total = this.files.size;
    }

    set loadNum(value) {
      let oldValue = _loadNum;      
      _loadNum = value;
      //如果已经加载完成，就上锁，停止以后的各种检测
      if(_loadLock) {
        return ;
      }
      
      //如果新值大于旧值，就出发一次完成事件
      if(oldValue < value) {
         this.context.triggerEvent('loadSuccess', _loadNum, this.total);
      }

      if(_loadNum >= this.total) {
         this.context.triggerEvent('completeLoad');
         _loadLock = true;
      }
    }

    get loadNum() {
      return _loadNum;
    }
     


    /**
     * @method loadFiles  加载assetsPath提供的所有的文件，实现预加载，缓存中存储的是文件名和本地路径的映射关系，先判断缓存中有没有该文件，如果有，直接跳过，如果没有，从远程下载，保存到本地，再存储到缓存中
       @for Loader
       tip: 每一层的reject都要继续冒泡抛出异常，最后用一个catch捕获，判断是断链还是真正的异常
     */

    loadFiles() {
      let that = this;
      for (let [filename, filepath] of that.files.entries()) {
        //是否有缓存
        that._hasCache(filename)
          .then(hasCache => {
            //如果没有缓存 进入加载文件流程
            
            if (!hasCache) {
              return that._loadAFile(filepath);
            }
            //有缓存 resolve(false);
            
            that.loadNum++;
            return Promise.resolve(false);
          })
          .then(data => {
            //data 为false结束 或者data为一个本地文件
            if (data === false) {
              return;
            }
            let localPath = data.savedFilePath;
            that._storageToCache(filename, filepath, localPath);
          })

      }
    }

    /**
     * @method loadAFile 从远程下载一个文件 把文件保存到本地，
                         并把本地文件路径的promise返回,下载失败
                         返回promise.resolve(false),阻塞下一步
       @for Loader       
       @return {Promise }
     */

    _loadAFile(filepath) {
      let that = this;
      return MyDownload.download(filepath, 'image')
        .then(res => {
          that.loadNum++;
          
          return MyDownload.saveFile(res.tempFilePath);
        }, err => {
          that.loadNum++;
          return Promise.resolve(false);
        })

    }

    _storageToCache(filename, remotePath, localPath) {
      return MyStorage.setItem(filename, {
        remotePath: remotePath,
        localPath: localPath
      })
    }

    _hasCache(key) {
      return MyStorage.getItem(key)
        .then(({data}) => {
        
          if (data.localPath !== '' && data.localPath !== undefined && data.localPath !== null) {
            return Promise.resolve(true);
          }
          return Promise.resolve(false);
        })
        .catch((err) => {
          return Promise.resolve(false);
        });
    }

  }

  return Loader;
}();


// class PersonLoader {
//    constructor() {
//       this.personImg;
//    }

//    load() {
//       this._getFigure()
//           .then(data => {
//               let isCreate = data.isCreate;
//               if(isCreate) {
//                 return Promise.reject({
//                    notRealError: true
//                 })
//               }

//               this.personImg = data.figure;
              
//               return this._hasCache()
//           }, (err) => {
//               return Promise.reject(err);
//           })
//           .then(isHas => {
//             let isSame;
//             if(isHas) {
//                isSame = this._isSame();
//             } else {
//               return this._load
//             }
            
//           })
        
//           .catch(err => {
//             if(err.notRealError === true) {
//               return ;
//             }
//             console.error(err);
//           })
//    }
   
//    _hasCache() {
//      return MyStorage.getItem('personImg')
//        .then(({data}) => {
//          if (data.localPath !== '' && data.localPath !== undefined && data.localPath !== null) {
//            return Promise.resolve(true);
//          }
//          return Promise.resolve(false);
//        }, (err) => {
//          return Promise.resolve(false);
//        })
//    }

//    /**
//     * 从远程获取人物形象
//     */

//    _getFigure() {
//       return MyHttp.request({
//         url: selfAPI.isFigureCreate
//       })
//    }

//    /**
//     * 本地缓存与远程是否相同，不相同就替换
//     */

//     _isSame() {

//     }
   
// }

export {
  Loader,
  // PersonLoader
}