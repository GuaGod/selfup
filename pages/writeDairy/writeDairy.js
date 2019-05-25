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
    isTodayHasDairy: false,
    emotionId: null,
    emotionText: null,
    emotionTitle: null,
    hasImage: true,
    image: '',
    isRemoteImage: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    dairy.hasDairy()
      .then((data) => {
        let isExist = data.isExist;
        this.setData({
          isTodayHasDairy: isExist         //设置今天是否有日记
        })

        if (isExist) {
          let emotion = data.emotion;

          let hasImage = emotion.emotionImg !== undefined && emotion.image !== null;
          let imagePath = hasImage ? 'https://www.steins.club' + emotion.emotionImg.replace(/\\/g, '\/') : '';

          this.setData({
            emotionId: emotion.emotionId,
            emotionText: emotion.content,
            emotionTitle: emotion.title,
            image: imagePath,
            hasImage: hasImage,
            isRemoteImage: true,
          })

          return;
        }

        //如果没有日记
        this.setData({
          emotionId: null,
          emotionText: null,
          emotionTitle: null,
          hasImage: false,
          isRemoteImage: false,
        })
      }, (err) => {
        console.error(err);
      })
  },

  changeTitle: function({
    detail
  }) {
    let emotionTitle = detail.value;
    this.setData({
      emotionTitle
    })
  },

  changeText: function(e) {

  },

  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  update: function(data) {
    this.setData({

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
          isRemoteImage: false,
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
    let isExist = this.data.isTodayHasDairy;
    
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
    
    //如果今天存在日记则更新
    if(isExist) {
      this._update();
      return;
    }
    
    //如果今天不存在日记创建
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

  _update() {
      
      let that = this;
      let dataObj = {
        content: that.data.emotionText,
        title: that.data.emotionTitle,
        emotionId: that.data.emotionId,
      }
      
      //如果是远程拉回来的图片，即用户没有设置新的图片，先下载，再川汇区
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

  _submitUpdateData: function(dataObj, imagePath) {
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
                  this._submitCreateData(dataObj, imagePath);
                })
       return ;
    }

    let imagePath = this.data.image;

    this._submitCreateData(dataObj, imagePath);
  
  },

  _submitCreateData: function(dataObj, imagePath) {
    dairy.write(dataObj, imagePath)
      .then((res) => {
      
        let data = JSON.parse(res.data);
        if (data.success) {
          this._passSuccess();
          this.setData({
            isTodayHasDairy: true,
          })
          return;
        }

        this._passFail();
        this.setData({
          isTodayHasDairy: false,
        })

      }, (err) => {
        this._passFail();

        this.setData({
          isTodayHasDairy: false,
        })
      }).catch(err => {
        this._passFail();
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

  }
})