// pages/self/self.js

/**
 * 优化方案：把完整的数据表维护在缓存中，所有的操作均先操作缓存，这样一方面可以解决页面和子组件间通信的问题
 *          也可以大量减少http请求 已优化
 */

import {
  PlanController
} from './PlanController.js'
let planController = new PlanController();

let globalData = getApp().globalData;
const MyDate = globalData.MyDate;
const MyStorage = globalData.MyStorage;
const createObserver = globalData.createObserver;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    isCalendarShow: false,
    choosedMissions: [],
    clearChooseTag: false,
    planHeaderTag: false,
    hasEditorMission: false, //是否有正在编辑的块
    chooseTime: "",
    loading: true,
    plan: [],
    isHeaderCalendarShow: true,
    isHeaderCloseShow: false,
    canChooseShow: true,
    canEditorShow: true,            //是否可以有下栏的编辑器
    completeProgress: 0,
    isNewMan: false,
    helpStep: 0,
    finalStep: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let dateStr = MyDate.createTodayDateStr();
    let view = {};
    MyStorage.getItem('isPlanNewMan')
             .then((res) => {
               let isNewMan = res.data;
               this.setData({
                 isNewMan
               })               
             }, () => {
                this.setData({
                  isNewMan: true
                })
                MyStorage.setItem('isPlanNewMan', true);
             })

    createObserver(view);
    view.on('updateView', (data) => {
      let plan = data.plan;
      let date = data.date;

      that.setData({
        date: date,
        plan: plan,
        clearChooseTag: !that.data.clearChooseTag,
        choosedMissions: [],
        hasEditorMission: false,
      });

    view.on('updateProgress', (data) => {
      let completeProgress = data.completeProgress;
      that.setData({
        completeProgress: completeProgress
      })
    })

    });

    planController.init(view, dateStr);
    this.setData({
      date: dateStr,
      plan: planController.plan
    })
  },

  onTapCalendar: function() {
    this.setData({
      isCalendarShow: true,
      isHeaderCalendarShow: false,
      isHeaderCloseShow: true,
    })
  },

  onTapClose: function() {
     this.setData({
       isCalendarShow: false,
       isHeaderCalendarShow: true,
       isHeaderCloseShow: false,
     })
  },

  onTapExpand: function() {

  },
   
  onTapShadow: function() {
     this.setData({
       isCalendarShow: false,
       isHeaderCalendarShow: true,
       isHeaderCloseShow: false
     })
  },

  onChangeNowDate: function({
    detail
  }){
    let dateStr = detail.dateStr;
    this.toggleChooseShow(dateStr);  //过往的计划不可改
    if (dateStr !== planController.date) {
      this.setData({
        completeProgress: 0,
      })
    }
    planController.submitPlanData();
    planController.changeDate(dateStr);

    
     
    
    this.setData({
      isCalendarShow: false,
      date: dateStr,
      choosedMission: [], 
      isHeaderCalendarShow: true,
      isHeaderCloseShow: false,
      hasEditorMission: false,
    })

  },

  toggleChooseShow: function(dateStr) {
    let tmpDate = dateStr.replace(/-/g, '');
    let todayDate = MyDate.createTodayDateStr().replace(/-/g, '');
    if (tmpDate < todayDate) {
      this.setData({
        canChooseShow: false,
        canEditorShow: false,
      })
    } else {
      this.setData({
        canChooseShow: true,
        canEditorShow: true
      })
    }
  }, 

  //选中一个任务，要对其进行操作
  chooseMission: function({
    detail
  }) {
    this.data.choosedMissions.push(detail);
    let length = this.data.choosedMissions.length;

    let chooseTime = ``;
    if (length % 2 === 0) {
      chooseTime = `${length / 2}小时`
    } else {
      chooseTime = `${Math.floor(length / 2)}小时30分钟`
    }
    
    let canEditorShow = this.data.canEditorShow;

    this.setData({
      hasEditorMission: true,
      canEditorShow: canEditorShow,
      chooseTime: chooseTime
    })
  },

  //取消对任务的选择
  cancelChooseMission: function({
    detail
  }) {
    let choosedMissions = this.data.choosedMissions;

    for (let i = 0, len = choosedMissions.length; i < len; i++) {
      let mission = choosedMissions[i];
      if (mission.x === detail.x && mission.y === detail.y) {
        choosedMissions.splice(i, 1);
        break;
      }
    }

    if (choosedMissions.length === 0) {
      this.setData({
        hasEditorMission: false
      })
    }

    let length = this.data.choosedMissions.length;

    let chooseTime = ``;
    if (length % 2 === 0) {
      chooseTime = `${length / 2}小时`
    } else {
      chooseTime = `${Math.floor(length / 2)}小时30分钟`
    }
    
    this.setData({
      chooseTime: chooseTime
    })
  },

  //完成选择，提交当前选中的任务块数组
  completeChoose: function({
    detail
  }) {
    if (this.data.choosedMissions.length === 0) {
      return;
    }

    planController.updatePlan(this.data.choosedMissions, detail.missionData);
    let progress = planController.comunicateProgress();
    this.setData({
      hasEditorMission: false,
      completeProgress: progress,
    })
  },

  //取消整个选择操作， 清空当前选中的任务块
  cancelChoose: function() {
    this.data.choosedMissions = [];
    this.setData({
      clearChooseTag: !this.data.clearChooseTag,
      hasEditorMission: false
    });
  },

  deleteChoose: function() {
    planController.deletePlan(this.data.choosedMissions);
    console.log(planController.plan);
    let progress = planController.comunicateProgress();
    
    this.setData({
      clearChooseTag: !this.data.clearChooseTag,
      hasEditorMission: false,
      completeProgress: progress
    });
  },

  completeChoosedMission: function() {
    planController.completeChoosedMission(this.data.choosedMissions);
    let progress = planController.comunicateProgress();
    this.setData({
      clearChooseTag: !this.data.clearChooseTag,
      hasEditorMission: false,
      completeProgress: progress
    });
  },

  unCompleteChoosedMission: function() {
    planController.unCompleteChoosedMission(this.data.choosedMissions);
    let progress = planController.comunicateProgress();
    this.setData({
      clearChooseTag: !this.data.clearChooseTag,
      hasEditorMission: false,
      completeProgress: progress
    });
  },

  nextHelp: function () {
    let helpStep = this.data.helpStep;
    let finalStep = this.data.finalStep;

    if (helpStep === finalStep) {
      this.overHelp();
    }

    this.setData({
      helpStep: this.data.helpStep + 1,
    })
  },

  overHelp: function() {
     this.setData({
       isNewMan: false
     });

     MyStorage.setItem('isPlanNewMan', false);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      loading: false
    })
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
    planController.submitPlanData()
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
    return {
      title: '用色彩渲染一天 用数据倾诉成长',
      path: 'pages/welcome/welcome',
      imageUrl: '/images/share.png',
    }
  }
})