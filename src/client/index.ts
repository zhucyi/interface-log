import { isArray, isString, isFunction } from 'lodash';
import { Bridge, Method } from '../bridge';

class Client {
  props!: IProps;
  bridgeMap: Map<string, Bridge>;
  curBridgeName: string;
  curMethodsName: string;

  constructor(props: IProps) {
    this.props = props;
    this.bridgeMap = new Map();
    this.init();
  }

  init() {
    const { bridge } = this.props;
    const handle = name => {
      this.curBridgeName = name;
      this.bridgeMap.set(name, new Bridge(name));
      this.handleSingleBridge(name);
    };
    if (isArray(bridge)) {
      (bridge as string[]).forEach(b => handle(b));
    }
    if (isString(bridge)) {
      handle(bridge);
    }
  }

  handleSingleBridge(bridge) {
    if (typeof bridge === 'string') {
      const bridgeMap = window[bridge];
      const keys = Object.keys(bridgeMap);
      keys.forEach(key => {
        if (!isFunction(bridgeMap[key])) {
          return;
        }
        const curBridge = this.bridgeMap.get(this.curBridgeName);
        const method = new Method(key);
        curBridge.methods.set(key, method);
        const _fn = bridgeMap[key];
        const fn = (...params) => {
          method.refresh();
          // 拦截入参
          this.interceptParams(params, method);
          // 拦截返回值
          const result = _fn.apply(this, params);
          method.result.set('return', result);
          return result;
        };
        method._fn = _fn;
        method.fn = fn;
        bridgeMap[key] = fn;
      });
    }
  }

  interceptParams(params, method: Method) {
    params.forEach((param, index) => {
      method.props.push(param);
      if (isFunction(param)) {
        // 处理返回值在回调中情况
        params[index] = (...args) => {
          method.result.set(`cb${index}`, args);
          return param.apply(this, args);
        };
      }
    });
  }
}
export default Client;
