/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    base/DataSource.js
 * desc:    DataSource接口定义
 * author:  yuanhongliang
 * date:    $Date: 2011-04-28 23:44:45 +0800 (周四, 28 四月 2011) $
 */

goog.require('base');

goog.provide('base.DataSource');

/**
 * DataSource接口定义
 * @constructor
 * @extends {base.Object}
 */
base.DataSource = function() {
    base.Object.call(this);
};
baidu.inherits(base.DataSource, base.Object);

/**
 * 从数据源获取数据.
 * @param {string|Object} params 参数.
 * @param {Function} callback 处理结果的回掉函数.
 * @protected
 */
base.DataSource.prototype.getData = function(params, callback) {
  throw 'Not implemented';
};
