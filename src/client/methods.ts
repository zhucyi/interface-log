import { MethodsProps, MethodsResult } from '../types';
import Client from '../client';
import { get } from 'lodash';
import Surface from '../surface';
import { parse } from '../util/tool';

let count = 0;
export class Method {
  id: number;
  name: string;
  bridgeName: string;
  _fn: Fn<unknown>;
  fn: Fn<unknown>;
  status = 'ready'; //ready,processing,sync/async-finish
  startTime!: number;
  syncTime!: number;
  asyncTime!: number;
  propsHasCallback = false;
  relateFns = []; // 处理回调函数参数重复调用
  props: MethodsProps[] = [];
  result: Map<string, MethodsResult> = new Map();

  constructor(name: string, bridgeName: string) {
    this.id = count++;
    this.name = name;
    this.bridgeName = bridgeName;
  }

  refresh(): Method {
    this.status = 'ready';
    this.startTime = +new Date();
    this.syncTime = 0;
    this.asyncTime = 0;
    this.props = [];
    this.result = new Map();
    return this;
  }

  isRelated(fn: Fn<unknown>): boolean {
    const filter = this.relateFns.findIndex(_fn => _fn === fn);
    return filter > -1;
  }
  getOriginFn(fn: Fn<unknown>): Fn<unknown> {
    // 包装函数在原始函数之后push，按位置算是匹配项前一个
    const filter = this.relateFns.findIndex(_fn => _fn === fn) - 1;
    return this.relateFns[filter];
  }
  addRelateFn(fn: Fn<unknown>): Method {
    this.relateFns.push(fn);
    return this;
  }

  // status change
  processing(): Method {
    this.status = 'processing';
    this.collect(this);
    return this;
  }
  finishSync(): Method {
    this.status = 'sync-finish';
    this.collect(this);
    return this;
  }
  finishAsync(): Method {
    this.status = 'async-finish';
    this.collect(this);
    return this;
  }

  collect(method: Method): void {
    const surface = <Surface>get(Client, 'surface');
    surface.push(method);
  }

  calSyncTime(): Method {
    this.syncTime = +new Date() - this.startTime;
    return this;
  }
  calAsyncTime(): Method {
    this.asyncTime = +new Date() - this.startTime;
    return this;
  }

  setResult(name: string, result: unknown | unknown[]): Method {
    this.result.set(name, {
      origin: result,
      prettier: parse(result),
    });
    // 针对callback的回调参数进行显示优化
    if (/callback/.test(name)) {
      ``;
      const _result = (<unknown[]>result).map(item => parse(item));
      this.result.set(name, {
        origin: result,
        prettier: parse(_result),
      });
    }
    return this;
  }
  addProps(prop: MethodsProps): Method {
    this.props.push(prop);
    return this;
  }
}
