import { get, set } from 'lodash';

set(window, 'obj', {
  fun0: function (param) {
    return param;
  },
  fun1: function (param, fun) {
    fun(123);
  },
  fn: function (key) {
    console.log(this);

    const fn = get(window, key);
    setTimeout(() => {
      fn(`{"data":{"test":1,"test1":8,"test2":6},"test3":"123"}`);
    }, 1000);
    return `{"data":{"test":1,"test1":8,"test2":6},"data1":{"test":1,"test1":8,"test2":6},"data13":{"test":1,"test1":8,"test2":6},"data12":{"test":1,"test1":8,"test2":6},"data11":{"test":1,"test1":8,"test2":6},"test3":"123"}`;
  },
});

function testt() {
  set(window, 'function155993296.global1', param => {
    console.log('callback', this);

    return new Promise(res => {
      console.log('result', param);
      res(param);
    });
  });
}
new testt();

import InterfaceLog from '../index';
new InterfaceLog({ bridge: ['obj', 'obj1'] });

console.log(+new Date());
get(window, 'obj')['fn']('function155993296.global1');
console.log(+new Date());
