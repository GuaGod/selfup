let globalData = getApp().globalData;
const dairyAPI = globalData.dairyAPI;
const MyHttp = globalData.MyHttp;
const MyDate = globalData.MyDate;
let myDate = new MyDate();


class DairyList {
  constructor() {
    this.isInit = false;
    this.dairyList = [];
    this.pageIndex = 1;
    this.pageSize = 6;
    this.hasMoreDairy = true;
  }

  init() {
    this.pageIndex = 1;
    this.pageSize = 6;
    this.dairyList = [];
    this.hasMoreDairy = true;
  }

  getMoreDairys() {
     let that = this;
     return MyHttp.request({
       url: dairyAPI.findEmotionContent,
       header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE
       },
       data: {
          pageSize: that.pageSize, 
          pageIndex: that.pageIndex
       }, 
     }).then((data) => {
        
        let emotionList = data.emotionList;
        if(emotionList.length < that.pageSize) {
          this.hasMoreDairy = false;
        }
        
        this.pageIndex += emotionList.length;
        
        return Promise.resolve(data.emotionList);
     }, (err) => {
        return Promise.reject(err);
     })
  }
   
  operateData(emotionList) {
      let operatedData = [];
      
      emotionList.forEach(item => {
          let tmp = {};
          try {
            tmp.content = item.content.split('').splice(0, 40).join('');
          } catch(err) {
            tmp.content = '';
          }

          tmp.title = item.title || '无标题';
          
          tmp.emotionValue = Number(item.emotionValue) || 0;
          tmp.emotionValue = Math.ceil((tmp.emotionValue + 8) * 6.25);
        if (tmp.emotionValue < 0) {
          tmp.emotionValue = 0;
          }

        if (tmp.emotionValue > 100) {
          tmp.emotionValue = 100;
          }

          tmp.id = item.emotionId;

          try {
            tmp.time = item.createTime.split('').splice(0, 10).join('');

            let timeObj = myDate.parseDateStr(tmp.time);
            let timeStr = `${timeObj.year}-${timeObj.month}-${timeObj.day}  ${myDate.weekChMap.get(timeObj.week)}`;
            tmp.time = timeStr;
            
          } catch(err) {
            tmp.time = '00/00';
          }

          operatedData.push(tmp);          
      });

      return operatedData;
  }

  deleteDairy(dairyId) {
    
    return MyHttp.request({
      url: dairyAPI.deleteEmotion,
      data: {
        emotionId: dairyId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': getApp().globalData.LOGIN_COOKIE
      }
    })
  }
    
}

export {
  DairyList
}