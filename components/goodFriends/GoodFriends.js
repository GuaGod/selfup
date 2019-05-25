let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const goodFriendsAPI = globalData.goodFriendsAPI;

/**
 * @class GoodFriends  朋友的类
 */

class GoodFriends {
  constructor() {
     this.friendsLis
  }

  /**
   * @method findMyFriends 查找我的所有好友
   * @for GoodFriends
   * @return {Promise}
   */
  findMyFriends() {

     return MyHttp.request({
        url: goodFriendsAPI.listFriends,
       header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       },
     })
  }

   /**
   * @method addFriend 通过对方的userId来添加好友
   * @for GoodFriends
   * @argument {String} hisUserId 对方的userId
   * @return {Promise}
   */
  addFriend(hisUserId) {
     return MyHttp.request({
       url: goodFriendsAPI.addFriend,
       header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       },
       data: {
         hisUserId: Number(hisUserId)
       }
     })
  }

  /**
   * @method findFriend 通过用户id查找好友
   * @for GoodFriends
   * @argument {String} username 用户id
   * @return {Promise}
   */
  
  findFriend(username) {
     return MyHttp.request({
       url: goodFriendsAPI.findFriend,
       header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       },
       data: {
         username: username           
       }
     })
  }

  /**
   * 获取申请加好友的列表
   */

  getApplyList() {
    return MyHttp.request({
      url: goodFriendsAPI.isFriendAdd,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE,
      }
    })
  }

  /**
   * 同意加好友
   */

  applyFriend(username) {
    return MyHttp.request({
      url:goodFriendsAPI.apply,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE, 
      },
      data: {
        hisUserId: username
      }
    })
  }

  /**
   * 拒绝加好友
   */

  refuseFriend(username) {
    return MyHttp.request({
      url: goodFriendsAPI.refuse,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE,
      },
      data: {
        hisUserId: username
      }
    })
  }
  
  deleteFriend(userId) {
    return MyHttp.request({
      
    })
  }

}

export {
  GoodFriends
}