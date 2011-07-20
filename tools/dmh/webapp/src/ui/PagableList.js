/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/PagableList.js
 * desc:    按钮控件
 * author:  yuanhongliang
 * date:    $Date: 2011-05-05 17:45:59 +0800 (周四, 05 五月 2011) $
 */

goog.require('base.DataSource');
goog.require('ui.ComboBox');
goog.require('ui.Control');
goog.require('ui.ListInfo');
goog.require('ui.Pager');
goog.require('ui.Table');

goog.include('ui/PagableList.html');

goog.provide('ui.PagableList');

/**
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 * @export
 */
ui.PagableList = function(options) {
    /**
     * @type {?base.DataSource}
     */
    this.datasource = null;

    /**
     * @type {Array.<Object>}
     */
    this.fields = null;

    /**
     * @type {number}
     */
    this.pageNo = 1;

    /**
     * @type {number}
     */
    this.pageSize = 15;

    /**
     * @type {number}
     */
    this.pagerCount = 5;

    /**
     * @type {string}
     */
    this.orderBy = '';

    /**
     * @type {string}
     */
    this.order = '';

    /**
     * @type {boolean}
     */
    this.subrow = false;

    /**
     * @type {string}
     */
    this.select = 'multi';

    /**
     * @type {string}
     */
    this.view = 'PagableList';

    ui.Control.call(this, options);
};

ui.PagableList.prototype = function() {

    /**
     * @type {ListDataType} data 后端返回的数据列表.
     */
    function getDataCallback(data) {
        var page = data.page,
            totalCount = page.totalCount,
            pageNo = page.pageNo,
            pageSize = page.pageSize,
            totalPage = Math.ceil(totalCount / pageSize),
            startIndex = pageSize * (pageNo - 1) + 1,
            endIndex = pageSize * pageNo;

        // 开始和结束条目容错
        startIndex = Math.min(startIndex, totalCount);
        endIndex = Math.min(endIndex, totalCount);

        this.getChild('listTable').rebindModel({
            'listFields': this.fields,
            'result': page.result,
            'order': page.order,
            'orderBy': page.orderBy,
            'subrow': this.subrow,
            'select': this.select
        });
        this.getChild('listPager').rebindModel({
            'pagerCount': this.pagerCount,
            'page': pageNo,
            'totalPage': totalPage
        });
        this.getChild('listInfo').rebindModel({
            'startIndex': startIndex,
            'endIndex': endIndex,
            'totalCount': totalCount
        });
        this.getChild('pageSize').rebindModel({
            'pageSize': pageSize
        });
    }

    /**
     * 表格排序
     *
     * @private
     * @param {Object} field 排序字段.
     * @param {string} order 正序|倒序.
     */
    function onListSorted(field, order) {
        var fieldName = field.field;
        this.orderBy = fieldName;
        this.order = order;
        this.onstatechange(this.getCurrentState());
    }

    /**
     * 页数切换
     *
     * @private
     * @param {number} page 页数.
     */
    function onPageNoChanged(page) {
        this.pageNo = page;
        this.onstatechange(this.getCurrentState());
    }

    /**
     * 每页显示个数变化切换
     *
     * @private
     * @param {number} size 每页显示个数.
     */
    function onPageSizeChanged(size) {
        this.resetPageNo();
        this.pageSize = size;
        this.onstatechange(this.getCurrentState());
    }

    function onListSelected(selectedItems) {
        this.onlistselect(selectedItems);
    }

    function onSubRowOpened(index) {
        var container = this.getChild('listTable').getSubrow(index),
            item = this.getChild('listTable').model.result[index];
        this.onsubrowopen(index, item);
    }

    /**
     * @lends {ui.PagableList.prototype}
     */
    return {

        /**
         * 选中某一行的时候触发这个事件.
         * @param {*} selectedItems 选中的那一行数据源中的数据.
         * @see {@code ui.Table.prototype.onselect}
         */
        onlistselect: function(selectedItems) {},

        /**
         * @param {number} index 选中的那一行.
         * @param {*} item 展开的那一行数据源中的数据.
         */
        onsubrowopen: function(index, item) {},

        /**
         * @param {Object} pagableList 当前的状态.
         */
        onstatechange: function(pagableList) {},

        /**
         * @private
         * @return {Object}
         */
        getCurrentState: function() {
            return {
                pageSize: this.pageSize,
                pageNo: this.pageNo,
                orderBy: this.orderBy,
                order: this.order
            };
        },

        /**
         * 请求数据并展示结果
         */
        getData: function() {
            var params = this.getCurrentState();
            this.datasource.getData(params, baidu.fn.bind(getDataCallback, this));
        },

        /**
         * 重置页码
         */
        resetPageNo: function() {
            this.pageNo = 1;
        },

        /**
         * @inheritDoc
         */
        bindEvent: function() {
            var listTable = this.getChild('listTable'),
                listPager = this.getChild('listPager'),
                pageSize = this.getChild('pageSize');

            listTable.onselect = baidu.fn.bind(onListSelected, this);
            listTable.onsubrowopen = baidu.fn.bind(onSubRowOpened, this);
            listTable.onsort = baidu.fn.bind(onListSorted, this);
            listPager.onselect = baidu.fn.bind(onPageNoChanged, this);
            pageSize.onselect = baidu.fn.bind(onPageSizeChanged, this);
        },

        /**
         * @inheritDoc
         */
        dispose: function() {
            var listTable = this.getChild('listTable'),
                listPager = this.getChild('listPager'),
                pageSize = this.getChild('pageSize');

            listTable.onselect = null;
            listTable.onsubrowopen = null;
            listTable.onsort = null;
            listPager.onselect = null;
            pageSize.onselect = null;

            ui.PagableList.superClass.dispose.call(this);
        }
    };
}();
baidu.inherits(ui.PagableList, ui.Control);
