/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Mask.js
 * desc:    页面遮盖控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

goog.require('baidu');
goog.require('ui');

goog.provide('ui.Mask');

/**
 * ui.Mask
 * @constructor
 * @export
 */
ui.Mask = function() {
  this.id = 'clbMask';
  this.clazz = 'ui-mask';
  this.privateId = '';

  var me = this;
  this.resizeHandler = function() {
    me.repaintMask(me.getMask());
  }
};
baidu.addSingletonGetter(ui.Mask);

/**
 * 遮盖层初始化
 * @private
 */
ui.Mask.prototype.init = function() {
  var el = document.createElement('div');
  el.id = this.id;
  el.className = this.clazz;
  document.body.appendChild(el);
  return el;
};

/**
 * 重新绘制遮盖层的位置
 *
 * @private
 * @param {Element} mask 遮盖层元素.
 */
ui.Mask.prototype.repaintMask = function(mask) {
  var width = baidu.page.getWidth(),
      height = baidu.page.getHeight();

  mask.style.width = width + 'px';
  mask.style.height = height + 'px';
};

/**
 * 获取遮盖层dom元素
 *
 * @private
 * @return {HTMLElement} 获取到的Mask元素节点.
 */
ui.Mask.prototype.getMask = function() {
  var mask = baidu.g(this.id);
  if (!mask) {
    this.init();
  }
  return baidu.g(this.id);
};

/**
 * 显示遮盖层
 * @param {string=} id ????.
 */
ui.Mask.prototype.show = function(id) {
  this.privateId = this.privateId || id;

  var mask = this.getMask();
  this.repaintMask(mask);
  mask.style.display = 'block';
  baidu.on(window, 'resize', this.resizeHandler);
};

/**
 * 隐藏遮盖层
 * @param {string=} id ???.
 */
ui.Mask.prototype.hide = function(id) {
  if (!this.privateId || id == this.privateId) {
    this.getMask().style.display = 'none';
    baidu.un(window, 'resize', this.resizeHandler);
    this.privateId = '';
  }
};

/**
 * @param {string=} id
 */
ui.Mask.show = function(id) {
  ui.Mask.getInstance().show(id);
};

/**
 * @param {string=} id
 */
ui.Mask.hide = function(id) {
  ui.Mask.getInstance().hide(id);
};
