// components/missionChoose/index.js
import {MissionChoose} from './MissionChoose.js'
let globalData = getApp().globalData;
const createObserver = globalData.createObserver;
let missionChoose = new MissionChoose();

Component({
  properties: {

  },

  pageLifetimes: {
     show: function() {
       if(missionChoose.isInit) {
         missionChoose.update();
       }
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
     missionList: [],  //喜欢的事件列表
  },

  ready: function() {
     let view = {};
     let that = this;
     createObserver(view);

     view.on('updateMissionList', (missionList) => {
           
          that.setData({
            missionList: missionList
          })
     })
     missionChoose.init(view);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetMoreSelfMission: function () {
      wx.navigateTo({
        url: '/pages/moreSelfMission/moreSelfMission',
      })
    },

    addMissionPage: function() {
      wx.navigateTo({
        url: '/pages/addSelfMission/addSelfMission'
      })
    }
  }
})
