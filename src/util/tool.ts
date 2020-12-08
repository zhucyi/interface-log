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
} from 'lodash';
export function isObject(value) {
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
export function isWindow(value) {
  var toString = Object.prototype.toString.call(value);
  return (
    toString == '[object global]' ||
    toString == '[object Window]' ||
    toString == '[object DOMWindow]'
  );
}

/**
 * Simple JSON stringify, stringify top level key-value
 */
export function JSONStringify(stringObject) {
  if (!isObject(stringObject) && !isArray(stringObject)) {
    return JSON.stringify(stringObject);
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
export function getObjAllKeys(obj): string[] {
  return Object.getOwnPropertyNames(obj).sort();
}

/**
 * get an object's prototype name
 */
export function getObjName(obj): string {
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
