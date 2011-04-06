/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Link.js
 * desc:    链接控件
 * author:  zhaolei,erik
 * date:    $Date$
 */

goog.require('ui.Control');

goog.provide('ui.Link');



/**
 * 链接控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.Link = function(options) {
  ui.Control.call(this, options);

  // 类型声明，用于生成控件子dom的id和class
  this.type = 'link';
};
baidu.inherits(ui.Link, ui.Control);


/**
 * @type {?string}
 */
ui.Link.prototype.href;


/**
 * @type {?string}
 */
ui.Link.prototype.text;


/** @inheritDoc */
ui.Link.prototype.render = function(opt_main) {
  var me = this,
      main = opt_main || me.main;

  ui.Link.superClass.render.call(me, main);
  // NOTE 如果没有me.herf，就不需要给链接添加href属性了，否则
  // 就成了<a href="undefined"></a>了
  if (me.main && me.href) {
    me.main.href = me.href;
  }
  if (me.main && me.text) {
    me.main.innerHTML = me.text;
  }

  me.main.onclick = baidu.fn.bind(me.clickHandler, me);
};


/**
 * 追加到某个元素中去.
 * @param {HTMLElement} wrap 父元素.
 */
ui.Link.prototype.appendTo = function(wrap) {
  var main = document.createElement('span');
  wrap.appendChild(main);
  this.main = main;
};


/**
 * @type {?function(Event)}
 */
ui.Link.prototype.onclick = baidu.emptyMethod;


/**
 * @private
 * @param {Event} e 事件对象.
 */
ui.Link.prototype.clickHandler = function(e) {
  var evt = e || window.event,
      rv = this.onclick(evt);
  if (false === rv) {
    baidu.event.stop(evt);
  }
};


/** @inheritDoc */
ui.Link.prototype.dispose = function() {
  this.main.onclick = null;
  this.onclick = null;
  ui.Link.superClass.dispose.call(this);
};
