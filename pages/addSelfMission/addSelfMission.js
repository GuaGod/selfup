
import {MissionNow} from './module.js'
let missionNow = new MissionNow();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isClassVisible: false,
    thingClass: '',
    thingClassList: [{
      name: '学习',
      choosed: true,
      icon: '/images/study_icon.png',
    },
    {
      name: '运动',
      choosed: false,
      icon: '/images/sport_icon.png',
    },
    {
      name: '娱乐',
      choosed: false,
      icon: '/images/play_icon.png',
    },
    {
      name: '杂事',
      choosed: false,
      icon: '/images/other_icon.png',
    },
    {
      name: '睡眠',
      choosed: false,
      icon: '/images/sleep_icon.png',
    },
    {
      name: '吃饭',
      choosed: false,
      icon: '/images/eat_icon.png',
    }
    ],
  },

  onInputThingName: function(e) {
      let thingName = e.detail.thingName;
      missionNow.inputThingName(thingName);
  },

  onChooseThingColor: function(e) {
      let thingColor = e.detail.thingColor;
      missionNow.chooseThingColor(thingColor);
  },

  onChooseThingClass: function (e) {
    let thingClass = e.currentTarget.dataset.thingclass;
    let thingIndex = e.currentTarget.dataset.index;
    let thingClassList = this.data.thingClassList;
    for(let i = 0, len = thingClassList.length; i < len; i++) {
      thingClassList[i].choosed = false;
    }

    thingClassList[thingIndex].choosed = true;
    this.setData({
      thingClassList: thingClassList
    })
    missionNow.thingClass = thingClass;
  },
  
  submit: function() {
    if (!missionNow.thingName) {
      wx.showToast({
        title: '还没有写事件名称！',
        icon: 'none'
      })
      return;
    }
    missionNow.submit()
      .then(data => {
        if (data.success) {
          wx.showToast({
            title: '添加成功',
          })
        }
      });
  }, 

  

  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '用色彩渲染一天 用数据倾诉成长',
      path: 'pages/welcome/welcome',
      imageUrl: '/images/share.png',
    }
  }
})