/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: InputControl.js 5208 2011-05-04 03:27:47Z liyubei $
 *
 **************************************************************************/



/**
 * ui/InputControl.js ~ 2011/02/16 10:46:31
 * @author yuanhongliang(yuanhongliang@baidu.com), leeight(liyubei@baidu.com)
 * @version $Revision: 5208 $
 * @description
 *
 **/

goog.require('base.IConverter');
goog.require('ui.Control');

goog.provide('ui.InputControl');



/**
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件的初始化参数.
 */
ui.InputControl = function(options) {
  ui.Control.call(this, options);
};
baidu.inherits(ui.InputControl, ui.Control);


/**
 * 验证规则
 * @type {?string|Array.<string>}
 */
ui.InputControl.prototype.rule = null;


/**
 * 转换器
 * @private
 * @type {?base.IConverter}
 */
ui.InputControl.prototype.converter = null;

/**
 * FIXME 貌似只有order/list这个地方用到了
 * @type {string}
 * @private
 */
ui.InputControl.prototype.paramValue;

/**
 * 表单控件的名字.
 * @type {string}
 */
ui.InputControl.prototype.formName;

/**
 * 验证失败之后的错误提示信息
 * @type {string}
 */
ui.InputControl.prototype.errorMessage;

/** @inheritDoc */
ui.InputControl.prototype.bindModel = function(model) {
  ui.InputControl.superClass.bindModel.call(this, model);

  // FIXME 此时是不合适的，bindModel是在render之前调用的
  // 因为不能确定调用setValue的影响面，因为调用这个控件的
  // setValue的时候，控件的资源并没有真正的初始化完毕，
  // 例如ui.Calendar的这个问题。
  if (typeof this.paramValue !== 'undefined') {
    this.setParamValue(this.paramValue);
  }
};


/** @inheritDoc */
ui.InputControl.prototype.render = function(opt_main) {
  ui.InputControl.superClass.render.call(this, opt_main);

  this.formName = this.main.getAttribute('name');
  // if (typeof this.paramValue !== 'undefined') {
  //  this.setParamValue(this.paramValue);
  // }
};


/**
 * 获取控件的值
 * @param {boolean=} opt_raw 是否获取原始用户输入数据.
 * @return {string|Object} 控件的值.
 */
ui.InputControl.prototype.getValue = function(opt_raw) {
  return this.value;
};


/**
 * 设置控件的值
 * @param {Object|string} value 控件的值.
 */
ui.InputControl.prototype.setValue = function(value) {
  this.value = value;
};

/**
 * @param {base.IConverter} converter 转化器.
 */
ui.InputControl.prototype.setConverter = function(converter) {
  this.converter = converter;
};

/**
 * 获取表单提交时，控件值的字符串参数表现形式
 * @return {string} encodeURIComponent编码之后的值.
 */
ui.InputControl.prototype.getParamValue = function() {
  var value = this.getValue();
  if (this.converter) {
    value = this.converter.convert(value);
    return value;
  }
  return encodeURIComponent(/** @type {string} */(value));
};


/**
 * 表单回绑时，控件所绑定的参数值
 * @param {string} paramValue 参数值.
 */
ui.InputControl.prototype.setParamValue = function(paramValue) {
  var value = paramValue;
  if (this.converter) {
    value = this.converter.convertBack(value);
  }
  this.setValue(value);
};


/**
 * 验证控件的值
 * @return {boolean} true验证通过，false验证失败.
 */
ui.InputControl.prototype.validate = function() {
  if (!this['rule']) {
    return true;
  }

  return ui.util.validate(this, this['rule']);
};


/**
 * 显示错误信息，常用于后端验证错误显示
 * @param {string} errorMessage 需要显示的错误信息.
 */
ui.InputControl.prototype.showError = function(errorMessage) {
  this['errorMessage'] = errorMessage;
  ui.util.validate(this, 'backendError,this');
  this['errorMessage'] = null;
};

/**
 * FIXME 和全局的函数hideError有以来关系了...
 * 隐藏验证错误信息.
 */
ui.InputControl.prototype.hideError = function() {
  ui.util.validate.hideError(this.main);
};

/**
 * 设置控件为readOnly
 * @param {*} readOnly 是否设置为只读.
 */
ui.InputControl.prototype.setReadOnly = function(readOnly) {
  readOnly = !!readOnly;
  this.readOnly = readOnly;

  if (readOnly) {
    this.setState('readonly');
  } else {
    this.removeState('readonly');
  }
};


/**
 * 判断控件是否只读
 * @return {boolean} true只读状态,false不是.
 */
ui.InputControl.prototype.isReadOnly = function() {
  return this.getState('readonly');
};
