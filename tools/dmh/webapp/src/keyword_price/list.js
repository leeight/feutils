/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * desc:    人群设定模块
 * author:  刘磊
 */

goog.require('er.ListAction');
goog.require('keywordPrice.config');
goog.require('keywordPrice.data');
goog.require('ui.List');

goog.include('keyword_price/list.html');

goog.provide('keywordPrice.List');

/**
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
keywordPrice.List = function() {
    er.ListAction.call(this);
};
keywordPrice.List.prototype = {
    view: 'keywordPriceList',
    CONTEXT_INITER_LIST: ['initFields'],
    initFields: function(query, callback) {
        this.model.fields = keywordPrice.config.listFields;
        callback();
    },
    afterInit: function(page) {
        this.list = page.c('list');
        this.requesterList = keywordPrice.data.list;
    }
};
baidu.inherits(keywordPrice.List, er.ListAction);
