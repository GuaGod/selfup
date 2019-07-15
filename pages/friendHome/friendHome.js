// pages/friendHome/friendHome.js
// import Mp3 from '../../utils/js-mp3/decode'
// import pcm from '../../utils/pcm-util'
let globalData = getApp().globalData;
const goodFriendsAPI = globalData.goodFriendsAPI;
const Loader = globalData.Loader;
const MyHttp = globalData.MyHttp;
let imageLoader = new Loader();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hair: '',
    cloth: '',
    body: '',
    head: '',
    backdrop: '',
    loading: true,
    powerList: [],
    userId: null,
    message: '',
    isCommunicateShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let userId = options.userid;

    let context = {};
    this.setData({
      userId: userId
    })
    
    imageLoader.init(context);
    context.on('loadSuccess', function(loadNum, total) {
      that.loadSuccess(loadNum, total);
    });

    context.on('completeLoad', function(filepathMap) {
      that.completeLoad(filepathMap);
    });

    this.getFriendImg(userId)
      .then((res) => {
        let imageMap = new Map();
        let data = res.figure;
        let attribute = res.attribute;
         
        this.setData({powerList: [{
          statement: "体力",
          icon: '/images/HomeHuo.png',
          percent: attribute.strength,
          className: 'strength',
        },
        {
          statement: "情绪",
          icon: '/images/HomeXin.png',
          percent: attribute.emotion,
          className: 'emotion',
        },
        {
          statement: "能力",
          icon: '/images/HomeZuanShi.png',
          percent: attribute.skill,
          className: 'ability',
        },
        {
          statement: "自律",
          icon: '/images/HomeLinDang.png',
          percent: attribute.selfDiscipline,
          className: 'control',
        },
        ]});

        imageMap.set('hair', data.hair || '');
        imageMap.set('cloth', data.cloth || '');
        imageMap.set('body', data.body || '');
        imageMap.set('head', data.head || '');
        imageMap.set('backdrop', data.backdrop || '');

        imageLoader.load(imageMap);
      })
  },

  loadSuccess() {

  },

  completeLoad(filepathMap) {
    this.setData({
      hair: filepathMap.get('hair') || '',
      body: filepathMap.get('body') || '',
      cloth: filepathMap.get('cloth') || '',
      head: filepathMap.get('head') || '',
      backdrop: filepathMap.get('backdrop') || '',
      loading: false
    });
  },

  getFriendImg: function(userId) {
    return MyHttp.request({
      url: goodFriendsAPI.visitFriend,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
        hisUserId: userId
      }
    })
  },

  returnHome: function() {
      wx.navigateBack({
        delta: 1
      })
  },

  leaveMessage: function() {
    // this.getRecordAuth()
    // // 获取录音对象
    // const that = this;
    // this.recorderManager = wx.getRecorderManager()
    // this.recorderManager.onStart(() => {
    //   console.log('recorder start')
    // })
    // // 录音的格式参数
    // const options = {
    //   duration: 11000,
    //   sampleRate: 32000,
    //   numberOfChannels: 1,
    //   encodeBitRate: 64000,
    //   format: 'mp3',
    //   frameSize: 6
    // }
    // this.recorderManager.start(options)
    // this.recorderManager.onStop(res => {
    //   const tempFilePath = res.tempFilePath
    //   that.duration = res.duration
    //   const fs = wx.getFileSystemManager()
    //   console.log('record stop')
    //   console.log(res)
    //   // 从临时文件中读取音频
    //   let promise = new Promise((resolve, reject) => {
    //     fs.readFile({
    //       filePath: tempFilePath,
    //       success(res) {
    //         console.log('read success')
    //         resolve(res.data);
    //       },
    //       fail(e) {
    //         console.log('read fail')
    //         console.log(e)
    //       }
    //     })
    //   });

    //   promise.then((data) => {
    //     return that.mp3ToPcm(data);
    //   }).then((data) => {
    //     console.log('转文字成功');
    //     console.log(data);
    //   })


    // })
     let that = this;

     return MyHttp.request({
       url: goodFriendsAPI.addMessage,
       method: 'POST',
       header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       },
       data: {
         hisUserId: that.data.userId,
         messageContent: that.data.message
       }
     })
     
  },

  // mp3ToPcm (mp3AB) {
  //   var that = this
  //   var decoder = Mp3.newDecoder(mp3AB)
  //   var pcmArrayBuffer = decoder.decode()
  //   // 和录音的格式一样
  //   const fromFormat = {
  //     channels: 1,
  //     sampleRate: 32000,
  //     interleaved: true,
  //     float: false,
  //     samplesPerFrame: 1152,
  //     signed: true
  //   }
  //   // 目标音频的格式
  //   const toFormat = {
  //     channels: 1,
  //     sampleRate: 16000,
  //     bitDepth: 8,
  //     interleaved: true,
  //     float: false,
  //     samplesPerFrame: 576,
  //     signed: true
  //   }
  //   var pcmAB = pcm.convert(pcmArrayBuffer, fromFormat, toFormat)
  //   const base64 = wx.arrayBufferToBase64(pcmAB)
  //   var millTime = (new Date().setMilliseconds(0) / 1000) + ''
  //   /** 调用科大讯飞平台的语音识别
  //       请求参数都是自己申请应用的参数
  //   */
  //   return MyHttp.request({
  //     url: 'http://api.xfyun.cn/v1/service/v1/iat',
  //     method: 'POST',
  //     data: {
  //       audio: base64
  //     },
  //     header: {
  //       'X-Appid': '5be4162d',    
  //       'X-CurTime': millTime,
  //       'X-Param': 'eyJlbmdpbmVfdHlwZSI6ICJzbXMxNmsiLCJhdWUiOiAicmF3In0=',
  //       'X-CheckSum': md5('b243cb9e1ea9d9eb40847967a8ebeef2' + millTime + 'eyJlbmdpbmVfdHlwZSI6ICJzbXMxNmsiLCJhdWUiOiAicmF3In0='),
  //       'content-type': 'application/x-www-form-urlencoded' // 默认值
  //     },
  //   })
  // },
  handleShowCommunicate: function() {
    this.setData({
      isCommunicateShow: true
    })
  },

  handleSubmit: function() {
    let that = this;
    if (this.data.message === '') {
      wx.showToast({
        title: '内容不能为空',
        duration: 1000,
        mask: true
      })
      return;
    }
    
    wx.showLoading({
      title: '',
      mask: true,
    })

    setTimeout(() => {
      wx.hideLoading();
    }, 2000);

    that.leaveMessage()
        .then(data => {
          wx.hideLoading();
          if(data.success) {
            this.setData({
              isCommunicateShow: false,
              message: '',
            })
            wx.showToast({
              title: '回复成功',
              duration: 1000,
              mask: true
            })
            return ;
          }

          wx.showToast({
            title: '内容敏感',
            duration: 1000,
            mask: true,
          })
        }); 
  },

  handleClose: function() {
    this.setData({
      isCommunicateShow: false,
    })
  },

  changeText: function (e) {
    let text = e.detail.value;
    this.setData({
      message: text
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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