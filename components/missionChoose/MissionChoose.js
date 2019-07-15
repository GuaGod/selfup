let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const planAPI = globalData.planAPI;

class MissionChoose {
  constructor() {
     this.view = null;
     this.isInit = false;
     this.pageIndex = 1;
     this.pageSize = 16;
     this.hasMoreLoveThing = true;
     this.missionList = [];
  }

  init(view) {
     this.view = view;
     this.isInit = true;
     this.update();
  }
  
  update() {
    this._getMissionList()
      .then(missionList => {
        this.missionList = missionList;
        this._updateViewMissionList();
      })
  }

  _getMissionList() {
    let that = this;
    return MyHttp.request({
      url: planAPI.getLoveThing,
      data: {
        pageIndex: that.pageIndex,
        pageSize: that.pageSize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
    }).then((data) => {
       return Promise.resolve(data.list);
    }, (err) => {
       return Promise.reject(err);
    })
  }

  _updateViewMissionList() {
      this.view.triggerEvent('updateMissionList', this.missionList); 
  }
}

export {
  MissionChoose
}