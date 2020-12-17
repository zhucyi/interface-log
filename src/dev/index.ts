import { get, set } from 'lodash';

set(window, 'obj', {
  fun0: function (param) {
    return param;
  },
  fun1: function (param, fun) {
    fun(123);
  },
  fn: function (key) {
    const fn = get(window, key);
    setTimeout(() => {
      fn(
        `{"data":{"historyBookMarkSwitch":1,"browserSugNum":8,"historyBookMarkNum":6},"hash":"9bd2aca4f28a54b9c96a856b5076d185"}`
      );
    }, 1000);
    return `{"data":{"historyBookMarkSwitch":1,"browserSugNum":8,"historyBookMarkNum":6},"hash":"9bd2aca4f28a54b9c96a856b5076d185"}`;
  },
});
set(window, 'function155993296.global1', function (param) {
  return new Promise(res => {
    console.log('result', param);
    res(param);
  });
});

import InterfaceLog from '../index';
new InterfaceLog({ bridge: ['obj', 'obj1'] });

console.log(+new Date());
get(window, 'obj')['fn']('function155993296.global1');
console.log(+new Date());
