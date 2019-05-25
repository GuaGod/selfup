import {createPlanDefaultData} from './createPlanDefaultData.js'
let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const planAPI = globalData.planAPI;

/**
 * @property plan 当前显示的计划的数据
 * @property date 当前计划是第几天的计划 
 * @property hasPlanInServer 在服务器是否创建了当前这一天的计划 
 * @property oldPlan 初始页面时的表，用于校验离开页面时，新旧表是否相同，如果相同，则不上传表
 */

class PlanController {
  constructor() {
      this.view;
      this.plan;
      this.date;
      this.dayId;
      this.hasPlanInServer; 
      this.oldPlan; 
  }

  init(view, date) {
    this.view = view;
    this.plan = [];
    this.date = '';
    this.hasPlanInServer = false;
    this.changeDate(date);
  }

  /**
   * 切换当前显示的计划  如果date有计划，则拉取服务器端的计划，如果没有，则在本地新建一个空表
   */
  changeDate(date) {
     this.lock = true;
     if(date === undefined || date === null || date === '') {
       return ;
     }
     let that = this;
     if(date === this.date) {
       return ;
     }

    this.plan = createPlanDefaultData();
    this.dayId = null;
    this.hasPlanInServer = false;
    this.date = date;


    this._updateView();
    
    this._isSomedayHasPlan(date)
         .then(data => {
           let isHas = data.isHas;
           this.hasPlanInServer = isHas;
           if(isHas) {
             return this._getSomedayPlan(date);
           } 
           this._deblockView();
           return Promise.reject({
               notRealErr: true
           })
         }, (err) => {
           return Promise.reject(err);
         })
         .then(data => {  
           this.plan = data.jobList;
           console.log(`获取的plan是否`);
           let hasNull = false;
           for (let i = 0, len = this.plan.length; i < len; i++) {
             let item = this.plan[i];
             if (item.thingList.length < 2) {
               hasNull = true;
             }
           }
           console.log(hasNull);
           this.dayId = data.dayId;
           this.hasPlanInServer = true;
           this.date = date;      
           this._updateView();
           this._deblockView();
         }, (err) => {
            return Promise.reject(err);
         }).catch(err => {
           if (err && err.notRealErr) {
             return;
           }
         })
                                                   
  }

  /**
   * 更新当天计划，即用户选中了某些块来覆盖计划，此操作并不会直接向服务器提交更新后的内容，而是会先操作本地的
   * 数据，等到用户关闭页面时再提交，仅做一个缓存
   */

  updatePlan(choosedMissions, missionData) {
     
     let dayId = this.dayId;
     let plan = this.plan;
     choosedMissions.forEach((item) => {
      let obj = plan[item.y].thingList[item.x];
      obj.thingName = missionData.thingName;
      obj.thingColor = missionData.thingColor;
      obj.thingClass = missionData.thingClass;
      obj.thingState = 0;
     });     
      
     this._updateView();
  }

  /**
   *上传本地缓存的计划 如果没有计划则创建一个新的计划，如果有计划则是更新接口
   */

  submitPlanData() {
    let that = this;
    console.log(`传输过去的plan是否`);
    let hasNull = false;
    for(let i = 0, len = this.plan.length; i < len; i++) {
      let item = this.plan[i];
      if(item.thingList.length < 2) {
        hasNull = true;
      }
    }
    console.log(hasNull);
    
    if(this.hasPlanInServer) {
      return MyHttp.request({
        url: planAPI.updatePlan,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': getApp().globalData.LOGIN_COOKIE
        },
        data: {
          dayId: that.dayId,
          jobStr: JSON.stringify(that.plan),
          createTime: that.date,
        },
        method: 'POST',
      })
    }
    
    this.hasPlanInServer = true;
    return MyHttp.request({
      url: planAPI.createPlan,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
         dayId: null,
         jobStr: JSON.stringify(that.plan),
         createTime: that.date,
      },
      method: 'POST'
    }).then(data => {
      that.dayId = data.dayId;
    })
  }

  completeChoosedMission(choosedMissions) {
     let plan = this.plan;
     choosedMissions.forEach((item) => {
       let obj = plan[item.y].thingList[item.x];
       if(obj.thingName !== null) {
         obj.thingState = obj.thingState === 0 ? 1 : 0;
       }
     })

     this._updateView();
  }

  deletePlan(choosedMissions) {
    let plan = this.plan;
    choosedMissions.forEach((item) => {
      let obj = plan[item.y].thingList[item.x];
      obj.thingName = "";
      obj.thingColor = "";
      obj.thingClass = "";
    })

    this._updateView();
  }

  /**
   * 某天是否有计划
   */
  _isSomedayHasPlan(date) {
     return MyHttp.request({
       url: planAPI.hasPlan,
       header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       },
       data: {
         createTime: date,
       }
     })
  }

  completeAMission(whichMission) {
       
  }
  
  _getSomedayPlan(date) {
    let that = this;
    return MyHttp.request({
      url: planAPI.getPlanDetail,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
        createTime: date,
      }
    })
  }

  /**
   * 检测新表和旧表是否相同
   */
  _isDifferent() {
      
  }

  _updateView() {
      let that = this;
    
      this.view.triggerEvent('updateView', {
        date: that.date,
        plan: that.plan
      });
  }
  
  _deblockView( ){
     let that = this;
     this.view.triggerEvent('deblockView');
  }
}

export {PlanController}

