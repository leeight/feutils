/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/TextInput.js
 * desc:    文本输入框控件
 * author:  zhaolei,erik
 * date:    $Id: TextInput.js 5280 2011-05-06 06:54:36Z liyubei $
 */

goog.require('ui.InputControl');

goog.provide('ui.TextInput');

/**
 * 文本输入框组件
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.TextInput = function(options) {
    ui.InputControl.call(this, options);
    this.form = 1;

    var value = this.value === 0 ? 0 : (this.value || '');
    this.value = baidu.decodeHTML(value);
};
baidu.inherits(ui.TextInput, ui.InputControl);

/**
 * 类似placeholder的东东.
 * @type {?string}
 */
ui.TextInput.prototype.virtualValue;

/**
 * 聚焦的时候是否自动选中文本内容.
 * @type {boolean}
 */
ui.TextInput.prototype.autoSelect;

/**
 * 获取文本输入框的值
 * @return {string} 输入框的值.
 */
ui.TextInput.prototype.getValue = function() {
    return this.main.value;
};

/**
 * 设置文本输入框的值
 * @param {string} value 需要设置的值.
 */
ui.TextInput.prototype.setValue = function(value) {
    this.main.value = baidu.decodeHTML(value);
    if (value) {
        this._focusHandler();
    } else {
        this._blurHandler();
    }
};

/**
 * 设置输入控件的title提示
 * @param {string} title 提示文字.
 */
ui.TextInput.prototype.setTitle = function(title) {
    this.main.setAttribute('title', title);
};

/** @inheritDoc */
ui.TextInput.prototype.disable = function() {
    ui.TextInput.superClass.disable.call(this);
    this.main.disabled = 'disabled';
};

/** @inheritDoc */
ui.TextInput.prototype.enable = function() {
    ui.TextInput.superClass.enable.call(this);
    this.main.removeAttribute('disabled');
};

/**
 * 设置控件为只读
 * @param {boolean} readOnly true只读，false可读写.
 */
ui.TextInput.prototype.setReadOnly = function(readOnly) {
    ui.TextInput.superClass.setReadOnly.call(this, readOnly);

    this.main.readOnly = readOnly;
};

/** @inheritDoc */
ui.TextInput.prototype.render = function(opt_main) {
    var me = this,
        main = opt_main || me.main,
        tagName = main.tagName,
        inputType = main.getAttribute('type');

    // 判断是否input或textarea输入框
    if ((tagName == 'INPUT' && (inputType == 'text' || inputType == 'password')) ||
        (tagName == 'TEXTAREA')) {
        me.type = tagName == 'INPUT' ? 'text' : 'textarea'; // 初始化type用于样式

        ui.TextInput.superClass.render.call(this, main);

        // 绘制宽度和高度
        if (me.width) {
            main.style.width = me.width + 'px';
        }
        if (me.height) {
            main.style.height = me.height + 'px';
        }

        // 绑定事件
        main.onkeypress = me.getPressHandler();
        var changeHandler = me.getChangeHandler();
        if (baidu.ie) {
            main.onpropertychange = changeHandler;
        } else {
            baidu.on(main, 'input', changeHandler);
        }
        me.changeHandler = changeHandler;

        // 设置readonly状态
        me.setReadOnly(!!me.readOnly);

        main.onfocus = baidu.fn.bind(me._focusHandler, me);
        main.onblur = baidu.fn.bind(me._blurHandler, me);
    }

    if (!me.value && me.virtualValue) {
        me.main.value = me.virtualValue;
        baidu.addClass(me.main, me.getClass('virtual'));
    } else {
        me.main.value = me.value;
    }
};

/**
 * 获焦事件处理函数
 */
ui.TextInput.prototype._focusHandler = function() {
    var me = this,
        virtualValue = me.virtualValue,
        main = me.main;

    baidu.removeClass(main, me.getClass('virtual'));
    if ((virtualValue && me.getValue() == virtualValue) ||
        me.autoSelect) {
        // XXX: Fix Chrome select bug.
        setTimeout(function() { main.select(); }, 0);
    }
};

/**
 * 失焦事件处理函数
 */
ui.TextInput.prototype._blurHandler = function() {
    var me = this,
        virtualValue = me.virtualValue,
        main = me.main,
        value = me.getValue();

    if (virtualValue
        && (value == '' || value == virtualValue)
    ) {
        main.value = virtualValue;
        baidu.addClass(main, me.getClass('virtual'));
    }
};

/**
 * 获取键盘敲击的事件handler
 *
 * @private
 * @return {function(Event)}
 */
ui.TextInput.prototype.getPressHandler = function() {
    var me = this;
    return function(e) {
        e = e || window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == 13) {
            return me.onenter();
        }
    };
};

/**
 * 按下回车的时候，触发的函数.
 */
ui.TextInput.prototype.onenter = baidu.emptyMethod;

/**
 * @private
 * @return {function(Event)}
 */
ui.TextInput.prototype.getChangeHandler = function() {
    var me = this;
    return function(e) {
        if (baidu.ie) {
            var evt = window.event;
            if (evt.propertyName == 'value') {
                me.onchange();
            }
        } else {
            me.onchange();
        }
    };
};

/**
 * 当输入的内容更改的时候，触发的函数.
 */
ui.TextInput.prototype.onchange = baidu.emptyMethod;

/**
 * 获焦并选中文本
 */
ui.TextInput.prototype.focusAndSelect = function() {
    this.main.select();
};

/** @inheritDoc */
ui.TextInput.prototype.dispose = function() {
    // 卸载main的事件
    var main = this.main;
    main.onkeypress = null;
    main.onchange = null;
    main.onpropertychange = null;
    main.onfocus = null;
    main.onblur = null;
    baidu.un(main, 'input', this.changeHandler);

    this.changeHandler = null;
    ui.TextInput.superClass.dispose.call(this);
};
