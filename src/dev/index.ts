window.obj = {
  fun0: function (param) {
    return param;
  },
  fun1: function (param, fun) {
    fun(123);
  },
};
window.obj1 = {
  fun0: function (param) {
    return param;
  },
  fun1: function (param, fun) {
    fun(123);
  },
};

import InterfaceLog from '../index';
new InterfaceLog({ bridge: ['obj', 'obj1'] });

// var a = window.obj.fun0('fn0', function (res) {
//   console.log(res);
// });
// console.log(a);

window.obj.fun1('fn1', function (res) {
  console.log(`callback result: ${res}`);
});
