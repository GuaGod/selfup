// pages/updateDairy/updateDairy.js
import {Dairy} from './Dairy.js'
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
    emotionTime: "",
    src: "",
    image: "",
    isRemoteImage: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let emotionId = Number(options.dairyId);
    this.setData({
      emotionId: emotionId
    })
    this.setData({
      emotionId: emotionId
    });

    dairy.getEmotionDetail(emotionId)
      .then(({
        emotion
      }) => {
        
        that.setData({
          emotionText: emotion.content || "",
          emotionTitle: emotion.title || "",
          emotionTime: emotion.createTime.slice(0, 10) || "",
          image: 'http://www.steins.club' + emotion.emotionImg.replace(/\\/g, '\/')
        })
      })
  },

  changeText: function (e) {
    let text = e.detail.value;
    this.setData({
      emotionText: text
    });

  },

  changeTitle: function({
    detail
  }) {
    let emotionTitle = detail.value;
    this.setData({
      emotionTitle
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
          isRemoteImage: false,
        })

      }
    })
  },

  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  submit: function() {
    let that = this;
    let imagePath = this.data.image || null;
    let isExist = this.data.isTodayHasDairy;

    //校验是否写了标题和内容
    let result = this._isPassDataRight();
    if (!(result.right)) {
      wx.showToast({
        title: result.tip,
      })
      return;
    }

    wx.showLoading({
      title: '上传中',
      mask: true
    })

    setTimeout(() => {
      wx.hideLoading();
    }, 5000);

    this._update();
  },

  _update() {
    let that = this;
    let dataObj = {
      content: that.data.emotionText,
      title: that.data.emotionTitle,
      emotionId: that.data.emotionId,
    }

    if (this.data.isRemoteImage) {
      MyDownload.download(that.data.image)
        .then(data => {
          let imagePath = data.tempFilePath;
          this._submitUpdateData(dataObj, imagePath);
        });
      return;
    }

    this._submitUpdateData(dataObj, this.data.image);

  },

  _submitUpdateData: function (dataObj, imagePath) {
    dairy.update(dataObj, imagePath)
      .then((res) => {
        let data = JSON.parse(res.data);
        if (data.success) {
          this._passSuccess();
          return;
        }
        this._passFail();
      }, (err) => {
        this._passFail();
      }).catch((err) => {
        this._passFail();
      })
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

  }
})