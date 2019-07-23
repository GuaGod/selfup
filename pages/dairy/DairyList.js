let globalData = getApp().globalData;
const dairyAPI = globalData.dairyAPI;
const MyHttp = globalData.MyHttp;
const MyDate = globalData.MyDate;
const DevidePage = globalData.DevidePage;
let myDate = new MyDate();


class DairyList extends DevidePage {
  constructor() {
    super({ url: dairyAPI.findEmotionContent, dataName: 'emotionList'});
    this.isInit = false;
    this.emotionList = [];
  }

  getMore() {
    return super.getMore()
                .then((data) => {
                  let emotionList = this.operateData(data.emotionList);
                  this.emotionList = this.emotionList.concat(emotionList);
                  data.emotionList = emotionList;

                  return Promise.resolve(data);
                }, (error) => {
                  return Promise.reject(error);
                })
  }

  reset() {
    super.reset();
    this.emotionList = [];
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

  operateData(emotionList) {
    let operatedData = [];

    emotionList.forEach(item => {
      let tmp = {};
      try {
        tmp.content = item.content.split('').splice(0, 40).join('');
      } catch (err) {
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

      } catch (err) {
        tmp.time = '00/00';
      }

      operatedData.push(tmp);
    });

    return operatedData;
  }
}

export {
  DairyList
}