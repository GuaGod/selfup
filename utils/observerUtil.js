/**
 * @module 把一个对象包装成有观察者能力的对象
 */
function createObserver(obj) {
  obj.event = {},
    obj.on = function(eventName, fn) {
      if (!this.event[eventName]) {
        this.event[eventName] = [];
      }

      this.event[eventName].push(fn);
    };
  obj.triggerEvent = function(eventName, ...args) {
    if (!this.event[eventName]) {
      return;
    }
    let events = this.event[eventName];
    for (let i = 0, len = events.length; i < len; i++) {
      let event = events[i];
      event.call(null, ...args);
    }
  };
  obj.remove = function(eventName) {
    delete this.event[eventName];
  };


  return obj;
}

export {
  createObserver
}