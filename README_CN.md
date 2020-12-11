[English](./CHANGELOG.md) | 简体中文

# interface-log
一个用来调试手机客户端接口（jsbridge）轻量级前端调试工具。

## 使用方法 
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

参考 [vconsole](https://github.com/Tencent/vConsole) 实现

## License
MIT