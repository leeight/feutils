/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: Flash.js 5280 2011-05-06 06:54:36Z liyubei $
 *
 **************************************************************************/



/**
 * ../../ui/Flash.js ~ 2011/03/08 19:15:20
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5280 $
 * @description
 * Flash控件
 **/

goog.require('ui.Control');
goog.require('ui.events');

goog.provide('ui.Flash');



/**
 * Flash控件
 * @constructor
 * @extends {ui.Control}
 */
ui.Flash = function(options) {
  ui.Control.call(this, options);

  /**
   * @type {Object.<Array>}
   */
  this._delayedInvokes = {};
};
baidu.inherits(ui.Flash, ui.Control);


/**
 * 创建Flash时候的参数
 * @type {Object}
 */
ui.Flash.prototype.options;


/**
 * @type {boolean}
 */
ui.Flash.prototype._loaded = false;


/**
 * 当Flash加载完毕之后，会触发这个方法，然后通过
 * control_id去找到对应的ui.Flash实例。
 * @param {string} control_id 控件的id.
 */
ui.Flash.onLoad = function(control_id) {
  var flash = ui.util.get(control_id);
  if (flash) {
    flash.trigger(ui.events.LOAD);
  }
};


/**
 * 只是针对map.swf有用，其它的没用
 * @param {string} control_id 控件的id.
 * @param {string} area_id 选择的地域id.
 */
ui.Flash.onViewAreaChange = function(control_id, area_id) {
  var flash = ui.util.get(control_id);
  if (flash) {
    flash.trigger(ui.events.VIEWAREA_CHANGE, control_id, area_id);
  }
};


/**
 * 用来查询Flash是否加载成功了.
 * @return {boolean} true加载成功,false还未加载成功.
 */
ui.Flash.prototype.isLoaded = function() {
  return this._loaded;
};


/** @inheritDoc */
ui.Flash.prototype.render = function(opt_main) {
  ui.Flash.superClass.render.call(this, opt_main);

  var main = opt_main || this.main;

  // 先清空，然后再创建
  main.innerHTML = '';

  // 不要修改原来的options，万一被多个Flash实例公用就不好处理了。
  var options = baidu.object.clone(this.options);
  var vars = options['vars'] || {};
  options['id'] = this.getId('native');
  vars['id'] = this.getId();
  vars['js'] = 'ui.Flash.';
  options['vars'] = vars;

  baidu.swf.create(options, main);
};


/** @inheritDoc */
ui.Flash.prototype.bindEvent = function() {
  ui.Flash.superClass.bindEvent.call(this);

  var me = this;
  this.addListener(ui.events.LOAD, function() {
    me._loaded = true;
    var flash = me.getNative();
    baidu.object.each(me._delayedInvokes, function(args, methodName) {
      if (flash[methodName]) {
        flash[methodName].apply(flash, args);
      }
    });
  });

  this.addListener(ui.events.VIEWAREA_CHANGE, function() {
    // ignore
  });
};


/**
 * 调用Flash控件的方法，应为有可能业务逻辑调用的适合Flash还没有加载完毕
 * 所以需要Flash控件自己来出来这个事情.
 * @param {string} methodName 方法的名字.
 * @param {...*} var_args 变长参数.
 */
ui.Flash.prototype.invokeMethod = function(methodName, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (this._loaded) {
    var flash = this.getNative();
    if (flash[methodName]) {
      flash[methodName].apply(flash, args);
    }
  } else {
    this._delayedInvokes[methodName] = args;
  }
};


/**
 * 获取浏览器原生的Flash对象
 * @return {HTMLElement}
 */
ui.Flash.prototype.getNative = function() {
  return baidu.swf.getMovie(this.getId('native'));
};


/** @inheritDoc */
ui.Flash.prototype.dispose = function() {
  if (this.main) {
    this.main.innerHTML = '';
  }
  ui.Flash.superClass.dispose.call(this);
};





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
