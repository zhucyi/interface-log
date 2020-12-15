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
    let a = 0;
    while (a < 1000000) {
      a++;
    }
    fn(123);
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
