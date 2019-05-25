// components/addSelfMission/inputThinName/index.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
     onInputThingName: function(e) {
        let thingName = e.detail.value;
        this.triggerEvent('inputThingName', {
          thingName: thingName
        }, {
          bubbles: true,
          composed: true
        })
     }
  }
})
