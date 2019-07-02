import {
  femaleAnswerMap,
  maleAnswerMap,
} from './data.js'
import {
  AssertLoader
} from './AssertLoader.js'

let globalData = getApp().globalData;
const MyHttp = globalData.MyHttp;
const selfAPI = globalData.selfAPI;

/**
 * @class Person 保存着用户在创建人物的过程中，所存储的各种数据
 * @property {Number} sex 性别的标识 0是女性 1是男性
 * @property {Object} hair 头发图片的图片imgId 图片的远程路径imgAddrGood
 * @property {Object} cloth 衣服图片的图片imgId 图片的远程路径imgAddrGood
 * @property {Object} body 身体图片的图片imgId 图片的远程路径imgAddrGood
 * @property {Object} head 头（表情）图片的图片imgId 图片的远程路径imgAddrGood
 * @property {Array} _imgArr 对应性别的所有图片路径的数组
 */

class Person {
  constructor() {
    this.sex;
    this.hair = {};
    this.cloth = {};
    this.body = {};
    this.head = {};
    this._imgArr = [];
  }


  /**
   * @method setSex 用户选择性别之后，设置对应的属性
   * @for Person
   * @arguments {Number} sex 包括两种 一种是0表示女性 一种是1 表示男性
   * @return {Promise}
   */

  setSex(sex) {
    let that = this;
    //如果现在的性别和之前的性别一样，直接返回
    if (this.sex === sex) {
      return;
    }
    this.sex = sex;

    return AssertLoader.findImgBySex(sex)
      .then((res) => {                                    //给person设置所有的图片，并且找到body（身体部分）
        that._imgArr = res.img;
        that._imgArr.forEach((item) => {
            if(item.imgPart === 'body') {
              that.body = item;
            }
            if(item.imgPart === 'head' && item.imgPartClass === 'ljDefault') {
              that.head = item;
              return false;
            }
        })

 
        
        Promise.resolve({
          success: true
        })
      }, () => {
        Promise.reject({
          success: false
        })
      })
  }

  /**
   * @method setAnswer 用户回答问题之后触发，找到对应的装饰
   * @for Person
   * @argument {String} answerStr 答案字符串 由三个字符组成 如AAA 表示三个问题都选择了A项
   */

  setAnswer(answerStr) {
    let that = this;
    console.log(answerStr);
    let answerMap = Number(this.sex) === 0 ? femaleAnswerMap : maleAnswerMap;
    let hairAndClothCode = answerMap.get(answerStr);
    let hairCode = Math.floor(hairAndClothCode / 10);
    let clothCode = hairAndClothCode % 10;

    for (let index in that._imgArr) {
      let item = that._imgArr[index];
      if (item.imgPart === 'hair' && String(item.imgName) === String(hairCode)) {
        that.hair = item;
        continue;
      }
      if (item.imgPart === 'cloth' && String(item.imgName) === String(clothCode)) {
        that.cloth = item;
      }
    }
  }

  /**
   * @method createPerson 向服务器发起请求创建人物
   * @for Person
   * @arguments {Void}
   * @return {Promise}
   */

  createPerson() {
    let that = this;

    return MyHttp.request({
      url: selfAPI.create,
      header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': getApp().globalData.LOGIN_COOKIE 
      },
      data: {
        figureStr: JSON.stringify({
          "figureId": null,
          "head": that.head.imgAddrGood,
          "cloth": that.cloth.imgAddrGood,
          "userId": null,
          "hair": that.hair.imgAddrGood,
          "body": that.body.imgAddrGood,
          "createTime": null,
          "backdrop": null,
          "lastEditTime": null
        }),
        sex: that.sex, 
      },
      method: 'POST'
    })
  }

  /**
   * @method downLoadPersonImg 下载人物的图片
   * @for Person
   * @return Promise
   */

  downloadPersonImg(imgMap) {
      let that = this;
 
      return AssertLoader.download(imgMap);              
  }


  savePersonImg(fileArr) {
      return AssertLoader.save(fileArr);
  }

  setLocalFile(fileArr) {
      this.hair.localPath = fileArr[0];
      this.cloth.localPath = fileArr[1];
      this.body.localPath = fileArr[2];
      this.head.localPath = fileArr[3];
  }

  storageToCache(fileArr) {
      return AssertLoader.storageToCache(fileArr);
  }

  /**
   * @method getPersonImg
   * @for Person 
   */

  getPersonImg() {
      let that = this;
      return {
        hair : that.hair.localPath.savedFilePath,
        cloth: that.cloth.localPath.savedFilePath,
        body: that.body.localPath.savedFilePath,
        head: that.body.localPath.savedFilePath
      }
  }
}

export {
  Person
}