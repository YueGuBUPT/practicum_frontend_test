! function() {
    ! function(root, factory) {
        var obj = factory();
        "function" != typeof define || !define.amd || null != define.amd.vendor && "dojotoolkit.org" === define.amd.vendor || define(obj), root.Appcues = obj
    }(this, function() {
        var requirejs, require, define;
        return function(undef) {
                function hasProp(obj, prop) {
                    return hasOwn.call(obj, prop)
                }

                function normalize(name, baseName) {
                    var nameParts, nameSegment, mapValue, foundMap, foundI, foundStarMap, starI, i, j, part, baseParts = baseName && baseName.split("/"),
                        map = config.map,
                        starMap = map && map["*"] || {};
                    if (name && "." === name.charAt(0))
                        if (baseName) {
                            for (baseParts = baseParts.slice(0, baseParts.length - 1), name = baseParts.concat(name.split("/")), i = 0; i < name.length; i += 1)
                                if (part = name[i], "." === part) name.splice(i, 1), i -= 1;
                                else if (".." === part) {
                                if (1 === i && (".." === name[2] || ".." === name[0])) break;
                                i > 0 && (name.splice(i - 1, 2), i -= 2)
                            }
                            name = name.join("/")
                        } else 0 === name.indexOf("./") && (name = name.substring(2));
                    if ((baseParts || starMap) && map) {
                        for (nameParts = name.split("/"), i = nameParts.length; i > 0; i -= 1) {
                            if (nameSegment = nameParts.slice(0, i).join("/"), baseParts)
                                for (j = baseParts.length; j > 0; j -= 1)
                                    if (mapValue = map[baseParts.slice(0, j).join("/")], mapValue && (mapValue = mapValue[nameSegment])) {
                                        foundMap = mapValue, foundI = i;
                                        break
                                    }
                            if (foundMap) break;
                            !foundStarMap && starMap && starMap[nameSegment] && (foundStarMap = starMap[nameSegment], starI = i)
                        }!foundMap && foundStarMap && (foundMap = foundStarMap, foundI = starI), foundMap && (nameParts.splice(0, foundI, foundMap), name = nameParts.join("/"))
                    }
                    return name
                }

                function makeRequire(relName, forceSync) {
                    return function() {
                        return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]))
                    }
                }

                function makeNormalize(relName) {
                    return function(name) {
                        return normalize(name, relName)
                    }
                }

                function makeLoad(depName) {
                    return function(value) {
                        defined[depName] = value
                    }
                }

                function callDep(name) {
                    if (hasProp(waiting, name)) {
                        var args = waiting[name];
                        delete waiting[name], defining[name] = !0, main.apply(undef, args)
                    }
                    if (!hasProp(defined, name) && !hasProp(defining, name)) throw new Error("No " + name);
                    return defined[name]
                }

                function splitPrefix(name) {
                    var prefix, index = name ? name.indexOf("!") : -1;
                    return index > -1 && (prefix = name.substring(0, index), name = name.substring(index + 1, name.length)), [prefix, name]
                }

                function makeConfig(name) {
                    return function() {
                        return config && config.config && config.config[name] || {}
                    }
                }
                var main, req, makeMap, handlers, defined = {},
                    waiting = {},
                    config = {},
                    defining = {},
                    hasOwn = Object.prototype.hasOwnProperty,
                    aps = [].slice;
                makeMap = function(name, relName) {
                    var plugin, parts = splitPrefix(name),
                        prefix = parts[0];
                    return name = parts[1], prefix && (prefix = normalize(prefix, relName), plugin = callDep(prefix)), prefix ? name = plugin && plugin.normalize ? plugin.normalize(name, makeNormalize(relName)) : normalize(name, relName) : (name = normalize(name, relName), parts = splitPrefix(name), prefix = parts[0], name = parts[1], prefix && (plugin = callDep(prefix))), {
                        f: prefix ? prefix + "!" + name : name,
                        n: name,
                        pr: prefix,
                        p: plugin
                    }
                }, handlers = {
                    require: function(name) {
                        return makeRequire(name)
                    },
                    exports: function(name) {
                        var e = defined[name];
                        return "undefined" != typeof e ? e : defined[name] = {}
                    },
                    module: function(name) {
                        return {
                            id: name,
                            uri: "",
                            exports: defined[name],
                            config: makeConfig(name)
                        }
                    }
                }, main = function(name, deps, callback, relName) {
                    var cjsModule, depName, ret, map, i, usingExports, args = [];
                    if (relName = relName || name, "function" == typeof callback) {
                        for (deps = !deps.length && callback.length ? ["require", "exports", "module"] : deps, i = 0; i < deps.length; i += 1)
                            if (map = makeMap(deps[i], relName), depName = map.f, "require" === depName) args[i] = handlers.require(name);
                            else if ("exports" === depName) args[i] = handlers.exports(name), usingExports = !0;
                        else if ("module" === depName) cjsModule = args[i] = handlers.module(name);
                        else if (hasProp(defined, depName) || hasProp(waiting, depName) || hasProp(defining, depName)) args[i] = callDep(depName);
                        else {
                            if (!map.p) throw new Error(name + " missing " + depName);
                            map.p.load(map.n, makeRequire(relName, !0), makeLoad(depName), {}), args[i] = defined[depName]
                        }
                        ret = callback.apply(defined[name], args), name && (cjsModule && cjsModule.exports !== undef && cjsModule.exports !== defined[name] ? defined[name] = cjsModule.exports : ret === undef && usingExports || (defined[name] = ret))
                    } else name && (defined[name] = callback)
                }, requirejs = require = req = function(deps, callback, relName, forceSync, alt) {
                    return "string" == typeof deps ? handlers[deps] ? handlers[deps](callback) : callDep(makeMap(deps, callback).f) : (deps.splice || (config = deps, callback.splice ? (deps = callback, callback = relName, relName = null) : deps = undef), callback = callback || function() {}, "function" == typeof relName && (relName = forceSync, forceSync = alt), forceSync ? main(undef, deps, callback, relName) : setTimeout(function() {
                        main(undef, deps, callback, relName)
                    }, 4), req)
                }, req.config = function(cfg) {
                    return config = cfg, config.deps && req(config.deps, config.callback), req
                }, requirejs._defined = defined, define = function(name, deps, callback) {
                    deps.splice || (callback = deps, deps = []), hasProp(defined, name) || hasProp(waiting, name) || (waiting[name] = [name, deps, callback])
                }, define.amd = {
                    jQuery: !0
                }
            }(), define("../../../almond", function() {}),
            function() {
                define("env", [], function() {
                    var env, isFile, isHttp, isModernXHR, xhr;
                    env = {
                        firebase: "https://appcues.firebaseio.com",
                        keenUrl: "https://vulpix.appcues.com",
                        keenProjectId: "53cd4a95ce5e43684c00000d",
                        keenWriteKey: "11f809081e4b3f0c2fb04d2c5ed3334dd8374fd3c621523bdb8503158595f52ce37a7cce91be086ad99cfb8ea9d71e14966ea7d264c24d6b16cbc9a80c5da5cdcbd921246fa1714ed1cfb078a4fa4ae27f5976c37a091f53181d9d336c5c04ec7b30b767a05cb72865a36cdfab1bf2e1",
                        segmentUrl: "https://api.segment.io/v1/pixel/track?data=",
                        segmentWriteKey: "JBJahvq064yXNL27f0HunKBRhDx4pkxP",
                        VERSION: "2.17.5",
                        sentryUrl: "https://31aabb624cbe410790e56a0a2dd1b660@app.getsentry.com/20245",
                        RELEASE_ID: "5f44f45badeb13e116cb57048b224fcb2f20240c",
                        APPCUES_CSS: "https://fast.appcues.com/appcues.css",
                        APPCUES_SANDBOX_CSS: "https://fast.appcues.com/appcues-sandboxed.css",
                        TOOLTIP_CSS: "https://fast.appcues.com/tooltip.css",
                        COACHMARK_CSS: "https://fast.appcues.com/coachmark.css",
                        TOOLTIP_FRAME_SRC: "https://my.appcues.com/tooltip",
                        BUS_FRAME_SRC: "https://my.appcues.com/frame",
                        BEACON_CURSOR: "//my.appcues.com/images/hotspot-cursor.png",
                        POWERED_BY_UTM_LINK: "http://appcues.com/?utm_medium=embed-script&utm_campaign=powered-by-appcues",
                        CDN_DOMAIN: "fast.appcues.com",
                        GA_TIMING_ACCOUNT_ID: "UA-42463600-4"
                    };
                    try {
                        isHttp = "http:" === window.location.protocol, isFile = "file:" === window.location.protocol, isModernXHR = null != window.XMLHttpRequest && (xhr = new XMLHttpRequest) && "withCredentials" in xhr, !isHttp && !isFile || isModernXHR || null != window.XDomainRequest && (env.firebase = "http://proxy.appcues.com")
                    } catch (_error) {}
                    return env
                })
            }.call(this),
            function() {
                var root = this,
                    previousUnderscore = root._,
                    breaker = {},
                    ArrayProto = Array.prototype,
                    ObjProto = Object.prototype,
                    FuncProto = Function.prototype,
                    push = ArrayProto.push,
                    slice = ArrayProto.slice,
                    concat = ArrayProto.concat,
                    toString = ObjProto.toString,
                    hasOwnProperty = ObjProto.hasOwnProperty,
                    nativeForEach = ArrayProto.forEach,
                    nativeMap = ArrayProto.map,
                    nativeReduce = ArrayProto.reduce,
                    nativeReduceRight = ArrayProto.reduceRight,
                    nativeFilter = ArrayProto.filter,
                    nativeEvery = ArrayProto.every,
                    nativeSome = ArrayProto.some,
                    nativeIndexOf = ArrayProto.indexOf,
                    nativeLastIndexOf = ArrayProto.lastIndexOf,
                    nativeIsArray = Array.isArray,
                    nativeKeys = Object.keys,
                    nativeBind = FuncProto.bind,
                    _ = function(obj) {
                        return obj instanceof _ ? obj : this instanceof _ ? void(this._wrapped = obj) : new _(obj)
                    };
                "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = _), exports._ = _) : root._ = _, _.VERSION = "1.6.0";
                var each = _.each = _.forEach = function(obj, iterator, context) {
                    if (null == obj) return obj;
                    if (nativeForEach && obj.forEach === nativeForEach) obj.forEach(iterator, context);
                    else if (obj.length === +obj.length) {
                        for (var i = 0, length = obj.length; i < length; i++)
                            if (iterator.call(context, obj[i], i, obj) === breaker) return
                    } else
                        for (var keys = _.keys(obj), i = 0, length = keys.length; i < length; i++)
                            if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return; return obj
                };
                _.map = _.collect = function(obj, iterator, context) {
                    var results = [];
                    return null == obj ? results : nativeMap && obj.map === nativeMap ? obj.map(iterator, context) : (each(obj, function(value, index, list) {
                        results.push(iterator.call(context, value, index, list))
                    }), results)
                };
                var reduceError = "Reduce of empty array with no initial value";
                _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
                    var initial = arguments.length > 2;
                    if (null == obj && (obj = []), nativeReduce && obj.reduce === nativeReduce) return context && (iterator = _.bind(iterator, context)), initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
                    if (each(obj, function(value, index, list) {
                            initial ? memo = iterator.call(context, memo, value, index, list) : (memo = value, initial = !0)
                        }), !initial) throw new TypeError(reduceError);
                    return memo
                }, _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
                    var initial = arguments.length > 2;
                    if (null == obj && (obj = []), nativeReduceRight && obj.reduceRight === nativeReduceRight) return context && (iterator = _.bind(iterator, context)), initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
                    var length = obj.length;
                    if (length !== +length) {
                        var keys = _.keys(obj);
                        length = keys.length
                    }
                    if (each(obj, function(value, index, list) {
                            index = keys ? keys[--length] : --length, initial ? memo = iterator.call(context, memo, obj[index], index, list) : (memo = obj[index], initial = !0)
                        }), !initial) throw new TypeError(reduceError);
                    return memo
                }, _.find = _.detect = function(obj, predicate, context) {
                    var result;
                    return any(obj, function(value, index, list) {
                        if (predicate.call(context, value, index, list)) return result = value, !0
                    }), result
                }, _.filter = _.select = function(obj, predicate, context) {
                    var results = [];
                    return null == obj ? results : nativeFilter && obj.filter === nativeFilter ? obj.filter(predicate, context) : (each(obj, function(value, index, list) {
                        predicate.call(context, value, index, list) && results.push(value)
                    }), results)
                }, _.reject = function(obj, predicate, context) {
                    return _.filter(obj, function(value, index, list) {
                        return !predicate.call(context, value, index, list)
                    }, context)
                }, _.every = _.all = function(obj, predicate, context) {
                    predicate || (predicate = _.identity);
                    var result = !0;
                    return null == obj ? result : nativeEvery && obj.every === nativeEvery ? obj.every(predicate, context) : (each(obj, function(value, index, list) {
                        if (!(result = result && predicate.call(context, value, index, list))) return breaker
                    }), !!result)
                };
                var any = _.some = _.any = function(obj, predicate, context) {
                    predicate || (predicate = _.identity);
                    var result = !1;
                    return null == obj ? result : nativeSome && obj.some === nativeSome ? obj.some(predicate, context) : (each(obj, function(value, index, list) {
                        if (result || (result = predicate.call(context, value, index, list))) return breaker
                    }), !!result)
                };
                _.contains = _.include = function(obj, target) {
                    return null != obj && (nativeIndexOf && obj.indexOf === nativeIndexOf ? obj.indexOf(target) != -1 : any(obj, function(value) {
                        return value === target
                    }))
                }, _.invoke = function(obj, method) {
                    var args = slice.call(arguments, 2),
                        isFunc = _.isFunction(method);
                    return _.map(obj, function(value) {
                        return (isFunc ? method : value[method]).apply(value, args)
                    })
                }, _.pluck = function(obj, key) {
                    return _.map(obj, _.property(key))
                }, _.where = function(obj, attrs) {
                    return _.filter(obj, _.matches(attrs))
                }, _.findWhere = function(obj, attrs) {
                    return _.find(obj, _.matches(attrs))
                }, _.max = function(obj, iterator, context) {
                    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) return Math.max.apply(Math, obj);
                    var result = -(1 / 0),
                        lastComputed = -(1 / 0);
                    return each(obj, function(value, index, list) {
                        var computed = iterator ? iterator.call(context, value, index, list) : value;
                        computed > lastComputed && (result = value, lastComputed = computed)
                    }), result
                }, _.min = function(obj, iterator, context) {
                    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) return Math.min.apply(Math, obj);
                    var result = 1 / 0,
                        lastComputed = 1 / 0;
                    return each(obj, function(value, index, list) {
                        var computed = iterator ? iterator.call(context, value, index, list) : value;
                        computed < lastComputed && (result = value, lastComputed = computed)
                    }), result
                }, _.shuffle = function(obj) {
                    var rand, index = 0,
                        shuffled = [];
                    return each(obj, function(value) {
                        rand = _.random(index++), shuffled[index - 1] = shuffled[rand], shuffled[rand] = value
                    }), shuffled
                }, _.sample = function(obj, n, guard) {
                    return null == n || guard ? (obj.length !== +obj.length && (obj = _.values(obj)), obj[_.random(obj.length - 1)]) : _.shuffle(obj).slice(0, Math.max(0, n))
                };
                var lookupIterator = function(value) {
                    return null == value ? _.identity : _.isFunction(value) ? value : _.property(value)
                };
                _.sortBy = function(obj, iterator, context) {
                    return iterator = lookupIterator(iterator), _.pluck(_.map(obj, function(value, index, list) {
                        return {
                            value: value,
                            index: index,
                            criteria: iterator.call(context, value, index, list)
                        }
                    }).sort(function(left, right) {
                        var a = left.criteria,
                            b = right.criteria;
                        if (a !== b) {
                            if (a > b || void 0 === a) return 1;
                            if (a < b || void 0 === b) return -1
                        }
                        return left.index - right.index
                    }), "value")
                };
                var group = function(behavior) {
                    return function(obj, iterator, context) {
                        var result = {};
                        return iterator = lookupIterator(iterator), each(obj, function(value, index) {
                            var key = iterator.call(context, value, index, obj);
                            behavior(result, key, value)
                        }), result
                    }
                };
                _.groupBy = group(function(result, key, value) {
                    _.has(result, key) ? result[key].push(value) : result[key] = [value]
                }), _.indexBy = group(function(result, key, value) {
                    result[key] = value
                }), _.countBy = group(function(result, key) {
                    _.has(result, key) ? result[key]++ : result[key] = 1
                }), _.sortedIndex = function(array, obj, iterator, context) {
                    iterator = lookupIterator(iterator);
                    for (var value = iterator.call(context, obj), low = 0, high = array.length; low < high;) {
                        var mid = low + high >>> 1;
                        iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid
                    }
                    return low
                }, _.toArray = function(obj) {
                    return obj ? _.isArray(obj) ? slice.call(obj) : obj.length === +obj.length ? _.map(obj, _.identity) : _.values(obj) : []
                }, _.size = function(obj) {
                    return null == obj ? 0 : obj.length === +obj.length ? obj.length : _.keys(obj).length
                }, _.first = _.head = _.take = function(array, n, guard) {
                    if (null != array) return null == n || guard ? array[0] : n < 0 ? [] : slice.call(array, 0, n)
                }, _.initial = function(array, n, guard) {
                    return slice.call(array, 0, array.length - (null == n || guard ? 1 : n))
                }, _.last = function(array, n, guard) {
                    if (null != array) return null == n || guard ? array[array.length - 1] : slice.call(array, Math.max(array.length - n, 0))
                }, _.rest = _.tail = _.drop = function(array, n, guard) {
                    return slice.call(array, null == n || guard ? 1 : n)
                }, _.compact = function(array) {
                    return _.filter(array, _.identity)
                };
                var flatten = function(input, shallow, output) {
                    return shallow && _.every(input, _.isArray) ? concat.apply(output, input) : (each(input, function(value) {
                        _.isArray(value) || _.isArguments(value) ? shallow ? push.apply(output, value) : flatten(value, shallow, output) : output.push(value)
                    }), output)
                };
                _.flatten = function(array, shallow) {
                    return flatten(array, shallow, [])
                }, _.without = function(array) {
                    return _.difference(array, slice.call(arguments, 1))
                }, _.partition = function(array, predicate) {
                    var pass = [],
                        fail = [];
                    return each(array, function(elem) {
                        (predicate(elem) ? pass : fail).push(elem)
                    }), [pass, fail]
                }, _.uniq = _.unique = function(array, isSorted, iterator, context) {
                    _.isFunction(isSorted) && (context = iterator, iterator = isSorted, isSorted = !1);
                    var initial = iterator ? _.map(array, iterator, context) : array,
                        results = [],
                        seen = [];
                    return each(initial, function(value, index) {
                        (isSorted ? index && seen[seen.length - 1] === value : _.contains(seen, value)) || (seen.push(value), results.push(array[index]))
                    }), results
                }, _.union = function() {
                    return _.uniq(_.flatten(arguments, !0))
                }, _.intersection = function(array) {
                    var rest = slice.call(arguments, 1);
                    return _.filter(_.uniq(array), function(item) {
                        return _.every(rest, function(other) {
                            return _.contains(other, item)
                        })
                    })
                }, _.difference = function(array) {
                    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
                    return _.filter(array, function(value) {
                        return !_.contains(rest, value)
                    })
                }, _.zip = function() {
                    for (var length = _.max(_.pluck(arguments, "length").concat(0)), results = new Array(length), i = 0; i < length; i++) results[i] = _.pluck(arguments, "" + i);
                    return results
                }, _.object = function(list, values) {
                    if (null == list) return {};
                    for (var result = {}, i = 0, length = list.length; i < length; i++) values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];
                    return result
                }, _.indexOf = function(array, item, isSorted) {
                    if (null == array) return -1;
                    var i = 0,
                        length = array.length;
                    if (isSorted) {
                        if ("number" != typeof isSorted) return i = _.sortedIndex(array, item), array[i] === item ? i : -1;
                        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted
                    }
                    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
                    for (; i < length; i++)
                        if (array[i] === item) return i;
                    return -1
                }, _.lastIndexOf = function(array, item, from) {
                    if (null == array) return -1;
                    var hasIndex = null != from;
                    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
                    for (var i = hasIndex ? from : array.length; i--;)
                        if (array[i] === item) return i;
                    return -1
                }, _.range = function(start, stop, step) {
                    arguments.length <= 1 && (stop = start || 0, start = 0), step = arguments[2] || 1;
                    for (var length = Math.max(Math.ceil((stop - start) / step), 0), idx = 0, range = new Array(length); idx < length;) range[idx++] = start, start += step;
                    return range
                };
                var ctor = function() {};
                _.bind = function(func, context) {
                    var args, bound;
                    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
                    if (!_.isFunction(func)) throw new TypeError;
                    return args = slice.call(arguments, 2), bound = function() {
                        if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
                        ctor.prototype = func.prototype;
                        var self = new ctor;
                        ctor.prototype = null;
                        var result = func.apply(self, args.concat(slice.call(arguments)));
                        return Object(result) === result ? result : self
                    }
                }, _.partial = function(func) {
                    var boundArgs = slice.call(arguments, 1);
                    return function() {
                        for (var position = 0, args = boundArgs.slice(), i = 0, length = args.length; i < length; i++) args[i] === _ && (args[i] = arguments[position++]);
                        for (; position < arguments.length;) args.push(arguments[position++]);
                        return func.apply(this, args)
                    }
                }, _.bindAll = function(obj) {
                    var funcs = slice.call(arguments, 1);
                    if (0 === funcs.length) throw new Error("bindAll must be passed function names");
                    return each(funcs, function(f) {
                        obj[f] = _.bind(obj[f], obj)
                    }), obj
                }, _.memoize = function(func, hasher) {
                    var memo = {};
                    return hasher || (hasher = _.identity),
                        function() {
                            var key = hasher.apply(this, arguments);
                            return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments)
                        }
                }, _.delay = function(func, wait) {
                    var args = slice.call(arguments, 2);
                    return setTimeout(function() {
                        return func.apply(null, args)
                    }, wait)
                }, _.defer = function(func) {
                    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)))
                }, _.throttle = function(func, wait, options) {
                    var context, args, result, timeout = null,
                        previous = 0;
                    options || (options = {});
                    var later = function() {
                        previous = options.leading === !1 ? 0 : _.now(), timeout = null, result = func.apply(context, args), context = args = null
                    };
                    return function() {
                        var now = _.now();
                        previous || options.leading !== !1 || (previous = now);
                        var remaining = wait - (now - previous);
                        return context = this, args = arguments, remaining <= 0 ? (clearTimeout(timeout), timeout = null, previous = now, result = func.apply(context, args), context = args = null) : timeout || options.trailing === !1 || (timeout = setTimeout(later, remaining)), result
                    }
                }, _.debounce = function(func, wait, immediate) {
                    var timeout, args, context, timestamp, result, later = function() {
                        var last = _.now() - timestamp;
                        last < wait ? timeout = setTimeout(later, wait - last) : (timeout = null, immediate || (result = func.apply(context, args), context = args = null))
                    };
                    return function() {
                        context = this, args = arguments, timestamp = _.now();
                        var callNow = immediate && !timeout;
                        return timeout || (timeout = setTimeout(later, wait)), callNow && (result = func.apply(context, args), context = args = null), result
                    }
                }, _.once = function(func) {
                    var memo, ran = !1;
                    return function() {
                        return ran ? memo : (ran = !0, memo = func.apply(this, arguments), func = null, memo)
                    }
                }, _.wrap = function(func, wrapper) {
                    return _.partial(wrapper, func)
                }, _.compose = function() {
                    var funcs = arguments;
                    return function() {
                        for (var args = arguments, i = funcs.length - 1; i >= 0; i--) args = [funcs[i].apply(this, args)];
                        return args[0]
                    }
                }, _.after = function(times, func) {
                    return function() {
                        if (--times < 1) return func.apply(this, arguments)
                    }
                }, _.keys = function(obj) {
                    if (!_.isObject(obj)) return [];
                    if (nativeKeys) return nativeKeys(obj);
                    var keys = [];
                    for (var key in obj) _.has(obj, key) && keys.push(key);
                    return keys
                }, _.values = function(obj) {
                    for (var keys = _.keys(obj), length = keys.length, values = new Array(length), i = 0; i < length; i++) values[i] = obj[keys[i]];
                    return values
                }, _.pairs = function(obj) {
                    for (var keys = _.keys(obj), length = keys.length, pairs = new Array(length), i = 0; i < length; i++) pairs[i] = [keys[i], obj[keys[i]]];
                    return pairs
                }, _.invert = function(obj) {
                    for (var result = {}, keys = _.keys(obj), i = 0, length = keys.length; i < length; i++) result[obj[keys[i]]] = keys[i];
                    return result
                }, _.functions = _.methods = function(obj) {
                    var names = [];
                    for (var key in obj) _.isFunction(obj[key]) && names.push(key);
                    return names.sort()
                }, _.extend = function(obj) {
                    return each(slice.call(arguments, 1), function(source) {
                        if (source)
                            for (var prop in source) obj[prop] = source[prop]
                    }), obj
                }, _.pick = function(obj) {
                    var copy = {},
                        keys = concat.apply(ArrayProto, slice.call(arguments, 1));
                    return each(keys, function(key) {
                        key in obj && (copy[key] = obj[key])
                    }), copy
                }, _.omit = function(obj) {
                    var copy = {},
                        keys = concat.apply(ArrayProto, slice.call(arguments, 1));
                    for (var key in obj) _.contains(keys, key) || (copy[key] = obj[key]);
                    return copy
                }, _.defaults = function(obj) {
                    return each(slice.call(arguments, 1), function(source) {
                        if (source)
                            for (var prop in source) void 0 === obj[prop] && (obj[prop] = source[prop])
                    }), obj
                }, _.clone = function(obj) {
                    return _.isObject(obj) ? _.isArray(obj) ? obj.slice() : _.extend({}, obj) : obj
                }, _.tap = function(obj, interceptor) {
                    return interceptor(obj), obj
                };
                var eq = function(a, b, aStack, bStack) {
                    if (a === b) return 0 !== a || 1 / a == 1 / b;
                    if (null == a || null == b) return a === b;
                    a instanceof _ && (a = a._wrapped), b instanceof _ && (b = b._wrapped);
                    var className = toString.call(a);
                    if (className != toString.call(b)) return !1;
                    switch (className) {
                        case "[object String]":
                            return a == String(b);
                        case "[object Number]":
                            return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
                        case "[object Date]":
                        case "[object Boolean]":
                            return +a == +b;
                        case "[object RegExp]":
                            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase
                    }
                    if ("object" != typeof a || "object" != typeof b) return !1;
                    for (var length = aStack.length; length--;)
                        if (aStack[length] == a) return bStack[length] == b;
                    var aCtor = a.constructor,
                        bCtor = b.constructor;
                    if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) return !1;
                    aStack.push(a), bStack.push(b);
                    var size = 0,
                        result = !0;
                    if ("[object Array]" == className) {
                        if (size = a.length, result = size == b.length)
                            for (; size-- && (result = eq(a[size], b[size], aStack, bStack)););
                    } else {
                        for (var key in a)
                            if (_.has(a, key) && (size++, !(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))) break;
                        if (result) {
                            for (key in b)
                                if (_.has(b, key) && !size--) break;
                            result = !size
                        }
                    }
                    return aStack.pop(), bStack.pop(), result
                };
                _.isEqual = function(a, b) {
                    return eq(a, b, [], [])
                }, _.isEmpty = function(obj) {
                    if (null == obj) return !0;
                    if (_.isArray(obj) || _.isString(obj)) return 0 === obj.length;
                    for (var key in obj)
                        if (_.has(obj, key)) return !1;
                    return !0
                }, _.isElement = function(obj) {
                    return !(!obj || 1 !== obj.nodeType)
                }, _.isArray = nativeIsArray || function(obj) {
                    return "[object Array]" == toString.call(obj)
                }, _.isObject = function(obj) {
                    return obj === Object(obj)
                }, each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(name) {
                    _["is" + name] = function(obj) {
                        return toString.call(obj) == "[object " + name + "]"
                    }
                }), _.isArguments(arguments) || (_.isArguments = function(obj) {
                    return !(!obj || !_.has(obj, "callee"))
                }), "function" != typeof /./ && (_.isFunction = function(obj) {
                    return "function" == typeof obj
                }), _.isFinite = function(obj) {
                    return isFinite(obj) && !isNaN(parseFloat(obj))
                }, _.isNaN = function(obj) {
                    return _.isNumber(obj) && obj != +obj
                }, _.isBoolean = function(obj) {
                    return obj === !0 || obj === !1 || "[object Boolean]" == toString.call(obj)
                }, _.isNull = function(obj) {
                    return null === obj
                }, _.isUndefined = function(obj) {
                    return void 0 === obj
                }, _.has = function(obj, key) {
                    return hasOwnProperty.call(obj, key)
                }, _.noConflict = function() {
                    return root._ = previousUnderscore, this
                }, _.identity = function(value) {
                    return value
                }, _.constant = function(value) {
                    return function() {
                        return value
                    }
                }, _.property = function(key) {
                    return function(obj) {
                        return obj[key]
                    }
                }, _.matches = function(attrs) {
                    return function(obj) {
                        if (obj === attrs) return !0;
                        for (var key in attrs)
                            if (attrs[key] !== obj[key]) return !1;
                        return !0
                    }
                }, _.times = function(n, iterator, context) {
                    for (var accum = Array(Math.max(0, n)), i = 0; i < n; i++) accum[i] = iterator.call(context, i);
                    return accum
                }, _.random = function(min, max) {
                    return null == max && (max = min, min = 0), min + Math.floor(Math.random() * (max - min + 1))
                }, _.now = Date.now || function() {
                    return (new Date).getTime()
                };
                var entityMap = {
                    escape: {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#x27;"
                    }
                };
                entityMap.unescape = _.invert(entityMap.escape);
                var entityRegexes = {
                    escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
                    unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
                };
                _.each(["escape", "unescape"], function(method) {
                    _[method] = function(string) {
                        return null == string ? "" : ("" + string).replace(entityRegexes[method], function(match) {
                            return entityMap[method][match]
                        })
                    }
                }), _.result = function(object, property) {
                    if (null != object) {
                        var value = object[property];
                        return _.isFunction(value) ? value.call(object) : value
                    }
                }, _.mixin = function(obj) {
                    each(_.functions(obj), function(name) {
                        var func = _[name] = obj[name];
                        _.prototype[name] = function() {
                            var args = [this._wrapped];
                            return push.apply(args, arguments), result.call(this, func.apply(_, args))
                        }
                    })
                };
                var idCounter = 0;
                _.uniqueId = function(prefix) {
                    var id = ++idCounter + "";
                    return prefix ? prefix + id : id
                }, _.templateSettings = {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /<%=([\s\S]+?)%>/g,
                    escape: /<%-([\s\S]+?)%>/g
                };
                var noMatch = /(.)^/,
                    escapes = {
                        "'": "'",
                        "\\": "\\",
                        "\r": "r",
                        "\n": "n",
                        "\t": "t",
                        "\u2028": "u2028",
                        "\u2029": "u2029"
                    },
                    escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
                _.template = function(text, data, settings) {
                    var render;
                    settings = _.defaults({}, settings, _.templateSettings);
                    var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join("|") + "|$", "g"),
                        index = 0,
                        source = "__p+='";
                    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                        return source += text.slice(index, offset).replace(escaper, function(match) {
                            return "\\" + escapes[match]
                        }), escape && (source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"), interpolate && (source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"), evaluate && (source += "';\n" + evaluate + "\n__p+='"), index = offset + match.length, match
                    }), source += "';\n", settings.variable || (source = "with(obj||{}){\n" + source + "}\n"), source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
                    try {
                        render = new Function(settings.variable || "obj", "_", source)
                    } catch (e) {
                        throw e.source = source, e
                    }
                    if (data) return render(data, _);
                    var template = function(data) {
                        return render.call(this, data, _)
                    };
                    return template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}", template
                }, _.chain = function(obj) {
                    return _(obj).chain()
                };
                var result = function(obj) {
                    return this._chain ? _(obj).chain() : obj
                };
                _.mixin(_), each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name) {
                    var method = ArrayProto[name];
                    _.prototype[name] = function() {
                        var obj = this._wrapped;
                        return method.apply(obj, arguments), "shift" != name && "splice" != name || 0 !== obj.length || delete obj[0], result.call(this, obj)
                    }
                }), each(["concat", "join", "slice"], function(name) {
                    var method = ArrayProto[name];
                    _.prototype[name] = function() {
                        return result.call(this, method.apply(this._wrapped, arguments))
                    }
                }), _.extend(_.prototype, {
                    chain: function() {
                        return this._chain = !0, this
                    },
                    value: function() {
                        return this._wrapped
                    }
                }), "function" == typeof define && define.amd && define("underscore", [], function() {
                    return _.noConflict()
                })
            }.call(this),
            function(global, factory) {
                "object" == typeof module && "object" == typeof module.exports ? module.exports = global.document ? factory(global, !0) : function(w) {
                    if (!w.document) throw new Error("jQuery requires a window with a document");
                    return factory(w)
                } : factory(global)
            }("undefined" != typeof window ? window : this, function(window, noGlobal) {
                function isArraylike(obj) {
                    var length = obj.length,
                        type = jQuery.type(obj);
                    return "function" !== type && !jQuery.isWindow(obj) && (!(1 !== obj.nodeType || !length) || ("array" === type || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj))
                }

                function winnow(elements, qualifier, not) {
                    if (jQuery.isFunction(qualifier)) return jQuery.grep(elements, function(elem, i) {
                        return !!qualifier.call(elem, i, elem) !== not
                    });
                    if (qualifier.nodeType) return jQuery.grep(elements, function(elem) {
                        return elem === qualifier !== not
                    });
                    if ("string" == typeof qualifier) {
                        if (risSimple.test(qualifier)) return jQuery.filter(qualifier, elements, not);
                        qualifier = jQuery.filter(qualifier, elements)
                    }
                    return jQuery.grep(elements, function(elem) {
                        return indexOf.call(qualifier, elem) >= 0 !== not
                    })
                }

                function sibling(cur, dir) {
                    for (;
                        (cur = cur[dir]) && 1 !== cur.nodeType;);
                    return cur
                }

                function createOptions(options) {
                    var object = optionsCache[options] = {};
                    return jQuery.each(options.match(rnotwhite) || [], function(_, flag) {
                        object[flag] = !0
                    }), object
                }

                function Data() {
                    Object.defineProperty(this.cache = {}, 0, {
                        get: function() {
                            return {}
                        }
                    }), this.expando = jQuery.expando + Math.random()
                }

                function dataAttr(elem, key, data) {
                    var name;
                    if (void 0 === data && 1 === elem.nodeType)
                        if (name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase(), data = elem.getAttribute(name), "string" == typeof data) {
                            try {
                                data = "true" === data || "false" !== data && ("null" === data ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data)
                            } catch (e) {}
                            data_user.set(elem, key, data)
                        } else data = void 0;
                    return data
                }

                function returnTrue() {
                    return !0
                }

                function returnFalse() {
                    return !1
                }

                function safeActiveElement() {
                    try {
                        return document.activeElement
                    } catch (err) {}
                }

                function manipulationTarget(elem, content) {
                    return jQuery.nodeName(elem, "table") && jQuery.nodeName(11 !== content.nodeType ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem
                }

                function disableScript(elem) {
                    return elem.type = (null !== elem.getAttribute("type")) + "/" + elem.type, elem
                }

                function restoreScript(elem) {
                    var match = rscriptTypeMasked.exec(elem.type);
                    return match ? elem.type = match[1] : elem.removeAttribute("type"), elem
                }

                function setGlobalEval(elems, refElements) {
                    for (var i = 0, l = elems.length; i < l; i++) data_priv.set(elems[i], "globalEval", !refElements || data_priv.get(refElements[i], "globalEval"))
                }

                function cloneCopyEvent(src, dest) {
                    var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
                    if (1 === dest.nodeType) {
                        if (data_priv.hasData(src) && (pdataOld = data_priv.access(src), pdataCur = data_priv.set(dest, pdataOld), events = pdataOld.events)) {
                            delete pdataCur.handle, pdataCur.events = {};
                            for (type in events)
                                for (i = 0, l = events[type].length; i < l; i++) jQuery.event.add(dest, type, events[type][i])
                        }
                        data_user.hasData(src) && (udataOld = data_user.access(src), udataCur = jQuery.extend({}, udataOld), data_user.set(dest, udataCur))
                    }
                }

                function getAll(context, tag) {
                    var ret = context.getElementsByTagName ? context.getElementsByTagName(tag || "*") : context.querySelectorAll ? context.querySelectorAll(tag || "*") : [];
                    return void 0 === tag || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], ret) : ret
                }

                function fixInput(src, dest) {
                    var nodeName = dest.nodeName.toLowerCase();
                    "input" === nodeName && rcheckableType.test(src.type) ? dest.checked = src.checked : "input" !== nodeName && "textarea" !== nodeName || (dest.defaultValue = src.defaultValue)
                }

                function actualDisplay(name, doc) {
                    var style, elem = jQuery(doc.createElement(name)).appendTo(doc.body),
                        display = window.getDefaultComputedStyle && (style = window.getDefaultComputedStyle(elem[0])) ? style.display : jQuery.css(elem[0], "display");
                    return elem.detach(), display
                }

                function defaultDisplay(nodeName) {
                    var doc = document,
                        display = elemdisplay[nodeName];
                    return display || (display = actualDisplay(nodeName, doc), "none" !== display && display || (iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement), doc = iframe[0].contentDocument, doc.write(), doc.close(), display = actualDisplay(nodeName, doc), iframe.detach()), elemdisplay[nodeName] = display), display
                }

                function curCSS(elem, name, computed) {
                    var width, minWidth, maxWidth, ret, style = elem.style;
                    return computed = computed || getStyles(elem), computed && (ret = computed.getPropertyValue(name) || computed[name]), computed && ("" !== ret || jQuery.contains(elem.ownerDocument, elem) || (ret = jQuery.style(elem, name)), rnumnonpx.test(ret) && rmargin.test(name) && (width = style.width, minWidth = style.minWidth, maxWidth = style.maxWidth, style.minWidth = style.maxWidth = style.width = ret, ret = computed.width, style.width = width, style.minWidth = minWidth, style.maxWidth = maxWidth)), void 0 !== ret ? ret + "" : ret
                }

                function addGetHookIf(conditionFn, hookFn) {
                    return {
                        get: function() {
                            return conditionFn() ? void delete this.get : (this.get = hookFn).apply(this, arguments)
                        }
                    }
                }

                function vendorPropName(style, name) {
                    if (name in style) return name;
                    for (var capName = name[0].toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length; i--;)
                        if (name = cssPrefixes[i] + capName, name in style) return name;
                    return origName
                }

                function setPositiveNumber(elem, value, subtract) {
                    var matches = rnumsplit.exec(value);
                    return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value
                }

                function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
                    for (var i = extra === (isBorderBox ? "border" : "content") ? 4 : "width" === name ? 1 : 0, val = 0; i < 4; i += 2) "margin" === extra && (val += jQuery.css(elem, extra + cssExpand[i], !0, styles)), isBorderBox ? ("content" === extra && (val -= jQuery.css(elem, "padding" + cssExpand[i], !0, styles)), "margin" !== extra && (val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles))) : (val += jQuery.css(elem, "padding" + cssExpand[i], !0, styles), "padding" !== extra && (val += jQuery.css(elem, "border" + cssExpand[i] + "Width", !0, styles)));
                    return val
                }

                function getWidthOrHeight(elem, name, extra) {
                    var valueIsBorderBox = !0,
                        val = "width" === name ? elem.offsetWidth : elem.offsetHeight,
                        styles = getStyles(elem),
                        isBorderBox = "border-box" === jQuery.css(elem, "boxSizing", !1, styles);
                    if (val <= 0 || null == val) {
                        if (val = curCSS(elem, name, styles), (val < 0 || null == val) && (val = elem.style[name]), rnumnonpx.test(val)) return val;
                        valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]), val = parseFloat(val) || 0
                    }
                    return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px"
                }

                function showHide(elements, show) {
                    for (var display, elem, hidden, values = [], index = 0, length = elements.length; index < length; index++) elem = elements[index], elem.style && (values[index] = data_priv.get(elem, "olddisplay"), display = elem.style.display, show ? (values[index] || "none" !== display || (elem.style.display = ""), "" === elem.style.display && isHidden(elem) && (values[index] = data_priv.access(elem, "olddisplay", defaultDisplay(elem.nodeName)))) : (hidden = isHidden(elem), "none" === display && hidden || data_priv.set(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"))));
                    for (index = 0; index < length; index++) elem = elements[index], elem.style && (show && "none" !== elem.style.display && "" !== elem.style.display || (elem.style.display = show ? values[index] || "" : "none"));
                    return elements
                }

                function buildParams(prefix, obj, traditional, add) {
                    var name;
                    if (jQuery.isArray(obj)) jQuery.each(obj, function(i, v) {
                        traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add)
                    });
                    else if (traditional || "object" !== jQuery.type(obj)) add(prefix, obj);
                    else
                        for (name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add)
                }

                function getWindow(elem) {
                    return jQuery.isWindow(elem) ? elem : 9 === elem.nodeType && elem.defaultView
                }
                var arr = [],
                    slice = arr.slice,
                    concat = arr.concat,
                    push = arr.push,
                    indexOf = arr.indexOf,
                    class2type = {},
                    toString = class2type.toString,
                    hasOwn = class2type.hasOwnProperty,
                    support = {},
                    document = window.document,
                    version = "2.1.1 -ajax,-ajax/jsonp,-ajax/load,-ajax/parseJSON,-ajax/parseXML,-ajax/script,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-deprecated,-effects,-effects/Tween,-effects/animatedSelector,-event/alias,-wrap,-core/ready,-deferred",
                    jQuery = function(selector, context) {
                        return new jQuery.fn.init(selector, context)
                    },
                    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
                    rmsPrefix = /^-ms-/,
                    rdashAlpha = /-([\da-z])/gi,
                    fcamelCase = function(all, letter) {
                        return letter.toUpperCase()
                    };
                jQuery.fn = jQuery.prototype = {
                    jquery: version,
                    constructor: jQuery,
                    selector: "",
                    length: 0,
                    toArray: function() {
                        return slice.call(this)
                    },
                    get: function(num) {
                        return null != num ? num < 0 ? this[num + this.length] : this[num] : slice.call(this)
                    },
                    pushStack: function(elems) {
                        var ret = jQuery.merge(this.constructor(), elems);
                        return ret.prevObject = this, ret.context = this.context, ret
                    },
                    each: function(callback, args) {
                        return jQuery.each(this, callback, args)
                    },
                    map: function(callback) {
                        return this.pushStack(jQuery.map(this, function(elem, i) {
                            return callback.call(elem, i, elem)
                        }))
                    },
                    slice: function() {
                        return this.pushStack(slice.apply(this, arguments))
                    },
                    first: function() {
                        return this.eq(0)
                    },
                    last: function() {
                        return this.eq(-1)
                    },
                    eq: function(i) {
                        var len = this.length,
                            j = +i + (i < 0 ? len : 0);
                        return this.pushStack(j >= 0 && j < len ? [this[j]] : [])
                    },
                    end: function() {
                        return this.prevObject || this.constructor(null)
                    },
                    push: push,
                    sort: arr.sort,
                    splice: arr.splice
                }, jQuery.extend = jQuery.fn.extend = function() {
                    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
                        i = 1,
                        length = arguments.length,
                        deep = !1;
                    for ("boolean" == typeof target && (deep = target, target = arguments[i] || {}, i++), "object" == typeof target || jQuery.isFunction(target) || (target = {}), i === length && (target = this, i--); i < length; i++)
                        if (null != (options = arguments[i]))
                            for (name in options) src = target[name], copy = options[name], target !== copy && (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy))) ? (copyIsArray ? (copyIsArray = !1, clone = src && jQuery.isArray(src) ? src : []) : clone = src && jQuery.isPlainObject(src) ? src : {}, target[name] = jQuery.extend(deep, clone, copy)) : void 0 !== copy && (target[name] = copy));
                    return target
                }, jQuery.extend({
                    expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
                    isReady: !0,
                    error: function(msg) {
                        throw new Error(msg)
                    },
                    noop: function() {},
                    isFunction: function(obj) {
                        return "function" === jQuery.type(obj)
                    },
                    isArray: Array.isArray,
                    isWindow: function(obj) {
                        return null != obj && obj === obj.window
                    },
                    isNumeric: function(obj) {
                        return !jQuery.isArray(obj) && obj - parseFloat(obj) >= 0
                    },
                    isPlainObject: function(obj) {
                        return "object" === jQuery.type(obj) && !obj.nodeType && !jQuery.isWindow(obj) && !(obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf"))
                    },
                    isEmptyObject: function(obj) {
                        var name;
                        for (name in obj) return !1;
                        return !0
                    },
                    type: function(obj) {
                        return null == obj ? obj + "" : "object" == typeof obj || "function" == typeof obj ? class2type[toString.call(obj)] || "object" : typeof obj
                    },
                    globalEval: function(code) {
                        var script, indirect = eval;
                        code = jQuery.trim(code), code && (1 === code.indexOf("use strict") ? (script = document.createElement("script"), script.text = code, document.head.appendChild(script).parentNode.removeChild(script)) : indirect(code))
                    },
                    camelCase: function(string) {
                        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase)
                    },
                    nodeName: function(elem, name) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase()
                    },
                    each: function(obj, callback, args) {
                        var value, i = 0,
                            length = obj.length,
                            isArray = isArraylike(obj);
                        if (args) {
                            if (isArray)
                                for (; i < length && (value = callback.apply(obj[i], args), value !== !1); i++);
                            else
                                for (i in obj)
                                    if (value = callback.apply(obj[i], args), value === !1) break
                        } else if (isArray)
                            for (; i < length && (value = callback.call(obj[i], i, obj[i]), value !== !1); i++);
                        else
                            for (i in obj)
                                if (value = callback.call(obj[i], i, obj[i]), value === !1) break; return obj
                    },
                    trim: function(text) {
                        return null == text ? "" : (text + "").replace(rtrim, "")
                    },
                    makeArray: function(arr, results) {
                        var ret = results || [];
                        return null != arr && (isArraylike(Object(arr)) ? jQuery.merge(ret, "string" == typeof arr ? [arr] : arr) : push.call(ret, arr)), ret
                    },
                    inArray: function(elem, arr, i) {
                        return null == arr ? -1 : indexOf.call(arr, elem, i)
                    },
                    merge: function(first, second) {
                        for (var len = +second.length, j = 0, i = first.length; j < len; j++) first[i++] = second[j];
                        return first.length = i, first
                    },
                    grep: function(elems, callback, invert) {
                        for (var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert; i < length; i++) callbackInverse = !callback(elems[i], i), callbackInverse !== callbackExpect && matches.push(elems[i]);
                        return matches
                    },
                    map: function(elems, callback, arg) {
                        var value, i = 0,
                            length = elems.length,
                            isArray = isArraylike(elems),
                            ret = [];
                        if (isArray)
                            for (; i < length; i++) value = callback(elems[i], i, arg), null != value && ret.push(value);
                        else
                            for (i in elems) value = callback(elems[i], i, arg), null != value && ret.push(value);
                        return concat.apply([], ret)
                    },
                    guid: 1,
                    proxy: function(fn, context) {
                        var tmp, args, proxy;
                        if ("string" == typeof context && (tmp = fn[context], context = fn, fn = tmp), jQuery.isFunction(fn)) return args = slice.call(arguments, 2), proxy = function() {
                            return fn.apply(context || this, args.concat(slice.call(arguments)))
                        }, proxy.guid = fn.guid = fn.guid || jQuery.guid++, proxy
                    },
                    now: Date.now,
                    support: support
                }), jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
                    class2type["[object " + name + "]"] = name.toLowerCase()
                });
                var Sizzle = function(window) {
                    function Sizzle(selector, context, results, seed) {
                        var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
                        if ((context ? context.ownerDocument || context : preferredDoc) !== document && setDocument(context), context = context || document, results = results || [], !selector || "string" != typeof selector) return results;
                        if (1 !== (nodeType = context.nodeType) && 9 !== nodeType) return [];
                        if (documentIsHTML && !seed) {
                            if (match = rquickExpr.exec(selector))
                                if (m = match[1]) {
                                    if (9 === nodeType) {
                                        if (elem = context.getElementById(m), !elem || !elem.parentNode) return results;
                                        if (elem.id === m) return results.push(elem), results
                                    } else if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) return results.push(elem), results
                                } else {
                                    if (match[2]) return push.apply(results, context.getElementsByTagName(selector)), results;
                                    if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) return push.apply(results, context.getElementsByClassName(m)), results
                                }
                            if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                                if (nid = old = expando, newContext = context, newSelector = 9 === nodeType && selector, 1 === nodeType && "object" !== context.nodeName.toLowerCase()) {
                                    for (groups = tokenize(selector), (old = context.getAttribute("id")) ? nid = old.replace(rescape, "\\$&") : context.setAttribute("id", nid), nid = "[id='" + nid + "'] ", i = groups.length; i--;) groups[i] = nid + toSelector(groups[i]);
                                    newContext = rsibling.test(selector) && testContext(context.parentNode) || context, newSelector = groups.join(",")
                                }
                                if (newSelector) try {
                                    return push.apply(results, newContext.querySelectorAll(newSelector)), results
                                } catch (qsaError) {} finally {
                                    old || context.removeAttribute("id")
                                }
                            }
                        }
                        return select(selector.replace(rtrim, "$1"), context, results, seed)
                    }

                    function createCache() {
                        function cache(key, value) {
                            return keys.push(key + " ") > Expr.cacheLength && delete cache[keys.shift()], cache[key + " "] = value
                        }
                        var keys = [];
                        return cache
                    }

                    function markFunction(fn) {
                        return fn[expando] = !0, fn
                    }

                    function assert(fn) {
                        var div = document.createElement("div");
                        try {
                            return !!fn(div)
                        } catch (e) {
                            return !1
                        } finally {
                            div.parentNode && div.parentNode.removeChild(div), div = null
                        }
                    }

                    function addHandle(attrs, handler) {
                        for (var arr = attrs.split("|"), i = attrs.length; i--;) Expr.attrHandle[arr[i]] = handler
                    }

                    function siblingCheck(a, b) {
                        var cur = b && a,
                            diff = cur && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
                        if (diff) return diff;
                        if (cur)
                            for (; cur = cur.nextSibling;)
                                if (cur === b) return -1;
                        return a ? 1 : -1
                    }

                    function createInputPseudo(type) {
                        return function(elem) {
                            var name = elem.nodeName.toLowerCase();
                            return "input" === name && elem.type === type
                        }
                    }

                    function createButtonPseudo(type) {
                        return function(elem) {
                            var name = elem.nodeName.toLowerCase();
                            return ("input" === name || "button" === name) && elem.type === type
                        }
                    }

                    function createPositionalPseudo(fn) {
                        return markFunction(function(argument) {
                            return argument = +argument, markFunction(function(seed, matches) {
                                for (var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length; i--;) seed[j = matchIndexes[i]] && (seed[j] = !(matches[j] = seed[j]))
                            })
                        })
                    }

                    function testContext(context) {
                        return context && typeof context.getElementsByTagName !== strundefined && context
                    }

                    function setFilters() {}

                    function toSelector(tokens) {
                        for (var i = 0, len = tokens.length, selector = ""; i < len; i++) selector += tokens[i].value;
                        return selector
                    }

                    function addCombinator(matcher, combinator, base) {
                        var dir = combinator.dir,
                            checkNonElements = base && "parentNode" === dir,
                            doneName = done++;
                        return combinator.first ? function(elem, context, xml) {
                            for (; elem = elem[dir];)
                                if (1 === elem.nodeType || checkNonElements) return matcher(elem, context, xml)
                        } : function(elem, context, xml) {
                            var oldCache, outerCache, newCache = [dirruns, doneName];
                            if (xml) {
                                for (; elem = elem[dir];)
                                    if ((1 === elem.nodeType || checkNonElements) && matcher(elem, context, xml)) return !0
                            } else
                                for (; elem = elem[dir];)
                                    if (1 === elem.nodeType || checkNonElements) {
                                        if (outerCache = elem[expando] || (elem[expando] = {}), (oldCache = outerCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) return newCache[2] = oldCache[2];
                                        if (outerCache[dir] = newCache, newCache[2] = matcher(elem, context, xml)) return !0
                                    }
                        }
                    }

                    function elementMatcher(matchers) {
                        return matchers.length > 1 ? function(elem, context, xml) {
                            for (var i = matchers.length; i--;)
                                if (!matchers[i](elem, context, xml)) return !1;
                            return !0
                        } : matchers[0]
                    }

                    function multipleContexts(selector, contexts, results) {
                        for (var i = 0, len = contexts.length; i < len; i++) Sizzle(selector, contexts[i], results);
                        return results
                    }

                    function condense(unmatched, map, filter, context, xml) {
                        for (var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = null != map; i < len; i++)(elem = unmatched[i]) && (filter && !filter(elem, context, xml) || (newUnmatched.push(elem), mapped && map.push(i)));
                        return newUnmatched
                    }

                    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
                        return postFilter && !postFilter[expando] && (postFilter = setMatcher(postFilter)), postFinder && !postFinder[expando] && (postFinder = setMatcher(postFinder, postSelector)), markFunction(function(seed, results, context, xml) {
                            var temp, i, elem, preMap = [],
                                postMap = [],
                                preexisting = results.length,
                                elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
                                matcherIn = !preFilter || !seed && selector ? elems : condense(elems, preMap, preFilter, context, xml),
                                matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                            if (matcher && matcher(matcherIn, matcherOut, context, xml), postFilter)
                                for (temp = condense(matcherOut, postMap), postFilter(temp, [], context, xml), i = temp.length; i--;)(elem = temp[i]) && (matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem));
                            if (seed) {
                                if (postFinder || preFilter) {
                                    if (postFinder) {
                                        for (temp = [], i = matcherOut.length; i--;)(elem = matcherOut[i]) && temp.push(matcherIn[i] = elem);
                                        postFinder(null, matcherOut = [], temp, xml)
                                    }
                                    for (i = matcherOut.length; i--;)(elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1 && (seed[temp] = !(results[temp] = elem))
                                }
                            } else matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut), postFinder ? postFinder(null, results, matcherOut, xml) : push.apply(results, matcherOut)
                        })
                    }

                    function matcherFromTokens(tokens) {
                        for (var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
                                return elem === checkContext
                            }, implicitRelative, !0), matchAnyContext = addCombinator(function(elem) {
                                return indexOf.call(checkContext, elem) > -1
                            }, implicitRelative, !0), matchers = [function(elem, context, xml) {
                                return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml))
                            }]; i < len; i++)
                            if (matcher = Expr.relative[tokens[i].type]) matchers = [addCombinator(elementMatcher(matchers), matcher)];
                            else {
                                if (matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches), matcher[expando]) {
                                    for (j = ++i; j < len && !Expr.relative[tokens[j].type]; j++);
                                    return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
                                        value: " " === tokens[i - 2].type ? "*" : ""
                                    })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens))
                                }
                                matchers.push(matcher)
                            }
                        return elementMatcher(matchers)
                    }

                    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
                        var bySet = setMatchers.length > 0,
                            byElement = elementMatchers.length > 0,
                            superMatcher = function(seed, context, xml, results, outermost) {
                                var elem, j, matcher, matchedCount = 0,
                                    i = "0",
                                    unmatched = seed && [],
                                    setMatched = [],
                                    contextBackup = outermostContext,
                                    elems = seed || byElement && Expr.find.TAG("*", outermost),
                                    dirrunsUnique = dirruns += null == contextBackup ? 1 : Math.random() || .1,
                                    len = elems.length;
                                for (outermost && (outermostContext = context !== document && context); i !== len && null != (elem = elems[i]); i++) {
                                    if (byElement && elem) {
                                        for (j = 0; matcher = elementMatchers[j++];)
                                            if (matcher(elem, context, xml)) {
                                                results.push(elem);
                                                break
                                            }
                                        outermost && (dirruns = dirrunsUnique)
                                    }
                                    bySet && ((elem = !matcher && elem) && matchedCount--, seed && unmatched.push(elem))
                                }
                                if (matchedCount += i, bySet && i !== matchedCount) {
                                    for (j = 0; matcher = setMatchers[j++];) matcher(unmatched, setMatched, context, xml);
                                    if (seed) {
                                        if (matchedCount > 0)
                                            for (; i--;) unmatched[i] || setMatched[i] || (setMatched[i] = pop.call(results));
                                        setMatched = condense(setMatched)
                                    }
                                    push.apply(results, setMatched), outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1 && Sizzle.uniqueSort(results)
                                }
                                return outermost && (dirruns = dirrunsUnique, outermostContext = contextBackup), unmatched
                            };
                        return bySet ? markFunction(superMatcher) : superMatcher
                    }
                    var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + -new Date,
                        preferredDoc = window.document,
                        dirruns = 0,
                        done = 0,
                        classCache = createCache(),
                        tokenCache = createCache(),
                        compilerCache = createCache(),
                        sortOrder = function(a, b) {
                            return a === b && (hasDuplicate = !0), 0
                        },
                        strundefined = "undefined",
                        MAX_NEGATIVE = 1 << 31,
                        hasOwn = {}.hasOwnProperty,
                        arr = [],
                        pop = arr.pop,
                        push_native = arr.push,
                        push = arr.push,
                        slice = arr.slice,
                        indexOf = arr.indexOf || function(elem) {
                            for (var i = 0, len = this.length; i < len; i++)
                                if (this[i] === elem) return i;
                            return -1
                        },
                        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                        whitespace = "[\\x20\\t\\r\\n\\f]",
                        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                        identifier = characterEncoding.replace("w", "w#"),
                        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
                        pseudos = ":(" + characterEncoding + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|.*)\\)|)",
                        rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
                        rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
                        rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
                        rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
                        rpseudo = new RegExp(pseudos),
                        ridentifier = new RegExp("^" + identifier + "$"),
                        matchExpr = {
                            ID: new RegExp("^#(" + characterEncoding + ")"),
                            CLASS: new RegExp("^\\.(" + characterEncoding + ")"),
                            TAG: new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
                            ATTR: new RegExp("^" + attributes),
                            PSEUDO: new RegExp("^" + pseudos),
                            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
                            bool: new RegExp("^(?:" + booleans + ")$", "i"),
                            needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
                        },
                        rinputs = /^(?:input|select|textarea|button)$/i,
                        rheader = /^h\d$/i,
                        rnative = /^[^{]+\{\s*\[native \w/,
                        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                        rsibling = /[+~]/,
                        rescape = /'|\\/g,
                        runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
                        funescape = function(_, escaped, escapedWhitespace) {
                            var high = "0x" + escaped - 65536;
                            return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, 1023 & high | 56320)
                        };
                    try {
                        push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes), arr[preferredDoc.childNodes.length].nodeType
                    } catch (e) {
                        push = {
                            apply: arr.length ? function(target, els) {
                                push_native.apply(target, slice.call(els))
                            } : function(target, els) {
                                for (var j = target.length, i = 0; target[j++] = els[i++];);
                                target.length = j - 1
                            }
                        }
                    }
                    support = Sizzle.support = {}, isXML = Sizzle.isXML = function(elem) {
                        var documentElement = elem && (elem.ownerDocument || elem).documentElement;
                        return !!documentElement && "HTML" !== documentElement.nodeName
                    }, setDocument = Sizzle.setDocument = function(node) {
                        var hasCompare, doc = node ? node.ownerDocument || node : preferredDoc,
                            parent = doc.defaultView;
                        return doc !== document && 9 === doc.nodeType && doc.documentElement ? (document = doc, docElem = doc.documentElement, documentIsHTML = !isXML(doc), parent && parent !== parent.top && (parent.addEventListener ? parent.addEventListener("unload", function() {
                            setDocument()
                        }, !1) : parent.attachEvent && parent.attachEvent("onunload", function() {
                            setDocument()
                        })), support.attributes = assert(function(div) {
                            return div.className = "i", !div.getAttribute("className")
                        }), support.getElementsByTagName = assert(function(div) {
                            return div.appendChild(doc.createComment("")), !div.getElementsByTagName("*").length
                        }), support.getElementsByClassName = rnative.test(doc.getElementsByClassName) && assert(function(div) {
                            return div.innerHTML = "<div class='a'></div><div class='a i'></div>", div.firstChild.className = "i", 2 === div.getElementsByClassName("i").length
                        }), support.getById = assert(function(div) {
                            return docElem.appendChild(div).id = expando, !doc.getElementsByName || !doc.getElementsByName(expando).length
                        }), support.getById ? (Expr.find.ID = function(id, context) {
                            if (typeof context.getElementById !== strundefined && documentIsHTML) {
                                var m = context.getElementById(id);
                                return m && m.parentNode ? [m] : []
                            }
                        }, Expr.filter.ID = function(id) {
                            var attrId = id.replace(runescape, funescape);
                            return function(elem) {
                                return elem.getAttribute("id") === attrId
                            }
                        }) : (delete Expr.find.ID, Expr.filter.ID = function(id) {
                            var attrId = id.replace(runescape, funescape);
                            return function(elem) {
                                var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                                return node && node.value === attrId
                            }
                        }), Expr.find.TAG = support.getElementsByTagName ? function(tag, context) {
                            if (typeof context.getElementsByTagName !== strundefined) return context.getElementsByTagName(tag)
                        } : function(tag, context) {
                            var elem, tmp = [],
                                i = 0,
                                results = context.getElementsByTagName(tag);
                            if ("*" === tag) {
                                for (; elem = results[i++];) 1 === elem.nodeType && tmp.push(elem);
                                return tmp
                            }
                            return results
                        }, Expr.find.CLASS = support.getElementsByClassName && function(className, context) {
                            if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) return context.getElementsByClassName(className)
                        }, rbuggyMatches = [], rbuggyQSA = [], (support.qsa = rnative.test(doc.querySelectorAll)) && (assert(function(div) {
                            div.innerHTML = "<select msallowclip=''><option selected=''></option></select>", div.querySelectorAll("[msallowclip^='']").length && rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")"), div.querySelectorAll("[selected]").length || rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")"), div.querySelectorAll(":checked").length || rbuggyQSA.push(":checked")
                        }), assert(function(div) {
                            var input = doc.createElement("input");
                            input.setAttribute("type", "hidden"), div.appendChild(input).setAttribute("name", "D"), div.querySelectorAll("[name=d]").length && rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?="), div.querySelectorAll(":enabled").length || rbuggyQSA.push(":enabled", ":disabled"), div.querySelectorAll("*,:x"), rbuggyQSA.push(",.*:")
                        })), (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) && assert(function(div) {
                            support.disconnectedMatch = matches.call(div, "div"), matches.call(div, "[s!='']:x"), rbuggyMatches.push("!=", pseudos)
                        }), rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|")), rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|")), hasCompare = rnative.test(docElem.compareDocumentPosition), contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
                            var adown = 9 === a.nodeType ? a.documentElement : a,
                                bup = b && b.parentNode;
                            return a === bup || !(!bup || 1 !== bup.nodeType || !(adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)))
                        } : function(a, b) {
                            if (b)
                                for (; b = b.parentNode;)
                                    if (b === a) return !0;
                            return !1
                        }, sortOrder = hasCompare ? function(a, b) {
                            if (a === b) return hasDuplicate = !0, 0;
                            var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                            return compare ? compare : (compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & compare || !support.sortDetached && b.compareDocumentPosition(a) === compare ? a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ? -1 : b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0 : 4 & compare ? -1 : 1)
                        } : function(a, b) {
                            if (a === b) return hasDuplicate = !0, 0;
                            var cur, i = 0,
                                aup = a.parentNode,
                                bup = b.parentNode,
                                ap = [a],
                                bp = [b];
                            if (!aup || !bup) return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
                            if (aup === bup) return siblingCheck(a, b);
                            for (cur = a; cur = cur.parentNode;) ap.unshift(cur);
                            for (cur = b; cur = cur.parentNode;) bp.unshift(cur);
                            for (; ap[i] === bp[i];) i++;
                            return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0
                        }, doc) : document
                    }, Sizzle.matches = function(expr, elements) {
                        return Sizzle(expr, null, null, elements)
                    }, Sizzle.matchesSelector = function(elem, expr) {
                        if ((elem.ownerDocument || elem) !== document && setDocument(elem), expr = expr.replace(rattributeQuotes, "='$1']"), support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) try {
                            var ret = matches.call(elem, expr);
                            if (ret || support.disconnectedMatch || elem.document && 11 !== elem.document.nodeType) return ret
                        } catch (e) {}
                        return Sizzle(expr, document, null, [elem]).length > 0
                    }, Sizzle.contains = function(context, elem) {
                        return (context.ownerDocument || context) !== document && setDocument(context), contains(context, elem)
                    }, Sizzle.attr = function(elem, name) {
                        (elem.ownerDocument || elem) !== document && setDocument(elem);
                        var fn = Expr.attrHandle[name.toLowerCase()],
                            val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
                        return void 0 !== val ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null
                    }, Sizzle.error = function(msg) {
                        throw new Error("Syntax error, unrecognized expression: " + msg)
                    }, Sizzle.uniqueSort = function(results) {
                        var elem, duplicates = [],
                            j = 0,
                            i = 0;
                        if (hasDuplicate = !support.detectDuplicates, sortInput = !support.sortStable && results.slice(0), results.sort(sortOrder), hasDuplicate) {
                            for (; elem = results[i++];) elem === results[i] && (j = duplicates.push(i));
                            for (; j--;) results.splice(duplicates[j], 1)
                        }
                        return sortInput = null, results
                    }, getText = Sizzle.getText = function(elem) {
                        var node, ret = "",
                            i = 0,
                            nodeType = elem.nodeType;
                        if (nodeType) {
                            if (1 === nodeType || 9 === nodeType || 11 === nodeType) {
                                if ("string" == typeof elem.textContent) return elem.textContent;
                                for (elem = elem.firstChild; elem; elem = elem.nextSibling) ret += getText(elem)
                            } else if (3 === nodeType || 4 === nodeType) return elem.nodeValue
                        } else
                            for (; node = elem[i++];) ret += getText(node);
                        return ret
                    }, Expr = Sizzle.selectors = {
                        cacheLength: 50,
                        createPseudo: markFunction,
                        match: matchExpr,
                        attrHandle: {},
                        find: {},
                        relative: {
                            ">": {
                                dir: "parentNode",
                                first: !0
                            },
                            " ": {
                                dir: "parentNode"
                            },
                            "+": {
                                dir: "previousSibling",
                                first: !0
                            },
                            "~": {
                                dir: "previousSibling"
                            }
                        },
                        preFilter: {
                            ATTR: function(match) {
                                return match[1] = match[1].replace(runescape, funescape), match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape), "~=" === match[2] && (match[3] = " " + match[3] + " "), match.slice(0, 4)
                            },
                            CHILD: function(match) {
                                return match[1] = match[1].toLowerCase(), "nth" === match[1].slice(0, 3) ? (match[3] || Sizzle.error(match[0]), match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * ("even" === match[3] || "odd" === match[3])), match[5] = +(match[7] + match[8] || "odd" === match[3])) : match[3] && Sizzle.error(match[0]), match
                            },
                            PSEUDO: function(match) {
                                var excess, unquoted = !match[6] && match[2];
                                return matchExpr.CHILD.test(match[0]) ? null : (match[3] ? match[2] = match[4] || match[5] || "" : unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, !0)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length) && (match[0] = match[0].slice(0, excess), match[2] = unquoted.slice(0, excess)), match.slice(0, 3))
                            }
                        },
                        filter: {
                            TAG: function(nodeNameSelector) {
                                var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                                return "*" === nodeNameSelector ? function() {
                                    return !0
                                } : function(elem) {
                                    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName
                                }
                            },
                            CLASS: function(className) {
                                var pattern = classCache[className + " "];
                                return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                                    return pattern.test("string" == typeof elem.className && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "")
                                })
                            },
                            ATTR: function(name, operator, check) {
                                return function(elem) {
                                    var result = Sizzle.attr(elem, name);
                                    return null == result ? "!=" === operator : !operator || (result += "", "=" === operator ? result === check : "!=" === operator ? result !== check : "^=" === operator ? check && 0 === result.indexOf(check) : "*=" === operator ? check && result.indexOf(check) > -1 : "$=" === operator ? check && result.slice(-check.length) === check : "~=" === operator ? (" " + result + " ").indexOf(check) > -1 : "|=" === operator && (result === check || result.slice(0, check.length + 1) === check + "-"))
                                }
                            },
                            CHILD: function(type, what, argument, first, last) {
                                var simple = "nth" !== type.slice(0, 3),
                                    forward = "last" !== type.slice(-4),
                                    ofType = "of-type" === what;
                                return 1 === first && 0 === last ? function(elem) {
                                    return !!elem.parentNode
                                } : function(elem, context, xml) {
                                    var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling",
                                        parent = elem.parentNode,
                                        name = ofType && elem.nodeName.toLowerCase(),
                                        useCache = !xml && !ofType;
                                    if (parent) {
                                        if (simple) {
                                            for (; dir;) {
                                                for (node = elem; node = node[dir];)
                                                    if (ofType ? node.nodeName.toLowerCase() === name : 1 === node.nodeType) return !1;
                                                start = dir = "only" === type && !start && "nextSibling"
                                            }
                                            return !0
                                        }
                                        if (start = [forward ? parent.firstChild : parent.lastChild], forward && useCache) {
                                            for (outerCache = parent[expando] || (parent[expando] = {}), cache = outerCache[type] || [], nodeIndex = cache[0] === dirruns && cache[1], diff = cache[0] === dirruns && cache[2], node = nodeIndex && parent.childNodes[nodeIndex]; node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop();)
                                                if (1 === node.nodeType && ++diff && node === elem) {
                                                    outerCache[type] = [dirruns, nodeIndex, diff];
                                                    break
                                                }
                                        } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) diff = cache[1];
                                        else
                                            for (;
                                                (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) && ((ofType ? node.nodeName.toLowerCase() !== name : 1 !== node.nodeType) || !++diff || (useCache && ((node[expando] || (node[expando] = {}))[type] = [dirruns, diff]), node !== elem)););
                                        return diff -= last, diff === first || diff % first === 0 && diff / first >= 0
                                    }
                                }
                            },
                            PSEUDO: function(pseudo, argument) {
                                var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                                return fn[expando] ? fn(argument) : fn.length > 1 ? (args = [pseudo, pseudo, "", argument], Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
                                    for (var idx, matched = fn(seed, argument), i = matched.length; i--;) idx = indexOf.call(seed, matched[i]), seed[idx] = !(matches[idx] = matched[i])
                                }) : function(elem) {
                                    return fn(elem, 0, args)
                                }) : fn
                            }
                        },
                        pseudos: {
                            not: markFunction(function(selector) {
                                var input = [],
                                    results = [],
                                    matcher = compile(selector.replace(rtrim, "$1"));
                                return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
                                    for (var elem, unmatched = matcher(seed, null, xml, []), i = seed.length; i--;)(elem = unmatched[i]) && (seed[i] = !(matches[i] = elem))
                                }) : function(elem, context, xml) {
                                    return input[0] = elem, matcher(input, null, xml, results), !results.pop()
                                }
                            }),
                            has: markFunction(function(selector) {
                                return function(elem) {
                                    return Sizzle(selector, elem).length > 0
                                }
                            }),
                            contains: markFunction(function(text) {
                                return function(elem) {
                                    return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1
                                }
                            }),
                            lang: markFunction(function(lang) {
                                return ridentifier.test(lang || "") || Sizzle.error("unsupported lang: " + lang), lang = lang.replace(runescape, funescape).toLowerCase(),
                                    function(elem) {
                                        var elemLang;
                                        do
                                            if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) return elemLang = elemLang.toLowerCase(), elemLang === lang || 0 === elemLang.indexOf(lang + "-");
                                        while ((elem = elem.parentNode) && 1 === elem.nodeType);
                                        return !1
                                    }
                            }),
                            target: function(elem) {
                                var hash = window.location && window.location.hash;
                                return hash && hash.slice(1) === elem.id
                            },
                            root: function(elem) {
                                return elem === docElem
                            },
                            focus: function(elem) {
                                return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex)
                            },
                            enabled: function(elem) {
                                return elem.disabled === !1
                            },
                            disabled: function(elem) {
                                return elem.disabled === !0
                            },
                            checked: function(elem) {
                                var nodeName = elem.nodeName.toLowerCase();
                                return "input" === nodeName && !!elem.checked || "option" === nodeName && !!elem.selected
                            },
                            selected: function(elem) {
                                return elem.parentNode && elem.parentNode.selectedIndex, elem.selected === !0
                            },
                            empty: function(elem) {
                                for (elem = elem.firstChild; elem; elem = elem.nextSibling)
                                    if (elem.nodeType < 6) return !1;
                                return !0
                            },
                            parent: function(elem) {
                                return !Expr.pseudos.empty(elem)
                            },
                            header: function(elem) {
                                return rheader.test(elem.nodeName)
                            },
                            input: function(elem) {
                                return rinputs.test(elem.nodeName)
                            },
                            button: function(elem) {
                                var name = elem.nodeName.toLowerCase();
                                return "input" === name && "button" === elem.type || "button" === name
                            },
                            text: function(elem) {
                                var attr;
                                return "input" === elem.nodeName.toLowerCase() && "text" === elem.type && (null == (attr = elem.getAttribute("type")) || "text" === attr.toLowerCase())
                            },
                            first: createPositionalPseudo(function() {
                                return [0]
                            }),
                            last: createPositionalPseudo(function(matchIndexes, length) {
                                return [length - 1]
                            }),
                            eq: createPositionalPseudo(function(matchIndexes, length, argument) {
                                return [argument < 0 ? argument + length : argument]
                            }),
                            even: createPositionalPseudo(function(matchIndexes, length) {
                                for (var i = 0; i < length; i += 2) matchIndexes.push(i);
                                return matchIndexes
                            }),
                            odd: createPositionalPseudo(function(matchIndexes, length) {
                                for (var i = 1; i < length; i += 2) matchIndexes.push(i);
                                return matchIndexes
                            }),
                            lt: createPositionalPseudo(function(matchIndexes, length, argument) {
                                for (var i = argument < 0 ? argument + length : argument; --i >= 0;) matchIndexes.push(i);
                                return matchIndexes
                            }),
                            gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                                for (var i = argument < 0 ? argument + length : argument; ++i < length;) matchIndexes.push(i);
                                return matchIndexes
                            })
                        }
                    }, Expr.pseudos.nth = Expr.pseudos.eq;
                    for (i in {
                            radio: !0,
                            checkbox: !0,
                            file: !0,
                            password: !0,
                            image: !0
                        }) Expr.pseudos[i] = createInputPseudo(i);
                    for (i in {
                            submit: !0,
                            reset: !0
                        }) Expr.pseudos[i] = createButtonPseudo(i);
                    return setFilters.prototype = Expr.filters = Expr.pseudos, Expr.setFilters = new setFilters, tokenize = Sizzle.tokenize = function(selector, parseOnly) {
                        var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
                        if (cached) return parseOnly ? 0 : cached.slice(0);
                        for (soFar = selector, groups = [], preFilters = Expr.preFilter; soFar;) {
                            matched && !(match = rcomma.exec(soFar)) || (match && (soFar = soFar.slice(match[0].length) || soFar), groups.push(tokens = [])), matched = !1, (match = rcombinators.exec(soFar)) && (matched = match.shift(), tokens.push({
                                value: matched,
                                type: match[0].replace(rtrim, " ")
                            }), soFar = soFar.slice(matched.length));
                            for (type in Expr.filter) !(match = matchExpr[type].exec(soFar)) || preFilters[type] && !(match = preFilters[type](match)) || (matched = match.shift(), tokens.push({
                                value: matched,
                                type: type,
                                matches: match
                            }), soFar = soFar.slice(matched.length));
                            if (!matched) break
                        }
                        return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0)
                    }, compile = Sizzle.compile = function(selector, match) {
                        var i, setMatchers = [],
                            elementMatchers = [],
                            cached = compilerCache[selector + " "];
                        if (!cached) {
                            for (match || (match = tokenize(selector)), i = match.length; i--;) cached = matcherFromTokens(match[i]), cached[expando] ? setMatchers.push(cached) : elementMatchers.push(cached);
                            cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers)), cached.selector = selector
                        }
                        return cached
                    }, select = Sizzle.select = function(selector, context, results, seed) {
                        var i, tokens, token, type, find, compiled = "function" == typeof selector && selector,
                            match = !seed && tokenize(selector = compiled.selector || selector);
                        if (results = results || [], 1 === match.length) {
                            if (tokens = match[0] = match[0].slice(0), tokens.length > 2 && "ID" === (token = tokens[0]).type && support.getById && 9 === context.nodeType && documentIsHTML && Expr.relative[tokens[1].type]) {
                                if (context = (Expr.find.ID(token.matches[0].replace(runescape, funescape), context) || [])[0], !context) return results;
                                compiled && (context = context.parentNode), selector = selector.slice(tokens.shift().value.length)
                            }
                            for (i = matchExpr.needsContext.test(selector) ? 0 : tokens.length; i-- && (token = tokens[i], !Expr.relative[type = token.type]);)
                                if ((find = Expr.find[type]) && (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context))) {
                                    if (tokens.splice(i, 1), selector = seed.length && toSelector(tokens), !selector) return push.apply(results, seed), results;
                                    break
                                }
                        }
                        return (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context), results
                    }, support.sortStable = expando.split("").sort(sortOrder).join("") === expando, support.detectDuplicates = !!hasDuplicate, setDocument(), support.sortDetached = assert(function(div1) {
                        return 1 & div1.compareDocumentPosition(document.createElement("div"))
                    }), assert(function(div) {
                        return div.innerHTML = "<a href='#'></a>", "#" === div.firstChild.getAttribute("href")
                    }) || addHandle("type|href|height|width", function(elem, name, isXML) {
                        if (!isXML) return elem.getAttribute(name, "type" === name.toLowerCase() ? 1 : 2)
                    }), support.attributes && assert(function(div) {
                        return div.innerHTML = "<input/>", div.firstChild.setAttribute("value", ""), "" === div.firstChild.getAttribute("value")
                    }) || addHandle("value", function(elem, name, isXML) {
                        if (!isXML && "input" === elem.nodeName.toLowerCase()) return elem.defaultValue
                    }), assert(function(div) {
                        return null == div.getAttribute("disabled")
                    }) || addHandle(booleans, function(elem, name, isXML) {
                        var val;
                        if (!isXML) return elem[name] === !0 ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null
                    }), Sizzle
                }(window);
                jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.pseudos, jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains;
                var rneedsContext = jQuery.expr.match.needsContext,
                    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
                    risSimple = /^.[^:#\[\.,]*$/;
                jQuery.filter = function(expr, elems, not) {
                    var elem = elems[0];
                    return not && (expr = ":not(" + expr + ")"), 1 === elems.length && 1 === elem.nodeType ? jQuery.find.matchesSelector(elem, expr) ? [elem] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
                        return 1 === elem.nodeType
                    }))
                }, jQuery.fn.extend({
                    find: function(selector) {
                        var i, len = this.length,
                            ret = [],
                            self = this;
                        if ("string" != typeof selector) return this.pushStack(jQuery(selector).filter(function() {
                            for (i = 0; i < len; i++)
                                if (jQuery.contains(self[i], this)) return !0
                        }));
                        for (i = 0; i < len; i++) jQuery.find(selector, self[i], ret);
                        return ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret), ret.selector = this.selector ? this.selector + " " + selector : selector, ret
                    },
                    filter: function(selector) {
                        return this.pushStack(winnow(this, selector || [], !1))
                    },
                    not: function(selector) {
                        return this.pushStack(winnow(this, selector || [], !0))
                    },
                    is: function(selector) {
                        return !!winnow(this, "string" == typeof selector && rneedsContext.test(selector) ? jQuery(selector) : selector || [], !1).length
                    }
                });
                var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
                    init = jQuery.fn.init = function(selector, context) {
                        var match, elem;
                        if (!selector) return this;
                        if ("string" == typeof selector) {
                            if (match = "<" === selector[0] && ">" === selector[selector.length - 1] && selector.length >= 3 ? [null, selector, null] : rquickExpr.exec(selector), !match || !match[1] && context) return !context || context.jquery ? (context || rootjQuery).find(selector) : this.constructor(context).find(selector);
                            if (match[1]) {
                                if (context = context instanceof jQuery ? context[0] : context, jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, !0)), rsingleTag.test(match[1]) && jQuery.isPlainObject(context))
                                    for (match in context) jQuery.isFunction(this[match]) ? this[match](context[match]) : this.attr(match, context[match]);
                                return this
                            }
                            return elem = document.getElementById(match[2]), elem && elem.parentNode && (this.length = 1, this[0] = elem), this.context = document, this.selector = selector, this
                        }
                        return selector.nodeType ? (this.context = this[0] = selector, this.length = 1, this) : jQuery.isFunction(selector) ? "undefined" != typeof rootjQuery.ready ? rootjQuery.ready(selector) : selector(jQuery) : (void 0 !== selector.selector && (this.selector = selector.selector, this.context = selector.context), jQuery.makeArray(selector, this))
                    };
                init.prototype = jQuery.fn, rootjQuery = jQuery(document);
                var rparentsprev = /^(?:parents|prev(?:Until|All))/,
                    guaranteedUnique = {
                        children: !0,
                        contents: !0,
                        next: !0,
                        prev: !0
                    };
                jQuery.extend({
                    dir: function(elem, dir, until) {
                        for (var matched = [], truncate = void 0 !== until;
                            (elem = elem[dir]) && 9 !== elem.nodeType;)
                            if (1 === elem.nodeType) {
                                if (truncate && jQuery(elem).is(until)) break;
                                matched.push(elem)
                            }
                        return matched
                    },
                    sibling: function(n, elem) {
                        for (var matched = []; n; n = n.nextSibling) 1 === n.nodeType && n !== elem && matched.push(n);
                        return matched
                    }
                }), jQuery.fn.extend({
                    has: function(target) {
                        var targets = jQuery(target, this),
                            l = targets.length;
                        return this.filter(function() {
                            for (var i = 0; i < l; i++)
                                if (jQuery.contains(this, targets[i])) return !0
                        })
                    },
                    closest: function(selectors, context) {
                        for (var cur, i = 0, l = this.length, matched = [], pos = rneedsContext.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0; i < l; i++)
                            for (cur = this[i]; cur && cur !== context; cur = cur.parentNode)
                                if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : 1 === cur.nodeType && jQuery.find.matchesSelector(cur, selectors))) {
                                    matched.push(cur);
                                    break
                                }
                        return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched)
                    },
                    index: function(elem) {
                        return elem ? "string" == typeof elem ? indexOf.call(jQuery(elem), this[0]) : indexOf.call(this, elem.jquery ? elem[0] : elem) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                    },
                    add: function(selector, context) {
                        return this.pushStack(jQuery.unique(jQuery.merge(this.get(), jQuery(selector, context))))
                    },
                    addBack: function(selector) {
                        return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector))
                    }
                }), jQuery.each({
                    parent: function(elem) {
                        var parent = elem.parentNode;
                        return parent && 11 !== parent.nodeType ? parent : null
                    },
                    parents: function(elem) {
                        return jQuery.dir(elem, "parentNode")
                    },
                    parentsUntil: function(elem, i, until) {
                        return jQuery.dir(elem, "parentNode", until)
                    },
                    next: function(elem) {
                        return sibling(elem, "nextSibling")
                    },
                    prev: function(elem) {
                        return sibling(elem, "previousSibling")
                    },
                    nextAll: function(elem) {
                        return jQuery.dir(elem, "nextSibling")
                    },
                    prevAll: function(elem) {
                        return jQuery.dir(elem, "previousSibling")
                    },
                    nextUntil: function(elem, i, until) {
                        return jQuery.dir(elem, "nextSibling", until)
                    },
                    prevUntil: function(elem, i, until) {
                        return jQuery.dir(elem, "previousSibling", until)
                    },
                    siblings: function(elem) {
                        return jQuery.sibling((elem.parentNode || {}).firstChild, elem)
                    },
                    children: function(elem) {
                        return jQuery.sibling(elem.firstChild)
                    },
                    contents: function(elem) {
                        return elem.contentDocument || jQuery.merge([], elem.childNodes)
                    }
                }, function(name, fn) {
                    jQuery.fn[name] = function(until, selector) {
                        var matched = jQuery.map(this, fn, until);
                        return "Until" !== name.slice(-5) && (selector = until), selector && "string" == typeof selector && (matched = jQuery.filter(selector, matched)), this.length > 1 && (guaranteedUnique[name] || jQuery.unique(matched), rparentsprev.test(name) && matched.reverse()), this.pushStack(matched)
                    }
                });
                var rnotwhite = /\S+/g,
                    optionsCache = {};
                jQuery.Callbacks = function(options) {
                    options = "string" == typeof options ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
                    var memory, fired, firing, firingStart, firingLength, firingIndex, list = [],
                        stack = !options.once && [],
                        fire = function(data) {
                            for (memory = options.memory && data, fired = !0, firingIndex = firingStart || 0, firingStart = 0, firingLength = list.length, firing = !0; list && firingIndex < firingLength; firingIndex++)
                                if (list[firingIndex].apply(data[0], data[1]) === !1 && options.stopOnFalse) {
                                    memory = !1;
                                    break
                                }
                            firing = !1, list && (stack ? stack.length && fire(stack.shift()) : memory ? list = [] : self.disable())
                        },
                        self = {
                            add: function() {
                                if (list) {
                                    var start = list.length;
                                    ! function add(args) {
                                        jQuery.each(args, function(_, arg) {
                                            var type = jQuery.type(arg);
                                            "function" === type ? options.unique && self.has(arg) || list.push(arg) : arg && arg.length && "string" !== type && add(arg)
                                        })
                                    }(arguments), firing ? firingLength = list.length : memory && (firingStart = start, fire(memory))
                                }
                                return this
                            },
                            remove: function() {
                                return list && jQuery.each(arguments, function(_, arg) {
                                    for (var index;
                                        (index = jQuery.inArray(arg, list, index)) > -1;) list.splice(index, 1), firing && (index <= firingLength && firingLength--, index <= firingIndex && firingIndex--)
                                }), this
                            },
                            has: function(fn) {
                                return fn ? jQuery.inArray(fn, list) > -1 : !(!list || !list.length)
                            },
                            empty: function() {
                                return list = [], firingLength = 0, this
                            },
                            disable: function() {
                                return list = stack = memory = void 0, this
                            },
                            disabled: function() {
                                return !list
                            },
                            lock: function() {
                                return stack = void 0, memory || self.disable(), this
                            },
                            locked: function() {
                                return !stack
                            },
                            fireWith: function(context, args) {
                                return !list || fired && !stack || (args = args || [], args = [context, args.slice ? args.slice() : args], firing ? stack.push(args) : fire(args)), this
                            },
                            fire: function() {
                                return self.fireWith(this, arguments), this
                            },
                            fired: function() {
                                return !!fired
                            }
                        };
                    return self
                };
                var access = jQuery.access = function(elems, fn, key, value, chainable, emptyGet, raw) {
                    var i = 0,
                        len = elems.length,
                        bulk = null == key;
                    if ("object" === jQuery.type(key)) {
                        chainable = !0;
                        for (i in key) jQuery.access(elems, fn, i, key[i], !0, emptyGet, raw)
                    } else if (void 0 !== value && (chainable = !0, jQuery.isFunction(value) || (raw = !0), bulk && (raw ? (fn.call(elems, value), fn = null) : (bulk = fn, fn = function(elem, key, value) {
                            return bulk.call(jQuery(elem), value)
                        })), fn))
                        for (; i < len; i++) fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                    return chainable ? elems : bulk ? fn.call(elems) : len ? fn(elems[0], key) : emptyGet
                };
                jQuery.acceptData = function(owner) {
                    return 1 === owner.nodeType || 9 === owner.nodeType || !+owner.nodeType
                }, Data.uid = 1, Data.accepts = jQuery.acceptData, Data.prototype = {
                    key: function(owner) {
                        if (!Data.accepts(owner)) return 0;
                        var descriptor = {},
                            unlock = owner[this.expando];
                        if (!unlock) {
                            unlock = Data.uid++;
                            try {
                                descriptor[this.expando] = {
                                    value: unlock
                                }, Object.defineProperties(owner, descriptor)
                            } catch (e) {
                                descriptor[this.expando] = unlock, jQuery.extend(owner, descriptor)
                            }
                        }
                        return this.cache[unlock] || (this.cache[unlock] = {}), unlock
                    },
                    set: function(owner, data, value) {
                        var prop, unlock = this.key(owner),
                            cache = this.cache[unlock];
                        if ("string" == typeof data) cache[data] = value;
                        else if (jQuery.isEmptyObject(cache)) jQuery.extend(this.cache[unlock], data);
                        else
                            for (prop in data) cache[prop] = data[prop];
                        return cache
                    },
                    get: function(owner, key) {
                        var cache = this.cache[this.key(owner)];
                        return void 0 === key ? cache : cache[key]
                    },
                    access: function(owner, key, value) {
                        var stored;
                        return void 0 === key || key && "string" == typeof key && void 0 === value ? (stored = this.get(owner, key), void 0 !== stored ? stored : this.get(owner, jQuery.camelCase(key))) : (this.set(owner, key, value), void 0 !== value ? value : key)
                    },
                    remove: function(owner, key) {
                        var i, name, camel, unlock = this.key(owner),
                            cache = this.cache[unlock];
                        if (void 0 === key) this.cache[unlock] = {};
                        else {
                            jQuery.isArray(key) ? name = key.concat(key.map(jQuery.camelCase)) : (camel = jQuery.camelCase(key), key in cache ? name = [key, camel] : (name = camel, name = name in cache ? [name] : name.match(rnotwhite) || [])), i = name.length;
                            for (; i--;) delete cache[name[i]]
                        }
                    },
                    hasData: function(owner) {
                        return !jQuery.isEmptyObject(this.cache[owner[this.expando]] || {})
                    },
                    discard: function(owner) {
                        owner[this.expando] && delete this.cache[owner[this.expando]]
                    }
                };
                var data_priv = new Data,
                    data_user = new Data,
                    rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
                    rmultiDash = /([A-Z])/g;
                jQuery.extend({
                    hasData: function(elem) {
                        return data_user.hasData(elem) || data_priv.hasData(elem)
                    },
                    data: function(elem, name, data) {
                        return data_user.access(elem, name, data)
                    },
                    removeData: function(elem, name) {
                        data_user.remove(elem, name)
                    },
                    _data: function(elem, name, data) {
                        return data_priv.access(elem, name, data)
                    },
                    _removeData: function(elem, name) {
                        data_priv.remove(elem, name)
                    }
                }), jQuery.fn.extend({
                    data: function(key, value) {
                        var i, name, data, elem = this[0],
                            attrs = elem && elem.attributes;
                        if (void 0 === key) {
                            if (this.length && (data = data_user.get(elem), 1 === elem.nodeType && !data_priv.get(elem, "hasDataAttrs"))) {
                                for (i = attrs.length; i--;) attrs[i] && (name = attrs[i].name, 0 === name.indexOf("data-") && (name = jQuery.camelCase(name.slice(5)), dataAttr(elem, name, data[name])));
                                data_priv.set(elem, "hasDataAttrs", !0)
                            }
                            return data
                        }
                        return "object" == typeof key ? this.each(function() {
                            data_user.set(this, key)
                        }) : access(this, function(value) {
                            var data, camelKey = jQuery.camelCase(key);
                            if (elem && void 0 === value) {
                                if (data = data_user.get(elem, key), void 0 !== data) return data;
                                if (data = data_user.get(elem, camelKey), void 0 !== data) return data;
                                if (data = dataAttr(elem, camelKey, void 0), void 0 !== data) return data
                            } else this.each(function() {
                                var data = data_user.get(this, camelKey);
                                data_user.set(this, camelKey, value), key.indexOf("-") !== -1 && void 0 !== data && data_user.set(this, key, value)
                            })
                        }, null, value, arguments.length > 1, null, !0)
                    },
                    removeData: function(key) {
                        return this.each(function() {
                            data_user.remove(this, key)
                        })
                    }
                }), jQuery.extend({
                    queue: function(elem, type, data) {
                        var queue;
                        if (elem) return type = (type || "fx") + "queue", queue = data_priv.get(elem, type), data && (!queue || jQuery.isArray(data) ? queue = data_priv.access(elem, type, jQuery.makeArray(data)) : queue.push(data)), queue || []
                    },
                    dequeue: function(elem, type) {
                        type = type || "fx";
                        var queue = jQuery.queue(elem, type),
                            startLength = queue.length,
                            fn = queue.shift(),
                            hooks = jQuery._queueHooks(elem, type),
                            next = function() {
                                jQuery.dequeue(elem, type)
                            };
                        "inprogress" === fn && (fn = queue.shift(), startLength--), fn && ("fx" === type && queue.unshift("inprogress"), delete hooks.stop, fn.call(elem, next, hooks)), !startLength && hooks && hooks.empty.fire()
                    },
                    _queueHooks: function(elem, type) {
                        var key = type + "queueHooks";
                        return data_priv.get(elem, key) || data_priv.access(elem, key, {
                            empty: jQuery.Callbacks("once memory").add(function() {
                                data_priv.remove(elem, [type + "queue", key])
                            })
                        })
                    }
                }), jQuery.fn.extend({
                    queue: function(type, data) {
                        var setter = 2;
                        return "string" != typeof type && (data = type, type = "fx", setter--), arguments.length < setter ? jQuery.queue(this[0], type) : void 0 === data ? this : this.each(function() {
                            var queue = jQuery.queue(this, type, data);
                            jQuery._queueHooks(this, type), "fx" === type && "inprogress" !== queue[0] && jQuery.dequeue(this, type)
                        })
                    },
                    dequeue: function(type) {
                        return this.each(function() {
                            jQuery.dequeue(this, type)
                        })
                    },
                    clearQueue: function(type) {
                        return this.queue(type || "fx", [])
                    },
                    promise: function(type, obj) {
                        var tmp, count = 1,
                            defer = jQuery.Deferred(),
                            elements = this,
                            i = this.length,
                            resolve = function() {
                                --count || defer.resolveWith(elements, [elements])
                            };
                        for ("string" != typeof type && (obj = type, type = void 0), type = type || "fx"; i--;) tmp = data_priv.get(elements[i], type + "queueHooks"), tmp && tmp.empty && (count++, tmp.empty.add(resolve));
                        return resolve(), defer.promise(obj)
                    }
                });
                var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
                    cssExpand = ["Top", "Right", "Bottom", "Left"],
                    isHidden = function(elem, el) {
                        return elem = el || elem, "none" === jQuery.css(elem, "display") || !jQuery.contains(elem.ownerDocument, elem)
                    },
                    rcheckableType = /^(?:checkbox|radio)$/i;
                ! function() {
                    var fragment = document.createDocumentFragment(),
                        div = fragment.appendChild(document.createElement("div")),
                        input = document.createElement("input");
                    input.setAttribute("type", "radio"), input.setAttribute("checked", "checked"), input.setAttribute("name", "t"), div.appendChild(input), support.checkClone = div.cloneNode(!0).cloneNode(!0).lastChild.checked, div.innerHTML = "<textarea>x</textarea>", support.noCloneChecked = !!div.cloneNode(!0).lastChild.defaultValue
                }();
                var strundefined = "undefined";
                support.focusinBubbles = "onfocusin" in window;
                var rkeyEvent = /^key/,
                    rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
                    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
                    rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
                jQuery.event = {
                    global: {},
                    add: function(elem, types, handler, data, selector) {
                        var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = data_priv.get(elem);
                        if (elemData)
                            for (handler.handler && (handleObjIn = handler, handler = handleObjIn.handler, selector = handleObjIn.selector), handler.guid || (handler.guid = jQuery.guid++), (events = elemData.events) || (events = elemData.events = {}), (eventHandle = elemData.handle) || (eventHandle = elemData.handle = function(e) {
                                    return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0
                                }), types = (types || "").match(rnotwhite) || [""], t = types.length; t--;) tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type && (special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, special = jQuery.event.special[type] || {}, handleObj = jQuery.extend({
                                type: type,
                                origType: origType,
                                data: data,
                                handler: handler,
                                guid: handler.guid,
                                selector: selector,
                                needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                                namespace: namespaces.join(".")
                            }, handleObjIn), (handlers = events[type]) || (handlers = events[type] = [], handlers.delegateCount = 0, special.setup && special.setup.call(elem, data, namespaces, eventHandle) !== !1 || elem.addEventListener && elem.addEventListener(type, eventHandle, !1)), special.add && (special.add.call(elem, handleObj), handleObj.handler.guid || (handleObj.handler.guid = handler.guid)), selector ? handlers.splice(handlers.delegateCount++, 0, handleObj) : handlers.push(handleObj), jQuery.event.global[type] = !0)
                    },
                    remove: function(elem, types, handler, selector, mappedTypes) {
                        var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = data_priv.hasData(elem) && data_priv.get(elem);
                        if (elemData && (events = elemData.events)) {
                            for (types = (types || "").match(rnotwhite) || [""], t = types.length; t--;)
                                if (tmp = rtypenamespace.exec(types[t]) || [], type = origType = tmp[1], namespaces = (tmp[2] || "").split(".").sort(), type) {
                                    for (special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, handlers = events[type] || [], tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)"), origCount = j = handlers.length; j--;) handleObj = handlers[j], !mappedTypes && origType !== handleObj.origType || handler && handler.guid !== handleObj.guid || tmp && !tmp.test(handleObj.namespace) || selector && selector !== handleObj.selector && ("**" !== selector || !handleObj.selector) || (handlers.splice(j, 1), handleObj.selector && handlers.delegateCount--, special.remove && special.remove.call(elem, handleObj));
                                    origCount && !handlers.length && (special.teardown && special.teardown.call(elem, namespaces, elemData.handle) !== !1 || jQuery.removeEvent(elem, type, elemData.handle), delete events[type])
                                } else
                                    for (type in events) jQuery.event.remove(elem, type + types[t], handler, selector, !0);
                            jQuery.isEmptyObject(events) && (delete elemData.handle, data_priv.remove(elem, "events"))
                        }
                    },
                    trigger: function(event, data, elem, onlyHandlers) {
                        var i, cur, tmp, bubbleType, ontype, handle, special, eventPath = [elem || document],
                            type = hasOwn.call(event, "type") ? event.type : event,
                            namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
                        if (cur = tmp = elem = elem || document, 3 !== elem.nodeType && 8 !== elem.nodeType && !rfocusMorph.test(type + jQuery.event.triggered) && (type.indexOf(".") >= 0 && (namespaces = type.split("."), type = namespaces.shift(), namespaces.sort()), ontype = type.indexOf(":") < 0 && "on" + type, event = event[jQuery.expando] ? event : new jQuery.Event(type, "object" == typeof event && event), event.isTrigger = onlyHandlers ? 2 : 3, event.namespace = namespaces.join("."), event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, event.result = void 0, event.target || (event.target = elem), data = null == data ? [event] : jQuery.makeArray(data, [event]), special = jQuery.event.special[type] || {}, onlyHandlers || !special.trigger || special.trigger.apply(elem, data) !== !1)) {
                            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                                for (bubbleType = special.delegateType || type, rfocusMorph.test(bubbleType + type) || (cur = cur.parentNode); cur; cur = cur.parentNode) eventPath.push(cur), tmp = cur;
                                tmp === (elem.ownerDocument || document) && eventPath.push(tmp.defaultView || tmp.parentWindow || window)
                            }
                            for (i = 0;
                                (cur = eventPath[i++]) && !event.isPropagationStopped();) event.type = i > 1 ? bubbleType : special.bindType || type, handle = (data_priv.get(cur, "events") || {})[event.type] && data_priv.get(cur, "handle"), handle && handle.apply(cur, data), handle = ontype && cur[ontype], handle && handle.apply && jQuery.acceptData(cur) && (event.result = handle.apply(cur, data), event.result === !1 && event.preventDefault());
                            return event.type = type, onlyHandlers || event.isDefaultPrevented() || special._default && special._default.apply(eventPath.pop(), data) !== !1 || !jQuery.acceptData(elem) || ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem) && (tmp = elem[ontype], tmp && (elem[ontype] = null), jQuery.event.triggered = type, elem[type](), jQuery.event.triggered = void 0, tmp && (elem[ontype] = tmp)), event.result
                        }
                    },
                    dispatch: function(event) {
                        event = jQuery.event.fix(event);
                        var i, j, ret, matched, handleObj, handlerQueue = [],
                            args = slice.call(arguments),
                            handlers = (data_priv.get(this, "events") || {})[event.type] || [],
                            special = jQuery.event.special[event.type] || {};
                        if (args[0] = event, event.delegateTarget = this, !special.preDispatch || special.preDispatch.call(this, event) !== !1) {
                            for (handlerQueue = jQuery.event.handlers.call(this, event, handlers), i = 0;
                                (matched = handlerQueue[i++]) && !event.isPropagationStopped();)
                                for (event.currentTarget = matched.elem, j = 0;
                                    (handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped();) event.namespace_re && !event.namespace_re.test(handleObj.namespace) || (event.handleObj = handleObj, event.data = handleObj.data, ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args), void 0 !== ret && (event.result = ret) === !1 && (event.preventDefault(), event.stopPropagation()));
                            return special.postDispatch && special.postDispatch.call(this, event), event.result
                        }
                    },
                    handlers: function(event, handlers) {
                        var i, matches, sel, handleObj, handlerQueue = [],
                            delegateCount = handlers.delegateCount,
                            cur = event.target;
                        if (delegateCount && cur.nodeType && (!event.button || "click" !== event.type))
                            for (; cur !== this; cur = cur.parentNode || this)
                                if (cur.disabled !== !0 || "click" !== event.type) {
                                    for (matches = [], i = 0; i < delegateCount; i++) handleObj = handlers[i], sel = handleObj.selector + " ", void 0 === matches[sel] && (matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length), matches[sel] && matches.push(handleObj);
                                    matches.length && handlerQueue.push({
                                        elem: cur,
                                        handlers: matches
                                    })
                                }
                        return delegateCount < handlers.length && handlerQueue.push({
                            elem: this,
                            handlers: handlers.slice(delegateCount)
                        }), handlerQueue
                    },
                    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                    fixHooks: {},
                    keyHooks: {
                        props: "char charCode key keyCode".split(" "),
                        filter: function(event, original) {
                            return null == event.which && (event.which = null != original.charCode ? original.charCode : original.keyCode), event
                        }
                    },
                    mouseHooks: {
                        props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                        filter: function(event, original) {
                            var eventDoc, doc, body, button = original.button;
                            return null == event.pageX && null != original.clientX && (eventDoc = event.target.ownerDocument || document, doc = eventDoc.documentElement, body = eventDoc.body, event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0), event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0)), event.which || void 0 === button || (event.which = 1 & button ? 1 : 2 & button ? 3 : 4 & button ? 2 : 0), event
                        }
                    },
                    fix: function(event) {
                        if (event[jQuery.expando]) return event;
                        var i, prop, copy, type = event.type,
                            originalEvent = event,
                            fixHook = this.fixHooks[type];
                        for (fixHook || (this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {}), copy = fixHook.props ? this.props.concat(fixHook.props) : this.props, event = new jQuery.Event(originalEvent), i = copy.length; i--;) prop = copy[i], event[prop] = originalEvent[prop];
                        return event.target || (event.target = document), 3 === event.target.nodeType && (event.target = event.target.parentNode), fixHook.filter ? fixHook.filter(event, originalEvent) : event
                    },
                    special: {
                        load: {
                            noBubble: !0
                        },
                        focus: {
                            trigger: function() {
                                if (this !== safeActiveElement() && this.focus) return this.focus(), !1
                            },
                            delegateType: "focusin"
                        },
                        blur: {
                            trigger: function() {
                                if (this === safeActiveElement() && this.blur) return this.blur(), !1
                            },
                            delegateType: "focusout"
                        },
                        click: {
                            trigger: function() {
                                if ("checkbox" === this.type && this.click && jQuery.nodeName(this, "input")) return this.click(), !1
                            },
                            _default: function(event) {
                                return jQuery.nodeName(event.target, "a")
                            }
                        },
                        beforeunload: {
                            postDispatch: function(event) {
                                void 0 !== event.result && event.originalEvent && (event.originalEvent.returnValue = event.result)
                            }
                        }
                    },
                    simulate: function(type, elem, event, bubble) {
                        var e = jQuery.extend(new jQuery.Event, event, {
                            type: type,
                            isSimulated: !0,
                            originalEvent: {}
                        });
                        bubble ? jQuery.event.trigger(e, null, elem) : jQuery.event.dispatch.call(elem, e), e.isDefaultPrevented() && event.preventDefault()
                    }
                }, jQuery.removeEvent = function(elem, type, handle) {
                    elem.removeEventListener && elem.removeEventListener(type, handle, !1)
                }, jQuery.Event = function(src, props) {
                    return this instanceof jQuery.Event ? (src && src.type ? (this.originalEvent = src, this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || void 0 === src.defaultPrevented && src.returnValue === !1 ? returnTrue : returnFalse) : this.type = src, props && jQuery.extend(this, props), this.timeStamp = src && src.timeStamp || jQuery.now(), void(this[jQuery.expando] = !0)) : new jQuery.Event(src, props)
                }, jQuery.Event.prototype = {
                    isDefaultPrevented: returnFalse,
                    isPropagationStopped: returnFalse,
                    isImmediatePropagationStopped: returnFalse,
                    preventDefault: function() {
                        var e = this.originalEvent;
                        this.isDefaultPrevented = returnTrue, e && e.preventDefault && e.preventDefault()
                    },
                    stopPropagation: function() {
                        var e = this.originalEvent;
                        this.isPropagationStopped = returnTrue, e && e.stopPropagation && e.stopPropagation()
                    },
                    stopImmediatePropagation: function() {
                        var e = this.originalEvent;
                        this.isImmediatePropagationStopped = returnTrue, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
                    }
                }, jQuery.each({
                    mouseenter: "mouseover",
                    mouseleave: "mouseout",
                    pointerenter: "pointerover",
                    pointerleave: "pointerout"
                }, function(orig, fix) {
                    jQuery.event.special[orig] = {
                        delegateType: fix,
                        bindType: fix,
                        handle: function(event) {
                            var ret, target = this,
                                related = event.relatedTarget,
                                handleObj = event.handleObj;
                            return related && (related === target || jQuery.contains(target, related)) || (event.type = handleObj.origType, ret = handleObj.handler.apply(this, arguments), event.type = fix), ret
                        }
                    }
                }), support.focusinBubbles || jQuery.each({
                    focus: "focusin",
                    blur: "focusout"
                }, function(orig, fix) {
                    var handler = function(event) {
                        jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), !0)
                    };
                    jQuery.event.special[fix] = {
                        setup: function() {
                            var doc = this.ownerDocument || this,
                                attaches = data_priv.access(doc, fix);
                            attaches || doc.addEventListener(orig, handler, !0), data_priv.access(doc, fix, (attaches || 0) + 1)
                        },
                        teardown: function() {
                            var doc = this.ownerDocument || this,
                                attaches = data_priv.access(doc, fix) - 1;
                            attaches ? data_priv.access(doc, fix, attaches) : (doc.removeEventListener(orig, handler, !0), data_priv.remove(doc, fix))
                        }
                    }
                }), jQuery.fn.extend({
                    on: function(types, selector, data, fn, one) {
                        var origFn, type;
                        if ("object" == typeof types) {
                            "string" != typeof selector && (data = data || selector, selector = void 0);
                            for (type in types) this.on(type, selector, data, types[type], one);
                            return this
                        }
                        if (null == data && null == fn ? (fn = selector, data = selector = void 0) : null == fn && ("string" == typeof selector ? (fn = data, data = void 0) : (fn = data, data = selector, selector = void 0)), fn === !1) fn = returnFalse;
                        else if (!fn) return this;
                        return 1 === one && (origFn = fn, fn = function(event) {
                            return jQuery().off(event), origFn.apply(this, arguments)
                        }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++)), this.each(function() {
                            jQuery.event.add(this, types, fn, data, selector)
                        })
                    },
                    one: function(types, selector, data, fn) {
                        return this.on(types, selector, data, fn, 1)
                    },
                    off: function(types, selector, fn) {
                        var handleObj, type;
                        if (types && types.preventDefault && types.handleObj) return handleObj = types.handleObj, jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler), this;
                        if ("object" == typeof types) {
                            for (type in types) this.off(type, selector, types[type]);
                            return this
                        }
                        return selector !== !1 && "function" != typeof selector || (fn = selector, selector = void 0), fn === !1 && (fn = returnFalse), this.each(function() {
                            jQuery.event.remove(this, types, fn, selector)
                        })
                    },
                    trigger: function(type, data) {
                        return this.each(function() {
                            jQuery.event.trigger(type, data, this)
                        })
                    },
                    triggerHandler: function(type, data) {
                        var elem = this[0];
                        if (elem) return jQuery.event.trigger(type, data, elem, !0)
                    }
                });
                var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
                    rtagName = /<([\w:]+)/,
                    rhtml = /<|&#?\w+;/,
                    rnoInnerhtml = /<(?:script|style|link)/i,
                    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
                    rscriptType = /^$|\/(?:java|ecma)script/i,
                    rscriptTypeMasked = /^true\/(.*)/,
                    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
                    wrapMap = {
                        option: [1, "<select multiple='multiple'>", "</select>"],
                        thead: [1, "<table>", "</table>"],
                        col: [2, "<table><colgroup>", "</colgroup></table>"],
                        tr: [2, "<table><tbody>", "</tbody></table>"],
                        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                        _default: [0, "", ""]
                    };
                wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td, jQuery.extend({
                    clone: function(elem, dataAndEvents, deepDataAndEvents) {
                        var i, l, srcElements, destElements, clone = elem.cloneNode(!0),
                            inPage = jQuery.contains(elem.ownerDocument, elem);
                        if (!(support.noCloneChecked || 1 !== elem.nodeType && 11 !== elem.nodeType || jQuery.isXMLDoc(elem)))
                            for (destElements = getAll(clone), srcElements = getAll(elem), i = 0, l = srcElements.length; i < l; i++) fixInput(srcElements[i], destElements[i]);
                        if (dataAndEvents)
                            if (deepDataAndEvents)
                                for (srcElements = srcElements || getAll(elem), destElements = destElements || getAll(clone), i = 0, l = srcElements.length; i < l; i++) cloneCopyEvent(srcElements[i], destElements[i]);
                            else cloneCopyEvent(elem, clone);
                        return destElements = getAll(clone, "script"), destElements.length > 0 && setGlobalEval(destElements, !inPage && getAll(elem, "script")), clone
                    },
                    buildFragment: function(elems, context, scripts, selection) {
                        for (var elem, tmp, tag, wrap, contains, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length; i < l; i++)
                            if (elem = elems[i], elem || 0 === elem)
                                if ("object" === jQuery.type(elem)) jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
                                else if (rhtml.test(elem)) {
                            for (tmp = tmp || fragment.appendChild(context.createElement("div")), tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2], j = wrap[0]; j--;) tmp = tmp.lastChild;
                            jQuery.merge(nodes, tmp.childNodes), tmp = fragment.firstChild, tmp.textContent = ""
                        } else nodes.push(context.createTextNode(elem));
                        for (fragment.textContent = "", i = 0; elem = nodes[i++];)
                            if ((!selection || jQuery.inArray(elem, selection) === -1) && (contains = jQuery.contains(elem.ownerDocument, elem), tmp = getAll(fragment.appendChild(elem), "script"), contains && setGlobalEval(tmp), scripts))
                                for (j = 0; elem = tmp[j++];) rscriptType.test(elem.type || "") && scripts.push(elem);
                        return fragment
                    },
                    cleanData: function(elems) {
                        for (var data, elem, type, key, special = jQuery.event.special, i = 0; void 0 !== (elem = elems[i]); i++) {
                            if (jQuery.acceptData(elem) && (key = elem[data_priv.expando], key && (data = data_priv.cache[key]))) {
                                if (data.events)
                                    for (type in data.events) special[type] ? jQuery.event.remove(elem, type) : jQuery.removeEvent(elem, type, data.handle);
                                data_priv.cache[key] && delete data_priv.cache[key]
                            }
                            delete data_user.cache[elem[data_user.expando]]
                        }
                    }
                }), jQuery.fn.extend({
                    text: function(value) {
                        return access(this, function(value) {
                            return void 0 === value ? jQuery.text(this) : this.empty().each(function() {
                                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = value)
                            })
                        }, null, value, arguments.length)
                    },
                    append: function() {
                        return this.domManip(arguments, function(elem) {
                            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                                var target = manipulationTarget(this, elem);
                                target.appendChild(elem)
                            }
                        })
                    },
                    prepend: function() {
                        return this.domManip(arguments, function(elem) {
                            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                                var target = manipulationTarget(this, elem);
                                target.insertBefore(elem, target.firstChild)
                            }
                        })
                    },
                    before: function() {
                        return this.domManip(arguments, function(elem) {
                            this.parentNode && this.parentNode.insertBefore(elem, this)
                        })
                    },
                    after: function() {
                        return this.domManip(arguments, function(elem) {
                            this.parentNode && this.parentNode.insertBefore(elem, this.nextSibling)
                        })
                    },
                    remove: function(selector, keepData) {
                        for (var elem, elems = selector ? jQuery.filter(selector, this) : this, i = 0; null != (elem = elems[i]); i++) keepData || 1 !== elem.nodeType || jQuery.cleanData(getAll(elem)), elem.parentNode && (keepData && jQuery.contains(elem.ownerDocument, elem) && setGlobalEval(getAll(elem, "script")), elem.parentNode.removeChild(elem));
                        return this
                    },
                    empty: function() {
                        for (var elem, i = 0; null != (elem = this[i]); i++) 1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), elem.textContent = "");
                        return this
                    },
                    clone: function(dataAndEvents, deepDataAndEvents) {
                        return dataAndEvents = null != dataAndEvents && dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, this.map(function() {
                            return jQuery.clone(this, dataAndEvents, deepDataAndEvents)
                        })
                    },
                    html: function(value) {
                        return access(this, function(value) {
                            var elem = this[0] || {},
                                i = 0,
                                l = this.length;
                            if (void 0 === value && 1 === elem.nodeType) return elem.innerHTML;
                            if ("string" == typeof value && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {
                                value = value.replace(rxhtmlTag, "<$1></$2>");
                                try {
                                    for (; i < l; i++) elem = this[i] || {}, 1 === elem.nodeType && (jQuery.cleanData(getAll(elem, !1)), elem.innerHTML = value);
                                    elem = 0
                                } catch (e) {}
                            }
                            elem && this.empty().append(value)
                        }, null, value, arguments.length)
                    },
                    replaceWith: function() {
                        var arg = arguments[0];
                        return this.domManip(arguments, function(elem) {
                            arg = this.parentNode, jQuery.cleanData(getAll(this)), arg && arg.replaceChild(elem, this)
                        }), arg && (arg.length || arg.nodeType) ? this : this.remove()
                    },
                    detach: function(selector) {
                        return this.remove(selector, !0)
                    },
                    domManip: function(args, callback) {
                        args = concat.apply([], args);
                        var fragment, first, scripts, hasScripts, node, doc, i = 0,
                            l = this.length,
                            set = this,
                            iNoClone = l - 1,
                            value = args[0],
                            isFunction = jQuery.isFunction(value);
                        if (isFunction || l > 1 && "string" == typeof value && !support.checkClone && rchecked.test(value)) return this.each(function(index) {
                            var self = set.eq(index);
                            isFunction && (args[0] = value.call(this, index, self.html())), self.domManip(args, callback)
                        });
                        if (l && (fragment = jQuery.buildFragment(args, this[0].ownerDocument, !1, this), first = fragment.firstChild, 1 === fragment.childNodes.length && (fragment = first), first)) {
                            for (scripts = jQuery.map(getAll(fragment, "script"), disableScript), hasScripts = scripts.length; i < l; i++) node = fragment, i !== iNoClone && (node = jQuery.clone(node, !0, !0), hasScripts && jQuery.merge(scripts, getAll(node, "script"))), callback.call(this[i], node, i);
                            if (hasScripts)
                                for (doc = scripts[scripts.length - 1].ownerDocument, jQuery.map(scripts, restoreScript), i = 0; i < hasScripts; i++) node = scripts[i], rscriptType.test(node.type || "") && !data_priv.access(node, "globalEval") && jQuery.contains(doc, node) && (node.src ? jQuery._evalUrl && jQuery._evalUrl(node.src) : jQuery.globalEval(node.textContent.replace(rcleanScript, "")))
                        }
                        return this
                    }
                }), jQuery.each({
                    appendTo: "append",
                    prependTo: "prepend",
                    insertBefore: "before",
                    insertAfter: "after",
                    replaceAll: "replaceWith"
                }, function(name, original) {
                    jQuery.fn[name] = function(selector) {
                        for (var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0; i <= last; i++) elems = i === last ? this : this.clone(!0), jQuery(insert[i])[original](elems), push.apply(ret, elems.get());
                        return this.pushStack(ret)
                    }
                });
                var iframe, elemdisplay = {},
                    rmargin = /^margin/,
                    rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i"),
                    getStyles = function(elem) {
                        return elem.ownerDocument.defaultView.getComputedStyle(elem, null)
                    };
                ! function() {
                    function computePixelPositionAndBoxSizingReliable() {
                        div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", div.innerHTML = "", docElem.appendChild(container);
                        var divStyle = window.getComputedStyle(div, null);
                        pixelPositionVal = "1%" !== divStyle.top, boxSizingReliableVal = "4px" === divStyle.width, docElem.removeChild(container)
                    }
                    var pixelPositionVal, boxSizingReliableVal, docElem = document.documentElement,
                        container = document.createElement("div"),
                        div = document.createElement("div");
                    div.style && (div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", support.clearCloneStyle = "content-box" === div.style.backgroundClip, container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", container.appendChild(div), window.getComputedStyle && jQuery.extend(support, {
                        pixelPosition: function() {
                            return computePixelPositionAndBoxSizingReliable(), pixelPositionVal
                        },
                        boxSizingReliable: function() {
                            return null == boxSizingReliableVal && computePixelPositionAndBoxSizingReliable(), boxSizingReliableVal
                        },
                        reliableMarginRight: function() {
                            var ret, marginDiv = div.appendChild(document.createElement("div"));
                            return marginDiv.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", docElem.appendChild(container), ret = !parseFloat(window.getComputedStyle(marginDiv, null).marginRight), docElem.removeChild(container), ret
                        }
                    }))
                }(), jQuery.swap = function(elem, options, callback, args) {
                    var ret, name, old = {};
                    for (name in options) old[name] = elem.style[name], elem.style[name] = options[name];
                    ret = callback.apply(elem, args || []);
                    for (name in options) elem.style[name] = old[name];
                    return ret
                };
                var rdisplayswap = /^(none|table(?!-c[ea]).+)/,
                    rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"),
                    rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"),
                    cssShow = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    },
                    cssNormalTransform = {
                        letterSpacing: "0",
                        fontWeight: "400"
                    },
                    cssPrefixes = ["Webkit", "O", "Moz", "ms"];
                jQuery.extend({
                        cssHooks: {
                            opacity: {
                                get: function(elem, computed) {
                                    if (computed) {
                                        var ret = curCSS(elem, "opacity");
                                        return "" === ret ? "1" : ret
                                    }
                                }
                            }
                        },
                        cssNumber: {
                            columnCount: !0,
                            fillOpacity: !0,
                            flexGrow: !0,
                            flexShrink: !0,
                            fontWeight: !0,
                            lineHeight: !0,
                            opacity: !0,
                            order: !0,
                            orphans: !0,
                            widows: !0,
                            zIndex: !0,
                            zoom: !0
                        },
                        cssProps: {
                            float: "cssFloat"
                        },
                        style: function(elem, name, value, extra) {
                            if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
                                var ret, type, hooks, origName = jQuery.camelCase(name),
                                    style = elem.style;
                                return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName)), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], void 0 === value ? hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, !1, extra)) ? ret : style[name] : (type = typeof value, "string" === type && (ret = rrelNum.exec(value)) && (value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name)), type = "number"), null != value && value === value && ("number" !== type || jQuery.cssNumber[origName] || (value += "px"), support.clearCloneStyle || "" !== value || 0 !== name.indexOf("background") || (style[name] = "inherit"), hooks && "set" in hooks && void 0 === (value = hooks.set(elem, value, extra)) || (style[name] = value)), void 0)
                            }
                        },
                        css: function(elem, name, extra, styles) {
                            var val, num, hooks, origName = jQuery.camelCase(name);
                            return name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName)), hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName], hooks && "get" in hooks && (val = hooks.get(elem, !0, extra)), void 0 === val && (val = curCSS(elem, name, styles)), "normal" === val && name in cssNormalTransform && (val = cssNormalTransform[name]), "" === extra || extra ? (num = parseFloat(val), extra === !0 || jQuery.isNumeric(num) ? num || 0 : val) : val
                        }
                    }), jQuery.each(["height", "width"], function(i, name) {
                        jQuery.cssHooks[name] = {
                            get: function(elem, computed, extra) {
                                if (computed) return rdisplayswap.test(jQuery.css(elem, "display")) && 0 === elem.offsetWidth ? jQuery.swap(elem, cssShow, function() {
                                    return getWidthOrHeight(elem, name, extra)
                                }) : getWidthOrHeight(elem, name, extra)
                            },
                            set: function(elem, value, extra) {
                                var styles = extra && getStyles(elem);
                                return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, "border-box" === jQuery.css(elem, "boxSizing", !1, styles), styles) : 0)
                            }
                        }
                    }), jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(elem, computed) {
                        if (computed) return jQuery.swap(elem, {
                            display: "inline-block"
                        }, curCSS, [elem, "marginRight"])
                    }), jQuery.each({
                        margin: "",
                        padding: "",
                        border: "Width"
                    }, function(prefix, suffix) {
                        jQuery.cssHooks[prefix + suffix] = {
                            expand: function(value) {
                                for (var i = 0, expanded = {}, parts = "string" == typeof value ? value.split(" ") : [value]; i < 4; i++) expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                                return expanded
                            }
                        }, rmargin.test(prefix) || (jQuery.cssHooks[prefix + suffix].set = setPositiveNumber)
                    }), jQuery.fn.extend({
                        css: function(name, value) {
                            return access(this, function(elem, name, value) {
                                var styles, len, map = {},
                                    i = 0;
                                if (jQuery.isArray(name)) {
                                    for (styles = getStyles(elem), len = name.length; i < len; i++) map[name[i]] = jQuery.css(elem, name[i], !1, styles);
                                    return map
                                }
                                return void 0 !== value ? jQuery.style(elem, name, value) : jQuery.css(elem, name)
                            }, name, value, arguments.length > 1)
                        },
                        show: function() {
                            return showHide(this, !0)
                        },
                        hide: function() {
                            return showHide(this)
                        },
                        toggle: function(state) {
                            return "boolean" == typeof state ? state ? this.show() : this.hide() : this.each(function() {
                                isHidden(this) ? jQuery(this).show() : jQuery(this).hide()
                            })
                        }
                    }), jQuery.fn.delay = function(time, type) {
                        return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", this.queue(type, function(next, hooks) {
                            var timeout = setTimeout(next, time);
                            hooks.stop = function() {
                                clearTimeout(timeout)
                            }
                        })
                    },
                    function() {
                        var input = document.createElement("input"),
                            select = document.createElement("select"),
                            opt = select.appendChild(document.createElement("option"));
                        input.type = "checkbox", support.checkOn = "" !== input.value, support.optSelected = opt.selected, select.disabled = !0, support.optDisabled = !opt.disabled, input = document.createElement("input"), input.value = "t", input.type = "radio", support.radioValue = "t" === input.value
                    }();
                var nodeHook, boolHook, attrHandle = jQuery.expr.attrHandle;
                jQuery.fn.extend({
                    attr: function(name, value) {
                        return access(this, jQuery.attr, name, value, arguments.length > 1)
                    },
                    removeAttr: function(name) {
                        return this.each(function() {
                            jQuery.removeAttr(this, name)
                        })
                    }
                }), jQuery.extend({
                    attr: function(elem, name, value) {
                        var hooks, ret, nType = elem.nodeType;
                        if (elem && 3 !== nType && 8 !== nType && 2 !== nType) return typeof elem.getAttribute === strundefined ? jQuery.prop(elem, name, value) : (1 === nType && jQuery.isXMLDoc(elem) || (name = name.toLowerCase(), hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook)), void 0 === value ? hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : (ret = jQuery.find.attr(elem, name), null == ret ? void 0 : ret) : null !== value ? hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : (elem.setAttribute(name, value + ""), value) : void jQuery.removeAttr(elem, name))
                    },
                    removeAttr: function(elem, value) {
                        var name, propName, i = 0,
                            attrNames = value && value.match(rnotwhite);
                        if (attrNames && 1 === elem.nodeType)
                            for (; name = attrNames[i++];) propName = jQuery.propFix[name] || name, jQuery.expr.match.bool.test(name) && (elem[propName] = !1), elem.removeAttribute(name)
                    },
                    attrHooks: {
                        type: {
                            set: function(elem, value) {
                                if (!support.radioValue && "radio" === value && jQuery.nodeName(elem, "input")) {
                                    var val = elem.value;
                                    return elem.setAttribute("type", value), val && (elem.value = val), value
                                }
                            }
                        }
                    }
                }), boolHook = {
                    set: function(elem, value, name) {
                        return value === !1 ? jQuery.removeAttr(elem, name) : elem.setAttribute(name, name), name
                    }
                }, jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
                    var getter = attrHandle[name] || jQuery.find.attr;
                    attrHandle[name] = function(elem, name, isXML) {
                        var ret, handle;
                        return isXML || (handle = attrHandle[name], attrHandle[name] = ret, ret = null != getter(elem, name, isXML) ? name.toLowerCase() : null, attrHandle[name] = handle), ret
                    }
                });
                var rfocusable = /^(?:input|select|textarea|button)$/i;
                jQuery.fn.extend({
                    prop: function(name, value) {
                        return access(this, jQuery.prop, name, value, arguments.length > 1)
                    },
                    removeProp: function(name) {
                        return this.each(function() {
                            delete this[jQuery.propFix[name] || name]
                        })
                    }
                }), jQuery.extend({
                    propFix: {
                        for: "htmlFor",
                        class: "className"
                    },
                    prop: function(elem, name, value) {
                        var ret, hooks, notxml, nType = elem.nodeType;
                        if (elem && 3 !== nType && 8 !== nType && 2 !== nType) return notxml = 1 !== nType || !jQuery.isXMLDoc(elem), notxml && (name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name]), void 0 !== value ? hooks && "set" in hooks && void 0 !== (ret = hooks.set(elem, value, name)) ? ret : elem[name] = value : hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)) ? ret : elem[name]
                    },
                    propHooks: {
                        tabIndex: {
                            get: function(elem) {
                                return elem.hasAttribute("tabindex") || rfocusable.test(elem.nodeName) || elem.href ? elem.tabIndex : -1
                            }
                        }
                    }
                }), support.optSelected || (jQuery.propHooks.selected = {
                    get: function(elem) {
                        var parent = elem.parentNode;
                        return parent && parent.parentNode && parent.parentNode.selectedIndex, null
                    }
                }), jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
                    jQuery.propFix[this.toLowerCase()] = this
                });
                var rclass = /[\t\r\n\f]/g;
                jQuery.fn.extend({
                    addClass: function(value) {
                        var classes, elem, cur, clazz, j, finalValue, proceed = "string" == typeof value && value,
                            i = 0,
                            len = this.length;
                        if (jQuery.isFunction(value)) return this.each(function(j) {
                            jQuery(this).addClass(value.call(this, j, this.className))
                        });
                        if (proceed)
                            for (classes = (value || "").match(rnotwhite) || []; i < len; i++)
                                if (elem = this[i], cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ")) {
                                    for (j = 0; clazz = classes[j++];) cur.indexOf(" " + clazz + " ") < 0 && (cur += clazz + " ");
                                    finalValue = jQuery.trim(cur), elem.className !== finalValue && (elem.className = finalValue)
                                }
                        return this
                    },
                    removeClass: function(value) {
                        var classes, elem, cur, clazz, j, finalValue, proceed = 0 === arguments.length || "string" == typeof value && value,
                            i = 0,
                            len = this.length;
                        if (jQuery.isFunction(value)) return this.each(function(j) {
                            jQuery(this).removeClass(value.call(this, j, this.className))
                        });
                        if (proceed)
                            for (classes = (value || "").match(rnotwhite) || []; i < len; i++)
                                if (elem = this[i], cur = 1 === elem.nodeType && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "")) {
                                    for (j = 0; clazz = classes[j++];)
                                        for (; cur.indexOf(" " + clazz + " ") >= 0;) cur = cur.replace(" " + clazz + " ", " ");
                                    finalValue = value ? jQuery.trim(cur) : "", elem.className !== finalValue && (elem.className = finalValue)
                                }
                        return this
                    },
                    toggleClass: function(value, stateVal) {
                        var type = typeof value;
                        return "boolean" == typeof stateVal && "string" === type ? stateVal ? this.addClass(value) : this.removeClass(value) : jQuery.isFunction(value) ? this.each(function(i) {
                            jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal)
                        }) : this.each(function() {
                            if ("string" === type)
                                for (var className, i = 0, self = jQuery(this), classNames = value.match(rnotwhite) || []; className = classNames[i++];) self.hasClass(className) ? self.removeClass(className) : self.addClass(className);
                            else type !== strundefined && "boolean" !== type || (this.className && data_priv.set(this, "__className__", this.className), this.className = this.className || value === !1 ? "" : data_priv.get(this, "__className__") || "")
                        })
                    },
                    hasClass: function(selector) {
                        for (var className = " " + selector + " ", i = 0, l = this.length; i < l; i++)
                            if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) return !0;
                        return !1
                    }
                });
                var rreturn = /\r/g;
                jQuery.fn.extend({
                    val: function(value) {
                        var hooks, ret, isFunction, elem = this[0]; {
                            if (arguments.length) return isFunction = jQuery.isFunction(value), this.each(function(i) {
                                var val;
                                1 === this.nodeType && (val = isFunction ? value.call(this, i, jQuery(this).val()) : value, null == val ? val = "" : "number" == typeof val ? val += "" : jQuery.isArray(val) && (val = jQuery.map(val, function(value) {
                                    return null == value ? "" : value + ""
                                })), hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()], hooks && "set" in hooks && void 0 !== hooks.set(this, val, "value") || (this.value = val))
                            });
                            if (elem) return hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()], hooks && "get" in hooks && void 0 !== (ret = hooks.get(elem, "value")) ? ret : (ret = elem.value, "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret)
                        }
                    }
                }), jQuery.extend({
                    valHooks: {
                        option: {
                            get: function(elem) {
                                var val = jQuery.find.attr(elem, "value");
                                return null != val ? val : jQuery.trim(jQuery.text(elem))
                            }
                        },
                        select: {
                            get: function(elem) {
                                for (var value, option, options = elem.options, index = elem.selectedIndex, one = "select-one" === elem.type || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0; i < max; i++)
                                    if (option = options[i], (option.selected || i === index) && (support.optDisabled ? !option.disabled : null === option.getAttribute("disabled")) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
                                        if (value = jQuery(option).val(), one) return value;
                                        values.push(value)
                                    }
                                return values
                            },
                            set: function(elem, value) {
                                for (var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length; i--;) option = options[i], (option.selected = jQuery.inArray(option.value, values) >= 0) && (optionSet = !0);
                                return optionSet || (elem.selectedIndex = -1), values
                            }
                        }
                    }
                }), jQuery.each(["radio", "checkbox"], function() {
                    jQuery.valHooks[this] = {
                        set: function(elem, value) {
                            if (jQuery.isArray(value)) return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0
                        }
                    }, support.checkOn || (jQuery.valHooks[this].get = function(elem) {
                        return null === elem.getAttribute("value") ? "on" : elem.value
                    })
                }), jQuery.expr.filters.hidden = function(elem) {
                    return elem.offsetWidth <= 0 && elem.offsetHeight <= 0
                }, jQuery.expr.filters.visible = function(elem) {
                    return !jQuery.expr.filters.hidden(elem)
                };
                var r20 = /%20/g,
                    rbracket = /\[\]$/,
                    rCRLF = /\r?\n/g,
                    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
                    rsubmittable = /^(?:input|select|textarea|keygen)/i;
                jQuery.param = function(a, traditional) {
                    var prefix, s = [],
                        add = function(key, value) {
                            value = jQuery.isFunction(value) ? value() : null == value ? "" : value, s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value)
                        };
                    if (void 0 === traditional && (traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional), jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) jQuery.each(a, function() {
                        add(this.name, this.value)
                    });
                    else
                        for (prefix in a) buildParams(prefix, a[prefix], traditional, add);
                    return s.join("&").replace(r20, "+")
                }, jQuery.fn.extend({
                    serialize: function() {
                        return jQuery.param(this.serializeArray())
                    },
                    serializeArray: function() {
                        return this.map(function() {
                            var elements = jQuery.prop(this, "elements");
                            return elements ? jQuery.makeArray(elements) : this
                        }).filter(function() {
                            var type = this.type;
                            return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type))
                        }).map(function(i, elem) {
                            var val = jQuery(this).val();
                            return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
                                return {
                                    name: elem.name,
                                    value: val.replace(rCRLF, "\r\n")
                                }
                            }) : {
                                name: elem.name,
                                value: val.replace(rCRLF, "\r\n")
                            }
                        }).get()
                    }
                }), jQuery.parseHTML = function(data, context, keepScripts) {
                    if (!data || "string" != typeof data) return null;
                    "boolean" == typeof context && (keepScripts = context, context = !1), context = context || document;
                    var parsed = rsingleTag.exec(data),
                        scripts = !keepScripts && [];
                    return parsed ? [context.createElement(parsed[1])] : (parsed = jQuery.buildFragment([data], context, scripts), scripts && scripts.length && jQuery(scripts).remove(), jQuery.merge([], parsed.childNodes))
                };
                var docElem = window.document.documentElement;
                return jQuery.offset = {
                    setOffset: function(elem, options, i) {
                        var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"),
                            curElem = jQuery(elem),
                            props = {};
                        "static" === position && (elem.style.position = "relative"), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = ("absolute" === position || "fixed" === position) && (curCSSTop + curCSSLeft).indexOf("auto") > -1, calculatePosition ? (curPosition = curElem.position(), curTop = curPosition.top, curLeft = curPosition.left) : (curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0), jQuery.isFunction(options) && (options = options.call(elem, i, curOffset)), null != options.top && (props.top = options.top - curOffset.top + curTop), null != options.left && (props.left = options.left - curOffset.left + curLeft), "using" in options ? options.using.call(elem, props) : curElem.css(props)
                    }
                }, jQuery.fn.extend({
                    offset: function(options) {
                        if (arguments.length) return void 0 === options ? this : this.each(function(i) {
                            jQuery.offset.setOffset(this, options, i)
                        });
                        var docElem, win, elem = this[0],
                            box = {
                                top: 0,
                                left: 0
                            },
                            doc = elem && elem.ownerDocument;
                        if (doc) return docElem = doc.documentElement, jQuery.contains(docElem, elem) ? (typeof elem.getBoundingClientRect !== strundefined && (box = elem.getBoundingClientRect()), win = getWindow(doc), {
                            top: box.top + win.pageYOffset - docElem.clientTop,
                            left: box.left + win.pageXOffset - docElem.clientLeft
                        }) : box
                    },
                    position: function() {
                        if (this[0]) {
                            var offsetParent, offset, elem = this[0],
                                parentOffset = {
                                    top: 0,
                                    left: 0
                                };
                            return "fixed" === jQuery.css(elem, "position") ? offset = elem.getBoundingClientRect() : (offsetParent = this.offsetParent(), offset = this.offset(), jQuery.nodeName(offsetParent[0], "html") || (parentOffset = offsetParent.offset()), parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", !0), parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", !0)), {
                                top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", !0),
                                left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", !0)
                            }
                        }
                    },
                    offsetParent: function() {
                        return this.map(function() {
                            for (var offsetParent = this.offsetParent || docElem; offsetParent && !jQuery.nodeName(offsetParent, "html") && "static" === jQuery.css(offsetParent, "position");) offsetParent = offsetParent.offsetParent;
                            return offsetParent || docElem
                        })
                    }
                }), jQuery.each({
                    scrollLeft: "pageXOffset",
                    scrollTop: "pageYOffset"
                }, function(method, prop) {
                    var top = "pageYOffset" === prop;
                    jQuery.fn[method] = function(val) {
                        return access(this, function(elem, method, val) {
                            var win = getWindow(elem);
                            return void 0 === val ? win ? win[prop] : elem[method] : void(win ? win.scrollTo(top ? window.pageXOffset : val, top ? val : window.pageYOffset) : elem[method] = val)
                        }, method, val, arguments.length, null)
                    }
                }), jQuery.each(["top", "left"], function(i, prop) {
                    jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, computed) {
                        if (computed) return computed = curCSS(elem, prop), rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed
                    })
                }), jQuery.each({
                    Height: "height",
                    Width: "width"
                }, function(name, type) {
                    jQuery.each({
                        padding: "inner" + name,
                        content: type,
                        "": "outer" + name
                    }, function(defaultExtra, funcName) {
                        jQuery.fn[funcName] = function(margin, value) {
                            var chainable = arguments.length && (defaultExtra || "boolean" != typeof margin),
                                extra = defaultExtra || (margin === !0 || value === !0 ? "margin" : "border");
                            return access(this, function(elem, type, value) {
                                var doc;
                                return jQuery.isWindow(elem) ? elem.document.documentElement["client" + name] : 9 === elem.nodeType ? (doc = elem.documentElement, Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name])) : void 0 === value ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra)
                            }, type, chainable ? margin : void 0, chainable, null)
                        }
                    })
                }), "function" == typeof define && define.amd && define("jquery", [], function() {
                    return jQuery
                }), jQuery.noConflict = function() {}, jQuery
            }),
            function() {
                define("utils/options", ["jquery", "underscore"], function($, _) {
                    var appcuesId, getGlobalOptions, getInlineOptions;
                    return appcuesId = "17221", /^APPCUES_{1}PLACEHOLDER_{1}ID$/.test(appcuesId) && (appcuesId = null), getGlobalOptions = function() {
                            var globalOptions, i, k, keys, len;
                            for (globalOptions = {}, keys = ["AppcuesConfig", "AppcuesIdentity"], i = 0, len = keys.length; i < len; i++)
                                if (k = keys[i], _.isObject(window[k])) {
                                    globalOptions = window[k];
                                    break
                                }
                            return globalOptions
                        }, getInlineOptions = function() {
                            var $script, i, isAppcuesScript, len, options, ref, script;
                            if (options = {}, $script = $("#appcues-script"), !$script.length)
                                if (isAppcuesScript = function(el) {
                                        return /appcues/i.test(el.getAttribute("src"))
                                    }, script = document.scripts[document.scripts.length - 1], isAppcuesScript(script)) $script = $(script);
                                else
                                    for (ref = document.scripts, i = 0, len = ref.length; i < len; i++)
                                        if (script = ref[i], isAppcuesScript(script)) {
                                            $script = $(script);
                                            break
                                        }
                            return $script.length && _.extend(options, $script.data()), options
                        },
                        function(options) {
                            return null == options && (options = {}), _.extend({
                                appcuesId: appcuesId
                            }, options, getGlobalOptions(), getInlineOptions())
                        }
                })
            }.call(this),
            function() {
                define("utils/logger", ["underscore"], function(_) {
                    var e, fn1, hasConsole, hasStorage, i, len, logger, m, ref, storage, testKey;
                    hasConsole = !!window.console, hasStorage = !1;
                    try {
                        testKey = "__ss-check__", storage = window.sessionStorage, storage.setItem(testKey, testKey), storage.getItem(testKey) === testKey && (hasStorage = !0), storage.removeItem(testKey)
                    } catch (_error) {
                        e = _error, hasStorage = !1
                    }
                    for (logger = {
                            isEnabled: !1,
                            storageKey: "logging_enabled",
                            _methods: ["log", "warn", "error"],
                            enable: function() {
                                return this.isEnabled = !0, hasStorage ? storage.setItem(this.storageKey, !0) : this.log("Your browser does not support sessionStorage, so the debug state will not be preserved upon navigation"), this.isEnabled
                            },
                            disable: function() {
                                return this.isEnabled = !1, hasStorage && storage.removeItem(this.storageKey), this.isEnabled
                            }
                        }, hasStorage && (logger.isEnabled = null != storage.getItem(logger.storageKey)), ref = logger._methods, fn1 = function(m) {
                            var fn;
                            return hasConsole && logger.isEnabled && (fn = window.console[m]) ? _.isFunction(fn) && (fn = _.bind(fn, window.console)) : fn = function() {}, logger[m] = fn
                        }, i = 0, len = ref.length; i < len; i++) m = ref[i], fn1(m);
                    return logger
                })
            }.call(this),
            function() {
                var slice = [].slice;
                define("utils/events", ["underscore"], function(_) {
                    var Events, eventSplitter, eventsApi, triggerEvents;
                    return Events = {
                        on: function(name, callback, context) {
                            var events;
                            return eventsApi(this, "on", name, [callback, context]) && callback ? (null == this._events && (this._events = {}), events = this._events[name] || (this._events[name] = []), events.push({
                                callback: callback,
                                context: context,
                                ctx: context || this
                            }), this) : this
                        },
                        off: function(name, callback, context) {
                            var ev, events, i, j, k, len, len1, names, retain;
                            if (!this._events || !eventsApi(this, "off", name, [callback, context])) return this;
                            if (!name && !callback && !context) return this._events = {}, this;
                            for (i = 0, names = name ? [name] : _.keys(this._events), j = 0, len = names.length; j < len; j++)
                                if (name = names[j], events = this._events[name]) {
                                    if (this._events[name] = retain = [], callback || context)
                                        for (k = 0, len1 = events.length; k < len1; k++) ev = events[k], (callback && callback !== ev.callback && callback !== ev.callback._callback || context && context !== ev.context) && retain.push(ev);
                                    retain.length || delete this._events[name]
                                }
                            return this
                        },
                        trigger: function() {
                            var allEvents, args, events, name;
                            return name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [], this._events && eventsApi(this, "trigger", name, args) ? (events = this._events[name], allEvents = this._events.all, events && triggerEvents(events, args), allEvents && triggerEvents(allEvents, arguments), this) : this
                        }
                    }, eventSplitter = /\s+/, eventsApi = function(obj, action, name, rest) {
                        var j, key, len, names;
                        if (!name) return !0;
                        if ("object" == typeof name) {
                            for (key in name) obj[action].apply(obj, [key, name[key]].concat(rest));
                            return !1
                        }
                        if (eventSplitter.test(name)) {
                            for (names = name.split(eventSplitter), j = 0, len = names.length; j < len; j++) name = names[j], obj[action].apply(obj, [name].concat(rest));
                            return !1
                        }
                        return !0
                    }, triggerEvents = function(events, args) {
                        var a1, a2, a3, ev, i, l, results;
                        switch (i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2], args.length) {
                            case 0:
                                for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx);
                                break;
                            case 1:
                                for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1);
                                break;
                            case 2:
                                for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1, a2);
                                break;
                            case 3:
                                for (; ++i < l;)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                                break;
                            default:
                                for (results = []; ++i < l;) results.push((ev = events[i]).callback.apply(ev.ctx, args));
                                return results
                        }
                    }, Events
                })
            }.call(this),
            function() {
                define("eventbus", ["underscore", "utils/events"], function(_, Events) {
                    var EventBus;
                    return EventBus = _.extend({
                        emit: function(eventId, eventData) {
                            return this.trigger(eventId, eventData, this.getUser())
                        },
                        getUser: function() {
                            return {}
                        }
                    }, Events)
                })
            }.call(this),
            function() {
                define("utils/diff", ["underscore"], function(_) {
                    return function(a, b) {
                        var attrs, isEqual, k, val;
                        isEqual = !0, attrs = {};
                        for (k in b) val = b[k], _.isEqual(b[k], a[k]) || (isEqual = !1, attrs[k] = val);
                        return !isEqual && attrs
                    }
                })
            }.call(this),
            function() {
                define("models/settings", ["underscore", "utils/events", "utils/logger", "utils/diff"], function(_, Events, logger, diff) {
                    var Settings, settings;
                    return Settings = function() {
                        function Settings() {
                            this.attributes = {
                                disableHooks: !1
                            }
                        }
                        return Settings.prototype.get = function(key) {
                            var data;
                            return data = _.clone(this.attributes), key ? data[key] : data
                        }, Settings.prototype.set = function(data, options) {
                            var prev;
                            if (null == options && (options = {}), prev = _.clone(this.attributes), _.isObject(data) && !_.isArray(data)) return options.replace ? this.attributes = data : _.extend(this.attributes, data)
                        }, Settings.prototype.isValid = function(attrs) {
                            return null == attrs && (attrs = _.clone(this.attributes)), !(!_.isObject(attrs) || !attrs.appcuesId)
                        }, Settings
                    }(), _.extend(Settings.prototype, Events), settings = new Settings, settings.Settings = Settings, settings
                })
            }.call(this), ! function(name, context, definition) {
                "undefined" != typeof module && module.exports ? module.exports = definition() : "function" == typeof define && define.amd ? define("reqwest", definition) : context[name] = definition()
            }("reqwest", this, function() {
                function succeed(r) {
                    var protocol = protocolRe.exec(r.url);
                    return protocol = protocol && protocol[1] || window.location.protocol, httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response
                }

                function handleReadyState(r, success, error) {
                    return function() {
                        return r._aborted ? error(r.request) : r._timedOut ? error(r.request, "Request is aborted: timeout") : void(r.request && 4 == r.request[readyState] && (r.request.onreadystatechange = noop, succeed(r) ? success(r.request) : error(r.request)))
                    }
                }

                function setHeaders(http, o) {
                    var h, headers = o.headers || {};
                    headers.Accept = headers.Accept || defaultHeaders.accept[o.type] || defaultHeaders.accept["*"];
                    var isAFormData = "function" == typeof FormData && o.data instanceof FormData;
                    o.crossOrigin || headers[requestedWith] || (headers[requestedWith] = defaultHeaders.requestedWith), headers[contentType] || isAFormData || (headers[contentType] = o.contentType || defaultHeaders.contentType);
                    for (h in headers) headers.hasOwnProperty(h) && "setRequestHeader" in http && http.setRequestHeader(h, headers[h])
                }

                function setCredentials(http, o) {
                    "undefined" != typeof o.withCredentials && "undefined" != typeof http.withCredentials && (http.withCredentials = !!o.withCredentials)
                }

                function generalCallback(data) {
                    lastValue = data
                }

                function urlappend(url, s) {
                    return url + (/\?/.test(url) ? "&" : "?") + s
                }

                function handleJsonp(o, fn, err, url) {
                    var reqId = uniqid++,
                        cbkey = o.jsonpCallback || "callback",
                        cbval = o.jsonpCallbackName || reqwest.getcallbackPrefix(reqId),
                        cbreg = new RegExp("((^|\\?|&)" + cbkey + ")=([^&]+)"),
                        match = url.match(cbreg),
                        script = doc.createElement("script"),
                        loaded = 0,
                        isIE10 = navigator.userAgent.indexOf("MSIE 10.0") !== -1;
                    return match ? "?" === match[3] ? url = url.replace(cbreg, "$1=" + cbval) : cbval = match[3] : url = urlappend(url, cbkey + "=" + cbval), win[cbval] = generalCallback, script.type = "text/javascript", script.src = url, script.async = !0, "undefined" == typeof script.onreadystatechange || isIE10 || (script.htmlFor = script.id = "_reqwest_" + reqId), script.onload = script.onreadystatechange = function() {
                        return !(script[readyState] && "complete" !== script[readyState] && "loaded" !== script[readyState] || loaded) && (script.onload = script.onreadystatechange = null, script.onclick && script.onclick(), fn(lastValue), lastValue = void 0, head.removeChild(script), void(loaded = 1))
                    }, head.appendChild(script), {
                        abort: function() {
                            script.onload = script.onreadystatechange = null, err({}, "Request is aborted: timeout", {}), lastValue = void 0, head.removeChild(script), loaded = 1
                        }
                    }
                }

                function getRequest(fn, err) {
                    var http, o = this.o,
                        method = (o.method || "GET").toUpperCase(),
                        url = "string" == typeof o ? o : o.url,
                        data = o.processData !== !1 && o.data && "string" != typeof o.data ? reqwest.toQueryString(o.data) : o.data || null,
                        sendWait = !1;
                    return "jsonp" != o.type && "GET" != method || !data || (url = urlappend(url, data), data = null), "jsonp" == o.type ? handleJsonp(o, fn, err, url) : (http = o.xhr && o.xhr(o) || xhr(o), http.open(method, url, o.async !== !1), setHeaders(http, o), setCredentials(http, o), win[xDomainRequest] && http instanceof win[xDomainRequest] ? (http.onload = fn, http.onerror = err, http.onprogress = function() {}, sendWait = !0) : http.onreadystatechange = handleReadyState(this, fn, err), o.before && o.before(http), sendWait ? setTimeout(function() {
                        http.send(data)
                    }, 200) : http.send(data), http)
                }

                function Reqwest(o, fn) {
                    this.o = o, this.fn = fn, init.apply(this, arguments)
                }

                function setType(header) {
                    return header.match("json") ? "json" : header.match("javascript") ? "js" : header.match("text") ? "html" : header.match("xml") ? "xml" : void 0
                }

                function init(o, fn) {
                    function complete(resp) {
                        for (o.timeout && clearTimeout(self.timeout), self.timeout = null; self._completeHandlers.length > 0;) self._completeHandlers.shift()(resp)
                    }

                    function success(resp) {
                        var type = o.type || resp && setType(resp.getResponseHeader("Content-Type"));
                        resp = "jsonp" !== type ? self.request : resp;
                        var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type),
                            r = filteredResponse;
                        try {
                            resp.responseText = r
                        } catch (e) {}
                        if (r) switch (type) {
                            case "json":
                                try {
                                    resp = win.JSON ? win.JSON.parse(r) : eval("(" + r + ")")
                                } catch (err) {
                                    return error(resp, "Could not parse JSON in response", err)
                                }
                                break;
                            case "js":
                                resp = eval(r);
                                break;
                            case "html":
                                resp = r;
                                break;
                            case "xml":
                                resp = resp.responseXML && resp.responseXML.parseError && resp.responseXML.parseError.errorCode && resp.responseXML.parseError.reason ? null : resp.responseXML
                        }
                        for (self._responseArgs.resp = resp, self._fulfilled = !0, fn(resp), self._successHandler(resp); self._fulfillmentHandlers.length > 0;) resp = self._fulfillmentHandlers.shift()(resp);
                        complete(resp)
                    }

                    function timedOut() {
                        self._timedOut = !0, self.request.abort()
                    }

                    function error(resp, msg, t) {
                        for (resp = self.request, self._responseArgs.resp = resp, self._responseArgs.msg = msg, self._responseArgs.t = t, self._erred = !0; self._errorHandlers.length > 0;) self._errorHandlers.shift()(resp, msg, t);
                        complete(resp)
                    }
                    this.url = "string" == typeof o ? o : o.url, this.timeout = null, this._fulfilled = !1, this._successHandler = function() {}, this._fulfillmentHandlers = [], this._errorHandlers = [], this._completeHandlers = [], this._erred = !1, this._responseArgs = {};
                    var self = this;
                    fn = fn || function() {}, o.timeout && (this.timeout = setTimeout(function() {
                        timedOut()
                    }, o.timeout)), o.success && (this._successHandler = function() {
                        o.success.apply(o, arguments)
                    }), o.error && this._errorHandlers.push(function() {
                        o.error.apply(o, arguments)
                    }), o.complete && this._completeHandlers.push(function() {
                        o.complete.apply(o, arguments)
                    }), this.request = getRequest.call(this, success, error)
                }

                function reqwest(o, fn) {
                    return new Reqwest(o, fn)
                }

                function buildParams(prefix, obj, traditional, add) {
                    var name, i, v, rbracket = /\[\]$/;
                    if (isArray(obj))
                        for (i = 0; obj && i < obj.length; i++) v = obj[i], traditional || rbracket.test(prefix) ? add(prefix, v) : buildParams(prefix + "[" + ("object" == typeof v ? i : "") + "]", v, traditional, add);
                    else if (obj && "[object Object]" === obj.toString())
                        for (name in obj) buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
                    else add(prefix, obj)
                }
                var win = window,
                    doc = document,
                    httpsRe = /^http/,
                    protocolRe = /(^\w+):\/\//,
                    twoHundo = /^(20\d|1223)$/,
                    byTag = "getElementsByTagName",
                    readyState = "readyState",
                    contentType = "Content-Type",
                    requestedWith = "X-Requested-With",
                    head = doc[byTag]("head")[0],
                    uniqid = 0,
                    callbackPrefix = "reqwest_" + +new Date,
                    lastValue, xmlHttpRequest = "XMLHttpRequest",
                    xDomainRequest = "XDomainRequest",
                    noop = function() {},
                    isArray = "function" == typeof Array.isArray ? Array.isArray : function(a) {
                        return a instanceof Array
                    },
                    defaultHeaders = {
                        contentType: "application/x-www-form-urlencoded",
                        requestedWith: xmlHttpRequest,
                        accept: {
                            "*": "text/javascript, text/html, application/xml, text/xml, */*",
                            xml: "application/xml, text/xml",
                            html: "text/html",
                            text: "text/plain",
                            json: "application/json, text/javascript",
                            js: "application/javascript, text/javascript"
                        }
                    },
                    xhr = function(o) {
                        if (o.crossOrigin === !0) {
                            var xhr = win[xmlHttpRequest] ? new XMLHttpRequest : null;
                            if (xhr && "withCredentials" in xhr) return xhr;
                            if (win[xDomainRequest]) return new XDomainRequest;
                            throw new Error("Browser does not support cross-origin requests")
                        }
                        return win[xmlHttpRequest] ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")
                    },
                    globalSetupOptions = {
                        dataFilter: function(data) {
                            return data
                        }
                    };
                return Reqwest.prototype = {
                    abort: function() {
                        this._aborted = !0, this.request.abort()
                    },
                    retry: function() {
                        init.call(this, this.o, this.fn)
                    },
                    then: function(success, fail) {
                        return success = success || function() {}, fail = fail || function() {}, this._fulfilled ? this._responseArgs.resp = success(this._responseArgs.resp) : this._erred ? fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t) : (this._fulfillmentHandlers.push(success), this._errorHandlers.push(fail)), this
                    },
                    always: function(fn) {
                        return this._fulfilled || this._erred ? fn(this._responseArgs.resp) : this._completeHandlers.push(fn), this
                    },
                    finally: function(fn) {
                        return this.always(fn)
                    },
                    fail: function(fn) {
                        return this._erred ? fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t) : this._errorHandlers.push(fn), this
                    },
                    catch: function(fn) {
                        return this.fail(fn)
                    }
                }, reqwest.toQueryString = function(o, trad) {
                    var prefix, i, traditional = trad || !1,
                        s = [],
                        enc = encodeURIComponent,
                        add = function(key, value) {
                            value = "function" == typeof value ? value() : null == value ? "" : value, s[s.length] = enc(key) + "=" + enc(value)
                        };
                    if (isArray(o))
                        for (i = 0; o && i < o.length; i++) add(o[i].name, o[i].value);
                    else
                        for (prefix in o) o.hasOwnProperty(prefix) && buildParams(prefix, o[prefix], traditional, add);
                    return s.join("&").replace(/%20/g, "+")
                }, reqwest.getcallbackPrefix = function() {
                    return callbackPrefix
                }, reqwest
            }),
            function() {
                define("utils/bind-all", ["underscore"], function(_) {
                    return function(obj) {
                        return _.each(obj, function(fn, name) {
                            if (_.isFunction(fn)) return obj[name] = _.bind(obj, obj[name])
                        }), obj
                    }
                })
            }.call(this), ! function(document, undefined) {
                var cookie = function() {
                        return cookie.get.apply(cookie, arguments)
                    },
                    utils = cookie.utils = {
                        isArray: Array.isArray || function(value) {
                            return "[object Array]" === Object.prototype.toString.call(value)
                        },
                        isPlainObject: function(value) {
                            return !!value && "[object Object]" === Object.prototype.toString.call(value)
                        },
                        toArray: function(value) {
                            return Array.prototype.slice.call(value)
                        },
                        getKeys: Object.keys || function(obj) {
                            var keys = [],
                                key = "";
                            for (key in obj) obj.hasOwnProperty(key) && keys.push(key);
                            return keys
                        },
                        encode: function(value) {
                            return String(value).replace(/[,;"\\=\s%]/g, function(character) {
                                return encodeURIComponent(character)
                            })
                        },
                        decode: function(value) {
                            try {
                                return decodeURIComponent(value)
                            } catch (e) {
                                return null
                            }
                        },
                        retrieve: function(value, fallback) {
                            return null == value ? fallback : value
                        }
                    };
                cookie.defaults = {}, cookie.expiresMultiplier = 86400, cookie.set = function(key, value, options) {
                    if (utils.isPlainObject(key))
                        for (var k in key) key.hasOwnProperty(k) && this.set(k, key[k], value);
                    else {
                        options = utils.isPlainObject(options) ? options : {
                            expires: options
                        };
                        var expires = options.expires !== undefined ? options.expires : this.defaults.expires || "",
                            expiresType = typeof expires;
                        "string" === expiresType && "" !== expires ? expires = new Date(expires) : "number" === expiresType && (expires = new Date(+new Date + 1e3 * this.expiresMultiplier * expires)), "" !== expires && "toGMTString" in expires && (expires = ";expires=" + expires.toGMTString());
                        var path = options.path || this.defaults.path;
                        path = path ? ";path=" + path : "";
                        var domain = options.domain || this.defaults.domain;
                        domain = domain ? ";domain=" + domain : "";
                        var secure = options.secure || this.defaults.secure ? ";secure" : "";
                        options.secure === !1 && (secure = ""), document.cookie = utils.encode(key) + "=" + utils.encode(value) + expires + path + domain + secure
                    }
                    return this
                }, cookie.setDefault = function(key, value, options) {
                    if (utils.isPlainObject(key)) {
                        for (var k in key) this.get(k) === undefined && this.set(k, key[k], value);
                        return cookie
                    }
                    if (this.get(key) === undefined) return this.set.apply(this, arguments)
                }, cookie.remove = function(keys, options) {
                    keys = utils.isArray(keys) ? keys : utils.toArray(arguments), options = utils.isPlainObject(options) ? options : {}, options.expires = -1;
                    for (var i = 0, l = keys.length; i < l; i++) this.set(keys[i], "", options);
                    return this
                }, cookie.empty = function() {
                    return this.remove(utils.getKeys(this.all()))
                }, cookie.get = function(keys, fallback) {
                    var cookies = this.all();
                    if (utils.isArray(keys)) {
                        for (var result = {}, i = 0, l = keys.length; i < l; i++) {
                            var value = keys[i];
                            result[value] = utils.retrieve(cookies[value], fallback)
                        }
                        return result
                    }
                    return utils.retrieve(cookies[keys], fallback)
                }, cookie.all = function() {
                    if ("" === document.cookie) return {};
                    for (var cookies = document.cookie.split("; "), result = {}, i = 0, l = cookies.length; i < l; i++) {
                        var item = cookies[i].split("="),
                            key = utils.decode(item.shift()),
                            value = utils.decode(item.join("="));
                        null != key && null != value && (result[key] = value)
                    }
                    return result
                }, cookie.enabled = function() {
                    if (navigator.cookieEnabled) return !0;
                    var ret = "_" === cookie.set("_", "_").get("_");
                    return cookie.remove("_"), ret
                }, "function" == typeof define && define.amd ? define("cookie", [], function() {
                    return cookie
                }) : "undefined" != typeof exports ? exports.cookie = cookie : window.cookie = cookie
            }("undefined" == typeof document ? null : document),
            function() {
                define("utils/date", [], function() {
                    var DAY_MS, HOUR_MS, MIN_MS, WEEK_MS, computeMilliseconds;
                    return MIN_MS = 6e4, HOUR_MS = 60 * MIN_MS, DAY_MS = 24 * HOUR_MS, WEEK_MS = 7 * DAY_MS, computeMilliseconds = function(amount, unit) {
                        switch (unit) {
                            case "week":
                                return amount * WEEK_MS;
                            case "day":
                                return amount * DAY_MS;
                            case "hour":
                                return amount * HOUR_MS;
                            case "minute":
                                return amount * MIN_MS;
                            default:
                                return amount * DAY_MS
                        }
                    }, {
                        now: function() {
                            return Date.now ? Date.now() : (new Date).getTime()
                        },
                        subtract: function(date, amount, unit) {
                            return new Date(date.getTime() - computeMilliseconds(amount, unit))
                        },
                        add: function(date, amount, unit) {
                            return new Date(date.getTime() + computeMilliseconds(amount, unit))
                        }
                    }
                })
            }.call(this),
            function(factory) {
                if ("object" == typeof exports) module.exports = factory();
                else if ("function" == typeof define && define.amd) define("md5", factory);
                else {
                    var glob;
                    try {
                        glob = window
                    } catch (e) {
                        glob = self
                    }
                    glob.SparkMD5 = factory()
                }
            }(function(undefined) {
                "use strict";
                var add32 = function(a, b) {
                        return a + b & 4294967295
                    },
                    cmn = function(q, a, b, x, s, t) {
                        return a = add32(add32(a, q), add32(x, t)), add32(a << s | a >>> 32 - s, b)
                    },
                    ff = function(a, b, c, d, x, s, t) {
                        return cmn(b & c | ~b & d, a, b, x, s, t)
                    },
                    gg = function(a, b, c, d, x, s, t) {
                        return cmn(b & d | c & ~d, a, b, x, s, t)
                    },
                    hh = function(a, b, c, d, x, s, t) {
                        return cmn(b ^ c ^ d, a, b, x, s, t)
                    },
                    ii = function(a, b, c, d, x, s, t) {
                        return cmn(c ^ (b | ~d), a, b, x, s, t)
                    },
                    md5cycle = function(x, k) {
                        var a = x[0],
                            b = x[1],
                            c = x[2],
                            d = x[3];
                        a = ff(a, b, c, d, k[0], 7, -680876936), d = ff(d, a, b, c, k[1], 12, -389564586), c = ff(c, d, a, b, k[2], 17, 606105819), b = ff(b, c, d, a, k[3], 22, -1044525330), a = ff(a, b, c, d, k[4], 7, -176418897), d = ff(d, a, b, c, k[5], 12, 1200080426), c = ff(c, d, a, b, k[6], 17, -1473231341), b = ff(b, c, d, a, k[7], 22, -45705983), a = ff(a, b, c, d, k[8], 7, 1770035416), d = ff(d, a, b, c, k[9], 12, -1958414417), c = ff(c, d, a, b, k[10], 17, -42063), b = ff(b, c, d, a, k[11], 22, -1990404162), a = ff(a, b, c, d, k[12], 7, 1804603682), d = ff(d, a, b, c, k[13], 12, -40341101), c = ff(c, d, a, b, k[14], 17, -1502002290), b = ff(b, c, d, a, k[15], 22, 1236535329), a = gg(a, b, c, d, k[1], 5, -165796510), d = gg(d, a, b, c, k[6], 9, -1069501632), c = gg(c, d, a, b, k[11], 14, 643717713), b = gg(b, c, d, a, k[0], 20, -373897302), a = gg(a, b, c, d, k[5], 5, -701558691), d = gg(d, a, b, c, k[10], 9, 38016083), c = gg(c, d, a, b, k[15], 14, -660478335), b = gg(b, c, d, a, k[4], 20, -405537848), a = gg(a, b, c, d, k[9], 5, 568446438), d = gg(d, a, b, c, k[14], 9, -1019803690), c = gg(c, d, a, b, k[3], 14, -187363961), b = gg(b, c, d, a, k[8], 20, 1163531501), a = gg(a, b, c, d, k[13], 5, -1444681467), d = gg(d, a, b, c, k[2], 9, -51403784), c = gg(c, d, a, b, k[7], 14, 1735328473), b = gg(b, c, d, a, k[12], 20, -1926607734), a = hh(a, b, c, d, k[5], 4, -378558), d = hh(d, a, b, c, k[8], 11, -2022574463), c = hh(c, d, a, b, k[11], 16, 1839030562), b = hh(b, c, d, a, k[14], 23, -35309556), a = hh(a, b, c, d, k[1], 4, -1530992060), d = hh(d, a, b, c, k[4], 11, 1272893353), c = hh(c, d, a, b, k[7], 16, -155497632), b = hh(b, c, d, a, k[10], 23, -1094730640), a = hh(a, b, c, d, k[13], 4, 681279174), d = hh(d, a, b, c, k[0], 11, -358537222), c = hh(c, d, a, b, k[3], 16, -722521979), b = hh(b, c, d, a, k[6], 23, 76029189), a = hh(a, b, c, d, k[9], 4, -640364487), d = hh(d, a, b, c, k[12], 11, -421815835), c = hh(c, d, a, b, k[15], 16, 530742520), b = hh(b, c, d, a, k[2], 23, -995338651), a = ii(a, b, c, d, k[0], 6, -198630844), d = ii(d, a, b, c, k[7], 10, 1126891415), c = ii(c, d, a, b, k[14], 15, -1416354905), b = ii(b, c, d, a, k[5], 21, -57434055), a = ii(a, b, c, d, k[12], 6, 1700485571), d = ii(d, a, b, c, k[3], 10, -1894986606), c = ii(c, d, a, b, k[10], 15, -1051523), b = ii(b, c, d, a, k[1], 21, -2054922799), a = ii(a, b, c, d, k[8], 6, 1873313359), d = ii(d, a, b, c, k[15], 10, -30611744), c = ii(c, d, a, b, k[6], 15, -1560198380), b = ii(b, c, d, a, k[13], 21, 1309151649), a = ii(a, b, c, d, k[4], 6, -145523070), d = ii(d, a, b, c, k[11], 10, -1120210379), c = ii(c, d, a, b, k[2], 15, 718787259), b = ii(b, c, d, a, k[9], 21, -343485551), x[0] = add32(a, x[0]), x[1] = add32(b, x[1]), x[2] = add32(c, x[2]), x[3] = add32(d, x[3])
                    },
                    md5blk = function(s) {
                        var i, md5blks = [];
                        for (i = 0; i < 64; i += 4) md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
                        return md5blks
                    },
                    md5blk_array = function(a) {
                        var i, md5blks = [];
                        for (i = 0; i < 64; i += 4) md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
                        return md5blks
                    },
                    md51 = function(s) {
                        var i, length, tail, tmp, lo, hi, n = s.length,
                            state = [1732584193, -271733879, -1732584194, 271733878];
                        for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
                        for (s = s.substring(i - 64), length = s.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i = 0; i < length; i += 1) tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
                        if (tail[i >> 2] |= 128 << (i % 4 << 3), i > 55)
                            for (md5cycle(state, tail), i = 0; i < 16; i += 1) tail[i] = 0;
                        return tmp = 8 * n, tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(tmp[2], 16), hi = parseInt(tmp[1], 16) || 0, tail[14] = lo, tail[15] = hi, md5cycle(state, tail), state
                    },
                    md51_array = function(a) {
                        var i, length, tail, tmp, lo, hi, n = a.length,
                            state = [1732584193, -271733879, -1732584194, 271733878];
                        for (i = 64; i <= n; i += 64) md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
                        for (a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0), length = a.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i = 0; i < length; i += 1) tail[i >> 2] |= a[i] << (i % 4 << 3);
                        if (tail[i >> 2] |= 128 << (i % 4 << 3), i > 55)
                            for (md5cycle(state, tail), i = 0; i < 16; i += 1) tail[i] = 0;
                        return tmp = 8 * n, tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(tmp[2], 16), hi = parseInt(tmp[1], 16) || 0, tail[14] = lo, tail[15] = hi, md5cycle(state, tail), state
                    },
                    hex_chr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
                    rhex = function(n) {
                        var j, s = "";
                        for (j = 0; j < 4; j += 1) s += hex_chr[n >> 8 * j + 4 & 15] + hex_chr[n >> 8 * j & 15];
                        return s
                    },
                    hex = function(x) {
                        var i;
                        for (i = 0; i < x.length; i += 1) x[i] = rhex(x[i]);
                        return x.join("")
                    },
                    md5 = function(s) {
                        return hex(md51(s))
                    },
                    SparkMD5 = function() {
                        this.reset()
                    };
                return "5d41402abc4b2a76b9719d911017c592" !== md5("hello") && (add32 = function(x, y) {
                    var lsw = (65535 & x) + (65535 & y),
                        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return msw << 16 | 65535 & lsw
                }), SparkMD5.prototype.append = function(str) {
                    return /[\u0080-\uFFFF]/.test(str) && (str = unescape(encodeURIComponent(str))), this.appendBinary(str), this
                }, SparkMD5.prototype.appendBinary = function(contents) {
                    this._buff += contents, this._length += contents.length;
                    var i, length = this._buff.length;
                    for (i = 64; i <= length; i += 64) md5cycle(this._state, md5blk(this._buff.substring(i - 64, i)));
                    return this._buff = this._buff.substr(i - 64), this
                }, SparkMD5.prototype.end = function(raw) {
                    var i, ret, buff = this._buff,
                        length = buff.length,
                        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    for (i = 0; i < length; i += 1) tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
                    return this._finish(tail, length), ret = raw ? this._state : hex(this._state), this.reset(), ret
                }, SparkMD5.prototype._finish = function(tail, length) {
                    var tmp, lo, hi, i = length;
                    if (tail[i >> 2] |= 128 << (i % 4 << 3), i > 55)
                        for (md5cycle(this._state, tail), i = 0; i < 16; i += 1) tail[i] = 0;
                    tmp = 8 * this._length, tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(tmp[2], 16), hi = parseInt(tmp[1], 16) || 0, tail[14] = lo, tail[15] = hi, md5cycle(this._state, tail)
                }, SparkMD5.prototype.reset = function() {
                    return this._buff = "", this._length = 0, this._state = [1732584193, -271733879, -1732584194, 271733878], this
                }, SparkMD5.prototype.destroy = function() {
                    delete this._state, delete this._buff, delete this._length
                }, SparkMD5.hash = function(str, raw) {
                    /[\u0080-\uFFFF]/.test(str) && (str = unescape(encodeURIComponent(str)));
                    var hash = md51(str);
                    return raw ? hash : hex(hash)
                }, SparkMD5.hashBinary = function(content, raw) {
                    var hash = md51(content);
                    return raw ? hash : hex(hash)
                }, SparkMD5.ArrayBuffer = function() {
                    this.reset()
                }, SparkMD5.ArrayBuffer.prototype.append = function(arr) {
                    var i, buff = this._concatArrayBuffer(this._buff, arr),
                        length = buff.length;
                    for (this._length += arr.byteLength, i = 64; i <= length; i += 64) md5cycle(this._state, md5blk_array(buff.subarray(i - 64, i)));
                    return this._buff = i - 64 < length ? buff.subarray(i - 64) : new Uint8Array(0), this
                }, SparkMD5.ArrayBuffer.prototype.end = function(raw) {
                    var i, ret, buff = this._buff,
                        length = buff.length,
                        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    for (i = 0; i < length; i += 1) tail[i >> 2] |= buff[i] << (i % 4 << 3);
                    return this._finish(tail, length), ret = raw ? this._state : hex(this._state), this.reset(), ret
                }, SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish, SparkMD5.ArrayBuffer.prototype.reset = function() {
                    return this._buff = new Uint8Array(0), this._length = 0, this._state = [1732584193, -271733879, -1732584194, 271733878], this
                }, SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy, SparkMD5.ArrayBuffer.prototype._concatArrayBuffer = function(first, second) {
                    var firstLength = first.length,
                        result = new Uint8Array(firstLength + second.byteLength);
                    return result.set(first), result.set(new Uint8Array(second), firstLength), result
                }, SparkMD5.ArrayBuffer.hash = function(arr, raw) {
                    var hash = md51_array(new Uint8Array(arr));
                    return raw ? hash : hex(hash)
                }, SparkMD5
            }),
            function() {
                define("utils/numeric-hash", [], function() {
                    return function(str) {
                        var chr, hash, i;
                        if (0 === str.length) return str;
                        for (hash = 0, i = 0; i < str.length;) chr = str.charCodeAt(i), hash = (hash << 5) - hash + chr, hash |= 0, i++;
                        return hash
                    }
                })
            }.call(this), define("store", [], function() {
                function isLocalStorageNameSupported() {
                    try {
                        return localStorageName in win && win[localStorageName]
                    } catch (err) {
                        return !1
                    }
                }

                function withIEStorage(storeFunction) {
                    return function() {
                        var args = Array.prototype.slice.call(arguments, 0);
                        args.unshift(storage), storageOwner.appendChild(storage), storage.addBehavior("#default#userData"), storage.load(localStorageName);
                        var result = storeFunction.apply(store, args);
                        return storageOwner.removeChild(storage), result
                    }
                }

                function ieKeyFix(key) {
                    return key.replace(forbiddenCharsRegex, "___")
                }
                var storage, store = {},
                    win = window,
                    doc = win.document,
                    localStorageName = "localStorage",
                    scriptTag = "script";
                if (store.disabled = !1, store.set = function(key, value) {}, store.get = function(key) {}, store.remove = function(key) {}, store.clear = function() {}, store.transact = function(key, defaultVal, transactionFn) {
                        var val = store.get(key);
                        null == transactionFn && (transactionFn = defaultVal, defaultVal = null), "undefined" == typeof val && (val = defaultVal || {}), transactionFn(val), store.set(key, val)
                    }, store.getAll = function() {}, store.forEach = function() {}, store.serialize = function(value) {
                        return JSON.stringify(value)
                    }, store.deserialize = function(value) {
                        if ("string" == typeof value) try {
                            return JSON.parse(value)
                        } catch (e) {
                            return value || void 0
                        }
                    }, isLocalStorageNameSupported()) storage = win[localStorageName], sessionStorage = win.sessionStorage, store.set = function(key, val, session) {
                    if (void 0 === val) return store.remove(key, session);
                    var _storage = session ? sessionStorage : storage;
                    return _storage.setItem(key, store.serialize(val)), val
                }, store.get = function(key, session) {
                    var _storage = session ? sessionStorage : storage;
                    return store.deserialize(_storage.getItem(key))
                }, store.remove = function(key, session) {
                    var _storage = session ? sessionStorage : storage;
                    _storage.removeItem(key)
                }, store.clear = function() {
                    storage.clear()
                }, store.getAll = function() {
                    var ret = {};
                    return store.forEach(function(key, val) {
                        ret[key] = val
                    }), ret
                }, store.forEach = function(callback) {
                    for (var i = 0; i < storage.length; i++) {
                        var key = storage.key(i);
                        callback(key, store.get(key))
                    }
                };
                else if (doc.documentElement.addBehavior) {
                    var storageOwner, storageContainer;
                    try {
                        storageContainer = new ActiveXObject("htmlfile"), storageContainer.open(), storageContainer.write("<" + scriptTag + ">document.w=window</" + scriptTag + '><iframe src="/favicon.ico"></iframe>'), storageContainer.close(), storageOwner = storageContainer.w.frames[0].document, storage = storageOwner.createElement("div")
                    } catch (e) {
                        storage = doc.createElement("div"), storageOwner = doc.body
                    }
                    var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
                    store.set = withIEStorage(function(storage, key, val) {
                        return key = ieKeyFix(key), void 0 === val ? store.remove(key) : (storage.setAttribute(key, store.serialize(val)), storage.save(localStorageName), val)
                    }), store.get = withIEStorage(function(storage, key) {
                        return key = ieKeyFix(key), store.deserialize(storage.getAttribute(key))
                    }), store.remove = withIEStorage(function(storage, key) {
                        key = ieKeyFix(key), storage.removeAttribute(key), storage.save(localStorageName)
                    }), store.clear = withIEStorage(function(storage) {
                        var attributes = storage.XMLDocument.documentElement.attributes;
                        storage.load(localStorageName);
                        for (var attr, i = 0; attr = attributes[i]; i++) storage.removeAttribute(attr.name);
                        storage.save(localStorageName)
                    }), store.getAll = function(storage) {
                        var ret = {};
                        return store.forEach(function(key, val) {
                            ret[key] = val
                        }), ret
                    }, store.forEach = withIEStorage(function(storage, callback) {
                        for (var attr, attributes = storage.XMLDocument.documentElement.attributes, i = 0; attr = attributes[i]; ++i) callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
                    })
                }
                try {
                    var testKey = "__storejs__";
                    store.set(testKey, testKey), store.get(testKey) != testKey && (store.disabled = !0), store.remove(testKey)
                } catch (e) {
                    store.disabled = !0
                }
                return store.enabled = !store.disabled, store
            }),
            function() {
                define("utils/store", ["underscore", "utils/bind-all", "store"], function(_, bindAll, store) {
                    var Store, result;
                    return Store = function() {
                        function Store(options) {
                            this.options(options)
                        }
                        return Store.prototype.options = function(options) {
                            return null == options && (options = {}), 0 === arguments.length ? this._options : (options = _.defaults(options, {
                                enabled: !0
                            }), this.enabled = options.enabled && store.enabled, void(this._options = options))
                        }, Store.prototype.get = function(key, session) {
                            return this.enabled ? store.get(key, session) : null
                        }, Store.prototype.set = function(key, val, session) {
                            return !!this.enabled && store.set(key, val, session)
                        }, Store.prototype.remove = function(key, session) {
                            return !!this.enabled && store.remove(key, session)
                        }, Store
                    }(), result = bindAll(new Store), result.Store = Store, result
                })
            }.call(this),
            function() {
                define("models/entity", ["underscore", "utils/logger", "utils/diff", "utils/events", "utils/store"], function(_, logger, diff, Events, store) {
                    var Entity;
                    return Entity = function() {
                        function Entity() {
                            this.attributes = {}, this._storageKey = "apc_entity"
                        }
                        return Entity.prototype.get = function(key) {
                            var data;
                            return data = _.clone(this.attributes), key ? data[key] : data
                        }, Entity.prototype.set = function(data, options) {
                            var changed, prev;
                            if (null == options && (options = {}), prev = _.clone(this.attributes), _.isObject(data) && !_.isArray(data) && (options.replace ? this.attributes = data : _.extend(this.attributes, data)), changed = diff(prev, data), changed && (_.defer(_.bind(this.save, this)), !options.silent)) return this.trigger("change", changed)
                        }, Entity.prototype.save = function() {
                            var data;
                            return data = this.get(), logger.log("User properties persisted to localStorage.", data), store.set(this._storageKey, data)
                        }, Entity.prototype.load = function() {
                            var data;
                            return data = store.get(this._storageKey) || {}, logger.log("User properties loaded from localStorage.", data), data
                        }, Entity
                    }(), _.extend(Entity.prototype, Events), Entity
                })
            }.call(this),
            function() {
                "use strict";

                function lib$es6$promise$utils$$objectOrFunction(x) {
                    return "function" == typeof x || "object" == typeof x && null !== x
                }

                function lib$es6$promise$utils$$isFunction(x) {
                    return "function" == typeof x
                }

                function lib$es6$promise$utils$$isMaybeThenable(x) {
                    return "object" == typeof x && null !== x
                }

                function lib$es6$promise$asap$$asap(callback, arg) {
                    lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback, lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg, lib$es6$promise$asap$$len += 2, 2 === lib$es6$promise$asap$$len && (lib$es6$promise$asap$$customSchedulerFn ? lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush) : lib$es6$promise$asap$$scheduleFlush())
                }

                function lib$es6$promise$asap$$setScheduler(scheduleFn) {
                    lib$es6$promise$asap$$customSchedulerFn = scheduleFn
                }

                function lib$es6$promise$asap$$useNextTick() {
                    var nextTick = process.nextTick,
                        version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
                    return Array.isArray(version) && "0" === version[1] && "10" === version[2] && (nextTick = setImmediate),
                        function() {
                            nextTick(lib$es6$promise$asap$$flush)
                        }
                }

                function lib$es6$promise$asap$$useVertxTimer() {
                    return function() {
                        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush)
                    }
                }

                function lib$es6$promise$asap$$useMutationObserver() {
                    var iterations = 0,
                        observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush),
                        node = document.createTextNode("");
                    return observer.observe(node, {
                            characterData: !0
                        }),
                        function() {
                            node.data = iterations = ++iterations % 2
                        }
                }

                function lib$es6$promise$asap$$useMessageChannel() {
                    var channel = new MessageChannel;
                    return channel.port1.onmessage = lib$es6$promise$asap$$flush,
                        function() {
                            channel.port2.postMessage(0)
                        }
                }

                function lib$es6$promise$asap$$useSetTimeout() {
                    return function() {
                        setTimeout(lib$es6$promise$asap$$flush, 1)
                    }
                }

                function lib$es6$promise$asap$$flush() {
                    for (var i = 0; i < lib$es6$promise$asap$$len; i += 2) {
                        var callback = lib$es6$promise$asap$$queue[i],
                            arg = lib$es6$promise$asap$$queue[i + 1];
                        callback(arg), lib$es6$promise$asap$$queue[i] = void 0, lib$es6$promise$asap$$queue[i + 1] = void 0
                    }
                    lib$es6$promise$asap$$len = 0
                }

                function lib$es6$promise$asap$$attemptVertex() {
                    try {
                        var r = require,
                            vertx = r("vertx");
                        return lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext, lib$es6$promise$asap$$useVertxTimer()
                    } catch (e) {
                        return lib$es6$promise$asap$$useSetTimeout()
                    }
                }

                function lib$es6$promise$$internal$$noop() {}

                function lib$es6$promise$$internal$$selfFullfillment() {
                    return new TypeError("You cannot resolve a promise with itself")
                }

                function lib$es6$promise$$internal$$cannotReturnOwn() {
                    return new TypeError("A promises callback cannot return that same promise.")
                }

                function lib$es6$promise$$internal$$getThen(promise) {
                    try {
                        return promise.then
                    } catch (error) {
                        return lib$es6$promise$$internal$$GET_THEN_ERROR.error = error, lib$es6$promise$$internal$$GET_THEN_ERROR
                    }
                }

                function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
                    try {
                        then.call(value, fulfillmentHandler, rejectionHandler)
                    } catch (e) {
                        return e
                    }
                }

                function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
                    lib$es6$promise$asap$$default(function(promise) {
                        var sealed = !1,
                            error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
                                sealed || (sealed = !0, thenable !== value ? lib$es6$promise$$internal$$resolve(promise, value) : lib$es6$promise$$internal$$fulfill(promise, value))
                            }, function(reason) {
                                sealed || (sealed = !0, lib$es6$promise$$internal$$reject(promise, reason))
                            }, "Settle: " + (promise._label || " unknown promise"));
                        !sealed && error && (sealed = !0, lib$es6$promise$$internal$$reject(promise, error))
                    }, promise)
                }

                function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
                    thenable._state === lib$es6$promise$$internal$$FULFILLED ? lib$es6$promise$$internal$$fulfill(promise, thenable._result) : thenable._state === lib$es6$promise$$internal$$REJECTED ? lib$es6$promise$$internal$$reject(promise, thenable._result) : lib$es6$promise$$internal$$subscribe(thenable, void 0, function(value) {
                        lib$es6$promise$$internal$$resolve(promise, value)
                    }, function(reason) {
                        lib$es6$promise$$internal$$reject(promise, reason)
                    })
                }

                function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
                    if (maybeThenable.constructor === promise.constructor) lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
                    else {
                        var then = lib$es6$promise$$internal$$getThen(maybeThenable);
                        then === lib$es6$promise$$internal$$GET_THEN_ERROR ? lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error) : void 0 === then ? lib$es6$promise$$internal$$fulfill(promise, maybeThenable) : lib$es6$promise$utils$$isFunction(then) ? lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then) : lib$es6$promise$$internal$$fulfill(promise, maybeThenable)
                    }
                }

                function lib$es6$promise$$internal$$resolve(promise, value) {
                    promise === value ? lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment()) : lib$es6$promise$utils$$objectOrFunction(value) ? lib$es6$promise$$internal$$handleMaybeThenable(promise, value) : lib$es6$promise$$internal$$fulfill(promise, value)
                }

                function lib$es6$promise$$internal$$publishRejection(promise) {
                    promise._onerror && promise._onerror(promise._result), lib$es6$promise$$internal$$publish(promise)
                }

                function lib$es6$promise$$internal$$fulfill(promise, value) {
                    promise._state === lib$es6$promise$$internal$$PENDING && (promise._result = value, promise._state = lib$es6$promise$$internal$$FULFILLED, 0 !== promise._subscribers.length && lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, promise))
                }

                function lib$es6$promise$$internal$$reject(promise, reason) {
                    promise._state === lib$es6$promise$$internal$$PENDING && (promise._state = lib$es6$promise$$internal$$REJECTED, promise._result = reason, lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publishRejection, promise))
                }

                function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
                    var subscribers = parent._subscribers,
                        length = subscribers.length;
                    parent._onerror = null, subscribers[length] = child, subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment, subscribers[length + lib$es6$promise$$internal$$REJECTED] = onRejection, 0 === length && parent._state && lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, parent)
                }

                function lib$es6$promise$$internal$$publish(promise) {
                    var subscribers = promise._subscribers,
                        settled = promise._state;
                    if (0 !== subscribers.length) {
                        for (var child, callback, detail = promise._result, i = 0; i < subscribers.length; i += 3) child = subscribers[i], callback = subscribers[i + settled], child ? lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail) : callback(detail);
                        promise._subscribers.length = 0
                    }
                }

                function lib$es6$promise$$internal$$ErrorObject() {
                    this.error = null
                }

                function lib$es6$promise$$internal$$tryCatch(callback, detail) {
                    try {
                        return callback(detail)
                    } catch (e) {
                        return lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e, lib$es6$promise$$internal$$TRY_CATCH_ERROR
                    }
                }

                function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
                    var value, error, succeeded, failed, hasCallback = lib$es6$promise$utils$$isFunction(callback);
                    if (hasCallback) {
                        if (value = lib$es6$promise$$internal$$tryCatch(callback, detail), value === lib$es6$promise$$internal$$TRY_CATCH_ERROR ? (failed = !0, error = value.error, value = null) : succeeded = !0, promise === value) return void lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn())
                    } else value = detail, succeeded = !0;
                    promise._state !== lib$es6$promise$$internal$$PENDING || (hasCallback && succeeded ? lib$es6$promise$$internal$$resolve(promise, value) : failed ? lib$es6$promise$$internal$$reject(promise, error) : settled === lib$es6$promise$$internal$$FULFILLED ? lib$es6$promise$$internal$$fulfill(promise, value) : settled === lib$es6$promise$$internal$$REJECTED && lib$es6$promise$$internal$$reject(promise, value))
                }

                function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
                    try {
                        resolver(function(value) {
                            lib$es6$promise$$internal$$resolve(promise, value)
                        }, function(reason) {
                            lib$es6$promise$$internal$$reject(promise, reason)
                        })
                    } catch (e) {
                        lib$es6$promise$$internal$$reject(promise, e)
                    }
                }

                function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
                    var enumerator = this;
                    enumerator._instanceConstructor = Constructor, enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop), enumerator._validateInput(input) ? (enumerator._input = input, enumerator.length = input.length, enumerator._remaining = input.length, enumerator._init(), 0 === enumerator.length ? lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result) : (enumerator.length = enumerator.length || 0, enumerator._enumerate(), 0 === enumerator._remaining && lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result))) : lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError())
                }

                function lib$es6$promise$promise$all$$all(entries) {
                    return new lib$es6$promise$enumerator$$default(this, entries).promise
                }

                function lib$es6$promise$promise$race$$race(entries) {
                    function onFulfillment(value) {
                        lib$es6$promise$$internal$$resolve(promise, value)
                    }

                    function onRejection(reason) {
                        lib$es6$promise$$internal$$reject(promise, reason)
                    }
                    var Constructor = this,
                        promise = new Constructor(lib$es6$promise$$internal$$noop);
                    if (!lib$es6$promise$utils$$isArray(entries)) return lib$es6$promise$$internal$$reject(promise, new TypeError("You must pass an array to race.")), promise;
                    for (var length = entries.length, i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), void 0, onFulfillment, onRejection);
                    return promise
                }

                function lib$es6$promise$promise$resolve$$resolve(object) {
                    var Constructor = this;
                    if (object && "object" == typeof object && object.constructor === Constructor) return object;
                    var promise = new Constructor(lib$es6$promise$$internal$$noop);
                    return lib$es6$promise$$internal$$resolve(promise, object), promise
                }

                function lib$es6$promise$promise$reject$$reject(reason) {
                    var Constructor = this,
                        promise = new Constructor(lib$es6$promise$$internal$$noop);
                    return lib$es6$promise$$internal$$reject(promise, reason), promise
                }

                function lib$es6$promise$promise$$needsResolver() {
                    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
                }

                function lib$es6$promise$promise$$needsNew() {
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
                }

                function lib$es6$promise$promise$$Promise(resolver) {
                    this._id = lib$es6$promise$promise$$counter++, this._state = void 0, this._result = void 0, this._subscribers = [], lib$es6$promise$$internal$$noop !== resolver && (lib$es6$promise$utils$$isFunction(resolver) || lib$es6$promise$promise$$needsResolver(), this instanceof lib$es6$promise$promise$$Promise || lib$es6$promise$promise$$needsNew(), lib$es6$promise$$internal$$initializePromise(this, resolver))
                }
                var lib$es6$promise$utils$$_isArray;
                lib$es6$promise$utils$$_isArray = Array.isArray ? Array.isArray : function(x) {
                    return "[object Array]" === Object.prototype.toString.call(x)
                };
                var lib$es6$promise$asap$$vertxNext, lib$es6$promise$asap$$customSchedulerFn, lib$es6$promise$asap$$scheduleFlush, lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray,
                    lib$es6$promise$asap$$len = 0,
                    lib$es6$promise$asap$$default = ({}.toString, lib$es6$promise$asap$$asap),
                    lib$es6$promise$asap$$browserWindow = "undefined" != typeof window ? window : void 0,
                    lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {},
                    lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver,
                    lib$es6$promise$asap$$isNode = "undefined" != typeof process && "[object process]" === {}.toString.call(process),
                    lib$es6$promise$asap$$isWorker = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
                    lib$es6$promise$asap$$queue = new Array(1e3);
                lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$isNode ? lib$es6$promise$asap$$useNextTick() : lib$es6$promise$asap$$BrowserMutationObserver ? lib$es6$promise$asap$$useMutationObserver() : lib$es6$promise$asap$$isWorker ? lib$es6$promise$asap$$useMessageChannel() : void 0 === lib$es6$promise$asap$$browserWindow && "function" == typeof require ? lib$es6$promise$asap$$attemptVertex() : lib$es6$promise$asap$$useSetTimeout();
                var lib$es6$promise$$internal$$PENDING = void 0,
                    lib$es6$promise$$internal$$FULFILLED = 1,
                    lib$es6$promise$$internal$$REJECTED = 2,
                    lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject,
                    lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject;
                lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
                    return lib$es6$promise$utils$$isArray(input)
                }, lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
                    return new Error("Array Methods must be provided an Array")
                }, lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
                    this._result = new Array(this.length)
                };
                var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
                lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
                    for (var enumerator = this, length = enumerator.length, promise = enumerator.promise, input = enumerator._input, i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) enumerator._eachEntry(input[i], i)
                }, lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
                    var enumerator = this,
                        c = enumerator._instanceConstructor;
                    lib$es6$promise$utils$$isMaybeThenable(entry) ? entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING ? (entry._onerror = null, enumerator._settledAt(entry._state, i, entry._result)) : enumerator._willSettleAt(c.resolve(entry), i) : (enumerator._remaining--, enumerator._result[i] = entry)
                }, lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
                    var enumerator = this,
                        promise = enumerator.promise;
                    promise._state === lib$es6$promise$$internal$$PENDING && (enumerator._remaining--, state === lib$es6$promise$$internal$$REJECTED ? lib$es6$promise$$internal$$reject(promise, value) : enumerator._result[i] = value), 0 === enumerator._remaining && lib$es6$promise$$internal$$fulfill(promise, enumerator._result)
                }, lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
                    var enumerator = this;
                    lib$es6$promise$$internal$$subscribe(promise, void 0, function(value) {
                        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value)
                    }, function(reason) {
                        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason)
                    })
                };
                var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all,
                    lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race,
                    lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve,
                    lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject,
                    lib$es6$promise$promise$$counter = 0,
                    lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
                lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default, lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default, lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default, lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default, lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler, lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$default, lib$es6$promise$promise$$Promise.prototype = {
                    constructor: lib$es6$promise$promise$$Promise,
                    then: function(onFulfillment, onRejection) {
                        var parent = this,
                            state = parent._state;
                        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) return this;
                        var child = new this.constructor(lib$es6$promise$$internal$$noop),
                            result = parent._result;
                        if (state) {
                            var callback = arguments[state - 1];
                            lib$es6$promise$asap$$default(function() {
                                lib$es6$promise$$internal$$invokeCallback(state, child, callback, result)
                            })
                        } else lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
                        return child
                    },
                    catch: function(onRejection) {
                        return this.then(null, onRejection)
                    }
                };
                var lib$es6$promise$umd$$ES6Promise = {
                    Promise: lib$es6$promise$promise$$default
                };
                "function" == typeof define && define.amd ? define("es6-promise", [], function() {
                    return lib$es6$promise$umd$$ES6Promise
                }) : "undefined" != typeof module && module.exports ? module.exports = lib$es6$promise$umd$$ES6Promise : "undefined" != typeof this && (this.ES6Promise = lib$es6$promise$umd$$ES6Promise)
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("models/user", ["underscore", "env", "reqwest", "utils/bind-all", "cookie", "utils/date", "md5", "utils/numeric-hash", "models/settings", "models/entity", "es6-promise", "utils/logger", "utils/store"], function(_, env, request, bindAll, cookie, date, md5, numericHash, settings, Entity, ES6Promise, logger, store) {
                    var User, getVariantGroup, user;
                    return getVariantGroup = function(id, numGroups) {
                        var group, numericId;
                        if (numGroups = numGroups || 2, group = Math.ceil(999 * Math.random()) % numGroups, null != id) {
                            numericId = id;
                            try {
                                numericId = parseInt(id, 10)
                            } catch (_error) {}
                            _.isString(numericId) && (numericId = numericHash(numericId)), _.isFinite(numericId) && (group = numericId % numGroups)
                        }
                        return group + 1
                    }, User = function(superClass) {
                        function User() {
                            var existing, profile, ref, ref1;
                            this.attributes = {}, this._storageKey = "apc_user", this._sessionStorageKey = "apc_session_attrs", existing = this.load(), profile = this.buildPassiveAttrs(), profile.uuid = this._uuid(profile.userId), profile._ABGroup = null != (ref = existing._ABGroup) ? ref : getVariantGroup(profile.userId, 2), profile._variantGroup = null != (ref1 = existing._variantGroup) ? ref1 : getVariantGroup(profile.userId, 12), this.set(profile, {
                                silent: !0
                            }), this.on("change", this.update)
                        }
                        return extend(User, superClass), User.prototype.buildPassiveAttrs = function() {
                            var attrs, currentPageUrl, e, pageviews, profile, ref, ref1, referrer;
                            if (attrs = null != (ref = store.get(this._sessionStorageKey, !0)) ? ref : {}, pageviews = null != (ref1 = attrs._sessionPageviews) ? ref1 : 0, !_.isFinite(pageviews)) try {
                                pageviews = parseInt(pageviews, 10)
                            } catch (_error) {
                                e = _error, pageviews = 0
                            }
                            return referrer = document.referrer, currentPageUrl = window.location.href, (!referrer || referrer && referrer === attrs._lastPageUrl) && (referrer = attrs._currentPageUrl || ""), pageviews++, profile = {
                                _hostname: window.location.hostname,
                                _lastPageUrl: referrer,
                                _lastPageTitle: document.title,
                                _updatedAt: date.now(),
                                _userAgent: navigator.userAgent,
                                _sessionPageviews: pageviews,
                                _lastUrl: currentPageUrl,
                                _currentPageUrl: currentPageUrl
                            }, store.set(this._sessionStorageKey, {
                                _sessionPageviews: pageviews,
                                _lastUrl: currentPageUrl,
                                _currentPageUrl: currentPageUrl,
                                _lastPageUrl: referrer
                            }, !0), profile
                        }, User.prototype._uuid = function(userId) {
                            var result, userIdStr;
                            return result = null, null != userId && (userIdStr = "" + userId, result = md5.hash(userIdStr)), result
                        }, User.prototype.toUUID = function() {
                            var uuid;
                            return uuid = this.get("uuid"), "md5-userid:" + uuid
                        }, User.prototype.isAnonymous = function() {
                            return !this.get("uuid")
                        }, User.prototype.update = function(changed) {
                            if (_.isObject(changed) && (_.has(changed, "userId") && this.updateUUID(changed.userId), _.has(changed, "_lastPageUrl"))) return this.incrementPageviews()
                        }, User.prototype.updateUUID = function(userId) {
                            logger.log("userId property changed. Updating uuid to match."), this.set({
                                uuid: this._uuid(userId)
                            })
                        }, User.prototype.incrementPageviews = function() {
                            var attrs, e, pageviews;
                            if (pageviews = this.get("_sessionPageviews"), !_.isFinite(pageviews)) try {
                                pageviews = parseInt(pageviews, 10)
                            } catch (_error) {
                                e = _error, pageviews = 0
                            }
                            return pageviews++, this.set({
                                _sessionPageviews: pageviews
                            }, {
                                silent: !0
                            }), attrs = store.get(this._sessionStorageKey, !0), store.set(this._sessionStorageKey, _.extend({}, attrs, {
                                _sessionPageviews: pageviews
                            }), !0)
                        }, User.prototype.pageView = function() {
                            var attrs;
                            return this.set({
                                _hostname: window.location.hostname,
                                _lastPageUrl: document.referrer,
                                _lastPageTitle: document.title
                            }), attrs = store.get(this._sessionStorageKey, !0), null != (null != attrs ? attrs._lastUrl : void 0) && window.location.href !== attrs._lastUrl && (attrs = _.extend({}, attrs, {
                                _lastUrl: window.location.href,
                                _currentPageUrl: window.location.href
                            }), store.set(this._sessionStorageKey, attrs, !0), this.incrementPageviews(), !0)
                        }, User.prototype.send = function(options) {
                            return null == this._sendCallCount && (this._sendCallCount = cookie.get(this.SEND_COUNT_KEY)), (!this._sendCallCount || ++this._sendCallCount > this.SEND_INTERVAL) && (this._sendCallCount = 1, this._send(options)), cookie.set(this.SEND_COUNT_KEY, this._sendCallCount, {
                                path: "/"
                            })
                        }, User.prototype.SEND_INTERVAL = 10, User.prototype.SEND_COUNT_KEY = "apc_user_call_count", User.prototype._send = function(options) {
                            var appcuesId, getUserData;
                            return getUserData = _.bind(this.get, this), appcuesId = settings.get("appcuesId"), new ES6Promise.Promise(function(resolve, reject) {
                                var data, url;
                                appcuesId ? (data = getUserData(), logger.log("Sending user traits to server.", data), data && !_.isEmpty(data) ? (data._updatedAt = {
                                    ".sv": "timestamp"
                                }, url = env.firebase + "/accounts/" + appcuesId + "/properties.json?x-http-method-override=PATCH&print=silent", request({
                                    url: url,
                                    method: "post",
                                    type: "json",
                                    crossOrigin: !0,
                                    data: JSON.stringify(data)
                                }).then(resolve, reject)) : reject(new Error("User properties are not valid for sending to server."))) : reject(new Error("No Appcues ID given."))
                            })
                        }, User
                    }(Entity), user = new User, user.User = User, user
                })
            }.call(this),
            function(window, undefined) {
                "use strict";

                function triggerEvent(eventType, options) {
                    var event, key;
                    options = options || {}, eventType = "raven" + eventType.substr(0, 1).toUpperCase() + eventType.substr(1), document.createEvent ? (event = document.createEvent("HTMLEvents"), event.initEvent(eventType, !0, !0)) : (event = document.createEventObject(), event.eventType = eventType);
                    for (key in options) hasKey(options, key) && (event[key] = options[key]);
                    if (document.createEvent) document.dispatchEvent(event);
                    else try {
                        document.fireEvent("on" + event.eventType.toLowerCase(), event)
                    } catch (e) {}
                }

                function RavenConfigError(message) {
                    this.name = "RavenConfigError", this.message = message
                }

                function parseDSN(str) {
                    var m = dsnPattern.exec(str),
                        dsn = {},
                        i = 7;
                    try {
                        for (; i--;) dsn[dsnKeys[i]] = m[i] || ""
                    } catch (e) {
                        throw new RavenConfigError("Invalid DSN: " + str)
                    }
                    if (dsn.pass) throw new RavenConfigError("Do not specify your private key in the DSN!");
                    return dsn
                }

                function isUndefined(what) {
                    return void 0 === what
                }

                function isFunction(what) {
                    return "function" == typeof what
                }

                function isString(what) {
                    return "[object String]" === objectPrototype.toString.call(what)
                }

                function isObject(what) {
                    return "object" == typeof what && null !== what
                }

                function isEmptyObject(what) {
                    for (var k in what) return !1;
                    return !0
                }

                function isError(what) {
                    return isObject(what) && "[object Error]" === objectPrototype.toString.call(what) || what instanceof Error
                }

                function hasKey(object, key) {
                    return objectPrototype.hasOwnProperty.call(object, key)
                }

                function each(obj, callback) {
                    var i, j;
                    if (isUndefined(obj.length))
                        for (i in obj) hasKey(obj, i) && callback.call(null, i, obj[i]);
                    else if (j = obj.length)
                        for (i = 0; i < j; i++) callback.call(null, i, obj[i])
                }

                function handleStackInfo(stackInfo, options) {
                    var frames = [];
                    stackInfo.stack && stackInfo.stack.length && each(stackInfo.stack, function(i, stack) {
                        var frame = normalizeFrame(stack);
                        frame && frames.push(frame)
                    }), triggerEvent("handle", {
                        stackInfo: stackInfo,
                        options: options
                    }), processException(stackInfo.name, stackInfo.message, stackInfo.url, stackInfo.lineno, frames, options)
                }

                function normalizeFrame(frame) {
                    if (frame.url) {
                        var i, normalized = {
                                filename: frame.url,
                                lineno: frame.line,
                                colno: frame.column,
                                function: frame.func || "?"
                            },
                            context = extractContextFromFrame(frame);
                        if (context) {
                            var keys = ["pre_context", "context_line", "post_context"];
                            for (i = 3; i--;) normalized[keys[i]] = context[i]
                        }
                        return normalized.in_app = !(globalOptions.includePaths.test && !globalOptions.includePaths.test(normalized.filename) || /(Raven|TraceKit)\./.test(normalized.function) || /raven\.(min\.)?js$/.test(normalized.filename)), normalized
                    }
                }

                function extractContextFromFrame(frame) {
                    if (frame.context && globalOptions.fetchContext) {
                        for (var context = frame.context, pivot = ~~(context.length / 2), i = context.length, isMinified = !1; i--;)
                            if (context[i].length > 300) {
                                isMinified = !0;
                                break
                            }
                        if (isMinified) {
                            if (isUndefined(frame.column)) return;
                            return [
                                [], context[pivot].substr(frame.column, 50), []
                            ]
                        }
                        return [context.slice(0, pivot), context[pivot], context.slice(pivot + 1)]
                    }
                }

                function processException(type, message, fileurl, lineno, frames, options) {
                    var stacktrace, fullMessage;
                    globalOptions.ignoreErrors.test && globalOptions.ignoreErrors.test(message) || (message += "", message = truncate(message, globalOptions.maxMessageLength), fullMessage = type + ": " + message, fullMessage = truncate(fullMessage, globalOptions.maxMessageLength), frames && frames.length ? (fileurl = frames[0].filename || fileurl, frames.reverse(), stacktrace = {
                        frames: frames
                    }) : fileurl && (stacktrace = {
                        frames: [{
                            filename: fileurl,
                            lineno: lineno,
                            in_app: !0
                        }]
                    }), globalOptions.ignoreUrls.test && globalOptions.ignoreUrls.test(fileurl) || globalOptions.whitelistUrls.test && !globalOptions.whitelistUrls.test(fileurl) || send(objectMerge({
                        exception: {
                            type: type,
                            value: message
                        },
                        stacktrace: stacktrace,
                        culprit: fileurl,
                        message: fullMessage
                    }, options)))
                }

                function objectMerge(obj1, obj2) {
                    return obj2 ? (each(obj2, function(key, value) {
                        obj1[key] = value
                    }), obj1) : obj1
                }

                function truncate(str, max) {
                    return str.length <= max ? str : str.substr(0, max) + "…"
                }

                function now() {
                    return +new Date
                }

                function getHttpData() {
                    if (document.location && document.location.href) {
                        var http = {
                            headers: {
                                "User-Agent": navigator.userAgent
                            }
                        };
                        return http.url = document.location.href, document.referrer && (http.headers.Referer = document.referrer), http
                    }
                }

                function send(data) {
                    var baseData = {
                            project: globalProject,
                            logger: globalOptions.logger,
                            platform: "javascript"
                        },
                        http = getHttpData();
                    http && (baseData.request = http), data = objectMerge(baseData, data), data.tags = objectMerge(objectMerge({}, globalOptions.tags), data.tags), data.extra = objectMerge(objectMerge({}, globalOptions.extra), data.extra), data.extra = objectMerge({
                        "session:duration": now() - startTime
                    }, data.extra), isEmptyObject(data.tags) && delete data.tags, globalUser && (data.user = globalUser), globalOptions.release && (data.release = globalOptions.release), isFunction(globalOptions.dataCallback) && (data = globalOptions.dataCallback(data) || data), data && !isEmptyObject(data) && (isFunction(globalOptions.shouldSendCallback) && !globalOptions.shouldSendCallback(data) || (lastEventId = data.event_id || (data.event_id = uuid4()), logDebug("debug", "Raven about to send:", data), isSetup() && (globalOptions.transport || makeRequest)({
                        url: globalServer,
                        auth: {
                            sentry_version: "4",
                            sentry_client: "raven-js/" + Raven.VERSION,
                            sentry_key: globalKey
                        },
                        data: data,
                        options: globalOptions,
                        onSuccess: function() {
                            triggerEvent("success", {
                                data: data,
                                src: globalServer
                            })
                        },
                        onError: function() {
                            triggerEvent("failure", {
                                data: data,
                                src: globalServer
                            })
                        }
                    })))
                }

                function makeRequest(opts) {
                    opts.auth.sentry_data = JSON.stringify(opts.data);
                    var img = newImage(),
                        src = opts.url + "?" + urlencode(opts.auth);
                    (opts.options.crossOrigin || "" === opts.options.crossOrigin) && (img.crossOrigin = opts.options.crossOrigin), img.onload = opts.onSuccess, img.onerror = img.onabort = opts.onError, img.src = src
                }

                function newImage() {
                    return document.createElement("img")
                }

                function isSetup() {
                    return !!hasJSON && (!!globalServer || (ravenNotConfiguredError || logDebug("error", "Error: Raven has not been configured."), ravenNotConfiguredError = !0, !1))
                }

                function joinRegExp(patterns) {
                    for (var pattern, sources = [], i = 0, len = patterns.length; i < len; i++) pattern = patterns[i], isString(pattern) ? sources.push(pattern.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")) : pattern && pattern.source && sources.push(pattern.source);
                    return new RegExp(sources.join("|"), "i")
                }

                function uuid4() {
                    var crypto = window.crypto || window.msCrypto;
                    if (!isUndefined(crypto) && crypto.getRandomValues) {
                        var arr = new Uint16Array(8);
                        crypto.getRandomValues(arr), arr[3] = 4095 & arr[3] | 16384, arr[4] = 16383 & arr[4] | 32768;
                        var pad = function(num) {
                            for (var v = num.toString(16); v.length < 4;) v = "0" + v;
                            return v
                        };
                        return pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7])
                    }
                    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                        var r = 16 * Math.random() | 0,
                            v = "x" == c ? r : 3 & r | 8;
                        return v.toString(16)
                    })
                }

                function logDebug(level) {
                    originalConsoleMethods[level] && Raven.debug && originalConsoleMethods[level].apply(originalConsole, _slice.call(arguments, 1))
                }

                function afterLoad() {
                    var RavenConfig = window.RavenConfig;
                    RavenConfig && Raven.config(RavenConfig.dsn, RavenConfig.config).install()
                }

                function urlencode(o) {
                    var pairs = [];
                    return each(o, function(key, value) {
                        pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(value))
                    }), pairs.join("&")
                }
                var TraceKit = {
                        remoteFetching: !1,
                        collectWindowErrors: !0,
                        linesOfContext: 7,
                        debug: !1
                    },
                    _slice = [].slice,
                    UNKNOWN_FUNCTION = "?";
                TraceKit.wrap = function(func) {
                    function wrapped() {
                        try {
                            return func.apply(this, arguments)
                        } catch (e) {
                            throw TraceKit.report(e), e
                        }
                    }
                    return wrapped
                }, TraceKit.report = function() {
                    function subscribe(handler) {
                        installGlobalHandler(), handlers.push(handler)
                    }

                    function unsubscribe(handler) {
                        for (var i = handlers.length - 1; i >= 0; --i) handlers[i] === handler && handlers.splice(i, 1)
                    }

                    function unsubscribeAll() {
                        uninstallGlobalHandler(), handlers = []
                    }

                    function notifyHandlers(stack, isWindowError) {
                        var exception = null;
                        if (!isWindowError || TraceKit.collectWindowErrors) {
                            for (var i in handlers)
                                if (hasKey(handlers, i)) try {
                                    handlers[i].apply(null, [stack].concat(_slice.call(arguments, 2)))
                                } catch (inner) {
                                    exception = inner
                                }
                                if (exception) throw exception
                        }
                    }

                    function traceKitWindowOnError(message, url, lineNo, colNo, ex) {
                        var stack = null;
                        if (lastExceptionStack) TraceKit.computeStackTrace.augmentStackTraceWithInitialElement(lastExceptionStack, url, lineNo, message), processLastException();
                        else if (ex) stack = TraceKit.computeStackTrace(ex), notifyHandlers(stack, !0);
                        else {
                            var location = {
                                url: url,
                                line: lineNo,
                                column: colNo
                            };
                            location.func = TraceKit.computeStackTrace.guessFunctionName(location.url, location.line), location.context = TraceKit.computeStackTrace.gatherContext(location.url, location.line), stack = {
                                message: message,
                                url: document.location.href,
                                stack: [location]
                            }, notifyHandlers(stack, !0)
                        }
                        return !!_oldOnerrorHandler && _oldOnerrorHandler.apply(this, arguments)
                    }

                    function installGlobalHandler() {
                        _onErrorHandlerInstalled || (_oldOnerrorHandler = window.onerror, window.onerror = traceKitWindowOnError, _onErrorHandlerInstalled = !0)
                    }

                    function uninstallGlobalHandler() {
                        _onErrorHandlerInstalled && (window.onerror = _oldOnerrorHandler, _onErrorHandlerInstalled = !1, _oldOnerrorHandler = undefined)
                    }

                    function processLastException() {
                        var _lastExceptionStack = lastExceptionStack,
                            _lastArgs = lastArgs;
                        lastArgs = null, lastExceptionStack = null, lastException = null, notifyHandlers.apply(null, [_lastExceptionStack, !1].concat(_lastArgs))
                    }

                    function report(ex, rethrow) {
                        var args = _slice.call(arguments, 1);
                        if (lastExceptionStack) {
                            if (lastException === ex) return;
                            processLastException()
                        }
                        var stack = TraceKit.computeStackTrace(ex);
                        if (lastExceptionStack = stack, lastException = ex, lastArgs = args, window.setTimeout(function() {
                                lastException === ex && processLastException()
                            }, stack.incomplete ? 2e3 : 0), rethrow !== !1) throw ex
                    }
                    var _oldOnerrorHandler, _onErrorHandlerInstalled, handlers = [],
                        lastArgs = null,
                        lastException = null,
                        lastExceptionStack = null;
                    return report.subscribe = subscribe, report.unsubscribe = unsubscribe, report.uninstall = unsubscribeAll, report
                }(), TraceKit.computeStackTrace = function() {
                    function loadSource(url) {
                        if (!TraceKit.remoteFetching) return "";
                        try {
                            var getXHR = function() {
                                    try {
                                        return new window.XMLHttpRequest
                                    } catch (e) {
                                        return new window.ActiveXObject("Microsoft.XMLHTTP")
                                    }
                                },
                                request = getXHR();
                            return request.open("GET", url, !1), request.send(""), request.responseText
                        } catch (e) {
                            return ""
                        }
                    }

                    function getSource(url) {
                        if (!isString(url)) return [];
                        if (!hasKey(sourceCache, url)) {
                            var source = "",
                                domain = "";
                            try {
                                domain = document.domain
                            } catch (e) {}
                            url.indexOf(domain) !== -1 && (source = loadSource(url)), sourceCache[url] = source ? source.split("\n") : []
                        }
                        return sourceCache[url]
                    }

                    function guessFunctionName(url, lineNo) {
                        var m, reFunctionArgNames = /function ([^(]*)\(([^)]*)\)/,
                            reGuessFunction = /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/,
                            line = "",
                            maxLines = 10,
                            source = getSource(url);
                        if (!source.length) return UNKNOWN_FUNCTION;
                        for (var i = 0; i < maxLines; ++i)
                            if (line = source[lineNo - i] + line, !isUndefined(line)) {
                                if (m = reGuessFunction.exec(line)) return m[1];
                                if (m = reFunctionArgNames.exec(line)) return m[1]
                            }
                        return UNKNOWN_FUNCTION
                    }

                    function gatherContext(url, line) {
                        var source = getSource(url);
                        if (!source.length) return null;
                        var context = [],
                            linesBefore = Math.floor(TraceKit.linesOfContext / 2),
                            linesAfter = linesBefore + TraceKit.linesOfContext % 2,
                            start = Math.max(0, line - linesBefore - 1),
                            end = Math.min(source.length, line + linesAfter - 1);
                        line -= 1;
                        for (var i = start; i < end; ++i) isUndefined(source[i]) || context.push(source[i]);
                        return context.length > 0 ? context : null
                    }

                    function escapeRegExp(text) {
                        return text.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, "\\$&")
                    }

                    function escapeCodeAsRegExpForMatchingInsideHTML(body) {
                        return escapeRegExp(body).replace("<", "(?:<|&lt;)").replace(">", "(?:>|&gt;)").replace("&", "(?:&|&amp;)").replace('"', '(?:"|&quot;)').replace(/\s+/g, "\\s+")
                    }

                    function findSourceInUrls(re, urls) {
                        for (var source, m, i = 0, j = urls.length; i < j; ++i)
                            if ((source = getSource(urls[i])).length && (source = source.join("\n"), m = re.exec(source))) return {
                                url: urls[i],
                                line: source.substring(0, m.index).split("\n").length,
                                column: m.index - source.lastIndexOf("\n", m.index) - 1
                            };
                        return null
                    }

                    function findSourceInLine(fragment, url, line) {
                        var m, source = getSource(url),
                            re = new RegExp("\\b" + escapeRegExp(fragment) + "\\b");
                        return line -= 1, source && source.length > line && (m = re.exec(source[line])) ? m.index : null
                    }

                    function findSourceByFunctionBody(func) {
                        for (var body, re, parts, result, urls = [window.location.href], scripts = document.getElementsByTagName("script"), code = "" + func, codeRE = /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/, eventRE = /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/, i = 0; i < scripts.length; ++i) {
                            var script = scripts[i];
                            script.src && urls.push(script.src)
                        }
                        if (parts = codeRE.exec(code)) {
                            var name = parts[1] ? "\\s+" + parts[1] : "",
                                args = parts[2].split(",").join("\\s*,\\s*");
                            body = escapeRegExp(parts[3]).replace(/;$/, ";?"), re = new RegExp("function" + name + "\\s*\\(\\s*" + args + "\\s*\\)\\s*{\\s*" + body + "\\s*}")
                        } else re = new RegExp(escapeRegExp(code).replace(/\s+/g, "\\s+"));
                        if (result = findSourceInUrls(re, urls)) return result;
                        if (parts = eventRE.exec(code)) {
                            var event = parts[1];
                            if (body = escapeCodeAsRegExpForMatchingInsideHTML(parts[2]), re = new RegExp("on" + event + "=[\\'\"]\\s*" + body + "\\s*[\\'\"]", "i"), result = findSourceInUrls(re, urls[0])) return result;
                            if (re = new RegExp(body), result = findSourceInUrls(re, urls)) return result
                        }
                        return null
                    }

                    function computeStackTraceFromStackProp(ex) {
                        if (!isUndefined(ex.stack) && ex.stack) {
                            for (var parts, element, chrome = /^\s*at (.*?) ?\(?((?:(?:file|https?|chrome-extension):.*?)|<anonymous>):(\d+)(?::(\d+))?\)?\s*$/i, gecko = /^\s*(.*?)(?:\((.*?)\))?@((?:file|https?|chrome).*?):(\d+)(?::(\d+))?\s*$/i, winjs = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:ms-appx|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i, lines = ex.stack.split("\n"), stack = [], reference = /^(.*) is undefined$/.exec(ex.message), i = 0, j = lines.length; i < j; ++i) {
                                if (parts = gecko.exec(lines[i])) element = {
                                    url: parts[3],
                                    func: parts[1] || UNKNOWN_FUNCTION,
                                    args: parts[2] ? parts[2].split(",") : "",
                                    line: +parts[4],
                                    column: parts[5] ? +parts[5] : null
                                };
                                else if (parts = chrome.exec(lines[i])) element = {
                                    url: parts[2],
                                    func: parts[1] || UNKNOWN_FUNCTION,
                                    line: +parts[3],
                                    column: parts[4] ? +parts[4] : null
                                };
                                else {
                                    if (!(parts = winjs.exec(lines[i]))) continue;
                                    element = {
                                        url: parts[2],
                                        func: parts[1] || UNKNOWN_FUNCTION,
                                        line: +parts[3],
                                        column: parts[4] ? +parts[4] : null
                                    }
                                }!element.func && element.line && (element.func = guessFunctionName(element.url, element.line)), element.line && (element.context = gatherContext(element.url, element.line)), stack.push(element)
                            }
                            return stack.length ? (stack[0].line && !stack[0].column && reference ? stack[0].column = findSourceInLine(reference[1], stack[0].url, stack[0].line) : stack[0].column || isUndefined(ex.columnNumber) || (stack[0].column = ex.columnNumber + 1), {
                                name: ex.name,
                                message: ex.message,
                                url: document.location.href,
                                stack: stack
                            }) : null
                        }
                    }

                    function computeStackTraceFromStacktraceProp(ex) {
                        var stacktrace = ex.stacktrace;
                        if (!isUndefined(ex.stacktrace) && ex.stacktrace) {
                            for (var parts, testRE = / line (\d+), column (\d+) in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\) in (.*):\s*$/i, lines = stacktrace.split("\n"), stack = [], i = 0, j = lines.length; i < j; i += 2)
                                if (parts = testRE.exec(lines[i])) {
                                    var element = {
                                        line: +parts[1],
                                        column: +parts[2],
                                        func: parts[3] || parts[4],
                                        args: parts[5] ? parts[5].split(",") : [],
                                        url: parts[6]
                                    };
                                    if (!element.func && element.line && (element.func = guessFunctionName(element.url, element.line)), element.line) try {
                                        element.context = gatherContext(element.url, element.line)
                                    } catch (exc) {}
                                    element.context || (element.context = [lines[i + 1]]), stack.push(element)
                                }
                            return stack.length ? {
                                name: ex.name,
                                message: ex.message,
                                url: document.location.href,
                                stack: stack
                            } : null
                        }
                    }

                    function computeStackTraceFromOperaMultiLineMessage(ex) {
                        var lines = ex.message.split("\n");
                        if (lines.length < 4) return null;
                        var parts, i, len, source, lineRE1 = /^\s*Line (\d+) of linked script ((?:file|https?)\S+)(?:: in function (\S+))?\s*$/i,
                            lineRE2 = /^\s*Line (\d+) of inline#(\d+) script in ((?:file|https?)\S+)(?:: in function (\S+))?\s*$/i,
                            lineRE3 = /^\s*Line (\d+) of function script\s*$/i,
                            stack = [],
                            scripts = document.getElementsByTagName("script"),
                            inlineScriptBlocks = [];
                        for (i in scripts) hasKey(scripts, i) && !scripts[i].src && inlineScriptBlocks.push(scripts[i]);
                        for (i = 2, len = lines.length; i < len; i += 2) {
                            var item = null;
                            if (parts = lineRE1.exec(lines[i])) item = {
                                url: parts[2],
                                func: parts[3],
                                line: +parts[1]
                            };
                            else if (parts = lineRE2.exec(lines[i])) {
                                item = {
                                    url: parts[3],
                                    func: parts[4]
                                };
                                var relativeLine = +parts[1],
                                    script = inlineScriptBlocks[parts[2] - 1];
                                if (script && (source = getSource(item.url))) {
                                    source = source.join("\n");
                                    var pos = source.indexOf(script.innerText);
                                    pos >= 0 && (item.line = relativeLine + source.substring(0, pos).split("\n").length)
                                }
                            } else if (parts = lineRE3.exec(lines[i])) {
                                var url = window.location.href.replace(/#.*$/, ""),
                                    line = parts[1],
                                    re = new RegExp(escapeCodeAsRegExpForMatchingInsideHTML(lines[i + 1]));
                                source = findSourceInUrls(re, [url]), item = {
                                    url: url,
                                    line: source ? source.line : line,
                                    func: ""
                                }
                            }
                            if (item) {
                                item.func || (item.func = guessFunctionName(item.url, item.line));
                                var context = gatherContext(item.url, item.line),
                                    midline = context ? context[Math.floor(context.length / 2)] : null;
                                context && midline.replace(/^\s*/, "") === lines[i + 1].replace(/^\s*/, "") ? item.context = context : item.context = [lines[i + 1]], stack.push(item)
                            }
                        }
                        return stack.length ? {
                            name: ex.name,
                            message: lines[0],
                            url: document.location.href,
                            stack: stack
                        } : null
                    }

                    function augmentStackTraceWithInitialElement(stackInfo, url, lineNo, message) {
                        var initial = {
                            url: url,
                            line: lineNo
                        };
                        if (initial.url && initial.line) {
                            stackInfo.incomplete = !1, initial.func || (initial.func = guessFunctionName(initial.url, initial.line)), initial.context || (initial.context = gatherContext(initial.url, initial.line));
                            var reference = / '([^']+)' /.exec(message);
                            if (reference && (initial.column = findSourceInLine(reference[1], initial.url, initial.line)),
                                stackInfo.stack.length > 0 && stackInfo.stack[0].url === initial.url) {
                                if (stackInfo.stack[0].line === initial.line) return !1;
                                if (!stackInfo.stack[0].line && stackInfo.stack[0].func === initial.func) return stackInfo.stack[0].line = initial.line, stackInfo.stack[0].context = initial.context, !1
                            }
                            return stackInfo.stack.unshift(initial), stackInfo.partial = !0, !0
                        }
                        return stackInfo.incomplete = !0, !1
                    }

                    function computeStackTraceByWalkingCallerChain(ex, depth) {
                        for (var parts, item, source, functionName = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, stack = [], funcs = {}, recursion = !1, curr = computeStackTraceByWalkingCallerChain.caller; curr && !recursion; curr = curr.caller)
                            if (curr !== computeStackTrace && curr !== TraceKit.report) {
                                if (item = {
                                        url: null,
                                        func: UNKNOWN_FUNCTION,
                                        line: null,
                                        column: null
                                    }, curr.name ? item.func = curr.name : (parts = functionName.exec(curr.toString())) && (item.func = parts[1]), "undefined" == typeof item.func) try {
                                    item.func = parts.input.substring(0, parts.input.indexOf("{"))
                                } catch (e) {}
                                if (source = findSourceByFunctionBody(curr)) {
                                    item.url = source.url, item.line = source.line, item.func === UNKNOWN_FUNCTION && (item.func = guessFunctionName(item.url, item.line));
                                    var reference = / '([^']+)' /.exec(ex.message || ex.description);
                                    reference && (item.column = findSourceInLine(reference[1], source.url, source.line))
                                }
                                funcs["" + curr] ? recursion = !0 : funcs["" + curr] = !0, stack.push(item)
                            }
                        depth && stack.splice(0, depth);
                        var result = {
                            name: ex.name,
                            message: ex.message,
                            url: document.location.href,
                            stack: stack
                        };
                        return augmentStackTraceWithInitialElement(result, ex.sourceURL || ex.fileName, ex.line || ex.lineNumber, ex.message || ex.description), result
                    }

                    function computeStackTrace(ex, depth) {
                        var stack = null;
                        depth = null == depth ? 0 : +depth;
                        try {
                            if (stack = computeStackTraceFromStacktraceProp(ex)) return stack
                        } catch (e) {
                            if (TraceKit.debug) throw e
                        }
                        try {
                            if (stack = computeStackTraceFromStackProp(ex)) return stack
                        } catch (e) {
                            if (TraceKit.debug) throw e
                        }
                        try {
                            if (stack = computeStackTraceFromOperaMultiLineMessage(ex)) return stack
                        } catch (e) {
                            if (TraceKit.debug) throw e
                        }
                        try {
                            if (stack = computeStackTraceByWalkingCallerChain(ex, depth + 1)) return stack
                        } catch (e) {
                            if (TraceKit.debug) throw e
                        }
                        return {
                            name: ex.name,
                            message: ex.message,
                            url: document.location.href
                        }
                    }
                    var sourceCache = {};
                    return computeStackTrace.augmentStackTraceWithInitialElement = augmentStackTraceWithInitialElement, computeStackTrace.computeStackTraceFromStackProp = computeStackTraceFromStackProp, computeStackTrace.guessFunctionName = guessFunctionName, computeStackTrace.gatherContext = gatherContext, computeStackTrace
                }();
                var lastCapturedException, lastEventId, globalServer, globalUser, globalKey, globalProject, _Raven = window.Raven,
                    hasJSON = !("object" != typeof JSON || !JSON.stringify),
                    globalOptions = {
                        logger: "javascript",
                        ignoreErrors: [],
                        ignoreUrls: [],
                        whitelistUrls: [],
                        includePaths: [],
                        crossOrigin: "anonymous",
                        collectWindowErrors: !0,
                        tags: {},
                        maxMessageLength: 100,
                        extra: {}
                    },
                    isRavenInstalled = !1,
                    objectPrototype = Object.prototype,
                    originalConsole = window.console || {},
                    originalConsoleMethods = {},
                    startTime = now();
                for (var method in originalConsole) originalConsoleMethods[method] = originalConsole[method];
                var Raven = {
                    VERSION: "1.1.22",
                    debug: !0,
                    noConflict: function() {
                        return window.Raven = _Raven, Raven
                    },
                    config: function(dsn, options) {
                        if (globalServer) return logDebug("error", "Error: Raven has already been configured"), Raven;
                        if (!dsn) return Raven;
                        var uri = parseDSN(dsn),
                            lastSlash = uri.path.lastIndexOf("/"),
                            path = uri.path.substr(1, lastSlash);
                        return options && each(options, function(key, value) {
                            globalOptions[key] = value
                        }), globalOptions.ignoreErrors.push(/^Script error\.?$/), globalOptions.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/), globalOptions.ignoreErrors = joinRegExp(globalOptions.ignoreErrors), globalOptions.ignoreUrls = !!globalOptions.ignoreUrls.length && joinRegExp(globalOptions.ignoreUrls), globalOptions.whitelistUrls = !!globalOptions.whitelistUrls.length && joinRegExp(globalOptions.whitelistUrls), globalOptions.includePaths = joinRegExp(globalOptions.includePaths), globalKey = uri.user, globalProject = uri.path.substr(lastSlash + 1), globalServer = "//" + uri.host + (uri.port ? ":" + uri.port : "") + "/" + path + "api/" + globalProject + "/store/", uri.protocol && (globalServer = uri.protocol + ":" + globalServer), globalOptions.fetchContext && (TraceKit.remoteFetching = !0), globalOptions.linesOfContext && (TraceKit.linesOfContext = globalOptions.linesOfContext), TraceKit.collectWindowErrors = !!globalOptions.collectWindowErrors, Raven
                    },
                    install: function() {
                        return isSetup() && !isRavenInstalled && (TraceKit.report.subscribe(handleStackInfo), isRavenInstalled = !0), Raven
                    },
                    context: function(options, func, args) {
                        return isFunction(options) && (args = func || [], func = options, options = undefined), Raven.wrap(options, func).apply(this, args)
                    },
                    wrap: function(options, func) {
                        function wrapped() {
                            for (var args = [], i = arguments.length, deep = !options || options && options.deep !== !1; i--;) args[i] = deep ? Raven.wrap(options, arguments[i]) : arguments[i];
                            try {
                                return func.apply(this, args)
                            } catch (e) {
                                throw Raven.captureException(e, options), e
                            }
                        }
                        if (isUndefined(func) && !isFunction(options)) return options;
                        if (isFunction(options) && (func = options, options = undefined), !isFunction(func)) return func;
                        if (func.__raven__) return func;
                        for (var property in func) hasKey(func, property) && (wrapped[property] = func[property]);
                        return wrapped.__raven__ = !0, wrapped.__inner__ = func, wrapped
                    },
                    uninstall: function() {
                        return TraceKit.report.uninstall(), isRavenInstalled = !1, Raven
                    },
                    captureException: function(ex, options) {
                        if (!isError(ex)) return Raven.captureMessage(ex, options);
                        lastCapturedException = ex;
                        try {
                            var stack = TraceKit.computeStackTrace(ex);
                            handleStackInfo(stack, options)
                        } catch (ex1) {
                            if (ex !== ex1) throw ex1
                        }
                        return Raven
                    },
                    captureMessage: function(msg, options) {
                        if (!globalOptions.ignoreErrors.test || !globalOptions.ignoreErrors.test(msg)) return send(objectMerge({
                            message: msg + ""
                        }, options)), Raven
                    },
                    setUserContext: function(user) {
                        return globalUser = user, Raven
                    },
                    setExtraContext: function(extra) {
                        return globalOptions.extra = extra || {}, Raven
                    },
                    setTagsContext: function(tags) {
                        return globalOptions.tags = tags || {}, Raven
                    },
                    setReleaseContext: function(release) {
                        return globalOptions.release = release, Raven
                    },
                    setDataCallback: function(callback) {
                        return globalOptions.dataCallback = callback, Raven
                    },
                    setShouldSendCallback: function(callback) {
                        return globalOptions.shouldSendCallback = callback, Raven
                    },
                    lastException: function() {
                        return lastCapturedException
                    },
                    lastEventId: function() {
                        return lastEventId
                    },
                    isSetup: function() {
                        return isSetup()
                    }
                };
                Raven.setUser = Raven.setUserContext;
                var dsnKeys = "source protocol user pass host port path".split(" "),
                    dsnPattern = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/;
                RavenConfigError.prototype = new Error, RavenConfigError.prototype.constructor = RavenConfigError;
                var ravenNotConfiguredError;
                afterLoad(), "function" == typeof define && define.amd ? (window.Raven = Raven, define("raven", [], function() {
                    return Raven
                })) : "object" == typeof module ? module.exports = Raven : "object" == typeof exports ? exports = Raven : window.Raven = Raven
            }("undefined" != typeof window ? window : this),
            function() {
                define("utils/reporter", ["env", "underscore", "models/user", "models/settings", "raven"], function(env, _, user, settings, Raven) {
                    var RAVEN_BASE_TAGS, getSanitizedUser;
                    return Raven = Raven.noConflict(), RAVEN_BASE_TAGS = {
                            version: env.VERSION,
                            hostname: window.location.hostname
                        }, Raven.config(env.sentryUrl, {
                            collectWindowErrors: !1,
                            tags: RAVEN_BASE_TAGS,
                            release: env.VERSION
                        }).install(), getSanitizedUser = function() {
                            var i, k, len, ref, userData;
                            for (userData = {
                                    uuid: user.toUUID()
                                }, ref = ["userId", "_ABGroup", "_variantGroup"], i = 0, len = ref.length; i < len; i++) k = ref[i], userData[k] = user.get(k);
                            return userData
                        }, Raven.setUserContext(getSanitizedUser()), user.on("change", function() {
                            return Raven.setUserContext(getSanitizedUser()), Raven.setTagsContext(_.extend({
                                appcuesId: settings.get("appcuesId")
                            }, RAVEN_BASE_TAGS))
                        }),
                        function(obj, options) {
                            return obj instanceof Error ? Raven.captureException(obj, options) : Raven.captureMessage(obj, options)
                        }
                })
            }.call(this),
            function() {
                define("client", ["underscore", "env", "models/settings", "reqwest", "utils/date", "utils/logger", "utils/reporter"], function(_, env, settings, request, date, logger, report) {
                    var APIClient;
                    return APIClient = function() {
                        function APIClient(options) {
                            this.options(options)
                        }
                        return APIClient.prototype.options = function(options) {
                            return 0 === arguments.length ? this._options : void(this._options = _.clone(options))
                        }, APIClient.prototype.urlRoot = function() {
                            var appcuesId;
                            return appcuesId = settings.get("appcuesId"), env.firebase + "/public/users/" + appcuesId
                        }, APIClient.prototype.url = function(resource) {
                            return this.urlRoot() + resource
                        }, APIClient.prototype.request = function(options) {
                            var req, start, url;
                            return start = date.now(), url = options.url, /^\//.test(url) && (options.url = this.url(url)), _.defaults(options, {
                                crossOrigin: !0,
                                type: "json"
                            }), req = request(options), req.catch(function(e) {
                                var data, msg, props;
                                if (msg = "API request failed.", props = ["response", "responseText", "responseType", "responseURL", "statusText", "status", "readyState"], data = _.extend({
                                        requestTime: date.now() - start
                                    }, _.pick(e, props), options), logger.log(msg, data), 100 * Math.random() <= 10) return report(msg, {
                                    extra: data
                                })
                            }), req
                        }, APIClient
                    }()
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("models/flow", ["client"], function(APIClient) {
                    var FlowClient;
                    return FlowClient = function(superClass) {
                        function FlowClient() {
                            return FlowClient.__super__.constructor.apply(this, arguments)
                        }
                        return extend(FlowClient, superClass), FlowClient.prototype.fetch = function(flowId) {
                            return this.request({
                                url: "/flows/" + flowId + ".json"
                            })
                        }, FlowClient
                    }(APIClient)
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("models/hotspot-group", ["client"], function(APIClient) {
                    var HotspotGroupClient;
                    return HotspotGroupClient = function(superClass) {
                        function HotspotGroupClient() {
                            return HotspotGroupClient.__super__.constructor.apply(this, arguments)
                        }
                        return extend(HotspotGroupClient, superClass), HotspotGroupClient.prototype.fetch = function(hotspotGroupId) {
                            return this.request({
                                url: "/hotspot-groups/" + hotspotGroupId + ".json"
                            })
                        }, HotspotGroupClient
                    }(APIClient)
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("models/coachmark-group", ["client"], function(APIClient) {
                    var CoachmarkGroupClient;
                    return CoachmarkGroupClient = function(superClass) {
                        function CoachmarkGroupClient() {
                            return CoachmarkGroupClient.__super__.constructor.apply(this, arguments)
                        }
                        return extend(CoachmarkGroupClient, superClass), CoachmarkGroupClient.prototype.fetch = function(coachmarkGroupId) {
                            return this.request({
                                url: "/coachmark-groups/" + coachmarkGroupId + ".json"
                            })
                        }, CoachmarkGroupClient
                    }(APIClient)
                })
            }.call(this), define("base64", [], function() {
                return {
                    map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                    encode: function(n) {
                        "use strict";
                        var i1, i2, i3, e1, e2, e3, e4, o = "",
                            i = 0,
                            m = this.map;
                        for (n = this.utf8.encode(n); i < n.length;) i1 = n.charCodeAt(i++), i2 = n.charCodeAt(i++), i3 = n.charCodeAt(i++), e1 = i1 >> 2, e2 = (3 & i1) << 4 | i2 >> 4, e3 = isNaN(i2) ? 64 : (15 & i2) << 2 | i3 >> 6, e4 = isNaN(i2) || isNaN(i3) ? 64 : 63 & i3, o = o + m.charAt(e1) + m.charAt(e2) + m.charAt(e3) + m.charAt(e4);
                        return o
                    },
                    utf8: {
                        encode: function(n) {
                            "use strict";
                            for (var c, o = "", i = 0, cc = String.fromCharCode; i < n.length;) c = n.charCodeAt(i++), o += c < 128 ? cc(c) : c > 127 && c < 2048 ? cc(c >> 6 | 192) + cc(63 & c | 128) : cc(c >> 12 | 224) + cc(c >> 6 & 63 | 128) + cc(63 & c | 128);
                            return o
                        }
                    }
                }
            }),
            function() {
                define('bootstrap', [], {
                    "defaultRules": {
                        "6666cd76f96956469e7be39d750cc7d9": {
                            "-KF7jDpXPPj5RO34tQdv": {
                                "contentType": "hotspot-group",
                                "createdAt": 1460435480207,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KF7jDpXPPj5RO34tQdv",
                                "isRegex": false,
                                "languages": "",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "from_appcues=-KF7jDpXPPj5RO34tQdv",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1462279083274,
                                "when": 0,
                                "where": "/",
                                "whereHash": "6666cd76f96956469e7be39d750cc7d9"
                            },
                            "-KGqb0jZeDSvqOMLdBJW": {
                                "contentType": "hotspot-group",
                                "createdAt": 1462278823125,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KGqb0jZeDSvqOMLdBJW",
                                "isRegex": false,
                                "languages": "",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "from_appcues=-KGqb0jZeDSvqOMLdBJW",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1462278880429,
                                "when": 0,
                                "where": "/",
                                "whereHash": "6666cd76f96956469e7be39d750cc7d9"
                            },
                            "-KIWWQLdsXjBsgegzhuf": {
                                "contentType": "hotspot-group",
                                "createdAt": 1464072521850,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KIWWQLdsXjBsgegzhuf",
                                "isRegex": false,
                                "languages": "",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "from_appcues=--KIWWQLdsXjBsgegzhuf",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1464086535095,
                                "when": 0,
                                "where": "/",
                                "whereHash": "6666cd76f96956469e7be39d750cc7d9"
                            }
                        },
                        "8781d43523a0670af09c51b32b3d3bb0": {
                            "-KKgyJuiWaalO8WVrGCQ": {
                                "contentType": "hotspot-group",
                                "createdAt": 1466412126072,
                                "domains": "",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KKgyJuiWaalO8WVrGCQ",
                                "isRegex": false,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466478437900,
                                "when": 0,
                                "where": "/brand#edit",
                                "whereHash": "8781d43523a0670af09c51b32b3d3bb0"
                            }
                        },
                        "a365b6a33c68c7bb40a3b0f23ea7bfc5": {
                            "-KLUv1tO5hwYgC9KK6yp": {
                                "contentType": "hotspot-group",
                                "createdAt": 1467266903846,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KLUv1tO5hwYgC9KK6yp",
                                "isRegex": false,
                                "languages": "en",
                                "nextContentId": "-KLUx9iG4gvJuzJXPWxO",
                                "properties": {
                                    "_currentPageUrl": {
                                        "operator": "*",
                                        "value": "utm_campaign=resurrection-1",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1467348112267,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "a365b6a33c68c7bb40a3b0f23ea7bfc5"
                            },
                            "-KLUx9iG4gvJuzJXPWxO": {
                                "contentType": "hotspot-group",
                                "createdAt": 1467267460181,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KLUx9iG4gvJuzJXPWxO",
                                "isRegex": false,
                                "languages": "en",
                                "properties": {
                                    "_currentPageUrl": {
                                        "operator": "*",
                                        "value": "utm_campaign=resurrection-1",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1467348021871,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "a365b6a33c68c7bb40a3b0f23ea7bfc5"
                            }
                        },
                        "regex": {
                            "-KFIl8k8w95A0osT-wKz": {
                                "contentType": "flow",
                                "createdAt": 1460620532869,
                                "domains": "www.canva-dev.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KFIl8k8w95A0osT-wKz",
                                "isRegex": true,
                                "languages": "en",
                                "nextContentId": "-KHMhUOPsRLk35lVNayU",
                                "shown": false,
                                "updatedAt": 1462838682817,
                                "when": 0,
                                "where": "appcue=-KFIl8k8w95A0osT-wKz",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KFIl8k8w95A0osT-wKz"
                            },
                            "-KFNEwQqgxK5CSuwco0w": {
                                "contentType": "hotspot-group",
                                "createdAt": 1460695713810,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KFNEwQqgxK5CSuwco0w",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "type=poster&appcue=-KFNEwQqgxK5CSuwco0w",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1465276154211,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KFNU98DGY8JvlBL7gQW": {
                                "contentType": "hotspot-group",
                                "createdAt": 1460699702118,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KFNU98DGY8JvlBL7gQW",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "$",
                                        "value": "type=poster&appcue=-KFNU98DGY8JvlBL7gQW",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1464591842757,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KFX0fKCKCnYW3OvilLd": {
                                "contentType": "hotspot-group",
                                "createdAt": 1460859745877,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KFX0fKCKCnYW3OvilLd",
                                "isRegex": true,
                                "languages": "",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "design/DABwskgCD3U/remix?from_appcues=-KFX0fKCKCnYW3OvilLd",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1461026274386,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KFavNitEffm_iblnSk0": {
                                "contentType": "hotspot-group",
                                "createdAt": 1460941981440,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KFavNitEffm_iblnSk0",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "type=poster&appcue=-KFavNitEffm_iblnSk0",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1464592376162,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KFb2AK14pV65BIoQm0I": {
                                "contentType": "hotspot-group",
                                "createdAt": 1460944025081,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KFb2AK14pV65BIoQm0I",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "type=poster&appcue=-KFb2AK14pV65BIoQm0I",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1464592388454,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KFrmkMkadmo_yYSmYWE": {
                                "contentType": "hotspot-group",
                                "createdAt": 1461224933014,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KFrmkMkadmo_yYSmYWE",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "appcue=-KFrmkMkadmo_yYSmYWE",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1465276535554,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KFrpHK83pp_iardnFEK": {
                                "contentType": "hotspot-group",
                                "createdAt": 1461225596421,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KFrpHK83pp_iardnFEK",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "appcue=-KFrpHK83pp_iardnFEK",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1464592457468,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KFrqcwT_kdoP-z-FxDR": {
                                "contentType": "hotspot-group",
                                "createdAt": 1461225951202,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KFrqcwT_kdoP-z-FxDR",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "appcue=-KFrqcwT_kdoP-z-FxDR",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1464592448910,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KFrrNFUDD-a7fFR3GqQ": {
                                "contentType": "hotspot-group",
                                "createdAt": 1461226144968,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KFrrNFUDD-a7fFR3GqQ",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "appcue=-KFrrNFUDD-a7fFR3GqQ",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1464592436166,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KGo70_BnDKSyFx-59aS": {
                                "contentType": "hotspot-group",
                                "createdAt": 1462237141574,
                                "domains": "www.canva-dev.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KGo70_BnDKSyFx-59aS",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "appcue=-KGo70_BnDKSyFx-59aS",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1462251327841,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KGoIUaaiRjx-QZJcZDV": {
                                "contentType": "hotspot-group",
                                "createdAt": 1462240148378,
                                "domains": "www.canva-dev.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KGoIUaaiRjx-QZJcZDV",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "appcue=-KGoIUaaiRjx-QZJcZDV",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1462760341292,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KH2NJuVJVSmxSJ4-_Wg": {
                                "contentType": "hotspot-group",
                                "createdAt": 1462493073361,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KH2NJuVJVSmxSJ4-_Wg",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "appcue=-KH2NJuVJVSmxSJ4-_Wg",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1463545698929,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KHSMGm52k3aO127hmal": {
                                "contentType": "flow",
                                "createdAt": 1462929005921,
                                "domains": "www.canva-dev.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KHSMGm52k3aO127hmal",
                                "isRegex": true,
                                "languages": "en",
                                "redirectUrl": "/design?create&type=socialMediaGraphic&appcue=-KHTUyMtbg1ZUmFYT7eq",
                                "shown": false,
                                "updatedAt": 1463095792652,
                                "when": 0,
                                "where": "appcue=-KHSMGm52k3aO127hmal",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KHSMGm52k3aO127hmal"
                            },
                            "-KHTUyMtbg1ZUmFYT7eq": {
                                "contentType": "hotspot-group",
                                "createdAt": 1462948062958,
                                "domains": "www.canva-dev.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KHTUyMtbg1ZUmFYT7eq",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "appcue=-KHTUyMtbg1ZUmFYT7eq",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1463095913352,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KHbrWCxz4YK9f1n2N71": {
                                "contentType": "flow",
                                "createdAt": 1463105230433,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KHbrWCxz4YK9f1n2N71",
                                "isRegex": true,
                                "languages": "en",
                                "nextContentId": "-KH2NJuVJVSmxSJ4-_Wg",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "type=presentation&appcue=-KHbrWCxz4YK9f1n2N71",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1463122573727,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KI0UWSmRYmRZvyGBpAx": {
                                "contentType": "hotspot-group",
                                "createdAt": 1463535147057,
                                "domains": "www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KI0UWSmRYmRZvyGBpAx",
                                "isRegex": true,
                                "languages": "",
                                "shown": false,
                                "updatedAt": 1464834454001,
                                "when": 0,
                                "where": "appcue=-KI0UWSmRYmRZvyGBpAx",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KI0UWSmRYmRZvyGBpAx"
                            },
                            "-KI1ztLlCVYMQEi8K47w": {
                                "contentType": "flow",
                                "createdAt": 1463560410925,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KI1ztLlCVYMQEi8K47w",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466469010612,
                                "when": 0,
                                "where": "appcue=-KI1ztLlCVYMQEi8K47w",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KI1ztLlCVYMQEi8K47w"
                            },
                            "-KI72p803i9LpBRvyhh7": {
                                "contentType": "flow",
                                "createdAt": 1463645328198,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KI72p803i9LpBRvyhh7",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468762869,
                                "when": 0,
                                "where": "appcue=-KI72p803i9LpBRvyhh7",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KI72p803i9LpBRvyhh7"
                            },
                            "-KI74usaaBfoTP-dSDsj": {
                                "contentType": "flow",
                                "createdAt": 1463645876053,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KI74usaaBfoTP-dSDsj",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468948525,
                                "when": 0,
                                "where": "appcue=-KI74usaaBfoTP-dSDsj",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KI74usaaBfoTP-dSDsj"
                            },
                            "-KI763F_O_23Hao7HgLI": {
                                "contentType": "flow",
                                "createdAt": 1463646176568,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KI763F_O_23Hao7HgLI",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470200560,
                                "when": 0,
                                "where": "appcue=-KI763F_O_23Hao7HgLI",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KI763F_O_23Hao7HgLI"
                            },
                            "-KI777VDQUbRL0N16J9X": {
                                "contentType": "flow",
                                "createdAt": 1463646456048,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KI777VDQUbRL0N16J9X",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470132832,
                                "when": 0,
                                "where": "appcue=-KI777VDQUbRL0N16J9X",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KI777VDQUbRL0N16J9X"
                            },
                            "-KI77yMOov2x1DT50q3c": {
                                "contentType": "flow",
                                "createdAt": 1463646676687,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KI77yMOov2x1DT50q3c",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466469907677,
                                "when": 0,
                                "where": "appcue=-KI77yMOov2x1DT50q3c",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KI77yMOov2x1DT50q3c"
                            },
                            "-KIAMQOvz3_mEcIbBsYO": {
                                "contentType": "flow",
                                "createdAt": 1463700797319,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KIAMQOvz3_mEcIbBsYO",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466469962646,
                                "when": 0,
                                "where": "appcue=-KIAMQOvz3_mEcIbBsYO",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KIAMQOvz3_mEcIbBsYO"
                            },
                            "-KIANI7kb_u6ovfUbah0": {
                                "contentType": "flow",
                                "createdAt": 1463701025545,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KIANI7kb_u6ovfUbah0",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468718031,
                                "when": 0,
                                "where": "appcue=-KIANI7kb_u6ovfUbah0",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KIANI7kb_u6ovfUbah0"
                            },
                            "-KIAOFO-9HANAo52QUK6": {
                                "contentType": "flow",
                                "createdAt": 1463701276514,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KIAOFO-9HANAo52QUK6",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470395301,
                                "when": 0,
                                "where": "appcue=-KIAOFO-9HANAo52QUK6",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KIAOFO-9HANAo52QUK6"
                            },
                            "-KIAOosOvhgeavZBni_j": {
                                "contentType": "flow",
                                "createdAt": 1463701425932,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KIAOosOvhgeavZBni_j",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470445598,
                                "when": 0,
                                "where": "appcue=-KIAOosOvhgeavZBni_j",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KIAOosOvhgeavZBni_j"
                            },
                            "-KIAPLA6I8V-RrZRVkfJ": {
                                "contentType": "flow",
                                "createdAt": 1463701562306,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KIAPLA6I8V-RrZRVkfJ",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470671924,
                                "when": 0,
                                "where": "appcue=-KIAPLA6I8V-RrZRVkfJ",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KIAPLA6I8V-RrZRVkfJ"
                            },
                            "-KIepPEX1KebHlqKIB9F": {
                                "contentType": "flow",
                                "createdAt": 1464228750813,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KIepPEX1KebHlqKIB9F",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "onboarding": {
                                        "operator": "*",
                                        "value": "appcues_homepage_onboarding_1",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470871461,
                                "when": 0,
                                "where": "/#onboarding=appcues",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "/#onboarding=appcues"
                            },
                            "-KJ4Y2w6Qccybhsrghmw": {
                                "contentType": "flow",
                                "createdAt": 1464676925775,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJ4Y2w6Qccybhsrghmw",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470718416,
                                "when": 0,
                                "where": "appcue=-KJ4Y2w6Qccybhsrghmw",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJ4Y2w6Qccybhsrghmw"
                            },
                            "-KJ8J-gEBYTG-x8VJGOL": {
                                "contentType": "flow",
                                "createdAt": 1464740088877,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJ8J-gEBYTG-x8VJGOL",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "onboarding": {
                                        "operator": "*",
                                        "value": "appcues_homepage_onboarding_4",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470838492,
                                "when": 0,
                                "where": "/#onboarding=appcues",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "/#onboarding=appcues"
                            },
                            "-KJDe7gZ002hDDE3RTv0": {
                                "createdAt": 1464829784580,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJDe7gZ002hDDE3RTv0",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "onboarding": {
                                        "operator": "*",
                                        "value": "appcues_homepage_onboarding_2",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470856209,
                                "when": 0,
                                "where": "/#onboarding=appcues",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "/#onboarding=appcues"
                            },
                            "-KJDjN0PxMbPOZOMmOHx": {
                                "createdAt": 1464831148549,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJDjN0PxMbPOZOMmOHx",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "onboarding": {
                                        "operator": "*",
                                        "value": "appcues_homepage_onboarding_3",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470883910,
                                "when": 0,
                                "where": "/#onboarding=appcues",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "/#onboarding=appcues"
                            },
                            "-KJDqrTegZ3pn-wpAdiC": {
                                "contentType": "hotspot-group",
                                "createdAt": 1464833115046,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJDqrTegZ3pn-wpAdiC",
                                "isRegex": true,
                                "languages": "",
                                "properties": {
                                    "_lastPageUrl": {
                                        "operator": "*",
                                        "value": "appcues=-KJDqrTegZ3pn-wpAdiC",
                                        "valuesList": ""
                                    }
                                },
                                "shown": false,
                                "updatedAt": 1464862998627,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KJDvNXxEbAzz2SQQjrW": {
                                "contentType": "hotspot-group",
                                "createdAt": 1464834296197,
                                "domains": "www.canva-dev.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJDvNXxEbAzz2SQQjrW",
                                "isRegex": true,
                                "languages": "en",
                                "shown": false,
                                "updatedAt": 1464839956479,
                                "when": 0,
                                "where": "appcue=-KJDvNXxEbAzz2SQQjrW",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJDvNXxEbAzz2SQQjrW"
                            },
                            "-KJEGQAOyeFNdlVNrcUF": {
                                "contentType": "hotspot-group",
                                "createdAt": 1464840074699,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJEGQAOyeFNdlVNrcUF",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "onboarding": {
                                        "operator": "*",
                                        "value": "appcues_first_design",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466476554562,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KJcWphjr50cHL-9CURo": {
                                "contentType": "flow",
                                "createdAt": 1465263808223,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcWphjr50cHL-9CURo",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468773119,
                                "when": 0,
                                "where": "appcue=-KJcWphjr50cHL-9CURo",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcWphjr50cHL-9CURo"
                            },
                            "-KJcXN895ua7C8QoI5PS": {
                                "contentType": "flow",
                                "createdAt": 1465263949351,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcXN895ua7C8QoI5PS",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468785224,
                                "when": 0,
                                "where": "appcue=-KJcXN895ua7C8QoI5PS",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcXN895ua7C8QoI5PS"
                            },
                            "-KJcXlWMaNtSNs5MilL8": {
                                "contentType": "flow",
                                "createdAt": 1465264053296,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcXlWMaNtSNs5MilL8",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468903117,
                                "when": 0,
                                "where": "appcue=-KJcXlWMaNtSNs5MilL8",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcXlWMaNtSNs5MilL8"
                            },
                            "-KJcXqeEeiPZ042NnTSK": {
                                "contentType": "flow",
                                "createdAt": 1465264074155,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcXqeEeiPZ042NnTSK",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470690946,
                                "when": 0,
                                "where": "appcue=-KJcXqeEeiPZ042NnTSK",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcXqeEeiPZ042NnTSK"
                            },
                            "-KJcY68-6rpkWZ9PmSzU": {
                                "contentType": "flow",
                                "createdAt": 1465264142439,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcY68-6rpkWZ9PmSzU",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468935404,
                                "when": 0,
                                "where": "appcue=-KJcY68-6rpkWZ9PmSzU",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcY68-6rpkWZ9PmSzU"
                            },
                            "-KJcYga1rkvp1xoY8mQw": {
                                "contentType": "flow",
                                "createdAt": 1465264294897,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcYga1rkvp1xoY8mQw",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470705463,
                                "when": 0,
                                "where": "appcue=-KJcYga1rkvp1xoY8mQw",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcYga1rkvp1xoY8mQw"
                            },
                            "-KJc_3tv5GFsfAnoQtHX": {
                                "contentType": "flow",
                                "createdAt": 1465264656580,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJc_3tv5GFsfAnoQtHX",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470638440,
                                "when": 0,
                                "where": "appcue=-KJc_3tv5GFsfAnoQtHX",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJc_3tv5GFsfAnoQtHX"
                            },
                            "-KJcb3vIOrb-PwWOsN2W": {
                                "contentType": "flow",
                                "createdAt": 1465265181127,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcb3vIOrb-PwWOsN2W",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470619623,
                                "when": 0,
                                "where": "appcue=-KJcb3vIOrb-PwWOsN2W",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcb3vIOrb-PwWOsN2W"
                            },
                            "-KJcbgTRh9sBy730UcE3": {
                                "contentType": "flow",
                                "createdAt": 1465265343098,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcbgTRh9sBy730UcE3",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470435274,
                                "when": 0,
                                "where": "appcue=-KJcbgTRh9sBy730UcE3",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcbgTRh9sBy730UcE3"
                            },
                            "-KJcbhCG8i5UR1JVLINc": {
                                "contentType": "flow",
                                "createdAt": 1465265346177,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcbhCG8i5UR1JVLINc",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470419418,
                                "when": 0,
                                "where": "appcue=-KJcbhCG8i5UR1JVLINc",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcbhCG8i5UR1JVLINc"
                            },
                            "-KJcc-yJsg7JVg3Qp8Yw": {
                                "contentType": "flow",
                                "createdAt": 1465265427895,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcc-yJsg7JVg3Qp8Yw",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468982393,
                                "when": 0,
                                "where": "appcue=-KJcc-yJsg7JVg3Qp8Yw",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcc-yJsg7JVg3Qp8Yw"
                            },
                            "-KJccbZMph3gWtN3KXT-": {
                                "contentType": "flow",
                                "createdAt": 1465265585249,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJccbZMph3gWtN3KXT-",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470382218,
                                "when": 0,
                                "where": "appcue=-KJccbZMph3gWtN3KXT-",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJccbZMph3gWtN3KXT-"
                            },
                            "-KJcctyqKEBFQrF3UijB": {
                                "contentType": "flow",
                                "createdAt": 1465265661649,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcctyqKEBFQrF3UijB",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468996249,
                                "when": 0,
                                "where": "appcue=-KJcctyqKEBFQrF3UijB",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcctyqKEBFQrF3UijB"
                            },
                            "-KJcdTX5Iq_s1UAUz3DF": {
                                "contentType": "flow",
                                "createdAt": 1465265810474,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcdTX5Iq_s1UAUz3DF",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470216790,
                                "when": 0,
                                "where": "appcue=-KJcdTX5Iq_s1UAUz3DF",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcdTX5Iq_s1UAUz3DF"
                            },
                            "-KJcdchR22s0A5UJ1jqX": {
                                "contentType": "flow",
                                "createdAt": 1465265851849,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcdchR22s0A5UJ1jqX",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470344714,
                                "when": 0,
                                "where": "appcue=-KJcdchR22s0A5UJ1jqX",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcdchR22s0A5UJ1jqX"
                            },
                            "-KJceRS-p7hxBtYqKPgu": {
                                "createdAt": 1465266071817,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KJceRS-p7hxBtYqKPgu",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470231786,
                                "when": 0,
                                "where": "appcue=-KJceRS-p7hxBtYqKPgu",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJceRS-p7hxBtYqKPgu"
                            },
                            "-KJcgNauK1P6btGbiyzw": {
                                "contentType": "flow",
                                "createdAt": 1465266572376,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcgNauK1P6btGbiyzw",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468678520,
                                "when": 0,
                                "where": "appcue=-KJcgNauK1P6btGbiyzw",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcgNauK1P6btGbiyzw"
                            },
                            "-KJcgQntKToIt9AXEKOx": {
                                "contentType": "flow",
                                "createdAt": 1465266585247,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcgQntKToIt9AXEKOx",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466468698450,
                                "when": 0,
                                "where": "appcue=-KJcgQntKToIt9AXEKOx",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcgQntKToIt9AXEKOx"
                            },
                            "-KJcgpVF-NHBCCbOExz2": {
                                "contentType": "flow",
                                "createdAt": 1465266691179,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcgpVF-NHBCCbOExz2",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470151072,
                                "when": 0,
                                "where": "appcue=-KJcgpVF-NHBCCbOExz2",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcgpVF-NHBCCbOExz2"
                            },
                            "-KJchJVkGU4sTmfdjmek": {
                                "contentType": "flow",
                                "createdAt": 1465266817799,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJchJVkGU4sTmfdjmek",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466469979921,
                                "when": 0,
                                "where": "appcue=-KJchJVkGU4sTmfdjmek",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJchJVkGU4sTmfdjmek"
                            },
                            "-KJchNHF8d3mwcTsayU1": {
                                "contentType": "flow",
                                "createdAt": 1465266833315,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJchNHF8d3mwcTsayU1",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466469992544,
                                "when": 0,
                                "where": "appcue=-KJchNHF8d3mwcTsayU1",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJchNHF8d3mwcTsayU1"
                            },
                            "-KJchQlUP3INnEbLYTYI": {
                                "contentType": "flow",
                                "createdAt": 1465266848556,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJchQlUP3INnEbLYTYI",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466470162495,
                                "when": 0,
                                "where": "appcue=-KJchQlUP3INnEbLYTYI",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJchQlUP3INnEbLYTYI"
                            },
                            "-KJchtsEkU5T0bamzQvU": {
                                "contentType": "flow",
                                "createdAt": 1465266971181,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJchtsEkU5T0bamzQvU",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466469930654,
                                "when": 0,
                                "where": "appcue=-KJchtsEkU5T0bamzQvU",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJchtsEkU5T0bamzQvU"
                            },
                            "-KJcinrnYCUlhWz7kEVj": {
                                "contentType": "flow",
                                "createdAt": 1465267208834,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJcinrnYCUlhWz7kEVj",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1466469894118,
                                "when": 0,
                                "where": "appcue=-KJcinrnYCUlhWz7kEVj",
                                "whereHash": "regex",
                                "whereOperator": "*",
                                "whereString": "appcue=-KJcinrnYCUlhWz7kEVj"
                            },
                            "-KJn_e07FysR_qBlIzOV": {
                                "contentType": "flow",
                                "createdAt": 1465449357648,
                                "domains": "www.canva-dev.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KJn_e07FysR_qBlIzOV",
                                "isRegex": true,
                                "languages": "en",
                                "properties": {
                                    "_currentPageUrl": {
                                        "operator": "*",
                                        "value": "utm_campaign=test_hjsgdjha",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1465449688552,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KJndf0q3g0zfujgLyfu": {
                                "contentType": "flow",
                                "createdAt": 1465450410775,
                                "domains": "canva.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KJndf0q3g0zfujgLyfu",
                                "isRegex": true,
                                "languages": "en",
                                "nextContentId": "-KJnjKmanrgQ1HLOcUz6",
                                "properties": {
                                    "_currentPageUrl": {
                                        "operator": "*",
                                        "value": "utm_campaign=presentation-G5",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1465534728145,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KJnjKmanrgQ1HLOcUz6": {
                                "contentType": "hotspot-group",
                                "createdAt": 1465451896163,
                                "domains": "www.canva-dev.com",
                                "for": 0,
                                "frequency": "every_time",
                                "id": "-KJnjKmanrgQ1HLOcUz6",
                                "isRegex": true,
                                "languages": "en",
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1465462328090,
                                "when": 0,
                                "where": "/templates/.*/copy",
                                "whereHash": "regex"
                            },
                            "-KJoLQYue536dHfisLXe": {
                                "contentType": "flow",
                                "createdAt": 1465462143379,
                                "domains": "canva.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KJoLQYue536dHfisLXe",
                                "isRegex": true,
                                "languages": "en",
                                "nextContentId": "-KJnjKmanrgQ1HLOcUz6",
                                "properties": {
                                    "_currentPageUrl": {
                                        "operator": "*",
                                        "value": "utm_campaign=presentation-G4",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1465534453222,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KJrx1rjP0AX2IUi20qX": {
                                "contentType": "flow",
                                "createdAt": 1465522597755,
                                "domains": "canva.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KJrx1rjP0AX2IUi20qX",
                                "isRegex": true,
                                "languages": "en",
                                "nextContentId": "-KJnjKmanrgQ1HLOcUz6",
                                "properties": {
                                    "_currentPageUrl": {
                                        "operator": "*",
                                        "value": "utm_campaign=presentation-G3",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1465534103355,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KJrzfNWNKW83aArr8-r": {
                                "contentType": "flow",
                                "createdAt": 1465523287928,
                                "domains": "canva.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KJrzfNWNKW83aArr8-r",
                                "isRegex": true,
                                "languages": "en",
                                "nextContentId": "-KJnjKmanrgQ1HLOcUz6",
                                "properties": {
                                    "_currentPageUrl": {
                                        "operator": "*",
                                        "value": "utm_campaign=presentation-G2",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1465534108346,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KJs-qNraLzW3Jptk1k0": {
                                "contentType": "flow",
                                "createdAt": 1465523596217,
                                "domains": "canva.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KJs-qNraLzW3Jptk1k0",
                                "isRegex": true,
                                "languages": "en",
                                "nextContentId": "-KJnjKmanrgQ1HLOcUz6",
                                "properties": {
                                    "_currentPageUrl": {
                                        "operator": "*",
                                        "value": "utm_campaign=presentation-G1",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1465534254940,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KJs4kl3-K_kY9q8sdtt": {
                                "contentType": "flow",
                                "createdAt": 1465524882977,
                                "domains": "canva.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KJs4kl3-K_kY9q8sdtt",
                                "isRegex": true,
                                "languages": "en",
                                "nextContentId": "-KJnjKmanrgQ1HLOcUz6",
                                "properties": {
                                    "_currentPageUrl": {
                                        "operator": "*",
                                        "value": "utm_campaign=presentation-G6",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1465951876821,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            },
                            "-KLUqWWxOD8l9pEkoF22": {
                                "contentType": "hotspot-group",
                                "createdAt": 1467265718599,
                                "domains": "canva.com,www.canva-dev.com,www.canva.com",
                                "for": 0,
                                "frequency": "once",
                                "id": "-KLUqWWxOD8l9pEkoF22",
                                "isRegex": true,
                                "languages": "en",
                                "nextContentId": "-KLUv1tO5hwYgC9KK6yp",
                                "properties": {
                                    "_currentPageUrl": {
                                        "operator": "*",
                                        "value": "utm_campaign=resurrection-1",
                                        "valuesList": ""
                                    }
                                },
                                "redirectNewTab": false,
                                "shown": false,
                                "updatedAt": 1467348127088,
                                "when": 0,
                                "where": "/design/.*/edit",
                                "whereHash": "regex"
                            }
                        }
                    },
                    "goals": {},
                    "account": {
                        "isTrial": false,
                        "isTrialExpired": false,
                        "stripePlanId": "canvacustom",
                        "keenScopedKeyWrite": "cd045dd6e0a1c1bc6fde889e6b05fe8e4af22c01c7d909735290a8325d8d5a40e78e5c41c4c7e36eeba4355b9abd741393d0e1fdfe2afacee9c43aad9078d50fc1160f99e1db14f3a987963497c6fc4b2e6d59478ac5ed4cc64d28e5acc544eedbd94be2b30a523d7a7d159cf7404733725477a47ac3cf1e00c3bcfa772a980c7a9aa6eae44c6a07318c70c5ab4a1c4c",
                        "uuid": "b0a8110f-9d14-49ef-b5d5-0e88de4c4256"
                    },
                    "integrations": {
                        "segment": {
                            "id": "segment",
                            "integrationId": "17221:segment",
                            "isEnabled": true
                        }
                    },
                    "styling": {
                        "globalStyling": "@import url(\"https://fonts.googleapis.com/css?family=Open+Sans:400,300,400italic,600\");\n\n.appcues-actions-right > .appcues-button.appcues-button-success, .appcues-progress-bar-success {\n    background-color: #99c432;\n}\n.appcues-actions-right > .appcues-button.appcues-button-success:hover {\n    background-color: #a9d149;\n}\n.appcues-actions-left >  .appcues-button {\n    background-color: #99c432;\n}\n.appcues-actions-left > .appcues-button:hover {\n    background-color: #a9d149;\n}\n.appcues-actions-right .appcues-button:hover, .appcues-actions-left .appcues-button:hover {\n    color: #ffffff;\n}\n.appcues-backdrop[data-pattern-type=left], .appcues-backdrop[data-pattern-type=modal] {\n    opacity: 0.35;\n}\n.appcues-progress {\n    display: none;\n}\nappcues cue {\n    -moz-border-radius-topleft: 3px;\n    -webkit-border-top-left-radius: 3px;\n    border-top-left-radius: 3px;\n    -moz-border-radius-topright: 3px;\n    -webkit-border-top-right-radius: 3px;\n    border-top-right-radius: 3px;\n}\nappcues[data-pattern-type='left'] .appcues-skip {\n    margin: 0;\n}\nappcues, appcues-layer, .tooltip {\n    font-family: 'Open Sans';\n}\n\ncue{\n    padding-left: 30px!important;\n    padding-right: 30px!important;\n    font-family: 'Open Sans';\n    font-size:16px;\n    text-align: center;\n}\n\ncue h2{\n    font-size: 32px;\n    line-height: 44px;\n    margin: 20px 0;\n    font-weight: 300;\n}\n\ncue p{\n    font-size: 14.4px;\n    border-radius: 8px;\n    line-height: 24px;\n}\n\ncue img{\n    /*margin-bottom: 20px;*/\n    margin: 20px 0;\n}\n\na[data-step=\"skip\"] {\n    background-color: transparent;\n}\n\nblockquote, div, dl, ol, p, pre, table, ul {\n    font-size: 14.4px;\n    line-height: 24px;\n}\n\nappcues cue .appcues-actions {\n    padding-left: 30px;\n     padding-right: 30px;\n     text-align:right;\n     background: #FFF;\n     /*border-top: 1px solid #D0D1D3;*/\n     border-radius: 0 0 5px 5px;\n}\n\nappcues cue .appcues-actions-left, appcues cue .appcues-actions-right {\n     width: auto;\n}\n\n.appcues-button[data-step=prev]:before, .appcues-button[data-step=next]:after {\n    position: absolute;\n    top: 6;\n    bottom: 0;\n    padding: 8px 10px;\n    line-height: 20px;\n}\n.step-action-buttons .appcues-button[data-step=prev]:before,\n.appcues-button[data-step=prev]:before {\n    border-right: 0;\n    top: 3px;\n    /*right: 5px;*/\n}\n\n.step-action-buttons .appcues-button[data-step=next]:after,\n.appcues-button[data-step=next]:after {\n    border-left: 0;\n    top: 3px;\n    /*right: 5px;*/\n}\n\nappcues cue .appcues-actions {\n    padding-left: 30px;\n    padding-right: 30px;\n    text-align: left;\n    background: #FFF;\n    /*border-top: 1px solid #D0D1D3;*/\n    border-radius: 0 0 5px 5px;\n}\n\n.step-action-buttons .appcues-button, .appcues-button {\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    background-color: #99c432;\n    border: 2px solid transparent;\n    border-radius: 5px;\n    box-sizing: border-box;\n    color: #fff;\n    cursor: pointer;\n    display: inline-block;\n    font-family: Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif;\n    font-weight: 400;\n    margin: 0;\n    min-width: 2.78572em;\n    line-height: 2.78572;\n    outline-width: 0;\n    padding: 0 1em;\n    position: relative;\n    text-align: center;\n    text-decoration: none;\n    transition: background-color .15s,border-color .15s,color .15s;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n\nappcues cue .appcues-actions-right {\n    text-align: right;\n    float: right;\n    /*text-align: center;\n    display: block;*/\n}\nappcues cue,\ncue.step-action, div.step>.step-action{\n    padding-bottom: 100px;\n}\n\n.content .panel {\n    box-sizing: border-box;\n}\n\n.panel .panel-content-actions .appcues-actions-left{\n    display: none;\n}\n\n.tooltip .panel{\n    color:#4e5662;\n    padding: 20px;\n    border-radius: 8px;\n    box-shadow: 0 0 0 0 rgba(0,0,0,0);\n    border:0;\n    -webkit-filter: drop-shadow(0 0 3px rgba(0,0,0,0.4));\n    filter: drop-shadow(0 0 3px rgba(0,0,0,0.4));\n    margin-right: 5px;\n    margin-left: 5px;\n    /*border:1px solid #DADADA;\n    box-shadow: 0px 0px 5px 0px rgba(0,0,0,.4);*/\n}\n\n\n.tooltip .appcues-actions-left small{\n    display:none;\n}\n\n.tooltip .content.content-bottom .panel:before, .content.content-bottom-left .panel:before, .content.content-bottom-right .panel:before {\n    border-bottom: 10px solid #fff;\n\n}\n\n.tooltip .panel .panel-content-actions .appcues-actions-right{\n    width: 100%;\n    display: block;\n    padding:0;\n\n}\n\n.tooltip .panel .panel-content-actions .appcues-actions-right a{\n    display: block;\n    font-weight:400;\n    font-size: 14.4px;\n    line-height: 24px;\n}\n\n.tooltip .panel p{\n    margin-bottom: 10px;\n}\n.tooltip .panel h2{\n    font-weight:300;\n    font-size: 24px;\n    line-height: 32px;\n    color:#4e5662;\n    margin-bottom: 10px;\n}\n\n.content.content-top .panel:before,\n.content.content-top-left .panel:before,\n.content.content-top-right .panel:before {\n    border-top: 10px solid #fff;\n}\n",
                        "globalBeaconColor": "#99c432",
                        "globalBeaconStyle": "hidden"
                    }
                })
            }.call(this),
            function() {
                define("analytics", ["underscore", "env", "models/user", "models/settings", "base64", "utils/reporter", "bootstrap"], function(_, env, user, settings, base64, report, bootstrap) {
                    var AnalyticsClient, client, projectId, ref, writeKey;
                    return projectId = env.keenProjectId, writeKey = null != bootstrap && null != (ref = bootstrap.account) ? ref.keenScopedKeyWrite : void 0, writeKey || (writeKey = env.keenWriteKey), AnalyticsClient = function() {
                        function AnalyticsClient(projectId1, writeKey1) {
                            this.projectId = projectId1, this.writeKey = writeKey1
                        }
                        return AnalyticsClient.prototype.baseKeenUrl = env.keenUrl + "/3.0/projects", AnalyticsClient.prototype.segmentTrack = function(eventName, eventProperties) {
                            var data, properties, url;
                            return null == eventProperties && (eventProperties = {}), properties = _.extend(eventProperties, {
                                accountId: settings.get("appcuesId")
                            }), data = {
                                writeKey: env.segmentWriteKey,
                                userId: user.get("userId"),
                                event: eventName,
                                properties: properties
                            }, url = this.url(env.segmentUrl, data), this.createPixel(url, null, null, "Segment analytics tracking failed.")
                        }, AnalyticsClient.prototype.track = function(collectionId, attrs, callback) {
                            var appcuesId;
                            return null == attrs && (attrs = {}), appcuesId = settings.get("appcuesId"), this.singleTrack(collectionId, attrs, callback), this.singleTrack("account-" + appcuesId, attrs, callback)
                        }, AnalyticsClient.prototype.singleTrack = function(collectionId, attrs, callback) {
                            var data, url;
                            return null == attrs && (attrs = {}), data = this.parse(attrs), url = this.keenUrl(collectionId, data), this.createPixel(url, data, callback, "Analytics tracking failed.")
                        }, AnalyticsClient.prototype.createPixel = function(url, data, callback, errorMessage) {
                            var img;
                            return img = new Image, _.isFunction(callback) || (callback = function() {}), img.onload = function() {
                                return callback(null, {
                                    data: data,
                                    url: url
                                })
                            }, img.onerror = img.onabort = function() {
                                var e;
                                return e = new Error(errorMessage), report(e, {
                                    extra: data,
                                    tags: {
                                        url: url
                                    }
                                }), callback(e, {
                                    data: data,
                                    url: url
                                })
                            }, img.src = url, img
                        }, AnalyticsClient.prototype.parse = function(attrs) {
                            return _.extend({}, attrs, {
                                VERSION: env.VERSION,
                                identity: _.extend({
                                    _ip: "${keen.ip}"
                                }, user.get()),
                                appcuesId: settings.get("appcuesId")
                            })
                        }, AnalyticsClient.prototype.keenUrl = function(collectionId, data) {
                            return this.url(this.baseKeenUrl + "/" + this.projectId + "/events/" + collectionId + "?api_key=" + this.writeKey + "&data=", data)
                        }, AnalyticsClient.prototype.url = function(baseUrl, data) {
                            var base64Data, encodedData;
                            return base64Data = base64.encode(JSON.stringify(data)), encodedData = encodeURIComponent(base64Data), "" + baseUrl + encodedData
                        }, AnalyticsClient.prototype.createRedirectUrl = function(collectionId, attrs, redirect) {
                            var data;
                            return data = this.parse(attrs), this.keenUrl(collectionId, data) + "&redirect=" + redirect
                        }, AnalyticsClient
                    }(), client = new AnalyticsClient(projectId, writeKey), client.AnalyticsClient = AnalyticsClient, client
                })
            }.call(this),
            function() {
                define("utils/urls", [], function() {
                    var matchOperatorsRe, urlRegEx;
                    return matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g, urlRegEx = /(https?:\/\/)?([a-zA-Z0-9-\.]+)?(:[0-9]+)?(\/?.+)?/, {
                        getHostname: function(link) {
                            var hostname;
                            return link ? (hostname = urlRegEx.exec(link)[2], hostname ? hostname : null) : window.location.hostname
                        },
                        getPath: function(link) {
                            var path, splitter;
                            return link ? (path = urlRegEx.exec(link)[4], null == path && (path = "")) : (splitter = "file:" === window.location.protocol ? location.origin : location.host, path = location.href.split(splitter)[1]), this.removeAppcueQuery(path)
                        },
                        removeAppcueQuery: function(link) {
                            return link ? link.replace(/appcue=[^&#]+&?/, "").replace(/\?#/, "#").replace(/#$/, "").replace(/&$/, "").replace(/\?$/, "") : link
                        },
                        getAppcueQuery: function(link) {
                            var queries;
                            return queries = this.queryStrToObj(link), queries.appcue
                        },
                        domainMatches: function(domain) {
                            return !domain || domain === this.getHostname()
                        },
                        domainsMatch: function(domainsStr) {
                            var domain, domainRe, hostname, i, len, ref, sanitizedStr, wildcardRegex;
                            if (domainsStr && "[object String]" === Object.prototype.toString.call(domainsStr)) {
                                for (sanitizedStr = domainsStr.replace(/\s/g, "").replace(/,$/, ""), hostname = this.getHostname(), ref = sanitizedStr.split(","), i = 0, len = ref.length; i < len; i++) {
                                    if (domain = ref[i], domain === hostname) return !0;
                                    if (wildcardRegex = /^\*\./, wildcardRegex.test(domain) && (domainRe = domain.replace(wildcardRegex, "").replace(matchOperatorsRe, "\\$&"), new RegExp(domainRe).test(hostname))) return !0
                                }
                                return !1
                            }
                            return !0
                        },
                        regexPathMatches: function(regexStr, path) {
                            return null != regexStr && null != path && RegExp(regexStr, "i").test(path)
                        },
                        queryStrToObj: function(str) {
                            var i, len, obj, param, params, parts;
                            if (null == str && (str = window.location.search), obj = {}, null == str) return obj;
                            for (params = str.replace(/^\?/, "").split("&"), i = 0, len = params.length; i < len; i++) param = params[i], parts = param.split("="), obj[parts[0]] = decodeURIComponent(parts[1]);
                            return obj
                        }
                    }
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("collections/goals", ["analytics", "client", "models/user", "utils/date", "utils/urls", "utils/reporter", "utils/logger", "es6-promise", "underscore", "bootstrap"], function(analytics, APIClient, user, date, urls, report, logger, ES6Promise, _, bootstrap) {
                    var Goals;
                    return new(Goals = function(superClass) {
                        function Goals() {
                            return Goals.__super__.constructor.apply(this, arguments)
                        }
                        return extend(Goals, superClass), Goals.prototype.fetch = function() {
                            var request;
                            return this._fetched = !1, request = _.bind(this.request, this), new ES6Promise.Promise(function(resolve, reject) {
                                var data;
                                return bootstrap && bootstrap.goals ? (data = bootstrap.goals, logger.log("Using bootstrapped goals data", data), resolve(data)) : (logger.log("No bootstrapped goals data found. Fetching from server."), request({
                                    method: "get",
                                    url: "/goals.json"
                                }).then(resolve, reject))
                            }).then(function(_this) {
                                return function(goals) {
                                    return _this.goals = goals, _this._fetched = !0
                                }
                            }(this)).catch(function(e) {
                                return logger.log("Failed to fetch goals.", e), report(e)
                            })
                        }, Goals.prototype.track = function() {
                            var track;
                            if (_.isObject(this.goals)) return track = _.bind(this._trackGoal, this), _.each(this.goals, function(goal) {
                                return track(goal)
                            })
                        }, Goals.prototype._trackGoal = function(goal) {
                            if (this._isMatch(goal)) return analytics.track(goal.flowId, {
                                actionId: "flow_conversion",
                                timestamp: date.now()
                            })
                        }, Goals.prototype._isMatch = function(goal) {
                            return null != goal.where && (goal.isRegex ? urls.regexPathMatches(goal.where, urls.getPath()) : urls.getPath() === goal.where)
                        }, Goals.prototype.loaded = function() {
                            return this._fetched
                        }, Goals
                    }(APIClient))
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("collections/user-history", ["client", "utils/logger", "models/user", "underscore"], function(APIClient, logger, user, _) {
                    var UserHistory;
                    return UserHistory = function(superClass) {
                        function UserHistory(options) {
                            null == options && (options = {}), this.options(options), this.history = {}
                        }
                        return extend(UserHistory, superClass), UserHistory.prototype.urlRoot = function() {
                            return UserHistory.__super__.urlRoot.call(this) + "/userhistory"
                        }, UserHistory.prototype.fetchFlows = function() {
                            var uuid;
                            return logger.log("Fetching user history for flows"), uuid = user.toUUID(), this.request({
                                method: "get",
                                url: "/" + uuid + "/flows.json"
                            })
                        }, UserHistory.prototype.fetchHotspotGroups = function() {
                            var uuid;
                            return logger.log("Fetching user history for hotspot groups"), uuid = user.toUUID(), this.request({
                                method: "get",
                                url: "/" + uuid + "/hotspot-groups.json"
                            })
                        }, UserHistory.prototype.fetchCoachmarkGroups = function() {
                            var uuid;
                            return logger.log("Fetching user history for coachmark groups"), uuid = user.toUUID(), this.request({
                                method: "get",
                                url: "/" + uuid + "/coachmark-groups.json"
                            })
                        }, UserHistory.prototype.markFlowsViewed = function(flows) {
                            var uuid;
                            return logger.log("Marking additional flows as viewed"), uuid = user.toUUID(), this.request({
                                url: "/" + uuid + "/flows.json?x-http-method-override=PATCH&print=silent",
                                method: "post",
                                data: JSON.stringify(flows)
                            })
                        }, UserHistory.prototype.updateHotspotGroupState = function(hotspotGroupId, state) {
                            var uuid;
                            return "started" !== state && "completed" !== state && logger.warn("Tried to update hotspot-group state with unknown state value: " + state + "."), logger.log("Updating hotspot-group state -- " + hotspotGroupId + ": " + state + "."), uuid = user.toUUID(), this.request({
                                url: "/" + uuid + "/hotspot-groups/" + hotspotGroupId + ".json?x-http-method-override=PATCH&print=silent",
                                method: "post",
                                data: JSON.stringify({
                                    state: state
                                })
                            })
                        }, UserHistory.prototype.markHotspotsViewed = function(hotspotGroupId, hotspots) {
                            var uuid;
                            return logger.log("Marking hotspots as viewed -- groupId: " + hotspotGroupId + ". hotspotIds: " + _.keys(hotspots) + "."), uuid = user.toUUID(), this.request({
                                url: "/" + uuid + "/hotspot-groups/" + hotspotGroupId + "/hotspots.json?x-http-method-override=PATCH&print=silent",
                                method: "post",
                                data: JSON.stringify(hotspots)
                            })
                        }, UserHistory.prototype.updateCoachmarkGroupState = function(coachmarkGroupId, state) {
                            var uuid;
                            return "started" !== state && "completed" !== state && logger.warn("Tried to update coachmark-group state with unknown state value: " + state + "."), logger.log("Marking coachmark-group " + coachmarkGroupId + " as " + state + "."), uuid = user.toUUID(), this.request({
                                url: "/" + uuid + "/coachmark-groups/" + coachmarkGroupId + ".json?x-http-method-override=PATCH&print=silent",
                                method: "post",
                                data: JSON.stringify({
                                    state: state
                                })
                            })
                        }, UserHistory.prototype.markCoachmarksViewed = function(coachmarkGroupId, hotspots) {
                            var uuid;
                            return logger.log("Marking coachmarks in " + coachmarkGroupId + " as viewed: " + _.keys(hotspots) + "."), uuid = user.toUUID(), this.request({
                                url: "/" + uuid + "/coachmark-groups/" + coachmarkGroupId + "/hotspots.json?x-http-method-override=PATCH&print=silent",
                                method: "post",
                                data: JSON.stringify(hotspots)
                            })
                        }, UserHistory
                    }(APIClient)
                })
            }.call(this),
            function() {
                define("utils/string", [], function() {
                    return {
                        contains: function(str, needle) {
                            if (null != str && null != needle) return String(str).indexOf(needle) !== -1
                        },
                        startsWith: function(str, needle) {
                            return 0 === str.lastIndexOf(needle, 0)
                        },
                        endsWith: function(str, needle) {
                            var lastIndex, pos;
                            return pos = str.length - needle.length, lastIndex = str.indexOf(needle, pos), lastIndex !== -1 && lastIndex === pos
                        }
                    }
                })
            }.call(this),
            function() {
                var indexOf = [].indexOf || function(item) {
                    for (var i = 0, l = this.length; i < l; i++)
                        if (i in this && this[i] === item) return i;
                    return -1
                };
                define("utils/utils", ["utils/string", "underscore", "utils/date"], function(strUtils, _, date) {
                    var _castToType, _coerceDate, _contains, _correctArgumentTypes, _parseNumber, _stringToBool, deepClone, isValidNumber;
                    return _stringToBool = function(str) {
                        if ("string" != typeof str) return str;
                        switch (str.toLowerCase()) {
                            case "true":
                                return !0;
                            case "false":
                                return !1;
                            default:
                                return str
                        }
                    }, _parseNumber = function(val) {
                        var res;
                        return /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(val) ? (res = Number(val), isNaN(res) ? val : res) : val
                    }, _coerceDate = function(val) {
                        switch (val = _parseNumber(val), typeof val) {
                            case "string":
                                return new Date(Date.parse(val));
                            case "number":
                                return String(val).length <= 10 ? new Date(1e3 * val) : new Date(val);
                            default:
                                return new Date(val)
                        }
                    }, isValidNumber = function(num) {
                        return "number" == typeof num && !isNaN(num)
                    }, _castToType = function(value, targetType) {
                        if (null == value) return value;
                        if (!targetType) return value;
                        switch (targetType) {
                            case "number":
                                return _parseNumber(value);
                            case "string":
                                return String(value);
                            case "boolean":
                                return _stringToBool(value);
                            default:
                                return value
                        }
                    }, _correctArgumentTypes = function(a, b) {
                        var aBool, aNum, bBool, bDateStr, bNum;
                        if (null == a && null == b && "" === a && "" === b) return [_castToType(a, "string"), _castToType(b, "string")];
                        if (a instanceof Date) try {
                            return bDateStr = new Date(_castToType(b, "string")).toISOString(), [a.toISOString(), bDateStr]
                        } catch (_error) {}
                        return aNum = _castToType(a, "number"), bNum = _castToType(b, "number"), isValidNumber(aNum) && isValidNumber(bNum) ? [aNum, bNum] : (aBool = _castToType(a, "boolean"), bBool = _castToType(b, "boolean"), "boolean" == typeof aBool && "boolean" == typeof bBool ? [aBool, bBool] : [_castToType(a, "string"), _castToType(b, "string")])
                    }, _contains = function(sequence, needle) {
                        return sequence instanceof Array ? (sequence = _.map(sequence, _.partial(_castToType, _, typeof needle)), indexOf.call(sequence, needle) >= 0) : strUtils.contains(sequence, needle)
                    }, deepClone = function(obj) {
                        return _.isArray(obj) ? _.map(obj, deepClone) : _.isObject(obj) && !_.isFunction(obj) ? _.reduce(obj, function(memo, val, key) {
                            return memo[key] = deepClone(val), memo
                        }, {}) : obj
                    }, {
                        getPageDimensions: function() {
                            var body, html;
                            return body = document.body, html = document.documentElement, {
                                width: Math.max.apply(Math, [body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth]),
                                height: Math.max.apply(Math, [body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight])
                            }
                        },
                        upgradeEvent: function(eventName) {
                            return eventName
                        },
                        operators: {
                            ">": function(a, b) {
                                var ref;
                                return ref = _correctArgumentTypes(a, b), a = ref[0], b = ref[1], a > b
                            },
                            "<": function(a, b) {
                                var ref;
                                return ref = _correctArgumentTypes(a, b), a = ref[0], b = ref[1], a < b
                            },
                            "==": function(a, b) {
                                var ref;
                                return ref = _correctArgumentTypes(a, b), a = ref[0], b = ref[1], a === b
                            },
                            "!=": function(a, b) {
                                var ref;
                                return ref = _correctArgumentTypes(a, b), a = ref[0], b = ref[1], a !== b
                            },
                            "*": function(a, b) {
                                return _contains(a, b)
                            },
                            "!*": function(a, b) {
                                return !_contains(a, b)
                            },
                            "^": function(a, b) {
                                return strUtils.startsWith("" + a, "" + b)
                            },
                            $: function(a, b) {
                                return strUtils.endsWith("" + a, "" + b)
                            },
                            "?": function(a) {
                                return null != a
                            },
                            "!?": function(a) {
                                return null == a
                            },
                            in: function(a, b) {
                                return null == b && (b = ""), indexOf.call(_.map(b.split("\n"), _.partial(_castToType, _, typeof a)), a) >= 0
                            },
                            "not in": function(a, b) {
                                return null == b && (b = ""), indexOf.call(_.map(b.split("\n"), _.partial(_castToType, _, typeof a)), a) < 0
                            },
                            "> ago": function(a, b, options) {
                                var ref, unit, userVal;
                                return null == options && (options = {}), unit = null != (ref = options.unit) ? ref : "day", userVal = _coerceDate(a), !isNaN(userVal.getTime()) && userVal < date.subtract(new Date, _castToType(b, "number"), unit)
                            },
                            "< ago": function(a, b, options) {
                                var ref, unit, userVal;
                                return null == options && (options = {}), unit = null != (ref = options.unit) ? ref : "day", userVal = _coerceDate(a), !isNaN(userVal.getTime()) && (userVal > date.subtract(new Date, _castToType(b, "number"), unit) && userVal <= new Date)
                            },
                            within: function(a, b, options) {
                                var ref, unit, userVal;
                                return null == options && (options = {}), unit = null != (ref = options.unit) ? ref : "day", userVal = _coerceDate(a), !isNaN(userVal.getTime()) && (userVal >= new Date && userVal <= date.add(new Date, _castToType(b, "number"), unit))
                            }
                        },
                        castToType: _castToType,
                        stringToBool: _stringToBool,
                        correctArgumentTypes: _correctArgumentTypes,
                        deepClone: deepClone
                    }
                })
            }.call(this),
            function() {
                define("utils/browser", ["underscore"], function(_) {
                    var languageMatchesBrowser;
                    return languageMatchesBrowser = function(languagesStr, browserLanguage) {
                        var languageMatch, languages;
                        return languageMatch = !1, !languagesStr || (languages = languagesStr.split(","), !browserLanguage || (_.each(languages, function(language) {
                            if (0 === browserLanguage.toLowerCase().indexOf(language.toLowerCase())) return languageMatch = !0
                        }), languageMatch))
                    }, {
                        languageMatches: function(languagesStr) {
                            var browserLanguage;
                            return browserLanguage = navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage, languageMatchesBrowser(languagesStr, browserLanguage)
                        },
                        languageMatchesBrowser: languageMatchesBrowser
                    }
                })
            }.call(this),
            function(root, undefined) {
                "use strict";

                function _x86Multiply(m, n) {
                    return (65535 & m) * n + (((m >>> 16) * n & 65535) << 16)
                }

                function _x86Rotl(m, n) {
                    return m << n | m >>> 32 - n
                }

                function _x86Fmix(h) {
                    return h ^= h >>> 16, h = _x86Multiply(h, 2246822507), h ^= h >>> 13, h = _x86Multiply(h, 3266489909), h ^= h >>> 16
                }

                function _x64Add(m, n) {
                    m = [m[0] >>> 16, 65535 & m[0], m[1] >>> 16, 65535 & m[1]], n = [n[0] >>> 16, 65535 & n[0], n[1] >>> 16, 65535 & n[1]];
                    var o = [0, 0, 0, 0];
                    return o[3] += m[3] + n[3], o[2] += o[3] >>> 16, o[3] &= 65535, o[2] += m[2] + n[2], o[1] += o[2] >>> 16, o[2] &= 65535, o[1] += m[1] + n[1], o[0] += o[1] >>> 16, o[1] &= 65535, o[0] += m[0] + n[0], o[0] &= 65535, [o[0] << 16 | o[1], o[2] << 16 | o[3]]
                }

                function _x64Multiply(m, n) {
                    m = [m[0] >>> 16, 65535 & m[0], m[1] >>> 16, 65535 & m[1]], n = [n[0] >>> 16, 65535 & n[0], n[1] >>> 16, 65535 & n[1]];
                    var o = [0, 0, 0, 0];
                    return o[3] += m[3] * n[3], o[2] += o[3] >>> 16, o[3] &= 65535, o[2] += m[2] * n[3], o[1] += o[2] >>> 16, o[2] &= 65535, o[2] += m[3] * n[2], o[1] += o[2] >>> 16, o[2] &= 65535, o[1] += m[1] * n[3], o[0] += o[1] >>> 16, o[1] &= 65535, o[1] += m[2] * n[2], o[0] += o[1] >>> 16, o[1] &= 65535, o[1] += m[3] * n[1], o[0] += o[1] >>> 16, o[1] &= 65535, o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0], o[0] &= 65535, [o[0] << 16 | o[1], o[2] << 16 | o[3]]
                }

                function _x64Rotl(m, n) {
                    return n %= 64, 32 === n ? [m[1], m[0]] : n < 32 ? [m[0] << n | m[1] >>> 32 - n, m[1] << n | m[0] >>> 32 - n] : (n -= 32, [m[1] << n | m[0] >>> 32 - n, m[0] << n | m[1] >>> 32 - n])
                }

                function _x64LeftShift(m, n) {
                    return n %= 64, 0 === n ? m : n < 32 ? [m[0] << n | m[1] >>> 32 - n, m[1] << n] : [m[1] << n - 32, 0]
                }

                function _x64Xor(m, n) {
                    return [m[0] ^ n[0], m[1] ^ n[1]]
                }

                function _x64Fmix(h) {
                    return h = _x64Xor(h, [0, h[0] >>> 1]), h = _x64Multiply(h, [4283543511, 3981806797]), h = _x64Xor(h, [0, h[0] >>> 1]), h = _x64Multiply(h, [3301882366, 444984403]), h = _x64Xor(h, [0, h[0] >>> 1])
                }
                var library = {
                    version: "3.0.1",
                    x86: {},
                    x64: {}
                };
                library.x86.hash32 = function(key, seed) {
                    key = key || "", seed = seed || 0;
                    for (var remainder = key.length % 4, bytes = key.length - remainder, h1 = seed, k1 = 0, c1 = 3432918353, c2 = 461845907, i = 0; i < bytes; i += 4) k1 = 255 & key.charCodeAt(i) | (255 & key.charCodeAt(i + 1)) << 8 | (255 & key.charCodeAt(i + 2)) << 16 | (255 & key.charCodeAt(i + 3)) << 24, k1 = _x86Multiply(k1, c1), k1 = _x86Rotl(k1, 15), k1 = _x86Multiply(k1, c2), h1 ^= k1, h1 = _x86Rotl(h1, 13), h1 = _x86Multiply(h1, 5) + 3864292196;
                    switch (k1 = 0, remainder) {
                        case 3:
                            k1 ^= (255 & key.charCodeAt(i + 2)) << 16;
                        case 2:
                            k1 ^= (255 & key.charCodeAt(i + 1)) << 8;
                        case 1:
                            k1 ^= 255 & key.charCodeAt(i), k1 = _x86Multiply(k1, c1), k1 = _x86Rotl(k1, 15), k1 = _x86Multiply(k1, c2), h1 ^= k1
                    }
                    return h1 ^= key.length, h1 = _x86Fmix(h1), h1 >>> 0
                }, library.x86.hash128 = function(key, seed) {
                    key = key || "", seed = seed || 0;
                    for (var remainder = key.length % 16, bytes = key.length - remainder, h1 = seed, h2 = seed, h3 = seed, h4 = seed, k1 = 0, k2 = 0, k3 = 0, k4 = 0, c1 = 597399067, c2 = 2869860233, c3 = 951274213, c4 = 2716044179, i = 0; i < bytes; i += 16) k1 = 255 & key.charCodeAt(i) | (255 & key.charCodeAt(i + 1)) << 8 | (255 & key.charCodeAt(i + 2)) << 16 | (255 & key.charCodeAt(i + 3)) << 24, k2 = 255 & key.charCodeAt(i + 4) | (255 & key.charCodeAt(i + 5)) << 8 | (255 & key.charCodeAt(i + 6)) << 16 | (255 & key.charCodeAt(i + 7)) << 24, k3 = 255 & key.charCodeAt(i + 8) | (255 & key.charCodeAt(i + 9)) << 8 | (255 & key.charCodeAt(i + 10)) << 16 | (255 & key.charCodeAt(i + 11)) << 24, k4 = 255 & key.charCodeAt(i + 12) | (255 & key.charCodeAt(i + 13)) << 8 | (255 & key.charCodeAt(i + 14)) << 16 | (255 & key.charCodeAt(i + 15)) << 24, k1 = _x86Multiply(k1, c1), k1 = _x86Rotl(k1, 15), k1 = _x86Multiply(k1, c2), h1 ^= k1, h1 = _x86Rotl(h1, 19), h1 += h2, h1 = _x86Multiply(h1, 5) + 1444728091, k2 = _x86Multiply(k2, c2), k2 = _x86Rotl(k2, 16), k2 = _x86Multiply(k2, c3), h2 ^= k2, h2 = _x86Rotl(h2, 17), h2 += h3, h2 = _x86Multiply(h2, 5) + 197830471, k3 = _x86Multiply(k3, c3), k3 = _x86Rotl(k3, 17), k3 = _x86Multiply(k3, c4), h3 ^= k3, h3 = _x86Rotl(h3, 15), h3 += h4, h3 = _x86Multiply(h3, 5) + 2530024501, k4 = _x86Multiply(k4, c4), k4 = _x86Rotl(k4, 18), k4 = _x86Multiply(k4, c1), h4 ^= k4, h4 = _x86Rotl(h4, 13), h4 += h1, h4 = _x86Multiply(h4, 5) + 850148119;
                    switch (k1 = 0, k2 = 0, k3 = 0, k4 = 0, remainder) {
                        case 15:
                            k4 ^= key.charCodeAt(i + 14) << 16;
                        case 14:
                            k4 ^= key.charCodeAt(i + 13) << 8;
                        case 13:
                            k4 ^= key.charCodeAt(i + 12), k4 = _x86Multiply(k4, c4), k4 = _x86Rotl(k4, 18), k4 = _x86Multiply(k4, c1), h4 ^= k4;
                        case 12:
                            k3 ^= key.charCodeAt(i + 11) << 24;
                        case 11:
                            k3 ^= key.charCodeAt(i + 10) << 16;
                        case 10:
                            k3 ^= key.charCodeAt(i + 9) << 8;
                        case 9:
                            k3 ^= key.charCodeAt(i + 8), k3 = _x86Multiply(k3, c3), k3 = _x86Rotl(k3, 17), k3 = _x86Multiply(k3, c4), h3 ^= k3;
                        case 8:
                            k2 ^= key.charCodeAt(i + 7) << 24;
                        case 7:
                            k2 ^= key.charCodeAt(i + 6) << 16;
                        case 6:
                            k2 ^= key.charCodeAt(i + 5) << 8;
                        case 5:
                            k2 ^= key.charCodeAt(i + 4), k2 = _x86Multiply(k2, c2), k2 = _x86Rotl(k2, 16), k2 = _x86Multiply(k2, c3), h2 ^= k2;
                        case 4:
                            k1 ^= key.charCodeAt(i + 3) << 24;
                        case 3:
                            k1 ^= key.charCodeAt(i + 2) << 16;
                        case 2:
                            k1 ^= key.charCodeAt(i + 1) << 8;
                        case 1:
                            k1 ^= key.charCodeAt(i), k1 = _x86Multiply(k1, c1), k1 = _x86Rotl(k1, 15), k1 = _x86Multiply(k1, c2), h1 ^= k1
                    }
                    return h1 ^= key.length, h2 ^= key.length, h3 ^= key.length, h4 ^= key.length, h1 += h2, h1 += h3, h1 += h4, h2 += h1, h3 += h1, h4 += h1, h1 = _x86Fmix(h1), h2 = _x86Fmix(h2), h3 = _x86Fmix(h3), h4 = _x86Fmix(h4), h1 += h2, h1 += h3, h1 += h4, h2 += h1, h3 += h1, h4 += h1, ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" + (h3 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(16)).slice(-8)
                }, library.x64.hash128 = function(key, seed) {
                    key = key || "", seed = seed || 0;
                    for (var remainder = key.length % 16, bytes = key.length - remainder, h1 = [0, seed], h2 = [0, seed], k1 = [0, 0], k2 = [0, 0], c1 = [2277735313, 289559509], c2 = [1291169091, 658871167], i = 0; i < bytes; i += 16) k1 = [255 & key.charCodeAt(i + 4) | (255 & key.charCodeAt(i + 5)) << 8 | (255 & key.charCodeAt(i + 6)) << 16 | (255 & key.charCodeAt(i + 7)) << 24, 255 & key.charCodeAt(i) | (255 & key.charCodeAt(i + 1)) << 8 | (255 & key.charCodeAt(i + 2)) << 16 | (255 & key.charCodeAt(i + 3)) << 24],
                        k2 = [255 & key.charCodeAt(i + 12) | (255 & key.charCodeAt(i + 13)) << 8 | (255 & key.charCodeAt(i + 14)) << 16 | (255 & key.charCodeAt(i + 15)) << 24, 255 & key.charCodeAt(i + 8) | (255 & key.charCodeAt(i + 9)) << 8 | (255 & key.charCodeAt(i + 10)) << 16 | (255 & key.charCodeAt(i + 11)) << 24], k1 = _x64Multiply(k1, c1), k1 = _x64Rotl(k1, 31), k1 = _x64Multiply(k1, c2), h1 = _x64Xor(h1, k1), h1 = _x64Rotl(h1, 27), h1 = _x64Add(h1, h2), h1 = _x64Add(_x64Multiply(h1, [0, 5]), [0, 1390208809]), k2 = _x64Multiply(k2, c2), k2 = _x64Rotl(k2, 33), k2 = _x64Multiply(k2, c1), h2 = _x64Xor(h2, k2), h2 = _x64Rotl(h2, 31), h2 = _x64Add(h2, h1), h2 = _x64Add(_x64Multiply(h2, [0, 5]), [0, 944331445]);
                    switch (k1 = [0, 0], k2 = [0, 0], remainder) {
                        case 15:
                            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 14)], 48));
                        case 14:
                            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 13)], 40));
                        case 13:
                            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 12)], 32));
                        case 12:
                            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 11)], 24));
                        case 11:
                            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 10)], 16));
                        case 10:
                            k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 9)], 8));
                        case 9:
                            k2 = _x64Xor(k2, [0, key.charCodeAt(i + 8)]), k2 = _x64Multiply(k2, c2), k2 = _x64Rotl(k2, 33), k2 = _x64Multiply(k2, c1), h2 = _x64Xor(h2, k2);
                        case 8:
                            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 7)], 56));
                        case 7:
                            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 6)], 48));
                        case 6:
                            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 5)], 40));
                        case 5:
                            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 4)], 32));
                        case 4:
                            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 3)], 24));
                        case 3:
                            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 2)], 16));
                        case 2:
                            k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 1)], 8));
                        case 1:
                            k1 = _x64Xor(k1, [0, key.charCodeAt(i)]), k1 = _x64Multiply(k1, c1), k1 = _x64Rotl(k1, 31), k1 = _x64Multiply(k1, c2), h1 = _x64Xor(h1, k1)
                    }
                    return h1 = _x64Xor(h1, [0, key.length]), h2 = _x64Xor(h2, [0, key.length]), h1 = _x64Add(h1, h2), h2 = _x64Add(h2, h1), h1 = _x64Fmix(h1), h2 = _x64Fmix(h2), h1 = _x64Add(h1, h2), h2 = _x64Add(h2, h1), ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8)
                }, "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = library), exports.murmurHash3 = library) : "function" == typeof define && define.amd ? define("murmurHash3js", [], function() {
                    return library
                }) : (library._murmurHash3 = root.murmurHash3, library.noConflict = function() {
                    return root.murmurHash3 = library._murmurHash3, library._murmurHash3 = undefined, library.noConflict = undefined, library
                }, root.murmurHash3 = library)
            }(this),
            function() {
                define("utils/rule-checker", ["underscore", "utils/urls", "utils/utils", "utils/date", "utils/browser", "md5", "murmurHash3js"], function(_, urls, utils, date, browser, md5, murmurHash3) {
                    var pathMatches;
                    return pathMatches = function(rule, path, hashedPath) {
                        var regex;
                        return null == hashedPath && (hashedPath = md5.hash(path)), rule.whereHash === hashedPath || !(!rule.isRegex && !rule.whereRegex) && (regex = rule.isRegex ? rule.where : rule.whereRegex, urls.regexPathMatches(regex, path))
                    }, {
                        checkUrl: function(rule, path, hashedPath) {
                            return urls.domainMatches(rule.domain) && urls.domainsMatch(rule.domains) && pathMatches(rule, path, hashedPath)
                        },
                        checkLanguage: function(rule) {
                            return browser.languageMatches(rule.languages)
                        },
                        checkUserProperties: function(rule, userData) {
                            var matchedAll, operator, operatorFn, propDef, propName, props, ref, userValue, value;
                            if (props = null != rule ? rule.properties : void 0, null != props && _.isObject(props)) {
                                if (!_.isObject(userData)) return !1;
                                matchedAll = !0;
                                for (propName in props)
                                    if (propDef = props[propName], userValue = userData[propName], _.isObject(propDef)) {
                                        if (value = propDef.value, operator = propDef.operator, operatorFn = utils.operators[operator], "in" !== operator && "not in" !== operator || (value = propDef.valuesList, propDef.isSensitive && null != userValue && (userValue = murmurHash3.x86.hash32(md5.hash(userValue)))), operatorFn && !operatorFn(userValue, value)) {
                                            matchedAll = !1;
                                            break
                                        }
                                    } else if (ref = utils.correctArgumentTypes(propDef, userValue), propDef = ref[0], userValue = ref[1], userValue !== propDef) {
                                    matchedAll = !1;
                                    break
                                }
                                return matchedAll
                            }
                            return !0
                        },
                        checkUserHistory: function(rule) {
                            switch (rule.frequency) {
                                case "every_time":
                                    return !0;
                                case "once":
                                    return !rule.shown;
                                default:
                                    return !rule.shown
                            }
                        },
                        checkTimeframe: function(rule) {
                            var now, withinTimeframe;
                            return now = date.now(), withinTimeframe = !0, null != rule.startDate && (withinTimeframe = new Date(rule.startDate).getTime() < now), null != rule.endDate && (withinTimeframe = withinTimeframe && new Date(rule.endDate).getTime() > now), withinTimeframe
                        }
                    }
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty,
                    indexOf = [].indexOf || function(item) {
                        for (var i = 0, l = this.length; i < l; i++)
                            if (i in this && this[i] === item) return i;
                        return -1
                    };
                define("collections/rules", ["env", "underscore", "client", "utils/date", "md5", "utils/logger", "utils/urls", "es6-promise", "cookie", "models/user", "collections/user-history", "bootstrap", "utils/reporter", "utils/rule-checker", "utils/utils"], function(env, _, APIClient, date, md5, logger, urls, ES6Promise, cookie, user, UserHistoryClient, bootstrap, report, ruleChecker, utils) {
                    var Rules;
                    return Rules = function(superClass) {
                        function Rules(options) {
                            this.options(options), this.data = {}, this.history = new UserHistoryClient(this._options), this._cookieKey = "apc_rule_queue"
                        }
                        return extend(Rules, superClass), Rules.prototype.urlRoot = function() {
                            return Rules.__super__.urlRoot.call(this) + "/rules"
                        }, Rules.prototype.fetch = function() {
                            return logger.log("Fetching rules."), this._fetch().then(function(_this) {
                                return function(responses) {
                                    return logger.log("Rules response received.", responses), _this.merge.apply(_this, responses)
                                }
                            }(this)).then(_.bind(this.parse, this)).then(function(_this) {
                                return function(rules) {
                                    return logger.log("Caching user rules."), _this.data = rules
                                }
                            }(this))
                        }, Rules.prototype._fetch = function() {
                            return ES6Promise.Promise.all([this._fetchDefaultRules(), this._fetchUserRules(), this._fetchUserHistory(), this._getLocalRuleIds()])
                        }, Rules.prototype._fetchDefaultRules = function() {
                            var request;
                            return request = _.bind(this.request, this), new ES6Promise.Promise(function(resolve, reject) {
                                var data;
                                return bootstrap && bootstrap.defaultRules ? (data = bootstrap.defaultRules, logger.log("Using bootstrapped data", data), resolve(data)) : (logger.log("No bootstrapped rules data found. Fetching from server."), request({
                                    method: "get",
                                    url: "/default.json"
                                }).then(resolve, reject))
                            })
                        }, Rules.prototype._fetchUserRules = function() {
                            var uuid;
                            return uuid = user.toUUID(), this.request({
                                method: "get",
                                url: "/" + uuid + ".json"
                            })
                        }, Rules.prototype._fetchUserHistory = function() {
                            var flowHistory, hotspotsHistory;
                            return flowHistory = this.history.fetchFlows(), hotspotsHistory = ES6Promise.Promise.all([this.history.fetchHotspotGroups(), this.history.fetchCoachmarkGroups()]).then(function(arg) {
                                var coachmarkGroupsHistory, history, hotspotGroupsHistory;
                                return hotspotGroupsHistory = arg[0], coachmarkGroupsHistory = arg[1], (hotspotGroupsHistory || coachmarkGroupsHistory) && (history = _.extend({}, hotspotGroupsHistory, coachmarkGroupsHistory)), null != history ? _.reduce(history, function(memo, hist, hotspotGroupId) {
                                    var obj;
                                    return obj = {}, "completed" === hist.state ? obj[hotspotGroupId] = !0 : _.size(hist.hotspots) && (obj[hotspotGroupId] = _.clone(hist.hotspots)), _.extend(memo, obj)
                                }, {}) : null
                            }), ES6Promise.Promise.all([flowHistory, hotspotsHistory]).then(function(arg) {
                                var flowHistory, hotspotHistory;
                                return flowHistory = arg[0], hotspotHistory = arg[1], null === flowHistory && null === hotspotHistory ? null : (null === flowHistory ? flowHistory = {} : null === hotspotHistory && (hotspotHistory = {}), _.extend(flowHistory, hotspotHistory))
                            }).catch(function(e) {
                                throw e
                            })
                        }, Rules.prototype._getLocalRuleIds = function() {
                            var i, id, len, ref, ruleIds;
                            for (ruleIds = {}, ref = this.getShownCookieIds(), i = 0, len = ref.length; i < len; i++) id = ref[i], ruleIds[id] = !0;
                            return ruleIds
                        }, Rules.prototype.merge = function(defaultRules, userRules, userHistory, localRuleIds) {
                            var contentShown, flowIdsToSync, isShownLocally, mergedRule, mergedRules, removeShownCookie, rule, ruleId, ruleset, userRule, whereHash;
                            if (mergedRules = utils.deepClone(defaultRules), flowIdsToSync = {}, userRules || userHistory) {
                                null == userRules && (userRules = {});
                                for (whereHash in mergedRules)
                                    if (ruleset = mergedRules[whereHash], null != userRules[whereHash] || userHistory) {
                                        null == userRules[whereHash] && (userRules[whereHash] = {}), null == userHistory && (userHistory = {});
                                        for (ruleId in ruleset) rule = ruleset[ruleId], mergedRule = mergedRules[whereHash][ruleId], userRule = userRules[whereHash][ruleId], contentShown = userHistory[ruleId], isShownLocally = localRuleIds && localRuleIds[ruleId] || !1, (isShownLocally || (null != userRule ? userRule.shown : void 0) || contentShown) && (_.isObject(contentShown) ? mergedRule.hotspots = contentShown : mergedRule.shown = !0, contentShown || (flowIdsToSync[ruleId] = !0))
                                    }
                            }
                            return _.isEmpty(flowIdsToSync) || (removeShownCookie = _.bind(this.removeShownCookie, this), this.history.markFlowsViewed(flowIdsToSync).then(function() {
                                return _.each(_.keys(flowIdsToSync), removeShownCookie)
                            })), mergedRules
                        }, Rules.prototype.parse = function(rules) {
                            var parsed, rule, ruleId, ruleset, whereHash;
                            if (parsed = {}, _.isObject(rules))
                                for (whereHash in rules) {
                                    ruleset = rules[whereHash];
                                    for (ruleId in ruleset) rule = ruleset[ruleId], parsed[ruleId] = _.clone(rule)
                                }
                            return parsed
                        }, Rules.prototype.getUserRules = function() {
                            var filtered, ref, rule, ruleId, userData;
                            if (filtered = {}, _.isObject(this.data)) {
                                userData = user.get(), ref = this.data;
                                for (ruleId in ref) rule = ref[ruleId], ruleChecker.checkUserProperties(rule, userData) && (filtered[ruleId] = rule)
                            }
                            return filtered
                        }, Rules.prototype._contentTypeValue = function(contentType) {
                            return "flow" !== contentType && contentType ? "coachmark-group" === contentType ? 5 : 0 : 9
                        }, Rules.prototype._ruleSortValue = function(arg, options) {
                            var nextContentIds, ref, ref1, ref2, ref3, rule, ruleId;
                            return ruleId = arg[0], rule = arg[1], null == options && (options = {}), nextContentIds = null != (ref = options.nextContentIds) ? ref : [], [null != (ref1 = rule.sortPriority) ? ref1 : 0, (ref2 = rule.id, indexOf.call(nextContentIds, ref2) >= 0 ? 0 : 9), rule.nextContentId ? 9 : 0, this._contentTypeValue(rule.contentType), "every_time" === rule.frequency ? 0 : 9, rule.isRegex ? 0 : 9, null != (ref3 = rule.updatedAt) ? ref3 : rule.createdAt]
                        }, Rules.prototype._getNextContentIds = function(rulePairs) {
                            return _.chain(rulePairs).map(function(pair) {
                                var ref, ref1, ref2;
                                return (null != (ref = pair[1]) ? ref.nextContentId : void 0) || (null != (ref1 = pair[1]) && null != (ref2 = ref1.nextContent) ? ref2.id : void 0)
                            }).filter(function(contentId) {
                                return null != contentId
                            }).value()
                        }, Rules.prototype._sortRules = function(rulePairs) {
                            var nextContentIds;
                            return nextContentIds = this._getNextContentIds(rulePairs), rulePairs.sort(function(_this) {
                                return function(a, b) {
                                    var i, index, len, ref;
                                    for (a = _this._ruleSortValue(a, {
                                            nextContentIds: nextContentIds
                                        }), b = _this._ruleSortValue(b, {
                                            nextContentIds: nextContentIds
                                        }), ref = _.range(0, a.length), i = 0, len = ref.length; i < len; i++)
                                        if (index = ref[i], a[index] !== b[index]) return a[index] > b[index] ? -1 : 1;
                                    return 0
                                }
                            }(this)), rulePairs
                        }, Rules.prototype.getRuleIdForPath = function(rules, path) {
                            var _ruleId, hashedPath, i, len, ref, rule, sortedRules;
                            if (null == rules && (rules = this.getUserRules()), !rules) return void logger.warn("Looking up a ruleId requires a rules argument.");
                            for (null == path && (path = urls.getPath()), hashedPath = md5.hash(path), sortedRules = this._sortRules(_.pairs(rules)), i = 0, len = sortedRules.length; i < len; i++)
                                if (ref = sortedRules[i], _ruleId = ref[0], rule = ref[1], ruleChecker.checkTimeframe(rule) && ruleChecker.checkUserHistory(rule) && ruleChecker.checkUrl(rule, path, hashedPath) && ruleChecker.checkLanguage(rule)) return _ruleId;
                            return null
                        }, Rules.prototype.markFlowAsShown = function(ruleId) {
                            var removeShownCookie, request;
                            return this.addShownCookie(ruleId), removeShownCookie = _.bind(this.removeShownCookie, this, ruleId), request = new ES6Promise.Promise(function(_this) {
                                return function(resolve, reject) {
                                    var e, flows, msg, rule, shownAt;
                                    return rule = _this.getRule(ruleId), user.isAnonymous() ? (logger.log("Did not mark as shown because user is unknown."), resolve()) : rule ? (logger.log("Persisting that flow " + ruleId + " as shown."), rule.shown ? (logger.log("Actually, we already knew that flow was seen."), resolve()) : (logger.log("Persisting rule state to server."), shownAt = date.now(), rule.shown = !0, rule.shownAt = shownAt, flows = {}, flows[ruleId] = !0, _this.history.markFlowsViewed(flows).then(resolve).catch(reject))) : (msg = "Failed to save flow shown state: known user and unknown flow ID " + ruleId, logger.error(msg, user, rule), e = new Error(msg), report(e), reject(e))
                                }
                            }(this)), request.then(removeShownCookie).catch(function(e) {
                                return logger.warn("Rule cookie failed to clear after rule was marked as shown server-side.")
                            })
                        }, Rules.prototype.updateHotspotGroupState = function(ruleId, state) {
                            var e, msg, rule;
                            if (rule = this.getRule(ruleId), null != rule) {
                                if (rule.shown) return void logger.log("Actually, we already knew that hotspot-group was completed.");
                                switch (state) {
                                    case "completed":
                                        rule.shown = !0;
                                        break;
                                    case "started":
                                        rule.shown = !1
                                }
                            } else msg = "Failed to update hotspot-group state locally: unknown rule ID: " + ruleId + ".", logger.error(msg), e = new Error(msg), report(e);
                            return this.history.updateHotspotGroupState(ruleId, state)
                        }, Rules.prototype.markHotspotsViewed = function(ruleId, hotspots) {
                            var e, msg, rule;
                            return rule = this.getRule(ruleId), null != rule ? null != rule.hotspots ? rule.hotspots = _.extend(rule.hotspots, hotspots) : rule.hotspots = hotspots : (msg = "Failed to update individual hotspots state locally: unknown rule ID: " + ruleId + ".", logger.error(msg), e = new Error(msg), report(e)), this.history.markHotspotsViewed(ruleId, hotspots)
                        }, Rules.prototype.updateCoachmarkGroupState = function(ruleId, state) {
                            var e, msg, rule;
                            if (rule = this.getRule(ruleId), null != rule) {
                                if (rule.shown) return void logger.log("Coachmark group " + ruleId + " was already completed.");
                                switch (state) {
                                    case "completed":
                                        rule.shown = !0;
                                        break;
                                    case "started":
                                        rule.shown = !1
                                }
                            } else msg = "Failed to update coachmark group state locally: unknown rule ID: " + ruleId + ".", logger.error(msg), e = new Error(msg), report(e);
                            return this.history.updateCoachmarkGroupState(ruleId, state)
                        }, Rules.prototype.markCoachmarksViewed = function(ruleId, hotspots) {
                            var e, msg, rule;
                            return rule = this.getRule(ruleId), null != rule ? null != rule.hotspots ? rule.hotspots = _.extend(rule.hotspots, hotspots) : rule.hotspots = hotspots : (msg = "Failed to update individual hotspot state locally: unknown rule ID: " + ruleId + ".", logger.error(msg), e = new Error(msg), report(e)), this.history.markCoachmarksViewed(ruleId, hotspots)
                        }, Rules.prototype.getRule = function(ruleId) {
                            if (ruleId && _.isObject(this.data)) return this.data[ruleId]
                        }, Rules.prototype.addShownCookie = function(ruleId) {
                            var existing;
                            return ruleId ? cookie.enabled ? (existing = cookie.get(this._cookieKey) || "", existing.indexOf(ruleId) === -1 ? (logger.log("Saving rule ID to cookie."), existing && "undefined" !== existing ? existing += "," + ruleId : existing = "" + ruleId, cookie.set(this._cookieKey, existing)) : logger.log("Rule ID already exists in cookie.")) : logger.warn("Cookies are not enabled.") : logger.warn("No rule ID given."), !1
                        }, Rules.prototype.removeShownCookie = function(ruleId) {
                            var existing, newCookie;
                            return !!cookie.enabled && (existing = cookie.get(this._cookieKey) || "", newCookie = existing.replace(ruleId, "").replace(/^,+/, "").replace(/,+$/, ""), "" === newCookie ? cookie.remove(this._cookieKey) : cookie.set(this._cookieKey, newCookie), logger.log("Removing shown cookie " + ruleId + "."))
                        }, Rules.prototype.getShownCookieIds = function() {
                            var idStr, ids;
                            return ids = [], cookie.enabled && (idStr = cookie.get(this._cookieKey), idStr && (ids = idStr.split(","))), ids
                        }, Rules
                    }(APIClient)
                })
            }.call(this),
            function() {
                define("views/base", ["jquery", "underscore", "utils/utils"], function($, _, utils) {
                    var BaseView, delegateEventSplitter;
                    return delegateEventSplitter = /^(\S+)\s*(.*)$/, BaseView = function() {
                        function BaseView(options) {
                            null == options && (options = {}), this.cid = _.uniqueId("view"), _.extend(this, options), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents()
                        }
                        return BaseView.prototype.activeClass = "active", BaseView.prototype.tagName = "div", BaseView.prototype.$ = function(selector) {
                            return this.$el.find(selector)
                        }, BaseView.prototype.initialize = function() {}, BaseView.prototype.render = function() {
                            return this
                        }, BaseView.prototype.remove = function() {
                            return this.$el.remove(), this.undelegateEvents(), this
                        }, BaseView.prototype.delegateEvents = function(events) {
                            var eventName, key, match, method, responsiveEvent, selector;
                            if (null == events && (events = this.events), events) {
                                this.undelegateEvents();
                                for (key in events) method = events[key], _.isFunction(method) || (method = this[events[key]]), method && (match = key.match(delegateEventSplitter), eventName = match[1], selector = match[2], responsiveEvent = utils.upgradeEvent(eventName), method = _.bind(method, this), responsiveEvent += ".delegateEvents" + this.cid, "" === selector ? this.$el.on(responsiveEvent, method) : this.$el.on(responsiveEvent, selector, method));
                                return this
                            }
                        }, BaseView.prototype.undelegateEvents = function() {
                            return this.$el.off(".delegateEvents" + this.cid), this
                        }, BaseView.prototype._ensureElement = function() {
                            var $el, attrs;
                            this.el ? this.setElement(_.result(this, "el"), !1) : (attrs = _.extend({}, _.result(this, "attributes")), this.id && (attrs.id = _.result(this, "id")), this.className && (attrs.class = _.result(this, "className")), $el = $("<" + _.result(this, "tagName") + ">").attr(attrs), this.setElement($el, !1))
                        }, BaseView.prototype.setElement = function(element, delegate) {
                            return this.$el && this.undelegateEvents(), this.$el = element instanceof $ ? element : $(element), this.el = this.$el[0], delegate !== !1 && this.delegateEvents(), this
                        }, BaseView
                    }()
                })
            }.call(this),
            function() {
                define("utils/validators", [], function() {
                    return {
                        email: {
                            message: "Invalid email address",
                            pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
                        },
                        url: {
                            message: "Invalid URL",
                            pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
                        },
                        number: {
                            message: "Invalid number",
                            pattern: /^[0-9]+$/
                        },
                        text: {
                            message: "There should be text",
                            pattern: /.*/
                        }
                    }
                })
            }.call(this),
            function() {
                define("template", [], function() {
                    var nbsp;
                    return nbsp = "[\\s\\xA0]?",
                        function(str, context) {
                            var key, re;
                            if (!context || "object" != typeof context) return str;
                            for (key in context) re = new RegExp("{{" + nbsp + key + nbsp + "}}", "g"), str = str.replace(re, context[key]);
                            return str
                        }
                })
            }.call(this),
            function() {
                define("utils/links", ["jquery", "underscore", "utils/urls", "utils/date", "analytics", "collections/goals"], function($, _, urls, date, analytics, goals) {
                    var createTrackingLink;
                    return createTrackingLink = function(collectionId, href) {
                        var data, redirect;
                        return redirect = encodeURIComponent(href), data = {
                            actionId: "flow_conversion",
                            timestamp: date.now()
                        }, analytics.createRedirectUrl(collectionId, data, redirect)
                    }, {
                        trackLinksForContent: function(el, contentId) {
                            var $el, goal, links;
                            if (goal = _.findWhere(goals.goals, {
                                    sourceId: contentId
                                })) return $el = $(el), links = $.grep($el.find("a"), function(_this) {
                                return function(link) {
                                    return _this._checkLinkAgainstGoal(goal, link)
                                }
                            }(this)), _.each(links, function(a) {
                                return a.setAttribute("data-original-href", a.href), a.href = createTrackingLink(contentId, a.href)
                            })
                        },
                        _checkLinkAgainstGoal: function(goal, link) {
                            var hostname, linkPath, path, re;
                            return goal.isRegex ? (re = new RegExp(goal.where), re.test(link.href)) : (hostname = urls.getHostname(goal.where), path = urls.getPath(goal.where), hostname || (hostname = window.location.hostname), hostname === link.hostname && (linkPath = urls.getPath(link.href), path === linkPath || path + "/" === linkPath))
                        },
                        makeLinksTargetParent: function(el) {
                            return $(el).find('a[target!="_blank"]').prop("target", "_parent")
                        }
                    }
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty,
                    indexOf = [].indexOf || function(item) {
                        for (var i = 0, l = this.length; i < l; i++)
                            if (i in this && this[i] === item) return i;
                        return -1
                    };
                define("views/step", ["jquery", "underscore", "utils/utils", "utils/validators", "views/base", "models/user", "template", "eventbus", "utils/links"], function($, _, utils, validators, View, user, template, Eventbus, links) {
                    var Step;
                    return Step = function(superClass) {
                        function Step() {
                            return Step.__super__.constructor.apply(this, arguments)
                        }
                        return extend(Step, superClass), Step.prototype.tagName = "cue", Step.prototype.events = {
                            "submit form.step-action-form": "catchSubmit"
                        }, Step.prototype.initialize = function(options) {
                            var ref;
                            return null == options && (options = {}), null == this.data && (this.data = {}), this.defineRequirements(), this.isLast = null != (ref = options.isLast) && ref
                        }, Step.prototype.defineRequirements = function() {
                            var _eventComplete, events, supportedEvents;
                            supportedEvents = ["click", "dblclick", "touchstart"], events = {}, _eventComplete = {}, this.$("[appcues-require]").each(function(i, el) {
                                var $el, eventName, id, ns, req;
                                $el = $(el), req = $el.attr("appcues-require"), req && indexOf.call(supportedEvents, req) >= 0 && (null == (id = $el.attr("id")) && (id = _.uniqueId("cue"), $el.attr("id", id)), eventName = utils.upgradeEvent(req), ns = eventName + " #" + id, events[ns] = "saveAndValidate", _eventComplete[ns] = !1)
                            }), null == this.events && (this.events = {}), _.extend(this.events, events), null == this._eventComplete && (this._eventComplete = {}), _.extend(this._eventComplete, _eventComplete)
                        }, Step.prototype.render = function() {
                            var context, j, len, prop, tokenizedProperties, val;
                            for (context = user.get(), tokenizedProperties = ["content", "prevText", "nextText"], j = 0, len = tokenizedProperties.length; j < len; j++) prop = tokenizedProperties[j], val = this.data[prop], val && _.isString(val) && (this.data[prop] = template(val, context));
                            return this._renderContent(), links.makeLinksTargetParent(this.el), this.injectActions(), links.trackLinksForContent(this.el, this.flowId), this.validate(), this
                        }, Step.prototype._renderContent = function() {
                            var content, ref;
                            return content = null != (ref = this.data.content) ? ref : "", this.$el.html("<section>" + content + "</section>")
                        }, Step.prototype.saveAndValidate = function(e) {
                            var key;
                            return key = e.type + " #" + e.currentTarget.id, this._eventComplete[key] = !0, this.validate()
                        }, Step.prototype.validate = function() {
                            var evt, isDone, ref;
                            ref = this._eventComplete;
                            for (evt in ref)
                                if (isDone = ref[evt], isDone === !1) return;
                            return this.$("[data-step=next], [data-step=end], [data-step=redirect]").removeClass("disabled")
                        }, Step.prototype.injectActions = function() {
                            var $nextButton, $prevButton, dataStep, nextButtonHTML, nextText, nextTextDefault, prevButtonHTML, prevText;
                            return this.isLast ? (nextTextDefault = "OK, got it", dataStep = "end") : (nextTextDefault = "Next", dataStep = "next"), prevText = this.data.prevText || "Back", nextText = this.data.nextText || nextTextDefault, $prevButton = $("<a class='appcues-button' data-step='prev'>" + prevText + "</a>"), $nextButton = $("<a class='disabled appcues-button appcues-button-success' data-step='" + dataStep + "'>" + nextText + "</a>"), prevButtonHTML = $prevButton.get(0).outerHTML, nextButtonHTML = $nextButton.get(0).outerHTML, this.$el.children("section").first().after("<div class='appcues-actions'>\n    <div class='appcues-actions-left'>\n        " + prevButtonHTML + "\n    </div><!--\n    --><div class='appcues-actions-right'>\n        " + nextButtonHTML + "\n    </div>\n</div>")
                        }, Step.prototype.validateResponse = function($form) {
                            var _addError, valid;
                            return valid = !0, _addError = function($fieldDiv, message) {
                                var $messages;
                                if ($fieldDiv.addClass("appcues-error"), $messages = $fieldDiv.find("ul.messages"), 0 === $messages.length && ($messages = $('<ul class="messages"></ul>').appendTo($fieldDiv)), message) return $messages.append("<li>" + message + "</li>")
                            }, $form.find(".form-field").removeClass("appcues-error").find(".messages").html(""), $form.find(".form-field-text, .form-field-textarea").filter("[data-appcues-required=true]").map(function(i, fieldDiv) {
                                var $fieldDiv, $input;
                                if ($fieldDiv = $(fieldDiv), $input = $fieldDiv.find("input[type=text], textarea"), "" === $.trim($input.val())) return _addError($fieldDiv, "This field is required"), valid = !1
                            }), $form.find(".form-field-choice, .form-field-rating").filter("[data-appcues-required=true]").map(function(i, fieldDiv) {
                                var $fieldDiv, $inputs;
                                if ($fieldDiv = $(fieldDiv), $inputs = $fieldDiv.find("input[type=radio]:checked"), 0 === $inputs.length) return _addError($fieldDiv, "This field is required"), valid = !1
                            }), $form.find(".form-field[data-appcues-validation]").map(function(i, fieldDiv) {
                                var $fieldDiv, $input, validationType, validator, value;
                                if ($fieldDiv = $(fieldDiv), $input = $fieldDiv.find("input, textarea"), validationType = $fieldDiv.attr("data-appcues-validation"), value = $.trim($input.val()), validator = validators[validationType], value && !validator.pattern.test(value)) return _addError($fieldDiv, validator.message), valid = !1
                            }), valid
                        }, Step.prototype.trackResponse = function(flowName, flowId) {
                            var $stepActionForm, eventData;
                            return $stepActionForm = this.$el.find("form.step-action-form"), 0 === $stepActionForm.length || !!this.validateResponse($stepActionForm) && (eventData = {
                                id: "flow_form_submission",
                                flowId: flowId,
                                flowName: flowName,
                                description: "Submitted form in " + flowName + " (Appcues)",
                                action: "submit",
                                stepId: this.data.id,
                                formId: $stepActionForm.data("form-id"),
                                response: _.map($stepActionForm.serializeArray(), function(obj) {
                                    return {
                                        fieldId: obj.name,
                                        label: $stepActionForm.find("label[for=" + obj.name + "]").text(),
                                        value: obj.value
                                    }
                                })
                            }, Eventbus.emit(eventData.id, eventData), Eventbus.emit("flow_analytics", eventData), _.each($stepActionForm.serializeArray(), function(_this) {
                                return function(obj) {
                                    return eventData = {
                                        id: "form_field_submission",
                                        flowId: flowId,
                                        flowName: flowName,
                                        description: "Submitted form field in Appcues Flow",
                                        action: "submit",
                                        stepId: _this.data.id,
                                        formId: $stepActionForm.data("form-id"),
                                        fieldId: obj.name,
                                        label: $stepActionForm.find("label[for=" + obj.name + "]").text(),
                                        value: obj.value
                                    }, Eventbus.emit(eventData.id, eventData), Eventbus.emit("flow_analytics", eventData)
                                }
                            }(this)))
                        }, Step.prototype.activate = function(options) {
                            var eventData;
                            return null == options && (options = {}), this.$el.addClass(this.activeClass), options.silent || (eventData = {
                                id: "step_activated",
                                flowId: this.flowId,
                                description: "Activated step " + this.stepNumber + " in " + this.flowName + " (Appcues)",
                                stepNumber: this.stepNumber,
                                stepId: this.data.id,
                                action: "click"
                            }, Eventbus.emit(eventData.id, eventData), Eventbus.emit("flow_analytics", eventData)), this
                        }, Step.prototype.deactivate = function(options) {
                            var eventData;
                            return null == options && (options = {}), options.silent || (eventData = {
                                id: "step_deactivated",
                                flowId: this.flowId,
                                description: "Deactivated step " + this.stepNumber + " in " + this.flowName + " (Appcues)",
                                stepNumber: this.stepNumber,
                                stepId: this.data.id,
                                action: "click"
                            }, Eventbus.emit(eventData.id, eventData), Eventbus.emit("flow_analytics", eventData)), this.$el.removeClass(this.activeClass), this.render(), this
                        }, Step.prototype.catchSubmit = function(evt) {
                            return !1
                        }, Step
                    }(View)
                })
            }.call(this),
            function() {
                var indexOf = [].indexOf || function(item) {
                    for (var i = 0, l = this.length; i < l; i++)
                        if (i in this && this[i] === item) return i;
                    return -1
                };
                define("views/mixins/poweredby", ["jquery", "env", "models/settings", "bootstrap"], function($, env, settings, bootstrap) {
                    var POWERED_BY_PLAN_IDS;
                    return POWERED_BY_PLAN_IDS = ["99-bootstrap"], {
                        renderPoweredByBadge: function(options) {
                            var html, style, wrapper;
                            return null == options && (options = {}), "left" === options.patternType && (style = "'right: 16px; left: initial;'"), html = '<div class="appcues-powered-by-wrapper ' + (options.hidden ? "hidden" : "") + '">\n    <a href="' + env.POWERED_BY_UTM_LINK + "&utm_source=" + settings.get("appcuesId") + '" target="_blank">\n        <div class="appcues-powered-by" ' + (style ? "style=" + style : void 0) + '>\n            <div class="powered-by-content">\n                <div class="logo-container">\n                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.71 45.567"><polygon style="fill: #bebebe" points="15.939 25.197 28.904 45.567 35.71 45.567 35.71 0 15.939 25.197"/><polygon style="fill: #bebebe" points="0 45.567 12.516 45.567 12.516 29.466 0 45.567"/></svg>\n                </div>\n                <div class="poweredby-text-top">Powered by</div>\n                <div class="poweredby-text-bottom">Appcues</div>\n            </div>\n        </div>\n    </a>\n</div>', wrapper = this.$el.find(".appcues-powered-by-wrapper"), 0 === wrapper.length ? this.$el.append(html) : wrapper.replaceWith(html)
                        },
                        showPoweredByBadge: function() {
                            return this.$el.find(".appcues-powered-by-wrapper").removeClass("hidden")
                        },
                        hidePoweredByBadge: function() {
                            return this.$el.find(".appcues-powered-by-wrapper").addClass("hidden")
                        },
                        shouldShowPoweredByBadge: function() {
                            var account, ref;
                            return null != (null != bootstrap ? bootstrap.account : void 0) && (account = bootstrap.account, ref = account.stripePlanId, indexOf.call(POWERED_BY_PLAN_IDS, ref) >= 0 && !account.hidePoweredBy || account.isTrial === !0)
                        }
                    }
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("views/flow", ["jquery", "underscore", "views/base", "views/step", "eventbus", "views/mixins/poweredby"], function($, _, View, Step, Eventbus, PoweredByView) {
                    var Flow;
                    return Flow = function(superClass) {
                        function Flow() {
                            return Flow.__super__.constructor.apply(this, arguments)
                        }
                        return extend(Flow, superClass), Flow.prototype.tagName = "appcues", Flow.prototype.onRemove = function() {}, Flow.prototype.events = {
                            "click [data-step]": "navigate",
                            'click cue [href][target!="_blank"]': "navigate",
                            click: "catchSkip"
                        }, Flow.prototype.initialize = function(options) {
                            return null == options && (options = {}), null == this.data && (this.data = {}), this._childViews = [], this.currentStepIndex = null, this
                        }, Flow.prototype.navigate = function(e) {
                            var $el, eventData, flowId, flowName, href, idx, next, openNewTab, step, wasValid;
                            if ($el = this.$(e.currentTarget), !$el.hasClass("disabled")) {
                                if (flowName = this.data.name, flowId = this.data.id, step = $el.data("step"), href = $el.attr("href"), next = null, eventData = null, null != (idx = this.currentStepIndex)) {
                                    if (("next" === step || "end" === step) && (wasValid = this.getCurrentStep().trackResponse(flowName, flowId), !wasValid)) return;
                                    switch (step) {
                                        case "skip":
                                            eventData = {
                                                id: "flow_skipped",
                                                description: "Skipped " + flowName + " (Appcues)",
                                                action: "click"
                                            };
                                            break;
                                        case "end":
                                            eventData = {
                                                id: "flow_finished",
                                                description: "Completed " + flowName + " (Appcues)",
                                                action: "click",
                                                redirectUrl: this.data.redirectUrl
                                            };
                                            break;
                                        case "prev":
                                            eventData = {
                                                id: "flow_navigate_prev",
                                                description: "Clicked previous in " + flowName + " (Appcues)",
                                                action: "click"
                                            }, next = idx - 1;
                                            break;
                                        case "next":
                                            eventData = {
                                                id: "flow_navigate_next",
                                                description: "Clicked next in " + flowName + " (Appcues)",
                                                action: "click"
                                            }, next = idx + 1;
                                            break;
                                        default:
                                            next = parseInt(step, 10), eventData = isNaN(next) ? {
                                                id: "flow_navigate_link",
                                                description: "Clicked link in " + flowName + " (Appcues)",
                                                action: "click"
                                            } : {
                                                id: "flow_navigate_jump",
                                                description: "Clicked custom link to another step in " + flowName + " (Appcues)",
                                                action: "click"
                                            }
                                    }(null != eventData ? eventData.id : void 0) && (_.extend(eventData, {
                                        flowId: this.data.id,
                                        flowName: flowName,
                                        flowVersionId: this.data.updatedAt,
                                        stepType: "modal"
                                    }), Eventbus.emit(eventData.id, eventData), Eventbus.emit("flow_analytics", eventData)), null == next || _.isNaN(next) ? (openNewTab = "_blank" === $el.attr("target"), href && !openNewTab && (e.preventDefault(), window.setTimeout(function() {
                                        return window.location.href = href
                                    }, 10)), openNewTab || this.remove()) : this.activate(next)
                                }
                                return this
                            }
                        }, Flow.prototype.getCurrentStep = function() {
                            return this._childViews[this.currentStepIndex]
                        }, Flow.prototype.activate = function(stepId, options) {
                            var currentStepClasses, step;
                            if (null == options && (options = {}), null != stepId) return step = this._childViews[stepId], step && (null != this.currentStepIndex && this.deactivate(this.currentStepIndex, options), this.currentStepIndex = stepId, step.activate(options), this.updateProgress(), currentStepClasses = this.$el.attr("class").match(/cue-step-\d+/gi), null != currentStepClasses && this.$el.removeClass(currentStepClasses.join(" ")), this.$el.addClass("cue-step-" + this.currentStepIndex)), this
                        }, Flow.prototype.deactivate = function(stepId, options) {
                            var j, len, ref, step;
                            if (null != stepId) step = this._childViews[stepId], step && step.deactivate(options);
                            else
                                for (ref = this._childViews, j = 0, len = ref.length; j < len; j++) step = ref[j], step.deactivate(options);
                            return this
                        }, Flow.prototype.catchSkip = function(e) {
                            var ref;
                            if (e.target === this.el && this.data.skippable && ("modal" === (ref = this.data.patternType) || "left" === ref)) return this.$el.find(".appcues-skip a").trigger("click")
                        }, Flow.prototype.render = function() {
                            return this.$el.html(""), this.$el.addClass(this.activeClass), this.shouldShowPoweredByBadge() && this.renderPoweredByBadge({
                                patternType: this.data.patternType
                            }), this._renderSteps(), this._renderSkipButton(), this._injectProgressBar(), this.activate(0), this
                        }, Flow.prototype._renderSteps = function() {
                            var i, isLast, j, len, numSteps, results, sortedSteps, step, stepData;
                            for (sortedSteps = this._sortSteps(this.data.steps), numSteps = sortedSteps.length, results = [], i = j = 0, len = sortedSteps.length; j < len; i = ++j) stepData = sortedSteps[i], isLast = i === numSteps - 1, step = new Step({
                                data: stepData,
                                isLast: isLast,
                                flowId: this.data.id,
                                flowName: this.data.name,
                                stepNumber: i
                            }), this._childViews.push(step), step.render(), results.push(this.$el.append(step.el));
                            return results
                        }, Flow.prototype._renderSkipButton = function() {
                            if (this.data.skippable) return this.$el.prepend("<div class='appcues-skip'><a data-step='skip'>&times;</a></div>")
                        }, Flow.prototype._sortSteps = function(stepsObj) {
                            var sortedIds, stepId, stepIds;
                            return stepIds = function() {
                                    var results;
                                    results = [];
                                    for (stepId in stepsObj) results.push(stepId);
                                    return results
                                }(), sortedIds = stepIds.sort(function(a, b) {
                                    var aNum, bNum;
                                    return aNum = stepsObj[a].stepNumber, bNum = stepsObj[b].stepNumber, null != aNum && null != bNum && aNum !== bNum ? aNum === bNum ? 0 : aNum < bNum ? -1 : 1 : a === b ? 0 : a < b ? -1 : 1
                                }),
                                function() {
                                    var j, len, results;
                                    for (results = [], j = 0, len = sortedIds.length; j < len; j++) stepId = sortedIds[j], results.push(stepsObj[stepId]);
                                    return results
                                }()
                        }, Flow.prototype._injectProgressBar = function() {
                            return this.$el.prepend('<div class="appcues-progress"><div class="appcues-progress-bar appcues-progress-bar-success"></div></div>')
                        }, Flow.prototype.updateContent = function() {
                            return this.removeChildViews(), this._renderSteps(), this.activate(this.currentStepIndex, {
                                silent: !0
                            })
                        }, Flow.prototype.updateProgress = function() {
                            var currentStep, progress, totalSteps;
                            if (null != this.currentStepIndex) return currentStep = this.currentStepIndex + 1, totalSteps = _.size(this._childViews), progress = currentStep / totalSteps, _.defer(function(_this) {
                                return function() {
                                    return _this.$(".appcues-progress .appcues-progress-bar").css({
                                        width: 100 * progress + "%"
                                    })
                                }
                            }(this)), this.$(".appcues-steps").text("Step " + currentStep + " of " + totalSteps)
                        }, Flow.prototype.removeChildViews = function() {
                            return _.invoke(this._childViews, "remove"), this._childViews = []
                        }, Flow.prototype.remove = function() {
                            return this.deactivate(this.currentStepIndex), Flow.__super__.remove.apply(this, arguments), this.removeChildViews(), this.onRemove(), this
                        }, Flow
                    }(View), _.extend(Flow.prototype, PoweredByView), Flow
                })
            }.call(this),
            function() {
                var bind = function(fn, me) {
                    return function() {
                        return fn.apply(me, arguments)
                    }
                };
                define("cocoon", ["jquery", "underscore"], function($, _) {
                    var Cocoon;
                    return Cocoon = function() {
                        function Cocoon(attrs) {
                            var id, ref;
                            return null == attrs && (attrs = {}), this.transform = bind(this.transform, this), this.fit = bind(this.fit, this), this.trigger = bind(this.trigger, this), this.on = bind(this.on, this), id = null != (ref = attrs.id) ? ref : _.uniqueId("cocoon"), _.defaults(attrs, {
                                id: id,
                                name: id
                            }), this.id = id, this.$frame = this.constructor.create(attrs), this.$frame.addClass("cocoon cocoon-frame"), this.initialize(attrs), this._isReady = !1, this._readyCallbacks = [], this.addListener(this.$frame[0]), this.$frame.on("load", _.bind(this.onFrameLoad, this)), this
                        }
                        return Cocoon.prototype.initialize = function(attrs) {}, Cocoon.prototype.addListener = function(frame) {
                            return window.addEventListener("message", function(_this) {
                                return function(arg) {
                                    var data, e, source;
                                    if (data = arg.data, source = arg.source, source === frame.contentWindow) {
                                        if ("string" == typeof data) try {
                                            data = JSON.parse(data)
                                        } catch (_error) {
                                            e = _error, data = {}
                                        }
                                        if ("ready" === data.action) {
                                            for (; _this._readyCallbacks.length;) _this._readyCallbacks.shift().call(_this);
                                            return _this._isReady = !0
                                        }
                                    }
                                }
                            }(this))
                        }, Cocoon.prototype.onFrameLoad = function() {
                            this.window = this.$frame[0].contentWindow
                        }, Cocoon.prototype.ready = function(callback) {
                            return this._isReady ? callback() : this._readyCallbacks.push(callback)
                        }, Cocoon.prototype.on = function(action, callback) {
                            return window.addEventListener("message", function(_this) {
                                return function(arg) {
                                    var data, e, source;
                                    if (data = arg.data, source = arg.source, source === _this.$frame[0].contentWindow) {
                                        if ("string" == typeof data) try {
                                            data = JSON.parse(data)
                                        } catch (_error) {
                                            e = _error, data = {}
                                        }
                                        return data.action === action ? callback() : void 0
                                    }
                                }
                            }(this))
                        }, Cocoon.prototype.off = function() {}, Cocoon.prototype.trigger = function(action, data) {
                            return data.action = action, this.$frame[0].contentWindow.postMessage(JSON.stringify(data), "*")
                        }, Cocoon.prototype.navigate = function(fragment) {
                            return this.$frame[0].contentWindow.location.hash = "#" + fragment
                        }, Cocoon.create = function(attrs) {
                            return null == attrs && (attrs = {}), _.defaults(attrs, {
                                seamless: !0,
                                width: "100%",
                                height: "100%",
                                src: "javascript:0",
                                tabindex: "-1",
                                allowtransparency: !0
                            }), $("<iframe/>", attrs)
                        }, Cocoon.prototype.$ = function(selector) {
                            return this.$frame.contents().find(selector)
                        }, Cocoon.prototype.fit = function(selector) {
                            var selected;
                            return selected = this.$frame.contents().find(selector), this.transform({
                                width: selected.outerWidth(!0),
                                height: selected.outerHeight(!0)
                            })
                        }, Cocoon.prototype.transform = function(attrs) {
                            var orig, ref;
                            return orig = null != (ref = attrs["pointer-events"]) ? ref : "", this.$frame.css("pointer-events", "none").css(attrs).css("pointer-events", orig)
                        }, Cocoon.prototype.css = function(path, callback) {
                            var el;
                            return el = this.window.document.createElement("link"), el.href = path, el.rel = "stylesheet", el.type = "text/css", callback && (callback = _.bind(callback, this), el.addEventListener("load", function() {
                                return callback(), el.removeEventListener("load", arguments.callee)
                            }, !1)), this.window.document.head.appendChild(el)
                        }, Cocoon.prototype.js = function(path, callback) {
                            var el;
                            return el = this.window.document.createElement("script"), el.src = path, el.type = "text/javascript", callback && (callback = _.bind(callback, this), el.addEventListener("load", function() {
                                return callback(), el.removeEventListener("load", arguments.callee)
                            }, !1)), this.window.document.head.appendChild(el)
                        }, Cocoon.prototype.destroy = function() {
                            return this.$frame.remove()
                        }, Cocoon
                    }()
                })
            }.call(this),
            function() {
                define("utils/element", ["jquery"], function($) {
                    var easeInOutQuad, scrollToElement;
                    return scrollToElement = function(element, to, duration) {
                        var animateScroll, change, currentTime, increment, start;
                        return start = element.scrollTop, change = to - start, currentTime = 0, increment = 20, (animateScroll = function() {
                            var val;
                            if (currentTime += increment, val = easeInOutQuad(currentTime, start, change, duration), element.scrollTop = val, currentTime < duration) return window.setTimeout(animateScroll, increment)
                        })()
                    }, easeInOutQuad = function(t, b, c, d) {
                        return (t /= d / 2) < 1 ? c / 2 * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b
                    }, {
                        getBoundingClientRect: function(el) {
                            var rect;
                            return rect = el.getBoundingClientRect(), null == rect.width && (rect.width = rect.right - rect.left), null == rect.height && (rect.height = rect.bottom - rect.top), rect
                        },
                        offset: function(el) {
                            var box, doc, docElem, win;
                            if (doc = el && el.ownerDocument) return box = this.getBoundingClientRect(el), win = this.getWindow(doc), docElem = doc.documentElement, {
                                top: box.top + win.pageYOffset - docElem.clientTop,
                                left: box.left + win.pageXOffset - docElem.clientLeft
                            }
                        },
                        getWindow: function(el) {
                            return this.isWindow(el) ? el : 9 === el.nodeType ? el.defaultView : void 0
                        },
                        isWindow: function(obj) {
                            return obj && obj === obj.window
                        },
                        isVisible: function(el) {
                            return !(!el.offsetWidth && !el.offsetHeight)
                        },
                        scrollTo: function(el) {
                            var body, currentLocation, scrollHeight, scrollPadding, targetLocation, windowHeight;
                            if (scrollPadding = 200, body = $("html body")[0], targetLocation = $(el).offset().top - scrollPadding, targetLocation < 0 && (targetLocation = 0), windowHeight = window.innerHeight - 20, currentLocation = body.scrollTop, scrollHeight = body.scrollHeight, !(targetLocation >= currentLocation && targetLocation <= currentLocation + windowHeight - scrollPadding)) return targetLocation + windowHeight > scrollHeight && (targetLocation = scrollHeight - windowHeight), scrollToElement(body, targetLocation, 300)
                        }
                    }
                })
            }.call(this),
            function() {
                define("views/hotspot-base", ["jquery", "underscore", "cocoon", "utils/element"], function($, _, Cocoon, domUtils) {
                    var BEACON_DIAMETER, BEACON_RADIUS, FIXED_CLASS, GRID_X, GRID_Y, getZIndex, hasFixedAncestor;
                    return BEACON_DIAMETER = 24, BEACON_RADIUS = BEACON_DIAMETER / 2, FIXED_CLASS = "hotspot-fixed", GRID_X = ["left", "", "right"], GRID_Y = ["top", "", "bottom"], hasFixedAncestor = function(node) {
                        var nodeStyle;
                        return nodeStyle = window.getComputedStyle(node), "fixed" === nodeStyle.position || null != node.parentElement && node.parentElement !== document.body && hasFixedAncestor(node.parentElement)
                    }, getZIndex = function(node) {
                        var nodeStyle, parentStyle, parentZIndex, ref, zIndex;
                        for (nodeStyle = window.getComputedStyle(node), zIndex = nodeStyle.zIndex; null != node.parentElement && node.parentElement !== document.body;) parentStyle = window.getComputedStyle(node.parentElement), parentZIndex = parentStyle.zIndex, "" === parentZIndex || "auto" === parentZIndex || "fixed" !== (ref = parentStyle.position) && "relative" !== ref && "absolute" !== ref && "sticky" !== ref || (zIndex = parentZIndex), node = node.parentElement;
                        return zIndex
                    }, {
                        BEACON_RADIUS: BEACON_RADIUS,
                        _initialize: function() {
                            return this.cocoon = new Cocoon, this.$tooltip = this.cocoon.$frame, this.edgeCombo = null, this._prevEdgeCombo = null
                        },
                        updateUI: function(animate, ignoreZIndex) {
                            var animateClass, bodyRect, e, node, nodeRect, offset, offsetXPercentage, offsetYPercentage, pageX, pageY, position, ref, ref1, relativeOffsetX, relativeOffsetY, transformProps, zIndex;
                            if (null == animate && (animate = !0), null == ignoreZIndex && (ignoreZIndex = !1), node = this.getNode(), this.isVisible()) {
                                if (nodeRect = domUtils.getBoundingClientRect(node), ref = this.getPercentageOffset(), offsetXPercentage = ref.offsetXPercentage, offsetYPercentage = ref.offsetYPercentage, relativeOffsetX = nodeRect.width * (null != offsetXPercentage ? offsetXPercentage : 0), relativeOffsetY = nodeRect.height * (null != offsetYPercentage ? offsetYPercentage : 0), hasFixedAncestor(node) ? (offset = nodeRect, position = "fixed", this.$el.addClass(FIXED_CLASS)) : (offset = domUtils.offset(node), "relative" !== (ref1 = window.getComputedStyle(document.body).position) && "absolute" !== ref1 && "fixed" !== ref1 || (bodyRect = domUtils.getBoundingClientRect(document.body), offset.left -= bodyRect.left + (window.pageXOffset || 0), offset.top -= bodyRect.top + (window.pageYOffset || 0)), this.$el.removeClass(FIXED_CLASS)), pageX = offset.left + relativeOffsetX, pageY = offset.top + relativeOffsetY, animate && (animateClass = "appcues-animated", this.$el.addClass(animateClass).one("transitionend", function(_this) {
                                        return function() {
                                            return _this.$el.removeClass(animateClass)
                                        }
                                    }(this))), this.updateEdges({
                                        pageX: pageX,
                                        pageY: pageY
                                    }, "fixed" === position), transformProps = {
                                        top: pageY,
                                        left: pageX,
                                        position: null != position ? position : ""
                                    }, !ignoreZIndex) {
                                    if (zIndex = getZIndex(node), "" === zIndex || "auto" === zIndex) zIndex = 1;
                                    else try {
                                        zIndex = parseInt(zIndex) + 1
                                    } catch (_error) {
                                        e = _error, zIndex = null
                                    }
                                    null != zIndex && "fixed" === position ? transformProps.zIndex = zIndex : null != zIndex && this.$el.find("svg").css({
                                        zIndex: zIndex
                                    })
                                }
                                this.transform(transformProps)
                            }
                            return this.updateVisibility()
                        },
                        isVisible: function() {
                            var node;
                            return node = this.getNode(), node && domUtils.isVisible(node)
                        },
                        getNode: function() {},
                        getPercentageOffset: function() {
                            return {}
                        },
                        updateEdges: function(offset, isFixed) {
                            var edgeCombo, edgeX, edgeY, edges, prevEdgeCombo, tooltipAlignment;
                            if (tooltipAlignment = this.getTooltipAlignment(), tooltipAlignment ? edgeCombo = tooltipAlignment : (edges = this.computeOpenEdges(offset, isFixed), edgeX = edges.x, edgeY = edges.y, edgeX && edgeY || edgeX ? (edgeY = edgeY || "bottom", edgeCombo = edgeY + "-" + edgeX) : edgeCombo = edgeY), prevEdgeCombo = this.edgeCombo, edgeCombo !== prevEdgeCombo) return this.$tooltip && this.$tooltip.removeClass("align-" + prevEdgeCombo).addClass("align-" + edgeCombo), this._prevEdgeCombo = this.edgeCombo, this.edgeCombo = edgeCombo, this.updateArrows()
                        },
                        getTooltipAlignment: function() {},
                        computeOpenEdges: function(offset, isFixed) {
                            var pageX, pageY, viewportHeight, viewportWidth, xPos, xRegion, yPos, yRegion;
                            return pageX = offset.pageX, pageY = offset.pageY, isFixed || (pageX -= document.body.scrollLeft, pageY -= document.body.scrollTop), viewportHeight = document.documentElement.clientHeight, viewportWidth = document.documentElement.clientWidth, xPos = Math.floor(Math.min(Math.max(pageX, 0), viewportWidth - 1) / (viewportWidth / 3)), yPos = Math.floor(Math.min(Math.max(pageY, 0), viewportHeight - 1) / (viewportHeight / 3)), 1 === xPos && 1 === yPos && (yPos = pageY <= viewportHeight / 2 ? 0 : 2), xRegion = GRID_X[Math.abs(xPos - (GRID_X.length - 1))], yRegion = GRID_Y[Math.abs(yPos - (GRID_Y.length - 1))], {
                                x: xRegion,
                                y: yRegion
                            }
                        },
                        updateArrows: function() {
                            return this.cocoon.$(".tooltip .content").removeClass("content-" + this._prevEdgeCombo).addClass("content-" + this.edgeCombo)
                        },
                        transform: function(css) {
                            return this.$el.css(css)
                        },
                        updateVisibility: function() {
                            var val;
                            return val = this.isVisible() ? "" : "hidden", this.transform({
                                visibility: val
                            })
                        }
                    }
                })
            }.call(this),
            function() {
                define("utils/animations", ["underscore"], function(_) {
                    return {
                        animations: {
                            animation: {
                                start: "animationstart",
                                end: "animationend"
                            },
                            OAnimation: {
                                start: "oAnimationStart",
                                end: "oAnimationEnd"
                            },
                            MozAnimation: {
                                start: "animationstart",
                                end: "animationend"
                            },
                            webkitAnimation: {
                                start: "webkitAnimationStart",
                                end: "webkitAnimationEnd"
                            }
                        },
                        getAnimationEvents: function() {
                            var animation;
                            return animation = null, _.each(this.animations, function(val, key) {
                                if (_.has(document.body.style, key)) return animation = val
                            }), animation
                        }
                    }
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("views/hotspot", ["jquery", "underscore", "env", "views/base", "views/hotspot-base", "models/user", "template", "utils/animations", "utils/logger", "utils/element", "es6-promise", "bootstrap"], function($, _, env, BaseView, hotspotBase, user, template, animations, logger, element, ES6Promise, bootstrap) {
                    var HotspotView;
                    return HotspotView = function(superClass) {
                        function HotspotView() {
                            return HotspotView.__super__.constructor.apply(this, arguments)
                        }
                        return extend(HotspotView, superClass), HotspotView.prototype.className = function() {
                            var ref, ref1;
                            return null != (ref = null != bootstrap && null != (ref1 = bootstrap.styling) ? ref1.hotspotClass : void 0) ? ref : "hotspot"
                        }, HotspotView.prototype.initialize = function(options) {
                            switch (null == options && (options = {}), hotspotBase._initialize.apply(this, arguments), this.selector = options.data.selector, this.hotspotId = options.data.id, this.index = options.data.index, this.prepare(), null == this.events && (this.events = {}), this.data.patternType) {
                                case "beacon":
                                    return this.events[this.data.event + " .beacon"] = "activate"
                            }
                        }, HotspotView.prototype._setNode = function(selector, options) {
                            var $found, isRetry, now, reject, resolve;
                            if (logger.log("Trying to find the anchor node.", selector), isRetry = options.isRetry, resolve = options.resolve, reject = options.reject, window.clearTimeout(this._pollTimeoutId), now = +new Date, null == this._pollStartTimestamp && (this._pollStartTimestamp = now), now > this._pollStartTimestamp + this.POLL_TIMEOUT) return void reject(this._hotspotError("Reached the retry limit while trying to find anchor node for hotspot."));
                            if (!selector) return void reject(this._hotspotError("Missing the CSS selector of the hotspot anchor element."));
                            switch ($found = $(selector), $found.length) {
                                case 0:
                                    return this._pollTimeoutId = window.setTimeout(_.bind(this._setNode, this, selector, {
                                        isRetry: !0,
                                        resolve: resolve,
                                        reject: reject
                                    }), this.POLL_INTERVAL);
                                case 1:
                                    return this.node = $found.get(0), isRetry && this.updateUI(!1), resolve(this.node);
                                default:
                                    return reject(this._hotspotError("Unable to find unique hotspot anchor node. Expected one, found " + $found.length + "."))
                            }
                        }, HotspotView.prototype.POLL_INTERVAL = 100, HotspotView.prototype.POLL_TIMEOUT = 1e4, HotspotView.prototype.prepare = function() {
                            return this.nodePromise ? this.nodePromise : this.nodePromise = new ES6Promise.Promise(function(_this) {
                                return function(resolve, reject) {
                                    return _this._setNode(_this.selector, {
                                        isRetry: !1,
                                        resolve: resolve,
                                        reject: reject
                                    })
                                }
                            }(this))
                        }, HotspotView.prototype.getNode = function() {
                            var $found;
                            return this.node && element.isVisible(this.node) || ($found = $(this.selector), 1 === $found.length && (this.node = $found.get(0))), this.node
                        }, HotspotView.prototype.getPercentageOffset = function() {
                            return {
                                offsetXPercentage: this.data.offsetXPercentage,
                                offsetYPercentage: this.data.offsetYPercentage
                            }
                        }, HotspotView.prototype.getTooltipAlignment = function() {
                            return this.data.tooltipAlignment
                        }, HotspotView.prototype.render = function(options) {
                            var _render;
                            return this.$el.html(""), this.updateUI(!1), _render = _.bind(this._render, this, options), this.data.sequential ? _.delay(_render, 301) : _render()
                        }, HotspotView.prototype._render = function(options) {
                            if (null == options && (options = {}), this.renderBeacon({
                                    beaconColor: this.data.primaryColor || this.data.globalBeaconColor || "#FF765C",
                                    beaconStyle: this.data.globalBeaconStyle || "hotspot",
                                    hotspotAnimation: this.data.globalHotspotAnimation || "hotspot-animation-none",
                                    isVisible: this.isVisible()
                                }), this.renderTooltip({
                                    nextText: this.data.nextText || (options.lastHotspot ? "Close" : "Next"),
                                    skipText: this.data.skipText || "Hide these tips"
                                }), options.expanded && this.activate({
                                    type: "auto-activate"
                                }), options.scrollTo) return element.scrollTo(this.cocoon.$frame)
                        }, HotspotView.prototype.renderBeacon = function(options) {
                            var beacon, style;
                            switch (null == options && (options = {}), options.beaconStyle) {
                                case "question":
                                    beacon = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg class="beacon" width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(3, 3)">\n        <circle fill="' + options.beaconColor + '" cx="9" cy="9" r="9" />\n        <path d="M9.8 9.7L9.8 10.7C9.8 11.1 9.5 11.5 9 11.5L9 11.5C8.6 11.5 8.2 11.1 8.2 10.7L8.2 9.1C8.2 8.7 8.5 8.3 8.9 8.3L9 8.2C10.7 7.9 11.4 7.4 11.4 6.6 11.4 5.8 10.3 5 9 5 7.7 5 6.7 5.7 6.6 6.5 6.6 7 6.2 7.3 5.7 7.3 5.3 7.2 4.9 6.8 5 6.4 5.1 4.7 6.9 3.4 9 3.4 11.2 3.4 13.1 4.8 13.1 6.6 13.1 8.2 12 9.2 9.8 9.7L9.8 9.7Z" fill="#FFFFFF"/>\n        <path d="M9.6 14.5C9.4 14.6 9.2 14.7 9 14.7 8.8 14.7 8.6 14.6 8.5 14.5 8.3 14.3 8.2 14.1 8.2 13.9 8.2 13.7 8.3 13.5 8.5 13.3 8.8 13 9.3 13 9.6 13.3 9.7 13.5 9.8 13.7 9.8 13.9 9.8 14.1 9.7 14.3 9.6 14.5L9.6 14.5Z" fill="#FFFFFF"/>\n    </g>\n</svg>';
                                    break;
                                default:
                                    style = "hidden" !== options.beaconStyle && options.isVisible ? "" : "visibility: hidden;", beacon = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg class="beacon animated bounce-in" width="24px" style="' + style + '" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <circle class="beacon-inner" fill="' + options.beaconColor + '" cx="12" cy="12" r="6"></circle>\n        <circle class="beacon-outer ' + options.hotspotAnimation + '" stroke="' + options.beaconColor + '" stroke-width="2" cx="12" cy="12" r="11"></circle>\n    </g>\n</svg>'
                            }
                            return this.$el.append("<div class='beacon-container'>" + beacon + "</div>")
                        }, HotspotView.prototype.renderTooltip = function(options) {
                            var content, contentHtml, html, ref, setContent;
                            return null == options && (options = {}), content = template(this.data.content, user.get()), contentHtml = '<div class="panel-content">\n    ' + content + "\n</div>", (this.data.skippable || this.data.sequential) && (contentHtml += '<div class="panel-content panel-content-actions">\n    <div class="appcues-actions-left">', this.data.skippable && (contentHtml += "<small class=\"text-muted appcues-skip\" onclick=\"(function(){parent.postMessage(JSON.stringify({action: 'skip'}), '*')})()\">\n    &#8856; " + options.skipText + "\n</small>"), contentHtml += '</div>\n<div class="appcues-actions-right">', this.data.sequential && (contentHtml += "<a class=\"appcues-button appcues-button-success\" onclick=\"(function(){parent.postMessage(JSON.stringify({action: 'next'}), '*')})()\">" + options.nextText + "</a>"), contentHtml += "    </div>\n</div>"), html = '<style type="text/css" class="appcues-global-styling">' + (null != (ref = this.data.globalStyling) ? ref : "") + '</style>\n<div class="tooltip">\n    <div class="content content-' + this.edgeCombo + '">\n        <div class="panel panel-default">\n            ' + contentHtml + "\n        </div>\n    </div>\n</div>", setContent = _.bind(function() {
                                var resizeCocoon;
                                return this.cocoon.$("body").html(html), this.setLinkTargets(), this.updateArrows(), resizeCocoon = _.bind(this.resizeCocoon, this), _.delay(resizeCocoon, 150), _.delay(resizeCocoon, 300), _.delay(resizeCocoon, 1e3)
                            }, this), this.$tooltip.one("load.delegateEvents" + this.cid, function(_this) {
                                return function() {
                                    return _this.cocoon.css(env.TOOLTIP_CSS, setContent), _this.cocoon.on("skip", _.bind(_this.onSkip, _this, _this)), _this.cocoon.on("next", _.bind(_this._onNext, _this, _this))
                                }
                            }(this)), options.visible || this.$tooltip[0].style.setProperty("display", "none", "important"), this.$el.append(this.$tooltip)
                        }, HotspotView.prototype.activate = function(e) {
                            var fn, onComplete, remove;
                            if (this.$tooltip.css("display", ""), this.resizeCocoon(), !this.data.sequential) {
                                switch (remove = _.bind(this.remove, this), onComplete = _.partial(this.onComplete, this, this.hotspotId), this.data.event) {
                                    case "mouseover":
                                        fn = function() {
                                            return this.$el.one("mouseout", function() {
                                                return remove(), onComplete()
                                            })
                                        };
                                        break;
                                    case "mouseout":
                                        fn = function() {
                                            return this.$el.one("mouseover", function(_this) {
                                                return function() {
                                                    return _this.$el.one("mouseout", function() {
                                                        return remove(), onComplete()
                                                    })
                                                }
                                            }(this))
                                        };
                                        break;
                                    default:
                                        fn = function() {
                                            return $(document).one("click", function() {
                                                return remove(), onComplete()
                                            })
                                        }
                                }
                                _.defer(_.bind(fn, this))
                            }
                            return this.onActivate(this, e)
                        }, HotspotView.prototype.setLinkTargets = function() {
                            return this.cocoon.$("a[href]").not("[target]").attr("target", "_parent")
                        }, HotspotView.prototype.resizeCocoon = function() {
                            var $tooltip;
                            return $tooltip = this.cocoon.$frame.contents().find(".tooltip"), this.cocoon.transform({
                                width: $tooltip.outerWidth(!0),
                                height: $tooltip.outerHeight(!0)
                            })
                        }, HotspotView.prototype._onNext = function(view) {
                            return this.remove(), this.onNext(this)
                        }, HotspotView.prototype.onActivate = function(view, evt) {}, HotspotView.prototype.onComplete = function(view, hotspotId) {}, HotspotView.prototype.onSkip = function(view) {}, HotspotView.prototype.onNext = function(view) {}, HotspotView.prototype.remove = function() {
                            var animation, onRemove;
                            return onRemove = _.bind(function() {
                                return HotspotView.__super__.remove.apply(this, arguments)
                            }, this), animation = animations.getAnimationEvents(), animation ? (this.$(".beacon").removeClass("bounce-in").addClass("bounce-out").one(animation.end, onRemove), _.delay(onRemove, 501)) : onRemove()
                        }, HotspotView.prototype.undelegateEvents = function() {
                            return this.cocoon.off(".delegateEvents" + this.cid), this.$tooltip.off(".delegateEvents" + this.cid), HotspotView.__super__.undelegateEvents.apply(this, arguments)
                        }, HotspotView.prototype._hotspotError = function(msg) {
                            var err;
                            return err = new Error(msg), err.hotspotId = this.hotspotId, err.selector = this.selector, err
                        }, HotspotView
                    }(BaseView), _.defaults(HotspotView.prototype, hotspotBase), HotspotView
                })
            }.call(this),
            function() {
                define("hotspots-analytics", ["underscore", "analytics", "eventbus"], function(_, analytics, Eventbus) {
                    var DEFAULT_CONTENT_TYPE, DEFAULT_NAME, HotspotsAnalyticsClient;
                    return DEFAULT_NAME = "Unnamed Hotspot Tour", DEFAULT_CONTENT_TYPE = "hotspots", HotspotsAnalyticsClient = function() {
                        function HotspotsAnalyticsClient(data1) {
                            this.data = data1, this.sessionId = Date.now(), this.name = this.data.name || DEFAULT_NAME, this.contentType = this.data.contentType || DEFAULT_CONTENT_TYPE
                        }
                        return HotspotsAnalyticsClient.prototype.trackShown = function(data) {
                            return this.track(this._eventPrefix() + "_shown", _.extend({
                                description: "Started " + this.name + " (Appcues)",
                                action: "click"
                            }, data))
                        }, HotspotsAnalyticsClient.prototype.trackEnd = function(data) {
                            return this.track(this._eventPrefix() + "_completed", _.extend({
                                description: "Completed " + this.name + " (Appcues)",
                                action: "click"
                            }, data))
                        }, HotspotsAnalyticsClient.prototype.trackSkip = function(data) {
                            return this.track(this._eventPrefix() + "_skipped", _.extend({
                                description: "Skipped " + this.name + " (Appcues)",
                                action: "click"
                            }, data))
                        }, HotspotsAnalyticsClient.prototype.trackError = function(data) {
                            return this.track(this._eventPrefix() + "_error", _.extend({
                                description: "Couldn't Show " + this.name + " (Appcues)",
                                action: "click"
                            }, data))
                        }, HotspotsAnalyticsClient.prototype.trackHotspotActivated = function(hotspotId, hotspotNumber, data) {
                            return null == hotspotNumber && (hotspotNumber = null), null == data && (data = {}), this.track(this._contentItemName() + "_activated", _.extend({
                                hotspotId: hotspotId,
                                description: "Activated " + this._contentItemName() + " " + hotspotNumber + " of " + this.name + " (Appcues)",
                                action: "click"
                            }, data))
                        }, HotspotsAnalyticsClient.prototype.track = function(eventId, data) {
                            var eventData;
                            return null == data && (data = {}), eventData = _.extend({}, {
                                contentType: this._eventContentType(),
                                contentId: this.data.id,
                                versionId: this.data.updatedAt,
                                actionId: eventId,
                                sessionId: this.sessionId,
                                hotspotId: this.data.hotspotId
                            }, data), "hotspots" === this.contentType && (eventData.groupId = this.data.id), Eventbus.emit(eventId, eventData), analytics.track(this._eventPrefix + "-events", eventData)
                        }, HotspotsAnalyticsClient.prototype._eventContentType = function() {
                            return {
                                hotspots: "hotspot-group",
                                coachmarks: "coachmark-group"
                            }[this.contentType]
                        }, HotspotsAnalyticsClient.prototype._eventPrefix = function() {
                            return this.contentType
                        }, HotspotsAnalyticsClient.prototype._contentItemName = function() {
                            return {
                                hotspots: "hotspot",
                                coachmarks: "coachmark"
                            }[this.contentType]
                        }, HotspotsAnalyticsClient
                    }()
                })
            }.call(this),
            function() {
                var bind = function(fn, me) {
                        return function() {
                            return fn.apply(me, arguments)
                        }
                    },
                    extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("views/hotspots", ["jquery", "underscore", "views/base", "views/hotspot", "utils/element", "hotspots-analytics", "es6-promise", "utils/reporter", "utils/logger", "views/mixins/poweredby"], function($, _, View, HotspotView, domUtils, HotspotsAnalyticsClient, ES6Promise, report, logger, PoweredByView) {
                    var DEBOUNCE_INTERVAL, Hotspots, UPDATE_POLL_INTERVAL;
                    return DEBOUNCE_INTERVAL = 100, UPDATE_POLL_INTERVAL = 500, Hotspots = function(superClass) {
                        function Hotspots() {
                            return this.onChildNext = bind(this.onChildNext, this), this.onSkip = bind(this.onSkip, this), this._onChildComplete = bind(this._onChildComplete, this), this._onChildActivate = bind(this._onChildActivate, this), Hotspots.__super__.constructor.apply(this, arguments)
                        }
                        var sortHotspots;
                        return extend(Hotspots, superClass), Hotspots.prototype.className = "hotspots", Hotspots.prototype.initialize = function(options) {
                            var hotspots, ref, sharedOpts;
                            return null == options && (options = {}), ref = options.data, hotspots = ref.hotspots, this.sequential = ref.sequential, this._views = [], this._hotspots = [], sharedOpts = _.pick(options.data, ["skippable", "sequential", "globalStyling", "globalBeaconColor", "globalBeaconStyle", "globalHotspotAnimation"]), _.each(hotspots, function(hotspot) {
                                var view;
                                if (this._hotspots.push(hotspot), !hotspot.shown) return view = new HotspotView({
                                    id: hotspot.id,
                                    data: _.extend(hotspot, sharedOpts),
                                    onActivate: this._onChildActivate,
                                    onComplete: this.sequential ? this.onChildNext : this._onChildComplete,
                                    onSkip: this.onSkip,
                                    onNext: this.onChildNext
                                }), this._views.push(view)
                            }, this), this.client = new HotspotsAnalyticsClient(options.data)
                        }, sortHotspots = function(hotspots) {
                            return hotspots.sort(function(hotspotA, hotspotB) {
                                return null != hotspotA.index && null != hotspotB.index ? hotspotA.index - hotspotB.index : hotspotA.id < hotspotB.id ? -1 : hotspotA.id > hotspotB.id ? 1 : 0
                            })
                        }, Hotspots.prototype.render = function() {
                            var hotspotsShown;
                            return this.sequential ? ES6Promise.Promise.all(_.map(this._views, function(view) {
                                return view.prepare()
                            })).then(function(_this) {
                                return function() {
                                    var view;
                                    if (sortHotspots(_this._views), view = _this._views[0]) return _this.$el.append(view.el), _.defer(_.bind(view.render, view, {
                                        expanded: !0,
                                        scrollTo: !0,
                                        lastHotspot: 1 === _this._views.length
                                    })), _this.trackShown()
                                }
                            }(this)).catch(function(_this) {
                                return function(err) {
                                    return logger.error(err.message), report(err, {
                                        extra: {
                                            hotspotId: err.hotspotId,
                                            selector: err.selector
                                        }
                                    }), _this.client.trackError({
                                        error: err.message,
                                        hotspotId: err.hotspotId
                                    }), _this.remove(), _this.onComplete()
                                }
                            }(this)) : (hotspotsShown = !1, _.each(this._views, function(_this) {
                                return function(view) {
                                    return view.prepare().then(function() {
                                        if (_this.$el.append(view.el), view.render(), !hotspotsShown) return hotspotsShown = !0, _this.trackShown()
                                    }).catch(function(err) {
                                        return logger.warn(err.message), report(err, {
                                            extra: {
                                                hotspotId: err.hotspotId,
                                                selector: err.selector
                                            }
                                        }), _this.client.trackError({
                                            error: err.message
                                        })
                                    })
                                }
                            }(this))), this
                        }, Hotspots.prototype._onChildActivate = function(view, evt) {
                            var hotspot, index;
                            return this.shouldShowPoweredByBadge() && this.showPoweredByBadge(), this.onChildActivate(view, view.id), sortHotspots(this._hotspots), hotspot = _.find(this._hotspots, function(hotspot) {
                                return hotspot.id === view.id
                            }), index = _.indexOf(this._hotspots, hotspot), index === -1 && (index = "?"), this.client.trackHotspotActivated(view.id, index)
                        }, Hotspots.prototype._onChildComplete = function(view, hotspotId) {
                            if (this.shouldShowPoweredByBadge() && this.hidePoweredByBadge(), this.onChildComplete(view, hotspotId), this._views = _.filter(this._views, function(_this) {
                                    return function(v) {
                                        return v !== view
                                    }
                                }(this)), this._views.length <= 0) return this.client.trackEnd({
                                sequential: this.sequential
                            }), this.remove(), this.onComplete()
                        }, Hotspots.prototype.onSkip = function() {
                            return this.client.trackSkip(), this.remove(), this.onComplete()
                        }, Hotspots.prototype.onChildNext = function(view) {
                            if (this._onChildComplete(view, view.hotspotId), this._views.length > 0) return this.render()
                        }, Hotspots.prototype.remove = function() {
                            return _.invoke(this._views, "remove"), Hotspots.__super__.remove.apply(this, arguments), this.onRemove()
                        }, Hotspots.prototype.onComplete = function() {}, Hotspots.prototype.onChildActivate = function() {}, Hotspots.prototype.onChildComplete = function() {}, Hotspots.prototype.onRemove = function() {}, Hotspots.prototype.delegateEvents = function() {
                            var recursiveUpdateUIs, updateUIs;
                            return updateUIs = _.bind(function() {
                                return _.invoke(this._views, "updateUI")
                            }, this), $(window).on("hashchange.appcues resize.appcues scroll.appcues", _.debounce(updateUIs, DEBOUNCE_INTERVAL)), $(document).on("click.appcues", _.debounce(updateUIs, DEBOUNCE_INTERVAL)), null == this._updateIntervalId && (recursiveUpdateUIs = function() {
                                return updateUIs(), window.setTimeout(recursiveUpdateUIs, UPDATE_POLL_INTERVAL)
                            }, this._updateIntervalId = recursiveUpdateUIs()), Hotspots.__super__.delegateEvents.apply(this, arguments)
                        }, Hotspots.prototype.undelegateEvents = function() {
                            return $(window).off("hashchange.appcues resize.appcues scroll.appcues"), $(document).off("click.appcues"), null != this._updateIntervalId && window.clearTimeout(this._updateIntervalId), Hotspots.__super__.undelegateEvents.apply(this, arguments)
                        }, Hotspots.prototype.trackShown = function() {
                            if (!this._trackedShown) return this.client.trackShown(), this._trackedShown = !0
                        }, Hotspots
                    }(View), _.extend(Hotspots.prototype, PoweredByView), Hotspots
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("views/coachmark", ["jquery", "underscore", "env", "views/base", "views/hotspot-base", "models/user", "template", "utils/animations", "utils/logger", "utils/element", "es6-promise"], function($, _, env, BaseView, hotspotBase, user, template, animations, logger, element, ES6Promise) {
                    var CoachmarkView;
                    return CoachmarkView = function(superClass) {
                        function CoachmarkView() {
                            return CoachmarkView.__super__.constructor.apply(this, arguments)
                        }
                        return extend(CoachmarkView, superClass), CoachmarkView.prototype.className = "coachmark", CoachmarkView.prototype.initialize = function(options) {
                            return null == options && (options = {}), hotspotBase._initialize.apply(this, arguments), this.selector = options.data.selector, this.hotspotId = options.data.id, this.index = options.data.index, this.prepare(), null != this.events ? this.events : this.events = {}
                        }, CoachmarkView.prototype._setNode = function(selector, options) {
                            var $found, isRetry, now, reject, resolve;
                            if (logger.log("Trying to find the anchor node.", selector),
                                isRetry = options.isRetry, resolve = options.resolve, reject = options.reject, window.clearTimeout(this._pollTimeoutId), now = +new Date, null == this._pollStartTimestamp && (this._pollStartTimestamp = now), now > this._pollStartTimestamp + this.POLL_TIMEOUT) return void reject(this._hotspotError("Reached the retry limit while trying to find anchor node for hotspot."));
                            if (!selector) return void reject(this._hotspotError("Missing the CSS selector of the hotspot anchor element."));
                            switch ($found = $(selector), $found.length) {
                                case 0:
                                    return this._pollTimeoutId = window.setTimeout(_.bind(this._setNode, this, selector, {
                                        isRetry: !0,
                                        resolve: resolve,
                                        reject: reject
                                    }), this.POLL_INTERVAL);
                                case 1:
                                    return this.node = $found.get(0), isRetry && this.updateUI(!1), resolve(this.node);
                                default:
                                    return reject(this._hotspotError("Unable to find unique hotspot anchor node. Expected one, found " + $found.length + "."))
                            }
                        }, CoachmarkView.prototype.POLL_INTERVAL = 100, CoachmarkView.prototype.POLL_TIMEOUT = 1e4, CoachmarkView.prototype.prepare = function() {
                            return this.nodePromise ? this.nodePromise : this.nodePromise = new ES6Promise.Promise(function(_this) {
                                return function(resolve, reject) {
                                    return _this._setNode(_this.selector, {
                                        isRetry: !1,
                                        resolve: resolve,
                                        reject: reject
                                    })
                                }
                            }(this))
                        }, CoachmarkView.prototype.adjustAlignment = function() {
                            var ref, ref1, ref2, ref3, ref4, ref5;
                            if (this.$el.hasClass("content-align-middle") ? null != (ref = this.$tooltip[0].style) && ref.setProperty("margin-top", "-" + this.$tooltip.height() / 2 + "px", "important") : null != (ref1 = this.$tooltip[0].style) && ref1.removeProperty("margin-top"), this.$el.hasClass("content-align-center") ? null != (ref2 = this.$tooltip[0].style) && ref2.setProperty("margin-left", "-" + this.$tooltip.width() / 2 + "px", "important") : null != (ref3 = this.$tooltip[0].style) && ref3.removeProperty("margin-left"), this.$el.hasClass("content-left") && null != (ref4 = this.$tooltip[0].style) && ref4.setProperty("margin-right", "70px", "important"), this.$el.hasClass("content-right")) return null != (ref5 = this.$tooltip[0].style) ? ref5.setProperty("margin-left", "70px", "important") : void 0
                        }, CoachmarkView.prototype.getNode = function() {
                            var $found;
                            return this.node && element.isVisible(this.node) || ($found = $(this.selector), 1 === $found.length && (this.node = $found.get(0))), this.node
                        }, CoachmarkView.prototype.getPercentageOffset = function() {
                            return {
                                offsetXPercentage: this.data.offsetXPercentage,
                                offsetYPercentage: this.data.offsetYPercentage
                            }
                        }, CoachmarkView.prototype.updateEdges = function(offset) {
                            var align, alignClasses, edge, edgeClasses, ref, ref1;
                            return edgeClasses = "content-top content-left content-right content-bottom", alignClasses = "content-align-top content-align-middle content-align-bottom content-align-left content-align-center content-align-right", edge = null != (ref = this.data.edge) ? ref : "bottom", align = null != (ref1 = this.data.align) ? ref1 : "left", this.$el.hasClass("content-" + edge) && this.$el.hasClass("content-align-" + align) || (this.$el.removeClass(edgeClasses + " " + alignClasses), this.$el.addClass("content-" + edge + " content-align-" + align)), this.updateArrows()
                        }, CoachmarkView.prototype.render = function(options) {
                            var _render;
                            return null == options && (options = {}), this.$el.html(""), this.updateUI(!1), _render = function(_this) {
                                return function() {
                                    if (_this.renderTooltip({
                                            nextText: _this.data.nextText || (options.lastHotspot ? "Close" : "Next"),
                                            skipText: _this.data.skipText || "Hide these tips"
                                        }), options.expanded && _this.activate({
                                            type: "auto-activate"
                                        }), options.scrollTo) return element.scrollTo(_this.cocoon.$frame)
                                }
                            }(this), this.data.sequential ? _.delay(_render, 301) : _render()
                        }, CoachmarkView.prototype.updateUI = function(animate) {
                            var rect;
                            if (this.isVisible()) return rect = element.getBoundingClientRect(this.node), this.$el.css({
                                width: rect.width,
                                height: rect.height
                            }), hotspotBase.updateUI.apply(this, [animate, !0]), this.adjustAlignment()
                        }, CoachmarkView.prototype.renderTooltip = function(options) {
                            var align, content, contentHtml, edge, html, ref, ref1, setContent;
                            return null == options && (options = {}), content = template(this.data.content, user.get()), edge = null != (ref = this.data.edge) ? ref : "bottom", align = null != (ref1 = this.data.align) ? ref1 : "left", contentHtml = '<div class="panel-content">\n    ' + content + "\n</div>", this.data.sequential && (contentHtml += '<div class="panel-content panel-content-actions">\n    <div class="appcues-actions-left">', this.data.skippable && (contentHtml += "<small class=\"text-muted appcues-skip\" onclick=\"(function(){parent.postMessage(JSON.stringify({action: 'skip'}), '*')})()\">\n    &#8856; " + options.skipText + "\n</small>"), contentHtml += '    </div>\n    <div class="appcues-actions-right">\n        <a class="appcues-button appcues-button-success" onclick="(function(){parent.postMessage(JSON.stringify({action: \'next\'}), \'*\')})()">' + options.nextText + "</a>\n    </div>\n</div>"), html = '<div class="coachmark">\n    <div class="content content-' + edge + " content-align-" + align + '">\n        <div class="panel panel-default">\n            ' + contentHtml + "\n        </div>\n    </div>\n</div>", setContent = _.bind(function() {
                                return this.cocoon.$("body").html(html), this.updateArrows(), this.cocoon.fit(".coachmark"), this.adjustAlignment()
                            }, this), this.$tooltip.one("load.delegateEvents" + this.cid, function(_this) {
                                return function() {
                                    return _this.cocoon.css(env.COACHMARK_CSS, setContent), _this.cocoon.on("skip", _.bind(_this.onSkip, _this, _this)), _this.cocoon.on("next", _.bind(_this._onNext, _this, _this))
                                }
                            }(this)), options.visible || this.$tooltip[0].style.setProperty("display", "none", "important"), this.$el.append(this.$tooltip)
                        }, CoachmarkView.prototype.activate = function(e) {
                            return this.$tooltip.css("display", ""), this.cocoon.fit(".coachmark"), this.onActivate(this, e)
                        }, CoachmarkView.prototype._onNext = function(view) {
                            return this.remove(), this.onNext(this)
                        }, CoachmarkView.prototype.onActivate = function(view, evt) {}, CoachmarkView.prototype.onComplete = function(view, hotspotId) {}, CoachmarkView.prototype.onSkip = function(view) {}, CoachmarkView.prototype.onNext = function(view) {}, CoachmarkView.prototype.remove = function() {
                            var animation, onRemove;
                            return onRemove = _.bind(function() {
                                return CoachmarkView.__super__.remove.apply(this, arguments)
                            }, this), animation = animations.getAnimationEvents(), animation ? _.delay(onRemove, 501) : onRemove()
                        }, CoachmarkView.prototype.undelegateEvents = function() {
                            return this.cocoon.off(".delegateEvents" + this.cid), this.$tooltip.off(".delegateEvents" + this.cid), CoachmarkView.__super__.undelegateEvents.apply(this, arguments)
                        }, CoachmarkView.prototype._hotspotError = function(msg) {
                            var err;
                            return err = new Error(msg), err.hotspotId = this.hotspotId, err.selector = this.selector, err
                        }, CoachmarkView
                    }(BaseView), _.defaults(CoachmarkView.prototype, hotspotBase), CoachmarkView
                })
            }.call(this),
            function() {
                var bind = function(fn, me) {
                        return function() {
                            return fn.apply(me, arguments)
                        }
                    },
                    extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("views/coachmarks", ["jquery", "underscore", "views/base", "views/coachmark", "utils/utils", "utils/element", "hotspots-analytics", "es6-promise", "utils/reporter", "utils/logger", "views/mixins/poweredby"], function($, _, View, CoachmarkView, utils, domUtils, HotspotsAnalyticsClient, ES6Promise, report, logger, PoweredByView) {
                    var Coachmarks, DEBOUNCE_INTERVAL, UPDATE_POLL_INTERVAL;
                    return DEBOUNCE_INTERVAL = 100, UPDATE_POLL_INTERVAL = 500, Coachmarks = function(superClass) {
                        function Coachmarks() {
                            return this.onChildNext = bind(this.onChildNext, this), this.onSkip = bind(this.onSkip, this), this._onChildComplete = bind(this._onChildComplete, this), this._onChildActivate = bind(this._onChildActivate, this), Coachmarks.__super__.constructor.apply(this, arguments)
                        }
                        return extend(Coachmarks, superClass), Coachmarks.prototype.className = "coachmarks", Coachmarks.prototype.initialize = function(options) {
                            var hotspots, ref, sharedOpts;
                            return null == options && (options = {}), ref = options.data, hotspots = ref.hotspots, this.sequential = ref.sequential, this._views = [], sharedOpts = _.pick(options.data, ["skippable", "sequential"]), _.each(hotspots, function(item) {
                                var view;
                                if (!item.shown) return view = new CoachmarkView({
                                    id: item.id,
                                    data: _.extend(item, sharedOpts),
                                    onActivate: this._onChildActivate,
                                    onComplete: this.sequential ? this.onChildNext : this._onChildComplete,
                                    onSkip: this.onSkip,
                                    onNext: this.onChildNext
                                }), this._views.push(view)
                            }, this), options.data.contentType = "coachmarks", this.client = new HotspotsAnalyticsClient(options.data), this.$el.on("click", ".appcues-backdrop", function(_this) {
                                return function() {
                                    return _this.complete()
                                }
                            }(this))
                        }, Coachmarks.prototype.render = function() {
                            return _.each(this._views, function(_this) {
                                return function(view) {
                                    return view.prepare().then(function() {
                                        return _this.$el.prepend(view.el), view.render({
                                            expanded: !0
                                        })
                                    }).catch(function(err) {
                                        return logger.warn(err.message), report(err, {
                                            extra: {
                                                hotspotId: err.hotspotId,
                                                selector: err.selector
                                            }
                                        }), _this.client.trackError({
                                            error: err.message,
                                            hotspotId: err.hotspotId
                                        })
                                    })
                                }
                            }(this)), this.sequential || this.renderBackdrop(), this.trackShown(), this
                        }, Coachmarks.prototype.renderBackdrop = function(el) {
                            var dimensions, offset, pageDim, rect;
                            return el ? (rect = domUtils.getBoundingClientRect(el), offset = domUtils.offset(el), pageDim = utils.getPageDimensions(), dimensions = {
                                left: {
                                    width: offset.left
                                },
                                right: {
                                    width: pageDim.width - offset.left - rect.width
                                },
                                top: {
                                    width: rect.width,
                                    height: offset.top,
                                    left: rect.left
                                },
                                bottom: {
                                    width: rect.width,
                                    height: pageDim.height - offset.top - rect.height,
                                    left: rect.left,
                                    top: offset.top + rect.height
                                }
                            }, _.each(dimensions, function(_this) {
                                return function(styles, name) {
                                    var $el;
                                    return $el = $("<div class='appcues-backdrop-" + name + "'></div>"), $el.css(styles), _this.$el.append($el)
                                }
                            }(this))) : this.$el.append('<div class="appcues-backdrop"></div>'), this
                        }, Coachmarks.prototype._onChildActivate = function(view, evt) {
                            return this.sequential && this.renderBackdrop(view.el), this.onChildActivate(view, view.id), this.client.trackHotspotActivated(view.id)
                        }, Coachmarks.prototype._onChildComplete = function(view, hotspotId) {
                            if (this.shouldShowPoweredByBadge() && this.hidePoweredByBadge(), this.onChildComplete(view, hotspotId), this._views = _.filter(this._views, function(v) {
                                    return v !== view
                                }), this._views.length <= 0) return this.client.trackEnd(), this.remove(), this.onComplete()
                        }, Coachmarks.prototype.onSkip = function() {
                            return this.client.trackSkip(), this.remove(), this.onComplete()
                        }, Coachmarks.prototype.onChildNext = function(view) {
                            if (this._onChildComplete(view, view.hotspotId), this._views.length > 0) return this.render()
                        }, Coachmarks.prototype.remove = function() {
                            return _.invoke(this._views, "remove"), Coachmarks.__super__.remove.apply(this, arguments), this.onRemove()
                        }, Coachmarks.prototype.complete = function() {
                            return this.client.trackEnd(), this.remove(), this.onComplete()
                        }, Coachmarks.prototype.onComplete = function() {}, Coachmarks.prototype.onChildActivate = function() {}, Coachmarks.prototype.onChildComplete = function() {}, Coachmarks.prototype.onRemove = function() {}, Coachmarks.prototype.delegateEvents = function() {
                            var recursiveUpdateUIs, updateUIs;
                            return updateUIs = _.bind(function() {
                                return _.invoke(this._views, "updateUI", !1, !0)
                            }, this), $(window).on("hashchange.appcues resize.appcues scroll.appcues", _.debounce(updateUIs, DEBOUNCE_INTERVAL)), $(document).on("click.appcues", _.debounce(updateUIs, DEBOUNCE_INTERVAL)), null == this._updateIntervalId && (recursiveUpdateUIs = function() {
                                return updateUIs(), window.setTimeout(recursiveUpdateUIs, UPDATE_POLL_INTERVAL)
                            }, this._updateIntervalId = recursiveUpdateUIs()), Coachmarks.__super__.delegateEvents.apply(this, arguments)
                        }, Coachmarks.prototype.undelegateEvents = function() {
                            return $(window).off("hashchange.appcues resize.appcues scroll.appcues"), $(document).off("click.appcues"), null != this._updateIntervalId && window.clearTimeout(this._updateIntervalId), Coachmarks.__super__.undelegateEvents.apply(this, arguments)
                        }, Coachmarks.prototype.trackShown = function() {
                            if (!this._trackedShown) return this.client.trackShown(), this._trackedShown = !0
                        }, Coachmarks
                    }(View), _.extend(Coachmarks.prototype, PoweredByView), Coachmarks
                })
            }.call(this),
            function() {
                define("utils/after-every", [], function() {
                    return function(times, func) {
                        var _times;
                        return _times = times,
                            function() {
                                if (--times < 1) return times = _times, func.apply(this, arguments)
                            }
                    }
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("views/status", ["env", "jquery", "underscore", "models/settings", "utils/store", "utils/urls", "views/base"], function(env, $, _, settings, store, urls, View) {
                    var Status;
                    return Status = function(superClass) {
                        function Status() {
                            return Status.__super__.constructor.apply(this, arguments)
                        }
                        return extend(Status, superClass), Status.prototype.tagName = "appcues-status", Status.prototype.events = {
                            "click .apc-status": "showDetail",
                            "click .apc-close": "remove",
                            "click .apc-send-log": "_sendLog"
                        }, Status.prototype.initialize = function(options) {
                            return null == options && (options = {}), this.sendLog = options.sendLog, this.onRemove = options.onRemove, options
                        }, Status.prototype.render = function() {
                            var details, latestCheck, property, ref, ref1, ref2, summary, user, value;
                            if (this.$el.html('<div class="apc-header"><a class="apc-close">&times;</a><h5>Appcues<small>' + env.VERSION + "</small></h5></div>"), latestCheck = this.getLatestCheck(), (null != latestCheck && null != (ref = latestCheck.details) ? ref.location : void 0) === window.location.href ? this.$el.append(this.buildStatus(!0, "Appcues started", "Checked " + urls.getPath(latestCheck.details.location))) : (summary = (null != latestCheck && null != (ref1 = latestCheck.details) ? ref1.location : void 0) ? "Last checked " + urls.getPath(latestCheck.details.location) : "Appcues.start() was never called.", this.$el.append(this.buildStatus(!1, "Appcues not started on this page", summary))), user = null != latestCheck && null != (ref2 = latestCheck.details) ? ref2.user : void 0, null != user ? user.uuid : void 0) {
                                details = '<div class="apc-details"><table>';
                                for (property in user) value = user[property], details += '<tr><td class="apc-property">' + property + "</td><td>" + value + "</td></tr>";
                                details += "</table></div>", this.$el.append(this.buildStatus(!0, "User identified", _.size(user) + " trait" + (1 === _.size(user) ? "" : "s"), details))
                            } else this.$el.append(this.buildStatus(!1, "User has not been identified", 'Call <a href="http://appcues.com/docs/" target="_blank">Appcues.identify()</a> to set traits.'));
                            return this.$el.append('<center class="apc-footer">Need more help? <a class="apc-send-log" href="mailto:support@appcues.com?subject=Appcues%20Installation%20(Account%20%23' + settings.get("appcuesId") + ')">Email support</a></center>')
                        }, Status.prototype.getLatestCheck = function() {
                            var ref;
                            return _.findWhere(null != (ref = store.get("apc_debug_log")) ? ref : [], {
                                type: "check"
                            })
                        }, Status.prototype.showDetail = function(evt) {
                            return this.$(evt.currentTarget).find(".apc-details").show()
                        }, Status.prototype.buildStatus = function(isGood, label, summary, details) {
                            return null == details && (details = ""), '<div class="apc-status ' + (isGood ? "apc-good" : "apc-bad") + '">\n    <span class="apc-icon">' + (isGood ? "&#10004;" : "&#10008;") + "</span>\n    <h5>" + label + '</h5>\n    <small class="apc-summary">' + summary + "</small>\n    " + details + "\n</div>"
                        }, Status.prototype._sendLog = function() {
                            return this.sendLog()
                        }, Status.prototype.remove = function() {
                            return Status.__super__.remove.apply(this, arguments), this.onRemove()
                        }, Status
                    }(View)
                })
            }.call(this),
            function() {
                define("utils/install-status", ["underscore", "jquery", "reqwest", "models/settings", "models/user", "env", "utils/reporter", "utils/logger", "utils/store", "views/status"], function(_, $, request, settings, user, env, report, logger, store, StatusView) {
                    var checkUrlTimeout, installStatus;
                    return installStatus = {
                        enable: function() {
                            return store.set("apc_debug_enabled", !0), logger.enable(), window.location.reload()
                        },
                        disable: function() {
                            return this.send(), store.set("apc_debug_enabled", !1), store.set("apc_debug_log", null), logger.disable()
                        },
                        isDebugMode: function() {
                            return store.get("apc_debug_enabled")
                        },
                        send: function() {
                            var appcuesId, data, timestamp;
                            return appcuesId = settings.get("appcuesId"), timestamp = +new Date, data = {
                                VERSION: env.VERSION,
                                userId: user.get("userId"),
                                isAnonymous: user.isAnonymous(),
                                cssInstalled: this.cssInstalled(),
                                jsConfigured: settings.isValid(),
                                url: window.location.href,
                                timestamp: timestamp,
                                numProperties: _.size(user.get()),
                                log: store.get("apc_debug_log")
                            }, request({
                                url: env.firebase + "/accounts/" + appcuesId + "/debug/" + timestamp + ".json?x-http-method-override=PUT",
                                method: "post",
                                crossOrigin: !0,
                                type: "json",
                                data: JSON.stringify(data)
                            }).catch(report)
                        },
                        cssInstalled: function() {
                            var c, i, installed, len, ref, regex;
                            for (installed = !1, regex = /appcues(\.min)?\.css/i, ref = document.styleSheets, i = 0, len = ref.length; i < len; i++)
                                if (c = ref[i], regex.test(c.href)) {
                                    installed = !0;
                                    break
                                }
                            return installed
                        },
                        log: function(type, details) {
                            var e, log, ref;
                            if (this.isDebugMode()) {
                                log = null != (ref = store.get("apc_debug_log")) ? ref : [];
                                try {
                                    log.unshift({
                                        type: type,
                                        time: new Date,
                                        details: details
                                    }), store.set("apc_debug_log", log.slice(0, 51))
                                } catch (_error) {
                                    e = _error, console.error("Error adding to log: ", log), console.error(e)
                                }
                                return this.showView()
                            }
                        },
                        checkUrl: function() {
                            var oldUrl;
                            if (oldUrl = store.get("apc_debug_url"), window.location.href !== oldUrl) return this.log("navigate", {
                                oldUrl: oldUrl,
                                newUrl: window.location.href
                            }), store.set("apc_debug_url", window.location.href)
                        },
                        showView: function() {
                            return null == this.view && (this.view = new StatusView({
                                sendLog: _.bind(this.send, this),
                                onRemove: _.bind(this.disable, this)
                            }), $("body").append(this.view.el)), this.view.render()
                        }
                    }, checkUrlTimeout = function() {
                        if (installStatus.isDebugMode()) return installStatus.checkUrl(), _.delay(checkUrlTimeout, 1e3)
                    }, installStatus.isDebugMode() ? checkUrlTimeout() : /hey_appcues/i.test(window.location.search) && installStatus.enable(), installStatus
                })
            }.call(this),
            function() {
                define("utils/user-checker", ["jquery", "underscore", "cocoon", "env"], function($, _, Cocoon, env) {
                    var UserChecker;
                    return UserChecker = function() {
                        function UserChecker(args) {
                            var onDOMReady, ready;
                            onDOMReady = function(_this) {
                                return function() {
                                    return _this.cocoon = new Cocoon({
                                        src: env.BUS_FRAME_SRC,
                                        css: {
                                            display: "none"
                                        }
                                    }), _this.attachBusFrame(), window.addEventListener("message", function(arg) {
                                        var data, e, origin, ref, source;
                                        if (data = arg.data, source = arg.source, origin = arg.origin, source === _this.cocoon.$frame[0].contentWindow) {
                                            if ("string" == typeof data) try {
                                                data = JSON.parse(data)
                                            } catch (_error) {
                                                e = _error, data = {}
                                            }
                                            switch (data.action) {
                                                case "ready":
                                                    return source.postMessage(JSON.stringify({
                                                        action: "checkLogin"
                                                    }), origin);
                                                case "match":
                                                    return data.value === (null != (ref = args.appcuesId) ? ref.toString() : void 0) ? Appcues.identify({
                                                        _myAppcuesId: data.value
                                                    }) : Appcues.identify({
                                                        _myAppcuesId: !1
                                                    })
                                            }
                                        }
                                    })
                                }
                            }(this), (ready = function(fn) {
                                return document.readyState === !1 ? document.addEventListener("DOMContentLoaded", fn) : fn()
                            })(onDOMReady)
                        }
                        return UserChecker.prototype.attachBusFrame = function() {
                            return $("body").append(this.cocoon.$frame)
                        }, UserChecker
                    }()
                })
            }.call(this),
            function() {
                var slice = [].slice;
                define("manager", ["jquery", "underscore", "models/user", "models/flow", "models/hotspot-group", "models/coachmark-group", "models/settings", "collections/goals", "collections/rules", "views/flow", "views/hotspots", "views/coachmarks", "eventbus", "analytics", "utils/logger", "utils/reporter", "utils/after-every", "utils/urls", "es6-promise", "cocoon", "env", "bootstrap", "utils/install-status", "utils/rule-checker", "utils/user-checker", "cookie", "template"], function($, _, user, FlowClient, HotspotGroupClient, CoachmarkGroupClient, settings, goals, RulesClient, FlowView, HotspotsView, CoachmarksView, Eventbus, analytics, logger, report, afterEvery, urls, ES6Promise, Cocoon, env, bootstrap, installStatus, ruleChecker, userChecker, cookie, template) {
                    var Manager, NEXT_CONTENT_COOKIE, accountStyles, bootstrapData, contentBuffer, ref, ref1;
                    return bootstrapData = null != bootstrap ? bootstrap : {}, accountStyles = null != (ref = bootstrapData.styling) ? ref : {}, contentBuffer = (null != (ref1 = bootstrapData.account) ? ref1.buffer : void 0) || 0, NEXT_CONTENT_COOKIE = "apc_nextContent", Manager = function() {
                        function Manager(options) {
                            this.options(options), this._currentContentId = null, this._currentContent = null, this.flowClient = new FlowClient(this._options), this.hotspotGroupClient = new HotspotGroupClient(this._options), this.coachmarkGroupClient = new CoachmarkGroupClient(this._options), this.rules = new RulesClient(this._options), this.goals = goals, this.trackView(), user.on("change", function(_this) {
                                return function(changed) {
                                    var appcuesId, ref2;
                                    if (null != (null != (ref2 = _this._currentContent) ? ref2.updateContent : void 0) && _this._currentContent.updateContent(), _.isObject(changed) && _.has(changed, "uuid") && !user.isAnonymous()) return appcuesId = settings.get("appcuesId"), _this.rules.fetch().then(_.bind(_this.checkAppcuesLogin, _this, appcuesId)).then(_.bind(_this.checkAndShow, _this)).catch(function(e) {
                                        return logger.log(e)
                                    })
                                }
                            }(this)), Eventbus.on("flow_finished hotspots_completed coachmarks_completed", function(_this) {
                                return function(eventData) {
                                    var nextContentId, redirectUrl, ref2, rule;
                                    if (rule = _this.rules.getRule(eventData.flowId || eventData.groupId || eventData.contentId), nextContentId = (null != rule ? rule.nextContentId : void 0) || (null != rule && null != (ref2 = rule.nextContent) ? ref2.id : void 0), redirectUrl = (null != rule ? rule.redirectUrl : void 0) || eventData.redirectUrl, nextContentId && (redirectUrl ? cookie.set(NEXT_CONTENT_COOKIE, nextContentId, {
                                            path: "/",
                                            expires: new Date(Date.now() + 3e4).toUTCString()
                                        }) : _this.show(nextContentId)), redirectUrl) return (null != rule ? rule.redirectNewTab : void 0) ? window.open(template(redirectUrl, user.get()), "_blank") : window.location.href = template(redirectUrl, user.get())
                                }
                            }(this)), this.refresh = this._refresh()
                        }
                        var appendWrappedContent, createSelfExecutingScript;
                        return Manager.prototype.refreshInterval = 5, Manager.prototype.options = function(options) {
                            return 0 === arguments.length ? this._options : void(this._options = _.clone(options))
                        }, Manager.prototype.checkAndShow = function() {
                            var alreadyShown, defaultsRuleId, filter, rule, ruleId, userRuleId;
                            return installStatus.checkUrl(), installStatus.log("check", {
                                location: window.location.href,
                                user: user.get()
                            }), (ruleId = cookie.get(NEXT_CONTENT_COOKIE)) ? (userRuleId = ruleId, filter = !1) : (ruleId = urls.getAppcueQuery()) ? (userRuleId = ruleId, filter = !1) : this.isBuffered(contentBuffer) ? userRuleId = null : (userRuleId = this.rules.getRuleIdForPath(), defaultsRuleId = this.rules.getRuleIdForPath(this.rules.data), rule = this.rules.getRule(userRuleId), alreadyShown = _.isObject(rule) && rule.shown, filter = !0, alreadyShown || !defaultsRuleId || userRuleId || (logger.log("User did not qualify to see rule " + defaultsRuleId + "."), this.trackExperimentExclusion(defaultsRuleId))), this._currentContentId && this._currentContentId !== userRuleId && (this._keepOpen ? (logger.log("Not showing new content, existing content manually kept open"), userRuleId = null) : this._currentContent ? this.checkRuleRelevance(this._currentContentId) ? (userRuleId = null, logger.log("Leaving current content on page (" + this._currentContentId + ").")) : (logger.log("Removing on-page content that is no longer relevant."), this._currentContent.remove(), this._currentContentId = null) : this._currentContentId = null), new ES6Promise.Promise(function(_this) {
                                return function(resolve, reject) {
                                    return userRuleId ? _this.show(userRuleId, {
                                        filter: filter
                                    }).then(resolve).then(function() {
                                        return cookie.remove(NEXT_CONTENT_COOKIE, {
                                            path: "/"
                                        })
                                    }).catch(reject) : resolve()
                                }
                            }(this))
                        }, Manager.prototype.callUserChecker = function(appcuesId) {
                            return new userChecker({
                                appcuesId: appcuesId
                            })
                        }, Manager.prototype.checkAppcuesLogin = function(appcuesId) {
                            var ref2, ref3, results, rule, ruleId;
                            ref2 = this.rules.data, results = [];
                            for (ruleId in ref2) {
                                if (rule = ref2[ruleId], null != (ref3 = rule.properties) ? ref3.hasOwnProperty("_myAppcuesId") : void 0) {
                                    this.callUserChecker(appcuesId);
                                    break
                                }
                                results.push(void 0)
                            }
                            return results
                        }, Manager.prototype.checkRuleRelevance = function(ruleId) {
                            var languageRulePassed, rule, urlRulePassed, userPropertiesPassed;
                            return rule = this.rules.getRule(ruleId), urlRulePassed = ruleChecker.checkUrl(rule, urls.getPath()), languageRulePassed = ruleChecker.checkLanguage(rule), userPropertiesPassed = ruleChecker.checkUserProperties(rule, user.get()), urlRulePassed || console.warn("Content does not match this URL rule: ", ruleId), languageRulePassed || console.warn("Content does not match this language rule: ", ruleId), userPropertiesPassed || console.warn("Content does not match this user properties rule: ", ruleId), urlRulePassed && languageRulePassed && userPropertiesPassed
                        }, Manager.prototype.trackView = function() {
                            var VIEW_TRACKED_KEY;
                            if (VIEW_TRACKED_KEY = "apc_view_tracked", !cookie.get(VIEW_TRACKED_KEY)) return cookie.set(VIEW_TRACKED_KEY, !0, {
                                expiry: 30
                            }), analytics.segmentTrack("Embed initialized", {
                                version: 2
                            })
                        }, Manager.prototype.trackExperimentExclusion = function(flowId) {
                            var ABProps, e, filter, i, len, match, numReasons, origProps, p, reason, rule, userData;
                            if (rule = _.clone(this.rules.getRule(flowId))) {
                                if (userData = user.get(), origProps = rule.properties || {}, ABProps = ["_ABGroup", "_variantGroup"], !rule.properties || !_.has(origProps, "_ABGroup") && !_.has(origProps, "_variantGroup")) return !1;
                                if (rule.properties && (rule.properties = _.omit(rule.properties, ABProps)), match = ruleChecker.checkUserProperties(rule, userData)) {
                                    for (reason = "Expected", numReasons = 0, i = 0, len = ABProps.length; i < len; i++) p = ABProps[i], filter = origProps[p], filter && (numReasons > 1 && (reason += " and"), reason += " " + p + " " + filter.operator + " " + filter.value + " (actual is " + userData[p] + ")", numReasons++);
                                    logger.log("User was excluded because of an A/B test. " + reason + ".");
                                    try {
                                        return analytics.track("experiment-excluded", {
                                            flowId: flowId,
                                            pageUrl: window.location.href,
                                            pageTitle: document.title,
                                            filters: origProps
                                        }), !0
                                    } catch (_error) {
                                        return e = _error, report(e), !1
                                    }
                                }
                            }
                        }, Manager.prototype.trackGoals = function() {
                            return this.goals._loading ? this.goals._loading : this.goals.loaded() ? void this.goals.track() : this.goals._loading = this.goals.fetch().then(function(_this) {
                                return function() {
                                    _this.goals.track()
                                }
                            }(this)).then(function(_this) {
                                return function() {
                                    return _this.goals._loading = null
                                }
                            }(this))
                        }, Manager.prototype.isBuffered = function(bufferLen) {
                            var lastSeenTimestamp;
                            return !!bufferLen && (lastSeenTimestamp = cookie.get("apc_lastSeenTimestamp"), bufferLen && lastSeenTimestamp && +new Date - lastSeenTimestamp < bufferLen)
                        }, Manager.prototype._refresh = function() {
                            var fetch;
                            return fetch = _.bind(this.rules.fetch, this.rules), afterEvery(this.refreshInterval, function() {
                                if (logger.log("Refreshing rules after having gone stale."), !this._refreshing) return this._refreshing = !0, fetch().then(function(_this) {
                                    return function() {
                                        return _this._refreshing = !1
                                    }
                                }(this))
                            })
                        }, Manager.prototype.show = function(ruleId, options) {
                            if (null == options && (options = {}), !ruleId) throw new Error("Appcues.show() called without an ID argument.");
                            return installStatus.log("show", {
                                ruleId: ruleId,
                                options: options
                            }), ES6Promise.Promise.all([this.fetchFlow(ruleId), this.fetchHotspotGroup(ruleId), this.fetchCoachmarkGroup(ruleId)]).then(function(_this) {
                                return function(arg) {
                                    var coachmarkGroup, flow, hotspotGroup;
                                    if (flow = arg[0], hotspotGroup = arg[1], coachmarkGroup = arg[2], null == flow && null == hotspotGroup && null == coachmarkGroup) throw new Error("No content found for id " + ruleId + ".");
                                    null != flow && _this.handleFlowContent(ruleId, flow, options), null != hotspotGroup && _this.handleHotspotGroupContent(ruleId, hotspotGroup, options), null != coachmarkGroup && _this.handleCoachmarkGroupContent(ruleId, coachmarkGroup, options)
                                }
                            }(this)).then(function() {
                                return contentBuffer && cookie.set("apc_lastSeenTimestamp", +new Date, {
                                    path: "/"
                                }), !0
                            }).catch(function(e) {
                                throw logger.warn(e), e
                            })
                        }, Manager.prototype.fetchContent = function(contentType, client, contentId) {
                            return new ES6Promise.Promise(function(resolve, reject) {
                                var msg;
                                return contentId ? client.fetch(contentId).then(resolve).catch(function(e) {
                                    return logger.log("Failed to fetch " + contentType + " " + contentId), resolve(null)
                                }) : (msg = "No content ID given.", logger.log(msg), reject(new Error(msg)))
                            })
                        }, Manager.prototype.fetchFlow = function(flowId) {
                            return this.fetchContent("flow", this.flowClient, flowId)
                        }, Manager.prototype.fetchHotspotGroup = function(hotspotGroupId) {
                            return this.fetchContent("hotspot-group", this.hotspotGroupClient, hotspotGroupId)
                        }, Manager.prototype.fetchCoachmarkGroup = function(coachmarkGroupId) {
                            return this.fetchContent("coachmark-group", this.coachmarkGroupClient, coachmarkGroupId)
                        }, Manager.prototype.handleContent = function(ruleId, content, options, renderMethod) {
                            var rule;
                            if (_.isObject(content)) {
                                if (options.filter) {
                                    if (!this.checkRuleRelevance(content.id)) throw new Error("This content is no longer relevant: " + content.id)
                                } else this._keepOpen = !0;
                                return this._currentContentId === content.id ? void logger.log("This content was already being displayed on the page: " + content.id) : (this._currentContent && this._currentContent.remove(), this._currentContentId = content.id, rule = this.rules.getRule(ruleId), "hotspot-group" === (null != rule ? rule.contentType : void 0) && (null != rule ? rule.hotspots : void 0) && null != rule.frequency && "every_time" !== rule.frequency && (options.filter || options.checkRelevant) && _.each(content.hotspots, function(hotspot, hotspotId) {
                                    return hotspot.shown = rule.hotspots[hotspotId] || !1
                                }), renderMethod.call(this, content))
                            }
                        }, Manager.prototype.handleFlowContent = function(ruleId, flow, options) {
                            return this.handleContent(ruleId, flow, options, this.renderFlow)
                        }, Manager.prototype.handleHotspotGroupContent = function(ruleId, hotspotGroup, options) {
                            return this.handleContent(ruleId, hotspotGroup, options, this.renderHotspotGroup)
                        }, Manager.prototype.handleCoachmarkGroupContent = function(ruleId, coachmarkGroup, options) {
                            return this.handleContent(ruleId, coachmarkGroup, options, this.renderCoachmarkGroup)
                        }, Manager.prototype.trackFlowShown = function(flow) {
                            var eventData, ref2;
                            return eventData = {
                                id: "flow_shown",
                                flowId: flow.id,
                                flowName: flow.name,
                                flowVersionId: flow.updatedAt,
                                stepType: "modal"
                            }, Eventbus.emit(eventData.id, eventData), Eventbus.emit("flow_analytics", eventData), null != (ref2 = this.rules) ? ref2.markFlowAsShown(flow.id) : void 0
                        }, Manager.prototype.renderFlow = function(flowData) {
                            var isComplete, onDOMReady, onFlowRemove;
                            flowData && (onFlowRemove = _.bind(function() {
                                return this._currentContentId = null, this._currentContent = null, this._keepOpen = !1
                            }, this), this.trackFlowShown(flowData), null == flowData.globalStyling && (flowData.globalStyling = accountStyles.globalStyling), isComplete = "complete" === document.readyState, onDOMReady = function() {
                                var $backdrop, $body, $container, $globalStyle, $prehook, _render, flow, ref2;
                                return $body = $("body"), $backdrop = $("<div class='appcues-backdrop' data-pattern-type='" + flowData.patternType + "'></div>"), flowData.sandbox || $backdrop.appendTo($body), isComplete || this.blockPage($body), $body.addClass("appcues-noscroll"), flow = new FlowView({
                                    data: flowData,
                                    attributes: {
                                        "data-pattern-type": flowData.patternType
                                    },
                                    onRemove: function() {
                                        return onFlowRemove(), $body.removeClass("appcues-noscroll"), $backdrop.remove(), flowData.sandbox && $container.remove(), "undefined" != typeof $prehook && null !== $prehook ? $prehook.remove() : void 0
                                    }
                                }), this._currentContent = flow, _render = function(_this) {
                                    return function() {
                                        return window.scrollTo(0, 0), flow.render(), $body.addClass(_this.activeClass), _this.unblockPage($body)
                                    }
                                }(this), null != flowData.prehook && ($prehook = createSelfExecutingScript(flowData.prehook), $body.append($prehook)), flowData.sandbox ? ($container = null, $backdrop.addClass("appcues-backdrop-transparent"), $globalStyle = $("<style class='appcues-global-styling' type='text/css'>" + (null != (ref2 = flowData.globalStyling) ? ref2 : "") + "</style>"), appendWrappedContent($body, $backdrop, $globalStyle, flow.el).then(function(c) {
                                    return $container = c, _.delay(function() {
                                        return $backdrop.removeClass("appcues-backdrop-transparent")
                                    }, 100), _render()
                                })) : ($body.append(flow.el), _render())
                            }, $(_.bind(onDOMReady, this)))
                        }, Manager.prototype.renderHotspotGroup = function(data) {
                            var $body, $container, hotspotsView, onHotspotsComplete, onHotspotsRemove, ref2, updateHotspotUserHistory;
                            return onHotspotsComplete = function(_this) {
                                return function() {
                                    var hotspotsViewed;
                                    return _this.rules.updateHotspotGroupState(data.id, "completed"), hotspotsViewed = _.object(_.pluck(data.hotspots, "id"), _.map(data.hotspots, function() {
                                        return !0
                                    })), _this.rules.markHotspotsViewed(data.id, hotspotsViewed)
                                }
                            }(this), onHotspotsRemove = function(_this) {
                                return function() {
                                    return _this._currentContentId = null, _this._currentContent = null, _this._keepOpen = !1
                                }
                            }(this), updateHotspotUserHistory = function(_this) {
                                return function(view, hotspotId) {
                                    var obj;
                                    return obj = {}, obj[hotspotId] = !0, _this.rules.markHotspotsViewed(data.id, obj)
                                }
                            }(this), $body = $("body"), $container = $("<appcues-layer/>"), $container.appendTo($body), null == data.globalStyling && (data.globalStyling = accountStyles.globalStyling || null), null == data.globalBeaconColor && (data.globalBeaconColor = accountStyles.globalBeaconColor || null), null == data.globalBeaconStyle && (data.globalBeaconStyle = accountStyles.globalBeaconStyle || null), null == data.globalHotspotStyling && (data.globalHotspotStyling = accountStyles.globalHotspotStyling || null), null == data.globalHotspotAnimation && (data.globalHotspotAnimation = accountStyles.globalHotspotAnimation || null), $container.append($("<style class='appcues-global-hotspot-styling' type='text/css'>" + (null != (ref2 = data.globalHotspotStyling) ? ref2 : "") + "</style>")), hotspotsView = new HotspotsView({
                                data: data,
                                onComplete: onHotspotsComplete,
                                onChildActivate: data.sequential ? function() {} : updateHotspotUserHistory,
                                onChildComplete: data.sequential ? updateHotspotUserHistory : function() {},
                                onRemove: onHotspotsRemove
                            }), this._currentContent = hotspotsView, $container.append(hotspotsView.el), hotspotsView.render(), this.rules.updateHotspotGroupState(data.id, "started")
                        }, Manager.prototype.renderCoachmarkGroup = function(data) {
                            var $container, coachmarksView, onComplete, onRemove;
                            return onComplete = function(_this) {
                                return function() {
                                    var hotspotsViewed;
                                    return _this.rules.updateCoachmarkGroupState(data.id, "completed"), hotspotsViewed = _.object(_.pluck(data.hotspots, "id"), _.map(data.hotspots, function() {
                                        return !0
                                    })), _this.rules.markCoachmarksViewed(data.id, hotspotsViewed)
                                }
                            }(this), onRemove = function(_this) {
                                return function() {
                                    return _this._currentContentId = null, _this._currentContent = null, _this._keepOpen = !1
                                }
                            }(this), $container = $("<appcues-layer/>"), $container.appendTo($("body")), coachmarksView = new CoachmarksView({
                                data: data,
                                onComplete: onComplete,
                                onRemove: onRemove
                            }), this._currentContent = coachmarksView, $container.append(coachmarksView.el), coachmarksView.render(), this.rules.updateCoachmarkGroupState(data.id, "started")
                        }, Manager.prototype.blockPage = function($target) {
                            $target.addClass("appcues-blocker")
                        }, Manager.prototype.unblockPage = function($target) {
                            $target.removeClass("appcues-blocker")
                        }, appendWrappedContent = function() {
                            var els, targetEl;
                            return targetEl = arguments[0], els = 2 <= arguments.length ? slice.call(arguments, 1) : [], new ES6Promise.Promise(function(resolve, reject) {
                                var $container, cocoon;
                                return $container = $('<appcues-container class="fullscreen ontop"/>'), cocoon = new Cocoon({
                                    css: {
                                        border: "none"
                                    }
                                }), cocoon.$frame.one("load.sandboxedContent", function() {
                                    return cocoon.css(env.APPCUES_SANDBOX_CSS, function() {
                                        return cocoon.$("body").empty().append(els), resolve($container)
                                    })
                                }), $container.append(cocoon.$frame), targetEl.append($container)
                            })
                        }, createSelfExecutingScript = function(scriptString) {
                            var $s;
                            return $s = $('<script type="application/javascript"></script>'), $s.text("(function() {\n    try {\n        " + scriptString + '\n    } catch (e) {\n        console.warn("Caught error running Appcues hook -- " + e.name + ": " + e.message);\n        console.warn(e.stack)\n    }\n})()')
                        }, Manager
                    }()
                })
            }.call(this),
            function() {
                var bind = function(fn, me) {
                    return function() {
                        return fn.apply(me, arguments)
                    }
                };
                define("flow-analytics", ["underscore", "utils/date", "utils/reporter", "analytics", "models/user"], function(_, date, report, analytics, user) {
                    var FlowAnalyticsClient;
                    return FlowAnalyticsClient = function() {
                        function FlowAnalyticsClient(id, data1) {
                            this.id = id, this.data = data1, this.beforeUnload = bind(this.beforeUnload, this), this._startTimestamp = this._previousTimestamp = this.sessionId = this.currentStepIndex = null
                        }
                        return FlowAnalyticsClient.prototype.start = function() {
                            return this.currentStepIndex = 0, this._startTimestamp = this.sessionId = date.now(), window.addEventListener("beforeunload", this.beforeUnload)
                        }, FlowAnalyticsClient.prototype.end = function() {
                            return window.removeEventListener("beforeunload", this.beforeUnload)
                        }, FlowAnalyticsClient.prototype.beforeUnload = function() {
                            var start;
                            for (this.track("flow_skipped"), start = +new Date; + new Date - start < 150;);
                        }, FlowAnalyticsClient.prototype.track = function(eventId, data) {
                            var e, now, timeSpent;
                            switch (null == data && (data = {}), now = date.now(), null != this._previousTimestamp ? timeSpent = now - this._previousTimestamp : null != this._startTimestamp ? timeSpent = now - this._startTimestamp : (e = new Error("FlowAnalytics.track called without reference to a previous timer."), report(e)), analytics.track(this.id, _.extend({}, {
                                flowId: this.id,
                                stepNumber: this.currentStepIndex,
                                flowVersionId: this.data.flowVersionId,
                                sessionId: this.sessionId,
                                actionId: eventId,
                                timestamp: now,
                                timeSpent: timeSpent
                            }, data)), this._previousTimestamp = now, eventId) {
                                case "flow_navigate_prev":
                                    return this.currentStepIndex -= 1;
                                case "flow_navigate_next":
                                    return this.currentStepIndex += 1;
                                case "flow_finished":
                                case "flow_skipped":
                                    return this.end()
                            }
                        }, FlowAnalyticsClient
                    }()
                })
            }.call(this),
            function() {
                define("utils/request", ["es6-promise"], function(ES6Promise) {
                    return {
                        request: function(options) {
                            var data, k, method, promise, queryStr, url, v;
                            if (url = options.url, method = options.method, data = options.data, null == method && (method = "GET"), method = method.toUpperCase(), "GET" === method && data) {
                                queryStr = "";
                                for (k in data) v = data[k], queryStr += encodeURIComponent(k) + "=" + encodeURIComponent(v);
                                url += "?" + queryStr, data = null
                            }
                            return promise = new ES6Promise.Promise(function(resolve, reject) {
                                var client, handler;
                                handler = function() {
                                    var e, response;
                                    if (4 === this.readyState)
                                        if (this.status >= 200 && this.status < 400) {
                                            if (this.response) response = this.response;
                                            else try {
                                                response = JSON.parse(this.responseText)
                                            } catch (_error) {
                                                e = _error, response = null
                                            }
                                            resolve(response)
                                        } else reject(this)
                                }, client = new XMLHttpRequest, client.open(method, url), client.onreadystatechange = handler, client.responseType = "json", client.setRequestHeader("Accept", "application/json"), data ? client.send(data) : client.send(), client = null
                            })
                        },
                        get: function(url, params) {
                            return this.request({
                                url: url,
                                method: "GET",
                                data: params
                            })
                        },
                        post: function(url, data) {
                            return this.request({
                                url: url,
                                method: "POST",
                                data: data
                            })
                        }
                    }
                })
            }.call(this),
            function() {
                define("utils/unique-id", ["utils/date"], function(date) {
                    return function() {
                        var d, ref;
                        return d = ("undefined" != typeof performance && null !== performance ? performance.now : void 0) && (null != (ref = performance.timing) ? ref.navigationStart : void 0) ? performance.timing.navigationStart + 1e3 * performance.now() : 1e3 * date.now(), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                            var r;
                            return r = (d + 16 * Math.random()) % 16 | 0, d = Math.floor(d / 16), ("x" === c ? r : 3 & r | 8).toString(16)
                        })
                    }
                })
            }.call(this),
            function() {
                var indexOf = [].indexOf || function(item) {
                    for (var i = 0, l = this.length; i < l; i++)
                        if (i in this && this[i] === item) return i;
                    return -1
                };
                define("flow-events", ["underscore"], function(_) {
                    var EVENT_GROUPS;
                    return EVENT_GROUPS = [{
                        name: "started",
                        events: ["flow_shown", "hotspots_shown", "coachmarks_shown"],
                        triggers: ["flow", "step"]
                    }, {
                        name: "completed",
                        events: ["flow_finished", "hotspots_completed", "coachmarks_completed"],
                        triggers: ["step", "flow"]
                    }, {
                        name: "skipped",
                        events: ["flow_skipped", "hotspots_skipped"],
                        triggers: ["step", "flow"]
                    }, {
                        name: "interacted",
                        events: ["hotspot_activated", "coachmark_activated", "flow_navigate_prev", "flow_navigate_next", "flow_navigate_link", "flow_navigate_jump", "flow_form_submission"],
                        triggers: ["step"]
                    }], {
                        createExternalEvents: function(eventId, attrs) {
                            var group;
                            return group = _.find(EVENT_GROUPS, function(_this) {
                                return function(group) {
                                    return indexOf.call(group.events, eventId) >= 0
                                }
                            }(this)), (null != group ? group.triggers : void 0) ? group.triggers.map(function(_this) {
                                return function(trigger) {
                                    return eventId = trigger + "_" + group.name, "flow" === trigger ? _this.createFlowEvent(eventId, attrs) : "step" === trigger ? _this.createStepEvent(eventId, attrs) : void 0
                                }
                            }(this)) : []
                        },
                        createFlowEvent: function(eventId, attrs) {
                            var eventName, flowId;
                            return null == attrs && (attrs = {}), eventName = this.humanizeEventId(eventId), flowId = attrs.flowId || attrs.contentId || attrs.groupId, _.extend({
                                eventName: eventName,
                                flowId: flowId
                            }, attrs)
                        },
                        createStepEvent: function(eventId, attrs) {
                            var baseEvent;
                            return null == attrs && (attrs = {}), baseEvent = this.createFlowEvent(eventId, attrs), _.extend({
                                stepId: baseEvent.flowId
                            }, baseEvent)
                        },
                        humanizeEventId: function(str) {
                            return str.split("_").map(function(w) {
                                return w.charAt(0).toUpperCase() + w.slice(1)
                            }).join(" ")
                        }
                    }
                })
            }.call(this),
            function() {
                define("api", ["underscore", "eventbus", "models/settings", "models/user", "manager", "utils/reporter", "flow-analytics", "utils/logger", "env", "utils/install-status", "utils/request", "utils/store", "utils/unique-id", "flow-events"], function(_, Eventbus, settings, user, Manager, report, FlowAnalyticsClient, logger, env, installStatus, request, store, generateUUID, flowEvents) {
                    var API;
                    return API = function() {
                        function API(options) {
                            var checkAndShow, manager, trackGoals;
                            this.manager = manager = new Manager(options), this.show = _.bind(manager.show, manager), this.load = _.bind(manager.renderFlow, manager), this.hotspots = _.bind(manager.renderHotspotGroup, manager), this.coachmarks = _.bind(manager.renderCoachmarkGroup, manager), checkAndShow = _.bind(manager.checkAndShow, manager), trackGoals = _.bind(manager.trackGoals, manager), this.start = function() {
                                var pageChanged;
                                return pageChanged = user.pageView(), pageChanged && (this.manager._keepOpen = !1), checkAndShow().catch(function(e) {
                                    return logger.error(e), report(e)
                                }), trackGoals()
                            }
                        }
                        return API.prototype.isBound = !1, API.prototype.identify = function(id, traits, options) {
                            var attrs;
                            return null == traits && (traits = {}), _.isObject(id) && (options = traits, traits = id, id = user.get("userId")), attrs = _.extend({
                                userId: id
                            }, traits), user.set(attrs, options), installStatus.log("identify", {
                                userId: id,
                                traits: traits,
                                options: options
                            })
                        }, API.prototype.anonymous = function() {
                            var anonKey, anonymousId;
                            return anonKey = "apc_anon_id", anonymousId = store.get(anonKey), (null == anonymousId || _.isEmpty(anonymousId)) && (anonymousId = "anon:" + generateUUID(), store.set(anonKey, anonymousId)), this.identify(anonymousId, {
                                _isAnonymous: !0
                            })
                        }, API.prototype.track = function() {
                            return "not implemented"
                        }, API.prototype.page = function() {
                            return this.start()
                        }, API.prototype.settings = function() {
                            return settings.get()
                        }, API.prototype.user = function() {
                            return user.get()
                        }, API.prototype.bind = function() {
                            return this.isBound || "onhashchange" in window && (window.addEventListener("hashchange", _.bind(this.start, this)), this.isBound = !0), this
                        }, API.prototype.unbind = function() {
                            return "onhashchange" in window && (window.removeEventListener("hashchange", _.bind(this.start, this)), this.isBound = !1), this
                        }, API.prototype.on = function(eventStr, callback, context) {
                            return null == callback && _.isFunction(eventStr) && (callback = eventStr, eventStr = "all"), null == eventStr && (eventStr = "all"), Eventbus.on(eventStr, callback, context)
                        }, API.prototype.off = function(eventStr, callback, context) {
                            return null == callback && _.isFunction(eventStr) && (callback = eventStr, eventStr = "all"), null == eventStr && (eventStr = "all"), Eventbus.off(eventStr, callback, context)
                        }, API.prototype.once = function(eventStr, callback, context) {
                            var _off, wrappedCallback;
                            return null == callback && _.isFunction(eventStr) && (callback = eventStr, eventStr = "all"), null == eventStr && (eventStr = "all"), _off = this.off, wrappedCallback = function() {
                                return _off(eventStr, wrappedCallback, context), callback.apply(this, arguments)
                            }, this.on(eventStr, wrappedCallback, context)
                        }, API.prototype.initGA = function() {
                            if (!this._gaInitialized) return this._gaInitialized = !0, Eventbus.on("all", function(eventId, eventData) {
                                var events;
                                return null == eventData && (eventData = {}), events = flowEvents.createExternalEvents(eventId, eventData), events.forEach(function(evt) {
                                    var gaFn, gaObj;
                                    return gaObj = window.GoogleAnalyticsObject, gaObj && (gaFn = window[gaObj]) && _.isFunction(gaFn) ? gaFn("send", "event", "appcues", "click", evt.eventName + " (Appcues)") : (window._gaq = window._gaq || [], window._gaq.push(["_trackEvent", "appcues", "click", evt.eventName + " (Appcues)"]))
                                })
                            })
                        }, API.prototype.initMixpanel = function(withUserData) {
                            var ref;
                            if (null == withUserData && (withUserData = !0), (null != (ref = window.mixpanel) ? ref.track : void 0) && !this._mixpanelInitialized) return this._mixpanelInitialized = !0, Eventbus.on("all", function(eventId, eventData) {
                                var events;
                                return null == eventData && (eventData = {}), events = flowEvents.createExternalEvents(eventId, eventData), events.forEach(function(evt) {
                                    var e, userData;
                                    try {
                                        return userData = withUserData ? user.get() : {}, mixpanel.track(evt.eventName + " (Appcues)", _.extend({}, userData, evt))
                                    } catch (_error) {
                                        return e = _error, logger.error("Could not track analytics data in Mixpanel.", e), report(e)
                                    }
                                })
                            })
                        }, API.prototype.initHeap = function(withUserData) {
                            if (null == withUserData && (withUserData = !0), !this._heapInitialized) return this._heapInitialized = !0, Eventbus.on("all", function(eventId, eventData) {
                                var events;
                                return null == eventData && (eventData = {}), events = flowEvents.createExternalEvents(eventId, eventData), events.forEach(function(evt) {
                                    var e, userData;
                                    try {
                                        return userData = withUserData ? user.get() : {}, window.heap.track(evt.eventName + " (Appcues)", _.extend({}, userData, evt))
                                    } catch (_error) {
                                        return e = _error, logger.error("Could not track analyitcs data in Heap.", e), report(e)
                                    }
                                })
                            })
                        }, API.prototype.initKM = function(withUserData) {
                            null == withUserData && (withUserData = !0), this._kmInitialized || (this._kmInitialized = !0, Eventbus.on("all", function(eventId, eventData) {
                                var events;
                                return null == eventData && (eventData = {}), events = flowEvents.createExternalEvents(eventId, eventData), events.forEach(function(evt) {
                                    var e, userData;
                                    try {
                                        return userData = withUserData ? user.get() : {}, window._kmq = window._kmq || [], window._kmq.push(["record", evt.eventName + " (Appcues)", _.extend({}, userData, evt)])
                                    } catch (_error) {
                                        return e = _error, logger.error("Could not track analytics data in KISSmetrics.", e), report(e)
                                    }
                                })
                            }))
                        }, API.prototype.initSegment = function(withUserData) {
                            var ref;
                            if (null == withUserData && (withUserData = !0), (null != (ref = window.analytics) ? ref.track : void 0) && !this._segmentInitialized) return this._segmentInitialized = !0, Eventbus.on("all", function(eventId, eventData) {
                                var events;
                                return null == eventData && (eventData = {}), events = flowEvents.createExternalEvents(eventId, eventData), events.forEach(function(evt) {
                                    var e, userData;
                                    try {
                                        return userData = withUserData ? user.get() : {}, window.analytics.track(evt.eventName + " (Appcues)", _.extend({}, userData, evt))
                                    } catch (_error) {
                                        return e = _error, logger.error("Could not track analytics data in Segment.", e), report(e)
                                    }
                                })
                            })
                        }, API.prototype.initTracker = function() {
                            var flows;
                            if (!this._trackerInitialized) return this._trackerInitialized = !0, flows = {}, Eventbus.on("flow_analytics", function(data) {
                                var actionId, client, e, flowId, msg;
                                return actionId = data.id, flowId = data.flowId, client = flows[flowId], flowId || (msg = "Tracking flow analytics event requires a flowId.", logger.error(msg), report(new Error(msg))), "flow_shown" === actionId && (null != client && client.end(), flows[flowId] = client = new FlowAnalyticsClient(flowId, data), client.start()), null != client ? client.track(actionId, data) : (msg = "Missing analytics tracker for flow.", e = new Error(msg), logger.error(msg), report(e, {
                                    extra: data
                                }))
                            })
                        }, API.prototype.debug = function(enable) {
                            null == enable && (enable = !0), enable ? installStatus.enable() : installStatus.disable()
                        }, API.prototype.sendLog = function() {
                            return installStatus.send()
                        }, API
                    }()
                })
            }.call(this),
            function() {
                var extend = function(child, parent) {
                        function ctor() {
                            this.constructor = child
                        }
                        for (var key in parent) hasProp.call(parent, key) && (child[key] = parent[key]);
                        return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child
                    },
                    hasProp = {}.hasOwnProperty;
                define("collections/integrations", ["underscore", "env", "client", "es6-promise", "bootstrap", "models/settings"], function(_, env, APIClient, ES6Promise, bootstrap, settings) {
                    var Integrations;
                    return new(Integrations = function(superClass) {
                        function Integrations() {
                            return Integrations.__super__.constructor.apply(this, arguments)
                        }
                        return extend(Integrations, superClass), Integrations.prototype.integrations = null, Integrations.prototype.urlRoot = function() {
                            var appcuesId;
                            return appcuesId = settings.get("appcuesId"), env.firebase + "/accounts/" + appcuesId
                        }, Integrations.prototype.fetch = function() {
                            var request;
                            return this._fetched = !1, request = _.bind(this.request, this), new ES6Promise.Promise(function(resolve, reject) {
                                var data;
                                return bootstrap && bootstrap.integrations ? (data = bootstrap.integrations, resolve(data)) : request({
                                    method: "get",
                                    url: "/integrations.json"
                                }).then(resolve, reject)
                            }).then(function(_this) {
                                return function(integrations) {
                                    return _this._fetched = !0, _this.integrations = integrations
                                }
                            }(this)).catch(function(e) {
                                return report(e)
                            })
                        }, Integrations
                    }(APIClient))
                })
            }.call(this),
            function() {
                define("utils/timing", ["env", "underscore", "models/settings"], function(env, _, settings) {
                    var getGAFn, hasPerf, instanceName, report, track;
                    return instanceName = "appcues_ga", report = function() {
                        var entries, gaFn;
                        if ((gaFn = getGAFn()) && hasPerf()) return entries = _.filter(window.performance.getEntries(), function(entry) {
                            var re;
                            return re = new RegExp("^https?:\\/\\/" + env.CDN_DOMAIN, "i"), null != entry.name.match(re)
                        }), _.each(entries, function(entry) {
                            var name;
                            return name = entry.name.replace(/\/[0-9]+\./, "/<account-id>."), track({
                                timingVar: name,
                                timingValue: Math.round(entry.duration),
                                timingLabel: settings.get("appcuesId")
                            })
                        })
                    }, track = function(data) {
                        var gaFn;
                        if (null == data && (data = {}), gaFn = getGAFn()) return ("function" == typeof gaFn.getByName ? gaFn.getByName(instanceName) : void 0) || gaFn("create", env.GA_TIMING_ACCOUNT_ID, "auto", {
                            name: instanceName
                        }), _.defaults(data, {
                            hitType: "timing",
                            timingCategory: "appcues"
                        }), gaFn(instanceName + ".send", data)
                    }, getGAFn = function() {
                        var gaFn, gaObj;
                        if (gaObj = window.GoogleAnalyticsObject, gaObj && (gaFn = window[gaObj]) && _.isFunction(gaFn)) return gaFn
                    }, hasPerf = function() {
                        return window.performance && _.isFunction(window.performance.getEntries)
                    }, {
                        report: report,
                        track: track
                    }
                })
            }.call(this),
            function() {
                define("main", ["env", "underscore", "utils/options", "utils/logger", "api", "models/settings", "models/user", "utils/install-status", "collections/integrations", "utils/timing"], function(env, _, getOptions, logger, API, settings, user, installStatus, integrations, timing) {
                    var Appcues, init, isStylesheetLoaded, options, style, stylesheets;
                    return _.delay(timing.report, 500), Appcues = {
                        VERSION: env.VERSION,
                        _isValidConfig: _.bind(settings.isValid, settings)
                    }, settings.set({
                        version: env.VERSION
                    }), init = function(appcuesId, userAttrs, settingsAttrs) {
                        var _Appcues;
                        if (_.isObject(appcuesId) && (settingsAttrs = userAttrs || {}, userAttrs = appcuesId, appcuesId = userAttrs.appcuesId, delete userAttrs.appcuesId), settings.set({
                                appcuesId: appcuesId
                            }), settings.set(settingsAttrs), settings.isValid()) return logger.log("Appcues API initialized.", userAttrs), _Appcues = new API, _.extend(Appcues, _Appcues), user.set(userAttrs), Appcues.initTracker(), integrations.fetch().then(function(data) {
                            return Appcues.integrations = data, _.each(data, function(integration) {
                                switch (integration.id) {
                                    case "mixpanel":
                                        return Appcues.initMixpanel();
                                    case "segment":
                                        return Appcues.initSegment();
                                    case "kissmetrics":
                                        return Appcues.initKM();
                                    case "ga":
                                        return Appcues.initGA();
                                    case "heap":
                                        return Appcues.initHeap()
                                }
                            })
                        }), _.defer(function() {
                            return Appcues.start(), user.on("change", function() {
                                return logger.log("User has changed. Calling Appcues.start() and resending user properties."), Appcues.start(), user.send()
                            }), user.send()
                        }), Appcues
                    }, options = getOptions(), settings.isValid(options) ? (init(options.appcuesId, options), Appcues.init = function() {
                        return logger.log("Appcues is already initialized.")
                    }) : (logger.warn("Missing Appcues ID in Appcues configuration. Call Appcues.init({appcuesId: <YOUR_APPCUES_ID>}) first."), Appcues.init = init), stylesheets = document.getElementsByTagName("link"), isStylesheetLoaded = Array.prototype.some.call(Array.prototype.slice.call(stylesheets), function(sheet) {
                        return /\/appcues(\.min|\.debug)?\.css$/.test(sheet.href)
                    }), isStylesheetLoaded ? logger.log("Using inline CSS stylesheet.") : (logger.log("No existing stylesheet found. Adding one."), style = document.createElement("link"), style.href = env.APPCUES_CSS, style.rel = "stylesheet", style.type = "text/css", style.id = "appcues-css", style.onload = function() {
                        return logger.log("Appcues CSS loaded.")
                    }, document.getElementsByTagName("head")[0].appendChild(style)), Appcues
                })
            }.call(this), require("main")
    })
}();
//# sourceMappingURL=appcues.min.js.map