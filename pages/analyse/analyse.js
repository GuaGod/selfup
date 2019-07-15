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
const MyDate = globalData.MyDate;
let showChartMap = new Map([
  [0, {chartName: 'thingData', chart: ThingData}],
  [1, {chartName: 'emotion', chart: Emotion}],
  [2, {chartName:'mostThing', chart: MostThing}],
  [3, {chartName: 'thingFinish', chart: ThingFinish}],
])

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
      title: '用色彩渲染一天 用数据倾诉成长',
      path: 'pages/welcome/welcome',
      imageUrl: '/images/share.png',
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
   showChartIndex: 0,
   lefts: [0, 750, 1500, 2250],
   marginLefts: [89, -44.5, 0, 0],
   showRangeSize: 'week',
   passData: {
     
   },
   emotion: {
     lazyLoad: true,
     disableTouch: true,
   },
   emotionInstance: null,
   emotionImage: null,
   emotionSuggest: '',
   thingData: {
     lazyLoad: true,
     disableTouch: true,
   },
   thingDataInstance: null,
   thingDataImage: null,
   thingDataSuggest: '',
   mostThing: {
     lazyLoad: true,
     disableTouch: true,
   },
   mostThingInstance: null,
   mostThingImage: null,
   mostThingSuggest: '',
   thingFinish: {
     lazyLoad: true,
     disableTouch: true,
   },
   thingFinshiInstance: null,
   thingFinishImage: null,
   thingFinishSuggest: '',
   loading: false,
   imageShow: {
     thingData: false,
     emotion: false,
     thingFinish: false,
     mostThing: false
   }
  },

  onLoad() {
    let that = this;
    let {mondayDate, sundayDate} = MyDate.calculateMondayAndSunday(new Date());
    let mondayDateStr = MyDate.parseStandard(mondayDate);
    let sundayDateStr = MyDate.parseStandard(sundayDate);
    this.setData({
      passData: {
        day1: mondayDateStr,
        day2: sundayDateStr,
      }
    })

    this.emotionEcComponent = this.selectComponent('#emotion-dom');
    this.thingDataEcComponent = this.selectComponent('#thingData-dom');
    this.mostThingEcComponet = this.selectComponent('#mostThing-dom');
    this.thingFinishEcComponent = this.selectComponent('#thingFinish-dom');

    this.updateNowChart();
  },

  updateNowChart(passData) {
    passData = passData || this.data.passData;
    let mode = this.data.showRangeSize;
    let {chart, chartName} = showChartMap.get(this.data.showChartIndex);
    
    chart.createOption(mode, passData)
         .then(({option, suggest}) => {
           this.loadChart(option, suggest || '', chartName);
         })
  },

  back: function() {
     wx.navigateBack({
       delta: 1 
     })
  },
  
  /**
   * 滑动切换图标
   */
  // handlerTouchstart: function (event) {
  //   if(this.data.lock) {
  //     return;
  //   }
  //   const touches = event.touches ? event.touches[0] : {};
  //   const tStart = this.data.tStart;
  //   if (touches) {
  //     for (let i in tStart) {
  //       if (touches[i]) {
  //         tStart[i] = touches[i];
  //       }
  //     }
  //   }

  // },

  // handlerTouchmove(event) {
  //   if(this.data.lock) {
  //     return ;
  //   }
  //   const start = this.data.tStart;
  //   const touches = event.touches ? event.touches[0] : {};
    
  //   if(touches) {
  //     const direction = swiperDirection(start.pageX, touches.pageX, start.pageY, touches.pageY);
       
  //     if (direction === 'Right') {
  //       this.beforeChart();
  //     }

  //     if (direction === 'Left') {
  //       this.nextChart();
  //     }

  //     this.setData({
  //       lock: true
  //     });

  //     setTimeout(() => {
  //       this.setData({
  //         lock: false
  //       })
  //     }, 500);
  //   }
  // },

  beforeChart() {
    let showChartIndex = this.data.showChartIndex;
    showChartIndex--;
    if(showChartIndex < 0) {
      return ;
    }

    this.loading(1000);
    
    let lefts = this.data.lefts;
    let marginLefts = this.data.marginLefts;
    for (let i = 0, length = lefts.length; i < length; i++) {
      lefts[i] += 750;
      marginLefts[i] = 0;
    }

    marginLefts[showChartIndex + 1] = -44.5;
    marginLefts[showChartIndex] = 89;
    if (showChartIndex - 1 >= 0) {
      marginLefts[showChartIndex - 1] = 222.5;
    }

    this.setData({
      showChartIndex,
      lefts,
      marginLefts,
    })

    this.updateNowChart();
  },

  nextChart() {
    let showChartIndex = this.data.showChartIndex;
    showChartIndex++;
    if (showChartIndex >= this.data.lefts.length) {
      return;
    }

    this.loading(1000);

    let lefts = this.data.lefts;
    let marginLefts = this.data.marginLefts;
    for (let i = 0, length = lefts.length; i < length; i++) {
      lefts[i] -= 750;
      marginLefts[i] = 0;
    }

    marginLefts[showChartIndex - 1] = 222.5;
    marginLefts[showChartIndex] = 89;
    if (showChartIndex + 1 < lefts.length) {
      marginLefts[showChartIndex + 1] = -44.5;
    }
    
    this.setData({
      showChartIndex,
      lefts,
      marginLefts,
    })

    this.updateNowChart();
  },

  onReady() {
    
  },

  /**
   * @argument option 配置项
   * @arument whichChart 表明当前查看的是哪个图标
   */

  loadChart: function(option, suggest, whichChart) {
    let ecComponent = null;
    let that = this;
    switch(whichChart) {
        case 'emotion': ecComponent = that.emotionEcComponent; break;
        case 'thingData': ecComponent = that.thingDataEcComponent; break; 
        case 'mostThing': ecComponent = that.mostThingEcComponet; break;
        case 'thingFinish': ecComponent = that.thingFinishEcComponent; break;
    }

    if(!this[whichChart + 'Instance']) {
      ecComponent.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        chart.setOption(option);
        
        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        this[whichChart + 'Instance'] = chart;
        return chart;
      });
      
    } else {
      this[whichChart + 'Instance'].setOption(option);
    }
    
    let suggestStr = ``;
    for(let i = 0, length = suggest.length; i < length; i++) {
      suggestStr += suggest[i];
    }

    if(suggestStr === '') {
      suggestStr = '您还没有有效的记录数据，快去记录吧！';
    }

    this.setData({
      [whichChart + 'Suggest']: suggestStr
    })
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

  onSwitchRangeSize(e) {
    const range = e.target.dataset.range;
    let passData = null;

    this.loading(1000);

    function createWeekPassData() {
      let { mondayDate, sundayDate } = MyDate.calculateMondayAndSunday(new Date());
      let mondayDateStr = MyDate.parseStandard(mondayDate);
      let sundayDateStr = MyDate.parseStandard(sundayDate);

      return {
        day1: mondayDateStr,
        day2: sundayDateStr
      }
    }

    function createMonthPassData() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;

      month = month < 10 ? '0' + month : String(month);

      return {yearMonth : `${year}-${month}`};
    }

    function createYearPassData() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;

      month = month < 10 ? '0' + month : String(month);

      return { yearMonth: `${year}-${month}` };
    }
    
    switch(range) {
      case 'week' : passData = createWeekPassData(); break;
      case 'month': passData = createMonthPassData(); break;
      case 'year': passData = createYearPassData(); break;
    }
    this.setData({
      showRangeSize: range,
      passData
    })

    this.updateNowChart();
  },

  loading: function(duration) {
    wx.showLoading({
      title: '加载中',
      duration: duration,
      mask: true
    })
  },

  onTapBeforeWeek({ detail }) {
    this.loading(1000);
    let { startDate, endDate } = detail;
    this.changeShowWeek(startDate, endDate);
  },
  
  onTapNextWeek({ detail }) {
    this.loading(1000);
    let { startDate, endDate } = detail;
    this.changeShowWeek(startDate, endDate);
  },

  changeShowWeek(startDate, endDate) {
    let startDateStr = MyDate.parseStandard(startDate);
    let endDateStr = MyDate.parseStandard(endDate);

    this.setData({
      passData: {
        day1: startDateStr,
        day2: endDateStr,
      }
    })

    this.updateNowChart();
  },

  onTapBeforeMonth({ detail }) {
    this.loading(1000);
    let { date } = detail;
    this.changeShowMonth(date);
  },

  onTapNextMonth({ detail }) {
    this.loading(1000);
    let {date} = detail;
    this.changeShowMonth(date);
  },

  changeShowMonth(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;

    month = month < 10 ? '0' + month : String(month);
    
    this.setData({
      passData: { yearMonth: `${year}-${month}` }
    });

    this.updateNowChart();
  },

  onTapBeforeYear({ detail }) {
    this.loading(1000);
    let {date} = detail;
    this.changeShowYear(date);
  },

  onTapNextYear({ detail }) {
    this.loading(1000);
    let { date } = detail;
    this.changeShowYear(date);
  },
  
  changeShowYear(date) {
    /**
     * donothing;
     */
  },
});