// pages/createSelf/createSelf.js
import {
  Person
} from './Person.js'
import {
  femaleQues,
  maleQues
} from './data.js'
let person = new Person();

let globalData = getApp().globalData;
const MyStorage = globalData.MyStorage;
const MyHttp = globalData.MyHttp;
const Loader = globalData.Loader;
const imageLoader = new Loader();

const selfAPI = globalData.selfAPI;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasNext: true,
    hasPrev: false,
    currentStep: 0,
    sex: 0, //用户选择的性别
    question: femaleQues[0].ques, //问题
    answerList: femaleQues[0].answerList, //答案列表
    questionNum: 0, //第几个问题
    answerArr: [], //答案数组
    hair: '',
    head: '',
    body: '',
    cloth: '',

    isCreateComplete: false,
    choosed: [{
        'A': false,
        'B': false,
      },
      {
        'A': false,
        'B': false,
      },
      {
        'A': false,
        'B': false,
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let context = {};
    let that = this;
    imageLoader.init(context);

    context.on('loadSuccess', function (loadNum, total) {
      that.loadSuccess(loadNum, total);
    });

    context.on('completeLoad', function (filepathMap) {
      that.completeLoad(filepathMap);
    });
  },

  loadSuccess(loadNum, total) {
  },

  completeLoad(filepathMap) {
    this.setData({
      hair: filepathMap.get('hair'),
      body: filepathMap.get('body'),
      cloth: filepathMap.get('cloth'),
      head: filepathMap.get('head'),
      isCreateComplete: true,
    });
  },

  answerFirstQuestion: function(data) {
    let that = this;
    let quesNum = data.currentTarget.dataset.ques;
    let answer = data.target.dataset.answer;
    this.data.answerArr[quesNum] = answer;
    let choosed = this.data.choosed;
    choosed[quesNum]['A'] = false;
    choosed[quesNum]['B'] = false;
    choosed[quesNum]['C'] = false;
    choosed[quesNum]['D'] = false;

    choosed[quesNum][answer] = true;
    this.setData({
      choosed: choosed
    })

    let isCompleted = true;
    for(let i = 0; i < 3; i++) {
      let item = this.data.answerArr[i];
      if(item === undefined) {
        isCompleted = false;
      } 
    }

   
    if(isCompleted) {
 
      this.setData({
        questionNum: 1,
        question: that.data.sex === 0 ? femaleQues[1].ques : maleQues[1].ques, //问题

        answerList: that.data.sex === 0 ? femaleQues[1].answerList : maleQues[1].answerList, //答案列表
      })
    }
  },

  answerQuestion: function(data) {
    let that = this;
    let answer = data.target.dataset.answer;
    let questionNum = this.data.questionNum;
    this.data.answerArr[questionNum + 2] = answer; 
    let questionType = this.data.sex === 0 ? femaleQues : maleQues;
    let quesSize = questionType.length;

    //如果不是最后一个问题，就下一个问题，否则设置回答之后到下一步
    if (questionNum === quesSize - 1) {
      person.setAnswer(this.data.answerArr.join(''));
      imageLoader.load(new Map([
        ['hair', person.hair.imgAddrGood],
        ['head', person.head.imgAddrGood],
        ['cloth', person.cloth.imgAddrGood],
        ['body', person.body.imgAddrGood]
      ]))
      person.createPerson()
            .then((data) => {     
              getApp().globalData.userInfo.userId = data.userId;
            }, (err) => {
              return Promise.reject(err);
            })


      this.nextStep();
    } else {
      this.nextQuestion();
    }
  },


  nextQuestion: function() {
    let questionType = this.data.sex === 0 ? femaleQues : maleQues;
    let quesNum = this.data.questionNum + 1;

    this.setData({
      question: questionType[quesNum].ques,
      answerList: questionType[quesNum].answerList,
      questionNum: quesNum
    })
  },

  _changeStep: function(current) {
    if (current === 0) {
      this.setData({
        hasNext: true,
        hasPrev: false,
      });
    } else if (current === 2) {
      this.setData({
        hasNext: false,
        hasPrev: true
      })
    } else {
      this.setData({
        hasNext: true,
        hasPrev: true
      })
    }

    this.setData({
      currentStep: current
    })
  },

  changeStep: function(e) {
    this._changeStep(Number(e.detail.current));
  },

  nextStep: function() {
    if (!this.data.hasNext) {
      return;
    }
    let currentStep = this.data.currentStep;
    this._changeStep(currentStep + 1);
  },

  prevStep: function() {
    if (!this.data.hasPrev) {
      return;
    }
    let currentStep = this.data.currentStep;
    this._changeStep(currentStep - 1);
  },

  chooseSex: function(e) {
    let currentStep = this.data.currentStep;
    let sex = Number(e.currentTarget.dataset.sex);
    this.setData({
      sex
    });

    person.setSex(sex);

    if (sex === 0) {
      this.setData({
        question: femaleQues[0].ques,
        answerList: femaleQues[0].answerList,
        questionNum: 0,
        answerStr: '',
      })
    } else {
      this.setData({
        question: maleQues[0].ques,
        answerList: maleQues[0].answerList,
        questionNum: 0,
        answerStr: '',
      })
    }
    this.nextStep(currentStep + 1);
  },

  completeCreate: function() {
    wx.redirectTo({
      url: '../self/self',
    })
  },
  catchTouchMove: function (res) {
    return false;
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