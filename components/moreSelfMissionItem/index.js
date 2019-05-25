// components/moreSelfMission/moreSelfMissionItem/index.js
let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const planAPI = globalData.planAPI;

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
    actions: [
      {
        name: '删除',
        width: 100,
        color: 'white',
        fontsize: '25',
        icon: 'delete',
        background: '#ed3f14',
      }
    ]
  },

  ready: function () {
    let dataObj = this.properties.selfMission;
    this.setData({
      thingColor: dataObj.thingColor,
      thingName: dataObj.thingName,
      thingId: dataObj.thingId,
      isLove: dataObj.isLove
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
    handlerSwiperButton: function(e) {
       let that = this;
       let index = e.detail.index;
       if(index === 0) {
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
