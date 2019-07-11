// components/monthCalendar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    dateStr: '',
    date: null
  },

  ready() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    this.setData({
      dateStr: `${year}年${month}月`,
      date: date,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapBeforeMonth() {
      let date = this.data.date;
      let month = date.getMonth();
      let year = date.getFullYear();
      let newDate = new Date();

      if(month <= 0) {
        newDate.setMonth(11);
        newDate.setFullYear(year - 1);
      } else {
        newDate.setMonth(month - 1);
        newDate.setFullYear(year);
      }
      
      let newYear = newDate.getFullYear();
      let newMonth = newDate.getMonth() + 1;

      this.setData({
        dateStr: `${newYear}年${newMonth}月`,
        date: newDate
      })
      
      this.triggerEvent('onTapBeforeMonth', {
        date: newDate
      }, {
        bubbles: true,
        composed: true,
      })
    },
    onTapNextMonth() {
      let date = this.data.date;
      let month = date.getMonth();
      let year = date.getFullYear();
      let newDate = new Date();

      if (month >= 11) {
        newDate.setMonth(0);
        newDate.setFullYear(year + 1);
      } else {
        newDate.setMonth(month + 1);
        newDate.setFullYear(year);
      }

      let newYear = newDate.getFullYear();
      let newMonth = newDate.getMonth() + 1;

      this.setData({
        dateStr: `${newYear}年${newMonth}月`,
        date: newDate
      })

      this.triggerEvent('onTapNextMonth', {
        date: newDate
      }, {
          bubbles: true,
          composed: true,
        })
    },
  }
})
