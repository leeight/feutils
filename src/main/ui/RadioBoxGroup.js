/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/RadioBoxGroup.js
 * desc:    RadioBox组控件
 * author:  yuanhongliang
 * date:    $Date$
 */

goog.require('ui.InputControl');

goog.provide('ui.RadioBoxGroup');

/**
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.RadioBoxGroup = function(options) {
    ui.InputControl.call(this, options);

    this.value = null;
    this.datasource = null;
};

ui.RadioBoxGroup.prototype = function() {

    function renderRadioBoxes() {
        this.clearChildren();
        this.main.innerHTML = '';

        var ds = this.datasource, name, value, rb, rbMain;
        if (!ds || !ds.length) {
            return;
        }

        name = this.formName + new Date().getTime().toString(32);
        value = this.value == null ?
                (this.defaultFirst && ds[0].value) : this.value;

        if (!name) {
            throw new Error("can't find name");
        }

        for (var i = 0; i < ds.length; i++) {
            // FIX IE6的bug
            if (baidu.ie == 6) {
                rbMain = document.createElement('<input name = "' + name + '"/>');
            } else {
                rbMain = document.createElement('input');
                rbMain.name = name;
            }

            rbMain.type = 'radio';
            rbMain.value = ds[i].value;
            rbMain.title = ds[i].text;
            this.main.appendChild(rbMain);

            rb = ui.util.createControl({
                type: 'RadioBox',
                id: 'rb' + i,
                datasource: value
            }, rbMain);
            this.addChild(rb);
            if (ds[i].value === value) {
                this.onselect(value);
            }
        }
    }

    function onRadioBoxClick(rb) {
        this.onselect(rb.main.value);
    }

    /**
     * @lends {ui.RadioBoxGroup.prototype}
     */
    return {
        onselect: function(item) {},

        render: function(main) {
            ui.RadioBoxGroup.superClass.render.call(this, main);

            renderRadioBoxes.call(this);
        },

        bindEvent: function() {
            ui.RadioBoxGroup.superClass.bindEvent.call(this);

            for (var i = 0; i < this.children.length; i++) {
                this.children[i].onclick =
                    baidu.fn.bind(onRadioBoxClick, this, this.children[i]);
            }
        },

        dispose: function() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].onclick = null;
            }

            ui.RadioBoxGroup.superClass.dispose.call(this);
        },

        getValue: function() {
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].getChecked()) {
                    return this.children[i].getValue();
                }
            }
            return '';
        }
    };
}();

// FIXME 上面不应该直接给prototype来赋值，否则把这句话放到
// 构造函数后面就不对了
baidu.inherits(ui.RadioBoxGroup, ui.InputControl);
