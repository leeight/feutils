var f=null,h,aa=this;function j(a,b){var c=a.split("."),d=aa;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)!c.length&&b!==void 0?d[e]=b:d=d[e]?d[e]:d[e]={}};var k;function l(a){for(var a=a.split("."),b=window,c;c=a.shift();)if(b[c]!=f)b=b[c];else return f;return b}var m,o,p,r,s,t=f;if(t=/msie (\d+\.\d)/i.exec(navigator.userAgent))k=m=parseFloat(t[1]);o=/gecko/i.test(navigator.userAgent)&&!/like gecko/i.test(navigator.userAgent);p=document.compatMode=="CSS1Compat";r=/webkit/i.test(navigator.userAgent);if(t=/opera\/(\d+\.\d)/i.exec(navigator.userAgent))s=parseFloat(t[1]);var u=u||{},v=v||{};
v.opacity=m?{get:function(a){(a=a.style.filter)&&a.indexOf("opacity=")>=0&&a.match(/opacity=([^)]*)/)},set:function(a,b){var c=a.style;c.filter=(c.filter||"").replace(/alpha\([^\)]*\)/gi,"")+(b==1?"":"alpha(opacity="+b*100+")");c.zoom=1}}:f;function w(a,b){for(var a=x(a),c=y(b).split(/\s+/),d=c.length,b=a.className.split(/\s+/).join(" ");d--;)RegExp("(^| )"+c[d]+"( |$)").test(b)&&c.splice(d,1);a.className=y(b+" "+c.join(" "))}
function x(a){if("string"==typeof a||a instanceof String)return document.getElementById(a);else if(a&&a.nodeName&&(a.nodeType==1||a.nodeType==9||a.nodeType==11))return a;return f}var z,da=z=x;function A(a){var b,a=x(a);b=ea("position");var c=a.style[b];if(!c)var d=v[b],c=a.currentStyle||(m?a.style:window.getComputedStyle(a,f)),c="string"==typeof d?c[d]:d&&d.get?d.get(a,c):c[b];if(d=u.V)c=d.filter(b,c,"get");return c}
function B(a,b){a=x(a);a.className=y(a.className.split(/\s+/).join("  ").replace(RegExp("(^| )("+y(b).split(/\s+/).join("|")+")( |$)","g")," ").replace(/\s+/g," "))}function fa(a){if(a)a=x(a),a.style.display=""}var C=C||[];function D(){for(var a=C.length,b=!!window.removeEventListener,c,d;a--;)c=C[a],d=c[0],d.removeEventListener?d.removeEventListener(c[1],c[3],!1):d.detachEvent&&d.detachEvent("on"+c[1],c[3]);b?window.removeEventListener("unload",D,!1):window.detachEvent("onunload",D)}
window.attachEvent?window.attachEvent("onunload",D):window.addEventListener("unload",D,!1);function E(a,b,c){b=b.replace(/^on/i,"");"string"==typeof a&&(a=x(a));a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)}function F(a,b){var c,d,e=a.prototype;d=new Function;d.prototype=b.prototype;d=a.prototype=new d;for(c in e)d[c]=e[c];a.e=b.prototype}
function G(a,b){var c,d;if("function"==typeof b)for(d in a)if(a.hasOwnProperty(d)&&(c=a[d],c=b.call(a,c,d),c===!1))break}
function H(a,b){a=String(a);if("undefined"!=typeof b)if("[object Object]"==Object.prototype.toString.call(b))return a.replace(/\$\{(.+?)\}/g,function(a,c){var d=b[c];"function"==typeof d&&(d=d(c));return"undefined"==typeof d?"":d});else{var c=Array.prototype.slice.call(arguments,1),d=c.length;return a.replace(/\{(\d+)\}/g,function(a,b){b=parseInt(b,10);return b>=d?a:c[b]})}return a}function ea(a){return String(a).replace(/[-_]\D/g,function(a){return a.charAt(1).toUpperCase()})}
function y(a){return a.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,"")}a:{var I=navigator;if(I.plugins&&I.mimeTypes.length){var J=I.plugins["Shockwave Flash"];J&&J.description&&J.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s)+r/,".")}else if(window.ActiveXObject&&!window.opera)for(var K=10;K>=2;K--)try{var L=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+K);if(L){L.GetVariable("$version").replace(/WIN/g,"").replace(/,/g,".");break a}}catch(ga){}}
function M(a,b){var c=arguments.length>2?[].slice.call(arguments,2):f;return function(){var d="[object String]"==Object.prototype.toString.call(a)?b[a]:a,e=c?c.concat([].slice.call(arguments,0)):arguments;return d.apply(b||d,e)}}if(k&&k<7)try{document.execCommand("BackgroundImageCache",!1,!0)}catch(ha){};function ia(){};function N(){this.u=[]}F(N,ia);function O(){this.v={}}O.prototype.get=function(a){return this.v[a]||""};function ja(a){return ka.get(a).replace(/\$\{([.:a-z0-9_]+)\}/ig,function(a,c){var d=c.match(/:([a-z]+)$/),e;if(d&&d.length>1){e=c.replace(/:[a-z]+$/i,"");d=d[1];d=d.toLowerCase();if(d==="lang"||d==="config")c:{e=("dn."+d+"."+e).split(".");for(var d=window,g;g=e.shift();)if(d[g]!=f)d=d[g];else{e=f;break c}e=d}else throw"Not handled";e=e===f||typeof e=="undefined"?"":e}else e="";return e})}var ka=new O;function P(a){this.u=[];this.children=this.h=this.main=this.view=f;this.n=!0;for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);this.a=0}F(P,N);j("ui.Control",P);h=P.prototype;h.type="";h.skin="";h.id="";h.c="";h.b=function(a){if(this.children){var b=[],c,d;if(arguments.length>1)for(c=1;c<arguments.length;c++)b.push(arguments[c]);for(c=0;c<this.children.length;c++)d=this.children[c],d[a]&&d[a].apply(d,b)}};function la(a){a.view&&a.r();a.b("init");a.a=1}
h.bindModel=function(a){if(a)this.h=a;if(this.h){var b=this,c;this.s&&G(this.s,function(a,e){c=b.h[a];typeof c!=="undefined"&&(b[e]=c)});this.b("bindModel",this.h);this.a=2}};
h.render=function(a){if(a)this.main=a;if(this.main){if(this.c)this.main.id=this.c,this.main.removeAttribute("ui"),this.main.setAttribute("control",this.id),w(this.main,Q(this));if(this.n&&(a=this.main,this.state={},a))a.onmouseover=M(this.I,this),a.onmouseout=M(this.H,this),a.onmousedown=M(this.G,this),a.onmouseup=M(this.J,this);this.b("render");this.a=3}};
h.dispose=function(){this.b("dispose");if(this.parent)this.parent=f;if(this.children){for(var a=this.children.length-1;a>=0;a--)this.children.splice(a,1);this.children=f}if(this.main){if(this.main.childNodes.length)this.main.innerHTML="";this.main.onmouseover=f;this.main.onmouseout=f;this.main.onmousedown=f;this.main.onmouseup=f}this.a=5};
h.m=function(a){if(this.a>=5)a.dispose();else{if(!this.children)this.children=[];for(var b=0;b<this.children.length;b++)if(this.children[b].id===a.id)throw"A control with the same id already exists";b=this.c||this.id;a.c=b?b+"_"+a.id:a.id;this.children.push(a);a.parent=this;if(this.a>=1&&(la(a),this.a>=2&&(a.bindModel(),this.a>=3&&(a.render(),this.a>=4))))a.b("bindEvent"),a.a=4}};
h.removeChild=function(a,b){if(this.children)for(var c=b||!1,d=this.children.length-1;d>=0;d--)if(this.children[d]===a){if(c){if(a.parent=f,a.main.childNodes.length)a.main.innerHTML=""}else a.dispose();this.children.splice(d,1);break}};h.r=function(){if(this.main&&this.view)this.main.innerHTML=ja(this.view),R(S,this.main,this)};h.disable=function(){T(this,"disabled")};
function Q(a,b){if(!a.type)return"";var c="ui-"+a.type.toLowerCase().replace(".","-"),d="skin-"+a.skin;b&&(c+="-"+b,d+="-"+b);a.skin&&(c+=" "+d);return c}function V(a,b){var c=a.c||"";if(b)return c+b;return c}h.I=function(){!this.state.disabled&&!this.state.readonly&&T(this,"hover")};h.H=function(){!this.state.disabled&&!this.state.readonly&&(W(this,"hover"),W(this,"press"))};h.G=function(){this.state.disabled||T(this,"press")};h.J=function(){this.state.disabled||W(this,"press")};
function T(a,b){if(!a.state)a.state={};a.state[b]=1;w(a.main,Q(a,b))}function W(a,b){if(!a.state)a.state={};a.state[b]=f;B(a.main,Q(a,b))}function ma(a){if(!a.state)a.state={};return!!a.state.disabled};function X(a){P.call(this,a)}F(X,P);function Y(){this.L=this.i=f}function na(a,b){var c={};typeof a==="string"&&(a=oa(a));if(!a.id)throw"UI Control must have an id";G(a,function(b,e){typeof b==="string"&&(b.indexOf("@")===0?(c[e]=b.substr(1),delete a[e]):b.indexOf("&")===0&&(a[e]=l(b.substr(1))))});a.s=c;if(b)a.main=b;return new (l("ui."+a.type)||l(a.type))(a)}
function R(a,b,c){if(b&&b.childNodes&&c&&c.m)for(var d,e,g=0;g<b.childNodes.length;g++)d=b.childNodes[g],d.nodeType===1&&((e=d.getAttribute("ui"))?(e=na(e,d),c.m(e),R(a,d,e)):R(a,d,c))}function oa(a){for(var b={},a=a.split(";"),c=a.length,d,e;c--;)if(d=a[c])e=d.split(":"),d=e[0],e=e[1],b[d]?("[object Array]"==Object.prototype.toString.call(b[d])||(b[d]=[b[d]]),b[d].push(e)):b[d]=e;return b}
Y.prototype.get=function(a,b){for(var c=a.split("_"),d=c[0]==="frame"?1:0,e=b||(c[0]==="frame"?this.L:this.i);d<c.length;d++){if(!e)return f;a:{if(e.children)for(var g=0;g<e.children.length;g++)if(e.children[g].id===c[d]){e=e.children[g];break a}e=f}}return e};j("ui.Lib.prototype.get",Y.prototype.get);Y.prototype.dispose=function(){this.i&&this.i.dispose()};var S=new Y;j("ui.util",S);S.t=function(){};E(window,"unload",function(){S.dispose()});function Z(a){P.call(this,a)}F(Z,P);h=Z.prototype;h.o=f;h.bindModel=function(a){Z.e.bindModel.call(this,a);if(typeof this.M!=="undefined")a=this.M,this.o&&(a=this.o.W(a)),this.l(a)};h.render=function(a){Z.e.render.call(this,a);this.Y=this.main.getAttribute("name")};h.l=function(a){this.value=a};h.t=function(){if(!this.rule)return!0;return S.t(this,this.rule)};function $(a){this.datasource=[];P.call(this,a);this.type="combobox";this.form=1;this.q='<div class="'+Q(this,"cur-def")+'">\u8bf7\u9009\u62e9</div>';this.f="-10000px";this.options=this.datasource;this.index=-1;this.K=10}j("ui.ComboBox",$);
$.prototype={U:'<div id="{0}" class="{1}" value="" style="width:{4}px"><nobr>{2}</nobr></div><div class="{3}"></div>',onselect:new Function,B:function(){var a=this.width-20;this.skin=="select-menu"&&(a-=10);return H(this.U,V(this,"cur"),Q(this,"cur"),this.q,Q(this,"btn"),a)},bindModel:function(a){$.e.bindModel.call(this,a);this.options=this.datasource||[]},render:function(a){a=a||this.main;this.main.style.width=this.width+"px";this.main.innerHTML=this.B();this.N();var b=!!this.readOnly;(this.readOnly=
b=!!b)?T(this,"readonly"):W(this,"readonly");!(this.value===f||typeof this.value=="undefined")?this.l(this.value):this.X&&this.j(0);$.e.render.call(this,a)},N:function(){var a,b=this.options.length,c=this.K;a=da(V(this,"layer"));if(!a)a=document.createElement("div"),a.id=V(this,"layer"),a.className=Q(this,"layer"),a.style.top=this.f,a.style.left=this.f,a.style.width=this.width+"px",a.setAttribute("control",this.id),document.body.appendChild(a),this.k=this.z(),E(document,"click",this.k);a.innerHTML=
this.A();if(b>c){var d;d=x(a);b=[];for(d=d.firstChild;d;d=d.nextSibling)d.nodeType==1&&b.push(d);b=b[0].offsetHeight;a.style.height=c*(b+1)+"px"}},T:'<div id="{0}" {9} class="{1}" index="{2}" value="{3}" dis="{4}" cmd="select" onmouseover="{6}" onmouseout="{7}" style="width:{10}px">{8}<nobr>{5}</nobr></div>',S:'<span class="{0}"></span>',A:function(){for(var a=this.options,b=0,c=a.length,d=[],e=Q(this,"item"),g,i,n,ba="ui.util.get('"+this.c+"')",q,ca;b<c;b++){g=e;i=0;n=a[b];q="";n.C&&(q=Q(this,"icon-"+
n.C),q=H(this.S,q));n.style&&(g+=" "+e+"-"+n.style);n.disabled&&(i=1,g+=" "+e+"-disabled");n.value==this.value&&(g+=" "+Q(this,"item-selected"));this.Z&&(ca='title="'+n.text+q+'"');var U=this.width;this.skin=="select-menu"?U-=16:this.skin=="select-button"&&(U-=10);d.push(H(this.T,V(this,"item")+b,g,b,n.value,i,n.text,ba+".itemOverHandler(this)",ba+".itemOutHandler(this)",q,ca,U))}return d.join("")},z:function(){var a=this;return function(b){if(!ma(a)){b=b||window.event;for(b=b.target||b.srcElement;b&&
b.nodeType===1;){var c=b.getAttribute("control"),d=b.getAttribute("index"),e=V(a,"item")+d;if(b.getAttribute("cmd")=="select"&&e==b.id){b.getAttribute("dis")==1?a.p&&(fa(a.p),window.setTimeout(function(){var b=a.p;if(b)b=x(b),b.style.display="none"},3E3)):(a.g(),a.j(parseInt(d,10),!0));return}else if(c==a.id){!a.readOnly&&b.id==V(a)&&a.R();return}b=b.parentNode}a.g()}}},Q:function(){var a=this.main;var b=a,c,d;d=x(b);c=d.nodeType==9?d:d.ownerDocument||d.document;var b=x(b),e=o>0&&c.getBoxObjectFor&&
A(b)=="absolute"&&(b.style.top===""||b.style.left==="");d={left:0,top:0};var g=m&&!p?c.body:c.documentElement;if(b!=g){var i=f;if(b.getBoundingClientRect)b=b.getBoundingClientRect(),d.left=Math.floor(b.left)+Math.max(c.documentElement.scrollLeft,c.body.scrollLeft),d.top=Math.floor(b.top)+Math.max(c.documentElement.scrollTop,c.body.scrollTop),d.left-=c.documentElement.clientLeft,d.top-=c.documentElement.clientTop,m&&!p&&(d.left-=2,d.top-=2);else if(c.getBoxObjectFor&&!e)b=c.getBoxObjectFor(b),c=c.getBoxObjectFor(g),
d.left=b.screenX-c.screenX,d.top=b.screenY-c.screenY;else{i=b;do{d.left+=i.offsetLeft;d.top+=i.offsetTop;if(r>0&&A(i)=="fixed"){d.left+=c.body.scrollLeft;d.top+=c.body.scrollTop;break}i=i.offsetParent}while(i&&i!=b);if(s>0||r>0&&A(b)=="absolute")d.top-=c.body.offsetTop;for(i=b.offsetParent;i&&i!=c.body;){d.left-=i.scrollLeft;if(!s||i.tagName!="TR")d.top-=i.scrollTop;i=i.offsetParent}}}b=this.d();g=c=document;a=(c.compatMode=="BackCompat"?c.body:c.documentElement).clientHeight>d.top+a.offsetHeight+
b.offsetHeight-(g.documentElement.scrollTop||g.body.scrollTop)?d.top+a.offsetHeight:d.top-b.offsetHeight;if(b)b.style.top=a+"px",b.style.left=d.left+"px";T(this,"active")},g:function(){var a=this.d();if(a)a.style.left=this.f,a.style.top=this.f;W(this,"active")},R:function(){this.d().style.left!=this.f?this.g():this.Q()},d:function(){return z(V(this,"layer"))},w:function(){return z(V(this,"cur"))},l:function(a){for(var b=this.d().getElementsByTagName("div"),c=b.length,d=0,e,d=0,c=b.length;d<c;d++)if(e=
b[d].getAttribute("value"),e==a){this.j(d);return}this.value="";this.index=-1;this.j(-1)},j:function(a,b){var c=this.options[a],d;d=c?c.value:f;this.index=a;this.value=d;b===!0&&this.onselect(d,c)===!1||this.O()},O:function(){var a=this.options[this.index],a=a?a.text:this.q,b=this.w();if(b)b.title=String(a||"").replace(/<[^>]+>/g,""),b.innerHTML="<nobr>"+a+"</nobr>";this.P()},P:function(){var a=this.index,b=this.d(),c=f,d=Q(this,"item-selected");if(b)for(c=b.firstChild;c;)c.getAttribute("index")==
a?w(c,d):B(c,d),c=c.nextSibling},disable:function(){$.e.disable.call(this);this.g()},dispose:function(){if(this.k){var a=this.k,b=document,c;"string"==typeof b&&(b=x(b));c="click".replace(/^on/i,"");b.removeEventListener?b.removeEventListener(c,a,!1):b.detachEvent&&b.detachEvent("on"+c,a)}document.body.removeChild(this.d());$.e.dispose.call(this)}};$.prototype.F=function(a){a.getAttribute("dis")!=1&&(a=a.getAttribute("index"),w(V(this,"item")+a,Q(this,"item")+"-hover"))};
$.prototype.itemOverHandler=$.prototype.F;$.prototype.D=function(a){a=a.getAttribute("index");B(V(this,"item")+a,Q(this,"item")+"-hover")};F($,Z);$.prototype.itemOutHandler=$.prototype.D;E(window,"load",function(){X.prototype.r=function(){R(S,this.main,this)};(function(a){var b=S,c=new X({view:"MAIN_PAGE",main:document.getElementById("Main"),n:!1});b.i=c;la(c);c.bindModel(a);c.render();c.b("bindEvent");c.a=4;return c})({value:"baidu",datasource:[{text:"google",value:"google"},{text:"baidu",value:"baidu"}]})});
