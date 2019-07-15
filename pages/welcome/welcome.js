


// pages/welcome/welcome.js
import {
  Loader
} from './loader.js'

let globalData = getApp().globalData;
const MyStorage = globalData.MyStorage;
const MyHttp = globalData.MyHttp;
const createObserver = globalData.createObserver;
const selfAPI = globalData.selfAPI;
const COOKIE_KEY = 'loginCookie'
const AMapWX = require('../../libs/amap-wx.js');

const normalizeUserCookie = (cookies = '') => {
  cookies = cookies.split(';')[0];
  return cookies;
};

let aMapsdk = new AMapWX.AMapWX({ key:'317806ac3b4c4dab1637b1ee2784b5b6'});
let loader = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: 0,
    isCompletedLoad: false,
    encryptedData: '',
    iv: '',
    signature: '',
    rawData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
     
    setTimeout(() => {
      that.setData({
        isCompletedLoad: true
      })
      
    }, 4000);
     

    //检验是否有校验新手的缓存，如果没有则说明用户初次登录，且是新手，后期提供新手帮助
    MyStorage.getItem('isNewMan')
             .then(data => {
                              
             }, () => {
                MyStorage.setItem('isNewMan', true);
             })

     
    //观察者模式，当完成加载时会trigger context的completeLoad方法
    let context = {};
    context = createObserver(context);
    context.on('loadSuccess', function(loadNum, total) {
      that.loadSuccess(loadNum, total);
    });

    context.on('completeLoad', function() {
      that.completeLoad();
    });

    loader = new Loader(context);
    loader.loadFiles();
  },

  //加载完一个资源后触发，改变进度的值
  loadSuccess: function(loadNum, total) {
    let schedule = Math.ceil(loadNum / total * 10000);
    schedule /= 100;

    this.setData({
      progress: schedule
    })
  },

  //完成所有资源的加载后触发，显示进入按钮
  completeLoad: function() {
    this.setData({
      isCompletedLoad: true
    })
  },

  bindGetUserInfo: function({
    detail
  }) {
    if(!detail.rawData) {
        return ;
    }
    wx.showLoading({
      title: '登录中，请稍等',
      mask: true
    });
    
    let encryptedData = detail.encryptedData;
    let iv = detail.iv;

    setTimeout(() => {
       wx.hideLoading();
       wx.hideToast();
    }, 5000);

    this._login(encryptedData, iv)
      .then(data => {
        let isExist = data.isExist;
         
        if (isExist === false) {
          MyStorage.setItem('isNewMan', true);
          wx.redirectTo({
            url: '../createSelf/createSelf',
          })
          return;
        }
        if (isExist === true) {
          globalData.userInfo = data.user;
          wx.redirectTo({
            url: '../self/self',
          })
          return;
        }
        
      }).catch(err => {
        wx.showToast({
          title: '出错啦，重新点击试试',
        })
        wx.hideLoading();
        wx.hideToast();
      })
  },

  _login(encryptedData, iv) {
    return new Promise((resolve, reject) => {
      wx.login({
        success: function(res) {
          let code = res.code;

          wx.getUserInfo({
            success: function(res) {
              const { encryptedData, iv, signature, rawData } = res;
 
              wx.request({
                url: selfAPI.login, //自己的服务接口地址
                method: 'get',
                header: {
                  "Content-Type": "applciation/json"
                },
                data: {
                  encryptedData: encryptedData,
                  iv: iv,
                  code: code
                },
                success: function (res) {

                  let loginCookie = res.header['Set-Cookie'];
                  loginCookie = normalizeUserCookie(loginCookie);
                  getApp().globalData.LOGIN_COOKIE = loginCookie;

                  let data = res.data;
                  if (data.success) {
                    resolve({
                      isExist: data.isExist,
                      figure: data.figure,
                      user: data.user
                    });
                  }

                  wx.hideLoading();

                  reject('服务器解析出错');
                },
              })
            }
          })
        },
        fail: function(err) {
          wx.hideLoading();
          wx.showToast({
            title: '登录失败！',
          })
          reject(err);
        }
      });
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
    //从高德获取天气，暂时只有这三种天气
    let sunny = /晴/;
    let rain = /雨/;
    let cloudy = /云|阴/;
    let weather = '';
    if (sunny.test(data)) {
      weather = 'sunny'
    } else if (rain.test(data)) {
      weather = 'rain'
    } else if (cloudy.test(data)) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  onError: function() {
    
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
    wx.hideLoading();
    wx.hideToast();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.hideLoading();
    wx.hideToast();
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