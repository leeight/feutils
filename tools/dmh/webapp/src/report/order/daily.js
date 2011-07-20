/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: daily.js 5202 2011-05-03 08:19:16Z liyubei $
 *
 **************************************************************************/



/**
 * daily.js ~ Mar 8, 2011 5:38:41 PM
 * @author yuanhongliang(yuanhongliang@baidu.com)
 * @version $Revision: 5202 $
 * @description 订单行每日报表控制器
 **/

goog.require('report.order');

goog.provide('report.order.Daily');

/**
 * 订单行每日报表控制器类
 * @constructor
 * @extends {er.ListAction}
 */
report.order.Daily = function() {
    er.ListAction.call(this);
    
    this.model.type = null;
};
report.order.Daily.prototype = {
    view: 'reportOrderDaily',
    
    paramAdapters: [new base.OneToManyParamAdapter(
        ',', 'date_range', ['start_time', 'end_time'])],
        
    initModel: function(query, callback) {
        this.model.flash_options = {
            url: report.order.config.url.dailyFlash,
            width: '100%',
            height: '150',
            wmode: 'transparent'
        };
        
        this.model.types = er.context.get('reportTrendTypeList');

        callback();
    },
        
    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.order.data.daily;
    },
    
    enterDocumentInternal: function() {
        this.model.set('type', this.page.c('cbType').getValue());
    },
    
    initBehaviorInternal: function() {
        this.page.c('formSearch').c('reportCalendar').onselect =
            baidu.fn.bind(this.onReportCalendarSelect, this);
        this.page.c('cbType').onselect = baidu.fn.bind(this.onTypeSelect, this);
    },
    
    leaveInternal: function() {
        this.page.c('formSearch').c('reportCalendar').onselect = null;
        this.page.c('cbType').onselect = null;
    },
    
    onModelChanged: function(propertyName, newValue, oldValue) {
        report.order.Daily.superClass.onModelChanged.apply(this, arguments);
        
        if (propertyName === 'searchParams' || propertyName === 'type') {
            this.refreshFlash();
        }
    },
    
    onReportCalendarSelect: function() {
        this.page.c('formSearch').validateAndSubmit();
    },
    
    onTypeSelect: function(value, selectedItem) {
        this.model.set('type', value);
    },
    
    refreshFlash: function() {
        var dateSpan = this.page.c('formSearch').c('reportCalendar').getValue(),
            url = report.order.config.url.dailyFlashData +
            '?' + this.getSearchParam() + '&type=' + this.model.get('type');
        
        baidu.g('lblDate').innerHTML = dn.util.getReportDateText(dateSpan);
        this.page.c('flash').invokeMethod('getData', url);
    }
};
baidu.inherits(report.order.Daily, er.ListAction);
