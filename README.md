English | [简体中文](./README_CN.md)

# interface-log
A lightweight front-end debugging tool used to debug the mobile client interface (jsbridge).

## how to use 
### npm
***`interface-log` must be initialized before the client interface is called***
+ Import `interface-log` to initialize instance objects in the form of constructor
+ Pass in the bridge name of jsbridge (The global object name used by the client to mount the function)

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

Referring [vconsole](https://github.com/Tencent/vConsole) implementation

## License
MIT