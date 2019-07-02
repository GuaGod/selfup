// pages/self/self.js
import Person from './person.js'
import {defineLevel} from './wordData.js' 
import {femaleImageMap, maleImageMap} from './personDefaultData.js'
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js')
const AMapWX = require('../../libs/amap-wx.js');

let globalData = getApp().globalData;
const selfAPI = globalData.selfAPI;
const goodFriendsAPI = globalData.goodFriendsAPI;
const createObserver = globalData.createObserver;
const Loader = globalData.Loader;
const MyHttp = globalData.MyHttp;
const MyStorage = globalData.MyStorage;

let qqmapsdk;
let aMapsdk;
let person = new Person();
// let imageLoader = new ImageLoader();
let imageLoader = new Loader(); //资源加载器
let remotePathMap = new Map();
let getWord;   //获取话语的函数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    powerList: [],
    hair: '',
    cloth: '',
    body: '',
    head: '',
    background: '',
    isDrawerShow: false,
    loading: true, //记得改回true
    isInit: false,
    helpStep: 0,
    finalStep: 3,
    isNewMan: false,
    isCommunicateShow: true, //会时光
    communicateWord: '',
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onShow: function () {
    if (!this.data.isInit) {
      return;
    }
 
    let that = this;
    
    person.getPersonImg()
      .then(data => {
        let figure = data.figure;
        let changeImgs = {};
        for (let [key, value] of remotePathMap.entries()) {
          if (!!(figure[key]) && figure[key] !== value) {
            changeImgs[key] = figure[key];
          }
        }
          
        this.setData(changeImgs);
      })

    person.getPowerList()
      .then(data => {
        let attribute = data.attribute;
        if (attribute === null || attribute === undefined) {
          return;
        }

        getWord = defineLevel(attribute.emotion);

        this.setData({
          communicateWord: getWord(),
          powerList: [{
            statement: "体力",
            icon: '/images/HomeHuo.png',
            percent: attribute.strength,
          },
          {
            statement: "情绪",
            icon: '/images/HomeXin.png',
            percent: attribute.emotion,
          },
          {
            statement: "能力",
            icon: '/images/HomeZuanShi.png',
            percent: attribute.skill,
          },
          {
            statement: "自律",
            icon: '/images/HomeLinDang.png',
            percent: attribute.selfDiscipline,
          },
          ]
        })
      })
  },




  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
       return {
         title: '用色彩渲染一天 用数据倾诉成长',
         path: 'pages/welcome/welcome',
         imageUrl: '/images/share.png',
       }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    qqmapsdk = new QQMapWX({
      key: 'SAJBZ-JU6EX-XUN44-ZCSEY-2DFDQ-X6FAB'
    });
    
    //观察者模式，当完成加载时会trigger context的completeLoad方法
    let context = {};
    imageLoader.init(context);

    context.on('loadSuccess', function(loadNum, total) {
      that.loadSuccess(loadNum, total);
    });

    context.on('completeLoad', function(filepathMap) {
      that.completeLoad(filepathMap);
    });

    person.getPersonImg().then(res => {
      let isCreate = res.isCreate;
      let data = res.figure;

      // if(!isCreate) {
      //   wx.redirectTo({
      //     url: '../createSelf/createSelf',
      //   })
      // }
      getApp().globalData.userInfo.userId = data.userId;
      remotePathMap.set('hair', data.hair);
      remotePathMap.set('cloth', data.cloth);
      remotePathMap.set('body', data.body);
      remotePathMap.set('head', data.head);
      remotePathMap.set('backdrop', data.backdrop);
      let fixRemotePathMap = this.fixImageMap(remotePathMap);

      imageLoader.load(fixRemotePathMap);
    }, (err) => {
      return Promise.reject(err);
    }).catch(err => {
      if (err && err.notRealError) {
        return;
      }
      console.error(err);
    });

    person.getPowerList()
      .then(data => {
        let attribute = data.attribute;
        if(attribute === null || attribute === undefined) {
          return ;
        }
        
        getWord = defineLevel(attribute.emotion);

        this.setData({
          communicateWord: getWord(),
          powerList: [{
              statement: "体力",
              icon: '/images/HomeHuo.png',
              percent: attribute.strength,
            },
            {
              statement: "情绪",
              icon: '/images/HomeXin.png',
              percent: attribute.emotion,
            },
            {
              statement: "能力",
              icon: '/images/HomeZuanShi.png',
              percent: attribute.skill,
            },
            {
              statement: "自律",
              icon: '/images/HomeLinDang.png',
              percent: attribute.selfDiscipline,
            },
          ]
        })
      })

  },

  changeWord: function() {
      let rdm = Math.random();
      if(rdm < 0.3) {
         this.setData({
           isCommunicateShow: false
         })
         return ;
      } 

      this.setData({
        isCommunicateShow: true, 
        communicateWord: getWord(),
      })
  },

  loadSuccess() {

  },

  completeLoad(filepathMap) {
    this.setData({
      hair: filepathMap.get('hair'),
      body: filepathMap.get('body'),
      cloth: filepathMap.get('cloth'),
      head: filepathMap.get('head'),
      backdrop: filepathMap.get('backdrop'),
      loading: false,
      isInit: true
    });

    MyStorage.getItem('isNewMan')
      .then(res => {
        //是否是新人，如果是，则提供帮助
        let isNewMan = res.data;

        this.setData({
          isNewMan
        })
      })
    
  },

  

  toggleDrawer: function() {
    this.setData({
      isDrawerShow: !this.data.isDrawerShow
    })
  },

  //处理地址
  handleLocation: function() {
    this._getLocation()
      .then((res) => {
        let location = {
          latitude: res.latitude,
          longitude: res.longitude
        };

        return this._getAddress(location);
      })
      .then((res) => {

      })
  },

  _getWeather() {
      return new Promise((resolve, reject) => {
        aMapsdk.getWeather({
          success: (res) => {
            resolve(res.liveData.weather);
          },
          fail: (err) => {
            reject(err);
          }
        }) 
      })
  },

  _changeWeather(data) {
      let sunny = /晴/;
      let rain = /雨/;
      let cloudy = /云|阴/;
      let weather = '';
      if(sunny.test(data)) {
        weather = 'sunny'
      } else if(rain.test(data)) {
        weather = 'rain'
      } else if(cloudy.test(data)) {
        weather = 'cloudy'
      } else {
        weather = 'sunny'
      }
      
      return new Promise((resolve, reject) => {
         MyHttp.request({
           url: selfAPI.changeWeather,
           data: {
             weather: weather
           }
         })
      })
  },


  //获取经纬度
  _getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        success: function(res) {
          resolve(res);
        },
        fail: function(err) {
          reject(err);
        }
      })
    })
  },

  //获取地址
  _getAddress(location) {
    return new Promise((resolve, reject) => {
      qqmapsdk.reverseGeocoder({
        location: location,
        success: function(addressRes) {
          let address = addressRes.result.formatted_addresses.recommend;
          resolve(address);
        },
        fail: function(err) {
          reject(err);
        }
      })
    })
  },

  onTapCalendar: function() {
     wx.navigateTo({
       url: '../plan/plan',
     })
  },

  onTapDairy: function() {
    wx.navigateTo({
      url: '../dairy/dairy',
    })
  },
  
  nextHelp: function() {
     let helpStep = this.data.helpStep;
     let finalStep = this.data.finalStep;
     
     if(helpStep === finalStep) {
       this.overHelp();
     }

     this.setData({
       helpStep: this.data.helpStep + 1,
     })
  },

  overHelp: function() {
     this.setData({
       isNewMan: false,
     })

     MyStorage.setItem('isNewMan', false);
  },
  
  /**
   * 检查人物的图片是否出现丢失情况，防止因程序漏洞而出现人物形象不全的问题，返回修理后的结果
   */
  fixImageMap: function(imageMap) {
     let sex = getApp().globalData.userInfo.sex;
     let fixImageMap = sex === 1 ? maleImageMap : femaleImageMap; 
     for(let [imageName, imageUrl] of imageMap.entries()) {
       if(!(imageUrl)) {
           imageMap.set(imageName, fixImageMap.get(imageName));
       }
     }
     
     return imageMap;
  }
})