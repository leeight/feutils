/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    dn/notice.js
 * desc:    系统提示信息
 * author:  zhaolei,erik
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

goog.require('dn');
goog.require('er.context');

goog.provide('dn.notice');

(function() {
    var ID = 'Notice',
        TEXT_ID = 'NoticeText',
        ICON_ID = 'NoticeIcon',
        KEY = 'NOTICE_HTML',
        CLASS_NAME = 'NOTICE_CLASS_NAME';
    /**
     * 设置系统提示信息
     *
     * @param {string} html     提示信息字符串.
     * @param {string=} opt_clsName  提示信息图标样式名.
     */
    dn.notice = function(html, opt_clsName) {
        // 默认为nike
        var clsName = opt_clsName || 'dn-notice-icon';
        er.context.set(KEY, html);
        er.context.set(CLASS_NAME, clsName);
    };

    /**
     * 显示系统提示信息
     *
     * @public
     */
    dn.notice.open = function() {
        var html = er.context.get(KEY);
        if (html) {
            baidu.g(TEXT_ID).innerHTML = html;
            baidu.g(ICON_ID).className = er.context.get(CLASS_NAME);
            baidu.show(ID);
        } else {
            baidu.hide(ID);
        }
        er.context.set(KEY, '');
    };

    /**
     * 关闭系统提示信息
     *
     * @public
     */
    dn.notice.close = function() {
        baidu.hide(ID);
    }
})();
