/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: form.js 6981 2011-06-29 08:21:10Z kangyongliang $
 *
 **************************************************************************/



/**
 * form.js ~ 2011/02/16 10:46:31
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 6981 $
 * @description
 *
 **/

goog.require('er.FormAction');
goog.require('material.form.Flash');
goog.require('material.form.Image');
goog.require('material.form.Video');

goog.provide('material.Form');


/**
 * form route
 * @constructor
 * @extends {er.FormAction}
 * @export
 */
material.Form = function() {
  er.FormAction.call(this);
};
baidu.inherits(material.Form, er.FormAction);


/**
 * 路由分发，根据product_type分发到不同的Form中去
 * @param {Object} argMap 进入的参数.
 * @return {?er.Action} 新的Action.
 */
material.Form.prototype.enter = function(argMap) {
  var product_type = argMap.paramMap['product_type'] || '0';
  var form = null;

  switch (product_type) {
    case '0':
      form = new material.form.Video();
      break;
    case '1':
    case '2':
    case '3':
      form = new material.form.Flash();
      break;
    case '4':
    case '5':
      form = new material.form.Image();
      break;
    case '6':
      form = new material.form.FloatVideo();
      break;
    case '7':
      form = new material.form.Float();
      break;
  }

  if (form) {
    form.enter(argMap);
  }

  return form;
};



























/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
