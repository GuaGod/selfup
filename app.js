//app.js
import {MyHttp} from './utils/requestUtil.js'
import {MyDate} from './utils/dateUtil.js'
import {MyStorage} from './utils/storageUtil.js'
import {MyDownload} from './utils/downloadUtil.js'
import {Loader} from './utils/Loader.js'
import {DevidePage} from './utils/devidePage.js'
import {createObserver} from './utils/observerUtil.js'
import imgPathMap from './static/imgPath.js'
import selfAPI from './static/API/selfAPI.js'
import planAPI from './static/API/planAPI.js'
import analyseAPI from './static/API/analyseAPI.js'
import dairyAPI from './static/API/dairyAPI.js'
import goodFriendsAPI from './static/API/goodFriendsAPI.js'

App({
  onLaunch: function () {
    let that = this;
    MyStorage.getItem('phoneInfo')
             .then((res) => {
                that.globalData.phoneInfo = res.data;
             }, (error) => {
                wx.getSystemInfo({
                  success: function(res) {
                    MyStorage.setItem('phoneInfo', res);
                    that.globalData.phoneInfo = res;
                  },
                })
             });
       
  },
  globalData: {
    userInfo: {},              //用户基本信息
    phoneInfo: null,             //手机机型信息
    MyHttp: MyHttp,
    MyDate: MyDate,
    MyStorage: MyStorage,
    MyDownload: MyDownload,
    DevidePage: DevidePage,
    selfAPI: selfAPI,
    planAPI: planAPI,
    analyseAPI: analyseAPI,
    dairyAPI: dairyAPI,
    imgPathMap: imgPathMap,
    createObserver: createObserver,
    goodFriendsAPI: goodFriendsAPI,
    Loader: Loader,
    LOGIN_COOKIE: '',
  }
})