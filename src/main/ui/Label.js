/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Label.js
 * desc:    标签显示控件
 * author:  zhaolei,erik
 * date:    $Date$
 */

goog.require('ui.Control');

goog.provide('ui.Label');



/**
 * 标签显示控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.Label = function(options) {
  ui.Control.call(this, options);

  // 类型声明，用于生成控件子dom的id和class
  this.type = 'label';
};
baidu.inherits(ui.Label, ui.Control);


/**
 * @type {string}
 */
ui.Label.prototype.text;


/** @inheritDoc */
ui.Label.prototype.render = function(opt_main) {
  var me = this;
  var main = opt_main || me.main;

  ui.Label.superClass.render.call(me, main);
  if (main && me.text) {
    main.innerHTML = me.text;
  }
};


/**
 * 设置显示的内容
 * @param {string} content 需要设置的内容.
 */
ui.Label.prototype.setContent = function(content) {
  if (this.main) {
    this.text = content;
    this.main.innerHTML = content;
  }
};
