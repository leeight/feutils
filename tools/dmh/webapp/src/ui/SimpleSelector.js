/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/SimpleSelector.js
 * desc:    简单选择控件
 * author:  yuanhongliang
 * date:    $Date: 2011-05-07 13:14:27 +0800 (周六, 07 五月 2011) $
 */

goog.require('ui.InputControl');
goog.require('ui.Label');
goog.require('ui.Table');
goog.require('ui.Button');

goog.include('ui/SimpleSelector.html');
goog.include('css/ui-richsel.css');

goog.provide('ui.SimpleSelector');


/**
 * ui.SimpleSelector
 * @constructor
 * @extends {ui.InputControl}
 * @export
 */
ui.SimpleSelector = function(options) {
    this.title = '';
    this.datasource = null;
    this.fields = null;
    this.valueField = null;
    this.value = null;
    this.select = 'multi';
    this.dragable = true;
    ui.InputControl.call(this, options);

    this.view = 'SimpleSelector';
    this.type = 'richsel';
};
ui.SimpleSelector.prototype = function() {

    function onSelect() {
        this.onselect(this.c('list').getSelection());
        this.hide();
    }

    function onCancel() {
        this.oncancel();
        this.hide();
    }

    return {
        onselect: function(selectedItems) {},

        oncancel: function() {},

        bindModel: function(model) {
            ui.SimpleSelector.superClass.bindModel.call(this, model);

            this.c('lblTitle').bindModel({title: this.title});
            this.c('list').bindModel({
                datasource: this.datasource,
                fields: this.fields,
                select: this.select,
                valueField: this.valueField,
                selectedValue: this.value,
                dragable: this.dragable
            });
        },

        render: function(main) {
            ui.SimpleSelector.superClass.render.call(this, main);

            if (this.select != 'multi') {
                this.c('btnSubmit').hide();
            }
        },

        bindEvent: function() {
            ui.SimpleSelector.superClass.bindEvent.call(this);

            if (this.select != 'multi') {
                this.c('list').onselect = baidu.fn.bind(onSelect, this);
            }
            this.c('btnSubmit').onclick = baidu.fn.bind(onSelect, this);
            this.c('btnCancel').onclick = baidu.fn.bind(onCancel, this);
        },

        dispose: function() {
            this.c('list').onselect = null;
            this.c('btnSubmit').onclick = null;
            this.c('btnCancel').onclick = null;

            ui.SimpleSelector.superClass.dispose.call(this);
        },

        getValue: function() {
            var value, selection = this.c('list').getSelection();
            if (this.valueField) {
                if (baidu.lang.isArray(selection)) {
                    value = [];
                    for (var i = 0; i < selection.length; i++) {
                        value.push(selection[i][this.valueField]);
                    }
                } else {
                    value = selection[this.valueField];
                }
            } else {
                value = this.selection;
            }
            return value;
        },

        getParamValue: function() {
            var value = this.getValue();
            if (baidu.lang.isArray(value)) {
                return value.join(',');
            } else {
                return value;
            }
        }
    };
}();
baidu.inherits(ui.SimpleSelector, ui.InputControl);
