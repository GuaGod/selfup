let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const MyDate = globalData.MyDate;
const planAPI = globalData.planAPI;
let myDate = new MyDate();
/**
 * @class Calendar 日历对象  切换年月 更新视图   _update 负责更新视图 （拉取年月信息，更新）
 * @property {String} year 当前显示日历的年份
 * @property {String} month 当前显示日历的月份
 * @property  {Object} 今天的日期对象 包括 year, month, day, week
 * @property {Array} planList 存放一个月的每一个
 * @property {Array} forbidBoxs 存放一个月前几天空白的盒子
 */

class Calendar {
  constructor() {
    this.view;
    this.year;
    this.month;
    this.today;
    this.planList;
    this.forbidBoxs;
  }

  init(view) {
    this.view = view;

    let that = this;
    let todayDateStr = MyDate.createTodayDateStr();
    let todayDateObj = MyDate.parseDateStr(todayDateStr);

    this.today = todayDateObj;
    this.year = this.today.year;
    this.month = this.today.month;

    this._update();
  }


  next() {
    let year = Number(this.year);
    let month = Number(this.month);

    //是否有进位
    let hasCount = false;
    if (month + 1 > 12) {
      hasCount = true;
    }

    month = (month + 1) > 12 ? 1 : month + 1;
    this.month = month > 9 ? String(month) : '0' + month;
    if (hasCount) {
      this.year = String(year + 1);
    }

    this._update();
  }

  before() {
    let year = Number(this.year);
    let month = Number(this.month);

    //是否有进位
    let hasCount = false;
    if (month - 1 <= 0) {
      hasCount = true;
    }

    month = (month - 1) === 0 ? 12 : month - 1;
    this.month = month > 9 ? String(month) : '0' + month;
    if (hasCount) {
      this.year = String(year - 1);
    }

    this._update();
  }

  /**
   * @method _update 按this.year 和 this.month 更新
   * 
   */

  _update() {
     this._updateForbidBox();
     this._updatePlanList().then(() => {
         this._change();
     })
  }

  /**
   * @method _getDateList 获取某年月的计划安排情况
   * @return {Promise}
   */

  _getDateList() {
    let that = this;

    let yearMonth = `${that.year}-${that.month}`;
    return MyHttp.request({
      url: planAPI.getDateList,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      },
      data: {
        "yearMonth": yearMonth
      }
    })
  }

  /**
   * @method _updateForbidBox
   * @return {Void}
   */

  _updateForbidBox() {
    let firstDate = new Date(Number(this.year), Number(this.month) - 1, 1);
    let firstDayBegin = firstDate.getDay();
    let forbidBoxs = [];
    for (let i = 0; i < firstDayBegin - 1; i++) {
      forbidBoxs[i] = {};
    }

    this.forbidBoxs = forbidBoxs;
  }

  /**
   * @method _updatePlanList
   * @return {Void}
   */

  _updatePlanList() {
    let curMonthDays = new Date(Number(this.year), Number(this.month), 0).getDate();

    let planList = [];
    for (let i = 0; i < curMonthDays; i++) {
      planList.push({
        "hasPlan": false,
        "day": i + 1
      })
    }

    return this._getDateList().then((data) => {
      for (let i = 0, len = data.daylist.length; i < len; i++) {
        let date = data.daylist[i].createTime.slice(8, 10);
        planList[date - 1].hasPlan = true;
      }
      this.planList = planList;
      
      return Promise.resolve();
    }, (error) => {
      console.log(error);
      return Promise.reject();
    })
  }

  /**
   * @method _change 用于通知父级year，month发生了改变
   * @return {Void}
   */

  _change() {
    let that = this;
    this.view.triggerEvent('change', {
      year: that.year,
      month: myDate.monthChMap.get(that.month),
      forbidBoxs: that.forbidBoxs,
      planList: that.planList,
    });
  }

}

export {
  Calendar
}