/**
 * @class PlanHeader 计划header的状态机，负责控制不同按钮的显示，并把相应的数据传输给父级
 */

let PlanHeader = function() {
  let planState = {
    isCalendarShow: true,
    isExpandShow: true,
    isCloseShow: false
  };

  let calendarState = {
    isCalendarShow: false,
    isExpandShow: false,
    isCloseShow: true
  };

  let expandState = {
    isCalendarShow: false,
    isExpandShow: false,
    isCloseShow: true
  };

  class PlanHeader {
    constructor() {
      this.view = null;
    }

    init(view) {
      this.view = view;
    }

    //触碰了日历
    tapCalendar() {
      this.view.triggerEvent('switchState', 'tapCalendar',calendarState);
    }

    //触碰了拓展按钮
    tapExpand() {
      this.view.triggerEvent('switchState', 'tapExpand', expandState);
    }

    tapClose() {
      this.view.triggerEvent('switchState', 'tapClose', planState);
    }
  }
  return PlanHeader;
}();



export {
  PlanHeader
}