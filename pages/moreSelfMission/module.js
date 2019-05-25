let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const planAPI = globalData.planAPI;

class MoreSelfMission{
  constructor() {
    this.missionList = [];
    this.pageIndex = 1;
    this.pageSize = 12;
    this.hasMoreMission = true;
    this._lock = false;
  }

  init(view) {
     let that = this;
     this.missionList = [];
     this.hasMoreMission = true;
     this._getMoreMissions()
       .then((data) => {
         that._lock = false;
         let _list_ = data.daylist;
         that.pageIndex = that.pageIndex + _list_.length;
         if(_list_.length < that.pageSize) {
           that.hasMoreMission = false;
           view.setData({
             isArrowShow: false
           })
         }
         for (let item of _list_) {
           that.missionList.push(item);
         }
         view.setData({
           missionList: that.missionList
         })
       })
  }
  
  getMoreMissions(view) {
    let that = this;
    if(!this.hasMoreMission) {
      return;
    }
    this._getMoreMissions().then((data) => {

      let _list_ = data.daylist;
      that.pageIndex = that.pageIndex + _list_.length;
      

      if (_list_.length < that.pageSize) {
        that.hasMoreMission = false;
        view.setData({
          isArrowShow: false
        })
      }
      for (let item of _list_) {
        that.missionList.push(item);
      }
      view.setData({
        missionList: that.missionList
      })
    })
  }

  _getMoreMissions() {
     if(this._lock) {
       return;
     }
     let that = this;
     this._lock = true;
     return MyHttp.request({
       url: planAPI.getSelfMissions,
       header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       },
       data: {
         pageIndex: that.pageIndex,
         pageSize: that.pageSize
       }
     })
  }
}

export {
  MoreSelfMission
}