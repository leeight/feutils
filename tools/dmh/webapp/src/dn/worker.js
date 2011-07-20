/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: worker.js 5156 2011-04-27 04:15:29Z liyubei $
 *
 **************************************************************************/



/**
 * src/dn/worker.js ~ 2011/03/21 18:49:50
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5156 $
 * @description
 * Template Loader
 * dn/init.js要用,test的时候也要用，所以独立出来了。
 **/

// FIXME goog.require('er.template.parse');
goog.require('base.AbstractWorker');
goog.require('dn');

goog.provide('dn.TemplateWorker');

/**
 * 模板加载器
 * @constructor
 * @extends {base.AbstractWorker}
 * @param {Array.<string>} template 需要加载的模版列表.
 */
dn.TemplateWorker = function(template) {
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
baidu.inherits(dn.TemplateWorker, base.AbstractWorker);

/**
 * @inheritDoc
 */
dn.TemplateWorker.prototype.start = function() {
  this._loadTemplate();
};

/**
 * 加载一个模版
 * @private
 */
dn.TemplateWorker.prototype._loadTemplate = function() {
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
dn.TemplateWorker.prototype._loadTemplateSuccess = function(xhr) {
  er.template.parse(xhr.responseText);
  this._templateLoaded();
};

/**
 * 模版加载完毕，不管成功还是失败
 * @private
 */
dn.TemplateWorker.prototype._templateLoaded = function() {
  this._index++;

  if (this._index >= this._template.length) {
    this.done();
  } else {
    this._loadTemplate();
  }
};




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
