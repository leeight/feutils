/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    base/BaseModel.js
 * desc:    所有数据模型的基类，从PropertyChangeNotifier继承
 * author:  yuanhongliang
 * date:    $Date: 2011-04-28 23:44:45 +0800 (周四, 28 四月 2011) $
 */


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
