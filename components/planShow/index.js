// components/planShow/index.js
// 显示的计划

import {
  PlanShow
} from './PlanShow.js'
import {createPlanDefaultData} from './createPlanDefaultData.js'
let globalData = getApp().globalData;
const createObserver = globalData.createObserver;
let planShow = new PlanShow();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    plan: {
      type: Array,
      value: [],
      observer: function(newValue, oldValue) {
          if(newValue.length === 0) {
            this.data.plan = createPlanDefaultData();
          }
      }
    },  
    clearChooseTag: {
      type: Boolean,
      value: false,
      observer: function() {
        let array = [];
        for (let i = 0; i < 24; i++) {
          let item = [false, false];
          array.push(item);
        }

        this.setData({
          planChoosedState: array
        })
      }
    },
    //帮助模式下，将启用某个块层叠级最高
    helpMode: {
      type: Boolean,
      value: false,
      observer: function(newValue) {
        console.log(newValue);
      }
    }
  },

  attached: function() {
     
    // let that = this;
    // let view = {};
    // createObserver(view);
    // view.on('updatePlans', (plans, dayId) => {
    //   that.setData({
    //     plans: plans,
    //     dayId: dayId
    //   })
    // })
    // planShow.init(view);
  },

  ready: function() {
    //初始化当前选中的任务，当前没有选中任何一个任务
    let array = [];
    for (let i = 0; i < 24; i++) {
      let item = [false, false];
      array.push(item);
    }

    this.setData({
      planChoosedState: array
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    plans: [],
    dayId: null,
    planChoosedState: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseMission: function(e) {
      let data = e.currentTarget.dataset;
      data.dayId = this.data.dayId;
      let planChoosedState = this.data.planChoosedState;

      if(planChoosedState[data.y][data.x]) {
        planChoosedState[data.y][data.x] = false;
        this.triggerEvent('cancelChooseMission', data);
      } else {
        planChoosedState[data.y][data.x] = true;
        this.triggerEvent('chooseMission', data);
      }

      this.setData({
        planChoosedState: planChoosedState
      })
      
    },

    completeAMission: function(e) {
        let data = e.target.dataset;

        this.triggerEvent('completeAMission', data);
    }
  }
})