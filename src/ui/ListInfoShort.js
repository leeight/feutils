/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/ListInfoShort.js
 * desc:    列表信息控件
 * author:  lixiang
 * date:    $Date$
 */

goog.require('ui.ListInfo');

goog.provide('ui.ListInfoShort');

/**
 * 列表信息控件
 * @constructor
 * @extends {ui.ListInfo}
 * @param {Object} options 控件初始化参数.
 */
ui.ListInfoShort = function(options) {
    ui.ListInfo.call(this, options);
    this.type = 'listInfoShort';
};

ui.ListInfoShort.prototype = {

    /**
     * 获取控件的html
     *
     * @private
     * @return {string}
     */
    getHtml: function() {
        var me = this,
            start = me.start,
            end = me.end;

        if (!baidu.lang.hasValue(me.start)) {
            return '';
        }

        if (start <= 0 || end <= 0) {
            start = 0;
            end = 0;
            me.total = 0;
        }

        return baidu.format(me.tpl, me.total);
    },

    /**
     * 控件的html模板
     *
     * @private
     * @type {string}
     */
    tpl: '共{0}行'
};
baidu.inherits(ui.ListInfoShort, ui.ListInfo);
