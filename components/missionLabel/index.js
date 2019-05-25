// components/mission/missionLabel/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      missionData: {
        type: Object,
        value: {
          thingColor: "",
          thingName: "",
          thingId: 0
        }
      }
  },
  
  ready: function() {
     
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
     onTapMission: function() {
       let missionData = this.data.missionData;

       //点击喜爱的时间块，覆盖选中的时间块
       this.triggerEvent('completeChoose', {
           missionData: missionData
       }, {
           bubbles: true,
           composed: true
       })
     }
  }
})
