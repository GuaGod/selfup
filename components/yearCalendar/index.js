// components/yearCalendar/index.js
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
    year: '',
    date: '',
  },

  ready() {
    let date = new Date();
    let year = date.getFullYear();

    this.setData({
      year,
      date
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapBeforeYear() {
      let date = this.data.date;
      let year = date.getFullYear();

      let newYear = year - 1;
      let newDate = new Date();
      newDate.setFullYear(newYear);

      this.setData({
        year: newYear,
        date: newDate
      });     

      this.triggerEvent('onTapBeforeYear', {
        date: newDate,
      }, {
        bubbles: true,
        composed: true,
      })
    },

    onTapNextYear() {
      let date = this.data.date;
      let year = date.getFullYear();

      let newYear = year + 1;
      let newDate = new Date();
      newDate.setFullYear(newYear);

      this.setData({
        year: newYear,
        date: newDate
      });

      this.triggerEvent('onTapNextYear', {
        date: newDate,
      }, {
        bubbles: true,
        composed: true
      })
    },
  }
})
