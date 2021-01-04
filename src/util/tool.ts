import {
  isNumber,
  isString,
  isArray,
  isBoolean,
  isUndefined,
  isNull,
  isSymbol,
  isMap,
  isWeakMap,
  isSet,
  isWeakSet,
  isFunction,
  isObjectLike,
} from 'lodash';

export function isObject(value: unknown): boolean {
  return (
    Object.prototype.toString.call(value) == '[object Object]' ||
    // if it isn't a primitive value, then it is a common object
    (!isNumber(value) &&
      !isString(value) &&
      !isBoolean(value) &&
      !isArray(value) &&
      !isNull(value) &&
      !isFunction(value) &&
      !isUndefined(value) &&
      !isSymbol(value) &&
      !isMap(value) &&
      !isWeakMap(value) &&
      !isSet(value) &&
      !isWeakSet(value))
  );
}
export function isWindow(value: unknown): boolean {
  const toString = Object.prototype.toString.call(value);
  return (
    toString == '[object global]' ||
    toString == '[object Window]' ||
    toString == '[object DOMWindow]'
  );
}

/**
 * Simple JSON stringify, stringify top level key-value
 */
export function JSONStringify(stringObject: unknown): string {
  // if (!isObject(stringObject) && !isArray(stringObject)) {
  //   return JSON.stringify(stringObject);
  // }
  if (!isObjectLike(stringObject)) {
    return String(stringObject);
  }

  let prefix = '{',
    suffix = '}';
  if (isArray(stringObject)) {
    prefix = '[';
    suffix = ']';
  }
  let str = prefix;
  const keys = getObjAllKeys(stringObject);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = stringObject[key];
    try {
      // key
      if (!isArray(stringObject)) {
        if (isObject(key) || isArray(key) || isSymbol(key)) {
          str += Object.prototype.toString.call(key);
        } else {
          str += key;
        }
        str += ': ';
      }

      // value
      if (isArray(value)) {
        str += 'Array[' + value.length + ']';
      } else if (isObject(value) || isSymbol(value) || isFunction(value)) {
        str += Object.prototype.toString.call(value);
      } else {
        str += JSON.stringify(value);
      }
      if (i < keys.length - 1) {
        str += ', ';
      }
    } catch (e) {
      continue;
    }
  }
  str += suffix;
  return str;
}

/**
 * get an object's all keys ignore whether they are not enumerable
 */
export function getObjAllKeys(obj: unknown): string[] {
  return Object.getOwnPropertyNames(obj).sort();
}

/**
 * get an object's prototype name
 */
export function getObjName(obj: unknown): string {
  return Object.prototype.toString
    .call(obj)
    .replace('[object ', '')
    .replace(']', '');
}

export function htmlEncode(text: string): string {
  const $a = document.createElement('a');
  $a.appendChild(document.createTextNode(text));
  return $a.innerHTML;
}

export const hasOwnProperty = Object.prototype.hasOwnProperty;

// http://www.alloyteam.com/2013/12/js-calculate-the-number-of-bytes-occupied-by-a-string/
export function sizeOf(str: string, charset?: string): number {
  let total = 0,
    charCode,
    i,
    len;
  charset = charset ? charset.toLowerCase() : '';
  if (charset === 'utf-16' || charset === 'utf16') {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode <= 0xffff) {
        total += 2;
      } else {
        total += 4;
      }
    }
  } else {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode <= 0x007f) {
        total += 1;
      } else if (charCode <= 0x07ff) {
        total += 2;
      } else if (charCode <= 0xffff) {
        total += 3;
      } else {
        total += 4;
      }
    }
  }
  return total;
}

export function genId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * 预处理客户端返回串
 */
export function parse(params: unknown): unknown {
  if (isObjectLike(params)) {
    return params;
  }
  if (typeof params !== 'string') {
    return params;
  }
  let obj;
  try {
    obj = JSON.parse(params);
  } catch (e) {
    obj = params;
  }
  return obj;
}

export function isNative(Ctor: unknown): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}
