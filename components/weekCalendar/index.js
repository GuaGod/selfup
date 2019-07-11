// components/weekCalendar/index.js
let globalData = getApp().globalData;
const MyDate = globalData.MyDate;
const aDay = 1000 * 24 * 60 * 60;

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
    start: '',
    end: '',
    startDate: null,
    endDate: null,
  },

  ready() {
    let date = new Date();
    let {mondayDate, sundayDate} = MyDate.calculateMondayAndSunday(date);
    let start = mondayDate;

    let startYear = start.getFullYear();
    let startMonth = start.getMonth() + 1;
    let startDay = start.getDate();

    start = `${startYear}年${startMonth}月${startDay}日`;
    
    let end = sundayDate;
    let endYear = end.getFullYear();
    let endMonth = end.getMonth() + 1;
    let endDay = end.getDate();

    end = `${endYear}年${endMonth}月${endDay}日`;

    this.setData({
      start,
      end,
      startDate: mondayDate,
      endDate: sundayDate
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapBeforeWeek() {
      let startDate = this.data.startDate;
      let endDate = this.data.endDate;
      let newStart = new Date();
      let newEnd = new Date();
      newStart.setTime(startDate.getTime() - 7 * aDay);
      newEnd.setTime(endDate.getTime() - 7 * aDay);

      let startYear = newStart.getFullYear();
      let startMonth = newStart.getMonth() + 1;
      let startDay = newStart.getDate();

      let newStartStr = `${startYear}年${startMonth}月${startDay}日`;

      let endYear = newEnd.getFullYear();
      let endMonth = newEnd.getMonth() + 1;
      let endDay = newEnd.getDate();
 
      let newEndStr = `${endYear}年${endMonth}月${endDay}日`;

      this.setData({
        start: newStartStr || '',
        end: newEndStr || '',
        startDate: newStart,
        endDate: newEnd,
      });

      this.triggerEvent('onTapBeforeWeek', {
        startDate: newStart,
        endDate: newEnd,
      }, {
        bubbles: true,
        composed: true,
      })
    },

    onTapNextWeek() {
      let startDate = this.data.startDate;
      let endDate = this.data.endDate;
      let newStart = new Date();
      let newEnd = new Date();
      newStart.setTime(startDate.getTime() + 7 * aDay);
      newEnd.setTime(endDate.getTime() + 7 * aDay);

      let startYear = newStart.getFullYear();
      let startMonth = newStart.getMonth() + 1;
      let startDay = newStart.getDate();

      let newStartStr = `${startYear}年${startMonth}月${startDay}日`;

      let endYear = newEnd.getFullYear();
      let endMonth = newEnd.getMonth() + 1;
      let endDay = newEnd.getDate();

      let newEndStr = `${endYear}年${endMonth}月${endDay}日`;


      this.setData({
        start: newStartStr || '',
        end: newEndStr || '',
        startDate: newStart,
        endDate: newEnd,
      });

      this.triggerEvent('onTapNextWeek', {
        startDate: newStart,
        endDate: newEnd,
      }, {
          bubbles: true,
          composed: true,
        })
    },
  }
})
