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
              if(item.statement === '情绪') {
                 percent = Math.ceil((percent + 8) * 6.25);
                 if(percent < 0) {
                   percent = 0;
                 } 
                 if(percent > 100) {
                   percent = 100;
                 }
              }
              
              _obj.percent = percent; 
              _powerList.push(_obj);
              
           })

           
           this.setData({
             _powerList
           })
       }
     },
     isFriend: {
       type: Boolean,
       value: false
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
     _powerList: [],
     isImageShow: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
      moreInformation: function() {
         wx.navigateTo({
           url: '../analyse/analyse',
         })
      },
    toggle: function () {
      this.setData({
        isImageShow: !this.data.isImageShow
      })
    },
  }
})
