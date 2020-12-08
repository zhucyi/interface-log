import { get } from 'lodash';

window.obj = {
  fun0: function (param) {
    return param;
  },
  fun1: function (param, fun) {
    fun(123);
  },
  fn: function (key) {
    const fn = get(window, key);
    fn(123);
  },
};
window.function155993296 = {};
window.function155993296.global1 = function (param) {
  console.log('result', param);
  return param;
};

import InterfaceLog from '../index';
new InterfaceLog({ bridge: ['obj', 'obj1'] });

window.obj.fn('function155993296.global1');
