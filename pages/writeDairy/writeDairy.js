// pages/writeDairy/writeDairy.js
import {
  Dairy
} from './Dairy.js';

let globalData = getApp().globalData;
let MyDownload = globalData.MyDownload;
const dairyAPI = globalData.dairyAPI;
const MyHttp = globalData.MyHttp;

let dairy = new Dairy();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    emotionId: null,
    emotionText: null,
    emotionTitle: null,
    hasImage: false,
    isChangeMode: false,
    image: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  changeTitle: function({
    detail
  }) {
    let emotionTitle = detail.value;
    this.setData({
      emotionTitle
    })
  },

  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  takePhoto: function() {
    let that = this;
    
 
    wx.chooseImage({
      count: 1,
      success: function(res) {
        let imageUrl = res.tempFilePaths[0];
         
        //取新照片之后，本次上传有了图片，且不是远程的图片
        that.setData({
          image: imageUrl,
          hasImage: true,
        })
 
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
     
  },

  changeText: function(e) {
    let text = e.detail.value;
    this.setData({
      emotionText: text
    });

  },
   
  //点击提交按钮
  submit: function() {
    let that = this;
    let imagePath = this.data.image || null;  
    
    //校验是否写了标题和内容
    let result = this._isPassDataRight();
    if(!(result.right)) {
       wx.showToast({
         title: result.tip,
       })
       return ;
    }

    wx.showLoading({
      title: '上传中',
      mask: true
    })
    
   setTimeout(() => {
     wx.hideLoading();
   }, 5000);
   
    let isChangeMode = this.data.isChangeMode;
    if(isChangeMode) {
       this._update();
       return ;
    }
    this._create();
  },

  _isPassDataRight() {
    let hasContent = !!(this.data.emotionText);
    let hasTitle = !!(this.data.emotionTitle);
    if (!hasTitle) {
      return {
        tip: '还没写标题',
        right: false,
      }
    }

    if (!hasContent) {
      return {
        tip: '还没写内容',
        right: false,
      }
    }

    return {
      tip: '',
      right: true,
    }
  },

  _passSuccess: function() {
    wx.hideLoading();
    wx.showToast({
      title: '上传成功',
    })
  },

  _passFail: function() {
    wx.hideLoading();
    wx.showToast({
      title: '上传失败',
    })
  },

  _create() {
    //设置默认图片
    let that = this;
    let hasImage = this.data.hasImage;
    let dataObj = {
      content: that.data.emotionText,
      title: that.data.emotionTitle,
    }

    if (!hasImage) {
      MyDownload.download('https://www.steins.club/selfup/imgs/element/dairyDefault.png')
                .then(res => {
                  let imagePath = res.tempFilePath;
                  this.setData({
                    hasImage: true, 
                    image: imagePath
                  })
                  this._submitCreateData(dataObj, imagePath);
                })
       return ;
    }

    let imagePath = this.data.image;

    this._submitCreateData(dataObj, imagePath);
  
  },

  _update() {
     let that = this;
     let dataObj = {
       content: that.data.emotionText,
       title: that.data.emotionTitle,
       emotionId: that.data.emotionId,
     }

     
     
     let imagePath = this.data.image;
     this._submitUpdateData(dataObj, imagePath);
  },

  _submitCreateData: function(dataObj, imagePath) {
    dairy.write(dataObj, imagePath)
      .then((res) => {
      
        let data = JSON.parse(res.data);
        if (data.success) {
          
          this._passSuccess();
          this.setData({
             isChangeMode: true,
             emotionId: data.emotionId
          })
          return;
        }

        this._passFail();
        this.setData({
          isChangeMode: false
        })

      }, (err) => {
        this._passFail();

        this.setData({
          isChangeMode: false,
        })
      }).catch(err => {
        this._passFail();
      })
  },

  _submitUpdateData: function(dataObj, imagePath) {
     dairy.update(dataObj, imagePath)
          .then(data => {

          })
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