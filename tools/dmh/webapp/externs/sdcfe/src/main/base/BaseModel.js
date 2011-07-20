/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    base/BaseModel.js
 * desc:    所有数据模型的基类，从PropertyChangeNotifier继承
 * author:  yuanhongliang
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

goog.require('baidu');
goog.require('base');
goog.require('base.PropertyChangeNotifier');

goog.provide('base.BaseModel');

/**
 * 所有数据模型的基类
 * @constructor
 * @extends {base.PropertyChangeNotifier}
 * @param {Object=} opt_data 用来进行初始化的数据.
 */
base.BaseModel = function(opt_data) {
    base.PropertyChangeNotifier.call(this);

    baidu.object.extend(this, opt_data || {});
};
baidu.inherits(base.BaseModel, base.PropertyChangeNotifier);
