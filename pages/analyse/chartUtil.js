/**
 * @class Emotion 负责生成情绪的图片 
 */
import * as echarts from '../../ec-canvas/echarts';
let globalData = getApp().globalData;
const analyseAPI = globalData.analyseAPI;
const MyHttp = globalData.MyHttp;

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

class Emotion {
  constructor() {

  }

  /**
   * @method createOption 创建配置项
   * @arguments {Number} dayNum 返回几天的数据
   * @return {Promise(option)} 返回一个有option对象的promise

   */

  static createOption(dayNum) {
    return Emotion._getData(dayNum)
      .then(data => {
        if (!data.success) {
          Promise.reject();
        }

        //存放日期
        let xAxis = [];
        //存放日期对应的情绪值
        let series = [];

        data.emotionList.forEach((item) => {
          xAxis.push(item.createTime);
          //-8 到 8的情绪值 映射到 0 100 
          let emotion = Math.ceil((Number(item.emotionValue) + 8) * 6.25);
          if(emotion < 0) {
            emotion = 0;
          } 
          if(emotion > 100) {
            emotion = 100
          }
          series.push(emotion);
        });
        series.reverse();
        xAxis = operateCreateTimeArr(xAxis);

        let option = {
          title: {
            text: '情绪值(。・∀・)ノ',
            left: 'center',
            textStyle: {
              color: '#8d8d8d'
            }
          },
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
                color: '#bbbbbb'
              }
            }
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

        return Promise.resolve(option);
      }, (err) => {

        return Promise.reject(err);
      }).catch(err => {
        console.err(err);
      })
  }

  /**
   * @method _getData 从服务器获取数据
   * @aruments dayNum 获取几天的数据
   * @return {Promise(data)}  返回一个有创建option需要的数据的Promise
   */

  static _getData(dayNum) {

    return MyHttp.request({
      url: analyseAPI.emotionList,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
        dayNum: dayNum
      }
    })
  }
}

class ThingData {
  constructor() {

  }

  /**
   * @method createOption 创建配置项
   * @arguments {Number} dayNum 返回几天的数据
   * @return {Promise(option)} 返回一个有option对象的promise
   */

  static createOption(dayNum) {
    return ThingData._getData(dayNum)
      .then(data => {
        if (!data.success) {
          Promise.reject();
        }


        //左上角提示
        let legend = [];

        //饼图
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



        let option = {

          title: {
            text: '一周时间分配表⸜(* ॑꒳ ॑* )⸝',
            x: 'center',
            textStyle: {
              color: '#8d8d8d'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            y: 'center',
            data: legend
          },
          series: [{
            name: '时间分配表',
            type: 'pie',
            stillShowZeroSum: false,
            center: ['40%', '50%'],
            radius: '55%',
            data: series,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },

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

            }
          }]
        };


        return Promise.resolve(option);
      }, (err) => {

        return Promise.reject(err);
      }).catch(err => {
        console.err(err);
      });
  }

  /**
   * @method _getData 从服务器获取数据
   * @aruments dayNum 获取几天的数据
   * @return {Promise(data)}  返回一个有创建option需要的数据的Promise
   */

  static _getData(dayNum) {

    return MyHttp.request({
      url: analyseAPI.thingDataList,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
        dayNum: dayNum
      }
    })
  }
}




class MostThing {
  constructor() {

  }

  /**
   * @method createOption 创建配置项
   * @arguments {Number} dayNum 返回几天的数据
   * @return {Promise(option)} 返回一个有option对象的promise
   */

  static createOption(dayNum) {
    return MostThing._getData(dayNum)
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

        mostThingList.forEach((item) => {
          xAxis.push(item.createTime);

          let aSerie = {};
          aSerie.value = item.countTime;
          aSerie.name = item.thingName;
          if(aSerie.name === '无日程') {
            aSerie.name = '无';
          }

          mostThingSeries.push(aSerie);
        })

        mostThingSeries.reverse();

        emotionList.forEach((item) => {
          emotionSeries.push(item.emotionValue);
        })

        emotionSeries.reverse();
        xAxis = operateCreateTimeArr(xAxis);

        let option = {
          title: {
            text: '情绪-行为ヾ(´∀`o)',
            x: 'center',
            textStyle: {
              color: '#8d8d8d'
            }
          },
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
              }
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
                  }
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#ffcdcb'
                }, {
                  offset: 1,
                  color: '#bfcefe'
                }]),
              },
            }
          ]
        };


        return Promise.resolve(option);
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

  static _getData(dayNum) {

    return Promise.all([MyHttp.request({
      url: analyseAPI.mostThingList,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
        dayNum: dayNum
      }
    }), MyHttp.request({
      url: analyseAPI.emotionList,
      data: {
        dayNum: dayNum
      },
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

  /**
   * @method createOption 创建配置项
   * @arguments {Number} dayNum 返回几天的数据
   * @return {Promise(option)} 返回一个有option对象的promise
   */

  static createOption(dayNum) {
    return ThingFinish._getData(dayNum)
      .then(data => {
        if (!data.success) {
          Promise.reject();
        }


        let series = [];
        let createTimeArr = [];
        data.thingFinishList.forEach((item) => {
          series.push(Number(item.finishedDegree) * 100);
          let timeItem = {};
          timeItem.name = item.createTime.replace(/-/g, '').slice(4);
          timeItem.max = 100;
          createTimeArr.push(timeItem);
        })

        let option = {
          title: {
            text: '任务完成度',
            left: 'center',
            top: 'top',
            textStyle: {
              color: '#8d8d8d'
            }
          },
          grid: {
            position: 'bottom',
          },
          radar: {
            name: {
              textStyle: {
                color: '#bbbbbb',
              }
            },
            itemStyle: {
              borderColor: '#bbb',
            },
            indicator: createTimeArr,
            center: ['50%', '55%'],
            radius: 80
          },
          series: [{
            name: '任务完成度',
            label: {
              show: false
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
            }, ]
          }]
        };

        return Promise.resolve(option);
      }, (err) => {

        return Promise.reject(err);
      }).catch(err => {
        console.err(err);
      });
  }

  /**
   * @method _getData 从服务器获取数据
   * @aruments dayNum 获取几天的数据
   * @return {Promise(data)}  返回一个有创建option需要的数据的Promise
   */

  static _getData(dayNum) {

    return MyHttp.request({
      url: analyseAPI.thingFinishList,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
        dayNum: dayNum
      }
    })
  }
}


export {
  Emotion,
  ThingData,
  MostThing,
  ThingFinish,
}