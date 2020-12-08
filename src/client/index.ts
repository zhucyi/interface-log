import { isArray, isString, isFunction, isObjectLike, get, set } from 'lodash';
import { Bridge } from './bridge';
import { Method } from './methods';
import { getObjName } from '../util/tool';

class Client {
  props!: IProps;
  bridgeMap: Map<string, Bridge>;

  constructor(props: IProps) {
    this.props = props;
    this.bridgeMap = new Map();
    this.init();
  }

  init() {
    const { bridge } = this.props;
    const handle = name => {
      // 初始化bridge映射
      this.bridgeMap.set(name, new Bridge(name));
      this.handleSingleBridge(name);
    };
    if (isArray(bridge)) {
      (bridge as string[]).forEach(b => isString(b) && handle(b));
    }
    if (isString(bridge)) {
      handle(bridge);
    }
  }

  handleSingleBridge(bridge: string) {
    const bridgeMap = get(window, bridge);
    if (!isObjectLike(bridgeMap)) {
      return;
    }
    const bridgeMapClone = {};
    const keys = Object.keys(bridgeMap);
    keys.forEach(key => {
      if (!isFunction(bridgeMap[key])) {
        return;
      }
      const curBridge = this.bridgeMap.get(bridge);
      const method = new Method(key);
      curBridge.methods.set(key, method);
      const _fn = (...args) => bridgeMap[key](...args);
      const fn = (...params) => {
        method.refresh();
        // 拦截入参
        this.interceptParams(params, method);
        // 拦截返回值
        const result = _fn(...params);
        method.result.set('return', result);
        return result;
      };
      method._fn = _fn;
      method.fn = fn;
      bridgeMapClone[key] = fn;
    });
    window[bridge] = bridgeMapClone;
  }

  interceptParams(params, method: Method) {
    params.forEach((param, index) => {
      if (isFunction(param)) {
        // 处理返回值在回调中情况
        params[index] = (...args) => {
          method.result.set(`cb${index}`, args);
          return param.apply(this, args);
        };
        method.props.push({
          index,
          type: 'function',
          value: params[index],
          fn: param,
          _fn: params[index],
        });
        return;
      }

      const _fn = get(window, param);
      if (isString(param) && isFunction(_fn)) {
        // 返回值在回调中,但传入的是函数名称字符串
        const fn = (...args) => {
          method.result.set(`cb${index}`, args);
          return _fn.apply(this, args);
        };
        set(window, param, fn);
        method.props.push({
          index,
          type: 'string',
          value: param,
          fn,
          _fn,
        });
      } else {
        method.props.push({
          index,
          type: getObjName(param),
          value: param,
        });
      }
    });
  }
}
export default Client;
