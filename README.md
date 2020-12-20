English | [简体中文](./README_CN.md)

# interface-log
A lightweight front-end debugging tool used to debug the mobile client interface (jsbridge).

When developing some h5 pages embedded in `webview`, some capabilities provided by the client are used, or some data needs to be obtained from the client. This method is mostly the `jsbridge` method. The principle is to call the client-side function registered under a certain attribute of the global object window, and get the data from the function return value or the corresponding callback. This kind of data cannot be viewed through `Chrome://inspect`, and `Charles` cannot capture packets (maybe I don't know). `Interface-log` records the calling process of `jsbridge` function in a visual way, and returns data to improve the efficiency of development and testing.
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

### tips
The execution stage is distinguished by taking a snapshot of the function execution state, including four states of `ready`, `processing`, `sync-finish`, and `async-finish`, and the call state is distinguished by color.
+ The ready function has been initialized and is ready to be called.
+ The processing function is being executed.
+ sync-finish synchronization function execution ends.
+ async-finish asynchronous function (getting the return value through callback) function execution ends.

Long press on the list content item to display the content details.

Referring [vconsole](https://github.com/Tencent/vConsole) implementation

## License
MIT