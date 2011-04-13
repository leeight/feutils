/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * List.js ~ Mar 10, 2011 4:05:07 PM
 * @author yuanhongliang(yuanhongliang@baidu.com)
 * @version $Revision$
 * @description 不分页的列表控件
 **/

goog.require('ui');
goog.require('ui.Table');

goog.provide('ui.List');

/**
 * 不分页的列表控件类
 * @constructor
 * @extends {ui.Control}
 */
ui.List = function(options) {
    this.datasource = null;
    this.fields = null;
    this.orderBy = '';
    this.order = '';
    this.subrow = false;
    this.select = 'multi';

    ui.Control.call(this, options);
    this.view = 'List';
};

ui.List.prototype = function() {

    function getDataCallback(data) {
        var page = data.page;

        this.ongetdata(data.page.result);

        this.getChild('listTable').rebindModel({
            listFields: this.fields,
            result: page.result,
            order: page.order,
            orderBy: page.orderBy,
            subrow: this.subrow,
            select: this.select,
            skin: this.skin
        });
    }

    /**
     * 表格排序
     *
     * @private
     * @param {string} field 排序字段.
     * @param {string} order 正序|倒序.
     */
    function onListSorted(field, order) {
        var fieldName = field.field;
        this.orderBy = fieldName;
        this.order = order;
        this.onstatechange(this.getState());
    }

    function onListSelected(selectedItems) {
        this.onlistselect(selectedItems);
    }

    function onSubRowOpened(index) {
        var container = this.getChild('listTable').getSubrow(index),
            item = this.getChild('listTable').result[index];
        this.onsubrowopen(container, item);
    }

    return {

        onlistselect: function(selectedItems) {},

        onsubrowopen: function(container, item) {},

        onstatechange: function(pagableList) {},

        ongetdata: function(data) {},

        getState: function() {
            return {
                pageSize: 9999,
                pageNo: 1,
                orderBy: this.orderBy,
                order: this.order
            };
        },

        getData: function() {
            var params = this.getState();
            this.datasource.getData(params, baidu.fn.bind(getDataCallback, this));
        },

        bindEvent: function() {
            var listTable = this.getChild('listTable');

            listTable.onselect = baidu.fn.bind(onListSelected, this);
            listTable.onsubrowopen = baidu.fn.bind(onSubRowOpened, this);
            listTable.onsort = baidu.fn.bind(onListSorted, this);
        },

        dispose: function() {
            var listTable = this.getChild('listTable');

            listTable.onselect = null;
            listTable.onsubrowopen = null;
            listTable.onsort = null;

            ui.List.superClass.dispose.call(this);
        }
    };
}();
baidu.inherits(ui.List, ui.Control);
