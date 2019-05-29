import {createPlanDefaultData} from './createPlanDefaultData.js'
let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const planAPI = globalData.planAPI;

/**
 * @property plan 当前显示的计划的数据
 * @property date 当前计划是第几天的计划 
 * @property hasPlanInServer 在服务器是否创建了当前这一天的计划 
 * @property oldPlan 初始页面时的表，用于校验离开页面时，新旧表是否相同，如果相同，则不上传表，减少http请求
 */

class PlanController {
  constructor() {
      this.view;
      this.plan;
      this.date;
      this.dayId;
      this.hasPlanInServer; 
      this.isChanged;
  }

  init(view, date) {
    this.view = view;
    this.plan = [];
    this.date = '';
    this.isChanged = false;
    this.hasPlanInServer = false;
    this.changeDate(date);
  }

  /**
   * 切换当前显示的计划  如果date有计划，则拉取服务器端的计划，如果没有，则在本地新建一个空表
   */
  changeDate(date) {
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
           return Promise.reject({
               notRealErr: true
           })
         }, (err) => {
           return Promise.reject(err);
         })
         .then(data => {  
           this.plan = data.jobList;
           this.dayId = data.dayId;
           this.hasPlanInServer = true;
           this.date = date;      
           this._updateView();
           this._updateProgress();
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
      if(Number(item.x) === 0) {
          plan[item.y].jobClass = missionData.thingClass
      } else if(Number(item.x) === 1 && (plan[item.y].jobClass === null || plan[item.y].jobClass === undefined)) {
          plan[item.y].jobClass = missionData.thingClass;
      }
      obj.thingName = missionData.thingName;
      obj.thingColor = missionData.thingColor;
      obj.thingClass = missionData.thingClass;
      obj.thingState = 0;
     });     
     this.isChanged = true;
     this._updateView();
  }

  /**
   *上传本地缓存的计划 如果没有计划则创建一个新的计划，如果有计划则是更新接口
   */

  submitPlanData() {
    let that = this;
    if(!this.isChanged) {          //如果没有改过数据，则不提交数据
      return ;
    } 
    this.isChanged = false;       //每一次提交都会重置
    getApp().globalData.hasPlanSubmit = true;
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
      // that.dayId = data.dayId;
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
     this.isChanged = true;

     this._updateView();
  }

  deletePlan(choosedMissions) {
    let plan = this.plan;
    choosedMissions.forEach((item) => {
      let obj = plan[item.y].thingList[item.x];
      obj.thingName = null;
      obj.thingColor = null;
      obj.thingClass = null;
      obj.thingState = 0;
    })
    this.isChanged = true;
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
        plan: that.plan,
      });
  }

  _updateProgress() {
      let that = this;
      let progress = this.comunicateProgress();
      this.view.triggerEvent('updateProgress', {
        completeProgress: progress
      })
  }
  /**
   * @return progress
   */
  
  comunicateProgress() {
     let plan = this.plan;
     let totalMissions = 0;
     let completeMissions = 0;
     for(let i = 0, len = plan.length; i < len; i++) {
       let job = plan[i];
       let thingList = job.thingList;
       if(thingList[0].thingName !== null && thingList[0].thingName !== '') {
          totalMissions++;
       }

       if(thingList[1].thingName !== null && thingList[1].thingName !== '') {
         totalMissions++;
       }

       if(Number(thingList[0].thingState) === 1) {
         completeMissions++;
       }

       if (Number(thingList[1].thingState) === 1) {
         completeMissions++;
       }
     }

     let progress = Math.ceil(completeMissions / totalMissions * 100);
     return progress;
  }
}

export {PlanController}

