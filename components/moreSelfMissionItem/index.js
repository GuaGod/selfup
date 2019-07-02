// components/moreSelfMission/moreSelfMissionItem/index.js
let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const planAPI = globalData.planAPI;
const thingClassMap = new Map([
  ['学习', '/images/study_icon.png'],
  ['运动', '/images/sport_icon.png'],
  ['娱乐', '/images/play_icon.png'],
  ['杂事', '/images/other_icon.png'],
  ['睡眠', '/images/sleep_icon.png'],
  ['吃饭', '/images/eat_icon.png'],
])


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selfMission: {
      type: Object,
      value: {}
    }
  },

  pageLifeTimes: {
    show: function() {

    }
  },

  detached: function () {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:true,
    thingColor: "",
    thingName: "",
    thingId: "",
    isLove: 0,
    image: "",
    actions: [{
      name: '取消'
    },
    {
      name: '删除',
      color: '#ed3f14',
      loading: false
    }
    ],
    deleteVisible: false
  },

  ready: function () {
    let dataObj = this.properties.selfMission;
    this.setData({
      thingColor: dataObj.thingColor,
      thingName: dataObj.thingName,
      thingId: dataObj.thingId,
      isLove: dataObj.isLove,
      image: thingClassMap.get(dataObj.thingClass) || thingClassMap.get('杂事')
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapLove: function (event) {
      let thingId = this.data.thingId;
      let operation = this.data.isLove === 0 ? 1 : 0;
      this.setData({
        isLove: operation
      })
      MyHttp.request({
        url: planAPI.addLove,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': getApp().globalData.LOGIN_COOKIE
        },
        data: {
          thingId: thingId,
          operation: operation
        }
      })
    },
    onTapDelete: function(e) {
        this.setData({
          deleteVisible: true
        });
    },

    onTapModal: function(e) {
        let index = e.detail.index;
        this.setData({
          deleteVisible: false
        })
        if(Number(index) !== 0) {
          this.deleteSelfMission()
            .then(res => {
              wx.showToast({
                title: '删除成功！',
              })
              this.setData({
                isShow: false
              })
            }, (err) => {
              wx.showToast({
                title: '网络拥堵，删除失败！',
              })
            })
        }
    },

    deleteSelfMission() {
      let that = this;
      return MyHttp.request({
        url: planAPI.deleteSelfMission,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': getApp().globalData.LOGIN_COOKIE
        },
        data: {
          thingId: that.data.thingId
        }
      })
    }
  },
    

  
})
