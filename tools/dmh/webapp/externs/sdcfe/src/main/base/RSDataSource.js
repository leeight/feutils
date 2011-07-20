/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    base/RSDataSource.js
 * desc:    PagableList控件使用的数据源
 * author:  yuanhongliang
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

/**
 * RichSelector使用的数据源抽象类
 * @constructor
 * @extends {base.DataSource}
 */
base.RSDataSource = function() {
    base.DataSource.call(this);
};
base.RSDataSource.prototype = function() {
    return {
        getData: function(params, callback) {
            this.getDataInternal(params.keyword, params.pageSize, params.pageNo, callback);
        },

        getDataInternal: function(keyword, pageSize, pageNo, callback) {
            throw 'Not implemented';
        }
    };
}();
baidu.inherits(base.RSDataSource, base.DataSource);

/**
 * 远程数据源实现类
 * @constructor
 * @extends {base.RSDataSource}
 * @param {Function} requester 远程数据请求函数.
 */
base.RemoteRSDataSource = function(requester) {
    base.RSDataSource.call(this);

    this.requester = requester;
};
base.RemoteRSDataSource.prototype = function() {
    return {
        getDataInternal: function(keyword, pageSize, pageNo, callback) {
            var params = [],
                extraParam = this.getExtraParam();
            params.push('keyword=' + encodeURIComponent(keyword));
            params.push('page.pageSize=' + encodeURIComponent(pageSize));
            params.push('page.pageNo=' + encodeURIComponent(pageNo));
            extraParam && params.push(extraParam);
            this.requester(params.join('&'), callback);
        },

        getExtraParam: function() {
            return null;
        }
    };
}();
baidu.inherits(base.RemoteRSDataSource, base.RSDataSource);
