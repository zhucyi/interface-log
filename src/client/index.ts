import { isArray, isString, isFunction, isObjectLike, get, set } from 'lodash';
import { Bridge } from './bridge';
import { Method } from './methods';
import { getObjName } from '../util/tool';
import { IProps } from '../types';
import Surface from '../surface';

class Client {
  props!: IProps;
  bridgeMap: Map<string, Bridge>;

  constructor(props: IProps) {
    this.props = props;
    this.bridgeMap = new Map();
    this.init();
  }

  init(): void {
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

  handleSingleBridge(bridgeName: string): void {
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

  handleSingleMethod(bridgeName: string, methodName: string): Fn<unknown> {
    const originBridge = get(window, bridgeName);
    const _bridge = this.bridgeMap.get(bridgeName);
    const method = new Method(methodName, bridgeName);
    _bridge.methods.set(methodName, method);
    const _fn = (...params) => get(originBridge, methodName)(...params);
    const fn = (...params) => {
      method.refresh().processing();
      // 拦截入参
      this.interceptParams(params, method);
      // 拦截返回值
      const result = _fn(...params);
      method.calSyncTime().setResult('return', result).finishSync();
      return result;
    };
    method._fn = _fn;
    method.fn = fn;
    return fn;
  }

  interceptParams(params: unknown[], method: Method): void {
    params.forEach((param, index) => {
      if (isFunction(param)) {
        // 处理返回值在回调中情况
        method.propsHasCallback = true;
        // _fn未包装函数 fn包装后被实际执行函数
        let _fn, fn;
        if (method.isRelated(<Fn<unknown>>param)) {
          _fn = method.getOriginFn(<Fn<unknown>>param);
          fn = param;
        } else {
          _fn = param;
          fn = (...args) => {
            const result = _fn.apply(this, args);
            method.calAsyncTime().setResult(`cb${index}`, args).finishAsync();
            return result;
          };
          method.addRelateFn(_fn).addRelateFn(fn);
        }

        params[index] = _fn;
        method.addProps({
          index,
          type: 'function',
          value: param,
          fn,
          _fn,
        });
        return;
      }

      const paramFn = get(window, param);
      if (isString(param) && isFunction(paramFn)) {
        // 返回值在回调中,但传入的是函数名称字符串
        method.propsHasCallback = true;
        // _fn未包装函数 fn包装后被实际执行函数
        let _fn, fn;
        if (method.isRelated(paramFn)) {
          _fn = method.getOriginFn(paramFn);
          fn = paramFn;
        } else {
          _fn = paramFn;
          fn = (...args) => {
            const result = paramFn.apply(this, args);
            method.calAsyncTime().setResult(`cb${index}`, args).finishAsync();
            return result;
          };
          method.addRelateFn(_fn).addRelateFn(fn);
        }

        set(window, param, fn);
        method.addProps({
          index,
          type: 'string',
          value: param,
          fn,
          _fn,
        });
      } else {
        method.addProps({
          index,
          type: getObjName(param),
          value: param,
        });
      }
    });
  }

  register(_surface: Surface): void {
    set(Client, 'surface', _surface);
    // Client.surface = _surface;
  }
}

export default Client;
