/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Button.js
 * desc:    按钮控件
 * author:  zhaolei,erik
 * date:    $Date$
 */
goog.require('ui.Control');
goog.include('css/ui-button.css');

goog.provide('ui.Button');



/**
 * 按钮控件
 *
 * 支持Themes：不同样式、尺寸的按钮
 * 按钮状态：normal, over, down, active, disable
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 * @export
 */
ui.Button = function(options) {
  ui.Control.call(this, options);
  // FIXME 避免被重写掉，最好修改成uitype之类的东东
  /**
   * 控件的类型
   * @type {string}
   */
  this.type = 'button';
};
baidu.inherits(ui.Button, ui.Control);

/**
 * 生成控件的模版
 * @type {string}
 */
ui.Button.prototype.tplButton = '<div class="ui-button-bg-left"></div><div id="{2}" class="{1}">{0}</div>';


/**
 * 文本上的内容
 * @noalias
 * @type {string}
 */
ui.Button.prototype.content = 'button';


/**
 * 默认的onclick事件执行函数
 * 不做任何事，容错
 * @type {Function}
 */
ui.Button.prototype.onclick;


/**
 * @private
 * @return {string}
 */
ui.Button.prototype.getMainHtml = function() {
  var me = this;

  return baidu.format(
      me.tplButton,
      me.content,
      me.getClass('label'),
      me.getId('label')
  );
};


/**
 * 设置为可用
 *
 * @protected
 */
ui.Button.prototype.enable = function() {
  ui.Button.superClass.enable.call(this);
  this.removeState('hover');
};


/**
 * 设置是否为Active状态
 *
 * @protected
 * @param {boolean} stat 状态.
 */
ui.Button.prototype.active = function(stat) {
  var state = 'active';

  if (stat) {
    this.setState(state);
  } else {
    this.removeState(state);
  }
};


/** 
 * @inheritDoc 
 */
ui.Button.prototype.render = function(opt_main) {
  ui.Button.superClass.render.call(this, opt_main);

  var me = this,
      main = me.main;

  if (main.tagName != 'DIV') {
    return;
  }

  var innerDiv = main.firstChild;
  if (innerDiv && innerDiv.tagName != 'DIV') {
    me.content = main.innerHTML;
  }

  main.innerHTML = me.getMainHtml();

  // 设定最小宽度为60px
  if (main.offsetWidth < 60 && main.offsetWidth > 0) {
    baidu.G(me.getId('label')).style.width = '40px';
  }

  // 初始化状态事件
  main.onclick = baidu.fn.bind(this.clickHandler, this);
};


/**
 * @protected
 */
ui.Button.prototype.clickHandler = function() {
  if (!this.isDisabled()) {
    if (baidu.lang.isFunction(this.onclick)) {
      this.onclick();
    }
  }
};


/**
 * 设置按钮上面的文字内容
 * @param {string} label 需要显示的文字.
 */
ui.Button.prototype.setLabel = function(label) {
  baidu.G(this.getId('label')).innerHTML = label;
};


/**
 * 获取按钮上面的文字
 * @return {string} 文本内容.
 */
ui.Button.prototype.getLabel = function() {
  return baidu.G(this.getId('label')).innerHTML;
};


/** @inheritDoc */
ui.Button.prototype.dispose = function() {
  this.main.onclick = null;
  this.onclick = null;
  ui.Button.superClass.dispose.call(this);
};
