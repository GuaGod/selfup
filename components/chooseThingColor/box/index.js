// components/addSelfMission/chooseThingColor/box/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      boxData: {
        value: {},
        type: Object,
        observer: function(newVal, oldVal) {
           this.setData({
             isShow: newVal.isShow
           })
        }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
     bgColor: "",
     isShow: false,
     id: 0  
  },
  
  ready: function() {
     let that = this;
     this.setData({
       bgColor: that.data.boxData.bgColor,
       isShow: that.data.boxData.isShow,
       id: that.data.boxData.id
     })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTapColorBox: function() {
       let id = this.data.id;
       this.triggerEvent('tapColorBox', {
           id: id
       }, {});
    }
  }
})
