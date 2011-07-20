/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: perhour.js 5203 2011-05-03 08:46:13Z liyubei $
 *
 **************************************************************************/



/**
 * perhour.js ~ Mar 8, 2011 5:38:41 PM
 * @author yuanhongliang(yuanhongliang@baidu.com)
 * @version $Revision: 5203 $
 * @description 订单行分时段报表控制器
 **/

goog.require('report.order');

goog.provide('report.order.Perhour');

/**
 * 订单行分时段报表控制器类
 * @constructor
 * @extends {er.ListAction}
 */
report.order.Perhour = function() {
    er.ListAction.call(this);
    
    this.model.type = null;
};
report.order.Perhour.prototype = {
    view: 'reportOrderPerhour',
    
    paramAdapters: [new base.OneToManyParamAdapter(
        ',', 'date_range', ['start_time', 'end_time'])],
        
    initModel: function(query, callback) {
        this.model.flash_options = {
            url: report.order.config.url.perhourFlash,
            width: '100%',
            height: '150',
            wmode: 'transparent'
        };
        
        this.model.types = [];
        var types = er.context.get('reportTrendTypeList');
        for (var i = 0; i < types.length; i++) {
            if (types[i].text === '展现量' ||
                types[i].text === '点击量' ||
                types[i].text === '点击率' ||
                types[i].text === '消费') {
                this.model.types.push(types[i]);    
            }
        }

        callback();
    },
        
    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.order.data.perhour;
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
        report.order.Perhour.superClass.onModelChanged.apply(this, arguments);
        
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
            url = report.order.config.url.perhourFlashData +
            '?' + this.getSearchParam() + '&type=' + this.model.get('type');
        
        baidu.g('lblDate').innerHTML = dn.util.getReportDateText(dateSpan);
        
        this.page.c('flash').invokeMethod('getData', url);
    }
};
baidu.inherits(report.order.Perhour, er.ListAction);
