PLOVR_MODULE_INFO={baidu:["app"],app:[],google:["app"]};PLOVR_MODULE_URIS={baidu:"../output/module/module_baidu.js",app:"../output/module/module_app.js",google:"../output/module/module_google.js"};PLOVR_MODULE_USE_DEBUG_MODE=false;(function(){var am=null,w,q=[];function f(az){return function(){return q[az].apply(this,arguments)}}var o=this;function ac(aA){for(var aA=aA.split("."),aB=o,az;az=aA.shift();){if(aB[az]!=am){aB=aB[az]}else{return am}}return aB}function J(aB,aA){var aC=aB.split("."),aD=o;!(aC[0] in aD)&&aD.execScript&&aD.execScript("var "+aC[0]);for(var az;aC.length&&(az=aC.shift());){!aC.length&&aA!==void 0?aD[az]=aA:aD=aD[az]?aD[az]:aD[az]={}}}var z=[],z=["tpl.html"];var x;function u(){}function X(aA){for(var aA=aA.split("."),aB=window,az;az=aA.shift();){if(aB[az]!=am){aB=aB[az]}else{return am}}return aB}var ai=ai||{};ai.get=function(aA,az){return ai.request(aA,{onsuccess:az,method:"GET"})};ai.post=function(aA,aB,az){return ai.request(aA,{onsuccess:az,method:"POST",data:aB})};ai.request=function(aC,aO){function aK(){if(aN.readyState==4){try{var aQ=aN.status}catch(aP){aE("failure");return}aE(aQ);aQ>=200&&aQ<300||aQ==304||aQ==1223?aE("success"):aE("failure");window.setTimeout(function(){aN.onreadystatechange=new Function;aH&&(aN=am)},0)}}function aB(){if(window.ActiveXObject){try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(aQ){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(aP){}}}if(window.XMLHttpRequest){return new XMLHttpRequest}return am}function aE(aQ){var aQ="on"+aQ,aP=aA[aQ],aR=ai[aQ];aP?aQ!="onsuccess"?aP(aN):aP(aN,aN.responseText):aR&&aQ!="onsuccess"&&aR(aN)}var aO=aO||{},aJ=aO.data||"",aH=aO.async!==!1,aI=aO.username||"",aM=aO.password||"",az=(aO.method||"GET").toUpperCase(),aG=aO.headers||{},aF=aO.cacheable||!1,aA={},aL,aN;for(aL in aO){aA[aL]=aO[aL]}aG["X-Request-By"]="baidu.ajax";try{aN=aB();az=="GET"&&(aJ&&(aC+=(aC.indexOf("?")>=0?"&":"?")+aJ,aJ=am),aF||(aC+=(aC.indexOf("?")>=0?"&":"?")+"b"+(new Date).getTime()+"=1"));aI?aN.open(az,aC,aH,aI,aM):aN.open(az,aC,aH);if(aH){aN.onreadystatechange=aK}az=="POST"&&aN.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");for(aL in aG){aG.hasOwnProperty(aL)&&aN.setRequestHeader(aL,aG[aL])}aE("beforerequest");aN.send(aJ);aH||aK()}catch(aD){aE("failure")}return aN};var n,ap,m,l,Y,r=am;if(r=/msie (\d+\.\d)/i.exec(navigator.userAgent)){x=n=parseFloat(r[1])}ap=/gecko/i.test(navigator.userAgent)&&!/like gecko/i.test(navigator.userAgent);m=document.compatMode=="CSS1Compat";l=/webkit/i.test(navigator.userAgent);if(r=/opera\/(\d+\.\d)/i.exec(navigator.userAgent)){Y=parseFloat(r[1])}var k=k||{},Q={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",rowspan:"rowSpan",valign:"vAlign",usemap:"useMap",frameborder:"frameBorder"};n<8?(Q["for"]="htmlFor",Q["class"]="className"):(Q.htmlFor="for",Q.className="class");var ae=ae||{};ae.opacity=n?{get:function(az){(az=az.style.filter)&&az.indexOf("opacity=")>=0&&az.match(/opacity=([^)]*)/)},set:function(az,aB){var aA=az.style;aA.filter=(aA.filter||"").replace(/alpha\([^\)]*\)/gi,"")+(aB==1?"":"alpha(opacity="+aB*100+")");aA.zoom=1}}:am;function e(aB,aC){for(var aB=at(aB),aA=i(aC).split(/\s+/),az=aA.length,aC=aB.className.split(/\s+/).join(" ");az--;){RegExp("(^| )"+aA[az]+"( |$)").test(aC)&&aA.splice(az,1)}aB.className=i(aC+" "+aA.join(" "))}function at(az){if("string"==typeof az||az instanceof String){return document.getElementById(az)}else{if(az&&az.nodeName&&(az.nodeType==1||az.nodeType==9||az.nodeType==11)){return az}}return am}var W,I=W=at;function F(az,aA){az=at(az);az.className=i(az.className.split(/\s+/).join("  ").replace(RegExp("(^| )("+i(aA).split(/\s+/).join("|")+")( |$)","g")," ").replace(/\s+/g," "))}var U=U||[];function af(){for(var az=U.length,aA=!!window.removeEventListener,aC,aB;az--;){aC=U[az],aB=aC[0],aB.removeEventListener?aB.removeEventListener(aC[1],aC[3],!1):aB.detachEvent&&aB.detachEvent("on"+aC[1],aC[3])}aA?window.removeEventListener("unload",af,!1):window.detachEvent("onunload",af)}window.attachEvent?window.attachEvent("onunload",af):window.addEventListener("unload",af,!1);function v(az,aA,aB){aA=aA.replace(/^on/i,"");"string"==typeof az&&(az=at(az));az.addEventListener?az.addEventListener(aA,aB,!1):az.attachEvent&&az.attachEvent("on"+aA,aB)}function ar(aD,aB){var aA,aC,az=aD.prototype;aC=new Function;aC.prototype=aB.prototype;aC=aD.prototype=new aC;for(aA in az){aC[aA]=az[aA]}aD.superClass=aB.prototype}function T(aC,aB){var aA,az;if("function"==typeof aB){for(az in aC){if(aC.hasOwnProperty(az)&&(aA=aC[az],aA=aB.call(aC,aA,az),aA===!1)){break}}}}function M(aC,aA){aC=String(aC);if("undefined"!=typeof aA){if("[object Object]"==Object.prototype.toString.call(aA)){return aC.replace(/\$\{(.+?)\}/g,function(aD,aF){var aE=aA[aF];"function"==typeof aE&&(aE=aE(aF));return"undefined"==typeof aE?"":aE})}else{var aB=Array.prototype.slice.call(arguments,1),az=aB.length;return aC.replace(/\{(\d+)\}/g,function(aE,aD){aD=parseInt(aD,10);return aD>=az?aE:aB[aD]})}}return aC}function i(az){return az.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g,"")}a:{var ad=navigator;if(ad.plugins&&ad.mimeTypes.length){var p=ad.plugins["Shockwave Flash"];p&&p.description&&p.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s)+r/,".")}else{if(window.ActiveXObject&&!window.opera){for(var V=10;V>=2;V--){try{var h=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+V);if(h){h.GetVariable("$version").replace(/WIN/g,"").replace(/,/g,".");break a}}catch(L){}}}}}function an(aA,az){var aB=arguments.length>2?[].slice.call(arguments,2):am;return function(){var aD="[object String]"==Object.prototype.toString.call(aA)?az[aA]:aA,aC=aB?aB.concat([].slice.call(arguments,0)):arguments;return aD.apply(az||aD,aC)}}if(x&&x<7){try{document.execCommand("BackgroundImageCache",!1,!0)}catch(E){}}function y(){this._modules={};this._moduleUris=this._moduleInfo=this._loader=am}(function(az){az.getInstance=function(){return az.instance_||(az.instance_=new az)}})(y);function d(aA,az){aA._modules[az]=!0}function j(aB,aC){var aA=ag;if(aA._modules[aB]===!0){aC()}else{var az=aA._moduleUris[aB];az&&aA._loader.load(az,aC)}}function g(){this._loadedUrl={}}g.prototype.load=function(az,aD){if(this._loadedUrl[az]===!0){aD()}else{var aB=document.getElementsByTagName("head")[0]||document.documentElement,aA=document.createElement("SCRIPT");aA.type="text/javascript";aA.src=az;var aC=this;x?aA.onreadystatechange=function(){if(!this.readyState||this.readyState=="loaded"||this.readyState=="complete"){aA.onreadystatechange=u,aC._loadedUrl[az]=!0,aD()}}:aA.onload=function(){aC._loadedUrl[az]=!0;aD()};aB.appendChild(aA)}};var ag=y.getInstance();ag._loader=new g;ag._moduleInfo=o.PLOVR_MODULE_INFO;ag._moduleUris=o.PLOVR_MODULE_URIS;d(ag,"app");v(window,"load",function(){v("load-baidu-app","click",function(){j("baidu",function(){var az=ac("baidu.app.start");az&&az()})});v("load-google-app","click",function(){j("google",function(){var az=ac("google.app.start");az&&az()})})});function D(){}function O(){this._listeners=[]}ar(O,D);function B(aA,az){aA._listeners.DONE||(aA._listeners.DONE=[]);aA._listeners.DONE.push(az)}O.prototype.trigger=function(aB){if(this._listeners[aB]){var aA,az=Array.prototype.slice.call(arguments,1);for(aA=0;aA<this._listeners[aB].length;aA++){this._listeners[aB][aA].apply(this,az)}}};function N(){this.container={}}N.prototype.get=function(az){return this.container[az]||""};function ao(az){return G.get(az).replace(/\$\{([.:a-z0-9_]+)\}/ig,function(aB,aA){var aD=aA.match(/:([a-z]+)$/),aE;if(aD&&aD.length>1){aE=aA.replace(/:[a-z]+$/i,"");aD=aD[1];aD=aD.toLowerCase();if(aD==="lang"||aD==="config"){c:{aE=("dn."+aD+"."+aE).split(".");for(var aD=window,aC;aC=aE.shift();){if(aD[aC]!=am){aD=aD[aC]}else{aE=am;break c}}aE=aD}}else{throw"Not handled"}aE=aE===am||typeof aE=="undefined"?"":aE}else{aE=""}return aE})}N.prototype.parse=function(aJ){function aB(aP){if(aE.test(aP)){return aB(aP.replace(aE,function(aR,aQ){return aK[aQ]||aA[aQ]||""}))}return aP}function aN(aP){aP&&aM&&aH.push(aP)}function aI(){aM&&(aM in aK?alert("Template: "+aM+" is exist"):aK[aM]=aH.join("\n"));aM=am}for(var aJ=aJ.split(/\r?\n/),aC=aJ.length,aG=0,az=/<\!--\s*target:\s*([a-zA-Z0-9_]+)\s*--\>/,aD=/<\!--\s*\/target\s*--\>/,aE=/<\!--\s*import:\s*([a-zA-Z0-9_]+)\s*--\>/,aL,aO,aF,aA=this.container,aH=[],aM,aK={};aG<aC;aG++){if(aO=aJ[aG],!(aO.length<=0)){az.lastIndex=-1,(aF=az.exec(aO))?(aF=aF[1],aO=aO.split(az),aN(aO[0]),aI(),aH=[],aM=aF,aN(aO[2])):aD.test(aO)?(aO=aO.split(aD),aN(aO[0]),aI()):aN(aO)}}aI();for(aL in aK){aA[aL]&&alert("Template: "+aL+" already exists!"),aA[aL]=aB(aK[aL])}};var G=new N;function C(az){this._listeners=[];this.children=this.model=this.main=this.view=am;this.autoState=!0;for(var aA in az){az.hasOwnProperty(aA)&&(this[aA]=az[aA])}this.lifePhase=0}ar(C,O);J("ui.Control",C);w=C.prototype;w.type="";w.skin="";w.id="";w.domId="";w._callChildren=function(aC){if(this.children){var az=[],aA,aB;if(arguments.length>1){for(aA=1;aA<arguments.length;aA++){az.push(arguments[aA])}}for(aA=0;aA<this.children.length;aA++){aB=this.children[aA],aB[aC]&&aB[aC].apply(aB,az)}}};w.init=function(){if(this.view&&this.main&&this.view){this.main.innerHTML=ao(this.view),Z(R,this.main,this)}this._callChildren("init");this.lifePhase=1};w.bindModel=function(aB){if(aB){this.model=aB}if(this.model){var az=this,aA;this.refer&&T(this.refer,function(aD,aC){aA=az.model[aD];typeof aA!=="undefined"&&(az[aC]=aA)});this._callChildren("bindModel",this.model);this.lifePhase=2}};w.render=function(az){if(az){this.main=az}if(this.main){if(this.domId){this.main.id=this.domId,this.main.removeAttribute("ui"),this.main.setAttribute("control",this.id),e(this.main,aq(this))}if(this.autoState&&(az=this.main,this.state={},az)){az.onmouseover=an(this.mainOverHandler,this),az.onmouseout=an(this.mainOutHandler,this),az.onmousedown=an(this.mainDownHandler,this),az.onmouseup=an(this.mainUpHandler,this)}this._callChildren("render");this.lifePhase=3}};w.bindEvent=function(){this._callChildren("bindEvent");this.lifePhase=4};w.dispose=function(){this._callChildren("dispose");if(this.parent){this.parent=am}if(this.children){for(var az=this.children.length-1;az>=0;az--){this.children.splice(az,1)}this.children=am}if(this.main){if(this.main.childNodes.length){this.main.innerHTML=""}this.main.onmouseover=am;this.main.onmouseout=am;this.main.onmousedown=am;this.main.onmouseup=am}this.lifePhase=5};w.addChild=function(aA){if(this.lifePhase>=5){aA.dispose()}else{if(!this.children){this.children=[]}for(var az=0;az<this.children.length;az++){if(this.children[az].id===aA.id){throw"A control with the same id already exists"}}az=this.domId||this.id;aA.domId=az?az+"_"+aA.id:aA.id;this.children.push(aA);aA.parent=this;this.lifePhase>=1&&(aA.init(),this.lifePhase>=2&&(aA.bindModel(),this.lifePhase>=3&&(aA.render(),this.lifePhase>=4&&aA.bindEvent())))}};w.removeChild=f(0);function ah(aA,aB){if(!aA.children){return am}for(var az=0;az<aA.children.length;az++){if(aA.children[az].id===aB){return aA.children[az]}}return am}w.disable=f(2);function aq(az,aB){if(!az.type){return""}var aC="ui-"+az.type.toLowerCase().replace(".","-"),aA="skin-"+az.skin;aB&&(aC+="-"+aB,aA+="-"+aB);az.skin&&(aC+=" "+aA);return aC}function al(az,aA){var aB=az.domId||"";if(aA){return aB+aA}return aB}w.getStrCall=f(1);w.mainOverHandler=function(){!this.state.disabled&&!this.state.readonly&&S(this,"hover")};w.mainOutHandler=function(){!this.state.disabled&&!this.state.readonly&&(t(this,"hover"),t(this,"press"))};w.mainDownHandler=function(){this.state.disabled||S(this,"press")};w.mainUpHandler=function(){this.state.disabled||t(this,"press")};function S(aA,az){if(!aA.state){aA.state={}}aA.state[az]=1;e(aA.main,aq(aA,az))}function t(az,aA){if(!az.state){az.state={}}az.state[aA]=am;F(az.main,aq(az,aA))}function ay(az){if(!az.state){az.state={}}return !!az.state.disabled}function b(){this._listeners=[];this.isDone=!1}ar(b,O);b.prototype.start=function(){throw"Not implemented"};function aj(az){az.isDone=!0;az.trigger("DONE",az)}function aa(aA,az){B(aA,az)}function ax(){b.call(this);this.workers=[]}ar(ax,b);function au(az){var aA=new av(z);az.workers.push(aA);az=an(az._workerDone,az);B(aA,az)}ax.prototype._workerDone=function(){throw"Not implemented"};function H(){ax.call(this)}H.prototype={start:function(){this.counter=this.workers.length;if(this.counter===0){aj(this)}else{for(var az=0;az<this.workers.length;az++){this.workers[az].isDone?this._workerDone(this.workers[az]):this.workers[az].start()}}},_workerDone:function(){this.counter--;this.counter===0&&aj(this)}};ar(H,ax);function av(az){b.call(this);this._template=az;this._index=0}ar(av,b);av.prototype.start=function(){aw(this)};function aw(az){az._template.length<=0?az._templateLoaded():ai.request(az._template[az._index],{method:"get",cacheable:!0,onsuccess:an(az._loadTemplateSuccess,az),onfailure:an(az._templateLoaded,az)})}av.prototype._loadTemplateSuccess=function(az){G.parse(az.responseText);this._templateLoaded()};av.prototype._templateLoaded=function(){this._index++;this._index>=this._template.length?aj(this):aw(this)};function P(az){C.call(this,az)}ar(P,C);function K(){this.pagePopup=this.pageMain=am}function ab(aA,az){var aB={};typeof aA==="string"&&(aA=A(aA));if(!aA.id){throw"UI Control must have an id"}T(aA,function(aD,aC){typeof aD==="string"&&(aD.indexOf("@")===0?(aB[aC]=aD.substr(1),delete aA[aC]):aD.indexOf("&")===0&&(aA[aC]=X(aD.substr(1))))});aA.refer=aB;if(az){aA.main=az}return new (X("ui."+aA.type)||X(aA.type))(aA)}function Z(az,aC,aA){if(aC&&aC.childNodes&&aA&&aA.addChild){for(var aE,aD,aB=0;aB<aC.childNodes.length;aB++){aE=aC.childNodes[aB],aE.nodeType===1&&((aD=aE.getAttribute("ui"))?(aD=ab(aD,aE),aA.addChild(aD),Z(az,aE,aD)):Z(az,aE,aA))}}}function A(aB){for(var aC={},aB=aB.split(";"),aA=aB.length,aD,az;aA--;){if(aD=aB[aA]){az=aD.split(":"),aD=az[0],az=az[1],aC[aD]?("[object Array]"==Object.prototype.toString.call(aC[aD])||(aC[aD]=[aC[aD]]),aC[aD].push(az)):aC[aD]=az}}return aC}K.prototype.get=function(aD,az){for(var aB=aD.split("_"),aA=aB[0]==="frame"?1:0,aC=az||(aB[0]==="frame"?this.pagePopup:this.pageMain);aA<aB.length;aA++){if(!aC){return am}aC=ah(aC,aB[aA])}return aC};J("ui.Lib.prototype.get",K.prototype.get);K.prototype.dispose=function(){this.pageMain&&this.pageMain.dispose()};var R=new K;J("ui.util",R);R.validate=u;v(window,"unload",function(){R.dispose()});function s(az){var aA=new H;z.length>0&&au(aA);aa(aA,function(){z=[];az()});aA.start()}function ak(aA,az,aC){var aC=aC||{},aB=R,aA=new P({view:aA,main:az,autoState:!1});aB.pageMain=aA;aA.init();aA.bindModel(aC);aA.render();aA.bindEvent()}})();