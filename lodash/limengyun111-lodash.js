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
    return obj => obj.isMatch(this.property(path)(obj), val)
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
  difference: function (array, [values]) {
    var result = []
    var count = 0
    for (var oval of array) {
      for (var ival of values) {
        if (!this.SameValueZero(oval, ival)) {
          count++
        }
      }
      if (count == values.length) {
        result.push(oval)
      }
      count = 0
    }
    return result
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
    return arrry
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

  }













}