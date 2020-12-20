[English](./CHANGELOG.md) | 简体中文

# interface-log
一个用来调试手机客户端接口（jsbridge）轻量级前端调试工具。

当开发一些嵌入`webview`的h5页面时，会用到客户端提供的一些能力，亦或者需要从客户端获取一些数据。这种手段大多就是`jsbridge`方式。原理就是调用客户端注册在全局对象`window`某个属性下的函数，在函数返回值或者对应的回调中获取数据。这种数据没法通过`Chrome://inspect`查看，`charles`也没法抓包（或许可以我不知道）。`interface-log`以可视化的方式记录`jsbridge`函数的调用过程，跟返回数据，提高开发测试效率。
## 使用方法
### npm 
***interface-log一定要在客户端接口被调用之前初始化（实例化）***
+ 导入`interface-log`，用new构造函数的方法初始化
+ 传入bridge的名称（客户端用于挂载函数的全局对象名称）

```shell
npm i interface-log
yarn add interface-log
```
```javascript
import InterfaceLog from 'interface-log';
new InterfaceLog({bridge:['bridgeName']});

```
### cdn
```html
<script src="https://unpkg.com/interface-log@latest"></script>
<!-- @latest can be specific version,like @1.1.2 -->
```
Referring [unpkg](https://unpkg.com)

### 提示
通过对函数执行状态打快照来区分执行阶段，包括`ready`，`processing`，`sync-finish`，`async-finish`四种状态，通过颜色区分调用状态。
+ ready 函数已初始化，准备调用。
+ processing 函数正在执行中。
+ sync-finish 同步函数执行结束。
+ async-finish 异步函数（通过回调方式获取返回值）函数执行结束。

对列表内容项长按，展示内容详情。

参考 [vconsole](https://github.com/Tencent/vConsole) 实现

## License
MIT