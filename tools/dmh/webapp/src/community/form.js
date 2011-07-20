/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: form.js 7019 2011-06-30 12:32:02Z lixiang05 $
 *
 **************************************************************************/



/**
 * form.js ~ 2011/02/17 23:36:01
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 7019 $
 * @description
 * 生活圈创建和修改
 **/


goog.require('base.BaseModel');
goog.require('base.ParallelWorkerManager');
goog.require('base.RequestWorker');

goog.require('community.config');
goog.require('community.data');

goog.require('dn.lang');
goog.require('er.FormAction');
goog.require('er.template');

goog.require('ui.Button');
goog.require('ui.Form');
goog.require('ui.Label');
goog.require('ui.Repeater');
goog.require('ui.SubmitButton');
goog.require('ui.TextInput');

goog.include('community/form.html');

goog.provide('community.Form');

/**
 * @constructor
 * @extends {er.FormAction}
 * @export
 */
community.Form = function() {
  er.FormAction.call(this);

  this.model = new base.BaseModel({
    // TODO
  });

  this.view = 'communityForm';
};
baidu.inherits(community.Form, er.FormAction);


/**
 * @const {string}
 */
community.Form.prototype.BACK_LOCATION = '/community/list';


/** @inheritDoc */
community.Form.prototype.initModel = function(argMap, callback) {
  var me = this,
      pwm = new base.ParallelWorkerManager();

  me.model['repeater.ds'] =
      baidu.array.filter(/** @type {Array} */(er.context.get('productPriceTypeList')), function(item) {
    return (item['value'].indexOf(',') == -1);
  });
  me.model['repeater.tpl'] = er.template.get('communityPriceTpl');

  if (this.isModify()) {
    var worker = new base.RequestWorker(
        '/community/read', 'id=' + argMap.paramMap['id'],
        function(data) {
          if (data['success'] == 'true') {
            me._initModelImpl(data.result);
          } else {
            // TODO ???
          }
        });

    pwm.addWorker(worker);
  } else {
    //cpm, cpv价格默认为100
    me.model['sale_price[0]'] = 100;
  }

  // 设置需要显示的文本
  this.model.formHeaderText = this.isModify() ?
                              '修改生活圈' :
                              '添加生活圈';
  this.model.formBlockTitle = this.model.formHeaderText;

  pwm.addDoneListener(callback);
  pwm.start();
};


/**
 * 更新model，数据可能来自server，也可能是默认值
 * @private
 * @param {Object} data 需要更新的数据
 * {
 *   "id" : '',
 *   "name" : '',
 *   "sale_price" : {
 *     "1" : "xx",
 *     "2" : "xx"
 *   }
 * }.
 */
community.Form.prototype._initModelImpl = function(data) {
  var me = this;
  baidu.object.each(data['sale_price'], function(value, key) {
    me.model['sale_price[' + key + ']'] = value;
  });
  me.model['name'] = data['name'];
};


/** @inheritDoc */
community.Form.prototype.enterDocument = function() {
  // XXX
};


/** @inheritDoc */
community.Form.prototype.afterInit = function() {
  // FIXME 在这个地方初始化感觉怪怪的
  this.form = this.page.getChild('form');
  this.btnSubmit = this.form.getChild('btnSubmit');
  this.btnCancel = this.form.getChild('btnCancel');
  this.requester = this.isModify() ?
                   community.data.update :
                   community.data.create;
};


/** @inheritDoc */
community.Form.prototype.initBehaviorInternal = function(page) {
  // TODO baidu.base(this, 'initBehavior');

};


/** @inheritDoc */
community.Form.prototype.getExtraParam = function() {
  if (this.isModify()) {
    return 'id=' + this.argMap.paramMap['id'];
  }

  return '';
};


















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
