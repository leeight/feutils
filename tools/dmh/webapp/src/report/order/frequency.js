/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: frequency.js 5156 2011-04-27 04:15:29Z liyubei $
 *
 **************************************************************************/



/**
 * frequency.js ~ Mar 8, 2011 5:38:41 PM
 * @author yuanhongliang(yuanhongliang@baidu.com)
 * @version $Revision: 5156 $
 * @description 订单行频次报表控制器
 **/

goog.require('report.order');

goog.provide('report.order.Frequency');

/**
 * 订单行频次报表控制器类
 * @constructor
 * @extends {er.ListAction}
 */
report.order.Frequency = function() {
    er.ListAction.call(this);
};
report.order.Frequency.prototype = {
    view: 'reportOrderFrequency',
    
    initModel: function(query, callback) {
        var me = this;
        order.data.read('id=' + me.model.order_id, function(data) {
            var effectTime = dn.util.parseToDate(data.result.effect_time);
            me.model.effect_time =
                baidu.date.format(effectTime, 'yyyy年MM月dd日');

            callback();
        });
    },
        
    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.order.data.frequency;
    }
};
baidu.inherits(report.order.Frequency, er.ListAction);
