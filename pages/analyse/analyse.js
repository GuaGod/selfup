import * as echarts from '../../ec-canvas/echarts';
 
function swiperDirection(x1, x2, y1, y2) {
  return Math.abs(x1 - x2) >=
    Math.abs(y1 - y2) ?
    (x1 - x2 >= 0 ? 'Left' : 'Right') :
    (y1 - y2 >= 0 ? 'Up' : 'Down')
}

import {
  Emotion,
  ThingData,
  MostThing,
  ThingFinish,
} from './chartUtil.js'

let globalData = getApp().globalData;
const analyseAPI = globalData.analyseAPI;
const MyHttp = globalData.MyHttp;


function createChart(option) {
  return function(canvas, width, height) {
    let chart;
    chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    chart.setOption(option);
    return chart;
  }
}

Page({
  onShareAppMessage: function(res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    }
  },
  data: {
    tStart: {
      pageX: 0,
      pageY: 0,
    },
    position: {
      pageX: 0,
      pageY: 0
    },
   emotion: {
     lazyLoad: true,
     disableTouch: true,
   },

   thingData: {
     lazyLoad: true,
     disableTouch: true,
   },

   mostThing: {
     lazyLoad: true,
     disableTouch: true,
   },
   
   thingFinish: {
     lazyLoad: true,
     disableTouch: true,
   },

   loading: true,
  },

  onLoad() {
    let that = this;

    this.emotionEcComponent = this.selectComponent('#emotion-dom');
    this.thingDataEcComponent = this.selectComponent('#thingData-dom');
    this.mostThingEcComponet = this.selectComponent('#mostThing-dom');
    this.thingFinishEcComponent = this.selectComponent('#thingFinish-dom');

    
    Promise.all([Emotion.createOption(7), ThingData.createOption(7)])
           .then(([emotionOption, thingDataOption]) => {
               this.setData({
                 loading: false
               })
               this.loadChart(emotionOption, 'emotion');
               this.loadChart(thingDataOption, 'thingData');     
               
               return Promise.resolve();
           }) 
           .then(() => {
             MostThing.createOption(7)
               .then((option) => {
                 this.loadChart(option, 'mostThing');
               })

             ThingFinish.createOption(7)
               .then((option) => {
                 this.loadChart(option, 'thingFinish');
              })
           })
    
  },

  back: function() {
     wx.navigateBack({
       delta: 1 
     })
  },

  onReady() {
    
  },

  /**
   * @argument option 配置项
   * @arument whichChart 表明当前查看的是哪个图标
   */

  loadChart: function(option, whichChart) {
    let ecComponent = null;
    let that = this;
    switch(whichChart) {
        case 'emotion': ecComponent = that.emotionEcComponent; break;
        case 'thingData': ecComponent = that.thingDataEcComponent; break; 
        case 'mostThing': ecComponent = that.mostThingEcComponet; break;
        case 'thingFinish': ecComponent = that.thingFinishEcComponent; break;
    }

    console.log(option);

    ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(option);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      return chart;
    });
  },

  /**
   * 修改当前显示的图标
   * data 如果是Object 说明是滑动触发 
   *      如果是String => whichChart
   */

  changeChart: function(data, dayNum) {
     let chart = null;
     let whichChart = '';
    
     if(typeof data === 'string') {
        whichChart = data;
     }

     if(data instanceof Object) {
      let current = data.detail.current;
      whichChart = '';
      
      switch(current) {
        case 0: whichChart = 'emotion'; break;
        case 1: whichChart = 'thingData'; break;
        case 2: whichChart = 'mostThing'; break;
        case 3: whichChart = 'thingFinish'; break;
      }
     }

     switch(whichChart) {
        case 'emotion': chart = Emotion; break;
        case 'thingData': chart = ThingData; break;
        case 'mostThing': chart = MostThing; break;
        case 'thingFinish': chart = ThingFinish; break;
     }

     chart.createOption(dayNum || 7)
          .then(option => {
            this.loadChart(option, whichChart);
          })
  },


});