// pages/friendHome/friendHome.js
let globalData = getApp().globalData;
const goodFriendsAPI = globalData.goodFriendsAPI;
const Loader = globalData.Loader;
const MyHttp = globalData.MyHttp;
let imageLoader = new Loader();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hair: '',
    cloth: '',
    body: '',
    head: '',
    backdrop: '',
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let userId = options.userid;
    let context = {};
    imageLoader.init(context);
    context.on('loadSuccess', function(loadNum, total) {
      that.loadSuccess(loadNum, total);
    });

    context.on('completeLoad', function(filepathMap) {
      that.completeLoad(filepathMap);
    });

    this.getFriendImg(userId)
      .then((res) => {
        let imageMap = new Map();
         let data = res.figure;
        imageMap.set('hair', data.hair || '');
        imageMap.set('cloth', data.cloth || '');
        imageMap.set('body', data.body || '');
        imageMap.set('head', data.head || '');
        imageMap.set('backdrop', data.backdrop || '');

        imageLoader.load(imageMap);
      })
  },

  loadSuccess() {

  },

  completeLoad(filepathMap) {
    this.setData({
      hair: filepathMap.get('hair') || '',
      body: filepathMap.get('body') || '',
      cloth: filepathMap.get('cloth') || '',
      head: filepathMap.get('head') || '',
      backdrop: filepathMap.get('backdrop') || '',
      loading: false
    });
  },

  getFriendImg: function(userId) {
    return MyHttp.request({
      url: goodFriendsAPI.visitFriend,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
        hisUserId: userId
      }
    })
  },

  returnHome: function() {
      wx.navigateBack({
        delta: 1
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})