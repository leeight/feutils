/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * app/worker.js ~ 2011/03/21 18:49:50
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * Template Loader
 * dn/init.js要用,test的时候也要用，所以独立出来了。
 **/

goog.require('baidu');
goog.require('base.AbstractWorker');
goog.require('er.template');

goog.provide('app.Worker');

/**
 * 模板加载器
 * @constructor
 * @extends {base.AbstractWorker}
 * @param {Array.<string>} template 需要加载的模版列表.
 */
app.Worker = function(template) {
    base.AbstractWorker.call(this);

    /**
     * @private
     */
    this._template = template;

    /**
     * @type {number}
     */
    this._index = 0;
};
baidu.inherits(app.Worker, base.AbstractWorker);

/**
 * @inheritDoc
 */
app.Worker.prototype.start = function() {
  this._loadTemplate();
};

/**
 * 加载一个模版
 * @private
 */
app.Worker.prototype._loadTemplate = function() {
  if (this._template.length <= 0) {
    this._templateLoaded();
    return;
  }

  var url = this._template[this._index];
  baidu.ajax.request(url, {
    'method': 'get',
    'cacheable': true,
    'onsuccess': baidu.fn.bind(this._loadTemplateSuccess, this),
    'onfailure': baidu.fn.bind(this._templateLoaded, this)
  });
};

/**
 * 模版加载成功，解析.
 * @private
 */
app.Worker.prototype._loadTemplateSuccess = function(xhr) {
  er.template.parse(xhr.responseText);
  this._templateLoaded();
};

/**
 * 模版加载完毕，不管成功还是失败
 * @private
 */
app.Worker.prototype._templateLoaded = function() {
  this._index++;

  if (this._index >= this._template.length) {
    this.done();
  } else {
    this._loadTemplate();
  }
};




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
