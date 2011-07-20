/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: form.js 5258 2011-05-06 01:09:15Z liyubei $
 *
 **************************************************************************/



/**
 * form.js ~ 2011/02/18 23:24:30
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5258 $
 * @description
 * 计费名域名管理
 **/

goog.require('base.BaseModel');
goog.require('base.LocalWorker');
goog.require('base.ParallelWorkerManager');
goog.require('base.RequestWorker');
goog.require('charge.data');

goog.require('er.FormAction');

goog.require('ui.Button');
goog.require('ui.Form');
goog.require('ui.Label');
goog.require('ui.SubmitButton');
goog.require('ui.TextInput');

goog.include('charge/form.html');

goog.provide('charge.Form');

/**
 * @constructor
 * @extends {er.FormAction}
 * @export
 */
charge.Form = function() {
  er.FormAction.call(this);

  this.model = new base.BaseModel({
    // TODO
  });

  this.view = 'chargeForm';
};
baidu.inherits(charge.Form, er.FormAction);


/** @const */
charge.Form.prototype.BACK_LOCATION = '/charge/list';


/** @inheritDoc */
charge.Form.prototype.afterInit = function(page) {
  // FIXME 在这个地方初始化感觉怪怪的
  this.form = /** @type {ui.Form} */ (page.getChild('form'));
  this.btnSubmit = /** @type {ui.SubmitButton} */ (this.form.getChild('btnSubmit'));
  this.btnCancel = /** @type {ui.Button} */ (this.form.getChild('btnCancel'));
  this.requester = this.isModify() ?
                   charge.data.update :
                   charge.data.create;
};


/**
 * @inheritDoc
 */
charge.Form.prototype.initModel = function(argMap, callback) {
  var me = this,
      pwm = new base.ParallelWorkerManager();

  if (this.isModify()) {
    var worker = new base.RequestWorker(
        '/charge/read', 'id=' + argMap.paramMap['id'],
        function(data) {
          if (data.success == 'true') {
            me._initModelImpl(data.result);
          } else {
            // TODO ???
          }
        });

    pwm.addWorker(worker);
  } else {
    var worker = new base.LocalWorker({
      'dn_name' : '',
      'domain' : ''
    }, function(result) {
      me._initModelImpl(result);
    });
    pwm.addWorker(worker);
  }

  // 设置需要显示的文本
  this.model.formHeaderText = this.isModify() ?
                              '修改计费名/域名' :
                              '添加计费名/域名';
  this.model.formBlockTitle = this.model.formHeaderText;

  pwm.addDoneListener(callback);
  pwm.start();
};


/**
 * 初始化model中的字段
 * @private
 * @param {Object} result 请求的结果.
 */
charge.Form.prototype._initModelImpl = function(result) {
  this.model['dn_name'] = result['dn_name'];
  this.model['domain'] = result['domain'];
};

/**
 * @inheritDoc
 */
charge.Form.prototype.enterDocumentInternal = function() {
  if (this.isModify()) {
    // 弄得看起来是不能编辑的样子，实际上不是这样子的.
    var dn_name = this.page.c('form').c('dn-name');
    if (dn_name) {
      dn_name.setReadOnly(true);
      baidu.addClass(dn_name.getRoot(), dn_name.getClass('disabled'));
    }
  }
};

/** @inheritDoc */
charge.Form.prototype.getExtraParam = function() {
  if (this.isModify()) {
    return 'id=' + this.argMap.paramMap['id'];
  }
  return '';
};















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
