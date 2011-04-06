/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/SummaryInfo.js
 * desc:    汇总信息控件
 * author:  zhaolei,erik
 * date:    $Date$
 */

/**
 * 列表信息控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.SummaryInfo = function(options) {
    //this.initOptions(options);
	ui.Control.call(this, options);
    this.type = 'summaryInfo';
};

ui.SummaryInfo.prototype = {
    /**
     * 渲染控件
     *
     * @protected
     * @param {Object} main 控件挂载的DOM.
     */
    render: function(main) {
        var me = this;

        //ui.Base.render.call(me, main, false);
        ui.SummaryInfo.superClass.render.call(me, main);

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
            fields = me.fields,
            data = me.datasource;

        if (fields instanceof Array
            && data instanceof Array) {
            var len = fields.length, i,
                len2 = data.length, j, dataItem,
                total = {}, item, itemField,
                html = [];

            // 处理初始化值
            for (i = 0; i < len; i++) {
                item = fields[i];
                total[item.field] = item.defaultValue;
            }

            // 处理数据遍历
            for (j = 0; j < len2; j++) {
                dataItem = data[j];
                for (i = 0; i < len; i++) {
                    item = fields[i];
                    itemField = item.field;
                    if ('function' == typeof item.foreach) {
                        total[itemField] = item.foreach(dataItem,
                                                        total[itemField]);
                    }
                }
            }

            // 数据后期处理
            for (i = 0; i < len; i++) {
                item = fields[i];
                if ('function' == typeof item.after) {
                    total[item.field] = item.after(total);
                }
            }

            // html构建
            html.push('<table><thead><tr>');
            for (i = 0; i < len; i++) {
                html.push('<th>' + fields[i].title + '</th>');
            }
            html.push('</tr></thead><tbody>');
            for (i = 0; i < len; i++) {
                html.push('<td>' + total[fields[i].field] + '</td>');
            }
            html.push('</tr></tbody></table>');
            return html.join('');
        }

        return '';
    }
};

//ui.Base.derive(ui.SummaryInfo);
baidu.inherits(ui.SummaryInfo, ui.Control);
