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

  handleSingleBridge(bridgeName: string) {
    // origin bridge
    const originBridge = get(window, bridgeName);
    if (!isObjectLike(originBridge)) {
      return;
    }
    const newBridge = {};
    const bridgeKeys = Object.keys(originBridge);
    bridgeKeys.forEach(key => {
      if (!isFunction(originBridge[key])) {
        return;
      }
      set(newBridge, key, this.handleSingleMethod(bridgeName, key));
    });
    set(window, bridgeName, newBridge);
  }

  handleSingleMethod(bridgeName: string, methodName: string): Function {
    const originBridge = get(window, bridgeName);
    const _bridge = this.bridgeMap.get(bridgeName);
    const method = new Method(methodName);
    _bridge.methods.set(methodName, method);
    const _fn = (...params) => get(originBridge, methodName)(...params);
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
    return fn;
  }

  interceptParams(params, method: Method) {
    params.forEach((param, index) => {
      if (isFunction(param)) {
        method.propsHasCallback = true;
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
        method.propsHasCallback = true;
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
