// components/moreSelfMissionHeader/index.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapBack: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    onTapAdd: function () {
      wx.navigateTo({
        url: '/pages/addSelfMission/addSelfMission',
      })
    },
  }
})
