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
    return obj => isMatch(this.property(path)(obj), val)
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
  flatten: function (array,count = 0,result = []) {
    var result = []
    for (var i = 0; i < array.length; i++) {
      if (typeof array[i] === "object") {
        var innerAry = array[i]
        for(var j = 0;j < innerAry.length;j++) {
          result.push(innerAry[j])
        }
      }
      result.push(array[i])
    }
    return result

  },
  flattenDeep:function(array) {
    return array.map(item => {
      if(typeof item === "object") {
        return this.flattenDeep(item)
      }else {
        return item
      }
    })
  },
  fromPairs:function(pairs) {
    let map = new Map()
    for(var key of pairs) {
      map[key[0]] = key[1]
    }
    return map
  },
  head:function(array) {
    return array.shift()
  },
  indexOf:function(array, value, fromIndex=0) {
    if(Math.abs(fromIndex) > array.length - 1) {
      return undefined
    }else if(Math.abs(fromIndex) == fromIndex) {
      for(var i = fromIndex;i < array.length;i++) {
        if(array[i] == value) {
          return i
        }
      }
    }else {
      for(var i = array.length + fromIndex;i >= 0;i--) {
        if(array[i] == value) {
          return i
        }
      }
    }
  },
  initial:function(array) {
    array.pop()
    return array
  },
  intersection:function(arrays) {
    return arrays[0].filter(item => {
      arrays.slice(1).every(arr => arr.includes(item))
    })
  },
  intersectionBy:function(arrays, ...args) {
    let func;
    let lastArgs = args[args.length - 1];
    if (typeof lastArgs === "string" || typeof lastArgs === "function") {
      func = this.iteratee(args.pop());
    } else {
      func = it => it;
    }
    return array.filter(item =>
      args.every(arr => arr.map(func).includes(func(item)))
    );
  },
  intersectionWith: function(...args) {
    let func = args.pop();
    return args[0].filter(item =>
      args.slice(1).every(arr => arr.some(arrVal => func(item, arrVal)))
    );
  },
  join:function(array, separator=',') {
    return array.reduce((res,item,idx) => {
      if(idx !== array.length) {
        return res + separator + item
      }
    })
  },
  last:function(array) {
   return array.pop()
  },
  













}