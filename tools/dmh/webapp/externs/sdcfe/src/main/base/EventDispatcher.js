/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:        base/EventDispatcher.js
 * desc:        事件派发器
 * author:    yuanhongliang
 * date:        $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

goog.require('baidu');
goog.require('base.Object');

goog.provide('base.EventDispatcher');



/**
 * 事件派发器，需要实现事件的类从此类继承
 * @constructor
 * @extends {base.Object}
 */
base.EventDispatcher = function() {
    base.Object.call(this);

    this._listeners = [];
};
baidu.inherits(base.EventDispatcher, base.Object);


/**
 * 添加监听器
 *
 * @public
 * @param {string} eventType 事件类型.
 * @param {Function} listener 监听器.
 */
base.EventDispatcher.prototype.addListener = function(eventType, listener) {
    if (!this._listeners[eventType]) {
        this._listeners[eventType] = [];
    }
    this._listeners[eventType].push(listener);
};


/**
 * 移除监听器
 *
 * @param {string} eventType 事件类型.
 * @param {Function} listener 监听器.
 */
base.EventDispatcher.prototype.removeListener = function(eventType, listener) {
    if (!this._listeners[eventType]) {
        return;
    }
    for (var i = this._listeners[eventType].length - 1; i >= 0; i--) {
        if (this._listeners[eventType][i] === listener) {
            this._listeners[eventType].splice(i, 1);
            break;
        }
    }
};


/**
 * 触发事件
 *
 * @param {string} eventType 事件类型.
 * @param {...*} var_args 自定义参数.
 * @return {boolean} 返回值.
 */
base.EventDispatcher.prototype.trigger = function(eventType, var_args) {
    if (!this._listeners[eventType]) {
        return true;
    }
    var i, args = Array.prototype.slice.call(arguments, 1), result = true;
    for (i = 0; i < this._listeners[eventType].length; i++) {
        if (false === this._listeners[eventType][i].apply(this, args)) {
            result = false;
        }
    }
    return result;
};
