/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * path:    ui/Hidden.js
 * desc:    隐藏的输入型表单控件
 * author:  yuanhongliang
 * date:    $Date$
 */
goog.require("ui.Control");

goog.provide("ui.Hidden");

/**
 * 隐藏输入型表单控件类
 * @constructor
 * @extends {ui.InputControl}
 */
ui.Hidden = function(options) {
    ui.InputControl.call(this, options);
};
ui.Hidden.prototype = function() {
    return {
        /**
         * @inheritDoc
         */
        render: function(main) {
            ui.Hidden.superClass.render.call(this, main);

            baidu.hide(this.main);
        },
        
        /**
         * @inheritDoc
         */
        getValue: function(raw) {
            return this.value || '';
        }
    };
}();
baidu.inherits(ui.Hidden, ui.InputControl);
