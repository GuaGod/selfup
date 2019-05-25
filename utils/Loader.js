import {MyDownload} from './downloadUtil.js'
import {createObserver} from './observerUtil.js'

const Loader = function () {
  let _loadNum = 0;
  let _loadLock = false;
  class Loader {
    constructor() {
      this.context;
      this.files;
      this.filepathMap;
    }

    init(context) {
      this.filepathMap = new Map();
      this.context = context || null;

      createObserver(context);
    }

    load(files) {
      this.files = files;
      this.loadNum = 0;
      this.total = this.files.size;
      _loadNum = 0;
      _loadLock = false;

      this._loadFiles(files);
    }

    _loadFiles(files) {
      let that = this;
      for (let [filename, filepath] of that.files.entries()) {
        that._loadAFile(filename, filepath);
      }
    }

    _loadAFile(filename, filepath) {
      let that = this;
      if(filepath === null || filepath === undefined || filepath === '') {
        that.filepathMap.set(filename, '');
        that.loadNum++;
        return ;
      }
      return MyDownload.download(filepath, 'image')
        .then(res => {
          that.filepathMap.set(filename, res.tempFilePath);
          that.loadNum++;

        }, err => {
          that.loadNum++;
          return Promise.resolve(false);
        })
    }

    set loadNum(value) {
      let oldValue = _loadNum;
      _loadNum = value;
      //如果已经加载完成，就上锁，停止以后的各种检测
      if (_loadLock) {
        return;
      }

      //如果新值大于旧值，就出发一次完成事件
      if (oldValue < value) {
        if (this.context === null) return;
        this.context.triggerEvent('loadSuccess', _loadNum, this.total);
      }

      if (_loadNum >= this.total) {
        if (this.context === null) return;
        this.context.triggerEvent('completeLoad', this.filepathMap);
        _loadLock = true;
      }
    }

    get loadNum() {
      return _loadNum;
    }
  }

  return Loader;

}();


export {
  Loader
}