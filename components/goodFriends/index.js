// components/goodFriends/index.js
import {
  GoodFriends
} from './GoodFriends.js'
let goodFriends = new GoodFriends();
let isEditorMap = new Map();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isGoodFriendShow: {
      type: Boolean,
      value: false,
      observer: function(newValue) {
        if (newValue === true) {
          this.init();
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    friendsList: [], //我的朋友的列表
    friendsActions: [{ //又滑好友列表删除好友
      name: '删除',
      width: 80,
      color: 'white',
      fontsize: '25',
      background: '#ed3f14',
    }, ],
    isFindPeopleShow: false,
    findPeople: {
      isExist: false,
      username: '',
      head: '',
      sex: 0,
      isNobodyTitleShow: false,
    }, //找到的人
    isMyFriendsShow: true,
    isAddFriendShow: false,
    isApplyShow: false,
    isFriendWordsShow: false,
    inputAddInfo: '',
    applyList: [], //申请加好友的列表
    myUserId: '',
    friendWordsList: [],
  },

  ready: function() {
    this.setData({
      myUserId: getApp().globalData.userInfo.userId
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取好友列表数据
    init: function() {
      goodFriends.findMyFriends()
        .then(data => {
          let listFriends = []
          data.listFriends.forEach(item => {
            let aFriend = {};
            aFriend.username = item.username;
            aFriend.head = item.avatarUrl;
            aFriend.sex = item.sex;
            aFriend.userId = item.userId;
            
            isEditorMap.set(item.userId, false);

            listFriends.push(aFriend);
          })

          this.setData({
            friendsList: listFriends
          })

        })
      goodFriends.getApplyList()
        .then(data => {
          let listFriends = data.listFriends;
          this.setData({
            applyList: listFriends
          })
        })
    },

    applyPage: function() {
      this.setData({
        isApplyShow: !this.data.isApplyShow,
        isMyFriendsShow: this.data.isApplyShow,
        isAddFriendShow: false,
        isFriendWordsShow: false,
      })


      if (!this.data.isApplyShow) {
        goodFriends.findMyFriends()
          .then(data => {
            let listFriends = []
            data.listFriends.forEach(item => {
              let aFriend = {};
              aFriend.username = item.username;
              aFriend.head = item.avatarUrl;
              aFriend.sex = item.sex;
              aFriend.userId = item.userId;
              isEditorMap.set(item.userId, false);

              listFriends.push(aFriend);
            })

            this.setData({
              friendsList: listFriends
            })
          })
        return;
      }

      goodFriends.getApplyList()
        .then(data => {
          let listFriends = data.listFriends;
          this.setData({
            applyList: listFriends
          })
        })
    },

    friendWordsPage: function () {
      this.setData({
        isApplyShow: false,
        isMyFriendsShow: this.data.isFriendWordsShow,
        isAddFriendShow: false,
        isFriendWordsShow: !this.data.isFriendWordsShow,
      })

      goodFriends.getFriendWordsList()
        .then((data) => {
          this.setData({
            friendWordsList: data.listMessage
          })
        });

    },

    tapFriend: function(detail) {
      let userId = detail.currentTarget.dataset.userid;
      let isEditorMode = isEditorMap.get(userId);
       
      if(isEditorMode) {
        return;
      }
      wx.navigateTo({
        url: `../friendHome/friendHome?userid=${userId}`,
      })
    },

    changeInputAddInfo: function({
      detail
    }) {
      let value = detail.value;
      this.data.inputAddInfo = value;
    },

    myFriendPage: function() {
      this.setData({
        isMyFriendsShow: true,
        isAddFriendShow: false,
        isApplyShow: false,
        isFriendWordsShow: false,
      })
    },

    
    //
    confirmAddInfo: function(e) {
        let info = e.detail.value;
         
        this._submitAddInfo(info);
    },

    //用户提交搜索内容 (查找好友时)
    submitAddInfo: function() {
       this._submitAddInfo(this.data.inputAddInfo);
    },
    
    _submitAddInfo: function (info) {
      let that = this;
      let username = info;

      if (username === '') {
        return;
      }
      this.setData({
        isFindPeopleShow: true
      })

      goodFriends.findFriend(username)
        .then(data => {
          let isExist = data.isExist;
          if (isExist) {
            let user = data.user;

            wx.showModal({
              title: user.username,
              content: '是否加为好友',
              success: function (e) {
                let confirm = e.confirm;
                if (confirm) {
                  that.addSomeone(user.userId);
                }
              }
            })

            this.setData({
              findPeople: {
                username: user.username,
                head: user.avatarUrl,
                sex: user.sex,
                userId: user.userId,
                isExist: true
              }
            })
          } else {
            wx.showToast({
              title: 'ta还没有注册，快去邀请ta吧！',
            })
          }
        })
    },

    addSomeone: function(userId) {
      let hisUserId = userId;
      goodFriends.addFriend(hisUserId)
        .then(res => {
          if (res.success) {
            wx.showToast({
              title: '已提交申请，快去联系ta同意吧！',
              icon: 'success',
              duration: 1000,
              mask: true,
            })
            return;
          }

          wx.showToast({
            title: '添加失败',
            icon: 'error',
            duration: 1000,
            mask: true
          })
        })
    },

    applySomeone: function(detail) {
      let hisUserId = detail.target.dataset.userid;
      goodFriends.applyFriend(hisUserId)
        .then(res => {
          if (res.success) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000,
              mask: true,
            })

            let applyList = this.data.applyList;
            for (let i = 0, len = applyList.length; i < len; i++) {
              let item = applyList[i];
              if (item.userId === hisUserId) {
                applyList.splice(i, 1);
                break;
              }
            }

            this.setData({
              applyList: applyList
            })

            return;
          }

          wx.showToast({
            title: '添加失败',
            icon: 'error',
            duration: 1000,
            mask: true
          })
        })
    },

    deleteFriend: function(userId) {
      goodFriends.deleteFriend(userId);
    },

    refuseSomeone: function(detail) {
      let hisUserId = detail.target.dataset.userid;
      goodFriends.refuseFriend(hisUserId)
        .then(res => {
          if (res.success) {
            wx.showToast({
              title: '拒绝成功',
              icon: 'success',
              duration: 1000,
              mask: true,
            })

            return
          }

          wx.showToast({
            title: '拒绝失败',
            icon: 'error',
            duration: 1000,
            mask: true
          })
        })
    },

    swiperFriendItem: function(data) {
      let that = this;
      let index = data.detail.index;
      let userId = data.currentTarget.dataset.userid;
      let friendsList = this.data.friendsList;
      isEditorMap.set(userId, true);
      if(index === 0) {
        
        for (let i = 0, len = friendsList.length; i < len; i++) {
          let item = friendsList[i];
          if (String(item.userId) === String(userId)) {
            friendsList.splice(i, 1);
            break;
          }
        }
        goodFriends.deleteFriend(userId)
            .then(data => {
               if(data.success) {
                 wx.showToast({
                   title: '删除成功！',
                 });
                 this.setData({
                   friendsList: friendsList
                 })
               } 
            })
      } else {
         isEditorMap.set(userId, false);
      }
 
    },

    catchDelete: function() {
         
    },
    //重置搜索
    resetSearch: function() {
      this.setData({
        isFindPeopleShow: false,
        findPeople: {
          isExist: false,
          username: '',
          head: '',
          sex: 0,
          isNobodayTitleShow: false
        },
      })
    },

    deleteMessage: function(e) {
      let that = this;
      let messageId = e.target.dataset.messageid;
    
      wx.showModal({
        title: '确定删除留言',
        success: function (e) {
          let confirm = e.confirm;
          if (confirm) {
            that._deleteMessage(messageId);
          }
        }
      })

    },

    _deleteMessage(messageId) {
      let friendWordsList = this.data.friendWordsList;
      for (let i = 0, len = friendWordsList.length; i < len; i++) {
        let item = friendWordsList[i];
        if (item.messageId === messageId) {
          friendWordsList.splice(i, 1);
          break;
        }
      }

      this.setData({
        friendWordsList
      })
      goodFriends.deleteMessage(messageId)
        .then((data) => {
          console.log(data);
        });
    },

  }
})