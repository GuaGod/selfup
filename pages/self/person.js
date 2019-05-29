/**
 * @module 表示用户形象的模块
 */
// const regeneratorRuntime = require('../../libs/regenerator-runtime/runtime')
let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const MyStorage = globalData.MyStorage;
const selfAPI = globalData.selfAPI;
const createObserver = globalData.createObserver;

class Person {
   constructor() {
      this.remoteImgMap = new Map();
      this.localImgMap = new Map();
      this.context;
   }  

   init(context) {
      this.context = context;
      createObserver(context);
   }
   
   /**
    * 把远程的图片对象改写成map
    */
   setRemoteImgMap(figure) {
      let map = new Map();
      map.set('backdrop', figure.backdrop);
      map.set('body', figure.body);
      map.set('cloth', figure.cloth);
      map.set('hair', figure.hair);
      map.set('head', figure.head);

      this.remoteImgMap = map;
   }

   /**
    * @method 获取人物图片
    * @for Person
    * @return {Promise}
    */

   getPersonImg() {
     return MyHttp.request({
       url: selfAPI.isFigureCreate,
       header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       },
     })
   }

   isSame(remoteImgMap, localImgMap) {
      let isSame = true;
      try {
      for(let [key, remoteImg] of remoteImgMap.entries()) {
         if(remoteImg !== localImgMap.get(key)) {
            isSame = false;
         }
      }
      } catch(err) {
        isSame = false;
      }

      return isSame;
   }

   downLoadImg() {
      
   }

   saveToStorage() {

   }

   getPersonImgFromStorage() {
      MyStorage.getItem('personImg')
               .then((data) => {
 
                 return Promise.resolve(data);
               }, () => {
                 return Promise.resolve(new Map());
               }).catch(err => {
                 return Promise.resolve(new Map());
               })
   }

   updateStorage() {

   }

   hasStorage() {
      return MyStorage.getItem('personImg')
                .then(() => {
                  return Promise.resolve(true);
                }).catch(err => {
                  return Promise.resolve(false);
                })
   }

   setStorage() {
                
   }
    
   getPowerList() {
     return MyHttp.request({
       url: selfAPI.getAttribute,
       header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       }
     })
   }
}

export default Person