// components/planHeader/index.js
//计划页面的header
import { PlanHeader } from './PlanHeader.js'
let globalData = getApp().globalData;
const createObserver = globalData.createObserver;
let planHeader = new PlanHeader();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isCalendarShow: {
      type: Boolean,
      value: true,
    },
    isCloseShow: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  ready: function () {
    let that = this;
    let view = {};
    createObserver(view);
    
    //接收子级传输的数据
    view.on('switchState', (tapWhich, data) => {
        that.setData({
          isCalendarShow: data.isCalendarShow,
          isExpandShow: data.isExpandShow,
          isCloseShow: data.isCloseShow,
        });
       
      that.triggerEvent(tapWhich, {}, {
          bubbles: true,
          composed: true
        });
    });

    planHeader.init(view);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTapCalendar: function () {
      planHeader.tapCalendar();
    },

    onTapExpand: function () {
      planHeader.tapExpand();
    },

    onTapClose: function () {
      planHeader.tapClose();
    },

    back: function() {
      wx.navigateBack({
        delta: 1
      })
    },
  }
})
