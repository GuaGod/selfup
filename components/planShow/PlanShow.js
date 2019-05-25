import {createPlanDefaultData} from './createPlanDefaultData.js'
let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const planAPI = globalData.planAPI;

/**
 * @class PlanShow 展示某天的计划
 * @property {String} dateStr 该天的日期字符串
 * @property {Array} plans 改天的所有计划的数组
 */

class PlanShow {
  constructor() {
    this.view;
    this.dateStr;
    this.plans;
    this.dayId;
  }

  init(view) {
    this.view = view;
  }

  update(dateStr) {
    
    this.dateStr = dateStr;
    this._update();
  }

  /**
   * @method _update 根据传入的dateStr 更改当前显示的计划
   * @arument {String} dateStr
   * @return {Promise}
   */

  _update() {
    this._isSomedayHasPlan()
      .then((isHas) => {
          if(!isHas) {
           return this._createSomedayPlan();
          }
          
          return Promise.resolve();
      }, (err) => {
        return Promise.reject(err);
      })
      .then(() => {
          return this._getSomedayPlan();     
      })
      .then(data => {
          this.plans = data.jobList;
          this.dayId = data.dayId;
          this._updatePlansView();
      }).catch(err => {
        console.error(err);
      })
  }

  /**
   * @method getSomeDayPlan 获取该天的计划
   */

  _getSomedayPlan() {
    let that = this;
    let dateStr = that.dateStr;
   if(dateStr.length < 8) {
      dateStr = dateStr.slice(0, 4) + '-' + dateStr.slice(4, 6) + '-' + dateStr.slice(6)
   }
   

    return MyHttp.request({
      url: planAPI.getPlanDetail,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
        createTime: dateStr
      }
    })
  }

  /**
   * @method _isSomedayHasPlan
   * @return {Promise}  
   */

  _isSomedayHasPlan() {
    let that = this;
    let dateStr = that.dateStr;
    if (that.dateStr.length < 8) {
      dateStr = dateStr.slice(0, 4) + '-' + dateStr.slice(4, 6) + '-' + dateStr.slice(6)
    }

    return MyHttp.request({
      url: planAPI.hasPlan,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
        createTime: dateStr
      }
    }).then((data) => {
      return Promise.resolve(data.isHas);
    }, (err) => {
      return Promise.reject(err);
    })
  }

  /**
   * @method _createSomedayPlan 创建某天的计划
   *                            创建计划会给用户提供一个基础的模板，上面已经有睡觉等基本操作
   */

  _createSomedayPlan() {
    let that = this;
    let jobStr = JSON.stringify(createPlanDefaultData);
    return MyHttp.request({
      url: planAPI.createPlan,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      method: 'POST',
      data: {
        jobStr: jobStr,
        createTime: that.dateStr
      }
    })
  }

  /**
   * @method _updatePlanView 更新视图
   *                    
   */

  _updatePlansView() {
     this.view.triggerEvent('updatePlans', this.plans, this.dayId);
  }

}

export {
  PlanShow
}