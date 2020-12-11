declare type Fn<T> = (...args: unknown[]) => T;
declare function _isFunction(x: unknown): x is Fn<unknown>;
declare function _isMap<K, V>(x: unknown): x is Map<K, V>;
declare function _isArray<T>(x: unknown): x is T[];
