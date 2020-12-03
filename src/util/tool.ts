export function isNumber(value) {
  return Object.prototype.toString.call(value) == '[object Number]';
}
export function isString(value) {
  return Object.prototype.toString.call(value) == '[object String]';
}
export function isArray(value) {
  return Object.prototype.toString.call(value) == '[object Array]';
}
export function isBoolean(value) {
  return Object.prototype.toString.call(value) == '[object Boolean]';
}
export function isUndefined(value) {
  return value === undefined;
}
export function isNull(value) {
  return value === null;
}
export function isSymbol(value) {
  return Object.prototype.toString.call(value) == '[object Symbol]';
}
export function isMap(value) {
  return Object.prototype.toString.call(value) == '[object Map]';
}
export function isWeakMap(value) {
  return Object.prototype.toString.call(value) == '[object WeakMap]';
}
export function isSet(value) {
  return Object.prototype.toString.call(value) == '[object Set]';
}
export function isWeakSet(value) {
  return Object.prototype.toString.call(value) == '[object WeakSet]';
}
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
export function isFunction(value) {
  return Object.prototype.toString.call(value) == '[object Function]';
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
 * 纯对象，字面量和Object.create
 * @param obj
 */
export default function isPlainObject(obj: any) {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  if (Object.getPrototypeOf(obj) === null) {
    return true;
  }
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
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
export function getObjAllKeys(obj) {
  // if (!isObject(obj) && !isArray(obj)) {
  //   return [];
  // }
  // if (isArray(obj)) {
  //   const m = [];
  //   obj.forEach((_, index) => {
  //     m.push(index);
  //   });
  //   return m;
  // }
  return Object.getOwnPropertyNames(obj).sort();
}

/**
 * get an object's prototype name
 */
export function getObjName(obj) {
  return Object.prototype.toString
    .call(obj)
    .replace('[object ', '')
    .replace(']', '');
}

export function htmlEncode(text) {
  return (document.createElement('a').appendChild(document.createTextNode(text))
    .parentNode as any).innerHTML;
}
