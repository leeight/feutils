/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/ListInfo.js
 * desc:    列表信息控件
 * author:  zhaolei,erik
 * date:    $Date$
 */

goog.require('ui.Control');

goog.provide('ui.ListInfo');

/**
 * 列表信息控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.ListInfo = function(options) {
    ui.Control.call(this, options);

    this.type = 'listInfo';
    this.autoState = false;
};

ui.ListInfo.prototype = {
    /**
     * @inheritDoc
     */
    render: function(main) {
        var me = this;

        ui.ListInfo.superClass.render.call(me, main);
        if (me.main) {
            me.main.innerHTML = this.getHtml();
        }
    },

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

        return baidu.format(me.tpl, start, end, me.total);
    },

    /**
     * 控件的html模板
     *
     * @private
     * @type {string}
     */
    tpl: '{0}&nbsp;-&nbsp;{1}条（共{2}条）'
};
baidu.inherits(ui.ListInfo, ui.Control);
