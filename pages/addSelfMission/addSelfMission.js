
import {MissionNow} from './module.js'
let missionNow = new MissionNow();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isClassVisible: false,
    actions: [{
      name: '学习'
    },
    {
      name: '运动'
    },
    {
      name: '娱乐'
    },
    {
      name: '杂事',
    },
    {
      name: '睡眠',
    },
    {
      name: '吃饭'
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
  
  submit: function() {
    if (!missionNow.thingName) {
      wx.showToast({
        title: '还没有写事件名称！',
        icon: 'none'
      })
      return;
    }
       this.setData({
         isClassVisible: true
       })
  }, 

  handleModal: function ({
    detail
  }) {
    let index = detail.index;
    let className = this.data.actions[index].name;
    
    missionNow.submit(className)
              .then(data => {
                if(data.success) {
                     wx.showToast({
                       title: '添加成功',
                     })
                } 
              });
    this.setData({
      isClassVisible: false
    })
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