# interface-log
A lightweight front-end developer tool for mobile web page to show Android client interface。

## how to use 
***interface-log must be initialized before the client interface is called***
+ Import interface-log to initialize instance objects in the form of constructor
+ Pass in the bridge name of jsbridge (the object name of the client mount method)

```shell
npm i interface-log
yarn add interface-log
```
```javascript
import InterfaceLog from 'interface-log';
new InterfaceLog({bridge:['bridgeName']});

```

Refer to [vconsole](https://github.com/Tencent/vConsole) implementation

## License
MIT