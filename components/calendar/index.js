// components/calendar/index.js
import {Calendar} from './Calendar.js'
let globalData = getApp().globalData;
const createObserver = globalData.createObserver;
let calendar = new Calendar();
let view = {};

function swiperDirection(x1, x2, y1, y2) {
  return Math.abs(x1 - x2) >=
    Math.abs(y1 - y2) ?
    (x1 - x2 >= 0 ? 'Left' : 'Right') :
    (y1 - y2 >= 0 ? 'Up' : 'Down')
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
     
  },

  /**
   * 组件的初始数据
   */
  data: {
    year: "",                  //当前年
    month: "",                 //当前月
    weekHead: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],               //周的head
    tStart: {
      pageX: 0,
      pageY: 0,
    },
    position: {
      pageX: 0,
      pageY: 0
    },
    lock: false,
    forbidBoxs: [],         //每个月开头有几天是空白的
    planList: [],           //计划
  },

  attached: function() {
      let that = this;
   
      createObserver(view);
      view.on('change', function(data) {
          that.setData({
            year: data.year,
            month: data.month,
            forbidBoxs: data.forbidBoxs,
            planList: data.planList
          })
      });

      calendar.init(view);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlerTouchstart: function (event) {
      if(this.data.lock) {
        return;
      }
      const touches = event.touches ? event.touches[0] : {};
      const tStart = this.data.tStart;
      if (touches) {
        for (let i in tStart) {
          if (touches[i]) {
            tStart[i] = touches[i];
          }
        }
      }

    },

    handlerTouchmove(event) {
      if(this.data.lock) {
        return;
      }
      const start = this.data.tStart;
      const touches = event.touches ? event.touches[0] : {};

      if (touches) {
        const direction = swiperDirection(start.pageX, touches.pageX, start.pageY, touches.pageY);
        
        if (direction === 'Up') {
          this.before();
        }

        if (direction === 'Down') {
          this.next();
        }

        this.setData({
          lock : true
        })

        setTimeout(() => {
          this.setData({
            lock: false
          })
        },500);
      }
    },

    next: function() {
        calendar.next();
    },

    before: function() {
        calendar.before();
    },

    changeNowDate: function(detail) {
      let month = calendar.month;
      let year = calendar.year;
      let day = detail.currentTarget.dataset.day;
      if(day < 10) {
        day = '0' + day;
      } else {
        day = String(day);
      }

      this.triggerEvent('changeNowDate', {
        dateStr: year + '-' + month + '-'+ day
      }, {
        composed: true, 
        bubbles: true
      })
    }
  }
})
