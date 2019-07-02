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
        },
        observer: function(newValue) {
          let copy = {};
          try {
          copy.thingColor = newValue.thingColor;
          copy.thingName = newValue.thingName.slice(0, 2);
          copy.thingId = newValue.thingId;
          } catch(e) {
            copy = {
              thingColor: "",
              thingName: "",
              thingId: 0
            };
          }
          this.setData({
            _missionData: copy
          })
        }
      }
  },
  
  ready: function() {
     
  },
  /**
   * 组件的初始数据
   */
  data: {
      _missionData: {
        thingColor: "",
        thingName: "",
        thingId: 0
      }
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
