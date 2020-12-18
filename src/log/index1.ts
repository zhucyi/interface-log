import foldArt from './flod.art';
import flodCodeArt from './flod-code.art';
import {
  JSONStringify,
  getObjName,
  getObjAllKeys,
  isObject,
  htmlEncode,
  hasOwnProperty,
} from '../util/tool';
import {
  isArray,
  isMap,
  isString,
  isNumber,
  isBoolean,
  isNull,
  isUndefined,
  isFunction,
  isSymbol,
} from 'lodash';
import { String2Dom, hasClass, removeClass, addClass } from '../util/dom';
import './index.less';

class Log {
  $line: HTMLElement;
  constructor(obj: unknown) {
    this.$line = this.getFoldedLine(obj);
  }

  _getOuter(obj: unknown): string {
    let outer = '';
    const json = JSONStringify(obj);
    let preview = json.substr(0, 36);
    outer = getObjName(obj);
    if (json.length > 36) {
      preview += '...';
    }
    outer += ' ' + preview;
    return outer;
  }

  getFoldedLine(obj: unknown, outer?: string): HTMLElement {
    if (!outer) {
      outer = this._getOuter(obj);
    }
    const $line = <HTMLElement>String2Dom(
      foldArt({
        outer: outer,
        lineType: 'obj',
      })
    );
    $line.querySelector('.vc-fold-outer').addEventListener('click', () => {
      const $inner = <HTMLElement>$line.querySelector('.vc-fold-inner');
      const $outer = <HTMLElement>$line.querySelector('.vc-fold-outer');
      if (hasClass($line, 'vc-toggle')) {
        removeClass($line, 'vc-toggle');
        removeClass($inner, 'vc-toggle');
        removeClass($outer, 'vc-toggle');
      } else {
        addClass($line, 'vc-toggle');
        addClass($inner, 'vc-toggle');
        addClass($outer, 'vc-toggle');
      }
      const $content = $inner;
      setTimeout(() => {
        if ($content.children.length > 0 || !obj) return;
        if (isMap(obj) && isMap(Object.getPrototypeOf(obj))) {
          this._renderMapKeys(<Map<unknown, unknown>>obj, $content);
        } else {
          // render object's keys
          this._renderObjectKeys(obj, $content);
        }
        // render object's prototype
        this._renderPrototype(obj, $content);
      });
      return false;
    });
    return $line;
  }

  _renderObjectKeys(obj: unknown, $content: HTMLElement): void {
    const keys = getObjAllKeys(obj);
    keys.forEach(key => {
      let val;
      try {
        val = obj[key];
        // eslint-disable-next-line no-empty
      } catch (e) {}
      this._renderFlow(obj, val, key, $content);
    });
  }
  _renderMapKeys(obj: Map<unknown, unknown>, $content: HTMLElement): void {
    obj.forEach((val, key) => {
      this._renderFlow(obj, val, key, $content);
    });
  }
  _renderFlow(
    obj: unknown,
    val: unknown,
    key: unknown,
    $content: HTMLElement
  ): void {
    const valueType = 'undefined';
    let keyType = '';
    // render
    let $sub;
    if (isMap(val)) {
      $sub = this._generateMap(<Map<unknown, unknown>>val, key, keyType);
    } else if (isArray(val)) {
      $sub = this._generateArray(<unknown[]>val, <number>key, keyType);
    } else if (isObject(val)) {
      $sub = this._generateObject(val, <string>key, keyType);
    } else {
      if (!hasOwnProperty.call(obj, key)) {
        keyType = 'private';
      }
      $sub = this._generateNormal(val, <string>key, valueType, keyType);
    }
    $content.insertAdjacentElement('beforeend', $sub);
  }

  _generateMap(
    val: Map<unknown, unknown>,
    key: unknown,
    keyType: string
  ): HTMLElement {
    const name = getObjName(val) + '[' + val.size + ']';
    return this.getFoldedLine(
      val,
      flodCodeArt({
        key,
        keyType,
        value: name,
        valueType: 'array',
      })
    );
  }

  _generateArray(val: unknown[], key: number, keyType: string): HTMLElement {
    const name = getObjName(val) + '[' + val.length + ']';
    return this.getFoldedLine(
      val,
      flodCodeArt({
        key,
        keyType,
        value: name,
        valueType: 'array',
      })
    );
  }
  _generateObject(val: unknown, key: string, keyType: string): HTMLElement {
    const name = getObjName(val);
    return this.getFoldedLine(
      val,
      flodCodeArt({
        key: htmlEncode(key),
        keyType: keyType,
        value: name,
        valueType: 'object',
      })
    );
  }
  _generateNormal(
    val: unknown,
    key: string,
    valueType: string,
    keyType: string
  ): HTMLElement {
    let value = String(val);
    // handle value
    if (isString(val)) {
      valueType = 'string';
      value = '"' + val + '"';
    } else if (isNumber(val)) {
      valueType = 'number';
    } else if (isBoolean(val)) {
      valueType = 'boolean';
    } else if (isNull(val)) {
      valueType = 'null';
      value = 'null';
    } else if (isUndefined(val)) {
      valueType = 'undefined';
      value = 'undefined';
    } else if (isFunction(val)) {
      valueType = 'function';
      value = 'function()';
    } else if (isSymbol(val)) {
      valueType = 'symbol';
    }
    return <HTMLElement>String2Dom(
      foldArt({
        lineType: 'kv',
        key: htmlEncode(key),
        keyType: keyType,
        value: htmlEncode(value),
        valueType: valueType,
      })
    );
  }

  _renderPrototype(obj: unknown, $content: HTMLElement): void {
    // if (!isObject(obj)) return;
    const proto = Object.getPrototypeOf(obj);
    // let $proto;
    // if (isObject(proto)) {
    const $proto = this.getFoldedLine(
      proto,
      flodCodeArt({
        key: '__proto__',
        keyType: 'private',
        value: getObjName(proto),
        valueType: 'object',
      })
    );
    // } else {
    //   // if proto is not an object, it should be `null`
    //   $proto = String2Dom(
    //     nunjucks.renderString(flodCodeTpl, {
    //       key: '__proto__',
    //       keyType: 'private',
    //       value: 'null',
    //       valueType: 'null',
    //     })
    //   );
    // }
    $content.insertAdjacentElement('beforeend', $proto);
  }
}

export default Log;
