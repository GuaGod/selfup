import {ColorChoose} from './module.js'
let colorChoose = new ColorChoose();
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
     boxObjArr: []
  },
  
  ready: function() {
     colorChoose.init(this);
  },

  detached: function() {
     colorChoose.clear(this);
  },
  /**
   * 组件的方法列表
   */
  methods: {
      onTapColorBox: function(e) {
         let id = e.detail.id;
         colorChoose.tapColorBox(this, id);
         let bgColor = this.data.boxObjArr[id].bgColor;
         this.triggerEvent('chooseThingColor', {
            thingColor: bgColor
         }, {
           bubbles: true,
           composed: true
         })
      }
  }
})
