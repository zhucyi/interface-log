const obj: PlainObject = {};
obj.fun0 = function (param) {
  return param;
};

obj.fun1 = function (param, fun) {
  fun(123);
};

window.obj = obj;
