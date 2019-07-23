// pages/dairy/dairy.js
import {
  DairyList
} from './DairyList.js'
let dairyList = new DairyList();
const globalData = getApp().globalData;

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
    deleteVisible: false,
    windowHeight: 1334,
  },

  onShow: function() {
    console.log(dairyList);
  },

  onLoad: function() {
    let windowHeight = globalData.phoneInfo.windowHeight;
    let ratio = globalData.phoneInfo.pixelRatio;

    windowHeight *= ratio;
    this.setData({
      windowHeight,
    })

    if (!dairyList.isInit) {
      this.getMoreDairys();
      dairyList.isInit = true;
      return;
    }

    this.setData({
      dairyData: dairyList.emotionList
    })

    this.setData({
      loading: false
    })
  },

  add: function() {
    wx.navigateTo({
      url: '../writeDairy/writeDairy',
    })
  },

  getMoreDairys: function() {
    dairyList.setCookie(getApp().globalData.LOGIN_COOKIE);
    dairyList.getMore()
      .then(({emotionList}) => {
        let dairyData = this.data.dairyData;
                                  
        this.setData({
          dairyData: dairyData.concat(emotionList),
          loading: false
        })
      })
      .catch(err => {
        this.setData({
          loading: false
        })
      })
  },


  onPullDownRefresh: function() {
    dairyList.reset();
    this.setData({
      dairyData: [],
      loading: true
    })
    this.getMoreDairys();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function() {
    this.getMoreDairys();
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
    if (detail.index === 0) {
      
      this.setData({
        deleteVisible: false
      })
    } else {
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