/**
 * @class Emotion 负责生成情绪的图片 
 */
import * as echarts from '../../ec-canvas/echarts';
let globalData = getApp().globalData;
const analyseAPI = globalData.analyseAPI;
const MyHttp = globalData.MyHttp;

let indexAndWeekMap = new Map([
  [0, '第一周'],
  [1, '第二周'],
  [2, '第三周'],
  [3, '第四周'],
]);

let indexAndMonthMap = new Map([
  [0, '1月'],
  [1, '4月'],
  [2, '7月'],
  [3, '11月'],
])

/**
 * 处理创建日期的数组，把他们按从小到大顺序排序，并移除年份
 */
function operateCreateTimeArr(arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    arr[i] = arr[i].replace(/-/g, '');
    arr[i] = Number(arr[i]);
  }

  arr.sort((num1, num2) => {
    return num1 - num2;
  });

  for (let i = 0, len = arr.length; i < len; i++) {
    arr[i] %= 10000;
    arr[i] = arr[i] < 1000 ? `0${arr[i]}` : `${arr[i]}`
  }

  return arr;
}

class ThingData {
  constructor() {

  }

  static generateAnalyse(data, mode) {
    if (mode === 'year') {
      return [
        '您填写的数据太少啦！坚持记录吧！'
      ]
    }
    let maxThing = '';
    let maxRate = 0;
    let thingDataList = data.thingDataList;

    for (let i = 0, length = thingDataList.length; i < length; i++) {
      let item = thingDataList[i];
      if (item.thingClass != '睡眠' && item.thingClass != '吃饭' && Number(item.rate) > maxRate) {
        maxRate = Number(item.rate);
        maxThing = item.thingClass;
      }
    }

    if (maxThing === '') {
      return ['您还没有有效记录数据。']
    }

    let firstSentence = '';

    if (mode === 'week') {
      firstSentence += `除了吃饭和睡眠外，最近七天您做的最多的事情是${maxThing}，`;
    } else if (mode === 'month') {
      firstSentence += `除了吃饭和睡眠外，最近一个月您做的最多的事情是${maxThing}， `;
    } else if (mode === 'year') {
      firstSentence += `除了吃饭和睡眠外，最近一个月您做的最多的事情是${maxThing}， `;
    }

    let sentenceMap = (function (rate) {
      rate = Math.ceil(Number(rate) * 100);
      let studyStr = ``;
      if (rate > 90) {
        studyStr = `占了${rate}%，在学习的同时也要注重效率和劳逸结合。`
      } else if (rate > 70 && rate <= 90) {
        studyStr = `占了${rate}%，今天也是努力成长的你呢，努力的人可以发光呀，不过不要忘记效率~`
      } else {
        studyStr = `占了${rate}%，辛苦啦，明天也要继续加油呢。`
      }

      let playStr = ``;
      if (rate > 90) {
        playStr = `唉，怎么回事，怎么讲${rate}%的时间都用到娱乐里去啦？不要忘记那个想要成长的自己哦。`
      } else if (rate > 70 && rate <= 90) {
        playStr = `娱乐时间占了${rate}%，会不会有点多呢？要合理安排时间哦。`
      } else {
        playStr = `是放假了吗？最近娱乐的比重有点多哦~`
      }

      return new Map([
        ['学习', studyStr],
        ['娱乐', playStr],
        ['运动', '运动占的比重居然这么大，要注意安全哦。'],
        ['杂事', `杂事的比重占到了${rate}%，是不是没有合理安排时间导致时间太碎片化呢？`],
        ['吃饭', '怎么回事？吃饭的比重怎么会最大，是没好好记录吗？']
      ])
    })(maxRate);

    let secondSentence = sentenceMap.get(maxThing);

    return [firstSentence, secondSentence];
  }

  static handlerWeekData(data) {
    let legend = [];
    let series = [];
    data.thingDataList.forEach((item) => {
      legend.push(item.thingClass);
      let aSerie = {};
      aSerie.value = item.timeCount;
      aSerie.name = item.thingClass;
      series.push(aSerie);
    })

    if (data.thingDataList.length === 0) {
      series = [{
        value: 100,
        name: '未记录',
      }]
      legend = ['未记录'];
    }

    return {
      legend,
      series
    }
  }

  static handlerMonthData(data) {
    return ThingData.handlerWeekData(data);
  }

  static handlerYearData(data) {
    let legend = ['未记录'];
    let series = [
      {
        value: 100,
        name: '未记录',
      }
    ];

    return {
      legend,
      series
    }
  }
  /**
   * @method createOption 创建配置项
   * @arguments {Number} dayNum 返回几天的数据
   * @return {Promise(option)} 返回一个有option对象的promise
   */

  static createOption(mode, passData) {
    let urls = {
      'week': analyseAPI.thingDataListByWeek,
      'month': analyseAPI.thingDataListByMonth,
      'year': analyseAPI.thingDataListByYear,
    }

    let url = urls[mode] || urls['week'];
    return ThingData._getData(url, passData)
      .then(data => {
        if (!data.success) {
          Promise.reject();
        }

        //左上角提示
        let legend = [];

        //饼图
        let series = [];

        switch (mode) {
          case 'week': ({ legend, series } = ThingData.handlerWeekData(data)); break;
          case 'month': ({ legend, series } = ThingData.handlerMonthData(data)); break;
          case 'year': ({ legend, series } = ThingData.handlerYearData(data)); break;
          default: ({ legend, series } = ThingData.handlerWeekData(data)); break;
        }

        let option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            y: 'center',
            data: legend,
          },
          series: [{
            name: '时间分配表',
            type: 'pie',
            stillShowZeroSum: false,
            center: ['40%', '50%'],
            radius: '40%',
            data: series,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },

              normal: {
                color: function (params) {
                  //自定义颜色
                  let thingClass = params.data.name;
                  let strategy = {
                    '学习': '#c9e7fd',
                    '娱乐': '#fdcdcd',
                    '杂事': '#fbc4f8',
                    '运动': '#c3f5c5',
                    '睡眠': '#dbd3fd',
                    '吃饭': '#fbdfae',
                    '未记录': '#cdcdcd',
                  }

                  return strategy[thingClass];
                }
              }

            },
            label: {
              normal: {
                rich: {}
              }
            }
          }]
        };

        let suggest = ThingData.generateAnalyse(data, mode);

        return Promise.resolve({
          option,
          suggest,
        });
      }, (err) => {

        return Promise.reject(err);
      }).catch(err => {
        console.error(err);
      });
  }

  /**
   * @method _getData 从服务器获取数据
   * @aruments dayNum 获取几天的数据
   * @return {Promise(data)}  返回一个有创建option需要的数据的Promise
   */

  static _getData(url, passData) {

    return MyHttp.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: passData
    })
  }
}


class Emotion {
  constructor() {

  }

  static generateAnalyse(data, mode) {
    if(mode === 'year') {
      return [
        '您填写的数据太少啦！坚持记录吧！'
      ]
    }
    let emotionArray = [];
    let sum = 0;
    let {emotionList} = data;
    
    data.emotionList.forEach(item => {
      let emotion = Math.ceil((Number(item.emotionValue) + 8) * 6.25);

      emotionArray.push(emotion);
      sum += emotion;
    });

    emotionArray.sort();;
    let maxEmotion = emotionArray[emotionArray.length - 1];
    let minEmotion = emotionArray[0];
    let firstSentence = '';
    let secondSentence = '';
    
    
    if(Math.abs(maxEmotion -  minEmotion) > 40) {
      firstSentence += `这${mode === 'week' ? '周' : '月'}以来您的情绪起伏比较大呢，可以多思考，刨根问底地去深挖你情绪的具体原因，在这个过程中既能了解自己，也能转移自己在情绪上的注意力。`;
    } else {
      firstSentence += `这${mode === 'week' ? '周' : '月'}以来您的情绪起伏比较小呢，继续保持阅读和运动可以让自己的情绪保持平稳呢。`;
    }

    let average = Math.ceil(sum / (emotionArray.length));

    if(average < 30) {
      secondSentence += `这${mode === 'week' ? '周' : '月'}情绪怎么会这么低落？多听听音乐，和朋友谈谈心。`;
    } else if(average > 65) {
      secondSentence += `这${mode === 'week' ? '周' : '月'}情绪一直正面，要继续开心呐。`;
    }

    return [
      firstSentence,
      secondSentence
    ];
    }

  static handlerWeekData(data) {
    //存放日期
    let xAxis = [];
    //存放日期对应的情绪值
    let series = [];

    data.emotionList.forEach((item) => {
      xAxis.push(item.createTime);
      //-8 到 8的情绪值 映射到 0 100 
      let emotion = Math.ceil((Number(item.emotionValue) + 8) * 6.25);
      if (emotion < 0) {
        emotion = 0;
      }
      if (emotion > 100) {
        emotion = 100
      }
      series.push(emotion);
    });

    xAxis = operateCreateTimeArr(xAxis);

    return {
      xAxis,
      series,
    }
  }
  static handlerMonthData(data) {
    let xAxis = [];
    let series = [];

    data.emotionList.forEach((item, index) => {
      xAxis.push(indexAndWeekMap.get(index));
      let emotion = Math.ceil((Number(item.emotionValue) + 8) * 6.25);
      if (emotion < 0) {
        emotion = 0;
      }
      if (emotion > 100) {
        emotion = 100
      }
      series.push(emotion);
    })

    return {
      xAxis,
      series,
    }
  }
  static handlerYearData(data) {
    let xAxis = [];
    let series = [];
    for(let i = 0; i < 4; i++) {
      xAxis.push(indexAndMonthMap.get(i));
      series.push(0);
    }
              
    return {
      xAxis,
      series,
    }
  }

  /**
   * @method createOption 创建配置项
   * @arguments {Number} dayNum 返回几天的数据
   * @return {Promise(option)} 返回一个有option对象的promise
   */

  static createOption(mode, passData) {
    let urls = {
      'week': analyseAPI.emotionListByWeek,
      'month': analyseAPI.emotionListByMonth,
      'year': analyseAPI.emotionListByYear,
    }

    let url = urls[mode] || urls['week'];

    return Emotion._getData(url, passData)
      .then(data => {
        if (!data.success) {
          Promise.reject();
        }

        let xAxis, series;
        switch(mode) {
          case 'week': ({ xAxis, series } = Emotion.handlerWeekData(data)); break;
          case 'month': ({xAxis, series} = Emotion.handlerMonthData(data)); break;
          case 'year': ({xAxis, series} = Emotion.handlerYearData(data)); break;
          default : ({ xAxis, series } = Emotion.handlerWeekData(data)); break;
        }
         
        let option = {
          xAxis: {
            type: 'category',
            data: xAxis,
            silent: true,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#bbbbbb'
              }
            },
            axisLabel: {
              testStyle: {
                color: '#bbbbbb',
              },
              interval: 0,
              rich: {}
            },
          },
          yAxis: {
            type: 'value',
            silent: true,
            min: 0,
            max: 100,
            axisLine: { //轴线
              show: false,
              lineStyle: {
                color: 'transparent'
              }
            },
            splitLine: { //网格中的横线
              show: true,
              lineStyle: {
                color: '#e9e9e9',
              }
            }
          },
          series: [{
            data: series,
            type: 'bar',
            label: {
              normal: {
                rich: {}
              }
            },
            itemStyle: { //数据的颜色
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#8d8d8d'
                  }
                },
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#ffcdcb'
                }, {
                  offset: 1,
                  color: '#bfcefe'
                }]),
                barBorderRadius: [8, 8, 8, 8],
              },

            },
            barWidth: 12

          }]
        };
        
        let suggest;
        if(mode === 'year') {
          suggest =  [
            '您填写的数据太少啦！坚持记录吧！'
          ];
        } else {
          suggest = [data.suggest];
        }

        return Promise.resolve({
          option,
          suggest
        });
      }, (err) => {

        return Promise.reject(err);
      }).catch(err => {
        console.error(err);
      })
  }

  /**
   * @method _getData 从服务器获取数据
   * @aruments dayNum 获取几天的数据
   * @return {Promise(data)}  返回一个有创建option需要的数据的Promise
   */

  static _getData(url, passData) {

    return MyHttp.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: passData
    })
  }
}



class MostThing {
  constructor() {

  }

  static generateAnalyse(data1, data2, mode) {
    if (mode === 'year') {
      return [
        '您填写的数据太少啦！坚持记录吧！'
      ]
    }
    let emotionArray = [];
    let mostThingList = data1.mostThingList;
    let emotionList = data2.emotionList;
    let happyEmotionMaxCountTime = 0;
    let normalEmotionMaxCountTime = 0;
    let sadEmotionMaxCountTime = 0;

    let happyEmotionThingName = ``;
    let normalEmotionThingName = ``;
    let sadEmotionThingName = ``;
    let happyEmotionThing = ``;
    let normalEmotionThing = ``;
    let sadEmotionThing = ``;
   
    for(let i = 0, length = emotionList.length; i < length; i++) {
      let emotion = Math.ceil((Number(emotionList[i].emotionValue) + 8) * 6.25);
      if(mostThingList[i].thingName === '无日程') {
        continue;
      } 
      
      let countTime = mostThingList[i].countTime;
      let mostThing = mostThingList[i].thingClass;
      let mostThingName = mostThingList[i].thingName;

      if(mostThing === '睡眠' || mostThing === '吃饭') {
        continue;
      }
      if(emotion < 45) {
        if(countTime > sadEmotionMaxCountTime) {
          sadEmotionMaxCountTime = countTime;
          sadEmotionThing = mostThing;
          sadEmotionThingName = mostThingName;
        }
      } else if(emotion >= 45 && emotion <= 55) {
        if(countTime > normalEmotionMaxCountTime) {
          normalEmotionMaxCountTime = countTime;
          normalEmotionThing = mostThing;
          normalEmotionThingName = mostThingName;
        }
      } else {
        if(countTime > happyEmotionMaxCountTime) {
          happyEmotionMaxCountTime = countTime;
          happyEmotionThing = mostThing;
          happyEmotionThingName = mostThingName;
        }
      }
      

      let firstSentence = ``
      if(happyEmotionThing !== ``) {
        firstSentence += `您这${mode === 'week' ? '周' : '月'}在开心的时候做的最多的事是${happyEmotionThingName},`;
        let happyEmotionThingMap = new Map([
          ['学习', '学习可以让你变得更开心呢，要继续努力呀。'],
          ['运动', '运动可以让你开心，在有压力的时候可以缓解压力情绪，不过要在合理范围内坚持运动哦。'],
          ['杂事', '处理生活中的杂事可以让您感到开心，您是一个热爱生活的人吧。'],
          ['娱乐', '娱乐让您感到开心，劳逸结合可以让您彻底放松，恢复精力，也可以提高效率。'],
        ]);
        firstSentence += `${happyEmotionThingMap.get(happyEmotionThing)}`;
      }
      
      let secondSentence = ``;
      if(sadEmotionThing !== ``) {
        secondSentence += `您这${mode === 'week' ? '周' : '月'}在不开心的时候做的最多的事是${sadEmotionThingName},`
        let sadEmotionThingMap = new Map([
          ['学习', '是刚学习新的东西还没有掌握到方法吗？还是因为你难过的时候喜欢用学习的方式来补偿自己呢？'],
          ['运动', '是因为运动身体受伤了吗？要注意安全啊，在合理范围内根据自己的身体状况选择合适的类型和强度拉。'],
          ['杂事', '杂事虽然让您不开心，但也要合理处理好杂事，生活会更加整洁有序哦。关键要合理安排处理杂事的时间和方式。'],
          ['娱乐', '是因为还没有完成任务就去玩耍了而背负罪恶感不开心啊？先把任务完成了，再去娱乐的话会比较好。'],
        ]);

        secondSentence += `${sadEmotionThingMap.get(sadEmotionThing)}`;
      }

      let thirdSentence = ``;
      if(normalEmotionThing !== '') {
        thirdSentence += `您在情绪一般的时候做的最多的事是${normalEmotionThingName}，${normalEmotionThing}可以让您情绪稳定，可以继续保持。`;
      }

      return [
        firstSentence,
        secondSentence,
        thirdSentence
      ];
    }
  }

  static handlerWeekData(mostThingList, emotionList) {
    let xAxis = [];
    let mostThingSeries = [];
    let mostThingMark;
    let emotionSeries = [];
    
    for(let i = 0, length = emotionList.length; i < length; i++) {
      emotionSeries.push(Math.round(Number(emotionList[i].emotionValue) * 100)/100);

      xAxis.push(mostThingList[i].createTime);

      let aSerie = {};
      
      aSerie.value = Math.round(Number(emotionList[i].emotionValue) * 100) / 100;
      aSerie.name = mostThingList[i].thingName;
        
      if(aSerie.name === '无日程') {
        aSerie.name = '无';
      }

      mostThingSeries.push(aSerie);
    }
    
    xAxis = operateCreateTimeArr(xAxis);
   
    return {
      xAxis,
      mostThingSeries,
      mostThingMark,
      emotionSeries,
    }
  }

  static handlerMonthData(mostThingList, emotionList) {
    let xAxis = [];
    let mostThingSeries = [];
    let mostThingMark;
    let emotionSeries = [];
    
    for (let i = 0, length = emotionList.length; i < length; i++) {
      emotionSeries.push(Math.round(Number(emotionList[i].emotionValue) * 100) / 100);

      xAxis.push(indexAndWeekMap.get(mostThingList[i].whichWeek - 1));

      let aSerie = {};
      aSerie.value = Math.round(Number(emotionList[i].emotionValue) * 100) / 100;
      aSerie.name = mostThingList[i].thingName;

      if (aSerie.name === '无日程') {
        aSerie.name = '无';
      }

      mostThingSeries.push(aSerie);
    }

    return {
      xAxis,
      mostThingSeries,
      mostThingMark,
      emotionSeries,
    }
  }

  static handlerYearData(mostThingList, emotionList) {
    let xAxis = [];
    let mostThingSeries = [];
    let mostThingMark;
    let emotionSeries = [];

    for (let i = 0, length = 4; i < length; i++) {
      emotionSeries.push(0);

      xAxis.push(indexAndMonthMap.get(i));

      let aSerie = {};
      aSerie.value = 0;
      aSerie.name = '无';

      mostThingSeries.push(aSerie);
    }

    return {
      xAxis,
      mostThingSeries,
      mostThingMark,
      emotionSeries,
    }
  }

  /**
   * @method createOption 创建配置项
   * @arguments {Number} dayNum 返回几天的数据
   * @return {Promise(option)} 返回一个有option对象的promise
   */

  static createOption(mode, passData) {
    let urls1 = {
      'week': analyseAPI.mostThingListByWeek,
      'month': analyseAPI.mostThingListByMonth,
      'year': analyseAPI.mostThingListByYear,
    }

    let urls2 = {
      'week': analyseAPI.emotionListByWeek,
      'month': analyseAPI.emotionListByMonth,
      'year': analyseAPI.emotionListByYear,
    }

    let url1 = urls1[mode] || urls1['week'];
    let url2 = urls2[mode] || urls2['week'];

    return MostThing._getData(url1, url2,  passData)
      .then((res) => {
        let mostThingListData = res[0];
        let emotionListData = res[1];

        if (!mostThingListData.success || !emotionListData.success) {
          return Promise.reject();
        }

        let {
          mostThingList
        } = mostThingListData;
        let {
          emotionList
        } = emotionListData;
          
        let xAxis = [];
        let mostThingSeries = [];
        let mostThingMark;
        let emotionSeries = [];

        
        switch(mode) {
          case 'week': ({xAxis, mostThingSeries, mostThingMark, emotionSeries} = MostThing.handlerWeekData(mostThingList, emotionList)); break;
          case 'month': ({ xAxis, mostThingSeries, mostThingMark, emotionSeries } = MostThing.handlerMonthData(mostThingList, emotionList)); break;
          case 'year': ({xAxis, mostThingSeries, mostThingMark, emotionSeries} = MostThing.handlerYearData(mostThingList, emotionList)); break;
          default: ({ xAxis, mostThingSeries, mostThingMark, emotionSeries } = MostThing.handlerWeekData(mostThingList, emotionList)); break;
        }


        let option = {
          grid: {
             top: 70
          },
          legend: {
            data: [{
              name: '最多做的事',
            }, {
              name: '情绪值'
            }],
             y: '30rpx',
          },
          xAxis: [{
            type: 'category',
            data: xAxis,
            silent: true,
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#bbbbbb'
              }
            },
            axisLabel: {
              testStyle: {
                color: '#bbbbbb'
              },
              rich: {},
              inserval: 0,
            }
          }],
          yAxis: [{
              type: 'value',
              name: '最多做的事',
              silent: true,
              axisLabel: {
                formatter: '{value}'
              },
              axisLine: { //轴线
                show: false,
                lineStyle: {
                  color: 'transparent'
                }
              },
              splitLine: { //网格中的横线
                show: true,
                lineStyle: {
                  color: '#e9e9e9',
                }
              }
            },
            {
              type: 'value',
              name: '情绪值',
              axisLabel: {
                formatter: '{value}'
              },
              axisLine: { //轴线
                show: false,
                lineStyle: {
                  color: 'transparent'
                }
              },
            }
          ],
          series: [{
              name: '最多做的事',
              type: 'scatter',
              symbolSize: 10,
              data: mostThingSeries,
              clickable: false,
              itemStyle: { //数据的颜色
                normal: {
                  color: function(params) {
                    //自定义颜色
                    let thingClass = params.data.name;
                    let strategy = {
                      '学习': '#c9e7fd',
                      '娱乐': '#fdcdcd',
                      '杂事': '#fbc4f8',
                      '运动': '#c3f5c5',
                      '睡眠': '#dbd3fd',
                      '吃饭': '#fbdfae',
                      '未记录': '#cdcdcd',
                    }

                    return strategy[thingClass];
                  }
                }

              },
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  formatter: '{b}',
                  textStyle: {
                    fontSize: 10,
                    color: '#000'
                  },
                  // rich: {},
                }
              },
            },
            {
              name: '情绪值',
              type: 'line',
              yAxisIndex: 1,
              data: emotionSeries,
              clickable: false,
              smooth: true,
              itemStyle: { //数据的颜色
                color: '#ffcdcb'
              },
              // new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              //   offset: 0,
              //   color: '#ffcdcb'
              // }, {
              //   offset: 1,
              //   color: '#bfcefe'
              // }]),
              // label: {
              //   normal: {
              //     rich: {}
              //   }
              // }
            }
          ]
        };
        
        let suggest = MostThing.generateAnalyse(mostThingListData, emotionListData, mode);

        return Promise.resolve({
          option,
          suggest
        });
      }, (err) => {

        return Promise.reject(err);
      }).catch(err => {
        console.error(err);
      });
  }

  /**
   * @method _getData 从服务器获取数据
   * @aruments dayNum 获取几天的数据
   * @return {Promise(data)}  返回一个有创建option需要的数据的Promise
   */

  static _getData(url1, url2, passData) {

    return Promise.all([MyHttp.request({
      url: url1,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: passData
    }), MyHttp.request({
      url: url2,
      data: passData,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
    })])

  }
}


class ThingFinish {
  constructor() {

  }

  static generateAnalyse(data, mode) {
    if (mode === 'year') {
      return [
        '您填写的数据太少啦！坚持记录吧！'
      ]
    }
    let { thingFinishList } = data;
    let mostFinishDegree = 0;
    let mostFinishDateIndex = 0;

    let minFinishDegree = 200;
    let minFinishDateIndex = 0;
    let finishDegreeSum = 0;
    
    for(let i = 0, length = thingFinishList.length; i < length; i++) {
      let item = thingFinishList[i];
      if(Number(item.finishedDegree) > mostFinishDegree) {
        mostFinishDegree = Math.ceil(Number(item.finishedDegree * 100));
        mostFinishDateIndex = i;
      }

      if(Number(item.finishedDegree) < minFinishDegree) {
        minFinishDegree = Math.ceil(Number(item.finishedDegree * 100));
        minFinishDateIndex = i;
      }

      finishDegreeSum += Number(item.finishedDegree);
    }

    let averageFinishDegree = Math.ceil(finishDegreeSum * 100/ thingFinishList.length);
    let firstSentence = `在最近一${mode === 'week' ? '周' : '月'}您任务完成度最高的一${mode === 'week' ? '天' : '周'}是第${mostFinishDateIndex + 1}${mode === 'week' ? '天' : '周'}，完成了${mostFinishDegree}%，您任务完成度最低的一${mode === 'week' ? '天' : '周'}是第${minFinishDateIndex + 1}${mode === 'week' ? '天' : '周'}，完成了${minFinishDegree}%，这一${mode === 'week' ? '周' : '月'}任务完成度平均值是${averageFinishDegree}%。`;
    
    let secondSentence = ``
    if(averageFinishDegree === 100) {
      secondSentence = `这${mode === 'week' ? '周' : '月'}完美完成计划！您做的很棒，奖励一下自己吧~`;
    } else if(averageFinishDegree > 70 && averageFinishDegree < 100) {
      secondSentence = `这${mode === 'week' ? '周' : '月'}任务完成的很好，相信您一定在某方面有所进步了。`;
    } else if(averageFinishDegree > 50 && averageFinishDegree <= 70) {
      secondSentence = `这${mode === 'week' ? '周' : '月'}任务完成的不是很好哦，思考一下是偷懒了还是计划不合理。`;
    } else {
      secondSentence = `这${mode === 'week' ? '周' : '月'}任务完成的不好哦，偷懒了吗？还是最近特殊情况需要调整一下计划？`
    }
     
    let thirdSentence = ``;

    if(mostFinishDegree - minFinishDegree >= 40) {
      thirdSentence = `任务完成度差别很大，要注意坚持呢。`
    }

    return [firstSentence, secondSentence, thirdSentence];
  }

  static handlerWeekData(data) {
    let series = [];
    let createTimeArr = [];

    data.thingFinishList.forEach((item) => {
      series.push(Math.ceil(Number(item.finishedDegree) * 100));
      let timeItem = {};
      timeItem.name = item.createTime.replace(/-/g, '').slice(4);
      timeItem.max = 100;
      createTimeArr.push(timeItem);
    })

    return {
      series,
      createTimeArr,
    }
  }

  static handlerMonthData(data) {
    let series = [];
    let createTimeArr = [];

    data.thingFinishList.forEach((item) => {
      series.push(Math.ceil(Number(item.finishedDegree) * 100));
      let timeItem = {};
      timeItem.name = indexAndWeekMap.get(item.whichWeek - 1);
      timeItem.max = 100;
      createTimeArr.push(timeItem);
    })

    return {
      series,
      createTimeArr,
    }
  }

  static handlerYearData(data) {
    let series = [];
    let createTimeArr = [];
    
    for(let i = 0; i < 4; i++) {
      series.push(0);
      let timeItem = {};
      timeItem.name = indexAndMonthMap.get(i);
      timeItem.max = 100;
      createTimeArr.push(timeItem);
    }

    return {
      series,
      createTimeArr,
    }
  }

  /**
   * @method createOption 创建配置项
   * @arguments {Number} dayNum 返回几天的数据
   * @return {Promise(option)} 返回一个有option对象的promise
   */

  static createOption(mode, passData) {
    let urls = {
      'week': analyseAPI.thingFinishListByWeek,
      'month': analyseAPI.thingFinishListByMonth,
      'year': analyseAPI.thingFinishListByYear,
    }

    let url = urls[mode] || urls['week'];

    return ThingFinish._getData(url, passData)
      .then(data => {
        if (!data.success) {
          Promise.reject();
        }

        let series = [];
        let createTimeArr = [];

        switch (mode) {
          case 'week': ({ createTimeArr, series } = ThingFinish.handlerWeekData(data)); break;
          case 'month': ({ createTimeArr, series } = ThingFinish.handlerMonthData(data)); break;
          case 'year': ({ createTimeArr, series } = ThingFinish.handlerYearData(data)); break;
          default: ({ createTimeArr, series } = ThingFinish.handlerWeekData(data)); break;
        }

        let option = {
          grid: {
            position: 'bottom',
          },
          radar: {
            name: {
              textStyle: {
                color: '#bbbbbb',
              },
              rich: {
                
              }
            },
            itemStyle: {
              borderColor: '#bbb',
            },
            indicator: createTimeArr,
            center: ['50%', '55%'],
            radius: 70
          },
          series: [{
            name: '任务完成度',
            label: {
              show: false,
            },
            itemStyle: {
              normal: {
                areaStyle: {
                  type: 'default',
                  color: '#c7cef7',
                },
                color: 'rgb(210, 210, 210)'
              },

            },
            type: 'radar',
            data: [{
              value: series,
              name: '完成度'
            },]
          }]
        };

        let suggest = ThingFinish.generateAnalyse(data, mode);

        return Promise.resolve({
          option,
          suggest,
        });
      }, (err) => {

        return Promise.reject(err);
      }).catch(err => {
        console.error(err);
      });
  }

  /**
   * @method _getData 从服务器获取数据
   * @aruments dayNum 获取几天的数据
   * @return {Promise(data)}  返回一个有创建option需要的数据的Promise
   */

  static _getData(url, passData) {
    return MyHttp.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: passData,
    })
  }
}


export {
  Emotion,
  ThingData,
  MostThing,
  ThingFinish,
}