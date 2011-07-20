/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    order/list.js
 * desc:    订单行列表
 * author:  yuanhongliang
 * date:    $Date: 2011-05-06 21:45:10 +0800 (周五, 06 五月 2011) $
 */

goog.require('dn.lang');
goog.require('er.ListAction');
goog.require('er.context');
goog.require('order.data');
goog.require('ui.Calendar');
goog.require('ui.ComboBox');
goog.require('ui.Form');
goog.require('ui.PagableList');

goog.require('ui.SubmitButton');
goog.require('ui.TextInput');

goog.include('order/list.html');

goog.provide('order.List');

/**
 * 订单行列表
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
order.List = function() {
    er.ListAction.call(this);
};
order.List.prototype = {
    view: 'orderList',

    CONTEXT_INITER_LIST: [
        'initStatus'
    ],

    initStatus: function(query, callback) {
        this.model.allStatus = er.context.get('orderStatusFilterList');
        callback();
    },

    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = order.data.list;
    }
};
baidu.inherits(order.List, er.ListAction);
