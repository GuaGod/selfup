// pages/dairy/dairy.js
import {
  DairyList
} from './DairyList.js'
let dairyList = new DairyList();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dairyData: [],
    loading: true,
    dairyId: 0,
    actions: [{
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ],
    deleteId: 0,
    deleteVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
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
          dairyData: dairyData.concat(operatedData),
          loading: false
        })
      })
      .catch(err => {
        this.setData({
          loading: false
        })
      })
  },

  onScrollLower: function() {
    if (dairyList.hasMoreDairy) {
      this.getMoreDairys();
    }
  },

  getDetail: function(e) {
    let dairyId = e.currentTarget.dataset.dairyid;

    wx.navigateTo({
      url: `../updateDairy/updateDairy?dairyId=${dairyId}`,
    })
  },

  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  deleteDairy: function({
    detail
  }) {
    let dairyId = this.data.deleteId;
    let dairyData = this.data.dairyData;
    for (let i = 0, len = dairyData.length; i < len; i++) {
      let item = dairyData[i];
      if (Number(item.id) === dairyId) {
        dairyData.splice(i, 1);
        break;
      }
    }
    this.setData({
      dairyData: dairyData
    })

    if (detail.index === 0) {
      this.setData({
        deleteVisible: false
      })
    } else {
      const action = this.data.actions;
      action[1].loading = true;

      this.setData({
        actions: action
      });
       
      dairyList.deleteDairy(dairyId)
        .then((data) => {
          if (data.success) {
             action[1].loading = false;
            this.setData({
              deleteVisible: false,
              actions: action
            });
          }
        })
    }

  },

  handleDelete: function(detail) {
    let dairyId = detail.currentTarget.dataset.dairyid;
    this.setData({
      deleteId: dairyId,
      deleteVisible: true
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
    dairyList.init();

    this.getMoreDairys();
  },

  /**
   * 生命周期函数--监听页面显示
   */


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
       this.setData({
         dairyData: []
       });
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

    this.setData({
      loading: true
    })

    dairyList.init();
    this.setData({
      dairyData: []
    })
    this.getMoreDairys();
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
    return {
      title: '用色彩渲染一天 用数据倾诉成长',
      path: 'pages/welcome/welcome',
      imageUrl: '/images/share.png',
    }
  }
})