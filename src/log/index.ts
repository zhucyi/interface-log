import * as nunjucks from 'nunjucks';
import flodTpl from './flod.html';
import flodCodeTpl from './flod-code.html';
import {
  JSONStringify,
  getObjName,
  isString,
  isNumber,
  isBoolean,
  isNull,
  isUndefined,
  isFunction,
  isSymbol,
  getObjAllKeys,
  isArray,
  isObject,
  htmlEncode,
  isMap,
} from '../util/tool';
import { String2Dom, hasClass, removeClass, addClass } from '../util/dom';
import './index.less';

class Log {
  _getOuter(obj) {
    let outer = '';
    let json = JSONStringify(obj);
    let preview = json.substr(0, 36);
    outer = getObjName(obj);
    if (json.length > 36) {
      preview += '...';
    }
    outer += ' ' + preview;
    return outer;
  }

  getFoldedLine(obj, outer?) {
    if (!outer) {
      outer = this._getOuter(obj);
    }
    let $line = <HTMLElement>String2Dom(
      nunjucks.renderString(flodTpl, {
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
      let $content = $inner;
      setTimeout(() => {
        if ($content.children.length > 0 || !obj) return;
        if (isMap(obj) && isMap(obj.__proto__)) {
          this._renderMapKeys(obj, $content);
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

  _renderObjectKeys(obj, $content) {
    let keys = getObjAllKeys(obj);
    keys.forEach(key => {
      let val;
      try {
        val = obj[key];
      } catch (e) {}
      this._renderFlow(obj, val, key, $content);
    });
  }
  _renderMapKeys(obj, $content) {
    obj.forEach((val, key) => {
      this._renderFlow(obj, val, key, $content);
    });
  }
  _renderFlow(obj, val, key, $content) {
    let valueType = 'undefined',
      keyType = '';
    // render
    let $sub;
    if (isMap(val)) {
      $sub = this._generateMap(val, key, keyType);
    } else if (isArray(val)) {
      $sub = this._generateArray(val, key, keyType);
    } else if (isObject(val)) {
      $sub = this._generateObject(val, key, keyType);
    } else {
      if (obj.hasOwnProperty && !obj.hasOwnProperty(key)) {
        keyType = 'private';
      }
      $sub = this._generateNormal(val, key, valueType, keyType);
    }
    $content.insertAdjacentElement('beforeend', $sub);
  }

  _generateMap(val, key, keyType) {
    let name = getObjName(val) + '[' + val.size + ']';
    return this.getFoldedLine(
      val,
      nunjucks.renderString(flodCodeTpl, {
        key,
        keyType,
        value: name,
        valueType: 'array',
      })
    );
  }
  _generateArray(val, key, keyType) {
    let name = getObjName(val) + '[' + val.length + ']';
    return this.getFoldedLine(
      val,
      nunjucks.renderString(flodCodeTpl, {
        key,
        keyType,
        value: name,
        valueType: 'array',
      })
    );
  }
  _generateObject(val, key, keyType) {
    let name = getObjName(val);
    return this.getFoldedLine(
      val,
      nunjucks.renderString(flodCodeTpl, {
        key: htmlEncode(key),
        keyType: keyType,
        value: name,
        valueType: 'object',
      })
    );
  }
  _generateNormal(val, key, valueType, keyType) {
    // handle value
    if (isString(val)) {
      valueType = 'string';
      val = '"' + val + '"';
    } else if (isNumber(val)) {
      valueType = 'number';
    } else if (isBoolean(val)) {
      valueType = 'boolean';
    } else if (isNull(val)) {
      valueType = 'null';
      val = 'null';
    } else if (isUndefined(val)) {
      valueType = 'undefined';
      val = 'undefined';
    } else if (isFunction(val)) {
      valueType = 'function';
      val = 'function()';
    } else if (isSymbol(val)) {
      valueType = 'symbol';
    }
    return String2Dom(
      nunjucks.renderString(flodTpl, {
        lineType: 'kv',
        key: htmlEncode(key),
        keyType: keyType,
        value: htmlEncode(val),
        valueType: valueType,
      })
    );
  }

  _renderPrototype(obj, $content) {
    // if (!isObject(obj)) return;
    let proto = obj.__proto__,
      $proto;
    // if (isObject(proto)) {
    $proto = this.getFoldedLine(
      proto,
      nunjucks.renderString(flodCodeTpl, {
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
