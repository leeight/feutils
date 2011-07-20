/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    dn/listHelper.js
 * desc:    表格列信息辅助拼装
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 09:09:15 +0800 (周五, 06 五月 2011) $
 */


goog.provide('dn.listHelper');

dn.listHelper = {

    /**
     * 获得操作列的HTML片段
     *
     * @param {Array.<Object>} items 链接MAP.
     * @return {string}
     */
    operation: function(items) {
        var tplCntr = '<ul class="list-table-operation">{0}</ul>',
            tplItem = '<li><a href="{1}"{2}{3}>{0}</a></li>',
            len = items.length,
            i = 0,
            html = [],
            item;

        for (; i < len; i++) {
            item = items[i];
            html.push(baidu.format(tplItem,
                                   item.title,
                                   item.location,
                                   item.blank ? ' target="_blank"' : '',
                                   (item.onclick ? ' onclick="' + item.onclick + '"' : '')
            ));
        }

        return baidu.format(tplCntr,
                            html.join(''));
    }

};
