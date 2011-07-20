/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    base/ListDataSource.js
 * desc:    PagableList控件使用的数据源
 * author:  yuanhongliang
 * date:    $Date: 2011-04-28 23:44:45 +0800 (周四, 28 四月 2011) $
 */

goog.require('base.DataSource');

goog.provide('base.ListDataSource');
goog.provide('base.RemoteListDataSource');

/**
 * PagableList控件使用的数据源抽象类
 * @constructor
 * @extends {base.DataSource}
 */
base.ListDataSource = function() {
    base.DataSource.call(this);
};
base.ListDataSource.prototype = function() {
    return {
        getData: function(params, callback) {
            this.getDataInternal(params.pageSize, params.pageNo,
                params.orderBy, params.order, callback);
        },

        getDataInternal: function(pageSize, pageNo, orderBy, order, callback) {
            throw 'Not implemented';
        }
    };
}();
baidu.inherits(base.ListDataSource, base.DataSource);

/**
 * 远程数据源实现类
 * @constructor
 * @extends {base.ListDataSource}
 * @param {Function} requester 远程数据请求函数.
 * @param {Function=} opt_getExtraParam 其他参数获取函数，可选.
 */
base.RemoteListDataSource = function(requester, opt_getExtraParam) {
    base.ListDataSource.call(this);

    this.requester = requester;
    if (opt_getExtraParam) {
        this.getExtraParam = opt_getExtraParam;
    }
};
base.RemoteListDataSource.prototype = function() {
    return {
        getDataInternal: function(pageSize, pageNo, orderBy, order, callback) {
            var params = [],
                extraParam = this.getExtraParam();
            params.push('page.pageSize=' + encodeURIComponent(pageSize));
            params.push('page.pageNo=' + encodeURIComponent(pageNo));
            params.push('page.orderBy=' + encodeURIComponent(orderBy));
            params.push('page.order=' + encodeURIComponent(order));
            extraParam && params.push(extraParam);
            this.requester(params.join('&'), callback);
        },

        getExtraParam: function() {
            return null;
        }
    };
}();
baidu.inherits(base.RemoteListDataSource, base.ListDataSource);
