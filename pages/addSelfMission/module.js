let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const planAPI = globalData.planAPI;

class MissionNow{
   constructor() {
     this.thingColor = "#f2a7a5";
     this.thingName;
   }

   chooseThingColor(color) {
     this.thingColor = color;
   }

   inputThingName(name) {
     this.thingName = name;
   }

   submit(thingClass) {
      let that = this;
      if(this.thingName === undefined) {
        return false;
      }

      let data = {
        "thingId": null,
        "thingName": that.thingName,
        "thingColor": that.thingColor,
        "createTime": null,
        "lastEditTime": null,
        "user": null,
        "thingClass": thingClass 
      }

      return MyHttp.request({
        url: planAPI.addSelfMission,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': getApp().globalData.LOGIN_COOKIE
        },
        method: 'POST',
        data: {
           thingStr: JSON.stringify(data)
        }
      })
   }
}

export {
  MissionNow
}