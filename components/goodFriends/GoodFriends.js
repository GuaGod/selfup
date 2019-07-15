let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const goodFriendsAPI = globalData.goodFriendsAPI;

/**
 * @class GoodFriends  朋友的类
 */

class GoodFriends {
  constructor() {
     this.friendsList;
     this.friendWordsPageNum = 1;
     this.friendWordsPageSize = 10;
     this.hasMoreFriendWords = true;

     this.friendPageNum = 1;
     this.friendPageSize = 10;
     this.hasMoreFriend = true;

     this.applyPageNum = 1;
     this.applyPageSize = 10;
     this.hasMoreApply = true;
  }

  /**
   * @method findMyFriends 查找我的所有好友
   * @for GoodFriends
   * @return {Promise}
   */
  findMyFriends(isReset = false) {
     let that = this;
     
     if(!isReset && !this.hasMoreFriend) {
       return Promise.resolve([]);
     }

    if (isReset) {
      this.friendPageNum = 1;
      this.hasMoreFriend = true;
    }
       
     return MyHttp.request({
        url: goodFriendsAPI.listFriends,
        header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       },
       data: {
         pageNum: that.friendPageNum,
         pageSize: that.friendPageSize,
       }
     }).then(data => {
        let length = data.listFriends.length;
        this.friendPageNum++;
        if(length < that.friendPageSize) {
          that.hasMoreFriend = false;
        }

        return data.listFriends;
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

  getApplyList(isReset = false) {
    let that = this;
    if(!isReset && !this.hasMoreApply) {
      return Promise.resolve([]);
    }

    if(isReset) {
      this.applyPageNum = 1;
      this.hasMoreApply = true;
    }

    return MyHttp.request({
      url: goodFriendsAPI.isFriendAdd,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE,
      },
      data: {
        pageNum: that.applyPageNum,
        pageSize: that.applyPageSize
      }
    }).then(data => {
      let length = data.listFriends.length;
      this.applyPageNum++;

      if(length < that.applyPageSize) {
        that.hasMoreApply = false;
      }

      return data.listFriends;
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
      url: goodFriendsAPI.deleteFriend,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE,
      },
      data: {
        hisUserId: userId
      }
    })
  }

  getFriendWordsList(isReset = false) {
    let that = this; 
    if(!isReset && !this.hasMoreFriendWords) {
      return Promise.resolve([]);
    }

    if(isReset) {
      this.friendWordsPageNum = 1;
      this.hasMoreFriendWords = true;
    }

    return MyHttp.request({
      url: goodFriendsAPI.listMessage,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE,
      }, 
      data: {
        pageNum: that.friendWordsPageNum,
        pageSize: that.friendWordsPageSize,
      }
    }).then((data) => {
      let length = data.listMessage.length;
      
      that.friendWordsPageNum++;
      if(length < that.friendWordsPageSize) {
        that.hasMoreFriendWords = false;
      } 

      return data.listMessage;
    }, (err) => {
      console.log(err);
    })
  }

  deleteMessage(messageId) {
    let that = this;
    return MyHttp.request({
      url: goodFriendsAPI.deleteMessage,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE,
      }, 
      data: {
        messageId
      }
    })
  }

}

export {
  GoodFriends
}