var limengyun111 = {
  iteratee: function (func) {
    if (typeof func === "string") {
      return this.property(func)
    } else if (typeof func === "function") {
      return func
    } else if (Array.isArray(func)) {
      return this.matchesProperty(func[0], func[1])
    } else {
      return this.matches(func)
    }

  },
  toPath: function (path) {
    path = String(path)
    return path.split(".")
  },
  property: function (path) {
    if (typeof path == "string") {
      path = this.toPath(path)
    }
    return obj => path.reduce((res, item) => res[item], obj)
  },
  matchesProperty: function (path, val) {
    return obj => this.isMatch(this.property(path)(obj), val)
  },

  isEqual: function (value, other) {
    if (value === other) {
      return true
    }
    if (
      value === null ||
      other === null ||
      typeof value !== "object" ||
      typeof other !== "object"
    ) {
      return false
    }
    let keysVal = Object.keys(value)
    let keysOth = Object.keys(other)
    if (keysVal.length !== keysOth.length) {
      return false
    }
    for (var key of keysVal) {
      if (!limengyun111.isEqual(value[key], other[key] ||
        !keysOth.includes(key))) {
        return false
      }
    }
    return true
  },

  isMatch: function (object, source) {
    if (typeof object !== "object" || typeof source !== "object") {
      return object === source
    }

    for (let key in source) {
      if (!key in object || !this.isMatch(object[key], source[key])) {
        return false
      }
    }
    return true
  },

  matches: function (source) {
    return obj => this.isMatch(obj, source)
  },

  chunk: function (ary, n = 1) {
    var result = []
    while (ary.length >= n) {
      var cut = ary.splice(n)
      result.push(ary)
      ary = cut
    }
    if (ary.length === 0) {
      return result
    }
    result.push(ary)
    return result
  },

  compact: function (array) {
    return array.filter(it => {
      if (it !== 0 && it !== undefined && it !== false && it !== NaN && it !== null) {
        return it
      }
    })
  },
  difference: function (array, ...args) {

    return array.filter(it => !args.flat().includes(it))
  },
  SameValueZero: function (x, y) {
    if (Object.prototype.toString.call(x) !== Object.prototype.toString.call(y)) {
      return false
    } else if (typeof x == "number") {
      if (x == NaN && y == NaN) {
        return true
      } else if (x == "+0" && y == "-0") {
        return false
      } else if (y == "+0" && x == "-0") {
        return false
      } else if (typeof y == "number" && x === y) {
        return true
      } else {
        return false
      }
    }
  },
  differenceBy: function (array, ...args) {
    let func
    lastArg = args[args.length - 1]
    if (typeof lastArg == "function" || typeof lastArg == "string") {
      func = this.iteratee(args.pop());
    } else {
      func = it => it
    }
    let values = args.flat().map(func)
    return array.filter(item => !values.includes(func(item)))
  },
  differenceWith: function (array, ...args) {
    let func
    lastArg = args[args.length - 1]
    if (typeof lastArg == "function" || typeof lastArg == "string") {
      func = this.iteratee(args.pop());
    } else {
      func = it => it
    }
    let values = args.flat()
    return array.filter(item => values.every(it => !func(item, it)))
  },
  drop: function (array, n = 1) {
    return array.splice(n)
  },
  dropRight: function (array, n = 1) {
    array.splice(-n, n)
    return array
  },
  dropRightWhile: function (array, predicate) {
    var func = this.iteratee(predicate)
    var res = array.slice()
    for (var i = res.length - 1; i > 0; i--) {
      if (func(array[i])) {
        res.pop()
      } else {
        break
      }
    }
    return res

  },
  dropWhile: function (array, predicate) {
    var func = this.iteratee(predicate)
    var res = array.slice()
    for (var i = 0; i < array.length; i++) {
      if (func(array[i])) {
        res.shift()
      } else {
        break
      }
    }
    return res
  },
  fill: function (array, value, start = 0, end = array.length) {
    for (let i = start; i < end; i++) {
      array[i] = value
    }
    return array
  },
  findIndex: function (array, predicate, fromIndex = 0) {
    var func = this.iteratee(predicate)
    for (let i = fromIndex; i < array.length; i++) {
      if (func(array[i])) {
        return i
      }
    }
  },
  findLastIndex: function (array, predicate, fromIndex = array.length - 1) {
    var func = this.iteratee(predicate)
    for (let i = fromIndex; i >= 0; i--) {
      if (func(array[i])) {
        return i
      }
    }
  },
  flatten: function (array) {
    var result = []
    for (var i = 0; i < array.length; i++) {
      if (typeof array[i] === "object") {
        var innerAry = array[i]
        for (var j = 0; j < innerAry.length; j++) {
          result.push(innerAry[j])
        }
      } else {
        result.push(array[i])
      }

    }
    return result
  },
  flattenDeep: function (array) {
    let result = []
    if (typeof array == "object") {
      for (var i = 0; i < array.length; i++) {
        return this.flattenDeep(array[i])
      }
    } else {
      result.push(array)
    }


    return result
  },
  flattenDepth: function (array, depth = 1) {
    for (let i = 0; i < depth; i++) {
      array = array.flat();
    }
    return array;
  },
  fromPairs: function (pairs) {
    let map = new Map()
    for (var key of pairs) {
      map[key[0]] = key[1]
    }
    return map
  },
  head: function (array) {
    return array.shift()
  },
  indexOf: function (array, value, fromIndex = 0) {
    fromIndex += fromIndex < 0 ? array.length : 0
    for (var i = fromIndex; i < array.length; i++) {
      if (this.SameValueZero(array[i], value)) {
        return i
      }
    }
    return -1
  },
  initial: function (array) {
    array.pop()
    return array
  },
  intersection: function (...arrays) {
    return arrays[0].filter(item => {
      return arrays.slice(1).every(arr => arr.includes(item))
    })
  },
  intersectionBy: function (arrays, ...args) {
    let func;
    let lastArgs = args[args.length - 1];
    if (typeof lastArgs === "string" || typeof lastArgs === "function") {
      func = this.iteratee(args.pop());
    } else {
      func = it => it;
    }
    return arrays.filter(item =>
      args.every(arr => arr.map(func).includes(func(item)))
    );
  },
  intersectionWith: function (...args) {
    let func = args.pop();
    return args[0].filter(item =>
      args.slice(1).every(arr => arr.some(arrVal => func(item, arrVal)))
    );
  },
  join: function (array, separator = ',') {
    return array.reduce((res, item, idx) => {
      if (idx !== array.length) {
        return res + String(separator) + item
      }
    })
  },
  last: function (array) {
    return array.pop()
  },
  lastIndexOf: function (array, value, fromIndex = array.length - 1) {
    for (var i = fromIndex; i >= 0; i--) {
      if (array[i] === value) {
        return fromIndex - i
      }
    }
    return -1
  },
  nth: function (array, n = 0) {
    return n >= 0 ? array[n] : array[array.length + n]
  },
  pull: function (array, ...args) {
    var val = [].concat(...args)
    return array.filter(item => !val.includes(item))
  },
  pullAll: function (array, values) {
    return array.filter(item => !values.includes(item))
  },
  pullAllBy: function (array, values, iteratee) {
    let func = this.iteratee(iteratee)
    return array.filter(item => !values.map(func).includes(func(item)))
  },
  pullAllWith: function (array, values, comparator) {
    let func = this.iteratee(comparator)
    array.filter(item => {
      !values.some(it => func(item, it))
    })
  },
  reverse: function (array) {
    let result
    for (var i = array.length - 1; i >= 0; i--) {
      result.push(array[i])
    }
  },
  sortedIndex(array, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] < value && array[i + 1] >= value) {
        return i + 1;
      }
    }
  },
  sortedIndexBy: function (array, value, func) {
    func = this.iteratee(func);
    for (let i = 0; i < array.length; i++) {
      if (func(array[i]) <= func(value) && func(array[i + 1]) > func(value)) {
        return i;
      }
    }
  },
  sortedIndexOf: function (array, value) {
    return array.sort((a, b) => a - b).indexOf(value);
  },
  sortedLastIndex(array, value) {
    for (var i = array.length - 1; i >= 0; i--) {
      if (array[i] >= value && array[i - 1] <= value) {
        return i
      }
    }
  },
  sortedLastIndexBy: function (array, value, func = identity) {
    func = this.iteratee(func);
    for (let i = 0; i < array.length; i++) {
      if (func(array[i]) <= func(value) && func(array[i + 1]) > func(value)) {
        return i + 1;
      }
    }
  },
  sortedLastIndexOf: function (array, value) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i] > value && array[i - 1] <= value) {
        return i - 1;
      }
    }
  },
  sortedUniq: function (array) {
    return Array.from(new Set(array))
  },
  sortedUniqBy: function (array, iteratee) {
    let fun = this.iteratee(iteratee)
    let res = []
    if (fun(array[i]) !== fun(res[res.length - 1])) {
      res.push(array[i])
    }
  },
  tail: function (array) {
    return array.slice(1)
  },
  take: function (array, n = 1) {
    return array.slice(0, n)
  },
  takeRight: function (array, n = 1) {
    return array.slice(array.length - n)
  },
  takeRightWhile: function (arr, predicate) {
    func = this.iteratee(predicate);
    for (let i = arr.length - 1; i >= 0; i--) {
      if (!func(arr[i], i, arr)) {
        return arr.slice(i + 1);
      }
    }
    return arr.slice();
  },
  takeWhile: function (array, func = identity) {
    func = this.iteratee(func);
    for (let i = 0; i < array.length; i++) {
      if (!func(array[i], i, array)) {
        return array.slice(0, i);
      }
    }
    return array.slice();
  },
  union: function (...arrays) {
    return [...new Set(arrays.flat())]
  },
  unionBy: function (...args) {
    let lastArgs = args[args.length - 1];
    if (typeof lastArgs === "function" || typeof lastArgs === "string") {
      func = this.iteratee(args.pop());
    } else {
      func = it => it;
    }
    let argsOrigin = args.flat();
    let argsTransformed = argsOrigin.map(func);
    return argsOrigin.filter(
      (_, index) => argsTransformed.indexOf(argsTransformed[index]) === index
    );
  },
  unionWith: function (...args) {
    func = this.iteratee(args.pop());
    return args
      .flat()
      .reduce(
        (res, item) => (res.some(it => func(item, it)) ? res : [...res, item]),
        []
      );
  },
  unzip: function (array) {
    return array[0].map((it, idx) => array.map(item => item[idx]))

  },
  unzipWith: function (array, func) {
    return array[0].map((_, i) => func(...array.map(arr => arr[i])));
  },
  without: function (array, ...values) {
    var res = []
    for (var i = 0; i < values.length; i++) {
      for (var j = 0; j < array.length; j++) {
        if (values[i] == array[j]) {
          res.push(j)
        }
      }
    }
    return array.filter((it, idx) => !res.includes(idx))
  },
  xor: function (...arrays) {
    var newAry = arrays.flat()
    return newAry.filter((item) => newAry.lastIndexOf(item) === newAry.indexOf(item))
  },
  xorBy: function (...args) {
    let lastArgs = args[args.length - 1];
    if (typeof lastArgs === "function" || typeof lastArgs === "string") {
      func = this.iteratee(args.pop());
    } else {
      func = it => it;
    }
    let OriginArgs = args.flat();
    let transArgs = OriginArgs.map(func);
    return OriginArgs.filter(
      (_, index) =>
        transArgs.indexOf(transArgs[index]) ===
        transArgs.lastIndexOf(transArgs[index])
    );
  },
  xorWith: function (...args) {
    func = this.iteratee(args.pop());
    let originArgs = args.flat();
    return originArgs.filter((item, index) =>
      [...originArgs.slice(0, index), ...originArgs.slice(index + 1)].every(
        it => !func(item, it)
      )
    );
  },
  zip: function (...arrays) {
    return Array(Math.max(...args.map(it => it.length)))
      .fill(0).map((it, idx) => arrays.map(it => it[idx]))
  },
  zipObject: function (props = [], values = []) {
    var map = {}
    for (var i = 0; i < props.length; i++) {
      map[props[i]] = values[i]
    }
    return map
  },
  countBy: function (collection, iteratee) {
    let fun = this.iteratee(iteratee)
    let map = new Map()
    var newAry = collection.map(it => fun(it)).sort((a, b) => a - b)
    newAry.forEach(it => (it in map ? map[it]++ : map[it] = 1))
    return map
  },
  every: function (collection, predicate) {
    func = this.iteratee(predicate);
    if (Array.isArray(collection)) {
      for (let index = 0; index < collection.length; index++) {
        if (!func(collection[index], index, collection)) {
          return false;
        }
      }
      return true;
    } else {
      for (let key in collection) {
        if (!func(collection[key], key, collection)) {
          return false;
        }
      }
      return true;
    }
  },
  filter: function (collection, predicate) {
    func = this.iteratee(predicate);
    var passed = [];
    if (Array.isArray(collection)) {
      for (var index = 0; index < collection.length; index++) {
        if (func(collection[index], index, collection)) {
          passed.push(collection[index]);
        }
      }
    } else {
      for (let key in collection) {
        if (func(collection[key], key, collection)) {
          passed.push(collection[key]);
        }
      }
    }
    return passed;
  },
  find: function (collection, predicate, fromIndex = 0) {
    let func = this.iteratee(predicate)
    collection.filter(func)[0]
  },
  findLast: function (
    collection,
    func = this.identity,
    fromIndex = collection.length - 1
  ) {
    func = this.identity(func);
    for (let i = fromIndex; i > 0; i--) {
      if (func(collection[i])) return collection[i];
    }
    return undefined;
  },
  flatMap(collection, iteratee) {
    let func = this.iteratee(iteratee)
    return collection.map(item => func(item)).flat();
  },
  flatMapDeep: function (collection, func = identity) {
    func = this.identity(func);
    return this.flattenDeep(collection.map(func));
  },
  flatMapDepth: function (collection, func = identity, depth = 1) {
    func = this.identity(func);
    return this.flattenDepth(collection.map(func), depth);
  },
  forEach: function (collection, iteratee) {
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        iteratee(collection[it], i, iteratee)
      }
    } else {
      for (let key in collection) {
        action(collection[key], key, collection);
      }
    }
    return collection;
  },
  forEachRight: function (collection, action) {
    if (Array.isArray(collection)) {
      for (let i = collection.length - 1; i >= 0; i--) {
        action(collection[i], i, collection);
      }
    } else {
      let objTransformed = Object.entries(collection);
      for (let i = collection.length - 1; i >= 0; i--) {
        action(objTransformed[i][1], objTransformed[i][0], collection);
      }
    }
    return collection;
  },
  groupBy: function (collection, iteratee) {
    let fun = this.iteratee(iteratee)
    collection.sort((a, b) => a - b)
    const newAry = collection.map(it => fun(it)).sort((a, b) => a - b)
    const map = {}
    newAry.forEach((it, idx) =>
      it in map ?
        map[it].push(collection[idx])
        : (map[it] = [collection[idx]]))
    return map
  },
  includes: function (collection, value, fromIndex = 0) {
    if (collection instanceof Object) {
      for (key in collection) {
        if (collection[key] == value) {
          return true
        }
      }
    } else {
      newary = fromIndex >= 0 ? collection.splice(fromIndex)
        : collection.splice(0, collection.length + fromIndex)
      if (newary.indexOf(value) > 0) {
        return true
      }
      return false
    }
  },
  isObject: function (value) {
    return value instanceof Object

  },
  invokeMap: function (collection, path, args) {
    if (typeof path === "string") {
      return collection.map(item => item[path](...args));
    } else if (typeof path === "function") {
      return collection.map(item => path.call(item, ...args));
    } else {
      return collection.map(item =>
        this.iteratee(path)(it).call(item, ...args)
      );
    }
  },
  map: function (collection, func = it => it) {
    func = this.iteratee(func);
    var transformed = [];
    if (Array.isArray(collection)) {
      for (var index = 0; index < collection.length; index++) {
        transformed.push(func(collection[index], index, collection));
      }
    } else {
      for (let key in collection) {
        transformed.push(func(collection[key], key, collection));
      }
    }
    return transformed;
  },
  orderBy: function (collection, funcs = this.identity, orders) {
    funcs = funcs.map(it => this.iteratee(it));
    const compare = (a, b, func, order = "asc") => {
      const flag = order === "asc" ? 1 : -1;
      if (func(a) < func(b)) return -1 * flag;
      if (func(a) > func(b)) return 1 * flag;
      return 0;
    };
    if (Array.isArray(collection)) {
      return collection.sort((a, b) => {
        for (let i = 0; i < funcs.length; i++) {
          const res = compare(a, b, funcs[i], orders[i]);
          if (res !== 0) return res;
        }
        return 0;
      });
    }
  },
  partition: function (collection, predicate) {
    let fun = this.iteratee(predicate)
    return collection.reduce((res, item) => {
      res[fun(item) ? 0 : 1].push(item)
      return res
    },
      [[], []]
    )
  },
  reduce: function (collection, iteratee, accumulator) {
    let fun = this.iteratee(iteratee)
    let current = accumulator
    let j
    if (Array.isArray(collection)) {
      if (accumulator !== undefined) {
        j = 0

      } else {
        j = 1
        current = collection[0]
      }
      for (var index = j; index < collection.length; index++) {

        current = fun(current, collection[index], index, collection)
      }
      return res
    } else {
      for (const key in collection) {
        current = fun(current, collection[key], key, collection)
      }
    }
  },
  reduceRight: function(collection, func = identity, accumulator) {
    func = this.iteratee(func);
    let current = accumulator;
    if (Array.isArray(collection)) {
      for (let index = collection.length - 1; index >= 0; index--) {
        current = func(current, collection[index], index, collection);
      }
    }
    return current;
  },
  reject:function(collection, predicate) {
    func = this.iteratee(predicate)
    return collection.filter(it => !func(it))
  },
  sample:function(collection) {
    return collection[Math.floor(Math.random()*collection.length)]
  },
  sampleSize:function(collection, n=1) {
   return  collection.sort(()=>Math.random()-0.5).slice(0,n)
  },
  shuffle:function(collection) {
   return collection.sort(()=>Math.random()-0.5)
  },
  some:function(collection, predicate) {
    func = this.iteratee(predicate);
    if (Array.isArray(collection)) {
      for (let index = 0; index < collection.length; index++) {
        if (func(collection[index], index, collection)) {
          return true;
        }
      }
      return false;
    } else {
      for (let key in collection) {
        if (func(collection[key], key, collection)) {
          return true;
        }
      }
      return false;
    }
  },
  sortBy:function(collection, iteratees) {
    
  },
  defer:function(func, args) {
    return setTimeout(()=>func(args),0)
  },
  delay(func, wait, ...args) {
   return setTimeout(()=>func(...args),wait)
  },
  castArray:function(value) {
      if(arguments.length == 0){
        return []
      }
      if(Array.isArray(value)) {
        return value
      }else{
        var result = []
        result.push(value)
        return result
      }
    
  },
  conformsTo:function(object, source) {
    return Object.values(source).every((fun,index)=>{
      fun(object[Object.keys(source)[index]])
    })
  },
  eq:function(value, other) {
    if(value === other) {
      return true
    }else if(Number.isNaN(value) && Number.isNaN(other)) {
        return true
      }else {
        return false
      }
    
  },
  gt:function(value, other) {
   return  Number(value) >  Number(other) ? true :false
  },
  gte:function(value, other) {
    return  Number(value) >=  Number(other) ? true :false
  },
  isArguments:function(value){
   return Object.prototype.toString.call(value) == "[object Arguments]" 
  },
  isArray:function(value){
   return Array.isArray(value)
  },
  isArrayBuffer: function(value) {
    return Object.prototype.toString.call(value) === "[object ArrayBuffer]"
  },
  isArrayLike:function(value){
    if (this.isArray(value)) return true;
    if (this.isString(value)) return true;
    if (typeof value !== "function") return true;
    if (
      value !== undefined &&
      value !== null &&
      value.length >= 0 &&
      value.length <= Number.MAX_SAFE_INTEGER
    )
      return true;
  },
  isArrayLikeObject:function(value){
    return this.isArrayLike(value) && this.isObject(value)
  },
  isBoolean: function(value) {
    return Object.prototype.toString.call(value) === "[object Boolean]";
  },

  isDate: function(value) {
    return Object.prototype.toString.call(value) === "[object Date]";
  },

  isElement: function(value) {
    return Object.prototype.toString.call(value) === "[object Element]";
  },
  isEmpty: function(value) {
    let count = 0;
    for (key in value) {
      count++;
    }
    return count == 0;
  },
  isEqual: function(value, other) {
    if (value === other) return true;
    if (
      value === null ||
      other === null ||
      typeof value !== "object" ||
      typeof other !== "object"
    )
      return false;
    let keysVal = Object.keys(value),
      keysOth = Object.keys(other);
    if (keysVal.length !== keysOth.length) return false;
    for (let key of keysVal) {
      if (
        !keysOth.includes(key) ||
        !this.isEqual(value[key], other[key])
      )
        return false;
    }
    return true;
  },

  isEqualWith: function(value, other, customizer) {
    if (customizer(value, other) || value === other) return true;
    if (
      value === null ||
      other === null ||
      typeof value !== "object" ||
      typeof value !== "object"
    )
      return false;
    let keysVal = Object.keys(value),
      keysOth = Object.keys(other);
    if (keysVal.length !== keysOth.length) return false;
    for (let key of keysVal) {
      if (!keysOth.includes(key)) return false;
      if (
        !customizer(value[key], other[key], key, value, other) &&
        !this.isEqualWith(value[key], other[key], customizer)
      )
        return false;
    }
    return true;
  },
  isError:function(value){
   return value instanceof Error
  },
  isFinite:function(value){
   if(typeof value == "string"){
     return false
   }else{
     return Number(value) !== Infinity &&  Number(value) !== -Infinity
   }

  },
  isFunction: function(value) {
    return Object.prototype.toString.call(value) == "[object Function]";
  },
  isInteger:function(value) {
   if(typeof value == "string"){
     return false
   }else if(!isNaN(value) && value % 1 === 0){
     return true
   }
  },
  isLength: function(value) {
    if (typeof value === "string") return false;
    return value % 1 == 0 && value <= Number.MAX_SAFE_INTEGER;
  },
  isMap:function(value) {
    return Object.prototype.toString.call(value) == "[object Map]"
  },
  isNaN:function(value){
    return typeof value !== "number" && value !== undefined
  },
  isNative:function(value) {
    return typeof value == "function" && value.toString().includes("[native code]")
  },
  isMatchWith: function(object, source, customizer) {
    if (this.isMatch(object, source)) return true;
    if (this.isEqualWith(object, source, customizer)) return true;
  },
  isNil:function(value) {
   if(typeof value == "undefined" || value==null) {
     return true
   }else{
     return false
   }
  },
  isNull:function(value){
   return value == null
  },
  isNumber:function(value){
    return Object.prototype.toString.call(value) === "[object Number]"
  },
  isObjectLike:function(value) {
    return value !== null && typeof value =="object"
  },
  isPlainObject:function(value) {
    if(Object.getPrototypeOf(value) == Object.property || Object.getPrototypeOf(value) == null) {
      return true
    }
  },
  isRegExp:function(value) {
    return Object.prototype.toString.call(value) == "[object RegExp]"
  },
  isSafeInteger:function(value){
    if(typeof value == "number" && value <= Math.pow((2,52) - 1) &&  value >= Math.pow((2,52) - 1)) {
      return true
    }else{
      return false
    }
  },
  isSet: function(value) {
    return Object.prototype.toString.call(value) === "[object Set]";
  },

  isString: function(value) {
    return Object.prototype.toString.call(value) === "[object String]";
  },

  isSymbol: function(value) {
    return Object.prototype.toString.call(value) === "[object Symbol]";
  },
  isTypedArray:function(value){
    var reg = /^Uint8|Int8|Float/g
    var val = Object.prototype.toString.call(value).split(" ")[1]
    if(reg.test(val)){
      return true
    }else{
      return false
    }
  },
  isUndefined:function(value){
    return typeof value == "undefined"
  },
  isWeakMap: function(value) {
    return Object.prototype.toString.call(value) === "[object WeakMap]";
  },

  isWeakSet: function(value) {
    return Object.prototype.toString.call(value) === "[object WeakSet]";
  },
  lt:function(value, other) {
    return value < other
  },
  lte:function(value, other) {
    return value <= other
  },
  toArray:function(value) {
    if(typeof value == 'string'){
      return value.split("")
    }
    if(typeof value =="object"){
      return Object.values(value)
    }
  },
  toFinite:function(value){
    value = Number(value)
    if(value == Infinity) return Number.MAX_VALUE
    if(value == -Infinity) return Number.MIN_VALUE
    return value
  },
  toInteger:function(value) {
    value = Number(value);
    if (this.isNaN(value) || value === 0) return 0
    if (value === Infinity) return Number.MAX_VALUE
    if (value === -Infinity) return -Number.MAX_VALUE
    return Math.floor(Math.abs(value)) * (value>0 ? 1: -1)
  },
  toLength: function(value) {
    value = this.toInteger(value);
    if (value < 0) return 0;
    return value > 2 ** 32 - 1 ? 2 ** 32 - 1 : value;
  },

  toNumber: function(value) {
    return Number(value);
  },




























}