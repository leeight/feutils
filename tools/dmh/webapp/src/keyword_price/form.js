/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * desc:    人群设定模块
 * author:  刘磊
 */

goog.require('base.ParallelWorkerManager');
goog.require('base.RequestWorker');
goog.require('dn.lang');
goog.require('er.FormAction');
goog.require('ui.Button');
goog.require('ui.Form');
goog.require('ui.Label');
goog.require('ui.Repeater');
goog.require('ui.SubmitButton');
goog.require('ui.TextInput');

goog.include('keyword_price/form.html');

goog.provide('keywordPrice.Form');

/**
 * @constructor
 * @extends {er.FormAction}
 * @export
 */
keywordPrice.Form = function() {
  er.FormAction.call(this);
};
keywordPrice.Form.prototype = {
  view: 'keywordPriceForm',
  initModel: function(argMap, callback) {
    var me = this,
        typeList = /** @type {Array} */ (er.context.get('productPriceTypeList')),
        pwm = new base.ParallelWorkerManager();

    me.model['repeater.ds'] = baidu.array.filter(typeList, function(item) {
      return (item['value'].indexOf(',') == -1);
    });
    me.model['repeater.tpl'] = er.template.get('keywordPriceTpl');

    if (this.isModify()) {
      var worker = new base.RequestWorker('/keyword_price/read',
                                          'id=' + argMap.paramMap['id'],
                                          function(data) {
        if (data.success == 'true') {
          me._initModelImpl(data.page.result[0]);
        } else {
          // TODO ???
        }
      });

      pwm.addWorker(worker);
    }

    pwm.addDoneListener(callback);
    pwm.start();
  },
  _initModelImpl: function(data) {
    var me = this;
    baidu.object.each(data['price'], function(value, key) {
      me.model['price[' + key + ']'] = value;
    });
  },
  afterInit: function() {
    this.form = this.page.getChild('form');
    this.btnSubmit = this.form.getChild('btnSubmit');
    this.btnCancel = this.form.getChild('btnCancel');
    this.requester = keywordPrice.data.update;
  }
};
baidu.inherits(keywordPrice.Form, er.FormAction);
