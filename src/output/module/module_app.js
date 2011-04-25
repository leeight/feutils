PLOVR_MODULE_INFO={"baidu":["app"],"app":[],"google":["app"],"news":["app"]};
PLOVR_MODULE_URIS={"baidu":"../output/module/module_baidu.js","app":"../output/module/module_app.js","google":"../output/module/module_google.js","news":"../output/module/module_news.js"};
PLOVR_MODULE_USE_DEBUG_MODE=false;
var JSCompiler_alias_NULL = null, JSCompiler_prototypeAlias, goog$global = this;
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
var baidu$ie;
function baidu$emptyMethod() {
}
function baidu$getObjectByName(name) {
  for(var name = name.split("."), cur = window, part;part = name.shift();) {
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
  return baidu$ajax.request(url, {onsuccess:onsuccess, method:"GET"})
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
var baidu$browser$ie, baidu$browser$isGecko, baidu$browser$isStrict, baidu$browser$isWebkit, baidu$browser$opera, match$$inline_18 = JSCompiler_alias_NULL;
if(match$$inline_18 = /msie (\d+\.\d)/i.exec(navigator.userAgent)) {
  baidu$ie = baidu$browser$ie = parseFloat(match$$inline_18[1])
}
baidu$browser$isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);
baidu$browser$isStrict = document.compatMode == "CSS1Compat";
baidu$browser$isWebkit = /webkit/i.test(navigator.userAgent);
if(match$$inline_18 = /opera\/(\d+\.\d)/i.exec(navigator.userAgent)) {
  baidu$browser$opera = parseFloat(match$$inline_18[1])
}
var baidu$dom = baidu$dom || {}, baidu$dom$_NAME_ATTRS = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", rowspan:"rowSpan", valign:"vAlign", usemap:"useMap", frameborder:"frameBorder"};
baidu$browser$ie < 8 ? (baidu$dom$_NAME_ATTRS["for"] = "htmlFor", baidu$dom$_NAME_ATTRS["class"] = "className") : (baidu$dom$_NAME_ATTRS.htmlFor = "for", baidu$dom$_NAME_ATTRS.className = "class");
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
a: {
  var n$$inline_28 = navigator;
  if(n$$inline_28.plugins && n$$inline_28.mimeTypes.length) {
    var plugin$$inline_29 = n$$inline_28.plugins["Shockwave Flash"];
    plugin$$inline_29 && plugin$$inline_29.description && plugin$$inline_29.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".")
  }else {
    if(window.ActiveXObject && !window.opera) {
      for(var i$$inline_30 = 10;i$$inline_30 >= 2;i$$inline_30--) {
        try {
          var c$$inline_31 = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i$$inline_30);
          if(c$$inline_31) {
            c$$inline_31.GetVariable("$version").replace(/WIN/g, "").replace(/,/g, ".");
            break a
          }
        }catch(e$$inline_32) {
        }
      }
    }
  }
}
function baidu$fn$bind(func, scope) {
  var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : JSCompiler_alias_NULL;
  return function() {
    var fn = "[object String]" == Object.prototype.toString.call(func) ? scope[func] : func, args = xargs ? xargs.concat([].slice.call(arguments, 0)) : arguments;
    return fn.apply(scope || fn, args)
  }
}
if(baidu$ie && baidu$ie < 7) {
  try {
    document.execCommand("BackgroundImageCache", !1, !0)
  }catch(e$$8) {
  }
}
;function app$module$ModuleManager() {
  this._modules = {};
  this._moduleUris = this._moduleInfo = this._loader = JSCompiler_alias_NULL
}
baidu$addSingletonGetter(app$module$ModuleManager);
function JSCompiler_StaticMethods_setLoaded(JSCompiler_StaticMethods_setLoaded$self, moduleName) {
  JSCompiler_StaticMethods_setLoaded$self._modules[moduleName] = !0
}
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
        script.onreadystatechange = baidu$emptyMethod, me._loadedUrl[moduleUrl] = !0, callback()
      }
    } : script.onload = function() {
      me._loadedUrl[moduleUrl] = !0;
      callback()
    };
    scriptParent.appendChild(script)
  }
};
var moduleManager = app$module$ModuleManager.getInstance();
moduleManager._loader = new app$module$ModuleLoader;
moduleManager._moduleInfo = goog$global.PLOVR_MODULE_INFO;
moduleManager._moduleUris = goog$global.PLOVR_MODULE_URIS;
function LoadApplication(name) {
  JSCompiler_StaticMethods_execOnLoad(name, function() {
    var fn;
    a: {
      fn = (name + ".app.start").split(".");
      for(var cur = goog$global, part;part = fn.shift();) {
        if(cur[part] != JSCompiler_alias_NULL) {
          cur = cur[part]
        }else {
          fn = JSCompiler_alias_NULL;
          break a
        }
      }
      fn = cur
    }
    fn && fn()
  })
}
JSCompiler_StaticMethods_setLoaded(moduleManager, "app");
baidu$on(window, "load", function() {
  baidu$on("load-baidu-app", "click", function() {
    LoadApplication("baidu")
  });
  baidu$on("load-google-app", "click", function() {
    LoadApplication("google")
  });
  baidu$on("load-news-app", "click", function() {
    LoadApplication("news")
  })
});
function base$Object() {
}
;function base$DataSource() {
}
baidu$inherits(base$DataSource, base$Object);
base$DataSource.prototype.getData = function() {
  throw"Not implemented";
};
function base$EventDispatcher() {
  this._listeners = []
}
baidu$inherits(base$EventDispatcher, base$Object);
function JSCompiler_StaticMethods_addListener(JSCompiler_StaticMethods_addListener$self, listener) {
  JSCompiler_StaticMethods_addListener$self._listeners.DONE || (JSCompiler_StaticMethods_addListener$self._listeners.DONE = []);
  JSCompiler_StaticMethods_addListener$self._listeners.DONE.push(listener)
}
base$EventDispatcher.prototype.trigger = function(eventType) {
  if(this._listeners[eventType]) {
    var i, args = Array.prototype.slice.call(arguments, 1);
    for(i = 0;i < this._listeners[eventType].length;i++) {
      this._listeners[eventType][i].apply(this, args)
    }
  }
};
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
        c: {
          JSCompiler_temp = ("dn." + match + "." + JSCompiler_temp).split(".");
          for(var match = window, part;part = JSCompiler_temp.shift();) {
            if(match[part] != JSCompiler_alias_NULL) {
              match = match[part]
            }else {
              JSCompiler_temp = JSCompiler_alias_NULL;
              break c
            }
          }
          JSCompiler_temp = match
        }
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
function ui$Control(options) {
  this._listeners = [];
  this.children = this.model = this.main = this.view = JSCompiler_alias_NULL;
  this.autoState = !0;
  for(var p in options) {
    options.hasOwnProperty(p) && (this[p] = options[p])
  }
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
    this.main.innerHTML = JSCompiler_StaticMethods_getMerged(this.view), JSCompiler_StaticMethods_buildControlTree(ui$util, this.main, this)
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
JSCompiler_prototypeAlias.disable = function() {
  JSCompiler_StaticMethods_setState(this, "disabled")
};
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
function JSCompiler_StaticMethods_getState(JSCompiler_StaticMethods_getState$self) {
  if(!JSCompiler_StaticMethods_getState$self.state) {
    JSCompiler_StaticMethods_getState$self.state = {}
  }
  return!!JSCompiler_StaticMethods_getState$self.state.disabled
}
;function ui$InputControl(options) {
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
JSCompiler_prototypeAlias.setValue = function(value) {
  this.value = value
};
JSCompiler_prototypeAlias.validate = function() {
  if(!this.rule) {
    return!0
  }
  return ui$util.validate(this, this.rule)
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
  var readOnly = !!this.readOnly;
  (this.readOnly = readOnly = !!readOnly) ? JSCompiler_StaticMethods_setState(this, "readonly") : JSCompiler_StaticMethods_removeState(this, "readonly");
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
    if(!JSCompiler_StaticMethods_getState(me)) {
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
function ui$ListInfo(options) {
  this.total = this.end = this.start = 0;
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
ui$Pager.prototype = {render:function(main) {
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
  if(this.valueField && "[object Array]" == Object.prototype.toString.call(this.selectedValue)) {
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
  index = this.subEntryTipOpen;
  subrowId = "title";
  entryId = baidu$dom$g(entryId);
  "style" == subrowId ? entryId.style.cssText = index : (subrowId = baidu$dom$_NAME_ATTRS[subrowId] || subrowId, entryId.setAttribute(subrowId, index));
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
  ui$Control.call(this, options);
  this.view = "PagableList"
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
    this.order = order
  }
  function onPageNoChanged(page) {
    this.pageNo = page
  }
  function onPageSizeChanged(size) {
    this.resetPageNo();
    this.pageSize = size
  }
  function onListSelected() {
  }
  function onSubRowOpened(index) {
    JSCompiler_StaticMethods_getChild(this, "listTable").getSubrow(index);
    this.onsubrowopen(index, JSCompiler_StaticMethods_getChild(this, "listTable").model.result[index])
  }
  return{onlistselect:function() {
  }, onsubrowopen:function() {
  }, onstatechange:function() {
  }, getCurrentState:function() {
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
function base$AbstractWorker() {
  this._listeners = [];
  this.isDone = !1
}
baidu$inherits(base$AbstractWorker, base$EventDispatcher);
base$AbstractWorker.prototype.start = function() {
  throw"Not implemented";
};
function JSCompiler_StaticMethods_done(JSCompiler_StaticMethods_done$self) {
  JSCompiler_StaticMethods_done$self.isDone = !0;
  JSCompiler_StaticMethods_done$self.trigger("DONE", JSCompiler_StaticMethods_done$self)
}
function JSCompiler_StaticMethods_addDoneListener(JSCompiler_StaticMethods_addDoneListener$self, listener) {
  JSCompiler_StaticMethods_addListener(JSCompiler_StaticMethods_addDoneListener$self, listener)
}
function base$AbstractWorkerManager() {
  base$AbstractWorker.call(this);
  this.workers = []
}
baidu$inherits(base$AbstractWorkerManager, base$AbstractWorker);
function JSCompiler_StaticMethods_addWorker(JSCompiler_StaticMethods_addWorker$self) {
  var worker = new app$Worker(goog$asyncResource);
  JSCompiler_StaticMethods_addWorker$self.workers.push(worker);
  JSCompiler_StaticMethods_addWorker$self = baidu$fn$bind(JSCompiler_StaticMethods_addWorker$self._workerDone, JSCompiler_StaticMethods_addWorker$self);
  JSCompiler_StaticMethods_addListener(worker, JSCompiler_StaticMethods_addWorker$self)
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
    JSCompiler_StaticMethods_done(this)
  }else {
    for(var i = 0;i < this.workers.length;i++) {
      this.workers[i].isDone ? this._workerDone(this.workers[i]) : this.workers[i].start()
    }
  }
}, _workerDone:function() {
  this.counter--;
  this.counter === 0 && JSCompiler_StaticMethods_done(this)
}};
baidu$inherits(base$ParallelWorkerManager, base$AbstractWorkerManager);
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
  this._index >= this._template.length ? JSCompiler_StaticMethods_done(this) : JSCompiler_StaticMethods__loadTemplate(this)
};
function ui$Page(options) {
  ui$Control.call(this, options)
}
baidu$inherits(ui$Page, ui$Control);
function ui$Lib() {
  this.pagePopup = this.pageMain = JSCompiler_alias_NULL
}
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
  return new (baidu$getObjectByName("ui." + attrs.type) || baidu$getObjectByName(attrs.type))(attrs)
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
      attrSegment = attrItem.split(":"), attrItem = attrSegment[0], attrSegment = attrSegment[1], attrs[attrItem] ? ("[object Array]" == Object.prototype.toString.call(attrs[attrItem]) || (attrs[attrItem] = [attrs[attrItem]]), attrs[attrItem].push(attrSegment)) : attrs[attrItem] = attrSegment
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
goog$exportSymbol("ui.Lib.prototype.get", ui$Lib.prototype.get);
ui$Lib.prototype.dispose = function() {
  this.pageMain && this.pageMain.dispose()
};
var ui$util = new ui$Lib;
goog$exportSymbol("ui.util", ui$util);
ui$util.validate = baidu$emptyMethod;
baidu$on(window, "unload", function() {
  ui$util.dispose()
});
function app$Launch(main) {
  var pwm = new base$ParallelWorkerManager;
  goog$asyncResource.length > 0 && JSCompiler_StaticMethods_addWorker(pwm);
  JSCompiler_StaticMethods_addDoneListener(pwm, function() {
    goog$asyncResource = [];
    main()
  });
  pwm.start()
}
function app$Init(view, main, opt_model) {
  var opt_model = opt_model || {}, JSCompiler_StaticMethods_createPage$self = ui$util, view = new ui$Page({view:view, main:main, autoState:!1});
  JSCompiler_StaticMethods_createPage$self.pageMain = view;
  view.init();
  view.bindModel(opt_model);
  view.render();
  view.bindEvent()
}
;function app$json$parse(s) {
  var s = String(s), JSCompiler_inline_result;
  JSCompiler_inline_result = /^\s*$/.test(s) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(s.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""));
  if(JSCompiler_inline_result) {
    try {
      return(new Function("return (" + s + ")"))()
    }catch(ex) {
    }
  }
  throw Error("Invalid JSON string: " + s);
}
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
        typeof console == "object" && typeof console.log == "function" && (console.log("[MOCKUP]" + options.method.toUpperCase() + " " + url + " " + options.data), console.log(me.maps_[k]));
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
function baidu$mockup$register(url) {
  var rv = {success:"true", message:{}, page:{pageNo:1, pageSize:120, orderBy:"", order:"desc", totalCount:4, result:[{id:1, name:"\u751f\u6d3b\u57081", status:1, sale_price:{1:1E3, 2:2E3, 3:3E3, 4:4E3, 5:5E3, 6:6E3}}, {id:2, name:"\u751f\u6d3b\u57082", status:1, sale_price:{1:1E3, 2:2E3, 3:3E3, 4:4E3, 5:5E3, 6:6E3}}, {id:3, name:"\u751f\u6d3b\u57083", status:1, sale_price:{1:1E3, 2:2E3, 3:3E3, 4:4E3, 5:5E3, 6:6E3}}, {id:4, name:"\u751f\u6d3b\u57084", status:2, sale_price:{1:1E3, 2:2E3, 3:3E3, 4:4E3, 
  5:5E3, 6:6E3}}]}}, maps = baidu$Mockup.getInstance().maps_;
  if(maps[url]) {
    throw Error("duplicate url = [" + url + "]");
  }else {
    maps[url] = rv
  }
}
;