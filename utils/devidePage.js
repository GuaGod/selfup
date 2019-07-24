/**
 * @class DevidePage 实现向下滑动获取更多，向上滑动刷新的分页
 */
import { MyHttp } from './requestUtil.js' 
function isValidString(property) {
  return (typeof property === 'string') && (property !== '');
}

class DevidePage {
  constructor({ url, dataName, pageIndex = 1, pageSize = 6, lockMode = true, method = 'GET'}) {
    if(!isValidString(url)) {
      console.error('分页的url是一个非空的字符串');
      return null;
    }

    if(!isValidString(dataName)) {
      console.error('分页的dataName是一个非空的字符串');
      return null;
    }

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.hasMore = true;
    this.url = url;
    this.method = method;
    this.dataName = dataName;
    this.cookie;
    this.loadLock = false;
    this.lockMode = lockMode;
  }

  setCookie(cookie) {
    this.cookie = cookie;
  }

  reset() {
    this.pageIndex = 1;
    this.hasMore = true;
  }

  getMore() {
    if(!this.hasMore) {
      return Promise.resolve({hasMore: false, [this.dataName]: [], fullData: {}});
    }

    if(this.lockMode && this.loadLock) {
      return Promise.resolve({hasMore: true, [this.dataName]: [], fullData: {}});
    }
     
    if(this.lockMode) {
      this.loadLock = true;
    }

    return MyHttp.request({
        url: this.url,
        method: this.method,
        data: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        },
        header: {
         'content-type': 'application/x-www-form-urlencoded',
         'Cookie': this.cookie, 
        },
      }).then((data) => {
        if (this.lockMode) {
          this.loadLock = false;
        }
        let list = data[this.dataName];
        if (list.length < this.pageSize) {
          this.hasMore = false;
        }
        this.pageIndex += list.length;

        return Promise.resolve({ hasMore: false, [this.dataName]: list, fullData: data });
      }, (error) => {
        if(this.lockMode) {
          this.loadLock = false;
        }
        return Promise.reject(error);
      })
  }
}

export {
  DevidePage
}