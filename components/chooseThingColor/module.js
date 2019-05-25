import { colorArr } from './color.js'

class ColorChoose {
  constructor() {
      this.boxObjArr = [];
  }

  init(view) {
    let that = this;
    for (let [index, value] of colorArr.entries()) {
      let boxObj = {

      };
      boxObj.id = index;
      boxObj.bgColor = value;
      boxObj.isShow = false;
      that.boxObjArr.push(boxObj);
    }
    this.boxObjArr[0].isShow = true;
    this._render(view);
  }

  tapColorBox(view, id) {
    let that = this;
    for(let boxObj of that.boxObjArr) {
       boxObj.isShow = false;
    }
    this.boxObjArr[id].isShow = true;
    this._render(view);
  }

  clear(view) {
    this.boxObjArr = [];
    this._render(view);
  }

  _render(view) {
     let that = this;
     view.setData({
         boxObjArr: that.boxObjArr
     })
  }
}

export {
  ColorChoose
}