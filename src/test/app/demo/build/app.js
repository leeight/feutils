var f = null, i, aa = this;
function n(a, b) {
  var c = a.split("."), d = aa;
  !(c[0] in d) && d.execScript && d.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && b !== void 0 ? d[e] = b : d = d[e] ? d[e] : d[e] = {}
  }
}
var o = [], o = ["tpl.html"];
var p;
function q(a) {
  for(var a = a.split("."), b = window, c;c = a.shift();) {
    if(b[c] != f) {
      b = b[c]
    }else {
      return f
    }
  }
  return b
}
var r = r || {};
r.get = function(a, b) {
  return r.m(a, {onsuccess:b})
};
r.H = function(a, b, c) {
  return r.m(a, {onsuccess:c, method:"POST", data:b})
};
r.m = function(a, b) {
  function c() {
    if(g.readyState == 4) {
      try {
        var a = g.status
      }catch(b) {
        e("failure");
        return
      }
      e(a);
      a >= 200 && a < 300 || a == 304 || a == 1223 ? e("success") : e("failure");
      window.setTimeout(function() {
        g.onreadystatechange = new Function;
        m && (g = f)
      }, 0)
    }
  }
  function d() {
    if(window.ActiveXObject) {
      try {
        return new ActiveXObject("Msxml2.XMLHTTP")
      }catch(a) {
        try {
          return new ActiveXObject("Microsoft.XMLHTTP")
        }catch(b) {
        }
      }
    }
    if(window.XMLHttpRequest) {
      return new XMLHttpRequest
    }
    return f
  }
  function e(a) {
    var a = "on" + a, b = s[a], d = r[a];
    b ? a != "onsuccess" ? b(g) : b(g, g.responseText) : d && a != "onsuccess" && d(g)
  }
  var b = b || {}, h = b.data || "", m = b.async !== !1, w = b.I || "", B = b.G || "", l = (b.method || "GET").toUpperCase(), j = b.headers || {}, t = b.F || !1, s = {}, k, g;
  for(k in b) {
    s[k] = b[k]
  }
  j["X-Request-By"] = "baidu.ajax";
  try {
    g = d();
    l == "GET" && (h && (a += (a.indexOf("?") >= 0 ? "&" : "?") + h, h = f), t || (a += (a.indexOf("?") >= 0 ? "&" : "?") + "b" + (new Date).getTime() + "=1"));
    w ? g.open(l, a, m, w, B) : g.open(l, a, m);
    if(m) {
      g.onreadystatechange = c
    }
    l == "POST" && g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    for(k in j) {
      j.hasOwnProperty(k) && g.setRequestHeader(k, j[k])
    }
    e("beforerequest");
    g.send(h);
    m || c()
  }catch(u) {
    e("failure")
  }
  return g
};
var v = f;
if(v = /msie (\d+\.\d)/i.exec(navigator.userAgent)) {
  p = parseFloat(v[1])
}
function x(a, b) {
  for(var a = y(a), c = z(b).split(/\s+/), d = c.length, b = a.className.split(/\s+/).join(" ");d--;) {
    RegExp("(^| )" + c[d] + "( |$)").test(b) && c.splice(d, 1)
  }
  a.className = z(b + " " + c.join(" "))
}
function y(a) {
  if("string" == typeof a || a instanceof String) {
    return document.getElementById(a)
  }else {
    if(a && a.nodeName && (a.nodeType == 1 || a.nodeType == 9 || a.nodeType == 11)) {
      return a
    }
  }
  return f
}
var A, ba = A = y, C = C || [];
function D() {
  for(var a = C.length, b = !!window.removeEventListener, c, d;a--;) {
    c = C[a], d = c[0], d.removeEventListener ? d.removeEventListener(c[1], c[3], !1) : d.detachEvent && d.detachEvent("on" + c[1], c[3])
  }
  b ? window.removeEventListener("unload", D, !1) : window.detachEvent("onunload", D)
}
window.attachEvent ? window.attachEvent("onunload", D) : window.addEventListener("unload", D, !1);
function E(a, b) {
  var c, d, e = a.prototype;
  d = new Function;
  d.prototype = b.prototype;
  d = a.prototype = new d;
  for(c in e) {
    d[c] = e[c]
  }
  a.s = b.prototype
}
function F(a, b) {
  var c, d;
  if("function" == typeof b) {
    for(d in a) {
      if(a.hasOwnProperty(d) && (c = a[d], c = b.call(a, c, d), c === !1)) {
        break
      }
    }
  }
}
function ca(a, b) {
  a = String(a);
  if("undefined" != typeof b) {
    if("[object Object]" == Object.prototype.toString.call(b)) {
      return a.replace(/\$\{(.+?)\}/g, function(a, d) {
        var c = b[d];
        "function" == typeof c && (c = c(d));
        return"undefined" == typeof c ? "" : c
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
function z(a) {
  return a.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, "")
}
a: {
  var G = navigator;
  if(G.plugins && G.mimeTypes.length) {
    var H = G.plugins["Shockwave Flash"];
    H && H.description && H.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".")
  }else {
    if(window.ActiveXObject && !window.opera) {
      for(var I = 10;I >= 2;I--) {
        try {
          var J = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + I);
          if(J) {
            J.GetVariable("$version").replace(/WIN/g, "").replace(/,/g, ".");
            break a
          }
        }catch(da) {
        }
      }
    }
  }
}
function K(a, b) {
  var c = arguments.length > 2 ? [].slice.call(arguments, 2) : f;
  return function() {
    var d = "[object String]" == Object.prototype.toString.call(a) ? b[a] : a, e = c ? c.concat([].slice.call(arguments, 0)) : arguments;
    return d.apply(b || d, e)
  }
}
if(p && p < 7) {
  try {
    document.execCommand("BackgroundImageCache", !1, !0)
  }catch(ea) {
  }
}
;function fa() {
}
;function L() {
  this.b = []
}
E(L, fa);
function ga(a, b) {
  a.b.DONE || (a.b.DONE = []);
  a.b.DONE.push(b)
}
L.prototype.D = function(a) {
  if(this.b[a]) {
    var b, c = Array.prototype.slice.call(arguments, 1);
    for(b = 0;b < this.b[a].length;b++) {
      this.b[a][b].apply(this, c)
    }
  }
};
function M() {
  this.p = {}
}
M.prototype.get = function(a) {
  return this.p[a] || ""
};
function ha(a) {
  return ia.get(a).replace(/\$\{([.:a-z0-9_]+)\}/ig, function(a, c) {
    var d = c.match(/:([a-z]+)$/), e;
    if(d && d.length > 1) {
      e = c.replace(/:[a-z]+$/i, "");
      d = d[1];
      d = d.toLowerCase();
      if(d === "lang" || d === "config") {
        c: {
          e = ("dn." + d + "." + e).split(".");
          for(var d = window, h;h = e.shift();) {
            if(d[h] != f) {
              d = d[h]
            }else {
              e = f;
              break c
            }
          }
          e = d
        }
      }else {
        throw"Not handled";
      }
      e = e === f || typeof e == "undefined" ? "" : e
    }else {
      e = ""
    }
    return e
  })
}
M.prototype.parse = function(a) {
  function b(a) {
    if(B.test(a)) {
      return b(a.replace(B, function(a, b) {
        return u[b] || s[b] || ""
      }))
    }
    return a
  }
  function c(a) {
    a && g && k.push(a)
  }
  function d() {
    g && (g in u ? alert("Template: " + g + " is exist") : u[g] = k.join("\n"));
    g = f
  }
  for(var a = a.split(/\r?\n/), e = a.length, h = 0, m = /<\!--\s*target:\s*([a-zA-Z0-9_]+)\s*--\>/, w = /<\!--\s*\/target\s*--\>/, B = /<\!--\s*import:\s*([a-zA-Z0-9_]+)\s*--\>/, l, j, t, s = this.p, k = [], g, u = {};h < e;h++) {
    if(j = a[h], !(j.length <= 0)) {
      m.lastIndex = -1, (t = m.exec(j)) ? (t = t[1], j = j.split(m), c(j[0]), d(), k = [], g = t, c(j[2])) : w.test(j) ? (j = j.split(w), c(j[0]), d()) : c(j)
    }
  }
  d();
  for(l in u) {
    s[l] && alert("Template: " + l + " already exists!"), s[l] = b(u[l])
  }
};
var ia = new M;
function N(a) {
  this.b = [];
  this.children = this.f = this.main = this.view = f;
  this.o = !0;
  for(var b in a) {
    a.hasOwnProperty(b) && (this[b] = a[b])
  }
  this.a = 0
}
E(N, L);
n("ui.Control", N);
i = N.prototype;
i.type = "";
i.skin = "";
i.id = "";
i.d = "";
i.c = function(a) {
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
function ja(a) {
  if(a.view && a.main && a.view) {
    a.main.innerHTML = ha(a.view), O(P, a.main, a)
  }
  a.c("init");
  a.a = 1
}
function ka(a, b) {
  if(b) {
    a.f = b
  }
  if(a.f) {
    var c;
    a.r && F(a.r, function(b, e) {
      c = a.f[b];
      typeof c !== "undefined" && (a[e] = c)
    });
    a.c("bindModel", a.f);
    a.a = 2
  }
}
i.render = function(a) {
  if(a) {
    this.main = a
  }
  if(this.main) {
    if(this.d) {
      this.main.id = this.d, this.main.removeAttribute("ui"), this.main.setAttribute("control", this.id), x(this.main, Q(this))
    }
    if(this.o && (a = this.main, this.state = {}, a)) {
      a.onmouseover = K(this.z, this), a.onmouseout = K(this.w, this), a.onmousedown = K(this.v, this), a.onmouseup = K(this.A, this)
    }
    this.c("render");
    this.a = 3
  }
};
i.dispose = function() {
  this.c("dispose");
  if(this.parent) {
    this.parent = f
  }
  if(this.children) {
    for(var a = this.children.length - 1;a >= 0;a--) {
      this.children.splice(a, 1)
    }
    this.children = f
  }
  if(this.main) {
    if(this.main.childNodes.length) {
      this.main.innerHTML = ""
    }
    this.main.onmouseover = f;
    this.main.onmouseout = f;
    this.main.onmousedown = f;
    this.main.onmouseup = f
  }
  this.a = 5
};
i.n = function(a) {
  if(this.a >= 5) {
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
    b = this.d || this.id;
    a.d = b ? b + "_" + a.id : a.id;
    this.children.push(a);
    a.parent = this;
    if(this.a >= 1 && (ja(a), this.a >= 2 && (ka(a), this.a >= 3 && (a.render(), this.a >= 4)))) {
      a.c("bindEvent"), a.a = 4
    }
  }
};
function Q(a, b) {
  if(!a.type) {
    return""
  }
  var c = "ui-" + a.type.toLowerCase().replace(".", "-"), d = "skin-" + a.skin;
  b && (c += "-" + b, d += "-" + b);
  a.skin && (c += " " + d);
  return c
}
i.z = function() {
  !this.state.disabled && !this.state.readonly && la(this, "hover")
};
i.w = function() {
  !this.state.disabled && !this.state.readonly && (R(this, "hover"), R(this, "press"))
};
i.v = function() {
  this.state.disabled || la(this, "press")
};
i.A = function() {
  this.state.disabled || R(this, "press")
};
function la(a, b) {
  if(!a.state) {
    a.state = {}
  }
  a.state[b] = 1;
  x(a.main, Q(a, b))
}
function R(a, b) {
  if(!a.state) {
    a.state = {}
  }
  a.state[b] = f;
  var c = a.main, d = Q(a, b), c = y(c);
  c.className = z(c.className.split(/\s+/).join("  ").replace(RegExp("(^| )(" + z(d).split(/\s+/).join("|") + ")( |$)", "g"), " ").replace(/\s+/g, " "))
}
;function S(a) {
  N.call(this, a);
  this.type = "button"
}
E(S, N);
n("ui.Button", S);
i = S.prototype;
i.C = '<div class="ui-button-bg-left"></div><div id="{2}" class="{1}">{0}</div>';
i.content = "button";
i.render = function(a) {
  S.s.render.call(this, a);
  a = this.main;
  if(a.tagName == "DIV") {
    var b = a.firstChild;
    if(b && b.tagName != "DIV") {
      this.content = a.innerHTML
    }
    a.innerHTML = ca(this.C, this.content, Q(this, "label"), (this.d || "") + "label");
    if(a.offsetWidth < 60 && a.offsetWidth > 0) {
      A((this.d || "") + "label").style.width = "40px"
    }
    a.onclick = K(this.u, this)
  }
};
i.u = function() {
  if(!this.state) {
    this.state = {}
  }
  if(!this.state.disabled && "function" == typeof this.onclick) {
    this.onclick()
  }
};
i.dispose = function() {
  this.onclick = this.main.onclick = f;
  S.s.dispose.call(this)
};
function ma(a) {
  N.call(this, a)
}
E(ma, N);
function T() {
  this.B = this.g = f
}
function na(a, b) {
  var c = {};
  typeof a === "string" && (a = oa(a));
  if(!a.id) {
    throw"UI Control must have an id";
  }
  F(a, function(b, e) {
    typeof b === "string" && (b.indexOf("@") === 0 ? (c[e] = b.substr(1), delete a[e]) : b.indexOf("&") === 0 && (a[e] = q(b.substr(1))))
  });
  a.r = c;
  if(b) {
    a.main = b
  }
  return new (q("ui." + a.type) || q(a.type))(a)
}
function O(a, b, c) {
  if(b && b.childNodes && c && c.n) {
    for(var d, e, h = 0;h < b.childNodes.length;h++) {
      d = b.childNodes[h], d.nodeType === 1 && ((e = d.getAttribute("ui")) ? (e = na(e, d), c.n(e), O(a, d, e)) : O(a, d, c))
    }
  }
}
function oa(a) {
  for(var b = {}, a = a.split(";"), c = a.length, d, e;c--;) {
    if(d = a[c]) {
      e = d.split(":"), d = e[0], e = e[1], b[d] ? ("[object Array]" == Object.prototype.toString.call(b[d]) || (b[d] = [b[d]]), b[d].push(e)) : b[d] = e
    }
  }
  return b
}
T.prototype.get = function(a, b) {
  for(var c = a.split("_"), d = c[0] === "frame" ? 1 : 0, e = b || (c[0] === "frame" ? this.B : this.g);d < c.length;d++) {
    if(!e) {
      return f
    }
    a: {
      if(e.children) {
        for(var h = 0;h < e.children.length;h++) {
          if(e.children[h].id === c[d]) {
            e = e.children[h];
            break a
          }
        }
      }
      e = f
    }
  }
  return e
};
n("ui.Lib.prototype.get", T.prototype.get);
T.prototype.dispose = function() {
  this.g && this.g.dispose()
};
var P = new T;
n("ui.util", P);
P.J = function() {
};
var U = window, V = "unload";
function pa() {
  P.dispose()
}
V = V.replace(/^on/i, "");
"string" == typeof U && (U = y(U));
U.addEventListener ? U.addEventListener(V, pa, !1) : U.attachEvent && U.attachEvent("on" + V, pa);
function W() {
  this.b = [];
  this.q = !1
}
E(W, L);
W.prototype.start = function() {
  throw"Not implemented";
};
function X(a) {
  a.q = !0;
  a.D("DONE", a)
}
function Y() {
  W.call(this);
  this.e = []
}
E(Y, W);
Y.prototype.k = function() {
  throw"Not implemented";
};
function Z() {
  Y.call(this)
}
Z.prototype = {start:function() {
  this.l = this.e.length;
  if(this.l === 0) {
    X(this)
  }else {
    for(var a = 0;a < this.e.length;a++) {
      this.e[a].q ? this.k(this.e[a]) : this.e[a].start()
    }
  }
}, k:function() {
  this.l--;
  this.l === 0 && X(this)
}};
E(Z, Y);
function $(a) {
  W.call(this);
  this.i = a;
  this.h = 0
}
E($, W);
$.prototype.start = function() {
  qa(this)
};
function qa(a) {
  a.i.length <= 0 ? a.j() : r.m(a.i[a.h], {method:"get", cacheable:!0, onsuccess:K(a.t, a), onfailure:K(a.j, a)})
}
$.prototype.t = function(a) {
  ia.parse(a.responseText);
  this.j()
};
$.prototype.j = function() {
  this.h++;
  this.h >= this.i.length ? X(this) : qa(this)
};
function ra(a) {
  var b = new Z;
  if(o.length > 0) {
    var c = new $(o);
    b.e.push(c);
    var d = K(b.k, b);
    ga(c, d)
  }
  ga(b, a);
  b.start()
}
;window.onload = function() {
  ra(function() {
    var a = ba("Main"), b = P, a = new ma({view:"MAIN_PAGE", main:a, o:!1});
    b.g = a;
    ja(a);
    ka(a, {});
    a.render();
    a.c("bindEvent");
    a.a = 4
  })
};

