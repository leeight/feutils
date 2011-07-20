var h = null, j, aa;
function ba(a) {
  aa = a;
  ca === 0 && aa()
}
var da = this;
function k(a, b) {
  var c = a.split("."), d = da;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && b !== void 0 ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
  }
}
var ca = 0;
var l;
function r(a) {
  for(var a = a.split("."), b = window, c;c = a.shift();) {
    if(b[c] != h) {
      b = b[c]
    }else {
      return h
    }
  }
  return b
}
var s, ea, v, w, y, z = h;
if(z = /msie (\d+\.\d)/i.exec(navigator.userAgent)) {
  l = s = parseFloat(z[1])
}
ea = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);
v = document.compatMode == "CSS1Compat";
w = /webkit/i.test(navigator.userAgent);
if(z = /opera\/(\d+\.\d)/i.exec(navigator.userAgent)) {
  y = parseFloat(z[1])
}
var fa = fa || {}, A = A || {};
A.opacity = s ? {get:function(a) {
  (a = a.style.filter) && a.indexOf("opacity=") >= 0 && a.match(/opacity=([^)]*)/)
}, set:function(a, b) {
  var c = a.style;
  c.filter = (c.filter || "").replace(/alpha\([^\)]*\)/gi, "") + (b == 1 ? "" : "alpha(opacity=" + b * 100 + ")");
  c.zoom = 1
}} : h;
function C(a, b) {
  for(var a = D(a), c = E(b).split(/\s+/), d = c.length, b = a.className.split(/\s+/).join(" ");d--;) {
    RegExp("(^| )" + c[d] + "( |$)").test(b) && c.splice(d, 1)
  }
  a.className = E(b + " " + c.join(" "))
}
function D(a) {
  if("string" == typeof a || a instanceof String) {
    return document.getElementById(a)
  }else {
    if(a && a.nodeName && (a.nodeType == 1 || a.nodeType == 9 || a.nodeType == 11)) {
      return a
    }
  }
  return h
}
var ga, F = ga = D;
function ha(a) {
  var b, c;
  c = D(a);
  b = c.nodeType == 9 ? c : c.ownerDocument || c.document;
  var a = D(a), d = ea > 0 && b.getBoxObjectFor && G(a) == "absolute" && (a.style.top === "" || a.style.left === "");
  c = {left:0, top:0};
  var e = s && !v ? b.body : b.documentElement;
  if(a == e) {
    return c
  }
  var f = h;
  if(a.getBoundingClientRect) {
    a = a.getBoundingClientRect(), c.left = Math.floor(a.left) + Math.max(b.documentElement.scrollLeft, b.body.scrollLeft), c.top = Math.floor(a.top) + Math.max(b.documentElement.scrollTop, b.body.scrollTop), c.left -= b.documentElement.clientLeft, c.top -= b.documentElement.clientTop, s && !v && (c.left -= 2, c.top -= 2)
  }else {
    if(b.getBoxObjectFor && !d) {
      a = b.getBoxObjectFor(a), b = b.getBoxObjectFor(e), c.left = a.screenX - b.screenX, c.top = a.screenY - b.screenY
    }else {
      f = a;
      do {
        c.left += f.offsetLeft;
        c.top += f.offsetTop;
        if(w > 0 && G(f) == "fixed") {
          c.left += b.body.scrollLeft;
          c.top += b.body.scrollTop;
          break
        }
        f = f.offsetParent
      }while(f && f != a);
      if(y > 0 || w > 0 && G(a) == "absolute") {
        c.top -= b.body.offsetTop
      }
      for(f = a.offsetParent;f && f != b.body;) {
        c.left -= f.scrollLeft;
        if(!y || f.tagName != "TR") {
          c.top -= f.scrollTop
        }
        f = f.offsetParent
      }
    }
  }
  return c
}
function G(a) {
  var b, a = D(a);
  b = ja("position");
  var c = a.style[b];
  if(!c) {
    var d = A[b], c = a.currentStyle || (s ? a.style : window.getComputedStyle(a, h)), c = "string" == typeof d ? c[d] : d && d.get ? d.get(a, c) : c[b]
  }
  if(d = fa.Ea) {
    c = d.filter(b, c, "get")
  }
  return c
}
function H(a, b) {
  a = D(a);
  a.className = E(a.className.split(/\s+/).join("  ").replace(RegExp("(^| )(" + E(b).split(/\s+/).join("|") + ")( |$)", "g"), " ").replace(/\s+/g, " "))
}
var ka = ka || [];
function I() {
  for(var a = ka.length, b = !!window.removeEventListener, c, d;a--;) {
    c = ka[a], d = c[0], d.removeEventListener ? d.removeEventListener(c[1], c[3], !1) : d.detachEvent && d.detachEvent("on" + c[1], c[3])
  }
  b ? window.removeEventListener("unload", I, !1) : window.detachEvent("onunload", I)
}
window.attachEvent ? window.attachEvent("onunload", I) : window.addEventListener("unload", I, !1);
function la(a, b) {
  var c = window, a = a.replace(/^on/i, "");
  "string" == typeof c && (c = D(c));
  c.addEventListener ? c.addEventListener(a, b, !1) : c.attachEvent && c.attachEvent("on" + a, b)
}
function ma(a) {
  a.preventDefault ? a.preventDefault() : a.returnValue = !1
}
function J(a, b) {
  var c, d, e = a.prototype;
  d = new Function;
  d.prototype = b.prototype;
  d = a.prototype = new d;
  for(c in e) {
    d[c] = e[c]
  }
  a.b = b.prototype
}
function na(a, b) {
  var c, d;
  if("function" == typeof b) {
    for(d in a) {
      if(a.hasOwnProperty(d) && (c = a[d], c = b.call(a, c, d), c === !1)) {
        break
      }
    }
  }
}
function K() {
  var a = document;
  return a.documentElement.scrollLeft || a.body.scrollLeft
}
function oa() {
  var a = document;
  return(a.compatMode == "BackCompat" ? a.body : a.documentElement).clientHeight
}
function pa() {
  var a = document;
  return(a.compatMode == "BackCompat" ? a.body : a.documentElement).clientWidth
}
function L(a, b) {
  a = String(a);
  if("undefined" != typeof b) {
    if("[object Object]" == Object.prototype.toString.call(b)) {
      return a.replace(/\$\{(.+?)\}/g, function(a, c) {
        var d = b[c];
        "function" == typeof d && (d = d(c));
        return"undefined" == typeof d ? "" : d
      })
    }else {
      var c = Array.prototype.slice.call(arguments, 1), d = c.length;
      return a.replace(/\{(\d+)\}/g, function(a, b) {
        b = parseInt(b, 10);
        return b >= d ? a : c[b]
      })
    }
  }
  return a
}
function ja(a) {
  return String(a).replace(/[-_]\D/g, function(a) {
    return a.charAt(1).toUpperCase()
  })
}
function E(a) {
  return a.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, "")
}
a: {
  var qa = navigator;
  if(qa.plugins && qa.mimeTypes.length) {
    var ra = qa.plugins["Shockwave Flash"];
    ra && ra.description && ra.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".")
  }else {
    if(window.ActiveXObject && !window.opera) {
      for(var sa = 10;sa >= 2;sa--) {
        try {
          var ta = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + sa);
          if(ta) {
            ta.GetVariable("$version").replace(/WIN/g, "").replace(/,/g, ".");
            break a
          }
        }catch(ua) {
        }
      }
    }
  }
}
function M(a, b) {
  var c = arguments.length > 2 ? [].slice.call(arguments, 2) : h;
  return function() {
    var d = "[object String]" == Object.prototype.toString.call(a) ? b[a] : a, e = c ? c.concat([].slice.call(arguments, 0)) : arguments;
    return d.apply(b || d, e)
  }
}
if(l && l < 7) {
  try {
    document.execCommand("BackgroundImageCache", !1, !0)
  }catch(wa) {
  }
}
;function xa() {
}
;function ya() {
  this.M = []
}
J(ya, xa);
function za() {
  this.Q = {}
}
za.prototype.get = function(a) {
  return this.Q[a] || ""
};
function Aa(a) {
  return Ba.get(a).replace(/\$\{([.:a-z0-9_]+)\}/ig, function(a, c) {
    var d = c.match(/:([a-z]+)$/), e;
    if(d && d.length > 1) {
      e = c.replace(/:[a-z]+$/i, "");
      d = d[1];
      d = d.toLowerCase();
      if(d === "lang" || d === "config") {
        c: {
          e = ("dn." + d + "." + e).split(".");
          for(var d = window, f;f = e.shift();) {
            if(d[f] != h) {
              d = d[f]
            }else {
              e = h;
              break c
            }
          }
          e = d
        }
      }else {
        throw"Not handled";
      }
      e = e === h || typeof e == "undefined" ? "" : e
    }else {
      e = ""
    }
    return e
  })
}
var Ba = new za;
function N(a) {
  this.M = [];
  this.children = this.i = this.main = this.view = h;
  this.r = !0;
  for(var b in a) {
    a.hasOwnProperty(b) && (this[b] = a[b])
  }
  this.c = 0
}
J(N, ya);
k("ui.Control", N);
j = N.prototype;
j.type = "";
j.skin = "";
j.id = "";
j.f = "";
j.g = function(a) {
  if(this.children) {
    var b = [], c, d;
    if(arguments.length > 1) {
      for(c = 1;c < arguments.length;c++) {
        b.push(arguments[c])
      }
    }
    for(c = 0;c < this.children.length;c++) {
      d = this.children[c], d[a] && d[a].apply(d, b)
    }
  }
};
j.init = function() {
  this.view && this.B();
  this.g("init");
  this.c = 1
};
j.bindModel = function(a) {
  if(a) {
    this.i = a
  }
  if(this.i) {
    var b = this, c;
    this.D && na(this.D, function(a, e) {
      c = b.i[a];
      typeof c !== "undefined" && (b[e] = c)
    });
    this.g("bindModel", this.i);
    this.c = 2
  }
};
j.render = function(a) {
  if(a) {
    this.main = a
  }
  if(this.main) {
    if(this.f) {
      this.main.id = this.f, this.main.removeAttribute("ui"), this.main.setAttribute("control", this.id), C(this.main, O(this))
    }
    if(this.r && (a = this.main, this.state = {}, a)) {
      a.onmouseover = M(this.na, this), a.onmouseout = M(this.ma, this), a.onmousedown = M(this.la, this), a.onmouseup = M(this.oa, this)
    }
    this.g("render");
    this.c = 3
  }
};
j.bindEvent = function() {
  this.g("bindEvent");
  this.c = 4
};
j.dispose = function() {
  this.g("dispose");
  if(this.parent) {
    this.parent = h
  }
  if(this.children) {
    for(var a = this.children.length - 1;a >= 0;a--) {
      this.children.splice(a, 1)
    }
    this.children = h
  }
  if(this.main) {
    if(this.main.childNodes.length) {
      this.main.innerHTML = ""
    }
    this.main.onmouseover = h;
    this.main.onmouseout = h;
    this.main.onmousedown = h;
    this.main.onmouseup = h
  }
  this.c = 5
};
j.q = function(a) {
  if(this.c >= 5) {
    a.dispose()
  }else {
    if(!this.children) {
      this.children = []
    }
    for(var b = 0;b < this.children.length;b++) {
      if(this.children[b].id === a.id) {
        throw"A control with the same id already exists";
      }
    }
    b = this.f || this.id;
    a.f = b ? b + "_" + a.id : a.id;
    this.children.push(a);
    a.parent = this;
    this.c >= 1 && (a.init(), this.c >= 2 && (a.bindModel(), this.c >= 3 && (a.render(), this.c >= 4 && a.bindEvent())))
  }
};
j.removeChild = function(a, b) {
  if(this.children) {
    for(var c = b || !1, d = this.children.length - 1;d >= 0;d--) {
      if(this.children[d] === a) {
        if(c) {
          if(a.parent = h, a.main.childNodes.length) {
            a.main.innerHTML = ""
          }
        }else {
          a.dispose()
        }
        this.children.splice(d, 1);
        break
      }
    }
  }
};
function P(a, b) {
  if(!a.children) {
    return h
  }
  for(var c = 0;c < a.children.length;c++) {
    if(a.children[c].id === b) {
      return a.children[c]
    }
  }
  return h
}
j.B = function() {
  if(this.main && this.view) {
    this.main.innerHTML = Aa(this.view), Q(R, this.main, this)
  }
};
function O(a, b) {
  if(!a.type) {
    return""
  }
  var c = "ui-" + a.type.toLowerCase().replace(".", "-"), d = "skin-" + a.skin;
  b && (c += "-" + b, d += "-" + b);
  a.skin && (c += " " + d);
  return c
}
function T(a, b) {
  var c = a.f || "";
  if(b) {
    return c + b
  }
  return c
}
function U(a) {
  return"ui.util.get('" + a.f + "')"
}
j.d = function(a) {
  var b = arguments.length, c = [], d, e;
  if(b > 1) {
    for(d = 1;d < b;d++) {
      e = arguments[d], typeof e === "string" && (e = "'" + e + "'"), c.push(e)
    }
  }
  return U(this) + "." + a + "(" + c.join(",") + ");"
};
j.na = function() {
  !this.state.disabled && !this.state.readonly && Ca(this, "hover")
};
j.ma = function() {
  !this.state.disabled && !this.state.readonly && (Da(this, "hover"), Da(this, "press"))
};
j.la = function() {
  this.state.disabled || Ca(this, "press")
};
j.oa = function() {
  this.state.disabled || Da(this, "press")
};
function Ca(a, b) {
  if(!a.state) {
    a.state = {}
  }
  a.state[b] = 1;
  C(a.main, O(a, b))
}
function Da(a, b) {
  if(!a.state) {
    a.state = {}
  }
  a.state[b] = h;
  H(a.main, O(a, b))
}
;function Ea(a) {
  N.call(this, a)
}
J(Ea, N);
function V() {
  this.ra = this.j = h
}
function Fa(a, b) {
  var c = {};
  typeof a === "string" && (a = Ga(a));
  if(!a.id) {
    throw"UI Control must have an id";
  }
  na(a, function(b, e) {
    typeof b === "string" && (b.indexOf("@") === 0 ? (c[e] = b.substr(1), delete a[e]) : b.indexOf("&") === 0 && (a[e] = r(b.substr(1))))
  });
  a.D = c;
  if(b) {
    a.main = b
  }
  return new (r("ui." + a.type) || r(a.type))(a)
}
function Q(a, b, c) {
  if(b && b.childNodes && c && c.q) {
    for(var d, e, f = 0;f < b.childNodes.length;f++) {
      d = b.childNodes[f], d.nodeType === 1 && ((e = d.getAttribute("ui")) ? (e = Fa(e, d), c.q(e), Q(a, d, e)) : Q(a, d, c))
    }
  }
}
function Ga(a) {
  for(var b = {}, a = a.split(";"), c = a.length, d, e;c--;) {
    if(d = a[c]) {
      e = d.split(":"), d = e[0], e = e[1], b[d] ? ("[object Array]" == Object.prototype.toString.call(b[d]) || (b[d] = [b[d]]), b[d].push(e)) : b[d] = e
    }
  }
  return b
}
V.prototype.get = function(a, b) {
  for(var c = a.split("_"), d = c[0] === "frame" ? 1 : 0, e = b || (c[0] === "frame" ? this.ra : this.j);d < c.length;d++) {
    if(!e) {
      return h
    }
    e = P(e, c[d])
  }
  return e
};
k("ui.Lib.prototype.get", V.prototype.get);
V.prototype.dispose = function() {
  this.j && this.j.dispose()
};
var R = new V;
k("ui.util", R);
R.Ja = function() {
};
la("unload", function() {
  R.dispose()
});
function W(a) {
  N.call(this, a);
  this.type = "label"
}
J(W, N);
k("ui.Label", W);
W.prototype.render = function(a) {
  a = a || this.main;
  W.b.render.call(this, a);
  if(a && this.text) {
    a.innerHTML = this.text
  }
};
function X(a) {
  N.call(this, a);
  this.type = "button"
}
J(X, N);
k("ui.Button", X);
j = X.prototype;
j.za = '<div class="ui-button-bg-left"></div><div id="{2}" class="{1}">{0}</div>';
j.content = "button";
j.render = function(a) {
  X.b.render.call(this, a);
  a = this.main;
  if(a.tagName == "DIV") {
    var b = a.firstChild;
    if(b && b.tagName != "DIV") {
      this.content = a.innerHTML
    }
    a.innerHTML = L(this.za, this.content, O(this, "label"), T(this, "label"));
    if(a.offsetWidth < 60 && a.offsetWidth > 0) {
      ga(T(this, "label")).style.width = "40px"
    }
    a.onclick = M(this.P, this)
  }
};
j.P = function() {
  if(!this.state) {
    this.state = {}
  }
  if(!this.state.disabled && "function" == typeof this.onclick) {
    this.onclick()
  }
};
j.dispose = function() {
  this.onclick = this.main.onclick = h;
  X.b.dispose.call(this)
};
function Ha() {
  Y && (clearTimeout(Y), Y = 0)
}
var Y = 0;
function Ia() {
  Y = setTimeout(function() {
    var a = F("ToolTipLayer");
    a.style.left = "-10000px";
    a.style.top = "-10000px"
  }, 200)
}
la("load", function() {
  var a = document.createElement("dl"), b = document.createElement("dt"), c = document.createElement("dd");
  a.id = "ToolTipLayer";
  a.className = "ui-tooltip-layer";
  b.id = "ToolTipLayerTitle";
  a.appendChild(b);
  c.id = "ToolTipLayerBody";
  a.appendChild(c);
  a.onmouseover = Ha;
  a.onmouseout = Ia;
  document.body.appendChild(a)
});
function Z(a) {
  N.call(this, a);
  this.type = "table";
  this.C = this.C || ""
}
k("ui.Table", Z);
Z.prototype = {wa:"\u70b9\u51fb\u5c55\u5f00", J:'<table cellpadding="0" cellspacing="0" border="0" width="{0}" control="{1}">', init:function() {
  Z.b.init.call(this);
  this.G(this.fields)
}, render:function(a) {
  a = this.main = a || this.main;
  Z.b.render.call(this, a);
  if(this.h) {
    if(this.select === "multi") {
      this.selection = []
    }
    this.Ia = h;
    this.a = this.z();
    this.A();
    a.style.width = this.a + "px";
    this.ua();
    this.ta();
    if(this.ka) {
      if(this.select && (!this.S || this.S == !1)) {
        this.onselect(this.selection)
      }
    }else {
      this.ja()
    }
    this.ka = !0
  }
}, A:function() {
  var a = [], b, c;
  b = this.h;
  var d, e = b.length, f, g;
  this.e = [];
  c = this.a - e - 2;
  for(g = 0;g < e;g++) {
    d = b[g], f = parseInt(d.width, 10), c -= f, this.e.push(f), d.stable || a.push(g)
  }
  e = a.length;
  b = Math.round(c / e);
  for(g = 0;g < e;g++) {
    d = Math.abs(c) > Math.abs(b) ? b : c, c -= d, this.e[a[g]] += d
  }
}, z:function() {
  if(this.width) {
    return this.width
  }
  var a, b = document.createElement("div"), c = this.main.parentNode;
  c.appendChild(b);
  a = b.offsetWidth;
  c.removeChild(b);
  return a
}, ja:function() {
  var a = this;
  a.L = pa();
  a.K = oa();
  a.n = function() {
    var b = pa(), c = oa();
    if(!(b == a.L && c == a.K)) {
      a.L = b, a.K = c, a.ga()
    }
  };
  la("resize", a.n)
}, ga:function() {
  var a = F(T(this, "head"));
  this.a = this.z();
  this.main.style.width = this.a + "px";
  if(F(T(this, "body"))) {
    F(T(this, "body")).style.width = this.a + "px", a && (a.style.width = this.a + "px"), this.A(), this.F()
  }
}, O:{width:30, stable:!0, select:!0, title:function() {
  return'<input type="checkbox" id="' + T(this, "selectAll") + '" onclick="' + this.d("toggleSelectAll") + '">'
}, content:function(a, b) {
  var c = !1;
  if(this.p && "[object Array]" == Object.prototype.toString.call(this.o)) {
    for(var d = 0;d < this.o.length;d++) {
      if(a[this.p] === this.o[d]) {
        this.selection.push(a);
        c = !0;
        break
      }
    }
  }
  return'<input type="checkbox" id="' + T(this, "multiSelect") + b + '" onclick="' + this.d("rowCheckboxClick", b) + '"' + (c ? 'checked="checked"' : "") + ">"
}}, sa:{width:30, stable:!0, title:"&nbsp;", select:!0, content:function(a, b) {
  var c = T(this, "singleSelect"), d = !1;
  if(this.p && a[this.p] === this.o) {
    this.selection = a, d = !0
  }
  return'<input type="radio" id="' + c + b + '" name=' + c + ' onclick="' + this.d("selectSingle", b) + '"' + (d ? 'checked="checked"' : "") + ">"
}}, G:function(a) {
  if(a) {
    for(var a = a.slice(0), b = a.length;b--;) {
      a[b] || a.splice(b, 1)
    }
    this.h = a;
    if(this.select) {
      switch(this.select.toLowerCase()) {
        case "multi":
          a.unshift(this.O);
          break;
        case "single":
          a.unshift(this.sa)
      }
    }
  }
}, U:function() {
  return F(T(this, "body"))
}, onselect:new Function, ua:function() {
  var a = F(T(this, "head"));
  if(!this.pa) {
    if(!a) {
      a = document.createElement("div");
      a.id = T(this, "head");
      a.className = O(this, "head");
      a.setAttribute("control", this.id);
      if(this.t) {
        a.onmousemove = this.aa(), a.onmousedown = this.Y()
      }
      this.main.appendChild(a)
    }
    a.style.width = this.a + "px";
    a.innerHTML = this.$()
  }
}, aa:function() {
  var a = this, b = O(a, "startdrag");
  return function(c) {
    if(!a.m) {
      var c = c || window.event, d = c.srcElement || c.target, c = c.pageX || c.clientX + K(), e, f;
      if(d = a.u(d)) {
        e = ha(d), d.getAttribute("index"), f = d.getAttribute("sortable"), d.getAttribute("dragleft") && c - e.left < 8 ? (f && a.I(d), C(this, b), a.k = "left", a.l = 1) : d.getAttribute("dragright") && e.left + d.offsetWidth - c < 8 ? (f && a.I(d), C(this, b), a.k = "right", a.l = 1) : (H(this, b), f && a.ya(d), a.k = "", a.l = 0)
      }
    }
  }
}, u:function(a) {
  for(;a.nodeType == 1;) {
    if(a.tagName == "TH") {
      return a
    }
    a = a.parentNode
  }
  return h
}, Y:function() {
  var a = this, b = O(a, "startdrag");
  return function(c) {
    if(!(F(T(a, "head")).className.indexOf(b) < 0)) {
      var c = c || window.event, d = c.target || c.srcElement;
      if(d = a.u(d)) {
        return a.ia = document.documentElement.clientHeight, a.m = !0, a.T = d.getAttribute("index"), a.s = c.pageX || c.clientX + K(), document.onmousemove = a.Z(), document.onmouseup = a.X(), a.H(a.s), ma(c), !1
      }
    }
  }
}, Z:function() {
  var a = this;
  return function(b) {
    b = b || window.event;
    a.H(b.pageX || b.clientX + K());
    ma(b);
    return!1
  }
}, H:function(a) {
  var b = this.v();
  if(!this.top) {
    this.top = ha(this.main).top
  }
  b || (b = this.R());
  b.style.top = this.top + "px";
  b.style.left = a + "px";
  a = document;
  b.style.height = this.ia - this.top + (a.documentElement.scrollTop || a.body.scrollTop) + "px"
}, ha:function() {
  var a = this.v();
  a.style.left = "-10000px";
  a.style.top = "-10000px"
}, R:function() {
  var a = document.createElement("div");
  a.id = T(this, "dragMark");
  a.className = O(this, "mark");
  a.style.top = "-10000px";
  a.style.left = "-10000px";
  document.body.appendChild(a);
  return a
}, v:function() {
  return F(T(this, "dragMark"))
}, X:function() {
  var a = this;
  return function(b) {
    var b = b || window.event, c = parseInt(a.T, 10), d = b.pageX || b.clientX + K(), e = a.h, f = e.length, g = [], i = [], m, x = 0, p = a.e, u, o, B = 0, q, n;
    a.k == "left" && c--;
    d -= a.s;
    n = p[c] + d;
    n < 40 && (d += 40 - n, n = 40);
    for(o = c + 1;o < f;o++) {
      e[o].stable || (g.push(o), m = p[o], i.push(m), x += m)
    }
    u = d;
    f = g.length;
    for(o = 0;o < f;o++) {
      e = g[o], m = i[o], q = d * m / x, q = u > 0 ? Math.ceil(q) : Math.floor(q), q = Math.abs(q) < Math.abs(u) ? q : u, m -= q, u -= q, m < 40 && (B += 40 - m, m = 40), p[e] = m
    }
    n -= B;
    p[c] = n;
    a.F();
    document.onmousemove = h;
    document.onmouseup = h;
    a.m = !1;
    a.ha();
    ma(b);
    return!1
  }
}, F:function() {
  var a = this.e, b = this.id, c = a.length, d = this.U().getElementsByTagName("td"), e = this.main.getElementsByTagName("table"), f = d.length, g, i, m;
  if(!this.pa) {
    for(i = 0;i < c;i++) {
      g = a[i], F(this.w(i)).style.width = g + "px"
    }
  }
  for(m = e.length;m--;) {
    g = e[m], g.getAttribute("control") == this.id && g.setAttribute("width", this.a - 2)
  }
  for(i = m = 0;i < f;i++) {
    if(g = d[i], g.getAttribute("control") == b) {
      g.style.width = a[m % c] + "px", m++
    }
  }
}, w:function(a) {
  return T(this, "titleCell") + a
}, $:function() {
  function a(a) {
    if(b.sortable && a.sortable) {
      return L(' onmouseover="{0}" onmouseout="{1}" onclick="{2}" sortable="1"', U(b) + ".titleOverHandler(this)", U(b) + ".titleOutHandler(this)", U(b) + ".titleClickHandler(this)")
    }
    return""
  }
  var b = this, c = this.h, d = c.length, e = [], f, g, i, m, x, p = O(b, "thcntr"), u = O(b, "thtext"), o = O(b, "thsort"), B = O(b, "thsel"), q = O(b, "thhelp"), n, t, S, va, ia;
  for(f = 0;f < d;f++) {
    if(c[f].t) {
      m = f;
      break
    }
  }
  for(f = d - 1;f >= 0;f--) {
    if(c[f].t) {
      x = f;
      break
    }
  }
  e.push('<div class="ui-table-head-row">');
  e.push(L(b.J, b.a - 2, b.id));
  e.push("<tr>");
  for(f = 0;f < d;f++) {
    g = c[f], i = g.title, va = (n = b.sortable && g.sortable) && g.field && g.field == b.qa, ia = "", !b.Fa && g.tip && (ia = L(b.Da, q, "onmouseover=\"ui.ToolTip.show(this, '" + g.tip + '\')" onmouseout="ui.ToolTip.hide()" tooltip="' + g.tip + '"')), t = S = "", n && (va && (t = " " + O(b, "th" + b.Ha) + " " + O(b, "thcntr-sort")), S = L(b.Ba, o)), "function" == typeof i ? (n = i.call(b), S = "") : n = i || "", i = n.indexOf("<") > -1 ? '<div class="{0}">{1}</div>{2}' : '<div class="{0}" title="{1}">{1}</div>{2}', 
    n = L(i, u, n, S), e.push('<th id="' + this.w(f) + '" index="' + f + '"', a(g), f >= m && f < x ? ' dragright="1"' : "", f <= x && f > m ? ' dragleft="1"' : "", ' style="width:' + b.e[f] + 'px">', '<div class="' + p + t + (g.select ? " " + B : "") + '">', n, ia, "</div></th>")
  }
  e.push("</tr></table></div>");
  return e.join("")
}, Ba:'<div class="{0}"></div>', Da:'<div class="{0}" {1}></div>', ya:function(a) {
  if(!this.m && !this.l) {
    this.va = 1, C(a.firstChild, O(this, "thcntr-hover"))
  }
}, I:function(a) {
  this.va = 0;
  H(a.firstChild, O(this, "thcntr-hover"))
}, ta:function() {
  var a = T(this, "body"), b = F(a);
  if(!b) {
    b = document.createElement("div");
    b.id = a;
    b.className = O(this, "body");
    if(this.N) {
      a = b.style, a.height = this.N + "px", a.overflowX = "hidden", a.overflowY = "scroll"
    }
    this.main.appendChild(b)
  }
  b.style.width = this.a + "px";
  b.innerHTML = this.W()
}, V:function(a, b) {
  return T(this, "cell") + a + "_" + b
}, W:function() {
  var a = this.datasource || [], b = a.length, c = [], d, e;
  if(!b) {
    return this.C
  }
  for(d = 0;d < b;d++) {
    e = a[d], c.push(this.ba(e, d))
  }
  return c.join("")
}, Aa:'<div id="{0}" class="{1}" onmouseover="{2}" onmouseout="{3}" onclick="{4}">', ba:function(a, b) {
  var c = [], d, e = this.h, f = e.length, g, i, m = O(this, "tdcntr"), x = O(this, "tdbreak"), p, u = this.xa && this.xa != "false", o, B, q, n, t;
  c.push(L(this.Aa, T(this, "row") + b, O(this, "row"), this.d("rowOverHandler", b), this.d("rowOutHandler", b), this.d("rowClickHandler", b)), L(this.J, this.a - 2, this.id));
  for(t = 0;t < f;t++) {
    d = e[t];
    i = d.content;
    g = this.e[t];
    o = u && d.subEntry;
    p = d.breakLine ? x : m;
    d.select && (p += " " + O(this, "tdsel"));
    q = (B = this.sortable && d.sortable) && d.field && d.field == this.qa;
    n = "";
    B && q && (n = " " + O(this, "tdcntr-sort"));
    p = '<div class="' + p + '">' + (d.breakLine ? "" : "<nobr>") + ("function" == typeof i ? i.call(this, a, b, t) : a[i]) + (d.breakLine ? "" : "</nobr>") + "</div>";
    i = "&nbsp;";
    if(o) {
      if(typeof d.isSubEntryShow != "function" || d.isSubEntryShow.call(this, a, b, t) !== !1) {
        i = this.ca(b)
      }
      p = '<table width="100%" border="0" collpadding="0" collspacing="0"><tr><td width="' + (this.skin == "white-table" ? 20 : 14) + '" align="right">' + i + "</td><td>" + p + "</td></tr></table>"
    }
    c.push('<td id="' + this.V(b, t) + '"', o ? ' class="' + O(this, "subentryfield") + '"' : ' class="' + n + '"', ' style="width:' + g + 'px" control="' + this.id, '" row="' + b + '" col="' + t + '">', p, "</td>")
  }
  c.push("</tr></table></div>");
  u && c.push(this.ea(b));
  return c.join("")
}, Ca:'<div class="{0}" onmouseover="{2}" onmouseout="{3}" onclick="{4}" id="{1}" title="{5}"></div>', ca:function(a) {
  return L(this.Ca, O(this, "subentry"), this.da(a), this.d("entryOver", a), this.d("entryOut", a), this.d("fireSubrow", a), this.wa)
}, ea:function(a) {
  return'<div id="' + this.fa(a) + '" class="' + O(this, "subrow") + '" style="display:none"></div>'
}, fa:function(a) {
  return T(this, "subrow") + a
}, da:function(a) {
  return T(this, "subentry") + a
}, bindModel:function(a) {
  Z.b.bindModel.call(this, a);
  this.G(this.fields)
}, dispose:function() {
  var a = F(T(this, "head")), b = F(T(this, "body")), c = F(T(this, "dragMark"));
  if(a) {
    a.onmousemove = h, a.onmousedown = h
  }
  c && document.body.removeChild(c);
  if(b) {
    b.onclick = h
  }
  Z.b.dispose.call(this);
  if(this.n) {
    a = this.n, b = window, "string" == typeof b && (b = D(b)), c = "resize".replace(/^on/i, ""), b.removeEventListener ? b.removeEventListener(c, a, !1) : b.detachEvent && b.detachEvent("on" + c, a)
  }
}};
J(Z, N);
function $(a) {
  this.title = "";
  this.withModifyButton = !0;
  this.fields = this.datasource = h;
  this.view = "ListViewer";
  N.call(this, a);
  this.type = "richsel"
}
k("ui.ListView", $);
$.prototype = function() {
  function a() {
  }
  return{Ga:function() {
  }, bindModel:function(a) {
    $.b.bindModel.call(this, a);
    P(this, "lblTitle").bindModel({title:this.title});
    P(this, "list").bindModel({datasource:this.datasource, fields:this.fields})
  }, render:function(a) {
    $.b.render.call(this, a);
    if(!this.withModifyButton && (a = P(this, "btnModify"), a.main && (a = a.main))) {
      a = D(a), a.style.display = "none"
    }
  }, bindEvent:function() {
    $.b.bindEvent.call(this);
    P(this, "btnModify").onclick = M(a, this)
  }, dispose:function() {
    P(this, "btnModify").onclick = h;
    $.b.dispose.call(this)
  }}
}();
J($, N);
window.onload = function() {
  function a(a) {
    var c = R, d = new Ea({view:"MAIN_PAGE", main:document.getElementById("Main"), r:!1});
    c.j = d;
    d.init();
    d.bindModel(a);
    d.render();
    d.bindEvent()
  }
  Ea.prototype.B = function() {
    Q(R, this.main, this)
  };
  ba(function() {
    a({datasource:[{name:"google"}, {name:"baidu"}, {name:"sina"}], fields:[{title:"\u751f\u6d3b\u5708\u540d\u79f0", field:"name", content:function(a) {
      return a.name
    }}]})
  })
};

