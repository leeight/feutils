var f = null, g, i = this;
function j(a, d) {
  var c = a.split("."), b = i;
  !(c[0] in b) && b.execScript && b.execScript("var " + c[0]);
  for(var e;c.length && (e = c.shift());) {
    !c.length && d !== void 0 ? b[e] = d : b = b[e] ? b[e] : b[e] = {}
  }
}
;var k;
function l(a) {
  for(var a = a.split("."), d = window, c;c = a.shift();) {
    if(d[c] != f) {
      d = d[c]
    }else {
      return f
    }
  }
  return d
}
var m = f;
if(m = /msie (\d+\.\d)/i.exec(navigator.userAgent)) {
  k = parseFloat(m[1])
}
function n(a, d) {
  for(var a = o(a), c = p(d).split(/\s+/), b = c.length, d = a.className.split(/\s+/).join(" ");b--;) {
    RegExp("(^| )" + c[b] + "( |$)").test(d) && c.splice(b, 1)
  }
  a.className = p(d + " " + c.join(" "))
}
function o(a) {
  if("string" == typeof a || a instanceof String) {
    return document.getElementById(a)
  }else {
    if(a && a.nodeName && (a.nodeType == 1 || a.nodeType == 9 || a.nodeType == 11)) {
      return a
    }
  }
  return f
}
var q;
q = o;
var r = r || [];
function s() {
  for(var a = r.length, d = !!window.removeEventListener, c, b;a--;) {
    c = r[a], b = c[0], b.removeEventListener ? b.removeEventListener(c[1], c[3], !1) : b.detachEvent && b.detachEvent("on" + c[1], c[3])
  }
  d ? window.removeEventListener("unload", s, !1) : window.detachEvent("onunload", s)
}
window.attachEvent ? window.attachEvent("onunload", s) : window.addEventListener("unload", s, !1);
function t(a, d) {
  var c, b, e = a.prototype;
  b = new Function;
  b.prototype = d.prototype;
  b = a.prototype = new b;
  for(c in e) {
    b[c] = e[c]
  }
  a.j = d.prototype
}
function u(a, d) {
  var c, b;
  if("function" == typeof d) {
    for(b in a) {
      if(a.hasOwnProperty(b) && (c = a[b], c = d.call(a, c, b), c === !1)) {
        break
      }
    }
  }
}
function v(a, d) {
  a = String(a);
  if("undefined" != typeof d) {
    if("[object Object]" == Object.prototype.toString.call(d)) {
      return a.replace(/\$\{(.+?)\}/g, function(a, b) {
        var c = d[b];
        "function" == typeof c && (c = c(b));
        return"undefined" == typeof c ? "" : c
      })
    }else {
      var c = Array.prototype.slice.call(arguments, 1), b = c.length;
      return a.replace(/\{(\d+)\}/g, function(a, d) {
        d = parseInt(d, 10);
        return d >= b ? a : c[d]
      })
    }
  }
  return a
}
function p(a) {
  return a.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, "")
}
a: {
  var w = navigator;
  if(w.plugins && w.mimeTypes.length) {
    var x = w.plugins["Shockwave Flash"];
    x && x.description && x.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".")
  }else {
    if(window.ActiveXObject && !window.opera) {
      for(var y = 10;y >= 2;y--) {
        try {
          var z = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + y);
          if(z) {
            z.GetVariable("$version").replace(/WIN/g, "").replace(/,/g, ".");
            break a
          }
        }catch(A) {
        }
      }
    }
  }
}
function B(a, d) {
  var c = arguments.length > 2 ? [].slice.call(arguments, 2) : f;
  return function() {
    var b = "[object String]" == Object.prototype.toString.call(a) ? d[a] : a, e = c ? c.concat([].slice.call(arguments, 0)) : arguments;
    return b.apply(d || b, e)
  }
}
if(k && k < 7) {
  try {
    document.execCommand("BackgroundImageCache", !1, !0)
  }catch(C) {
  }
}
;function D() {
}
;function E() {
  this.k = []
}
t(E, D);
function F() {
  this.m = {}
}
F.prototype.get = function(a) {
  return this.m[a] || ""
};
function G(a) {
  return H.get(a).replace(/\$\{([.:a-z0-9_]+)\}/ig, function(a, c) {
    var b = c.match(/:([a-z]+)$/), e;
    if(b && b.length > 1) {
      e = c.replace(/:[a-z]+$/i, "");
      b = b[1];
      b = b.toLowerCase();
      if(b === "lang" || b === "config") {
        c: {
          e = ("dn." + b + "." + e).split(".");
          for(var b = window, h;h = e.shift();) {
            if(b[h] != f) {
              b = b[h]
            }else {
              e = f;
              break c
            }
          }
          e = b
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
var H = new F;
function I(a) {
  this.k = [];
  this.children = this.d = this.main = this.view = f;
  this.g = !0;
  for(var d in a) {
    a.hasOwnProperty(d) && (this[d] = a[d])
  }
  this.a = 0
}
t(I, E);
j("ui.Control", I);
g = I.prototype;
g.type = "";
g.skin = "";
g.id = "";
g.b = "";
g.c = function(a) {
  if(this.children) {
    var d = [], c, b;
    if(arguments.length > 1) {
      for(c = 1;c < arguments.length;c++) {
        d.push(arguments[c])
      }
    }
    for(c = 0;c < this.children.length;c++) {
      b = this.children[c], b[a] && b[a].apply(b, d)
    }
  }
};
function J(a) {
  a.view && a.h();
  a.c("init");
  a.a = 1
}
function K(a, d) {
  if(d) {
    a.d = d
  }
  if(a.d) {
    var c;
    a.i && u(a.i, function(b, d) {
      c = a.d[b];
      typeof c !== "undefined" && (a[d] = c)
    });
    a.c("bindModel", a.d);
    a.a = 2
  }
}
g.render = function(a) {
  if(a) {
    this.main = a
  }
  if(this.main) {
    if(this.b) {
      this.main.id = this.b, this.main.removeAttribute("ui"), this.main.setAttribute("control", this.id), n(this.main, L(this))
    }
    if(this.g && (a = this.main, this.state = {}, a)) {
      a.onmouseover = B(this.p, this), a.onmouseout = B(this.o, this), a.onmousedown = B(this.n, this), a.onmouseup = B(this.q, this)
    }
    this.c("render");
    this.a = 3
  }
};
g.dispose = function() {
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
g.f = function(a) {
  if(this.a >= 5) {
    a.dispose()
  }else {
    if(!this.children) {
      this.children = []
    }
    for(var d = 0;d < this.children.length;d++) {
      if(this.children[d].id === a.id) {
        throw"A control with the same id already exists";
      }
    }
    d = this.b || this.id;
    a.b = d ? d + "_" + a.id : a.id;
    this.children.push(a);
    a.parent = this;
    if(this.a >= 1 && (J(a), this.a >= 2 && (K(a), this.a >= 3 && (a.render(), this.a >= 4)))) {
      a.c("bindEvent"), a.a = 4
    }
  }
};
function M(a, d) {
  if(!a.children) {
    return f
  }
  for(var c = 0;c < a.children.length;c++) {
    if(a.children[c].id === d) {
      return a.children[c]
    }
  }
  return f
}
g.h = function() {
  if(this.main && this.view) {
    this.main.innerHTML = G(this.view), N(O, this.main, this)
  }
};
function L(a, d) {
  if(!a.type) {
    return""
  }
  var c = "ui-" + a.type.toLowerCase().replace(".", "-"), b = "skin-" + a.skin;
  d && (c += "-" + d, b += "-" + d);
  a.skin && (c += " " + b);
  return c
}
g.p = function() {
  !this.state.disabled && !this.state.readonly && P(this, "hover")
};
g.o = function() {
  !this.state.disabled && !this.state.readonly && (Q(this, "hover"), Q(this, "press"))
};
g.n = function() {
  this.state.disabled || P(this, "press")
};
g.q = function() {
  this.state.disabled || Q(this, "press")
};
function P(a, d) {
  if(!a.state) {
    a.state = {}
  }
  a.state[d] = 1;
  n(a.main, L(a, d))
}
function Q(a, d) {
  if(!a.state) {
    a.state = {}
  }
  a.state[d] = f;
  var c = a.main, b = L(a, d), c = o(c);
  c.className = p(c.className.split(/\s+/).join("  ").replace(RegExp("(^| )(" + p(b).split(/\s+/).join("|") + ")( |$)", "g"), " ").replace(/\s+/g, " "))
}
;function R(a) {
  I.call(this, a)
}
t(R, I);
function S() {
  this.r = this.e = f
}
function T(a, d) {
  var c = {};
  typeof a === "string" && (a = U(a));
  if(!a.id) {
    throw"UI Control must have an id";
  }
  u(a, function(b, d) {
    typeof b === "string" && (b.indexOf("@") === 0 ? (c[d] = b.substr(1), delete a[d]) : b.indexOf("&") === 0 && (a[d] = l(b.substr(1))))
  });
  a.i = c;
  if(d) {
    a.main = d
  }
  return new (l("ui." + a.type) || l(a.type))(a)
}
function N(a, d, c) {
  if(d && d.childNodes && c && c.f) {
    for(var b, e, h = 0;h < d.childNodes.length;h++) {
      b = d.childNodes[h], b.nodeType === 1 && ((e = b.getAttribute("ui")) ? (e = T(e, b), c.f(e), N(a, b, e)) : N(a, b, c))
    }
  }
}
function U(a) {
  for(var d = {}, a = a.split(";"), c = a.length, b, e;c--;) {
    if(b = a[c]) {
      e = b.split(":"), b = e[0], e = e[1], d[b] ? ("[object Array]" == Object.prototype.toString.call(d[b]) || (d[b] = [d[b]]), d[b].push(e)) : d[b] = e
    }
  }
  return d
}
S.prototype.get = function(a, d) {
  for(var c = a.split("_"), b = c[0] === "frame" ? 1 : 0, e = d || (c[0] === "frame" ? this.r : this.e);b < c.length;b++) {
    if(!e) {
      return f
    }
    e = M(e, c[b])
  }
  return e
};
S.prototype.dispose = function() {
  this.e && this.e.dispose()
};
var O = new S;
O.t = function() {
};
var V = window, W = "unload";
function X() {
  O.dispose()
}
W = W.replace(/^on/i, "");
"string" == typeof V && (V = o(V));
V.addEventListener ? V.addEventListener(W, X, !1) : V.attachEvent && V.attachEvent("on" + W, X);
function Y(a) {
  I.call(this, a);
  this.type = "button"
}
t(Y, I);
j("ui.Button", Y);
g = Y.prototype;
g.s = '<div class="ui-button-bg-left"></div><div id="{2}" class="{1}">{0}</div>';
g.content = "button";
g.render = function(a) {
  Y.j.render.call(this, a);
  a = this.main;
  if(a.tagName == "DIV") {
    var d = a.firstChild;
    if(d && d.tagName != "DIV") {
      this.content = a.innerHTML
    }
    a.innerHTML = v(this.s, this.content, L(this, "label"), (this.b || "") + "label");
    if(a.offsetWidth < 60 && a.offsetWidth > 0) {
      q((this.b || "") + "label").style.width = "40px"
    }
    a.onclick = B(this.l, this)
  }
};
g.l = function() {
  if(!this.state) {
    this.state = {}
  }
  if(!this.state.disabled && "function" == typeof this.onclick) {
    this.onclick()
  }
};
g.dispose = function() {
  this.onclick = this.main.onclick = f;
  Y.j.dispose.call(this)
};
window.onload = function() {
  R.prototype.h = function() {
    N(O, this.main, this)
  };
  var a = M(function(a) {
    var c = O, b = new R({view:"MAIN_PAGE", main:document.getElementById("Main"), g:!1});
    c.e = b;
    J(b);
    K(b, a);
    b.render();
    b.c("bindEvent");
    b.a = 4;
    return b
  }({}), "button");
  alert(q((a.b || "") + "label").innerHTML)
};

