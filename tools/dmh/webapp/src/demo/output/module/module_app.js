PLOVR_MODULE_INFO={"app":[],"community":["app"],"account":["app"]};
PLOVR_MODULE_URIS={"app":"module/module_app.js","community":"module/module_community.js","account":"module/module_account.js"};
PLOVR_MODULE_USE_DEBUG_MODE=false;
var JSCompiler_alias_NULL = null;
function JSCompiler_emptyFn() {
  return function() {
  }
}
var JSCompiler_prototypeAlias, goog$global = this;
function goog$typeOf(value) {
  var s = typeof value;
  if(s == "object") {
    if(value) {
      if(value instanceof Array) {
        return"array"
      }else {
        if(value instanceof Object) {
          return s
        }
      }
      var className = Object.prototype.toString.call(value);
      if(className == "[object Window]") {
        return"object"
      }
      if(className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(s == "function" && typeof value.call == "undefined") {
      return"object"
    }
  }
  return s
}
function goog$exportSymbol(publicPath, object) {
  var parts = publicPath.split("."), cur = goog$global;
  !(parts[0] in cur) && cur.execScript && cur.execScript("var " + parts[0]);
  for(var part;parts.length && (part = parts.shift());) {
    !parts.length && object !== void 0 ? cur[part] = object : cur = cur[part] ? cur[part] : cur[part] = {}
  }
}
var goog$asyncResource = [], goog$asyncResource = ["tpl.html"];
function er$base$getObjectByName(name) {
  for(var name = name.split("."), cur = window, part;part = name.shift();) {
    if(cur[part] != JSCompiler_alias_NULL) {
      cur = cur[part]
    }else {
      return JSCompiler_alias_NULL
    }
  }
  return cur
}
var er$base$ie = 0, er$base$firefox = 0, match$$inline_26 = JSCompiler_alias_NULL;
if(match$$inline_26 = /msie (\d+\.\d)/i.exec(navigator.userAgent)) {
  er$base$ie = parseFloat(match$$inline_26[1])
}else {
  if(match$$inline_26 = /firefox\/(\d+\.\d)/i.test(navigator.userAgent)) {
    er$base$firefox = parseFloat(match$$inline_26[1])
  }
}
;function er$Locator() {
  this.referer = this.currentQuery = this.currentPath = "";
  this._timer = 0
}
function JSCompiler_StaticMethods_redirect(JSCompiler_StaticMethods_redirect$self, loc, preventDefault) {
  /^~/.test(loc) && (loc = (JSCompiler_StaticMethods_redirect$self.currentPath || "/") + loc);
  document.location.hash = loc;
  var loc = document.location.hash.replace(/^#/, ""), pair = loc.match(/^([^~]+)(~(.*))?$/), re = {};
  pair ? (re.path = pair[1], re.query = pair.length === 4 ? pair[3] : "") : (re.path = "", re.query = "");
  pair = re.path;
  re = re.query;
  if(!(pair === JSCompiler_StaticMethods_redirect$self.currentPath && re === JSCompiler_StaticMethods_redirect$self.currentQuery)) {
    JSCompiler_StaticMethods_redirect$self.currentPath = pair;
    JSCompiler_StaticMethods_redirect$self.currentQuery = re;
    if(er$base$ie) {
      document.getElementById("ERHistroyRecorder").src = "/assets/history.html?" + loc
    }
    if(!preventDefault) {
      for(var preventDefault = {}, re = (JSCompiler_StaticMethods_redirect$self.currentQuery || "").split("&"), pair = re.length, item, key;pair--;) {
        item = re[pair].split("="), key = item[0], item = item[1], key && (er$base$firefox || (item = decodeURIComponent(item)), preventDefault[key] = item)
      }
      er$controller.forward(JSCompiler_StaticMethods_redirect$self.currentPath, preventDefault, JSCompiler_StaticMethods_redirect$self.referer)
    }
    JSCompiler_StaticMethods_redirect$self.referer = loc
  }
}
er$Locator.prototype.init = function() {
  if(!this._timer) {
    var me = this, prevLocation;
    if(er$base$ie) {
      var iframe = document.createElement("iframe"), style = iframe.style;
      iframe.id = "ERHistroyRecorder";
      iframe.width = 200;
      iframe.height = 200;
      style.position = "absolute";
      style.top = "-1000px";
      style.left = "-1000px";
      document.body.insertBefore(iframe, document.body.firstChild);
      iframe = JSCompiler_alias_NULL
    }
    this._timer = setInterval(function() {
      var loc;
      loc = (loc = document.location.hash) ? loc.substr(1) : "";
      prevLocation !== loc && (prevLocation = loc, JSCompiler_StaticMethods_redirect(me, loc))
    }, 100)
  }
};
var er$locator = new er$Locator;
function er$Controller() {
  this.container = {};
  this.actionConfigMap = {};
  this.modules = [];
  this.permit = this.currentAction = JSCompiler_alias_NULL
}
er$Controller.prototype.forward = function(path, paramMap, referer) {
  paramMap = {type:"main", referer:referer, paramMap:paramMap, path:path, domId:"Main"};
  this.reset();
  this.currentAction = this.enterAction(this.container[path], paramMap)
};
er$Controller.prototype.enterAction = function(actionConfig, argMap) {
  if(!actionConfig) {
    return JSCompiler_alias_NULL
  }
  var action = er$base$getObjectByName(actionConfig.action), newAction = JSCompiler_alias_NULL, newAction = actionConfig.authority;
  "function" == typeof action && (action = new action);
  if(this.permit && newAction && !this.permit(newAction)) {
    return JSCompiler_StaticMethods_redirect(er$locator, actionConfig.noAuthLocation || "/"), JSCompiler_alias_NULL
  }
  if(newAction = action.enter(argMap)) {
    return newAction
  }
  return action
};
er$Controller.prototype.reset = function() {
  this.currentAction && this.currentAction.leave();
  document.getElementById("Main").innerHTML = ""
};
er$Controller.prototype.init = function() {
  for(var i = 0, len = this.modules.length, j, len2, loc, actions, actionConfig, actionName;i < len;i++) {
    if(j = this.modules[i], j.init && j.init(), actions = j.config.action) {
      j = 0;
      for(len2 = actions.length;j < len2;j++) {
        actionConfig = actions[j], loc = actionConfig.location, actionName = actionConfig.action, this.container[loc] = actionConfig, this.actionConfigMap[actionName] = actionConfig
      }
    }
  }
  er$locator.init()
};
var er$controller = new er$Controller;
var baidu$ie;
function baidu.fn.blank() {
}
function baidu$getObjectByName(name, opt_obj) {
  for(var parts = name.split("."), cur = opt_obj || window, part;part = parts.shift();) {
    if(cur[part] != JSCompiler_alias_NULL) {
      cur = cur[part]
    }else {
      return JSCompiler_alias_NULL
    }
  }
  return cur
}
function baidu$addSingletonGetter(ctor) {
  ctor.getInstance = function() {
    return ctor.instance_ || (ctor.instance_ = new ctor)
  }
}
var baidu$ajax = baidu$ajax || {};
baidu$ajax.get = function(url, onsuccess) {
  return baidu$ajax.request(url, {onsuccess:onsuccess})
};
baidu$ajax.post = function(url, data, onsuccess) {
  return baidu$ajax.request(url, {onsuccess:onsuccess, method:"POST", data:data})
};
baidu$ajax.request = function(url, options) {
  function stateChangeHandler() {
    if(xhr.readyState == 4) {
      try {
        var stat = xhr.status
      }catch(ex) {
        fire("failure");
        return
      }
      fire(stat);
      stat >= 200 && stat < 300 || stat == 304 || stat == 1223 ? fire("success") : fire("failure");
      window.setTimeout(function() {
        xhr.onreadystatechange = new Function;
        async && (xhr = JSCompiler_alias_NULL)
      }, 0)
    }
  }
  function getXHR() {
    if(window.ActiveXObject) {
      try {
        return new ActiveXObject("Msxml2.XMLHTTP")
      }catch(e) {
        try {
          return new ActiveXObject("Microsoft.XMLHTTP")
        }catch(e2) {
        }
      }
    }
    if(window.XMLHttpRequest) {
      return new XMLHttpRequest
    }
    return JSCompiler_alias_NULL
  }
  function fire(type) {
    var type = "on" + type, handler = eventHandlers[type], globelHandler = baidu$ajax[type];
    handler ? type != "onsuccess" ? handler(xhr) : handler(xhr, xhr.responseText) : globelHandler && type != "onsuccess" && globelHandler(xhr)
  }
  var options = options || {}, data = options.data || "", async = options.async !== !1, username = options.username || "", password = options.password || "", method = (options.method || "GET").toUpperCase(), headers = options.headers || {}, cacheable = options.cacheable || !1, eventHandlers = {}, key, xhr;
  for(key in options) {
    eventHandlers[key] = options[key]
  }
  headers["X-Request-By"] = "baidu.ajax";
  try {
    xhr = getXHR();
    method == "GET" && (data && (url += (url.indexOf("?") >= 0 ? "&" : "?") + data, data = JSCompiler_alias_NULL), cacheable || (url += (url.indexOf("?") >= 0 ? "&" : "?") + "b" + (new Date).getTime() + "=1"));
    username ? xhr.open(method, url, async, username, password) : xhr.open(method, url, async);
    if(async) {
      xhr.onreadystatechange = stateChangeHandler
    }
    method == "POST" && xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    for(key in headers) {
      headers.hasOwnProperty(key) && xhr.setRequestHeader(key, headers[key])
    }
    fire("beforerequest");
    xhr.send(data);
    async || stateChangeHandler()
  }catch(ex$$0) {
    fire("failure")
  }
  return xhr
};
var baidu$browser$ie, baidu$browser$isGecko, baidu$browser$isStrict, baidu$browser$isWebkit, baidu$browser$opera, match$$inline_55 = JSCompiler_alias_NULL;
if(match$$inline_55 = /msie (\d+\.\d)/i.exec(navigator.userAgent)) {
  baidu$ie = baidu$browser$ie = parseFloat(match$$inline_55[1])
}
baidu$browser$isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);
baidu$browser$isStrict = document.compatMode == "CSS1Compat";
baidu$browser$isWebkit = /webkit/i.test(navigator.userAgent);
if(match$$inline_55 = /opera\/(\d+\.\d)/i.exec(navigator.userAgent)) {
  baidu$browser$opera = parseFloat(match$$inline_55[1])
}
function baidu$date$format(source) {
  var pattern = "yyyy-M-d";
  function replacer(patternPart, result) {
    pattern = pattern.replace(patternPart, result)
  }
  if("string" != typeof pattern) {
    return source.toString()
  }
  var year = source.getFullYear(), month = source.getMonth() + 1, date2 = source.getDate(), hours = source.getHours(), minutes = source.getMinutes(), source = source.getSeconds();
  replacer(/yyyy/g, baidu$number$pad(year, 4));
  replacer(/yy/g, baidu$number$pad(parseInt(year.toString().slice(2), 10), 2));
  replacer(/MM/g, baidu$number$pad(month, 2));
  replacer(/M/g, month);
  replacer(/dd/g, baidu$number$pad(date2, 2));
  replacer(/d/g, date2);
  replacer(/HH/g, baidu$number$pad(hours, 2));
  replacer(/H/g, hours);
  replacer(/hh/g, baidu$number$pad(hours % 12, 2));
  replacer(/h/g, hours % 12);
  replacer(/mm/g, baidu$number$pad(minutes, 2));
  replacer(/m/g, minutes);
  replacer(/ss/g, baidu$number$pad(source, 2));
  replacer(/s/g, source);
  return pattern
}
function baidu$date$parse(source) {
  var match = JSCompiler_alias_NULL;
  if(match = /^(2\d{3})[-\/]?([01]\d)[-\/]?([0-3]\d)$/.exec(source)) {
    return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10))
  }
  return JSCompiler_alias_NULL
}
var baidu$dom = baidu$dom || {}, baidu$dom$_NAME_ATTRS = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", usemap:"useMap", frameborder:"frameBorder"};
baidu$browser$ie < 8 ? (baidu$dom$_NAME_ATTRS["for"] = "htmlFor", baidu$dom$_NAME_ATTRS["class"] = "className") : (baidu$dom$_NAME_ATTRS.htmlFor = "for", baidu$dom$_NAME_ATTRS.className = "class");
function baidu$setAttr(element, key, value) {
  element = baidu$dom$g(element);
  "style" == key ? element.style.cssText = value : (key = baidu$dom$_NAME_ATTRS[key] || key, element.setAttribute(key, value))
}
var baidu$dom$_styleFixer = baidu$dom$_styleFixer || {};
baidu$dom$_styleFixer.opacity = baidu$browser$ie ? {get:function(element) {
  (element = element.style.filter) && element.indexOf("opacity=") >= 0 && element.match(/opacity=([^)]*)/)
}, set:function(element, value) {
  var style = element.style;
  style.filter = (style.filter || "").replace(/alpha\([^\)]*\)/gi, "") + (value == 1 ? "" : "alpha(opacity=" + value * 100 + ")");
  style.zoom = 1
}} : JSCompiler_alias_NULL;
function baidu$addClass(element, className) {
  for(var element = baidu$dom$g(element), classes = baidu$string$trim(className).split(/\s+/), len = classes.length, className = element.className.split(/\s+/).join(" ");len--;) {
    RegExp("(^| )" + classes[len] + "( |$)").test(className) && classes.splice(len, 1)
  }
  element.className = baidu$string$trim(className + " " + classes.join(" "))
}
function baidu$dom$g(id) {
  if("string" == typeof id || id instanceof String) {
    return document.getElementById(id)
  }else {
    if(id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9 || id.nodeType == 11)) {
      return id
    }
  }
  return JSCompiler_alias_NULL
}
var baidu$G, baidu$g = baidu$G = baidu$dom$g;
function baidu$dom$getPosition(element) {
  var doc, element$$0;
  element$$0 = baidu$dom$g(element);
  doc = element$$0.nodeType == 9 ? element$$0 : element$$0.ownerDocument || element$$0.document;
  var element = baidu$dom$g(element), BUGGY_GECKO_BOX_OBJECT = baidu$browser$isGecko > 0 && doc.getBoxObjectFor && baidu$dom$getStyle(element) == "absolute" && (element.style.top === "" || element.style.left === "");
  element$$0 = {left:0, top:0};
  var viewportElement = baidu$browser$ie && !baidu$browser$isStrict ? doc.body : doc.documentElement;
  if(element == viewportElement) {
    return element$$0
  }
  var parent = JSCompiler_alias_NULL;
  if(element.getBoundingClientRect) {
    element = element.getBoundingClientRect(), element$$0.left = Math.floor(element.left) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft), element$$0.top = Math.floor(element.top) + Math.max(doc.documentElement.scrollTop, doc.body.scrollTop), element$$0.left -= doc.documentElement.clientLeft, element$$0.top -= doc.documentElement.clientTop, baidu$browser$ie && !baidu$browser$isStrict && (element$$0.left -= 2, element$$0.top -= 2)
  }else {
    if(doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT) {
      element = doc.getBoxObjectFor(element), doc = doc.getBoxObjectFor(viewportElement), element$$0.left = element.screenX - doc.screenX, element$$0.top = element.screenY - doc.screenY
    }else {
      parent = element;
      do {
        element$$0.left += parent.offsetLeft;
        element$$0.top += parent.offsetTop;
        if(baidu$browser$isWebkit > 0 && baidu$dom$getStyle(parent) == "fixed") {
          element$$0.left += doc.body.scrollLeft;
          element$$0.top += doc.body.scrollTop;
          break
        }
        parent = parent.offsetParent
      }while(parent && parent != element);
      if(baidu$browser$opera > 0 || baidu$browser$isWebkit > 0 && baidu$dom$getStyle(element) == "absolute") {
        element$$0.top -= doc.body.offsetTop
      }
      for(parent = element.offsetParent;parent && parent != doc.body;) {
        element$$0.left -= parent.scrollLeft;
        if(!baidu$browser$opera || parent.tagName != "TR") {
          element$$0.top -= parent.scrollTop
        }
        parent = parent.offsetParent
      }
    }
  }
  return element$$0
}
function baidu$dom$getStyle(element) {
  var key, element = baidu$dom$g(element);
  key = baidu$string$toCamelCase("position");
  var value = element.style[key];
  if(!value) {
    var fixer = baidu$dom$_styleFixer[key], value = element.currentStyle || (baidu$browser$ie ? element.style : window.getComputedStyle(element, JSCompiler_alias_NULL)), value = "string" == typeof fixer ? value[fixer] : fixer && fixer.get ? fixer.get(element, value) : value[key]
  }
  if(fixer = baidu$dom._styleFilter) {
    value = fixer.filter(key, value, "get")
  }
  return value
}
function baidu$hide(element) {
  if(element) {
    element = baidu$dom$g(element), element.style.display = "none"
  }
}
function baidu$removeClass(element, className) {
  element = baidu$dom$g(element);
  element.className = baidu$string$trim(element.className.split(/\s+/).join("  ").replace(RegExp("(^| )(" + baidu$string$trim(className).split(/\s+/).join("|") + ")( |$)", "g"), " ").replace(/\s+/g, " "))
}
function baidu$show(element) {
  if(element) {
    element = baidu$dom$g(element), element.style.display = ""
  }
}
var baidu$event$_listeners = baidu$event$_listeners || [];
function baidu$event$_unload() {
  for(var len = baidu$event$_listeners.length, standard = !!window.removeEventListener, item, el;len--;) {
    item = baidu$event$_listeners[len], el = item[0], el.removeEventListener ? el.removeEventListener(item[1], item[3], !1) : el.detachEvent && el.detachEvent("on" + item[1], item[3])
  }
  standard ? window.removeEventListener("unload", baidu$event$_unload, !1) : window.detachEvent("onunload", baidu$event$_unload)
}
window.attachEvent ? window.attachEvent("onunload", baidu$event$_unload) : window.addEventListener("unload", baidu$event$_unload, !1);
function baidu$on(element, type, listener) {
  type = type.replace(/^on/i, "");
  "string" == typeof element && (element = baidu$dom$g(element));
  element.addEventListener ? element.addEventListener(type, listener, !1) : element.attachEvent && element.attachEvent("on" + type, listener)
}
function baidu$event$preventDefault(event) {
  event.preventDefault ? event.preventDefault() : event.returnValue = !1
}
function baidu$un(element, type, listener) {
  "string" == typeof element && (element = baidu$dom$g(element));
  type = type.replace(/^on/i, "");
  element.removeEventListener ? element.removeEventListener(type, listener, !1) : element.detachEvent && element.detachEvent("on" + type, listener)
}
function baidu$lang$isArray(source) {
  return"[object Array]" == Object.prototype.toString.call(source)
}
function baidu$lang$hasValue(source) {
  return!(source === JSCompiler_alias_NULL || typeof source == "undefined")
}
function baidu$inherits(subClass, superClass) {
  var key, proto, selfProps = subClass.prototype;
  proto = new Function;
  proto.prototype = superClass.prototype;
  proto = subClass.prototype = new proto;
  for(key in selfProps) {
    proto[key] = selfProps[key]
  }
  subClass.superClass = superClass.prototype
}
function baidu$object$extend(target, source) {
  for(var p in source) {
    source.hasOwnProperty(p) && (target[p] = source[p])
  }
}
function baidu$object$each(source, iterator) {
  var returnValue, key;
  if("function" == typeof iterator) {
    for(key in source) {
      if(source.hasOwnProperty(key) && (returnValue = source[key], returnValue = iterator.call(source, returnValue, key), returnValue === !1)) {
        break
      }
    }
  }
}
function baidu$page$getScrollLeft() {
  var d = document;
  return d.documentElement.scrollLeft || d.body.scrollLeft
}
function baidu$page$getScrollTop() {
  var d = document;
  return d.documentElement.scrollTop || d.body.scrollTop
}
function baidu$page$getViewHeight() {
  var doc = document;
  return(doc.compatMode == "BackCompat" ? doc.body : doc.documentElement).clientHeight
}
function baidu$page$getViewWidth() {
  var doc = document;
  return(doc.compatMode == "BackCompat" ? doc.body : doc.documentElement).clientWidth
}
function baidu$decodeHTML(source) {
  source = String(source).replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  return source = source.replace(/&#([\d]+);/g, function($0, $1) {
    return String.fromCharCode(parseInt($1, 10))
  })
}
function baidu$format(source, opts) {
  source = String(source);
  if("undefined" != typeof opts) {
    if("[object Object]" == Object.prototype.toString.call(opts)) {
      return source.replace(/\$\{(.+?)\}/g, function(match, key) {
        var replacer = opts[key];
        "function" == typeof replacer && (replacer = replacer(key));
        return"undefined" == typeof replacer ? "" : replacer
      })
    }else {
      var data = Array.prototype.slice.call(arguments, 1), len = data.length;
      return source.replace(/\{(\d+)\}/g, function(match, index) {
        index = parseInt(index, 10);
        return index >= len ? match : data[index]
      })
    }
  }
  return source
}
function baidu$string$toCamelCase(source) {
  return String(source).replace(/[-_]\D/g, function(match) {
    return match.charAt(1).toUpperCase()
  })
}
function baidu$string$trim(source) {
  return source.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, "")
}
var baidu$trim = baidu$string$trim;
a: {
  var n$$inline_65 = navigator;
  if(n$$inline_65.plugins && n$$inline_65.mimeTypes.length) {
    var plugin$$inline_66 = n$$inline_65.plugins["Shockwave Flash"];
    plugin$$inline_66 && plugin$$inline_66.description && plugin$$inline_66.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".")
  }else {
    if(window.ActiveXObject && !window.opera) {
      for(var i$$inline_67 = 10;i$$inline_67 >= 2;i$$inline_67--) {
        try {
          var c$$inline_68 = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i$$inline_67);
          if(c$$inline_68) {
            c$$inline_68.GetVariable("$version").replace(/WIN/g, "").replace(/,/g, ".");
            break a
          }
        }catch(e$$inline_69) {
        }
      }
    }
  }
}
function baidu$number$pad(source, length) {
  var pre = "", string = String(Math.abs(source));
  string.length < length && (pre = Array(length - string.length + 1).join("0"));
  return(source < 0 ? "-" : "") + pre + string
}
function baidu$array$each(source, iterator) {
  var returnValue, i, len = source.length;
  if("function" == typeof iterator) {
    for(i = 0;i < len;i++) {
      if(returnValue = source[i], returnValue = iterator.call(source, returnValue, i), returnValue === !1) {
        break
      }
    }
  }
}
function baidu$array$indexOf(source, condition) {
  var position, len = source.length, iterator = condition;
  position = Number(position) || 0;
  position = position < 0 ? Math.ceil(position) : Math.floor(position);
  position = Math.min(Math.max(position, 0), len);
  for("function" != typeof condition && (iterator = function(item) {
    return condition === item
  });position < len;position++) {
    if(!0 === iterator.call(source, source[position], position)) {
      return position
    }
  }
  return-1
}
function baidu$fn$bind(func, scope) {
  var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : JSCompiler_alias_NULL;
  return function() {
    var fn = "[object String]" == Object.prototype.toString.call(func) ? scope[func] : func, args = xargs ? xargs.concat([].slice.call(arguments, 0)) : arguments;
    return fn.apply(scope || fn, args)
  }
}
function baidu$json$parse(source) {
  return eval("(" + source + ")")
}
if(baidu$ie && baidu$ie < 7) {
  try {
    document.execCommand("BackgroundImageCache", !1, !0)
  }catch(e$$8) {
  }
}
;function base$Object() {
}
;function base$EventDispatcher() {
  this._listeners = []
}
baidu$inherits(base$EventDispatcher, base$Object);
base$EventDispatcher.prototype.trigger = function(eventType) {
  if(this._listeners[eventType]) {
    var i, args = Array.prototype.slice.call(arguments, 1);
    for(i = 0;i < this._listeners[eventType].length;i++) {
      this._listeners[eventType][i].apply(this, args)
    }
  }
};
function base$AbstractWorker() {
  this._listeners = [];
  this.isDone = !1
}
baidu$inherits(base$AbstractWorker, base$EventDispatcher);
base$AbstractWorker.prototype.start = function() {
  throw"Not implemented";
};
base$AbstractWorker.prototype.done = function() {
  this.isDone = !0;
  this.trigger("DONE", this)
};
function JSCompiler_StaticMethods_addDoneListener(JSCompiler_StaticMethods_addDoneListener$self, listener) {
  JSCompiler_StaticMethods_addDoneListener$self._listeners.DONE || (JSCompiler_StaticMethods_addDoneListener$self._listeners.DONE = []);
  JSCompiler_StaticMethods_addDoneListener$self._listeners.DONE.push(listener)
}
function base$AbstractWorkerManager() {
  base$AbstractWorker.call(this);
  this.workers = []
}
baidu$inherits(base$AbstractWorkerManager, base$AbstractWorker);
function JSCompiler_StaticMethods_addWorker(JSCompiler_StaticMethods_addWorker$self, worker) {
  JSCompiler_StaticMethods_addWorker$self.workers.push(worker);
  JSCompiler_StaticMethods_addDoneListener(worker, baidu$fn$bind(JSCompiler_StaticMethods_addWorker$self._workerDone, JSCompiler_StaticMethods_addWorker$self))
}
base$AbstractWorkerManager.prototype._workerDone = function() {
  throw"Not implemented";
};
function base$ParallelWorkerManager() {
  base$AbstractWorkerManager.call(this)
}
base$ParallelWorkerManager.prototype = {start:function() {
  this.counter = this.workers.length;
  if(this.counter === 0) {
    this.done()
  }else {
    for(var i = 0;i < this.workers.length;i++) {
      this.workers[i].isDone ? this._workerDone(this.workers[i]) : this.workers[i].start()
    }
  }
}, _workerDone:function() {
  this.counter--;
  this.counter === 0 && this.done()
}};
baidu$inherits(base$ParallelWorkerManager, base$AbstractWorkerManager);
function er$Template() {
  this.container = {}
}
er$Template.prototype.get = function(target) {
  return this.container[target] || ""
};
function JSCompiler_StaticMethods_getMerged(view) {
  return er$template.get(view).replace(/\$\{([.:a-z0-9_]+)\}/ig, function($0, $1) {
    var match = $1.match(/:([a-z]+)$/), JSCompiler_temp;
    if(match && match.length > 1) {
      JSCompiler_temp = $1.replace(/:[a-z]+$/i, "");
      match = match[1];
      match = match.toLowerCase();
      if(match === "lang" || match === "config") {
        JSCompiler_temp = er$base$getObjectByName("dn." + match + "." + JSCompiler_temp)
      }else {
        throw"Not handled";
      }
      JSCompiler_temp = JSCompiler_temp === JSCompiler_alias_NULL || typeof JSCompiler_temp == "undefined" ? "" : JSCompiler_temp
    }else {
      JSCompiler_temp = ""
    }
    return JSCompiler_temp
  })
}
er$Template.prototype.parse = function(source$$0) {
  function parseImport(source) {
    if(importRule.test(source)) {
      return parseImport(source.replace(importRule, function($0, $1) {
        return currentContainer[$1] || container[$1] || ""
      }))
    }
    return source
  }
  function addLine(str) {
    str && currentName && current.push(str)
  }
  function addTpl() {
    currentName && (currentName in currentContainer ? alert("Template: " + currentName + " is exist") : currentContainer[currentName] = current.join("\n"));
    currentName = JSCompiler_alias_NULL
  }
  for(var source$$0 = source$$0.split(/\r?\n/), linesLen = source$$0.length, linesIndex = 0, targetStartRule = /<\!--\s*target:\s*([a-zA-Z0-9_]+)\s*--\>/, targetEndRule = /<\!--\s*\/target\s*--\>/, importRule = /<\!--\s*import:\s*([a-zA-Z0-9_]+)\s*--\>/, key, line, match, container = this.container, current = [], currentName, currentContainer = {};linesIndex < linesLen;linesIndex++) {
    if(line = source$$0[linesIndex], !(line.length <= 0)) {
      targetStartRule.lastIndex = -1, (match = targetStartRule.exec(line)) ? (match = match[1], line = line.split(targetStartRule), addLine(line[0]), addTpl(), current = [], currentName = match, addLine(line[2])) : targetEndRule.test(line) ? (line = line.split(targetEndRule), addLine(line[0]), addTpl()) : addLine(line)
    }
  }
  addTpl();
  for(key in currentContainer) {
    container[key] && alert("Template: " + key + " already exists!"), container[key] = parseImport(currentContainer[key])
  }
};
var er$template = new er$Template;
function app$Worker(template) {
  base$AbstractWorker.call(this);
  this._template = template;
  this._index = 0
}
baidu$inherits(app$Worker, base$AbstractWorker);
app$Worker.prototype.start = function() {
  JSCompiler_StaticMethods__loadTemplate(this)
};
function JSCompiler_StaticMethods__loadTemplate(JSCompiler_StaticMethods__loadTemplate$self) {
  JSCompiler_StaticMethods__loadTemplate$self._template.length <= 0 ? JSCompiler_StaticMethods__loadTemplate$self._templateLoaded() : baidu$ajax.request(JSCompiler_StaticMethods__loadTemplate$self._template[JSCompiler_StaticMethods__loadTemplate$self._index], {method:"get", cacheable:!0, onsuccess:baidu$fn$bind(JSCompiler_StaticMethods__loadTemplate$self._loadTemplateSuccess, JSCompiler_StaticMethods__loadTemplate$self), onfailure:baidu$fn$bind(JSCompiler_StaticMethods__loadTemplate$self._templateLoaded, 
  JSCompiler_StaticMethods__loadTemplate$self)})
}
app$Worker.prototype._loadTemplateSuccess = function(xhr) {
  er$template.parse(xhr.responseText);
  this._templateLoaded()
};
app$Worker.prototype._templateLoaded = function() {
  this._index++;
  this._index >= this._template.length ? this.done() : JSCompiler_StaticMethods__loadTemplate(this)
};
function base$PropertyChangeNotifier() {
  this._listeners = [];
  this._settersInitialized = !1
}
base$PropertyChangeNotifier.prototype = function() {
  function baseSet(value, propertyName) {
    var oldValue = this[propertyName];
    oldValue !== value && (this[propertyName] = value, this.trigger(base$PropertyChangeNotifier$PropertyChangedEvent, propertyName, value, oldValue))
  }
  function baseGet(propertyName) {
    return this[propertyName]
  }
  function initSetters() {
    var me = this, propertyName, upperCase;
    for(propertyName in this) {
      typeof this[propertyName] !== "function" && propertyName.charAt(0) !== "_" && (upperCase = propertyName.charAt(0).toUpperCase() + propertyName.substring(1), this["set" + upperCase] = function(p) {
        return function(value) {
          baseSet.call(me, value, p)
        }
      }(propertyName), this["get" + upperCase] = function(p) {
        return function() {
          return baseGet.call(me, p)
        }
      }(propertyName))
    }
  }
  return{set:function(propertyName, value) {
    baseSet.call(this, value, propertyName)
  }, get:function(propertyName) {
    return this[propertyName]
  }, addPropertyChangedListener:function(listener) {
    if(!this._settersInitialized) {
      initSetters.call(this), this._settersInitialized = !0
    }
    var eventType = base$PropertyChangeNotifier$PropertyChangedEvent;
    this._listeners[eventType] || (this._listeners[eventType] = []);
    this._listeners[eventType].push(listener)
  }, removePropertyChangedListener:function(listener) {
    var eventType = base$PropertyChangeNotifier$PropertyChangedEvent;
    if(this._listeners[eventType]) {
      for(var i = this._listeners[eventType].length - 1;i >= 0;i--) {
        if(this._listeners[eventType][i] === listener) {
          this._listeners[eventType].splice(i, 1);
          break
        }
      }
    }
  }, triggerPropertyChanged:function(propertyName) {
    this.trigger(base$PropertyChangeNotifier$PropertyChangedEvent, propertyName, this[propertyName], this[propertyName])
  }}
}();
var base$PropertyChangeNotifier$PropertyChangedEvent = "PROPERTY_CHANGED";
baidu$inherits(base$PropertyChangeNotifier, base$EventDispatcher);
function base$BaseModel(opt_data) {
  base$PropertyChangeNotifier.call(this);
  baidu$object$extend(this, opt_data || {})
}
baidu$inherits(base$BaseModel, base$PropertyChangeNotifier);
var ui = {};
function ui$Control(options) {
  this._listeners = [];
  this.children = this.model = this.main = JSCompiler_alias_NULL;
  this.autoState = !0;
  baidu$object$extend(this, options);
  this.lifePhase = 0
}
baidu$inherits(ui$Control, base$EventDispatcher);
goog$exportSymbol("ui.Control", ui$Control);
JSCompiler_prototypeAlias = ui$Control.prototype;
JSCompiler_prototypeAlias.type = "";
JSCompiler_prototypeAlias.skin = "";
JSCompiler_prototypeAlias.id = "";
JSCompiler_prototypeAlias.domId = "";
JSCompiler_prototypeAlias._callChildren = function(method) {
  if(this.children) {
    var args = [], i, child;
    if(arguments.length > 1) {
      for(i = 1;i < arguments.length;i++) {
        args.push(arguments[i])
      }
    }
    for(i = 0;i < this.children.length;i++) {
      child = this.children[i], child[method] && child[method].apply(child, args)
    }
  }
};
JSCompiler_prototypeAlias.init = function() {
  if(this.view && this.main && this.view) {
    this.main.innerHTML = JSCompiler_StaticMethods_getMerged(this.view), JSCompiler_StaticMethods_buildControlTree(ui.util, this.main, this)
  }
  this._callChildren("init");
  this.lifePhase = 1
};
JSCompiler_prototypeAlias.bindModel = function(opt_model) {
  if(opt_model) {
    this.model = opt_model
  }
  if(this.model) {
    var me = this, value;
    this.refer && baidu$object$each(this.refer, function(modelKey, key) {
      value = me.model[modelKey];
      typeof value !== "undefined" && (me[key] = value)
    });
    this._callChildren("bindModel", this.model);
    this.lifePhase = 2
  }
};
JSCompiler_prototypeAlias.render = function(opt_main) {
  if(opt_main) {
    this.main = opt_main
  }
  if(this.main) {
    if(this.domId) {
      this.main.id = this.domId, this.main.removeAttribute("ui"), this.main.setAttribute("control", this.id), baidu$addClass(this.main, JSCompiler_StaticMethods_getClass(this))
    }
    if(this.autoState && (opt_main = this.main, this.state = {}, opt_main)) {
      opt_main.onmouseover = baidu$fn$bind(this.mainOverHandler, this), opt_main.onmouseout = baidu$fn$bind(this.mainOutHandler, this), opt_main.onmousedown = baidu$fn$bind(this.mainDownHandler, this), opt_main.onmouseup = baidu$fn$bind(this.mainUpHandler, this)
    }
    this._callChildren("render");
    this.lifePhase = 3
  }
};
JSCompiler_prototypeAlias.bindEvent = function() {
  this._callChildren("bindEvent");
  this.lifePhase = 4
};
JSCompiler_prototypeAlias.dispose = function() {
  this._callChildren("dispose");
  if(this.parent) {
    this.parent = JSCompiler_alias_NULL
  }
  if(this.children) {
    for(var i = this.children.length - 1;i >= 0;i--) {
      this.children.splice(i, 1)
    }
    this.children = JSCompiler_alias_NULL
  }
  if(this.main) {
    if(this.main.childNodes.length) {
      this.main.innerHTML = ""
    }
    this.main.onmouseover = JSCompiler_alias_NULL;
    this.main.onmouseout = JSCompiler_alias_NULL;
    this.main.onmousedown = JSCompiler_alias_NULL;
    this.main.onmouseup = JSCompiler_alias_NULL
  }
  this.lifePhase = 5
};
function JSCompiler_StaticMethods_rebindModel(JSCompiler_StaticMethods_rebindModel$self, model) {
  if(!(JSCompiler_StaticMethods_rebindModel$self.lifePhase >= 5)) {
    var orgLifePhase = JSCompiler_StaticMethods_rebindModel$self.lifePhase;
    JSCompiler_StaticMethods_rebindModel$self.bindModel(model);
    orgLifePhase >= 3 && JSCompiler_StaticMethods_rebindModel$self.render()
  }
}
JSCompiler_prototypeAlias.addChild = function(control) {
  if(this.lifePhase >= 5) {
    control.dispose()
  }else {
    if(!this.children) {
      this.children = []
    }
    for(var i = 0;i < this.children.length;i++) {
      if(this.children[i].id === control.id) {
        throw"A control with the same id already exists";
      }
    }
    i = this.domId || this.id;
    control.domId = i ? i + "_" + control.id : control.id;
    this.children.push(control);
    control.parent = this;
    this.lifePhase >= 1 && (control.init(), this.lifePhase >= 2 && (control.bindModel(), this.lifePhase >= 3 && (control.render(), this.lifePhase >= 4 && control.bindEvent())))
  }
};
JSCompiler_prototypeAlias.removeChild = function(control, opt_keepLiving) {
  if(this.children) {
    for(var keepLiving = opt_keepLiving || !1, i = this.children.length - 1;i >= 0;i--) {
      if(this.children[i] === control) {
        if(keepLiving) {
          if(control.parent = JSCompiler_alias_NULL, control.main.childNodes.length) {
            control.main.innerHTML = ""
          }
        }else {
          control.dispose()
        }
        this.children.splice(i, 1);
        break
      }
    }
  }
};
function JSCompiler_StaticMethods_getChild(JSCompiler_StaticMethods_getChild$self, id) {
  if(!JSCompiler_StaticMethods_getChild$self.children) {
    return JSCompiler_alias_NULL
  }
  for(var i = 0;i < JSCompiler_StaticMethods_getChild$self.children.length;i++) {
    if(JSCompiler_StaticMethods_getChild$self.children[i].id === id) {
      return JSCompiler_StaticMethods_getChild$self.children[i]
    }
  }
  return JSCompiler_alias_NULL
}
function JSCompiler_StaticMethods_clearChildren(JSCompiler_StaticMethods_clearChildren$self) {
  if(JSCompiler_StaticMethods_clearChildren$self.children) {
    for(var i = JSCompiler_StaticMethods_clearChildren$self.children.length - 1;i >= 0;i--) {
      JSCompiler_StaticMethods_clearChildren$self.children[i].dispose(), JSCompiler_StaticMethods_clearChildren$self.children.splice(i, 1)
    }
  }
}
JSCompiler_prototypeAlias.appendTo = function(wrap) {
  var main = document.createElement("div");
  wrap.appendChild(main);
  this.main = main
};
JSCompiler_prototypeAlias.show = function() {
  this.main && baidu$show(this.main)
};
JSCompiler_prototypeAlias.hide = function() {
  this.main && baidu$hide(this.main)
};
JSCompiler_prototypeAlias.enable = function() {
  JSCompiler_StaticMethods_removeState(this, "disabled")
};
JSCompiler_prototypeAlias.disable = function() {
  JSCompiler_StaticMethods_setState(this, "disabled")
};
function JSCompiler_StaticMethods_isDisabled(JSCompiler_StaticMethods_isDisabled$self) {
  return JSCompiler_StaticMethods_getState(JSCompiler_StaticMethods_isDisabled$self, "disabled")
}
function JSCompiler_StaticMethods_getClass(JSCompiler_StaticMethods_getClass$self, opt_key) {
  if(!JSCompiler_StaticMethods_getClass$self.type) {
    return""
  }
  var className = "ui-" + JSCompiler_StaticMethods_getClass$self.type.toLowerCase().replace(".", "-"), skinName = "skin-" + JSCompiler_StaticMethods_getClass$self.skin;
  opt_key && (className += "-" + opt_key, skinName += "-" + opt_key);
  JSCompiler_StaticMethods_getClass$self.skin && (className += " " + skinName);
  return className
}
function JSCompiler_StaticMethods_getId(JSCompiler_StaticMethods_getId$self, opt_key) {
  var idPrefix = JSCompiler_StaticMethods_getId$self.domId || "";
  if(opt_key) {
    return idPrefix + opt_key
  }
  return idPrefix
}
function JSCompiler_StaticMethods_getStrRef(JSCompiler_StaticMethods_getStrRef$self) {
  return"ui.util.get('" + JSCompiler_StaticMethods_getStrRef$self.domId + "')"
}
JSCompiler_prototypeAlias.getStrCall = function(fn) {
  var argLen = arguments.length, params = [], i, arg;
  if(argLen > 1) {
    for(i = 1;i < argLen;i++) {
      arg = arguments[i], typeof arg === "string" && (arg = "'" + arg + "'"), params.push(arg)
    }
  }
  return JSCompiler_StaticMethods_getStrRef(this) + "." + fn + "(" + params.join(",") + ");"
};
JSCompiler_prototypeAlias.mainOverHandler = function() {
  !this.state.disabled && !this.state.readonly && JSCompiler_StaticMethods_setState(this, "hover")
};
JSCompiler_prototypeAlias.mainOutHandler = function() {
  !this.state.disabled && !this.state.readonly && (JSCompiler_StaticMethods_removeState(this, "hover"), JSCompiler_StaticMethods_removeState(this, "press"))
};
JSCompiler_prototypeAlias.mainDownHandler = function() {
  this.state.disabled || JSCompiler_StaticMethods_setState(this, "press")
};
JSCompiler_prototypeAlias.mainUpHandler = function() {
  this.state.disabled || JSCompiler_StaticMethods_removeState(this, "press")
};
function JSCompiler_StaticMethods_setState(JSCompiler_StaticMethods_setState$self, state) {
  if(!JSCompiler_StaticMethods_setState$self.state) {
    JSCompiler_StaticMethods_setState$self.state = {}
  }
  JSCompiler_StaticMethods_setState$self.state[state] = 1;
  baidu$addClass(JSCompiler_StaticMethods_setState$self.main, JSCompiler_StaticMethods_getClass(JSCompiler_StaticMethods_setState$self, state))
}
function JSCompiler_StaticMethods_removeState(JSCompiler_StaticMethods_removeState$self, state) {
  if(!JSCompiler_StaticMethods_removeState$self.state) {
    JSCompiler_StaticMethods_removeState$self.state = {}
  }
  JSCompiler_StaticMethods_removeState$self.state[state] = JSCompiler_alias_NULL;
  baidu$removeClass(JSCompiler_StaticMethods_removeState$self.main, JSCompiler_StaticMethods_getClass(JSCompiler_StaticMethods_removeState$self, state))
}
function JSCompiler_StaticMethods_getState(JSCompiler_StaticMethods_getState$self, state) {
  if(!JSCompiler_StaticMethods_getState$self.state) {
    JSCompiler_StaticMethods_getState$self.state = {}
  }
  return!!JSCompiler_StaticMethods_getState$self.state[state]
}
JSCompiler_prototypeAlias.getPage = function() {
  for(var ctrl = this;!(ctrl instanceof ui$Page);) {
    ctrl = ctrl.parent
  }
  return ctrl
};
function ui$Page(options) {
  ui$Control.call(this, options)
}
baidu$inherits(ui$Page, ui$Control);
var Validator = function() {
  function parse(text, type) {
    return type === "int" ? parseInt(text, 10) : type === "float" ? parseFloat(text) : type === "date" ? baidu$date$parse(text) : text
  }
  function noticeInTail(noticeText, input) {
    showNoticeDom(input);
    var title = input.getAttribute("title") || "";
    baidu$g(input.id + textSuffix).innerHTML = title + noticeText
  }
  function noticeInTailNoTitle(noticeText, input) {
    showNoticeDom(input);
    baidu$g(input.id + textSuffix).innerHTML = noticeText
  }
  function showNoticeDom(input) {
    var el = baidu$g(input.id + suffix), father = input.parentNode;
    if(!el) {
      var el = input.id, input = baidu$g(input.id + suffix), icon;
      if(!input) {
        input = document.createElement("div"), input.id = el + suffix, input.className = validClass, icon = document.createElement("div"), icon.id = el + iconSuffix, icon.className = iconClass, input.appendChild(icon), icon = document.createElement("div"), icon.id = el + textSuffix, icon.className = textClass, input.appendChild(icon)
      }
      el = input;
      father.appendChild(el)
    }
    el.style.display = "";
    baidu$addClass(father, errorClass)
  }
  function cancelNoticeInTile(input) {
    var el = baidu$g(input.id + suffix), input = input.parentNode, noError = !0;
    if(el) {
      el.style.display = "none"
    }
    for(var i = 0;i < input.childNodes.length;i++) {
      if(el = input.childNodes[i], el.className === validClass && el.style.display !== "none") {
        noError = !1;
        break
      }
    }
    noError && baidu$removeClass(input, errorClass)
  }
  function applyRule(control, ruleName) {
    if(!control.getValue || !ruleName) {
      return!0
    }
    var ruleSeg = ruleName.split(","), text = control.getValue(!0), rule = ruleMap[ruleSeg[0]], segLen = ruleSeg.length, args = [text], ctrl, errorText = "";
    control.type == "checkbox" && (text = !!control.getDOM().checked, args = [text]);
    if(segLen > 0) {
      for(text = 1;text < segLen;text++) {
        ruleSeg[text] == "this" ? args.push(control) : (ctrl = ui.util.get(ruleSeg[text], control.getPage())) && ctrl.getValue && !JSCompiler_StaticMethods_getState(ctrl, "disabled") ? ctrl.type == "checkbox" ? args.push(!!ctrl.getDOM().checked) : args.push(ctrl.getValue()) : args.push(ruleSeg[text])
      }
    }
    ruleSeg = rule.validate.apply(rule, args);
    "[object Number]" == Object.prototype.toString.call(ruleSeg) && ruleSeg !== 0 ? errorText = rule.noticeText[ruleSeg] : "[object String]" == Object.prototype.toString.call(ruleSeg) && ruleSeg !== "" ? errorText = errorMsg[ruleSeg] : baidu$lang$isArray(ruleSeg) && (ruleSeg[0] = errorMsg[ruleSeg[0]], errorText = baidu$format.apply(JSCompiler_alias_NULL, ruleSeg));
    errorText ? (rule.notice = rule.notice || noticeInTail, rule.notice(errorText, control.main, control)) : (rule.cancelNotice = rule.cancelNotice || cancelNoticeInTile, rule.cancelNotice(control.main, control));
    return!errorText
  }
  var errorClass = "validate-error", validClass = "validate", iconClass = "validate-icon", textClass = "validate-text", suffix = "validate", iconSuffix = "validateIcon", textSuffix = "validateText", errorMsg = {SUCCESS:"", ERROR_EMPTY:"\u4e0d\u80fd\u4e3a\u7a7a", ERROR_REGEX:"\u683c\u5f0f\u9519\u8bef", ERROR_INT:"\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u8bf7\u586b\u5199\u6574\u6570", ERROR_NUMBER:"\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u8bf7\u586b\u5199\u6570\u5b57", ERROR_MIN:"\u4e0d\u80fd\u5c0f\u4e8e{0}", 
  ERROR_MIN_DATE:"\u4e0d\u80fd\u65e9\u4e8e{0}", ERROR_MAX:"\u4e0d\u80fd\u5927\u4e8e{0}", ERROR_MAX_DATE:"\u4e0d\u80fd\u665a\u4e8e{0}", ERROR_GT:"\u5fc5\u987b\u5927\u4e8e{0}", ERROR_GT_DATE:"\u5fc5\u987b\u665a\u4e8e{0}", ERROR_LT:"\u5fc5\u987b\u5c0f\u4e8e{0}", ERROR_LT_DATE:"\u5fc5\u987b\u65e9\u4e8e{0}", ERROR_RANGE:"\u5fc5\u987b\u5728{0}\u5230{1}\u7684\u8303\u56f4\u5185", ERROR_LENGTH:"\u957f\u5ea6\u5fc5\u987b\u7b49\u4e8e{0}", ERROR_MIN_LENGTH:"\u957f\u5ea6\u4e0d\u80fd\u5c0f\u4e8e{0}", ERROR_MAX_LENGTH:"\u957f\u5ea6\u4e0d\u80fd\u5927\u4e8e{0}", 
  ERROR_LENGTH_RANGE:"\u957f\u5ea6\u5fc5\u987b\u5728{0}\u5230{1}\u7684\u8303\u56f4\u5185", ERROR_CALENDAR:"\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u8bf7\u63092010-01-01\u7684\u683c\u5f0f\u8f93\u5165", ERROR_EXT:"\u540e\u7f00\u540d\u4e0d\u5408\u6cd5\uff0c\u53ea\u5141\u8bb8\u540e\u7f00\u540d\u4e3a{0}", ERROR_INVALID_CHAR:"\u542b\u6709\u4e0d\u5141\u8bb8\u8f93\u5165\u7684\u5b57\u7b26\uff1a{0}", ERROR_BACKEND:"{0}"}, ruleMap = {required:{validate:function(text) {
    if(baidu$trim(text) === "") {
      return"ERROR_EMPTY"
    }
    return"SUCCESS"
  }}, charge_name:{validate:function(text) {
    if(baidu$trim(text) === "") {
      return"ERROR_EMPTY"
    }
    return/[=\s]/i.test(text) ? ["ERROR_INVALID_CHAR", "\u7a7a\u683c,Tab,\u7b49\u53f7"] : "SUCCESS"
  }}, ext:{validate:function(text) {
    if(baidu$trim(text) === "") {
      return"ERROR_EMPTY"
    }
    var allowedExt = Array.prototype.slice.call(arguments, 1), dotIndex = text.lastIndexOf(".");
    if(dotIndex == -1) {
      return["ERROR_EXT", allowedExt.join(",")]
    }
    for(var dotIndex = text.substring(dotIndex + 1).toLowerCase(), i = 0, j = allowedExt.length;i < j;i++) {
      if(allowedExt[i].toLowerCase() == dotIndex) {
        return"SUCCESS"
      }
    }
    return["ERROR_EXT", allowedExt.join(",")]
  }}, regex:{validate:function(text, pattern, modifiers) {
    if(baidu$trim(text) === "") {
      return"SUCCESS"
    }
    if(!RegExp(pattern, modifiers).test(text)) {
      return"ERROR_REGEX"
    }
    return"SUCCESS"
  }}, "int":{validate:function(text) {
    if(baidu$trim(text) === "") {
      return"SUCCESS"
    }
    if(isNaN(text - 0) || text.indexOf(".") >= 0) {
      return"ERROR_INT"
    }
    return"SUCCESS"
  }}, number:{validate:function(text) {
    if(baidu$trim(text) === "") {
      return"SUCCESS"
    }
    if(isNaN(text - 0)) {
      return"ERROR_NUMBER"
    }
    return"SUCCESS"
  }}, min:{validate:function(text, minValue, type) {
    if(baidu$trim(text) === "") {
      return"SUCCESS"
    }
    if(parse(text, type) < parse(minValue, type)) {
      return[type === "date" ? "ERROR_MIN_DATE" : "ERROR_MIN", minValue]
    }
    return"SUCCESS"
  }}, gt:{validate:function(text, minValue, type) {
    if(baidu$trim(text) === "") {
      return"SUCCESS"
    }
    if(parse(text, type) <= parse(minValue, type)) {
      return[type === "date" ? "ERROR_GT_DATE" : "ERROR_GT", minValue]
    }
    return"SUCCESS"
  }}, max:{validate:function(text, maxValue, type) {
    if(baidu$trim(text) === "") {
      return"SUCCESS"
    }
    if(parse(text, type) > parse(maxValue, type)) {
      return[type === "date" ? "ERROR_MAX_DATE" : "ERROR_MAX", maxValue]
    }
    return"SUCCESS"
  }}, lt:{validate:function(text, maxValue, type) {
    if(baidu$trim(text) === "") {
      return"SUCCESS"
    }
    if(parse(text, type) >= parse(maxValue, type)) {
      return[type === "date" ? "ERROR_LT_DATE" : "ERROR_LT", maxValue]
    }
    return"SUCCESS"
  }}, range:{validate:function(text, minValue, maxValue, type) {
    if(baidu$trim(text) === "") {
      return"SUCCESS"
    }
    if(parse(text, type) > parse(maxValue, type) || parse(text, type) < parse(minValue, type)) {
      return["ERROR_RANGE", minValue, maxValue]
    }
    return"SUCCESS"
  }}, length:{validate:function(text, length) {
    if(text.length !== length) {
      return["ERROR_LENGTH", length]
    }
    return"SUCCESS"
  }}, minLength:{validate:function(text, minLength) {
    if(text.length < minLength) {
      return["ERROR_MIN_LENGTH", minLength]
    }
    return"SUCCESS"
  }}, maxLength:{validate:function(text, maxLength) {
    if(text.length > maxLength) {
      return["ERROR_MAX_LENGTH", maxLength]
    }
    return"SUCCESS"
  }}, lengthRange:{validate:function(text, minLength, maxLength) {
    if(text.length < minLength || text.length > maxLength) {
      return["ERROR_LENGTH_RANGE", minLength, maxLength]
    }
    return"SUCCESS"
  }}, calendar:{validate:function(text) {
    if(baidu$trim(text) === "") {
      return"SUCCESS"
    }
    if(!baidu$date$parse(text)) {
      return"ERROR_CALENDAR"
    }
    return"SUCCESS"
  }}, positiveNumber:{validate:function(text) {
    if(baidu$trim(text) === "") {
      return 0
    }
    if(isNaN(parseInt(text, 10))) {
      return 1
    }
    if(parseInt(text, 10) <= 0 || text.indexOf(".") > -1) {
      return 1
    }
    return 0
  }, noticeText:{1:"\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u5fc5\u987b\u4e3a\u6b63\u6574\u6570"}}, positiveFloat:{validate:function(text) {
    if(!/^[0-9]\d*(\.\d+)?$/.test(text)) {
      return 1
    }
    if(text == "0" || text == 0) {
      return 1
    }
    return 0
  }, noticeText:{1:"\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u5fc5\u987b\u4e3a\u6b63\u6570"}}, email:{validate:function(text) {
    var len = text.length;
    if(len == 0) {
      return 1
    }else {
      if(len > 64) {
        return 2
      }else {
        if(!/^.+@.+$/.test(text)) {
          return 3
        }
      }
    }
    return 0
  }, notice:noticeInTail, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u4e0d\u80fd\u4e3a\u7a7a", 2:"\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc764", 3:"\u683c\u5f0f\u9519\u8bef"}}, emailVerify:{validate:function(text, text2) {
    var len = text.length;
    if(len === 0) {
      return 1
    }else {
      if(len > 64) {
        return 2
      }else {
        if(/^.+@.+$/.test(text)) {
          if(text != text2) {
            return 4
          }
        }else {
          return 3
        }
      }
    }
    return 0
  }, notice:noticeInTailNoTitle, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u786e\u8ba4\u90ae\u4ef6\u4e0d\u80fd\u4e3a\u7a7a", 2:"\u786e\u8ba4\u90ae\u4ef6\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc764", 3:"\u786e\u8ba4\u90ae\u4ef6\u683c\u5f0f\u9519\u8bef", 4:"\u60a8\u4e24\u6b21\u8f93\u5165\u7684\u90ae\u4ef6\u4e0d\u4e00\u81f4\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165"}}, phone:{validate:function(text) {
    var f = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(text);
    if(text != "" && !f) {
      return 1
    }
    return 0
  }, notice:noticeInTail, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u683c\u5f0f\u9519\u8bef\uff0c\u8bf7\u6309\u533a\u53f7-\u7535\u8bdd\u53f7\u7801\u683c\u5f0f\u586b\u5199"}}, fax:{validate:function(text) {
    var f = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(text);
    if(text != "" && !f) {
      return 1
    }
    return 0
  }, notice:noticeInTail, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u683c\u5f0f\u9519\u8bef\uff0c\u8bf7\u6309\u533a\u53f7-\u7535\u8bdd\u53f7\u7801\u683c\u5f0f\u586b\u5199"}}, mobile:{validate:function(text) {
    var f = /^1[3,5,8]{1}[0-9]{1}[0-9]{8}$/.test(text);
    if(text != "" && !f) {
      return 1
    }
    return 0
  }, notice:noticeInTailNoTitle, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u624b\u673a\u53f7\u7801\u683c\u5f0f\u9519\u8bef\uff0c\u624b\u673a\u53f7\u7801\u4e3a\u4ee513,15,18\u5f00\u5934\u768411\u4f4d\u6570\u5b57"}}, password:{validate:function(text) {
    var len = text.length;
    if(len === 0) {
      return 1
    }else {
      if(len < 6) {
        return 2
      }else {
        if(!/[a-z]/.test(text) || !/[A-Z]/.test(text) || !/\d/.test(text)) {
          return 3
        }
      }
    }
    return 0
  }, notice:noticeInTail, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u4e0d\u80fd\u4e3a\u7a7a", 2:"\u4e0d\u80fd\u5c11\u4e8e6\u4f4d", 3:"\u5fc5\u987b\u5305\u542b\u5c0f\u5199\u5b57\u6bcd\u3001\u5927\u5199\u5b57\u6bcd\u548c\u963f\u62c9\u4f2f\u6570\u5b57\u4e09\u79cd\u5b57\u7b26"}}, endTime:{validate:function(text, text1, endTime, orientObj) {
    if(orientObj) {
      var date = orientObj.date, len = date instanceof Array && date.length
    }
    if(text <= text1 && endTime != "9999010124") {
      return 1
    }else {
      if(endTime != "9999010124" && orientObj && len && text < date[len - 1]) {
        return 2
      }
    }
    return 0
  }, notice:noticeInTailNoTitle, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u7ed3\u675f\u65f6\u95f4\u5fc5\u987b\u665a\u4e8e\u8d77\u59cb\u65f6\u95f4", 2:"\u7ed3\u675f\u65e5\u671f\u5fc5\u987b\u665a\u6216\u7b49\u4e8e\u5b9a\u5411\u6295\u653e\u4e2d\u9009\u62e9\u7684\u65e5\u671f"}}, endTimeOrder:{validate:function(text, text1, endTime) {
    if(text < text1 && endTime != "9999010124") {
      return 1
    }
    return 0
  }, notice:noticeInTailNoTitle, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u7ed3\u675f\u65e5\u671f\u4e0d\u5f97\u65e9\u4e8e\u8d77\u59cb\u65e5\u671f"}}, passwordVerify:{validate:function(text, text1) {
    if(text.length === 0) {
      return 1
    }else {
      if(text != text1) {
        return 2
      }
    }
    return 0
  }, notice:noticeInTailNoTitle, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a", 2:"\u60a8\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165"}}, link:{validate:function(text) {
    var len = text.length;
    if(len === 0) {
      return 1
    }else {
      if(len > 1E3) {
        return 2
      }else {
        if(!dn$util$regexp$urlLoose.test(text)) {
          return 3
        }
      }
    }
  }, notice:noticeInTail, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u4e0d\u80fd\u4e3a\u7a7a", 2:"\u4e0d\u80fd\u8d85\u8fc71000\u4e2a\u5b57\u7b26", 3:"\u683c\u5f0f\u9519\u8bef"}}, imgUrl:{validate:function(text) {
    var len = text.length, s1 = text.substring(len - 4, len).toLowerCase(), s2 = text.substring(len - 5, len - 4);
    if(len === 0) {
      return 1
    }else {
      if(len > 1E3) {
        return 2
      }else {
        if(dn$util$regexp$urlLoose.test(text)) {
          if(s1 != ".jpg" && s1 != ".gif" || s2 == "/") {
            return 4
          }
        }else {
          return 3
        }
      }
    }
  }, notice:noticeInTailNoTitle, cancelNotice:cancelNoticeInTile, noticeText:{1:"\u56fe\u7247\u5730\u5740\u4e0d\u80fd\u4e3a\u7a7a", 2:"\u56fe\u7247\u5730\u5740\u4e0d\u80fd\u8d85\u8fc71000\u4e2a\u5b57\u7b26", 3:"\u56fe\u7247\u5730\u5740\u683c\u5f0f\u9519\u8bef", 4:'\u8bf7\u8f93\u5165\u540e\u7f00\u4e3a"jpg"\u6216"gif"\u7684\u56fe\u7247\u5730\u5740'}}, flashUrl:{validate:function(text) {
    var len = text.length, s1 = text.substring(len - 4, len).toLowerCase(), s2 = text.substring(len - 5, len - 4);
    if(len === 0) {
      return 1
    }else {
      if(len > 1E3) {
        return 2
      }else {
        if(dn$util$regexp$urlLoose.test(text)) {
          if(s1 != ".swf" || s2 == "/") {
            return 4
          }
        }else {
          return 3
        }
      }
    }
  }, notice:noticeInTailNoTitle, cancelNotice:cancelNoticeInTile, noticeText:{1:"Flash\u5730\u5740\u4e0d\u80fd\u4e3a\u7a7a", 2:"Flash\u5730\u5740\u4e0d\u80fd\u8d85\u8fc71000\u4e2a\u5b57\u7b26", 3:"Flash\u5730\u5740\u683c\u5f0f\u9519\u8bef", 4:'\u8bf7\u8f93\u5165\u540e\u7f00\u4e3a"swf"\u7684Flash\u5730\u5740'}}, backendError:{validate:function(text, control) {
    return["ERROR_BACKEND", control.errorMessage]
  }, notice:noticeInTailNoTitle}};
  return function(control, ruleNames) {
    if(baidu$lang$isArray(ruleNames)) {
      for(var i = 0;i < ruleNames.length;i++) {
        if(!applyRule(control, ruleNames[i])) {
          return!1
        }
      }
      return!0
    }
    return applyRule(control, ruleNames)
  }
}();
Validator.showError = function(ele, errorMsg, opt_width) {
  var parent = ele.parentNode;
  baidu$addClass(parent, "validate-error");
  if(parent.lastChild.className !== "validate") {
    var errorNode = document.createElement("div");
    baidu$addClass(errorNode, "validate");
    errorNode.innerHTML = baidu$format('<div class="validate-icon"></div><div class="validate-text">{0}</div>', errorMsg);
    if(opt_width && ele.parentNode) {
      ele.parentNode.style.width = opt_width + "px"
    }
    parent.appendChild(errorNode)
  }
};
Validator.hideError = function(ele) {
  var parent = ele.parentNode;
  parent && parent.lastChild.className === "validate" && parent.removeChild(parent.lastChild);
  baidu$removeClass(ele.parentNode, "validate-error")
};
Validator.batchHideErrors = function(eleArr) {
  for(var parent, ele, i = 0, len = eleArr.length;i < len;i++) {
    if(ele = eleArr[i]) {
      (parent = ele.parentNode) && parent.lastChild.className === "validate" && parent.removeChild(parent.lastChild), baidu$removeClass(ele.parentNode, "validate-error")
    }
  }
};
function ui$InputControl(options) {
  ui$Control.call(this, options)
}
baidu$inherits(ui$InputControl, ui$Control);
JSCompiler_prototypeAlias = ui$InputControl.prototype;
JSCompiler_prototypeAlias.converter = JSCompiler_alias_NULL;
JSCompiler_prototypeAlias.bindModel = function(model) {
  ui$InputControl.superClass.bindModel.call(this, model);
  if(typeof this.paramValue !== "undefined") {
    model = this.paramValue, this.converter && (model = this.converter.convertBack(model)), this.setValue(model)
  }
};
JSCompiler_prototypeAlias.render = function(opt_main) {
  ui$InputControl.superClass.render.call(this, opt_main);
  this.formName = this.main.getAttribute("name")
};
JSCompiler_prototypeAlias.getValue = function() {
  return this.value
};
JSCompiler_prototypeAlias.setValue = function(value) {
  this.value = value
};
JSCompiler_prototypeAlias.validate = function() {
  if(!this.rule) {
    return!0
  }
  return ui.util.validate(this, this.rule)
};
JSCompiler_prototypeAlias.showError = function(errorMessage) {
  this.errorMessage = errorMessage;
  ui.util.validate(this, "backendError,this");
  this.errorMessage = JSCompiler_alias_NULL
};
JSCompiler_prototypeAlias.hideError = function() {
  ui.util.validate.hideError(this.main)
};
JSCompiler_prototypeAlias.setReadOnly = function(readOnly) {
  (this.readOnly = readOnly = !!readOnly) ? JSCompiler_StaticMethods_setState(this, "readonly") : JSCompiler_StaticMethods_removeState(this, "readonly")
};
function ui$Lib() {
  this.pagePopup = this.pageMain = JSCompiler_alias_NULL
}
ui$Lib.prototype.create = function(type, options, main) {
  options.type = type;
  return JSCompiler_StaticMethods_createControl(options, main)
};
function JSCompiler_StaticMethods_createControl(attrs, main) {
  var refer = {};
  typeof attrs === "string" && (attrs = JSCompiler_StaticMethods_parseAttrStr(attrs));
  if(!attrs.id) {
    throw"UI Control must have an id";
  }
  baidu$object$each(attrs, function(value, key) {
    typeof value === "string" && (value.indexOf("@") === 0 ? (refer[key] = value.substr(1), delete attrs[key]) : value.indexOf("&") === 0 && (attrs[key] = baidu$getObjectByName(value.substr(1))))
  });
  attrs.refer = refer;
  if(main) {
    attrs.main = main
  }
  return new (baidu$getObjectByName(attrs.type, ui) || baidu$getObjectByName(attrs.type, window))(attrs)
}
function JSCompiler_StaticMethods_buildControlTree(JSCompiler_StaticMethods_buildControlTree$self, domParent, ctrlParent) {
  if(domParent && domParent.childNodes && ctrlParent && ctrlParent.addChild) {
    for(var child, uiAttr, i = 0;i < domParent.childNodes.length;i++) {
      child = domParent.childNodes[i], child.nodeType === 1 && ((uiAttr = child.getAttribute("ui")) ? (uiAttr = JSCompiler_StaticMethods_createControl(uiAttr, child), ctrlParent.addChild(uiAttr), JSCompiler_StaticMethods_buildControlTree(JSCompiler_StaticMethods_buildControlTree$self, child, uiAttr)) : JSCompiler_StaticMethods_buildControlTree(JSCompiler_StaticMethods_buildControlTree$self, child, ctrlParent))
    }
  }
}
function JSCompiler_StaticMethods_parseAttrStr(attrStr) {
  for(var attrs = {}, attrStr = attrStr.split(";"), attrArrLen = attrStr.length, attrItem, attrSegment;attrArrLen--;) {
    if(attrItem = attrStr[attrArrLen]) {
      attrSegment = attrItem.split(":"), attrItem = attrSegment[0], attrSegment = attrSegment[1], attrs[attrItem] ? (baidu$lang$isArray(attrs[attrItem]) || (attrs[attrItem] = [attrs[attrItem]]), attrs[attrItem].push(attrSegment)) : attrs[attrItem] = attrSegment
    }
  }
  return attrs
}
ui$Lib.prototype.get = function(domId, opt_page) {
  for(var ids = domId.split("_"), i = ids[0] === "frame" ? 1 : 0, control = opt_page || (ids[0] === "frame" ? this.pagePopup : this.pageMain);i < ids.length;i++) {
    if(!control) {
      return JSCompiler_alias_NULL
    }
    control = JSCompiler_StaticMethods_getChild(control, ids[i])
  }
  return control
};
ui$Lib.prototype.dispose = function() {
  this.pageMain && this.pageMain.dispose()
};
ui.util = new ui$Lib;
ui.util.validate = Validator;
baidu$on(window, "unload", function() {
  ui.util.dispose()
});
function app$module$ModuleManager() {
  this._modules = {};
  this._moduleUris = this._moduleInfo = this._loader = JSCompiler_alias_NULL
}
baidu$addSingletonGetter(app$module$ModuleManager);
function JSCompiler_StaticMethods_execOnLoad(moduleName, callback) {
  var JSCompiler_StaticMethods_execOnLoad$self = moduleManager;
  if(JSCompiler_StaticMethods_execOnLoad$self._modules[moduleName] === !0) {
    callback()
  }else {
    var moduleUrl = JSCompiler_StaticMethods_execOnLoad$self._moduleUris[moduleName];
    moduleUrl && JSCompiler_StaticMethods_execOnLoad$self._loader.load(moduleUrl, callback)
  }
}
function app$module$ModuleLoader() {
  this._loadedUrl = {}
}
app$module$ModuleLoader.prototype.load = function(moduleUrl, callback) {
  if(this._loadedUrl[moduleUrl] === !0) {
    callback()
  }else {
    var scriptParent = document.getElementsByTagName("head")[0] || document.documentElement, script = document.createElement("SCRIPT");
    script.type = "text/javascript";
    script.src = moduleUrl;
    var me = this;
    baidu$ie ? script.onreadystatechange = function() {
      if(!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
        script.onreadystatechange = baidu.fn.blank, me._loadedUrl[moduleUrl] = !0, callback()
      }
    } : script.onload = function() {
      me._loadedUrl[moduleUrl] = !0;
      callback()
    };
    scriptParent.appendChild(script)
  }
};
function er$Context() {
  this.applicationContext = {}
}
er$Context.prototype.set = function(key, value) {
  this.applicationContext[key] = value
};
er$Context.prototype.get = function(key) {
  return this.applicationContext[key]
};
var er$context = new er$Context;
var dn = {};
function ui$Mask() {
  this.id = "clbMask";
  this.clazz = "ui-mask";
  this.privateId = "";
  var me = this;
  this.resizeHandler = function() {
    JSCompiler_StaticMethods_repaintMask(JSCompiler_StaticMethods_getMask(me))
  }
}
baidu$addSingletonGetter(ui$Mask);
ui$Mask.prototype.init = function() {
  var el = document.createElement("div");
  el.id = this.id;
  el.className = this.clazz;
  document.body.appendChild(el);
  return el
};
function JSCompiler_StaticMethods_repaintMask(mask) {
  var height;
  height = document;
  var body = height.body;
  height = Math.max(height.documentElement.scrollHeight, body.scrollHeight, (height.compatMode == "BackCompat" ? body : height.documentElement).clientHeight);
  var body = document, body$$0 = body.body;
  mask.style.width = Math.max(body.documentElement.scrollWidth, body$$0.scrollWidth, (body.compatMode == "BackCompat" ? body$$0 : body.documentElement).clientWidth) + "px";
  mask.style.height = height + "px"
}
function JSCompiler_StaticMethods_getMask(JSCompiler_StaticMethods_getMask$self) {
  baidu$g(JSCompiler_StaticMethods_getMask$self.id) || JSCompiler_StaticMethods_getMask$self.init();
  return baidu$g(JSCompiler_StaticMethods_getMask$self.id)
}
ui$Mask.prototype.show = function(id) {
  this.privateId = this.privateId || id;
  id = JSCompiler_StaticMethods_getMask(this);
  JSCompiler_StaticMethods_repaintMask(id);
  id.style.display = "block";
  baidu$on(window, "resize", this.resizeHandler)
};
ui$Mask.prototype.hide = function(id) {
  if(!this.privateId || id == this.privateId) {
    JSCompiler_StaticMethods_getMask(this).style.display = "none", baidu$un(window, "resize", this.resizeHandler), this.privateId = ""
  }
};
function dn$Loading() {
  this.ID = "Loading";
  this.count = 0
}
dn$Loading.prototype.show = function() {
  ui$Mask.getInstance().show(void 0);
  if(baidu$g(this.ID) && (baidu$show(this.ID), baidu$ie && baidu$ie < 7)) {
    baidu$g(this.ID).style.top = "120px"
  }
  this.count++
};
dn$Loading.prototype.hide = function() {
  this.count--;
  this.count === 0 && (ui$Mask.getInstance().hide(void 0), baidu$g(this.ID) && baidu$hide(this.ID))
};
var dn$loading = new dn$Loading;
function ui$Button(options) {
  ui$Control.call(this, options);
  this.type = "button"
}
baidu$inherits(ui$Button, ui$Control);
goog$exportSymbol("ui.Button", ui$Button);
JSCompiler_prototypeAlias = ui$Button.prototype;
JSCompiler_prototypeAlias.tplButton = '<div class="ui-button-bg-left"></div><div id="{2}" class="{1}">{0}</div>';
JSCompiler_prototypeAlias.content = "button";
JSCompiler_prototypeAlias.getMainHtml = function() {
  return baidu$format(this.tplButton, this.content, JSCompiler_StaticMethods_getClass(this, "label"), JSCompiler_StaticMethods_getId(this, "label"))
};
JSCompiler_prototypeAlias.enable = function() {
  ui$Button.superClass.enable.call(this);
  JSCompiler_StaticMethods_removeState(this, "hover")
};
JSCompiler_prototypeAlias.render = function(opt_main) {
  ui$Button.superClass.render.call(this, opt_main);
  opt_main = this.main;
  if(opt_main.tagName == "DIV") {
    var innerDiv = opt_main.firstChild;
    if(innerDiv && innerDiv.tagName != "DIV") {
      this.content = opt_main.innerHTML
    }
    opt_main.innerHTML = this.getMainHtml();
    if(opt_main.offsetWidth < 60 && opt_main.offsetWidth > 0) {
      baidu$G(JSCompiler_StaticMethods_getId(this, "label")).style.width = "40px"
    }
    opt_main.onclick = baidu$fn$bind(this.clickHandler, this)
  }
};
JSCompiler_prototypeAlias.clickHandler = function() {
  if(!JSCompiler_StaticMethods_isDisabled(this) && "function" == typeof this.onclick) {
    this.onclick()
  }
};
JSCompiler_prototypeAlias.dispose = function() {
  this.onclick = this.main.onclick = JSCompiler_alias_NULL;
  ui$Button.superClass.dispose.call(this)
};
function ui$Dialog(options) {
  ui$Control.call(this, options);
  this.type = "dialog";
  this.top = this.top || 137;
  this.resizeHandler = JSCompiler_StaticMethods_getResizeHandler(this)
}
baidu$inherits(ui$Dialog, ui$Control);
JSCompiler_prototypeAlias = ui$Dialog.prototype;
JSCompiler_prototypeAlias.tplBF = '<div class="{1}" id="{0}"></div>';
JSCompiler_prototypeAlias.tplHead = '<div id="{0}" class="{1}"><div id="{2}" class="{3}">{4}</div>{5}</div>';
JSCompiler_prototypeAlias.tplClose = '<div class="{0}" id="{1}">&nbsp;</div>';
JSCompiler_prototypeAlias.isShow = !1;
JSCompiler_prototypeAlias.show = function() {
  this.getDOM() || (this.render(), baidu$on(window, "resize", this.resizeHandler));
  this.resizeHandler();
  ui$Mask.getInstance().show("dialog");
  this.isShow = !0
};
JSCompiler_prototypeAlias.hide = function() {
  if(this.isShow) {
    baidu$un(window, "resize", this.resizeHandler);
    var main = this.getDOM();
    main.style.left = main.style.top = "-10000px";
    ui$Mask.getInstance().hide("dialog");
    this.isShow = !1
  }
};
JSCompiler_prototypeAlias.setTitle = function(html) {
  var el = baidu$g(JSCompiler_StaticMethods_getId(this, "title"));
  if(el) {
    el.innerHTML = html
  }
  this.title = html
};
JSCompiler_prototypeAlias.setContent = function(content) {
  var body = this.getBody();
  if(body) {
    body.innerHTML = content, JSCompiler_StaticMethods_buildControlTree(ui.util, body, this)
  }
};
function JSCompiler_StaticMethods_getResizeHandler(JSCompiler_StaticMethods_getResizeHandler$self) {
  return function() {
    var main = JSCompiler_StaticMethods_getResizeHandler$self.getDOM(), left = (document.body.clientWidth - main.offsetWidth) / 2;
    left < 0 && (left = 0);
    main.style.left = left + "px";
    main.style.top = baidu$page$getScrollTop() + JSCompiler_StaticMethods_getResizeHandler$self.top + "px"
  }
}
JSCompiler_prototypeAlias.close = function() {
  this.hide();
  this.onclose()
};
JSCompiler_prototypeAlias.onclose = baidu.fn.blank;
JSCompiler_prototypeAlias.render = function() {
  var main;
  if(!baidu$g(JSCompiler_StaticMethods_getId(this))) {
    this.main = main = document.createElement("div");
    ui$Dialog.superClass.render.call(this, main);
    if(this.width) {
      main.style.width = this.width + "px"
    }
    main.style.left = "-10000px";
    main.innerHTML = this.getHeadHtml() + baidu$format(this.tplBF, JSCompiler_StaticMethods_getId(this, "body"), JSCompiler_StaticMethods_getClass(this, "body"), "") + baidu$format(this.tplBF, JSCompiler_StaticMethods_getId(this, "foot"), JSCompiler_StaticMethods_getClass(this, "foot"), "");
    document.body.appendChild(main)
  }
};
JSCompiler_prototypeAlias.getHeadHtml = function() {
  return baidu$format(this.tplHead, JSCompiler_StaticMethods_getId(this, "head"), JSCompiler_StaticMethods_getClass(this, "head"), JSCompiler_StaticMethods_getId(this, "title"), JSCompiler_StaticMethods_getClass(this, "title"), this.title, this.closeButton === !1 ? "" : baidu$format(this.tplClose, JSCompiler_StaticMethods_getClass(this, "close"), JSCompiler_StaticMethods_getId(this, "close")))
};
JSCompiler_prototypeAlias.bindEvent = function() {
  ui$Dialog.superClass.bindEvent.call(this);
  if(this.closeButton !== !1) {
    var close = JSCompiler_StaticMethods_getClose(this);
    close.onclick = baidu$fn$bind(this.close, this);
    close.onmouseover = baidu$fn$bind(this.closeOver, this);
    close.onmouseout = baidu$fn$bind(this.closeOut, this)
  }
};
JSCompiler_prototypeAlias.getBody = function() {
  return baidu$g(JSCompiler_StaticMethods_getId(this, "body"))
};
JSCompiler_prototypeAlias.getDOM = function() {
  return baidu$g(JSCompiler_StaticMethods_getId(this))
};
function JSCompiler_StaticMethods_getClose(JSCompiler_StaticMethods_getClose$self) {
  return baidu$g(JSCompiler_StaticMethods_getId(JSCompiler_StaticMethods_getClose$self, "close"))
}
JSCompiler_prototypeAlias.closeOver = function() {
  baidu$addClass(JSCompiler_StaticMethods_getClose(this), JSCompiler_StaticMethods_getClass(this, "close-hover"))
};
JSCompiler_prototypeAlias.closeOut = function() {
  baidu$removeClass(JSCompiler_StaticMethods_getClose(this), JSCompiler_StaticMethods_getClass(this, "close-hover"))
};
JSCompiler_prototypeAlias.dispose = function() {
  baidu$un(window, "resize", this.resizeHandler);
  this.resizeHandler = JSCompiler_alias_NULL;
  if(this.closeButton !== !1) {
    var close = JSCompiler_StaticMethods_getClose(this);
    if(close) {
      close.onclick = JSCompiler_alias_NULL, close.onmouseover = JSCompiler_alias_NULL, close.onmouseout = JSCompiler_alias_NULL
    }
  }
  if(close = this.getDOM()) {
    close.innerHTML = "", document.body.removeChild(close)
  }
  ui$Dialog.superClass.dispose.call(this)
};
function ui$Dialog$Alert(options) {
  ui$Control.call(this, options);
  this.autoState = !1;
  this.id = "DialogAlert";
  this.init()
}
baidu$inherits(ui$Dialog$Alert, ui$Control);
baidu$addSingletonGetter(ui$Dialog$Alert);
ui$Dialog$Alert.prototype.init = function() {
  var frame = new ui$Dialog({id:"frame", closeButton:!1, title:"", width:350}), okbtn = new ui$Button({id:"okbtn", content:"\u786e\u5b9a"});
  this.addChild(frame);
  this.addChild(okbtn);
  ui$Dialog$Alert.superClass.init.call(this)
};
ui$Dialog$Alert.prototype.render = function() {
  JSCompiler_StaticMethods_getChild(this, "frame").render();
  JSCompiler_StaticMethods_getChild(this, "okbtn").appendTo(baidu$g(JSCompiler_StaticMethods_getId(JSCompiler_StaticMethods_getChild(this, "frame"), "foot")));
  JSCompiler_StaticMethods_getChild(this, "okbtn").render();
  this.lifePhase = 3
};
ui$Dialog$Alert.prototype.show = function(title, content) {
  var frame = JSCompiler_StaticMethods_getChild(this, "frame");
  frame.main || (this.render(), this.bindEvent());
  frame.show();
  frame.setTitle(title);
  frame.setContent(content)
};
function JSCompiler_StaticMethods_setOkHandler(JSCompiler_StaticMethods_setOkHandler$self, onok) {
  JSCompiler_StaticMethods_getChild(JSCompiler_StaticMethods_setOkHandler$self, "okbtn").onclick = function() {
    var isFunc = typeof onok == "function";
    (isFunc && onok() !== !1 || !isFunc) && JSCompiler_StaticMethods_getChild(JSCompiler_StaticMethods_setOkHandler$self, "frame").hide()
  }
}
function ui$Dialog$alert(args) {
  var dialog = ui$Dialog$Alert.getInstance(), onok = args.onok;
  dialog.show(args.title || "", baidu$format('<div class="ui-dialog-icon ui-dialog-icon-{0}"></div><div class="ui-dialog-text">{1}</div>', args.type || "warning", args.content || ""));
  JSCompiler_StaticMethods_setOkHandler(dialog, onok)
}
;var RequesterManager = function() {
  function scan() {
    var now = new Date;
    if(requesters.length === 0) {
      clearInterval(timer), timer = JSCompiler_alias_NULL
    }else {
      for(var i = 0;i < requesters.length;i++) {
        if(now - requesters[i].startTime > TIMEOUT && requesters[i].ontimeout) {
          requesters[i].ontimeout()
        }
      }
    }
  }
  var TIMEOUT = 3E4, requesters = [], timer;
  return{addRequester:function(requester) {
    requesters.push(requester);
    timer || (timer = setInterval(scan, 1E3))
  }, removeRequester:function(requester) {
    for(var i = 0;i < requesters.length;i++) {
      if(requesters[i] === requester) {
        requesters.splice(i, 1);
        break
      }
    }
  }}
}();
baidu$ajax._request = baidu$ajax.request;
baidu$ajax.request = function(url, options) {
  function cleanup() {
    requester.xhr = requester.startTime = requester.ontimeout = JSCompiler_alias_NULL;
    RequesterManager.removeRequester(requester)
  }
  var onsuccess = options.onsuccess, onfailure = options.onfailure, ontimeout = options.ontimeout, requester;
  onsuccess && (options.onsuccess = function(xhr) {
    onsuccess.call(this, xhr);
    cleanup()
  });
  onfailure && (options.onfailure = function(xhr) {
    onfailure.call(this, xhr);
    cleanup()
  });
  requester = {startTime:new Date, ontimeout:function() {
    ontimeout && ontimeout(requester.xhr);
    cleanup()
  }};
  RequesterManager.addRequester(requester);
  requester.xhr = baidu$ajax._request(url, options)
};
var Requester = function() {
  function responseHandler(xhr, onsuccess, opt_onfailure) {
    var data, msgOkClick, opt_onfailure = opt_onfailure || baidu.fn.blank;
    dn$loading.hide();
    try {
      data = baidu$json$parse(xhr.responseText)
    }catch(e) {
      ui$Dialog$alert({title:"\u6570\u636e\u89e3\u6790\u51fa\u9519", content:"\u6570\u636e\u89e3\u6790\u51fa\u9519", onok:msgOkClick});
      opt_onfailure(DEFAULT_SERVER_ERROR);
      return
    }
    if(typeof data == "object") {
      if(data.success != "true") {
        xhr = data.message;
        if(xhr.global) {
          onsuccess = "\u7cfb\u7edf\u63d0\u793a", xhr = xhr.global
        }else {
          if(xhr.noSession) {
            onsuccess = "\u7cfb\u7edf\u8d85\u65f6", xhr = xhr.noSession, msgOkClick = gotoIndex
          }else {
            if(xhr.field) {
              onsuccess(data);
              return
            }else {
              onsuccess = "\u7cfb\u7edf\u63d0\u793a", xhr = "\u8bf7\u6c42\u5931\u8d25(\u672a\u77e5\u9519\u8bef)"
            }
          }
        }
        ui$Dialog$alert({title:onsuccess, content:xhr, onok:msgOkClick});
        opt_onfailure(data)
      }else {
        onsuccess(data)
      }
    }
  }
  function gotoIndex() {
    document.location.href = "/index.html"
  }
  function getUserId4Check() {
    var visitor = er$context.get("visitor");
    return"userId4Check=" + (visitor ? visitor.id : 0)
  }
  var DEFAULT_SERVER_ERROR = {success:"false", message:{global:"\u670d\u52a1\u5668\u9519\u8bef"}};
  return{post:function(url, params, onsuccess, onfailure, opt_options) {
    var realURL = url + "?" + getUserId4Check(), dontRetry = !1, customFailHandler = onfailure || baidu.fn.blank, defaultFailHandler;
    opt_options && (dontRetry = !!opt_options.dontRetry);
    defaultFailHandler = dontRetry ? function() {
      dn$loading.hide();
      ui$Dialog$alert({title:"\u8bf7\u6c42\u5931\u8d25", content:"\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5"})
    } : function() {
      dn$loading.hide();
      Requester.post(url, params, onsuccess, onfailure, {dontRetry:!0})
    };
    dn$loading.show();
    baidu$ajax.request(realURL, {method:"post", data:params, onsuccess:function(xhr) {
      responseHandler(xhr, onsuccess, customFailHandler)
    }, onfailure:function() {
      defaultFailHandler();
      customFailHandler(DEFAULT_SERVER_ERROR)
    }, ontimeout:function(xhr) {
      dn$loading.hide();
      xhr.onreadystatechange = baidu.fn.blank;
      ui$Dialog$alert({title:"\u8bf7\u6c42\u8d85\u65f6", content:"\u8bf7\u6c42\u8d85\u65f6(" + realURL + ")\uff0c\u8bf7\u91cd\u8bd5"})
    }})
  }, get:function(url, params, onsuccess) {
    url = url + "?" + getUserId4Check();
    baidu$ajax.request(url, {method:"get", data:params, onsuccess:function(xhr) {
      responseHandler(xhr, onsuccess)
    }})
  }, getUserId4Check:getUserId4Check}
}();
var dn$util$regexp$urlLoose = /^((http|https|ftp|ftps):\/\/)?[A-Za-z0-9][A-Za-z0-9-]{0,}[A-Za-z0-9]?(\.[A-Za-z0-9]+)+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/i;
function dn$util$da_generator(cfg) {
  for(var obj = {}, i = 0, j = cfg.length;i < j;i++) {
    obj[cfg[i].name] = function() {
      var url = cfg[i].url;
      return function(params, onsuccess, onfailure) {
        typeof params == "function" ? Requester.post(url, JSCompiler_alias_NULL, params, onfailure) : Requester.post(url, params, onsuccess, onfailure)
      }
    }()
  }
  return obj
}
;var community = {config:{action:[{location:"/community/list", action:"community.List"}, {location:"/community/create", action:"community.Form"}, {location:"/community/update", action:"community.Form"}], listFields:[{width:200, title:"\u751f\u6d3b\u5708\u540d\u79f0", field:"name", subEntry:!1, content:function(item) {
  return item.name
}}, {width:50, title:"\u72b6\u6001", field:"status", subEntry:!1, content:function(item) {
  return er$context.get("communityStatusMap")[item.status]
}}, {width:300, title:"\u520a\u4f8b\u4ef7", field:"sale_price", breakLine:!0, content:function(item) {
  var item = item.sale_price, productTypeMap = er$context.get("productTypeMap"), html = [];
  baidu$object$each(item, function(value, key) {
    html.push(productTypeMap[key] + "\u520a\u4f8b\u4ef7\uff1a" + value)
  });
  return html.join("&nbsp;,&nbsp;")
}}, {width:100, title:"\u64cd\u4f5c", content:function(item) {
  return baidu$format('<a href="#/community/update~id={0}">\u4fee\u6539</a>', item.id)
}}]}};
community.data = dn$util$da_generator([{name:"list", url:"/community/list"}, {name:"status_update", url:"/community/status_update"}, {name:"create", url:"/community/create"}, {name:"update", url:"/community/update"}, {name:"read", url:"/community/read"}, {name:"slotlist", url:"/community/slotlist"}]);
er$controller.modules.push(community);
var account = {config:{action:[{location:"/account/list", action:"account.List"}, {location:"/account/create", action:"account.Form"}], url:{list:"/account/list", create:"/account/create", batchDelete:"/account/batch_delete"}, listFields:[{width:50, title:"\u8d26\u6237ID", dragable:!0, field:"id", content:function(item) {
  return item.id
}}, {width:150, title:"\u8d26\u6237\u540d", dragable:!0, field:"name", content:function(item) {
  return item.name
}}, {width:100, title:"\u89d2\u8272", dragable:!0, field:"role_id", content:function(item) {
  return er$context.get("rolesMap")[item.role_id]
}}, {width:100, title:"\u6fc0\u6d3b\u65f6\u95f4", dragable:!0, field:"active_time", content:function(item) {
  for(var item = item.active_time.match(/^(\d{4})(\d{2})(\d{2})(\d{2})*$/), len = item.length;len--;) {
    item[len] = parseInt(item[len], 10)
  }
  return baidu$date$format(new Date(item[1], item[2] - 1, item[3]))
}}]}};
account.data = dn$util$da_generator([{name:"list", url:account.config.url.list}, {name:"create", url:account.config.url.create}, {name:"batch_delete", url:account.config.url.batchDelete}]);
er$controller.modules.push(account);
var moduleManager = app$module$ModuleManager.getInstance();
moduleManager._loader = new app$module$ModuleLoader;
moduleManager._moduleInfo = goog$global.PLOVR_MODULE_INFO;
moduleManager._moduleUris = goog$global.PLOVR_MODULE_URIS;
er$Controller.prototype.originalEnterAction = er$Controller.prototype.enterAction;
er$Controller.prototype.enterAction = function(actionConfig, argMap) {
  var action = actionConfig.action, dotIndex = action.indexOf(".");
  if(dotIndex != -1) {
    var me = this;
    JSCompiler_StaticMethods_execOnLoad(action.substring(0, dotIndex), function() {
      me.currentAction = me.originalEnterAction(actionConfig, argMap)
    })
  }
};
(function(main) {
  var pwm = new base$ParallelWorkerManager;
  goog$asyncResource.length > 0 && JSCompiler_StaticMethods_addWorker(pwm, new app$Worker(goog$asyncResource));
  JSCompiler_StaticMethods_addDoneListener(pwm, function() {
    goog$asyncResource = [];
    main()
  });
  pwm.start()
})(function() {
  er$controller.init();
  JSCompiler_StaticMethods_redirect(er$locator, "/community/list")
});
moduleManager._modules.app = !0;
function base$DataSource() {
}
baidu$inherits(base$DataSource, base$Object);
base$DataSource.prototype.getData = function() {
  throw"Not implemented";
};
function base$ListDataSource() {
}
base$ListDataSource.prototype = {getData:function(params, callback) {
  this.getDataInternal(params.pageSize, params.pageNo, params.orderBy, params.order, callback)
}, getDataInternal:function() {
  throw"Not implemented";
}};
baidu$inherits(base$ListDataSource, base$DataSource);
function base$RemoteListDataSource(requester, opt_getExtraParam) {
  this.requester = requester;
  if(opt_getExtraParam) {
    this.getExtraParam = opt_getExtraParam
  }
}
base$RemoteListDataSource.prototype = {getDataInternal:function(pageSize, pageNo, orderBy, order, callback) {
  var params = [], extraParam = this.getExtraParam();
  params.push("page.pageSize=" + encodeURIComponent(pageSize));
  params.push("page.pageNo=" + encodeURIComponent(pageNo));
  params.push("page.orderBy=" + encodeURIComponent(orderBy));
  params.push("page.order=" + encodeURIComponent(order));
  extraParam && params.push(extraParam);
  this.requester(params.join("&"), callback)
}, getExtraParam:function() {
  return JSCompiler_alias_NULL
}};
baidu$inherits(base$RemoteListDataSource, base$ListDataSource);
function er$Action() {
}
er$Action.prototype = {enter:function(argMap) {
  var me = this;
  if(!me.model) {
    me.model = {}
  }
  if(me.model instanceof base$BaseModel) {
    me.modelChangeHandler = baidu$fn$bind(me.onModelChanged, me), me.model.addPropertyChangedListener(me.modelChangeHandler)
  }
  me.argMap = argMap;
  if(me.onenter) {
    me.onenter()
  }
  baidu$object$each(argMap.paramMap, function(value, key) {
    me.model[key] = value
  });
  if(me.onbeforeinitmodel) {
    me.onbeforeinitmodel()
  }
  me.initModel(argMap, function() {
    if(me.onafterinitmodel) {
      me.onafterinitmodel()
    }
    me.initView()
  })
}, initView:function() {
  var dom = baidu$g(this.argMap.domId), view = this.getView(), isPopup = this.argMap.type === "popup", JSCompiler_StaticMethods_createPage$self = ui.util, dom = new ui$Page({view:view, main:dom, autoState:!1});
  isPopup ? (dom.id = "frame", JSCompiler_StaticMethods_createPage$self.pagePopup = dom) : JSCompiler_StaticMethods_createPage$self.pageMain = dom;
  this.page = dom;
  dom.init();
  this.afterInit(dom);
  dom.bindModel(this.model);
  this.beforeRender(dom);
  dom.render();
  this.enterDocument(dom);
  dom.bindEvent();
  this.initBehavior(dom);
  this.done()
}, done:function() {
  var all = document.getElementsByTagName("*"), auth;
  if(er$controller.permit) {
    for(var i = 0, j = all.length;i < j;i++) {
      if((auth = all[i].getAttribute("auth")) && !er$controller.permit(auth)) {
        all[i].style.display = "none"
      }
    }
  }
}, getView:function() {
  var view = this.view;
  switch(typeof view) {
    case "object":
      return view[this.argMap.type];
    case "function":
      return view.call(this);
    default:
      return String(view)
  }
}, initModel:function(argMap, callback) {
  function repeatCallback() {
    i++;
    i < len ? me[getters[i]].call(me, paramMap, repeatCallback) : callback()
  }
  var me = this, paramMap = argMap.paramMap, getters = me.CONTEXT_INITER_LIST, i = -1, len = getters ? getters.length : 0;
  repeatCallback()
}, onModelChanged:JSCompiler_emptyFn(), afterInit:JSCompiler_emptyFn(), beforeRender:JSCompiler_emptyFn(), enterDocument:JSCompiler_emptyFn(), initBehavior:JSCompiler_emptyFn(), saveState:function(stateStr) {
  JSCompiler_StaticMethods_redirect(er$locator, "~" + stateStr, !0)
}, back:function() {
  var argMap = this.argMap, referer = argMap && argMap.referer;
  if(argMap && argMap.type !== "popup") {
    if(!referer || this.USE_BACK_LOCATION) {
      referer = this.BACK_LOCATION
    }
    JSCompiler_StaticMethods_redirect(er$locator, referer)
  }
}, leave:function() {
  if(this.onbeforeleave) {
    this.onbeforeleave()
  }
  this.model instanceof base$BaseModel && this.model.removePropertyChangedListener(this.modelChangeHandler);
  this.page && this.page.dispose();
  this.page = this.argMap = JSCompiler_alias_NULL
}};
function er$AbstractFormAction() {
  this.form = JSCompiler_alias_NULL
}
baidu$inherits(er$AbstractFormAction, er$Action);
JSCompiler_prototypeAlias = er$AbstractFormAction.prototype;
JSCompiler_prototypeAlias.initBehavior = function(page) {
  er$AbstractFormAction.superClass.initBehavior.call(this, page);
  if(this.form) {
    this.form.onsubmit = baidu$fn$bind(this.onFormSubmit, this)
  }
};
JSCompiler_prototypeAlias.leave = function() {
  if(this.form) {
    this.form.onsubmit = JSCompiler_alias_NULL
  }
  this.form = JSCompiler_alias_NULL;
  er$AbstractFormAction.superClass.leave.call(this)
};
JSCompiler_prototypeAlias.onFormSubmit = function(params) {
  this.doSubmit(JSCompiler_StaticMethods_getFinalParam(this, params))
};
function JSCompiler_StaticMethods_getFinalParam(JSCompiler_StaticMethods_getFinalParam$self, params) {
  var params = JSCompiler_StaticMethods_processParam(JSCompiler_StaticMethods_getFinalParam$self, params), extraParam = JSCompiler_StaticMethods_getFinalParam$self.getExtraParam();
  extraParam && (params += "&" + extraParam);
  return params
}
JSCompiler_prototypeAlias.doSubmit = JSCompiler_emptyFn();
JSCompiler_prototypeAlias.paramAdapters = JSCompiler_alias_NULL;
function JSCompiler_StaticMethods_processParam(JSCompiler_StaticMethods_processParam$self, params) {
  if(baidu$lang$isArray(JSCompiler_StaticMethods_processParam$self.paramAdapters)) {
    for(var i = 0;i < JSCompiler_StaticMethods_processParam$self.paramAdapters.length;i++) {
      params = JSCompiler_StaticMethods_processParam(JSCompiler_StaticMethods_processParam$self.paramAdapters[i], params)
    }
  }
  return params
}
JSCompiler_prototypeAlias.getExtraParam = function() {
  return""
};
function er$ListAction() {
  this.form = JSCompiler_alias_NULL;
  this.model = new base$BaseModel({selectedItems:JSCompiler_alias_NULL, searchParams:JSCompiler_alias_NULL, listState:JSCompiler_alias_NULL});
  this.requesterBatch = this.requesterList = this.list = this.pnlBatch = JSCompiler_alias_NULL
}
baidu$inherits(er$ListAction, er$AbstractFormAction);
JSCompiler_prototypeAlias = er$ListAction.prototype;
JSCompiler_prototypeAlias.afterInit = function() {
  throw Error("Please implemented this method to initialize 'form', 'list', 'pnlBatch'");
};
JSCompiler_prototypeAlias.beforeRender = function() {
  this.list.datasource = new base$RemoteListDataSource(this.requesterList, baidu$fn$bind(this.getSearchParam, this))
};
JSCompiler_prototypeAlias.enterDocument = function() {
  this.form = this.formSearch || this.form;
  this.model.triggerPropertyChanged("selectedItems")
};
JSCompiler_prototypeAlias.initBehaviorInternal = JSCompiler_emptyFn();
JSCompiler_prototypeAlias.initBehavior = function(page) {
  er$ListAction.superClass.initBehavior.call(this, page);
  this.list.onstatechange = baidu$fn$bind(this.onListStateChanged, this);
  this.list.onlistselect = baidu$fn$bind(this.onListSelected, this);
  this.initBehaviorInternal();
  this.list.getData()
};
JSCompiler_prototypeAlias.onModelChanged = function(propertyName, newValue) {
  if(propertyName === "selectedItems") {
    if(!this.pnlBatch) {
      return
    }
    newValue && newValue.length ? this.pnlBatch._callChildren("enable") : this.pnlBatch._callChildren("disable")
  }
  if(propertyName === "listState" || propertyName === "searchParams") {
    this.list.getData(), JSCompiler_StaticMethods_saveSearchAndListState(this)
  }
};
function JSCompiler_StaticMethods_saveSearchAndListState(JSCompiler_StaticMethods_saveSearchAndListState$self) {
  var states = [], searchParams = JSCompiler_StaticMethods_saveSearchAndListState$self.model.get("searchParams"), listState = JSCompiler_StaticMethods_saveSearchAndListState$self.model.get("listState");
  searchParams && states.push(searchParams);
  listState && baidu$object$each(listState, function(value, key) {
    states.push(key + "=" + value)
  });
  JSCompiler_StaticMethods_saveSearchAndListState$self.saveState(states.join("&"))
}
JSCompiler_prototypeAlias.getSearchParam = function() {
  var searchParam = this.model.get("searchParams");
  if(!searchParam && this.form) {
    searchParam = JSCompiler_StaticMethods_getFinalParam(this, JSCompiler_StaticMethods_getParams(this.form)), this.model.searchParams = searchParam
  }
  return searchParam
};
JSCompiler_prototypeAlias.onListStateChanged = function(state) {
  this.model.set("listState", state)
};
JSCompiler_prototypeAlias.onListSelected = function(selectedItems) {
  this.model.set("selectedItems", selectedItems)
};
JSCompiler_prototypeAlias.doSubmit = function(params) {
  this.list.resetPageNo && this.list.resetPageNo();
  this.model.searchParams = params;
  this.model.triggerPropertyChanged("searchParams")
};
function JSCompiler_StaticMethods_batchUpdate(JSCompiler_StaticMethods_batchUpdate$self, opt_field, opt_value) {
  if(JSCompiler_StaticMethods_batchUpdate$self.requesterBatch) {
    var selectedItems = JSCompiler_StaticMethods_batchUpdate$self.model.get("selectedItems"), ids = [], params = [];
    baidu$array$each(selectedItems, function(item) {
      ids.push(item.id)
    });
    params.push("ids=" + ids.join(","));
    baidu$lang$hasValue(opt_field) && params.push(opt_field + "=" + opt_value);
    JSCompiler_StaticMethods_batchUpdate$self.requesterBatch(params.join("&"), function() {
      JSCompiler_StaticMethods_batchUpdate$self.list.getData()
    })
  }
}
JSCompiler_prototypeAlias.leave = function() {
  if(this.list) {
    this.list.onstatechange = JSCompiler_alias_NULL, this.list.onlistselect = JSCompiler_alias_NULL
  }
  this.list = this.pnlBatch = JSCompiler_alias_NULL;
  er$ListAction.superClass.leave.call(this)
};
function er$FormAction() {
  this.requester = this.btnCancel = this.btnSubmit = this.form = this.form = JSCompiler_alias_NULL
}
baidu$inherits(er$FormAction, er$AbstractFormAction);
JSCompiler_prototypeAlias = er$FormAction.prototype;
JSCompiler_prototypeAlias.initBehaviorInternal = JSCompiler_emptyFn();
JSCompiler_prototypeAlias.initBehavior = function(page) {
  er$FormAction.superClass.initBehavior.call(this, page);
  if(this.btnCancel) {
    this.btnCancel.onclick = baidu$fn$bind(this.onCancelClick, this)
  }
  this.initBehaviorInternal()
};
JSCompiler_prototypeAlias.enterDocument = function(page) {
  er$FormAction.superClass.enterDocument.call(this, page)
};
JSCompiler_prototypeAlias.onCancelClick = function() {
  this.back()
};
JSCompiler_prototypeAlias.onFormSubmit = function(params) {
  this.btnSubmit && this.btnSubmit.disable();
  er$FormAction.superClass.onFormSubmit.call(this, params)
};
JSCompiler_prototypeAlias.doSubmit = function(params) {
  this.requester && this.requester(params, baidu$fn$bind(this.onSubmitFinish, this), baidu$fn$bind(this.onSubmitFail, this))
};
JSCompiler_prototypeAlias.onSubmitFinish = function(data) {
  var controls = JSCompiler_StaticMethods_getInputControls(this.form), errorMap, control, errorMessage;
  this.btnSubmit && this.btnSubmit.enable();
  if(data.success !== "true") {
    if(errorMap = data.message.field) {
      if(baidu$lang$isArray(this.paramAdapters)) {
        for(data = this.paramAdapters.length - 1;data >= 0;data--) {
          this.paramAdapters[data].processObject(errorMap)
        }
      }
      for(data = 0;data < controls.length;data++) {
        control = controls[data], JSCompiler_StaticMethods_isDisabled(control) || (errorMessage = errorMap[control.formName]) && control.showError(errorMessage)
      }
      this.onSubmitFail()
    }
  }else {
    JSCompiler_StaticMethods_isModify(this) ? dn.notice("\u4fee\u6539\u6210\u529f") : dn.notice("\u65b0\u5efa\u6210\u529f"), this.back()
  }
};
JSCompiler_prototypeAlias.onSubmitFail = function() {
  this.btnSubmit && this.btnSubmit.enable()
};
function JSCompiler_StaticMethods_isModify(JSCompiler_StaticMethods_isModify$self) {
  return/update$/.test(JSCompiler_StaticMethods_isModify$self.argMap.path)
}
JSCompiler_prototypeAlias.leave = function() {
  if(this.btnCancel) {
    this.btnCancel.onclick = JSCompiler_alias_NULL
  }
  this.btnCancel = this.btnSubmit = JSCompiler_alias_NULL;
  er$FormAction.superClass.leave.call(this)
};
function ui$Link(options) {
  ui$Control.call(this, options);
  this.type = "link"
}
baidu$inherits(ui$Link, ui$Control);
goog$exportSymbol("ui.Link", ui$Link);
JSCompiler_prototypeAlias = ui$Link.prototype;
JSCompiler_prototypeAlias.render = function(opt_main) {
  ui$Link.superClass.render.call(this, opt_main || this.main);
  if(this.main && this.href) {
    this.main.href = this.href
  }
  if(this.main && this.text) {
    this.main.innerHTML = this.text
  }
  this.main.onclick = baidu$fn$bind(this.clickHandler, this)
};
JSCompiler_prototypeAlias.appendTo = function(wrap) {
  var main = document.createElement("span");
  wrap.appendChild(main);
  this.main = main
};
JSCompiler_prototypeAlias.onclick = baidu.fn.blank;
JSCompiler_prototypeAlias.clickHandler = function(e) {
  e = e || window.event;
  if(!1 === this.onclick(e)) {
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0, baidu$event$preventDefault(e)
  }
};
JSCompiler_prototypeAlias.dispose = function() {
  this.onclick = this.main.onclick = JSCompiler_alias_NULL;
  ui$Link.superClass.dispose.call(this)
};
function ui$TextInput(options) {
  ui$Control.call(this, options);
  this.form = 1;
  this.value = baidu$decodeHTML(this.value === 0 ? 0 : this.value || "")
}
baidu$inherits(ui$TextInput, ui$InputControl);
goog$exportSymbol("ui.TextInput", ui$TextInput);
JSCompiler_prototypeAlias = ui$TextInput.prototype;
JSCompiler_prototypeAlias.getValue = function() {
  return this.main.value
};
JSCompiler_prototypeAlias.setValue = function(value) {
  this.main.value = baidu$decodeHTML(value);
  value ? this._focusHandler() : this._blurHandler()
};
JSCompiler_prototypeAlias.setTitle = function(title) {
  this.main.setAttribute("title", title)
};
JSCompiler_prototypeAlias.disable = function() {
  ui$TextInput.superClass.disable.call(this);
  this.main.disabled = "disabled"
};
JSCompiler_prototypeAlias.enable = function() {
  ui$TextInput.superClass.enable.call(this);
  this.main.removeAttribute("disabled")
};
JSCompiler_prototypeAlias.setReadOnly = function(readOnly) {
  ui$TextInput.superClass.setReadOnly.call(this, readOnly);
  this.main.readOnly = readOnly
};
JSCompiler_prototypeAlias.render = function(opt_main) {
  var opt_main = opt_main || this.main, tagName = opt_main.tagName, inputType = opt_main.getAttribute("type");
  if(tagName == "INPUT" && (inputType == "text" || inputType == "password") || tagName == "TEXTAREA") {
    this.type = tagName == "INPUT" ? "text" : "textarea";
    ui$TextInput.superClass.render.call(this, opt_main);
    if(this.width) {
      opt_main.style.width = this.width + "px"
    }
    if(this.height) {
      opt_main.style.height = this.height + "px"
    }
    opt_main.onkeypress = JSCompiler_StaticMethods_getPressHandler(this);
    tagName = JSCompiler_StaticMethods_getChangeHandler(this);
    baidu$ie ? opt_main.onpropertychange = tagName : baidu$on(opt_main, "input", tagName);
    this.changeHandler = tagName;
    this.setReadOnly(!!this.readOnly);
    opt_main.onfocus = baidu$fn$bind(this._focusHandler, this);
    opt_main.onblur = baidu$fn$bind(this._blurHandler, this)
  }
  !this.value && this.virtualValue ? (this.main.value = this.virtualValue, baidu$addClass(this.main, JSCompiler_StaticMethods_getClass(this, "virtual"))) : this.main.value = this.value
};
JSCompiler_prototypeAlias._focusHandler = function() {
  var virtualValue = this.virtualValue, main = this.main;
  baidu$removeClass(main, JSCompiler_StaticMethods_getClass(this, "virtual"));
  (virtualValue && this.getValue() == virtualValue || this.autoSelect) && setTimeout(function() {
    main.select()
  }, 0)
};
JSCompiler_prototypeAlias._blurHandler = function() {
  var virtualValue = this.virtualValue, main = this.main, value = this.getValue();
  if(virtualValue && (value == "" || value == virtualValue)) {
    main.value = virtualValue, baidu$addClass(main, JSCompiler_StaticMethods_getClass(this, "virtual"))
  }
};
function JSCompiler_StaticMethods_getPressHandler(JSCompiler_StaticMethods_getPressHandler$self) {
  return function(e) {
    e = e || window.event;
    if((e.keyCode || e.which) == 13) {
      return JSCompiler_StaticMethods_getPressHandler$self.onenter()
    }
  }
}
JSCompiler_prototypeAlias.onenter = baidu.fn.blank;
function JSCompiler_StaticMethods_getChangeHandler(JSCompiler_StaticMethods_getChangeHandler$self) {
  return function() {
    if(baidu$ie) {
      if(window.event.propertyName == "value") {
        JSCompiler_StaticMethods_getChangeHandler$self.onchange()
      }
    }else {
      JSCompiler_StaticMethods_getChangeHandler$self.onchange()
    }
  }
}
JSCompiler_prototypeAlias.onchange = baidu.fn.blank;
JSCompiler_prototypeAlias.dispose = function() {
  var main = this.main;
  main.onkeypress = JSCompiler_alias_NULL;
  main.onchange = JSCompiler_alias_NULL;
  main.onpropertychange = JSCompiler_alias_NULL;
  main.onfocus = JSCompiler_alias_NULL;
  main.onblur = JSCompiler_alias_NULL;
  baidu$un(main, "input", this.changeHandler);
  this.changeHandler = JSCompiler_alias_NULL;
  ui$TextInput.superClass.dispose.call(this)
};
function ui$BaseBox(options) {
  ui$Control.call(this, options)
}
baidu$inherits(ui$BaseBox, ui$InputControl);
JSCompiler_prototypeAlias = ui$BaseBox.prototype;
JSCompiler_prototypeAlias.onclick = baidu.fn.blank;
JSCompiler_prototypeAlias.disable = function() {
  ui$BaseBox.superClass.disable.call(this);
  this.main.disabled = "disabled"
};
JSCompiler_prototypeAlias.enable = function() {
  ui$BaseBox.superClass.enable.call(this);
  this.main.removeAttribute("disabled")
};
JSCompiler_prototypeAlias.setReadOnly = function(readOnly) {
  ui$BaseBox.superClass.setReadOnly.call(this, readOnly);
  this.main.disabled = readOnly
};
JSCompiler_prototypeAlias.setValue = function(value) {
  this.getDOM().setAttribute("value", value)
};
JSCompiler_prototypeAlias.getValue = function() {
  return this.getDOM().getAttribute("value")
};
JSCompiler_prototypeAlias.getDOM = function() {
  return baidu$g(this.domId)
};
JSCompiler_prototypeAlias.render = function(opt_main) {
  var main = opt_main || this.main, opt_main = this.datasource, dataType = typeof opt_main, label;
  if(!this.isRender) {
    if(!main || main.tagName != this.wrapTag || main.getAttribute("type") != this.wrapType) {
      return
    }
    if(!this.formName) {
      this.formName = main.getAttribute("name")
    }
    if(main.title) {
      label = document.createElement("label");
      label.innerHTML = main.title;
      label.className = JSCompiler_StaticMethods_getClass(this, "label");
      baidu$setAttr(label, "for", JSCompiler_StaticMethods_getId(this));
      var existElement = main, g;
      g = baidu$dom$g;
      label = g(label);
      existElement = g(existElement);
      (g = existElement.parentNode) && g.insertBefore(label, existElement.nextSibling)
    }
    ui$BaseBox.superClass.render.call(this, main);
    main.disabled = !!this.disabled;
    main.onclick = JSCompiler_StaticMethods__getHandlerClick(this)
  }
  if(this.main) {
    main = this.getValue();
    if(dataType == "string" || dataType == "number") {
      opt_main = opt_main == main, this.getDOM().checked = !!opt_main
    }else {
      if(baidu$lang$isArray(opt_main)) {
        opt_main = baidu$array$indexOf(opt_main, main) >= 0, this.getDOM().checked = !!opt_main
      }
    }
    this.isRender = !0
  }
};
function JSCompiler_StaticMethods__getHandlerClick(JSCompiler_StaticMethods__getHandlerClick$self) {
  return function() {
    JSCompiler_StaticMethods_getState(JSCompiler_StaticMethods__getHandlerClick$self, "readonly") || (JSCompiler_StaticMethods__getHandlerClick$self.trigger("click"), JSCompiler_StaticMethods__getHandlerClick$self.onclick())
  }
}
JSCompiler_prototypeAlias.dispose = function() {
  if(this.main) {
    this.main.onclick = JSCompiler_alias_NULL
  }
  ui$BaseBox.superClass.dispose.call(this)
};
function ui$Form(options) {
  ui$Control.call(this, options)
}
baidu$inherits(ui$Form, ui$Control);
goog$exportSymbol("ui.Form", ui$Form);
function ui$Form$CollectInputControls(control, inputControls) {
  if(control instanceof ui$InputControl) {
    inputControls.push(control)
  }else {
    if(control.children) {
      for(var i = 0;i < control.children.length;i++) {
        ui$Form$CollectInputControls(control.children[i], inputControls)
      }
    }
  }
}
ui$Form.prototype.onsubmit = baidu.fn.blank;
function JSCompiler_StaticMethods_getInputControls(JSCompiler_StaticMethods_getInputControls$self) {
  if(!JSCompiler_StaticMethods_getInputControls$self.inputControls) {
    JSCompiler_StaticMethods_getInputControls$self.inputControls = [], ui$Form$CollectInputControls(JSCompiler_StaticMethods_getInputControls$self, JSCompiler_StaticMethods_getInputControls$self.inputControls)
  }
  return JSCompiler_StaticMethods_getInputControls$self.inputControls
}
ui$Form.prototype.validate = function() {
  for(var inputControls = JSCompiler_StaticMethods_getInputControls(this), result = !0, i = 0;i < inputControls.length;i++) {
    !JSCompiler_StaticMethods_isDisabled(inputControls[i]) && !JSCompiler_StaticMethods_getState(inputControls[i], "readonly") && (result &= inputControls[i].validate())
  }
  return!!result
};
function JSCompiler_StaticMethods_getParams(JSCompiler_StaticMethods_getParams$self) {
  var a;
  for(var JSCompiler_StaticMethods_getParams$self = JSCompiler_StaticMethods_getInputControls(JSCompiler_StaticMethods_getParams$self), params = [], control, key, value, group = {}, i = 0;i < JSCompiler_StaticMethods_getParams$self.length;i++) {
    if(control = JSCompiler_StaticMethods_getParams$self[i], !(JSCompiler_StaticMethods_isDisabled(control) || control instanceof ui$BaseBox && !control.getDOM().checked)) {
      if(control.formName) {
        key = control.formName;
        value = control;
        var value$$0 = value.getValue();
        a = value.converter ? value$$0 = value.converter.convert(value$$0) : encodeURIComponent(value$$0), value = a;
        control.group ? (group[key] || (group[key] = []), group[key].push(value)) : params.push(key + "=" + value)
      }else {
        control.getParamString && params.push(control.getParamString())
      }
    }
  }
  for(key in group) {
    params.push(key + "=" + group[key].join(","))
  }
  return params.join("&")
}
ui$Form.prototype.submit = function() {
  this.onsubmit(JSCompiler_StaticMethods_getParams(this))
};
function ui$ComboBox(options) {
  this.datasource = [];
  ui$Control.call(this, options);
  this.type = "combobox";
  this.form = 1;
  this.emptyLabel = '<div class="' + JSCompiler_StaticMethods_getClass(this, "cur-def") + '">\u8bf7\u9009\u62e9</div>';
  this.offsetSize = "-10000px";
  this.options = this.datasource;
  this.index = -1;
  this.maxItem = 10
}
goog$exportSymbol("ui.ComboBox", ui$ComboBox);
ui$ComboBox.prototype = {tplMain:'<div id="{0}" class="{1}" value="" style="width:{4}px"><nobr>{2}</nobr></div><div class="{3}"></div>', onselect:new Function, getMainHtml:function() {
  var textWidth = this.width - 20;
  this.skin == "select-menu" && (textWidth -= 10);
  return baidu$format(this.tplMain, JSCompiler_StaticMethods_getId(this, "cur"), JSCompiler_StaticMethods_getClass(this, "cur"), this.emptyLabel, JSCompiler_StaticMethods_getClass(this, "btn"), textWidth)
}, bindModel:function(model) {
  ui$ComboBox.superClass.bindModel.call(this, model);
  this.options = this.datasource || []
}, render:function(opt_main) {
  opt_main = opt_main || this.main;
  this.main.style.width = this.width + "px";
  this.main.innerHTML = this.getMainHtml();
  this.renderLayer();
  this.setReadOnly(!!this.readOnly);
  baidu$lang$hasValue(this.value) ? this.setValue(this.value) : this.defaultFirst && this.selectByIndex(0);
  ui$ComboBox.superClass.render.call(this, opt_main)
}, renderLayer:function() {
  var layer, len = this.options.length, maxItem = this.maxItem;
  layer = baidu$g(JSCompiler_StaticMethods_getId(this, "layer"));
  if(!layer) {
    layer = document.createElement("div"), layer.id = JSCompiler_StaticMethods_getId(this, "layer"), layer.className = JSCompiler_StaticMethods_getClass(this, "layer"), layer.style.top = this.offsetSize, layer.style.left = this.offsetSize, layer.style.width = this.width + "px", layer.setAttribute("control", this.id), document.body.appendChild(layer), this.layerController = this.getLayerController(), baidu$on(document, "click", this.layerController)
  }
  layer.innerHTML = this.getLayerHtml();
  if(len > maxItem) {
    var element;
    element = baidu$dom$g(layer);
    len = [];
    for(element = element.firstChild;element;element = element.nextSibling) {
      element.nodeType == 1 && len.push(element)
    }
    len = len[0].offsetHeight;
    layer.style.height = maxItem * (len + 1) + "px"
  }
}, tplItem:'<div id="{0}" {9} class="{1}" index="{2}" value="{3}" dis="{4}" cmd="select" onmouseover="{6}" onmouseout="{7}" style="width:{10}px">{8}<nobr>{5}</nobr></div>', tplIcon:'<span class="{0}"></span>', getLayerHtml:function() {
  for(var options = this.options, i = 0, len = options.length, html = [], basicClass = JSCompiler_StaticMethods_getClass(this, "item"), itemClass, dis, item, strRef = JSCompiler_StaticMethods_getStrRef(this), iconClass, titleTip;i < len;i++) {
    itemClass = basicClass;
    dis = 0;
    item = options[i];
    iconClass = "";
    item.icon && (iconClass = JSCompiler_StaticMethods_getClass(this, "icon-" + item.icon), iconClass = baidu$format(this.tplIcon, iconClass));
    item.style && (itemClass += " " + basicClass + "-" + item.style);
    item.disabled && (dis = 1, itemClass += " " + basicClass + "-disabled");
    item.value == this.value && (itemClass += " " + JSCompiler_StaticMethods_getClass(this, "item-selected"));
    this.titleTip && (titleTip = 'title="' + item.text + iconClass + '"');
    var itemWidth = this.width;
    this.skin == "select-menu" ? itemWidth -= 16 : this.skin == "select-button" && (itemWidth -= 10);
    html.push(baidu$format(this.tplItem, JSCompiler_StaticMethods_getId(this, "item") + i, itemClass, i, item.value, dis, item.text, strRef + ".itemOverHandler(this)", strRef + ".itemOutHandler(this)", iconClass, titleTip, itemWidth))
  }
  return html.join("")
}, getLayerController:function() {
  var me = this;
  return function(e) {
    if(!JSCompiler_StaticMethods_getState(me, "disabled")) {
      e = e || window.event;
      for(e = e.target || e.srcElement;e && e.nodeType === 1;) {
        var val = e.getAttribute("control"), index = e.getAttribute("index"), tarId = JSCompiler_StaticMethods_getId(me, "item") + index;
        if(e.getAttribute("cmd") == "select" && tarId == e.id) {
          e.getAttribute("dis") == 1 ? me.disabledItemTipId && (baidu$show(me.disabledItemTipId), window.setTimeout(function() {
            baidu$hide(me.disabledItemTipId)
          }, 3E3)) : (me.hideLayer(), me.selectByIndex(parseInt(index, 10), !0));
          return
        }else {
          if(val == me.id) {
            !me.readOnly && e.id == JSCompiler_StaticMethods_getId(me) && me.toggleLayer();
            return
          }
        }
        e = e.parentNode
      }
      me.hideLayer()
    }
  }
}, showLayer:function() {
  var main = this.main, mainPos = baidu$dom$getPosition(main), layer = this.getLayer(), main = baidu$page$getViewHeight() > mainPos.top + main.offsetHeight + layer.offsetHeight - baidu$page$getScrollTop() ? mainPos.top + main.offsetHeight : mainPos.top - layer.offsetHeight;
  if(layer) {
    layer.style.top = main + "px", layer.style.left = mainPos.left + "px"
  }
  JSCompiler_StaticMethods_setState(this, "active")
}, hideLayer:function() {
  var layer = this.getLayer();
  if(layer) {
    layer.style.left = this.offsetSize, layer.style.top = this.offsetSize
  }
  JSCompiler_StaticMethods_removeState(this, "active")
}, toggleLayer:function() {
  this.getLayer().style.left != this.offsetSize ? this.hideLayer() : this.showLayer()
}, getLayer:function() {
  return baidu$G(JSCompiler_StaticMethods_getId(this, "layer"))
}, getCur:function() {
  return baidu$G(JSCompiler_StaticMethods_getId(this, "cur"))
}, getValue:function() {
  if(JSCompiler_alias_NULL == this.main) {
    return""
  }
  return this.value || ""
}, setValue:function(value) {
  for(var items = this.getLayer().getElementsByTagName("div"), len = items.length, i = 0, item, i = 0, len = items.length;i < len;i++) {
    if(item = items[i].getAttribute("value"), item == value) {
      this.selectByIndex(i);
      return
    }
  }
  this.value = "";
  this.index = -1;
  this.selectByIndex(-1)
}, selectByIndex:function(index, isDispatch) {
  var selected = this.options[index], value;
  value = selected ? selected.value : JSCompiler_alias_NULL;
  this.index = index;
  this.value = value;
  isDispatch === !0 && this.onselect(value, selected) === !1 || this.repaint()
}, repaint:function() {
  var selected = this.options[this.index], selected = selected ? selected.text : this.emptyLabel, el = this.getCur();
  if(el) {
    el.title = String(selected || "").replace(/<[^>]+>/g, ""), el.innerHTML = "<nobr>" + selected + "</nobr>"
  }
  this.repaintLayer()
}, repaintLayer:function() {
  var index = this.index, layer = this.getLayer(), first = JSCompiler_alias_NULL, selectedClass = JSCompiler_StaticMethods_getClass(this, "item-selected");
  if(layer) {
    for(first = layer.firstChild;first;) {
      first.getAttribute("index") == index ? baidu$addClass(first, selectedClass) : baidu$removeClass(first, selectedClass), first = first.nextSibling
    }
  }
}, disable:function() {
  ui$ComboBox.superClass.disable.call(this);
  this.hideLayer()
}, dispose:function() {
  this.layerController && baidu$un(document, "click", this.layerController);
  document.body.removeChild(this.getLayer());
  ui$ComboBox.superClass.dispose.call(this)
}};
ui$ComboBox.prototype.itemOverHandler = function(item) {
  item.getAttribute("dis") != 1 && (item = item.getAttribute("index"), baidu$addClass(JSCompiler_StaticMethods_getId(this, "item") + item, JSCompiler_StaticMethods_getClass(this, "item") + "-hover"))
};
ui$ComboBox.prototype.itemOverHandler = ui$ComboBox.prototype.itemOverHandler;
ui$ComboBox.prototype.itemOutHandler = function(item) {
  item = item.getAttribute("index");
  baidu$removeClass(JSCompiler_StaticMethods_getId(this, "item") + item, JSCompiler_StaticMethods_getClass(this, "item") + "-hover")
};
baidu$inherits(ui$ComboBox, ui$InputControl);
ui$ComboBox.prototype.itemOutHandler = ui$ComboBox.prototype.itemOutHandler;
function ui$SubmitButton(options) {
  ui$Button.call(this, options)
}
baidu$inherits(ui$SubmitButton, ui$Button);
goog$exportSymbol("ui.SubmitButton", ui$SubmitButton);
ui$SubmitButton.prototype.onclick = function() {
  for(var form, p = this.parent;p;) {
    if(p instanceof ui$Form) {
      form = p;
      break
    }
    p = p.parent
  }
  form && form.validate() && form.submit()
};
function ui$Panel(options) {
  ui$Control.call(this, options)
}
baidu$inherits(ui$Panel, ui$Control);
goog$exportSymbol("ui.Panel", ui$Panel);
function ui$ListInfo(options) {
  ui$Control.call(this, options);
  this.type = "listInfo";
  this.autoState = !1
}
goog$exportSymbol("ui.ListInfo", ui$ListInfo);
ui$ListInfo.prototype = {render:function(main) {
  ui$ListInfo.superClass.render.call(this, main);
  if(this.main) {
    this.main.innerHTML = this.getHtml()
  }
}, getHtml:function() {
  var start = this.start, end = this.end;
  if(!baidu$lang$hasValue(this.start)) {
    return""
  }
  if(start <= 0 || end <= 0) {
    this.total = end = start = 0
  }
  return baidu$format(this.tpl, start, end, this.total)
}, tpl:"{0}&nbsp;-&nbsp;{1}\u6761\uff08\u5171{2}\u6761\uff09"};
baidu$inherits(ui$ListInfo, ui$Control);
function ui$Pager(options) {
  ui$Control.call(this, options);
  this.type = "pager";
  this.autoState = !1;
  this.prevWord = this.prevWord || "&lt;&nbsp;\u4e0a\u4e00\u9875";
  this.nextWord = this.nextWord || "\u4e0b\u4e00\u9875&nbsp;&gt;";
  this.omitWord = this.omitWord || "...";
  this.showCount = parseInt(this.showCount, 10) || 5;
  this.total = 0;
  this.page = 1
}
goog$exportSymbol("ui.Pager", ui$Pager);
ui$Pager.prototype = {getPage:function() {
  return this.page + 1
}, render:function(main) {
  ui$Pager.superClass.render.call(this, main);
  this.total = parseInt(this.total, 10) || 0;
  this.page = parseInt(this.page, 10) || 1;
  this.renderPages()
}, tplMain:"<ul>{0}</ul>", tplItem:'<li onmouseover="{3}" onmouseout="{4}"><span class="{0}" onclick="{1}">{2}</span></li>', tplInfo:'<li><span class="{0}">{1}</span></li>', renderPages:function() {
  var html = [], total = this.total, last = total - 1, page = this.page - 1, itemClass = JSCompiler_StaticMethods_getClass(this, "item"), disClass = JSCompiler_StaticMethods_getClass(this, "disabled"), omitWord = baidu$format(this.tplInfo, JSCompiler_StaticMethods_getClass(this, "omit"), this.omitWord), i, begin;
  if(total <= 0) {
    this.main.innerHTML = ""
  }else {
    begin = page < this.showCount - 1 ? 0 : page > total - this.showCount ? total - this.showCount : page - Math.floor(this.showCount / 2);
    begin < 0 && (begin = 0);
    page > 0 ? html.push(this.getItemHtml(JSCompiler_StaticMethods_getClass(this, "prev"), this.getStrCall("select", page - 1), this.prevWord)) : html.push(baidu$format(this.tplInfo, disClass, this.prevWord));
    begin > 0 && html.push(this.getItemHtml(JSCompiler_StaticMethods_getClass(this, "prev"), this.getStrCall("select", 0), 1), omitWord);
    for(i = 0;i < this.showCount && begin + i < total;i++) {
      begin + i != page ? html.push(this.getItemHtml(itemClass, this.getStrCall("select", begin + i), 1 + begin + i)) : html.push(baidu$format(this.tplInfo, JSCompiler_StaticMethods_getClass(this, "selected"), 1 + begin + i))
    }
    begin < total - this.showCount && html.push(omitWord, this.getItemHtml(itemClass, this.getStrCall("select", last), total));
    page < last ? html.push(this.getItemHtml(JSCompiler_StaticMethods_getClass(this, "next"), this.getStrCall("select", page + 1), this.nextWord)) : html.push(baidu$format(this.tplInfo, disClass, this.nextWord));
    this.main.innerHTML = baidu$format(this.tplMain, html.join(""))
  }
}, getItemHtml:function(sClass, sClick, sText) {
  var strRef = JSCompiler_StaticMethods_getStrRef(this);
  return baidu$format(this.tplItem, sClass, sClick, sText, strRef + ".itemOverHandler(this)", strRef + ".itemOutHandler(this)")
}, onselect:new Function, select:function(page) {
  page++;
  if(this.onselect(page) !== !1) {
    this.page = page, this.renderPages()
  }
}};
ui$Pager.prototype.itemOverHandler = function(item) {
  baidu$addClass(item, JSCompiler_StaticMethods_getClass(this, "hover"))
};
ui$Pager.prototype.itemOverHandler = ui$Pager.prototype.itemOverHandler;
ui$Pager.prototype.itemOutHandler = function(item) {
  baidu$removeClass(item, JSCompiler_StaticMethods_getClass(this, "hover"))
};
baidu$inherits(ui$Pager, ui$Control);
ui$Pager.prototype.itemOutHandler = ui$Pager.prototype.itemOutHandler;
function ui$ToolTip$preventHide() {
  ui$ToolTip$hideTimeout && (clearTimeout(ui$ToolTip$hideTimeout), ui$ToolTip$hideTimeout = 0)
}
var ui$ToolTip$hideTimeout = 0;
function ui$ToolTip$hide() {
  ui$ToolTip$hideTimeout = setTimeout(function() {
    var layer = baidu$g("ToolTipLayer");
    layer.style.left = "-10000px";
    layer.style.top = "-10000px"
  }, 200)
}
baidu$on(window, "load", function() {
  var layer = document.createElement("dl"), title = document.createElement("dt"), body = document.createElement("dd");
  layer.id = "ToolTipLayer";
  layer.className = "ui-tooltip-layer";
  title.id = "ToolTipLayerTitle";
  layer.appendChild(title);
  body.id = "ToolTipLayerBody";
  layer.appendChild(body);
  layer.onmouseover = ui$ToolTip$preventHide;
  layer.onmouseout = ui$ToolTip$hide;
  document.body.appendChild(layer)
});
function ui$Table(options) {
  this.datasource = JSCompiler_alias_NULL;
  this.type = "table";
  this.noDataHtml = this.noDataHtml || "";
  this.fields = JSCompiler_alias_NULL;
  this.noTitle = !1;
  this.width = 0;
  ui$Control.call(this, options)
}
goog$exportSymbol("ui.Table", ui$Table);
ui$Table.prototype = {subEntryTipOpen:"\u70b9\u51fb\u5c55\u5f00", subEntryTipClose:"\u70b9\u51fb\u6536\u8d77", tplTablePrefix:'<table cellpadding="0" cellspacing="0" border="0" width="{0}" control="{1}">', init:function() {
  ui$Table.superClass.init.call(this);
  this.setFields(this.fields)
}, render:function(main) {
  main = this.main = main || this.main;
  ui$Table.superClass.render.call(this, main);
  if(this._fields) {
    if(this.select === "multi") {
      this.selection = []
    }
    this.subrowIndex = JSCompiler_alias_NULL;
    this._width = this.getWidth();
    this.initColsWidth();
    main.style.width = this._width + "px";
    this.renderHead();
    this.renderBody();
    if(this.isRendered) {
      if(this.select && (!this.dontOnSelect || this.dontOnSelect == !1)) {
        this.onselect(this.selection)
      }
    }else {
      this.initResizeHandler()
    }
    this.isRendered = !0
  }
}, initColsWidth:function() {
  var canExpand = [], leaveAverage, leftWidth;
  leaveAverage = this._fields;
  var field, len = leaveAverage.length, width, i;
  this.colsWidth = [];
  leftWidth = this._width - len - 2;
  for(i = 0;i < len;i++) {
    field = leaveAverage[i], width = parseInt(field.width, 10), leftWidth -= width, this.colsWidth.push(width), field.stable || canExpand.push(i)
  }
  len = canExpand.length;
  leaveAverage = Math.round(leftWidth / len);
  for(i = 0;i < len;i++) {
    field = Math.abs(leftWidth) > Math.abs(leaveAverage) ? leaveAverage : leftWidth, leftWidth -= field, this.colsWidth[canExpand[i]] += field
  }
}, getWidth:function() {
  if(this.width) {
    return this.width
  }
  var width, rulerDiv = document.createElement("div"), parent = this.main.parentNode;
  parent.appendChild(rulerDiv);
  width = rulerDiv.offsetWidth;
  parent.removeChild(rulerDiv);
  return width
}, initResizeHandler:function() {
  var me = this;
  me.viewWidth = baidu$page$getViewWidth();
  me.viewHeight = baidu$page$getViewHeight();
  me.resizeHandler = function() {
    var viewWidth = baidu$page$getViewWidth(), viewHeight = baidu$page$getViewHeight();
    if(!(viewWidth == me.viewWidth && viewHeight == me.viewHeight)) {
      me.viewWidth = viewWidth, me.viewHeight = viewHeight, me.handleResize()
    }
  };
  baidu$on(window, "resize", me.resizeHandler)
}, handleResize:function() {
  var head = baidu$g(JSCompiler_StaticMethods_getId(this, "head"));
  this._width = this.getWidth();
  this.main.style.width = this._width + "px";
  if(baidu$g(JSCompiler_StaticMethods_getId(this, "body"))) {
    baidu$g(JSCompiler_StaticMethods_getId(this, "body")).style.width = this._width + "px", head && (head.style.width = this._width + "px"), this.initColsWidth(), this.resetColumns()
  }
}, checkboxField:{width:30, stable:!0, select:!0, title:function() {
  return'<input type="checkbox" id="' + JSCompiler_StaticMethods_getId(this, "selectAll") + '" onclick="' + this.getStrCall("toggleSelectAll") + '">'
}, content:function(item, index) {
  var selected = !1;
  if(this.valueField && baidu$lang$isArray(this.selectedValue)) {
    for(var i = 0;i < this.selectedValue.length;i++) {
      if(item[this.valueField] === this.selectedValue[i]) {
        this.selection.push(item);
        selected = !0;
        break
      }
    }
  }
  return'<input type="checkbox" id="' + JSCompiler_StaticMethods_getId(this, "multiSelect") + index + '" onclick="' + this.getStrCall("rowCheckboxClick", index) + '"' + (selected ? 'checked="checked"' : "") + ">"
}}, radioboxField:{width:30, stable:!0, title:"&nbsp;", select:!0, content:function(item, index) {
  var id = JSCompiler_StaticMethods_getId(this, "singleSelect"), selected = !1;
  if(this.valueField && item[this.valueField] === this.selectedValue) {
    this.selection = item, selected = !0
  }
  return'<input type="radio" id="' + id + index + '" name=' + id + ' onclick="' + this.getStrCall("selectSingle", index) + '"' + (selected ? 'checked="checked"' : "") + ">"
}}, setFields:function(fields) {
  if(fields) {
    for(var fields = fields.slice(0), len = fields.length;len--;) {
      fields[len] || fields.splice(len, 1)
    }
    this._fields = fields;
    if(this.select) {
      switch(this.select.toLowerCase()) {
        case "multi":
          fields.unshift(this.checkboxField);
          break;
        case "single":
          fields.unshift(this.radioboxField)
      }
    }
  }
}, getBody:function() {
  return baidu$g(JSCompiler_StaticMethods_getId(this, "body"))
}, getHeadCheckbox:function() {
  return baidu$g(JSCompiler_StaticMethods_getId(this, "selectAll"))
}, onselect:new Function, selectMulti:function(index) {
  for(var inputs = this.getBody().getElementsByTagName("input"), i = 0, currentIndex = 0, allChecked = this, len = inputs.length, selectAll = this.getHeadCheckbox(), selected = [], selectedClass = JSCompiler_StaticMethods_getClass(this, "row-selected"), cbIdPrefix = JSCompiler_StaticMethods_getId(this, "multiSelect"), input, inputId, row, updateAll = !baidu$lang$hasValue(index);i < len;i++) {
    if(input = inputs[i], inputId = input.id, input.getAttribute("type") == "checkbox" && inputId && inputId.indexOf(cbIdPrefix) >= 0) {
      if(updateAll) {
        for(row = input.parentNode;;) {
          if(row.tagName == "DIV" && /^ui-table-row/.test(row.className)) {
            break
          }
          row = row.parentNode
        }
      }
      input.checked ? (selected.push(this.datasource[currentIndex]), updateAll && baidu$addClass(row, selectedClass)) : (allChecked = !1, updateAll && baidu$removeClass(row, selectedClass));
      currentIndex++
    }
  }
  this.selection = selected;
  this.onselect(this.selection);
  updateAll || (row = this.getRow(index), input = baidu$g(cbIdPrefix + index), input.checked ? baidu$addClass(row, selectedClass) : baidu$removeClass(row, selectedClass));
  selectAll.checked = allChecked
}, selectAll:function(checked) {
  for(var inputs = this.getBody().getElementsByTagName("input"), len = inputs.length, i = 0, index = 0, selected = [], selectedClass = JSCompiler_StaticMethods_getClass(this, "row-selected"), input, inputId;i < len;i++) {
    if(input = inputs[i], inputId = input.id, input.getAttribute("type") == "checkbox" && inputId && inputId.indexOf("multiSelect") > 0) {
      (inputs[i].checked = checked) ? (selected.push(this.datasource[index]), baidu$addClass(this.getRow(index), selectedClass)) : baidu$removeClass(this.getRow(index), selectedClass), index++
    }
  }
  this.selection = selected;
  this.onselect(this.selection)
}, renderHead:function() {
  var head = baidu$g(JSCompiler_StaticMethods_getId(this, "head"));
  if(!this.noTitle) {
    if(!head) {
      head = document.createElement("div");
      head.id = JSCompiler_StaticMethods_getId(this, "head");
      head.className = JSCompiler_StaticMethods_getClass(this, "head");
      head.setAttribute("control", this.id);
      if(this.dragable) {
        head.onmousemove = this.getHeadMoveHandler(), head.onmousedown = this.getDragStartHandler()
      }
      this.main.appendChild(head)
    }
    head.style.width = this._width + "px";
    head.innerHTML = this.getHeadHtml()
  }
}, getHeadMoveHandler:function() {
  var me = this, dragClass = JSCompiler_StaticMethods_getClass(me, "startdrag");
  return function(e) {
    if(!me.isDraging) {
      var e = e || window.event, tar = e.srcElement || e.target, e = e.pageX || e.clientX + baidu$page$getScrollLeft(), pos, sortable;
      if(tar = me.findDragCell(tar)) {
        pos = baidu$dom$getPosition(tar), tar.getAttribute("index"), sortable = tar.getAttribute("sortable"), tar.getAttribute("dragleft") && e - pos.left < 8 ? (sortable && me.titleOutHandler(tar), baidu$addClass(this, dragClass), me.dragPoint = "left", me.dragReady = 1) : tar.getAttribute("dragright") && pos.left + tar.offsetWidth - e < 8 ? (sortable && me.titleOutHandler(tar), baidu$addClass(this, dragClass), me.dragPoint = "right", me.dragReady = 1) : (baidu$removeClass(this, dragClass), sortable && 
        me.titleOverHandler(tar), me.dragPoint = "", me.dragReady = 0)
      }
    }
  }
}, findDragCell:function(target) {
  for(;target.nodeType == 1;) {
    if(target.tagName == "TH") {
      return target
    }
    target = target.parentNode
  }
  return JSCompiler_alias_NULL
}, getDragStartHandler:function() {
  var me = this, dragClass = JSCompiler_StaticMethods_getClass(me, "startdrag");
  return function(e) {
    if(!(baidu$g(JSCompiler_StaticMethods_getId(me, "head")).className.indexOf(dragClass) < 0)) {
      var e = e || window.event, tar = e.target || e.srcElement;
      if(tar = me.findDragCell(tar)) {
        return me.htmlHeight = document.documentElement.clientHeight, me.isDraging = !0, me.dragIndex = tar.getAttribute("index"), me.dragStart = e.pageX || e.clientX + baidu$page$getScrollLeft(), document.onmousemove = me.getDragingHandler(), document.onmouseup = me.getDragEndHandler(), me.showDragMark(me.dragStart), baidu$event$preventDefault(e), !1
      }
    }
  }
}, getDragingHandler:function() {
  var me = this;
  return function(e) {
    e = e || window.event;
    me.showDragMark(e.pageX || e.clientX + baidu$page$getScrollLeft());
    baidu$event$preventDefault(e);
    return!1
  }
}, showDragMark:function(left) {
  var mark = this.getDragMark();
  if(!this.top) {
    this.top = baidu$dom$getPosition(this.main).top
  }
  mark || (mark = this.createDragMark());
  mark.style.top = this.top + "px";
  mark.style.left = left + "px";
  mark.style.height = this.htmlHeight - this.top + baidu$page$getScrollTop() + "px"
}, hideDragMark:function() {
  var mark = this.getDragMark();
  mark.style.left = "-10000px";
  mark.style.top = "-10000px"
}, createDragMark:function() {
  var mark = document.createElement("div");
  mark.id = JSCompiler_StaticMethods_getId(this, "dragMark");
  mark.className = JSCompiler_StaticMethods_getClass(this, "mark");
  mark.style.top = "-10000px";
  mark.style.left = "-10000px";
  document.body.appendChild(mark);
  return mark
}, getDragMark:function() {
  return baidu$g(JSCompiler_StaticMethods_getId(this, "dragMark"))
}, getDragEndHandler:function() {
  var me = this;
  return function(e) {
    var e = e || window.event, index = parseInt(me.dragIndex, 10), pageX = e.pageX || e.clientX + baidu$page$getScrollLeft(), fields = me._fields, fieldLen = fields.length, alters = [], alterWidths = [], alterWidth, alterSum = 0, colsWidth = me.colsWidth, leave, i, revise = 0, offsetWidth, currentWidth;
    me.dragPoint == "left" && index--;
    pageX -= me.dragStart;
    currentWidth = colsWidth[index] + pageX;
    currentWidth < 40 && (pageX += 40 - currentWidth, currentWidth = 40);
    for(i = index + 1;i < fieldLen;i++) {
      fields[i].stable || (alters.push(i), alterWidth = colsWidth[i], alterWidths.push(alterWidth), alterSum += alterWidth)
    }
    leave = pageX;
    fieldLen = alters.length;
    for(i = 0;i < fieldLen;i++) {
      fields = alters[i], alterWidth = alterWidths[i], offsetWidth = pageX * alterWidth / alterSum, offsetWidth = leave > 0 ? Math.ceil(offsetWidth) : Math.floor(offsetWidth), offsetWidth = Math.abs(offsetWidth) < Math.abs(leave) ? offsetWidth : leave, alterWidth -= offsetWidth, leave -= offsetWidth, alterWidth < 40 && (revise += 40 - alterWidth, alterWidth = 40), colsWidth[fields] = alterWidth
    }
    currentWidth -= revise;
    colsWidth[index] = currentWidth;
    me.resetColumns();
    document.onmousemove = JSCompiler_alias_NULL;
    document.onmouseup = JSCompiler_alias_NULL;
    me.isDraging = !1;
    me.hideDragMark();
    baidu$event$preventDefault(e);
    return!1
  }
}, resetColumns:function() {
  var colsWidth = this.colsWidth, id = this.id, len = colsWidth.length, tds = this.getBody().getElementsByTagName("td"), tables = this.main.getElementsByTagName("table"), tdsLen = tds.length, td, i, j;
  if(!this.noTitle) {
    for(i = 0;i < len;i++) {
      td = colsWidth[i], baidu$g(this.getTitleCellId(i)).style.width = td + "px"
    }
  }
  for(j = tables.length;j--;) {
    td = tables[j], td.getAttribute("control") == this.id && td.setAttribute("width", this._width - 2)
  }
  for(i = j = 0;i < tdsLen;i++) {
    if(td = tds[i], td.getAttribute("control") == id) {
      td.style.width = colsWidth[j % len] + "px", j++
    }
  }
}, getTitleCellId:function(index) {
  return JSCompiler_StaticMethods_getId(this, "titleCell") + index
}, getHeadHtml:function() {
  function sortAction(field) {
    if(me.sortable && field.sortable) {
      return baidu$format(' onmouseover="{0}" onmouseout="{1}" onclick="{2}" sortable="1"', JSCompiler_StaticMethods_getStrRef(me) + ".titleOverHandler(this)", JSCompiler_StaticMethods_getStrRef(me) + ".titleOutHandler(this)", JSCompiler_StaticMethods_getStrRef(me) + ".titleClickHandler(this)")
    }
    return""
  }
  var me = this, fields = this._fields, len = fields.length, html = [], i, field$$0, title, canDragBegin, canDragEnd, thCntrClass = JSCompiler_StaticMethods_getClass(me, "thcntr"), thTextClass = JSCompiler_StaticMethods_getClass(me, "thtext"), sortClass = JSCompiler_StaticMethods_getClass(me, "thsort"), selClass = JSCompiler_StaticMethods_getClass(me, "thsel"), tipClass = JSCompiler_StaticMethods_getClass(me, "thhelp"), contentHtml, orderClass, sortIconHtml, currentSort, tipHtml;
  for(i = 0;i < len;i++) {
    if(fields[i].dragable) {
      canDragBegin = i;
      break
    }
  }
  for(i = len - 1;i >= 0;i--) {
    if(fields[i].dragable) {
      canDragEnd = i;
      break
    }
  }
  html.push('<div class="ui-table-head-row">');
  html.push(baidu$format(me.tplTablePrefix, me._width - 2, me.id));
  html.push("<tr>");
  for(i = 0;i < len;i++) {
    field$$0 = fields[i], title = field$$0.title, currentSort = (contentHtml = me.sortable && field$$0.sortable) && field$$0.field && field$$0.field == me.orderBy, tipHtml = "", !me.noTip && field$$0.tip && (tipHtml = baidu$format(me.tplTipIcon, tipClass, "onmouseover=\"ui.ToolTip.show(this, '" + field$$0.tip + '\')" onmouseout="ui.ToolTip.hide()" tooltip="' + field$$0.tip + '"')), orderClass = sortIconHtml = "", contentHtml && (currentSort && (orderClass = " " + JSCompiler_StaticMethods_getClass(me, 
    "th" + me.order) + " " + JSCompiler_StaticMethods_getClass(me, "thcntr-sort")), sortIconHtml = baidu$format(me.tplSortIcon, sortClass)), "function" == typeof title ? (contentHtml = title.call(me), sortIconHtml = "") : contentHtml = title || "", title = contentHtml.indexOf("<") > -1 ? '<div class="{0}">{1}</div>{2}' : '<div class="{0}" title="{1}">{1}</div>{2}', contentHtml = baidu$format(title, thTextClass, contentHtml, sortIconHtml), html.push('<th id="' + this.getTitleCellId(i) + '" index="' + 
    i + '"', sortAction(field$$0), i >= canDragBegin && i < canDragEnd ? ' dragright="1"' : "", i <= canDragEnd && i > canDragBegin ? ' dragleft="1"' : "", ' style="width:' + me.colsWidth[i] + 'px">', '<div class="' + thCntrClass + orderClass + (field$$0.select ? " " + selClass : "") + '">', contentHtml, tipHtml, "</div></th>")
  }
  html.push("</tr></table></div>");
  return html.join("")
}, tplSortIcon:'<div class="{0}"></div>', tplTipIcon:'<div class="{0}" {1}></div>', onsort:new Function, renderBody:function() {
  var id = JSCompiler_StaticMethods_getId(this, "body"), list = baidu$g(id);
  if(!list) {
    list = document.createElement("div");
    list.id = id;
    list.className = JSCompiler_StaticMethods_getClass(this, "body");
    if(this.bodyHeight) {
      id = list.style, id.height = this.bodyHeight + "px", id.overflowX = "hidden", id.overflowY = "scroll"
    }
    this.main.appendChild(list)
  }
  list.style.width = this._width + "px";
  list.innerHTML = this.getBodyHtml()
}, getBodyCellId:function(rowIndex, fieldIndex) {
  return JSCompiler_StaticMethods_getId(this, "cell") + rowIndex + "_" + fieldIndex
}, getBodyHtml:function() {
  var data = this.datasource || [], dataLen = data.length, html = [], i, item;
  if(!dataLen) {
    return this.noDataHtml
  }
  for(i = 0;i < dataLen;i++) {
    item = data[i], html.push(this.getRowHtml(item, i))
  }
  return html.join("")
}, tplRowPrefix:'<div id="{0}" class="{1}" onmouseover="{2}" onmouseout="{3}" onclick="{4}">', getRowHtml:function(data, index) {
  var html = [], field, fields = this._fields, fieldLen = fields.length, colWidth, content, tdCntrClass = JSCompiler_StaticMethods_getClass(this, "tdcntr"), tdBreakClass = JSCompiler_StaticMethods_getClass(this, "tdbreak"), tdClass, subrow = this.subrow && this.subrow != "false", subentry, sortable, currentSort, orderClass, i;
  html.push(baidu$format(this.tplRowPrefix, JSCompiler_StaticMethods_getId(this, "row") + index, JSCompiler_StaticMethods_getClass(this, "row"), this.getStrCall("rowOverHandler", index), this.getStrCall("rowOutHandler", index), this.getStrCall("rowClickHandler", index)), baidu$format(this.tplTablePrefix, this._width - 2, this.id));
  for(i = 0;i < fieldLen;i++) {
    field = fields[i];
    content = field.content;
    colWidth = this.colsWidth[i];
    subentry = subrow && field.subEntry;
    tdClass = field.breakLine ? tdBreakClass : tdCntrClass;
    field.select && (tdClass += " " + JSCompiler_StaticMethods_getClass(this, "tdsel"));
    currentSort = (sortable = this.sortable && field.sortable) && field.field && field.field == this.orderBy;
    orderClass = "";
    sortable && currentSort && (orderClass = " " + JSCompiler_StaticMethods_getClass(this, "tdcntr-sort"));
    tdClass = '<div class="' + tdClass + '">' + (field.breakLine ? "" : "<nobr>") + ("function" == typeof content ? content.call(this, data, index, i) : data[content]) + (field.breakLine ? "" : "</nobr>") + "</div>";
    content = "&nbsp;";
    if(subentry) {
      if(typeof field.isSubEntryShow != "function" || field.isSubEntryShow.call(this, data, index, i) !== !1) {
        content = this.getSubEntryHtml(index)
      }
      tdClass = '<table width="100%" border="0" collpadding="0" collspacing="0"><tr><td width="' + (this.skin == "white-table" ? 20 : 14) + '" align="right">' + content + "</td><td>" + tdClass + "</td></tr></table>"
    }
    html.push('<td id="' + this.getBodyCellId(index, i) + '"', subentry ? ' class="' + JSCompiler_StaticMethods_getClass(this, "subentryfield") + '"' : ' class="' + orderClass + '"', ' style="width:' + colWidth + 'px" control="' + this.id, '" row="' + index + '" col="' + i + '">', tdClass, "</td>")
  }
  html.push("</tr></table></div>");
  subrow && html.push(this.getSubrowHtml(index));
  return html.join("")
}, tplSubEntry:'<div class="{0}" onmouseover="{2}" onmouseout="{3}" onclick="{4}" id="{1}" title="{5}"></div>', getSubEntryHtml:function(index) {
  return baidu$format(this.tplSubEntry, JSCompiler_StaticMethods_getClass(this, "subentry"), this.getSubentryId(index), this.getStrCall("entryOver", index), this.getStrCall("entryOut", index), this.getStrCall("fireSubrow", index), this.subEntryTipOpen)
}, getSubrowHtml:function(index) {
  return'<div id="' + this.getSubrowId(index) + '" class="' + JSCompiler_StaticMethods_getClass(this, "subrow") + '" style="display:none"></div>'
}, getSubrow:function(index) {
  return baidu$g(this.getSubrowId(index))
}, getSubrowId:function(index) {
  return JSCompiler_StaticMethods_getId(this, "subrow") + index
}, getSubentryId:function(index) {
  return JSCompiler_StaticMethods_getId(this, "subentry") + index
}, closeSubrow:function(index) {
  var subrowId = this.getSubrowId(index), entryId = this.getSubentryId(index);
  this.entryOut(index);
  this.subrowIndex = JSCompiler_alias_NULL;
  baidu$removeClass(entryId, JSCompiler_StaticMethods_getClass(this, "subentry-opened"));
  baidu$removeClass(this.getRow(index), JSCompiler_StaticMethods_getClass(this, "row-unfolded"));
  baidu$hide(subrowId);
  baidu$setAttr(entryId, "title", this.subEntryTipOpen);
  return!0
}, onsubrowopen:new Function, onsubrowclose:new Function, openSubrow:function(index) {
  var currentIndex = this.subrowIndex, entry = baidu$g(this.getSubentryId(index));
  baidu$lang$hasValue(currentIndex) && this.closeSubrow(currentIndex);
  baidu$addClass(entry, JSCompiler_StaticMethods_getClass(this, "subentry-opened"));
  baidu$addClass(this.getRow(index), JSCompiler_StaticMethods_getClass(this, "row-unfolded"));
  entry.setAttribute("title", this.subEntryTipClose);
  baidu$show(this.getSubrowId(index));
  this.subrowIndex = index
}, getRow:function(index) {
  return baidu$g(JSCompiler_StaticMethods_getId(this, "row") + index)
}, bindModel:function(model) {
  ui$Table.superClass.bindModel.call(this, model);
  this.setFields(this.fields)
}, dispose:function() {
  var head = baidu$g(JSCompiler_StaticMethods_getId(this, "head")), body = baidu$g(JSCompiler_StaticMethods_getId(this, "body")), mark = baidu$g(JSCompiler_StaticMethods_getId(this, "dragMark"));
  if(head) {
    head.onmousemove = JSCompiler_alias_NULL, head.onmousedown = JSCompiler_alias_NULL
  }
  mark && document.body.removeChild(mark);
  if(body) {
    body.onclick = JSCompiler_alias_NULL
  }
  ui$Table.superClass.dispose.call(this);
  this.resizeHandler && baidu$un(window, "resize", this.resizeHandler)
}};
ui$Table.prototype.rowClickHandler = function(index) {
  if(this.selectMode == "line") {
    if(this.dontSelectLine) {
      this.dontSelectLine = !1
    }else {
      var input;
      switch(this.select) {
        case "multi":
          input = baidu$g(JSCompiler_StaticMethods_getId(this, "multiSelect") + index);
          if(!baidu$lang$hasValue(this.preSelectIndex)) {
            input.checked = !input.checked
          }
          this.selectMulti(index);
          this.preSelectIndex = JSCompiler_alias_NULL;
          break;
        case "single":
          input = baidu$g(JSCompiler_StaticMethods_getId(this, "singleSelect") + index), input.checked = !0, this.selectSingle(index)
      }
    }
  }
};
ui$Table.prototype.rowClickHandler = ui$Table.prototype.rowClickHandler;
ui$Table.prototype.rowOutHandler = function(index) {
  (index = this.getRow(index)) && baidu$removeClass(index, JSCompiler_StaticMethods_getClass(this, "row-over"))
};
ui$Table.prototype.rowOutHandler = ui$Table.prototype.rowOutHandler;
ui$Table.prototype.rowOverHandler = function(index) {
  this.isDraging || (index = this.getRow(index)) && baidu$addClass(index, JSCompiler_StaticMethods_getClass(this, "row-over"))
};
ui$Table.prototype.rowOverHandler = ui$Table.prototype.rowOverHandler;
ui$Table.prototype.selectSingle = function(index) {
  var selectedClass = JSCompiler_StaticMethods_getClass(this, "row-selected"), selectedIndex = this.selectedIndex;
  this.selection = this.datasource[index];
  if(this.onselect(this.selection)) {
    "number" == typeof selectedIndex && baidu$removeClass(this.getRow(selectedIndex), selectedClass), this.selectedIndex = index, baidu$addClass(this.getRow(index), selectedClass)
  }
};
ui$Table.prototype.selectSingle = ui$Table.prototype.selectSingle;
ui$Table.prototype.toggleSelectAll = function() {
  this.selectAll(this.getHeadCheckbox().checked)
};
ui$Table.prototype.toggleSelectAll = ui$Table.prototype.toggleSelectAll;
ui$Table.prototype.rowCheckboxClick = function(index) {
  this.selectMode != "line" ? this.selectMulti(index) : this.preSelectIndex = index
};
ui$Table.prototype.rowCheckboxClick = ui$Table.prototype.rowCheckboxClick;
ui$Table.prototype.fireSubrow = function(index) {
  var datasource = this.datasource, dataLen = datasource instanceof Array && datasource.length;
  dataLen && !(index >= dataLen) && (this.subrowIndex !== index ? (datasource = datasource[index], this.onsubrowopen(index, datasource) !== !1 && this.openSubrow(index)) : (datasource = datasource[index], this.onsubrowclose(index, datasource) !== !1 && this.closeSubrow(index)), this.entryOver(index))
};
ui$Table.prototype.fireSubrow = ui$Table.prototype.fireSubrow;
ui$Table.prototype.entryOut = function(index) {
  index = this.getSubentryId(index);
  baidu$removeClass(index, JSCompiler_StaticMethods_getClass(this, "subentry-hover"));
  baidu$removeClass(index, JSCompiler_StaticMethods_getClass(this, "subentry-opened-hover"))
};
ui$Table.prototype.entryOut = ui$Table.prototype.entryOut;
ui$Table.prototype.entryOver = function(index) {
  var index = baidu$g(this.getSubentryId(index)), classBase = "subentry-hover";
  /subentry-opened/.test(index.className) && (classBase = "subentry-opened-hover");
  baidu$addClass(index, JSCompiler_StaticMethods_getClass(this, classBase))
};
ui$Table.prototype.entryOver = ui$Table.prototype.entryOver;
ui$Table.prototype.titleOverHandler = function(cell) {
  if(!this.isDraging && !this.dragReady) {
    this.sortReady = 1, baidu$addClass(cell.firstChild, JSCompiler_StaticMethods_getClass(this, "thcntr-hover"))
  }
};
ui$Table.prototype.titleOverHandler = ui$Table.prototype.titleOverHandler;
ui$Table.prototype.titleOutHandler = function(cell) {
  this.sortReady = 0;
  baidu$removeClass(cell.firstChild, JSCompiler_StaticMethods_getClass(this, "thcntr-hover"))
};
ui$Table.prototype.titleOutHandler = ui$Table.prototype.titleOutHandler;
ui$Table.prototype.titleClickHandler = function(cell) {
  if(this.sortReady) {
    var cell = this._fields[cell.getAttribute("index")], order = this.order, order = this.orderBy == cell.field ? !order || order == "asc" ? "desc" : "asc" : "desc";
    this.onsort.call(this, cell, order);
    this.order = order;
    this.orderBy = cell.field;
    this.renderHead();
    this.renderBody()
  }
};
baidu$inherits(ui$Table, ui$Control);
ui$Table.prototype.titleClickHandler = ui$Table.prototype.titleClickHandler;
function ui$PagableList(options) {
  this.fields = this.datasource = JSCompiler_alias_NULL;
  this.pageNo = 1;
  this.pageSize = 15;
  this.pagerCount = 5;
  this.order = this.orderBy = "";
  this.subrow = !1;
  this.select = "multi";
  this.view = "PagableList";
  ui$Control.call(this, options)
}
goog$exportSymbol("ui.PagableList", ui$PagableList);
ui$PagableList.prototype = function() {
  function getDataCallback(data) {
    var data = data.page, totalCount = data.totalCount, pageNo = data.pageNo, pageSize = data.pageSize, totalPage = Math.ceil(totalCount / pageSize), startIndex, endIndex;
    startIndex = Math.min(pageSize * (pageNo - 1) + 1, totalCount);
    endIndex = Math.min(pageSize * pageNo, totalCount);
    JSCompiler_StaticMethods_rebindModel(JSCompiler_StaticMethods_getChild(this, "listTable"), {listFields:this.fields, result:data.result, order:data.order, orderBy:data.orderBy, subrow:this.subrow, select:this.select});
    JSCompiler_StaticMethods_rebindModel(JSCompiler_StaticMethods_getChild(this, "listPager"), {pagerCount:this.pagerCount, page:pageNo, totalPage:totalPage});
    JSCompiler_StaticMethods_rebindModel(JSCompiler_StaticMethods_getChild(this, "listInfo"), {startIndex:startIndex, endIndex:endIndex, totalCount:totalCount});
    JSCompiler_StaticMethods_rebindModel(JSCompiler_StaticMethods_getChild(this, "pageSize"), {pageSize:pageSize})
  }
  function onListSorted(field, order) {
    this.orderBy = field.field;
    this.order = order;
    this.onstatechange(this.getCurrentState())
  }
  function onPageNoChanged(page) {
    this.pageNo = page;
    this.onstatechange(this.getCurrentState())
  }
  function onPageSizeChanged(size) {
    this.resetPageNo();
    this.pageSize = size;
    this.onstatechange(this.getCurrentState())
  }
  function onListSelected(selectedItems) {
    this.onlistselect(selectedItems)
  }
  function onSubRowOpened(index) {
    JSCompiler_StaticMethods_getChild(this, "listTable").getSubrow(index);
    this.onsubrowopen(index, JSCompiler_StaticMethods_getChild(this, "listTable").model.result[index])
  }
  return{onlistselect:JSCompiler_emptyFn(), onsubrowopen:JSCompiler_emptyFn(), onstatechange:JSCompiler_emptyFn(), getCurrentState:function() {
    return{pageSize:this.pageSize, pageNo:this.pageNo, orderBy:this.orderBy, order:this.order}
  }, getData:function() {
    this.datasource.getData(this.getCurrentState(), baidu$fn$bind(getDataCallback, this))
  }, resetPageNo:function() {
    this.pageNo = 1
  }, bindEvent:function() {
    var listTable = JSCompiler_StaticMethods_getChild(this, "listTable"), listPager = JSCompiler_StaticMethods_getChild(this, "listPager"), pageSize = JSCompiler_StaticMethods_getChild(this, "pageSize");
    listTable.onselect = baidu$fn$bind(onListSelected, this);
    listTable.onsubrowopen = baidu$fn$bind(onSubRowOpened, this);
    listTable.onsort = baidu$fn$bind(onListSorted, this);
    listPager.onselect = baidu$fn$bind(onPageNoChanged, this);
    pageSize.onselect = baidu$fn$bind(onPageSizeChanged, this)
  }, dispose:function() {
    var listTable = JSCompiler_StaticMethods_getChild(this, "listTable"), listPager = JSCompiler_StaticMethods_getChild(this, "listPager"), pageSize = JSCompiler_StaticMethods_getChild(this, "pageSize");
    listTable.onselect = JSCompiler_alias_NULL;
    listTable.onsubrowopen = JSCompiler_alias_NULL;
    listTable.onsort = JSCompiler_alias_NULL;
    listPager.onselect = JSCompiler_alias_NULL;
    pageSize.onselect = JSCompiler_alias_NULL;
    ui$PagableList.superClass.dispose.call(this)
  }}
}();
baidu$inherits(ui$PagableList, ui$Control);
goog$exportSymbol("dn.lang", {formOK:"\u5b8c\u6210", formCancel:"\u8fd4\u56de", btnSearch:"\u641c\u7d22", btnEnable:"\u542f\u7528", btnDisable:"\u505c\u7528", btnDelete:"\u5220\u9664", btnPause:"\u6682\u505c", btnModify:"\u4fee\u6539", btnArchive:"\u5b58\u6863", btnStop:"\u505c\u7528", btnResume:"\u6062\u590d", labelStatus:"\u72b6\u6001\uff1a", labelType:"\u7c7b\u578b\uff1a", labelSize:"\u5c3a\u5bf8\uff1a", infoSeparator:"\u4e14", itemPerPage:"\u6761/\u9875", itemPerPage2:"\u6bcf\u9875\u663e\u793a", 
optional:"\uff08\u9009\u586b\uff09", dataLoading:"\u52a0\u8f7d\u4e2d...", editPassword:"\u4fee\u6539\u5bc6\u7801", guide:"\u65b0\u624b\u5165\u95e8", guideAddSlot:"\u521b\u5efa\u6211\u7684\u7b2c\u4e00\u4e2a\u5e7f\u544a\u4f4d", deleteConfirm:"\u60a8\u786e\u5b9a\u8981\u5220\u9664\u5417\uff1f"});
function ui$Label(options) {
  ui$Control.call(this, options);
  this.type = "label"
}
baidu$inherits(ui$Label, ui$Control);
goog$exportSymbol("ui.Label", ui$Label);
ui$Label.prototype.render = function(opt_main) {
  opt_main = opt_main || this.main;
  ui$Label.superClass.render.call(this, opt_main);
  if(opt_main && this.text) {
    opt_main.innerHTML = this.text
  }
};
ui$Label.prototype.setContent = function(content) {
  if(this.main) {
    this.text = content, this.main.innerHTML = content
  }
};
function app$json$Serializer() {
}
function JSCompiler_StaticMethods_serialize_(JSCompiler_StaticMethods_serialize_$self, object, sb) {
  switch(typeof object) {
    case "string":
      JSCompiler_StaticMethods_serializeString_(object, sb);
      break;
    case "number":
      sb.push(isFinite(object) && !isNaN(object) ? object : "null");
      break;
    case "boolean":
      sb.push(object);
      break;
    case "undefined":
      sb.push("null");
      break;
    case "object":
      if(object == JSCompiler_alias_NULL) {
        sb.push("null");
        break
      }
      if(goog$typeOf(object) == "array") {
        var l = object.length;
        sb.push("[");
        for(var sep = "", i = 0;i < l;i++) {
          sb.push(sep), JSCompiler_StaticMethods_serialize_(JSCompiler_StaticMethods_serialize_$self, object[i], sb), sep = ","
        }
        sb.push("]");
        break
      }
      sb.push("{");
      l = "";
      for(sep in object) {
        Object.prototype.hasOwnProperty.call(object, sep) && (i = object[sep], typeof i != "function" && (sb.push(l), JSCompiler_StaticMethods_serializeString_(sep, sb), sb.push(":"), JSCompiler_StaticMethods_serialize_(JSCompiler_StaticMethods_serialize_$self, i, sb), l = ","))
      }
      sb.push("}");
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof object);
  }
}
var app$json$Serializer$charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\u000b"}, app$json$Serializer$charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function JSCompiler_StaticMethods_serializeString_(s, sb) {
  sb.push('"', s.replace(app$json$Serializer$charsToReplace_, function(c) {
    if(c in app$json$Serializer$charToJsonCharCache_) {
      return app$json$Serializer$charToJsonCharCache_[c]
    }
    var cc = c.charCodeAt(0), rv = "\\u";
    cc < 16 ? rv += "000" : cc < 256 ? rv += "00" : cc < 4096 && (rv += "0");
    return app$json$Serializer$charToJsonCharCache_[c] = rv + cc.toString(16)
  }), '"')
}
;function baidu$Mockup() {
  this.init()
}
baidu$addSingletonGetter(baidu$Mockup);
baidu$Mockup.prototype.maps_ = {};
baidu$Mockup.prototype.maps_once_ = {};
baidu$Mockup.prototype.init = function() {
  var me = this, req_ = baidu$ajax.request;
  baidu$ajax.request = function(url, options) {
    var found_in_mock = !1, k;
    for(k in me.maps_) {
      if(url.indexOf(k) == 0) {
        typeof console == "object" && typeof console.log == "function" && (console.log("[MOCKUP]" + (options.method || "get").toUpperCase() + " " + url + " " + (options.data || "")), console.log(me.maps_[k]));
        var fn = options.onsuccess;
        if(typeof fn == "function") {
          found_in_mock = [];
          JSCompiler_StaticMethods_serialize_(new app$json$Serializer, me.maps_[k], found_in_mock);
          found_in_mock = {responseText:found_in_mock.join("")};
          fn.call(JSCompiler_alias_NULL, found_in_mock, found_in_mock.responseText);
          me.maps_once_[k] && (fn = me, fn.maps_[k] = JSCompiler_alias_NULL, fn.maps_once_[k] = JSCompiler_alias_NULL, delete fn.maps_[k], delete fn.maps_once_[k]);
          found_in_mock = !0;
          break
        }
      }
    }
    found_in_mock || req_.call(JSCompiler_alias_NULL, url, options)
  }
};
function JSCompiler_StaticMethods_register(url, rv) {
  var maps = baidu$Mockup.getInstance().maps_;
  if(maps[url]) {
    throw Error("duplicate url = [" + url + "]");
  }else {
    maps[url] = rv
  }
}
;