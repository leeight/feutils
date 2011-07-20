/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Form.js
 * desc:    表单控件
 * author:  yuanhongliang
 * date:    $Date: 2011-05-05 00:09:47 +0800 (周四, 05 五月 2011) $
 */

goog.require('ui.BaseBox');
goog.require('ui.Control');
goog.require('ui.InputControl');

goog.provide('ui.Form');

/**
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化的配置项.
 * @export
 */
ui.Form = function(options) {
    ui.Control.call(this, options);
};
baidu.inherits(ui.Form, ui.Control);

/**
 * @param {ui.Control} control Form控件.
 * @param {Array.<ui.InputControl>} inputControls Input控件集合.
 */
ui.Form.CollectInputControls = function(control, inputControls) {
    if (control instanceof ui.InputControl) {
        inputControls.push(control);
    } else if (control.children) {
        for (var i = 0; i < control.children.length; i++) {
            ui.Form.CollectInputControls(control.children[i], inputControls);
        }
    }
};

/**
 * 提交请求，一般是在er.FormAction里面被赋值了
 * @type {?function(string)}
 */
ui.Form.prototype.onsubmit;

/**
 * @private
 * @type {Array.<ui.InputControl>}
 */
ui.Form.prototype.inputControls;

/**
 * @private
 * 获取表单内的所有从InputControl继承的控件
 */
ui.Form.prototype.getInputControls = function() {
    if (!this.inputControls) {
        this.inputControls = [];
        ui.Form.CollectInputControls(this, this.inputControls);
    }

    // FIXME 会缓存第一次的结果，如果有动态的改变，可能就出问题了
    return this.inputControls;
};

/**
 * XXX 大部分情况是通过ui/SubmitButton.js的onclick事件来触发的
 * 验证表单控件，通过则提交
 */
ui.Form.prototype.validateAndSubmit = function() {
    if (this.validate()) {
        this.submit();
    }
};

/**
 * 验证所有的表单控件
 * @return {boolean} 验证结果.
 */
ui.Form.prototype.validate = function() {
    var inputControls = this.getInputControls(),
        result = true;
    for (var i = 0; i < inputControls.length; i++) {
        // 不对disabled和readonly的控件进行验证
        if (inputControls[i].isDisabled() || inputControls[i].isReadOnly()) {
            continue;
        }
        result &= inputControls[i].validate();
    }
    return !!result;
};

/**
 * 获取表单参数
 * @private
 * @return {string} 表单参数.
 */
ui.Form.prototype.getParams = function() {
    var inputControls = this.getInputControls(),
        params = [],
        control,
        key,
        value,
        group = {};

    for (var i = 0; i < inputControls.length; i++) {
        control = inputControls[i];
        // 不对disabled和没有勾选的控件取值
        if (control.isDisabled() ||
            (control instanceof ui.BaseBox && ! /** @type {ui.BaseBox} */(control).getChecked())) {
            continue;
        }
        if (control.formName) {
            key = control.formName;
            value = control.getParamValue();
            if (control.group) {
                // 对于有group要求的控件，用","分隔合并作为值
                if (!group[key]) {
                    group[key] = [];
                }
                group[key].push(value);
            } else {
                params.push(key + '=' + value);
            }
        } else if (control.getParamString) {
            params.push(control.getParamString());
        }
    }

    for (key in group) {
        params.push(key + '=' + group[key].join(','));
    }
    return params.join('&');
};

/**
 * 提交表单
 */
ui.Form.prototype.submit = function() {
    if (this.onsubmit) {
        this.onsubmit(this.getParams());
    }
};
