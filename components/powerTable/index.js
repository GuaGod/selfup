// components/powerTable/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     powerList: {
       type: Array,
       value: [],
       observer: function(newValue, oldValue ){
           let _powerList = [];
           newValue.forEach(item => {
              let _obj  = item;
              let percent = item.percent || 0;
              percent = parseInt(percent);
              if(item.statement === 'heart') {
                 percent = Math.ceil((percent + 6) * 8.3);
              }
              
              _obj.percent = percent; 
              _powerList.push(_obj);
              
           })

           

           this.setData({
             _powerList
           })
       }
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
     _powerList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
      moreInformation: function() {
         wx.navigateTo({
           url: '../analyse/analyse',
         })
      }
  }
})
