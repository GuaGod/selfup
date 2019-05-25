/**
 * @module 表示用户形象的模块
 */
let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const selfAPI = globalData.selfAPI;


class Person {
   constructor() {
    
   }  

   /**
    * 登录
    */

    login() {

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