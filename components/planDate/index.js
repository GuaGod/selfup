let globalData = getApp().globalData;
const MyDate = globalData.MyDate;
const myDate = new MyDate();

// components/planDate/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    date: {
      type: String,
      value: "",
      observer: function (dateStr) {
         
        if (dateStr === null || dateStr === undefined || dateStr === "") {
          return;
        }
        let dateObj = MyDate.parseDateStr(dateStr);
        
         
        let month = myDate.monthChMap.get(dateObj.month);
        let day = dateObj.day;
        let week = myDate.weekChMap.get(dateObj.week);
        this.setData({
          month,
          day,
          week
        })
      }
    }
  },



  /**
   * 组件的初始数据
   */
  data: {
    month: "",
    day: "",
    week: ""
  },

  ready: function () {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
