import './client';
import InterfaceLog from './InterfaceLog';

window.interfaceLog = new InterfaceLog({
  bridge: 'obj',
});

var a = window.obj.fun0('fn0', function (res) {
  console.log(res);
});
console.log(a);

window.obj.fun1('fn1', function (res) {
  console.log(`callback result: ${res}`);
});
