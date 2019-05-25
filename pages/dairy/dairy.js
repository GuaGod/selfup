// pages/dairy/dairy.js
import {DairyList} from './DairyList.js'
let dairyList = new DairyList();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dairyData: [],
    loading: true,
    todayHasDariy: false,
    dairyId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
  },

  add: function() {
      wx.navigateTo({
        url: '../writeDairy/writeDairy',
      })
  },

  getMoreDairys: function() {
    dairyList.getMoreDairys()
      .then((emotionList) => {
        let operatedData = dairyList.operateData(emotionList);
        let dairyData = this.data.dairyData;
        this.setData({
          dairyData: dairyData.concat(operatedData)
        })
      })
  },

  onScrollLower: function () {
     if(dairyList.hasMoreDairy) {
         this.getMoreDairys();
     }
  },

  getDetail: function(e) {
     let dairyId = e.currentTarget.dataset.dairyid;
     let todayDariyId = this.data.dairyId;
     if(dairyId === todayDariyId) {
       wx.navigateTo({
         url: '../writeDairy/writeDairy',
       })
       return ;
     }
     wx.navigateTo({
       url: `../dairyDetail/dairyDetail?dairyId=${dairyId}`,
     })
  },
   
  back: function() {
     wx.navigateBack({
       delta: 1
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
    dairyList.init();
    
    dairyList.isTodayHasDairy()
             .then(res => {
                let isExist = res.isExist;
                if(isExist) {
                  this.setData({
                    dairyId: res.emotion.emotionId
                  })
                }
                this.getMoreDairys();
                this.setData({
                  todayHasDariy: isExist
                })
             })
    
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
     this.setData({
        dairyData: []
     });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({ dairyData: [] });
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