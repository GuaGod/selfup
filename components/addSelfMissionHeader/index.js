// components/addSelfMission/addSelfMissionHeader/index.js
const globalData = getApp().globalData;
Component({
  /**
   * 组件的属性列表
   */
  properties: {


  },

  /**
   * 组件的初始数据
   */
  data: {
    statusHeight: 0,
  },

  ready() {
    this.setData({
      statusHeight: globalData.phoneInfo.statusBarHeight
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTapBack: function() {
      wx.navigateBack({
        delta: 1
      })
    },
  }
})