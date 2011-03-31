/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/CheckBoxGroup.js
 * desc:    RadioBox组控件
 * author:  yuanhongliang
 * date:    $Date$
 */

goog.require('ui.InputControl');

goog.provide('ui.CheckBoxGroup');

/**
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.CheckBoxGroup = function(options) {
    ui.InputControl.call(this, options);

    this.value = null;
    this.datasource = null;
    this.children = [];
};

ui.CheckBoxGroup.prototype = function() {

    function renderCheckBoxes() {
        this.clearChildren();
        this.main.innerHTML = '';

        var ds = this.datasource, name, value, cb, cbMain, values, checked;
        if (!ds || !ds.length) {
            return;
        }

        name = this.formName + new Date().getTime().toString(32);

        value = this.value == null ?
                (this.defaultFirst && ds[0].value) : this.value;

        values = value.split(',');

        if (!name) {
            throw new Error("can't find name");
        }

        for (var i = 0; i < ds.length; i++) {
            checked = false;
            baidu.each(values, function(value) {
                if (ds[i].value === value) {
                    checked = true;
                }
            });

            cbMain = document.createElement('input');
            cbMain.type = 'checkbox';
            cbMain.name = name;
            cbMain.value = ds[i].value;
            cbMain.title = ds[i].text;
            this.main.appendChild(cbMain);

            cb = ui.util.createControl({
                type: 'CheckBox',
                id: 'cb' + i,
                datasource: checked ? ds[i].value : null
            }, cbMain);
            this.addChild(cb);
            if (checked) {
                this.onselect(ds[i].value);
            }
        }
    }

    function onCheckBoxClick(cb) {
        this.onselect(cb.main.value);
    }

    /**
     * @lends {ui.CheckBoxGroup.prototype}
     */
    return {
        onselect: function(item) {},

        render: function(main) {
        	var me = this;
            ui.CheckBoxGroup.superClass.render.call(this, main);

            renderCheckBoxes.call(this);
        },

        bindEvent: function() {
            ui.CheckBoxGroup.superClass.bindEvent.call(this);

            for (var i = 0; i < this.children.length; i++) {
                this.children[i].onclick = baidu.fn.bind(onCheckBoxClick, this, this.children[i]);
            }
        },

        rebindModel: function() {
            ui.CheckBoxGroup.superClass.rebindModel.call(this);
            this.bindEvent();
        },

        dispose: function() {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].onclick = null;
            }

            ui.CheckBoxGroup.superClass.dispose.call(this);
        },

        getValue: function() {
        	var rtn = [];
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].getChecked()) {
                    rtn.push(this.children[i].getValue());
                }
            }
            return rtn.join(',');
        },

        getParamValue: function() {
            return this.getValue();
        }
    };
}();

baidu.inherits(ui.CheckBoxGroup, ui.InputControl);
