/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/BaseBox.js
 * desc:    基础选择控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

goog.require('ui.InputControl');
goog.require('ui.events');

goog.provide('ui.BaseBox');

/**
 * 基础选择控件
 * @constructor
 * @extends {ui.InputControl}
 * @description 不直接拿来使用，供CheckBox和RadioBox继承
 * @param {Object} options 控件初始化参数.
 */
ui.BaseBox = function(options) {
    ui.InputControl.call(this, options);
};
baidu.inherits(ui.BaseBox, ui.InputControl);

/**
 * 控件的click事件处理函数.
 */
ui.BaseBox.prototype.onclick = baidu.emptyMethod;

/**
 * @type {string}
 */
ui.BaseBox.prototype.wrapTag;

/**
 * @type {string}
 */
ui.BaseBox.prototype.wrapType;

/**
 * 获取ui.BoxGroup的时候会用到.
 * @type {string}
 */
ui.BaseBox.prototype.boxType;

/**
 * @private
 * @type {string}
 */
ui.BaseBox.prototype.group;

/**
 * @private
 * @type {Object|Array}
 */
ui.BaseBox.prototype.datasource;

/**
 * @private
 * @type {boolean}
 */
ui.BaseBox.prototype.disabled;

/**
 * 设置选中状态
 *
 * @protected
 * @param {boolean} stat 状态.
 */
ui.BaseBox.prototype.setChecked = function(stat) {
    this.getDOM().checked = !!stat;
};

/**
 * 获取选中状态
 *
 * @return {boolean} true选中,false没有选中.
 */
ui.BaseBox.prototype.getChecked = function() {
    return !!(this.getDOM().checked);
};

/**
 * @inheritDoc
 */
ui.BaseBox.prototype.disable = function() {
    ui.BaseBox.superClass.disable.call(this);
    this.main.disabled = 'disabled';
};

/**
 * @inheritDoc
 */
ui.BaseBox.prototype.enable = function() {
    ui.BaseBox.superClass.enable.call(this);
    this.main.removeAttribute('disabled');
};

/**
 * @inheritDoc
 */
ui.BaseBox.prototype.setReadOnly = function(readOnly) {
    ui.BaseBox.superClass.setReadOnly.call(this, readOnly);
    // TODO readOnly -> disabled??
    this.main.disabled = readOnly;
};

/**
 * 设置值
 *
 * @param {string} value
 */
ui.BaseBox.prototype.setValue = function(value) {
    this.getDOM().setAttribute('value', value);
};

/**
 * 获取值
 *
 * @return {string}
 */
ui.BaseBox.prototype.getValue = function() {
    return this.getDOM().getAttribute('value');
};

/**
 * 获取控件的DOM对象
 *
 * @return {Element}
 */
ui.BaseBox.prototype.getDOM = function() {
    return baidu.g(this.domId);
};

/**
 * @inheritDoc
 */
ui.BaseBox.prototype.render = function(opt_main) {
    var me = this,
        main = opt_main || me.main,
        group = me.group,
        data = me.datasource,
        dataType = typeof data,
        label,
        value;

    // 执行未初始化时的初始化
    if (!me.isRender) {
        if (!main ||
            main.tagName != me.wrapTag ||
            main.getAttribute('type') != me.wrapType) {
            return;
        }

        if (!me.formName) {
            me.formName = main.getAttribute('name');
        }

        // 插入点击相关的label
        if (main.title) {
            label = document.createElement('label');
            label.innerHTML = main.title;
            label.className = me.getClass('label');
            baidu.setAttr(label, 'for', me.getId());
            baidu.dom.insertAfter(label, main);
        }

        ui.BaseBox.superClass.render.call(me, main);
        main.disabled = !!me.disabled;

        main.onclick = me._getHandlerClick();
    }

    // 重绘部分，设置checked
    if (me.main) {
        value = me.getValue();

        if (dataType == 'string' || dataType == 'number') {
            me.setChecked(data == value);
        } else if (baidu.lang.isArray(data)) {
            me.setChecked(baidu.array.contains(/** @type {Array}*/ (data), value));
        }

        me.isRender = true;
    }
};

/**
 * onclick事件
 * @return {function(Event)} click事件的处理函数.
 */
ui.BaseBox.prototype._getHandlerClick = function() {
    var me = this;
    return function(e) {
        if (!me.getState('readonly')) {
            // FIXME trigger event也应该触发`onEvent`事件的.
            me.trigger(ui.events.CLICK);
            me.onclick();
        }
    };
};

/**
 * @inheritDoc
 */
ui.BaseBox.prototype.dispose = function() {
    if (this.main) {
        this.main.onclick = null;
    }
    ui.BaseBox.superClass.dispose.call(this);
};
