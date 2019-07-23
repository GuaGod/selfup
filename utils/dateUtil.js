/**
 * @class MyDate  我的日期工具
 * @property monthChMap 完成月份从数字到汉语的映射
 * @property weekChMap 完成周几到汉语的映射，0对应周日
 */

class MyDate {
  constructor() {
      this.monthChMap = null;
      this.weekChMap = null;
      this.init();
  };

  init() {
    this.monthChMap = new Map([
      ["01", "一月"],
      ["02", "二月"],
      ["03", "三月"],
      ["04", "四月"],
      ["05", "五月"],
      ["06", "六月"],
      ["07", "七月"],
      ["08", "八月"],
      ["09", "九月"],
      ["10", "十月"],
      ["11", "十一月"],
      ["12", "十二月"],
    ]);
    this.weekChMap = new Map([
      ["1", "周一"],
      ["2", "周二"],
      ["3", "周三"],
      ["4", "周四"],
      ["5", "周五"],
      ["6", "周六"],
      ["0", "周日"],
    ]);
  }

  createTodayDateStr() {
     return MyDate.createTodayDateStr();
  }

  parseDateStr(date) {
     return MyDate.parseDateStr(date);
  }

  /**
   * @method createTodayDateStr 创建今天日期字符
   * @for MyDate
   * @param {Void}
   * @return {String}  例子：2019-01-03
   */

  static createTodayDateStr() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = `0${month}`;
    }

    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`
  }

  /**
   * @method parseDateStr 把字符串日期解析成对象的格式
   * @for MyDate
   * @param {String} date 传入的日期，格式为"2019-01-02"
   * @return {Object} {year, month, day, week}
   */
  static parseDateStr(date) {
    if (date === null || date === undefined) {
      return;
    }

    date = date.replace(/-/g, '');
    if(date.length !== 8) {
      return ;
    }

    let year = date.slice(0, 4);
    let month = date.slice(4, 6);
    let day = date.slice(6, 8);

    let dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    let week = dateObj.getDay() + "";

    return {
      year,
      month,
      day,
      week
    }
  }
  
  static calculateMondayAndSunday(myDate) {
    let week = myDate.getDay();
    let minus = week ? week - 1 : 6; 
    
    let mondayDate = new Date();
    let aDayTime = 24 * 60 * 60 * 1000;
    mondayDate.setTime(myDate.getTime() - minus * aDayTime);
    
    let sundayDate = new Date();
    sundayDate.setTime(myDate.getTime() + (7 - week) * aDayTime);
    
    return {
      mondayDate,
      sundayDate,
    }
  }

  static parseStandard(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? '0' + month : String(month);
    day = day < 10 ? '0' + day : String(day);

    return `${year}-${month}-${day}`;
  }
}

export {
   MyDate
}