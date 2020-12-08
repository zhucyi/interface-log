# interface-log
A lightweight front-end developer tool for mobile web page to show Android client interface。

Refer to the log tree of vconsole

## how to use 
import interface-log to initialize instance objects in the form of constructor  
Pass in the bridge name of jsbridge (the object name of the client mount method)
```shell
npm i interface-log
yarn add interface-log
```
```javascript
import InterfaceLog from 'interface-log';
new InterfaceLog({bridge:['bridgeName']});

```