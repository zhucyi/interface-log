import './client';
import Client from './client/index';
import Log from './log/index';
import Surface from './surface';

window.client = new Client({
  bridge: 'obj',
});

// var a = window.obj.fun0('fn0', function (res) {
//   console.log(res);
// });
// console.log(a);

window.obj.fun1('fn1', function (res) {
  console.log(`callback result: ${res}`);
});

const surface = new Surface();

var log = new Log();
const $dom = log.getFoldedLine(window.client);

console.log(window.client);

surface.append($dom);
