/**
 * @class MyStorage 实现对缓存技术的封装
 */

class MyStorage {
  constructor() {

  }

  /**
   * @method removeItem 移除元素
   * @for MyStorage
   * @param {String} key 删除元素的key值
   * @return {Promise}
   */

  static removeItem(key) {
      if(key === undefined || key === null) {
        console.error(`删除缓存的key值错误,key:${key}`);
        return ;
      }
      return new Promise((resolve, reject) => {
           wx.removeStorage({
             key: key,
             success: function(res) {
               resolve(res);
             },
             fail: function(res) {
               reject(res);
             }
           })
      });
  }

  /**
   * @method clear 清空仓库
   * @for MyStorage
   */

  static clear() {
    wx.clearStorage();
  }

  /**
   * @method setItem 设置元素
   * @for MyStorage
   * @param {String} key 元素的key值
   * @param {Var} data value 值
   * @return {Promise}
   */

  static setItem(key, data) {
    if(key === undefined || data === undefined) {
      console.error(`设置缓存时传入的键值对有误,key:${key}, value: ${value}`);
      return;
    }
    return new Promise((resolve, reject) => {
       wx.setStorage({
         key: key,
         data: data,
         success: function(res) {
            resolve(res);
         },
         fail: function(res) {
            reject(res);
         }
       })
    });
  }

  /**
   * @method getItem 获取元素
   * @for MyStorage
   * @param {String} key 元素的key值
   * @return {Promise}
   */

  static getItem(key) {
    if(key === undefined || key === null) {
       console.error(`获取缓存时的key出错,key:`);
       console.log(key);
       return;
    }
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: function(res) {
          resolve(res);
        },
        fail: function(res) {
          reject(res);
        }
      })
    })
  }
}


export {
  MyStorage
}