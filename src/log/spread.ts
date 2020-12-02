import * as nunjucks from 'nunjucks';
import flodTpl from './flod.html';
import codeTpl from './code.html';
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
  isSet,
} from '../util/tool';
import { String2Dom, hasClass, removeClass, addClass } from '../util/dom';

class Spread {
  obj: any;
  $content: HTMLElement;
  constructor(obj, $content) {
    this.obj = obj;
    this.$content = $content;
  }
  getFoldedLine(a, b) {}
  expand($content) {
    let keys = getObjAllKeys(obj);
    for (let i = 0; i < keys.length; i++) {
      let val,
        valueType = 'undefined',
        keyType = '';
      try {
        val = obj[keys[i]];
      } catch (e) {
        continue;
      }
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
      // render
      let $sub;
      if (isArray(val)) {
        let name = getObjName(val) + '[' + val.length + ']';
        $sub = this.getFoldedLine(
          val,
          nunjucks.renderString(flodCodeTpl, {
            key: keys[i],
            keyType: keyType,
            value: name,
            valueType: 'array',
          })
        );
      } else if (isObject(val)) {
        let name = getObjName(val);
        $sub = this.getFoldedLine(
          val,
          nunjucks.renderString(flodCodeTpl, {
            key: htmlEncode(keys[i]),
            keyType: keyType,
            value: name,
            valueType: 'object',
          })
        );
      } else {
        if (obj.hasOwnProperty && !obj.hasOwnProperty(keys[i])) {
          keyType = 'private';
        }
        let renderData = {
          lineType: 'kv',
          key: htmlEncode(keys[i]),
          keyType: keyType,
          value: htmlEncode(val),
          valueType: valueType,
        };

        $sub = String2Dom(nunjucks.renderString(flodTpl, renderData));
      }
      $content.insertAdjacentElement('beforeend', $sub);
    }
  }
}

export default Spread;
