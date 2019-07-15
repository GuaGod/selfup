// components/planHeader/index.js
//计划页面的header
import { PlanHeader } from './PlanHeader.js'
let globalData = getApp().globalData;
const createObserver = globalData.createObserver;
const MyDate = globalData.MyDate;
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
    date: {
      type: String, 
      value: MyDate.createTodayDateStr().replace(/-/g, '/'),
      observer: function(newValue) {
         newValue = newValue.replace(/-/g, '');
         newValue = newValue.slice(0, 4) + '/' + newValue.slice(4, 6) + '/' + newValue.slice(6);
         this.setData({
           _date: newValue
         })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _date: MyDate.createTodayDateStr().replace(/-/g, '/'),
    statusHeight: 0,
  },

  ready: function () {
    let that = this;
    let view = {};
     
    createObserver(view);
    
    this.setData({
      statusHeight: globalData.phoneInfo.statusBarHeight
    })
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
