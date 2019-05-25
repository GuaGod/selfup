// pages/dairyDetail/dairyDetail.js
let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const dairyAPI = globalData.dairyAPI;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dairyId: 0,
    content: "",
    title: "",
    time: "",
    src: "",
    image: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that = this;
      let dairyId = Number(options.dairyId);
      MyHttp.request({
        url: dairyAPI.getEmotionDetail,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': getApp().globalData.LOGIN_COOKIE
        },
        data: {
          emotionId: dairyId
        }
      }).then(({emotion}) => {
         that.setData({
           content: emotion.content || "",
           title: emotion.title || "",
           time: emotion.createTime.slice(0, 10) || "",
           image: 'https://www.steins.club' + emotion.emotionImg.replace(/\\/g, '\/')
         })
      })
  },

  back: function () {
     wx.switchTab({
       url: '../dairy/dairy',
     })
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

  }
})