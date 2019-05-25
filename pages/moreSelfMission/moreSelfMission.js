// pages/plan/moreSelfMission/moreSelfMission.js
import {MoreSelfMission} from './module.js'
let moreSelfMission = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     missionList: [],
     isArrowShow: true,
     actions: [
      {
        name: '喜欢',
        color: '#fff',
        fontsize: '20',
        width: 100,
        icon: 'like',
        background: '#ed3f14'
      },
      {
        name: '返回',
        width: 100,
        color: '#80848f',
        fontsize: '20',
        icon: 'undo'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
    let that = this;
    moreSelfMission = new MoreSelfMission();
    moreSelfMission.init(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
     moreSelfMission = null;
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

  onScrollLower: function(e) {
    moreSelfMission.getMoreMissions(this);
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

  }
})