/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * Repeater.js ~ 2011/02/18 18:02:47
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * 根据datasource和tpl来动态的创建一些控件出来
 * FIXME 如果现有的er.template足够强大，就不需要这个控件了
 **/

goog.require('ui.Control');

goog.provide('ui.Repeater');


/**
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.Repeater = function(options) {
  /**
   * 数据源
   * @private
   * @type {Array.<Object>}
   */
  this['datasource'] = null;

  /**
   * 模板
   * @private
   * @type {string}
   */
  this['tpl'] = '';

  /**
   * @type {string}
   */
  this._html = '';

  this.type = 'repeater';

  ui.Control.call(this, options);
};
baidu.inherits(ui.Repeater, ui.Control);


/**
 * 获取html内容，也就是通过datasource和tpl进行build之后的内容
 * @return {string} html.
 */
ui.Repeater.prototype.getMainHtml = function() {
  if (!this._html) {
    var tpl = this['tpl'],
        html = [];
    baidu.array.each(this['datasource'], function(item) {
      html.push(baidu.format(tpl, item));
    });
    this._html = html.join('');
  }

  return this._html;
};

/** @inheritDoc */
ui.Repeater.prototype.bindModel = function(model) {
  // 初始化自己的model
  ui.Repeater.superClass.bindModel.call(this, model);

  var main = this.main,
      html = this.getMainHtml();

  this.clearChildren();
  main.innerHTML = html;
  ui.util.buildControlTree(main, this);

  // 初始化子控件的model
  ui.Repeater.superClass.bindModel.call(this, model);
};

/** @inheritDoc */
ui.Repeater.prototype.render = function() {
  ui.Repeater.superClass.render.call(this);
};


/** @inheritDoc */
ui.Repeater.prototype.dispose = function() {
  if (this.main) {
    baidu.dom.remove(this.main);
  }
  ui.Repeater.superClass.dispose.call(this);
};





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
