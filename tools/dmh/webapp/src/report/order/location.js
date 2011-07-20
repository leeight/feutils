/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: location.js 5203 2011-05-03 08:46:13Z liyubei $
 *
 **************************************************************************/



/**
 * location.js ~ Mar 8, 2011 5:38:41 PM
 * @author yuanhongliang(yuanhongliang@baidu.com)
 * @version $Revision: 5203 $
 * @description 订单行分地域报表控制器
 **/

goog.require('report.order');

goog.provide('report.order.Location');

/**
 * 订单行分地域报表控制器类
 * @constructor
 * @extends {er.ListAction}
 */
report.order.Location = function() {
    er.ListAction.call(this);
    
    this.model.locationId = null;
};
report.order.Location.prototype = {
    view: 'reportOrderLocation',
    
    paramAdapters: [new base.OneToManyParamAdapter(
        ',', 'date_range', ['start_time', 'end_time'])],
        
    initModel: function(query, callback) {
        this.model.flash_options = {
            url: report.order.config.url.locationFlash,
            width: '473',
            height: '286',
            wmode: 'transparent',
            'vars' : {
                'xml' : '/assets/flash/order-location-data.xml'
              }
        };

        callback();
    },
        
    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.order.data.location;
    },
    
    enterDocumentInternal: function() {
        this.refreshFlash();
    },
    
    initBehaviorInternal: function() {
        this.page.c('formSearch').c('reportCalendar').onselect =
            baidu.fn.bind(this.onReportCalendarSelect, this);
        this.page.c('list').ongetdata = baidu.fn.bind(this.onListData, this);
        this.onViewAreaChangeHandler =
            baidu.fn.bind(this.onViewAreaChange, this);
        this.page.c('flash').addListener(ui.events.VIEWAREA_CHANGE,
            this.onViewAreaChangeHandler);
    },
    
    leaveInternal: function() {
        this.page.c('formSearch').c('reportCalendar').onselect = null;
        this.page.c('list').ongetdata = null;
        this.page.c('flash').removeListener(ui.events.VIEWAREA_CHANGE, 
            this.onViewAreaChangeHandler);
    },
    
    onModelChanged: function(propertyName, newValue, oldValue) {
        report.order.Location.superClass.onModelChanged.apply(this, arguments);
        
        if (propertyName === 'searchParams') {
            this.refreshFlash();
        }
        if (propertyName === 'locationId') {
            this.refreshSummary();
        }
    },
    
    onReportCalendarSelect: function() {
        this.page.c('formSearch').validateAndSubmit();
    },
    
    onListData: function(data) {
        this.model.allData = [];
        var total = {
            location_id: -1,
            location: '全国',
            impression_count: 0,
            click_count: 0,
            cost: 0
        };
        for (var i = 0; i < data.length; i++) {
            this.model.allData.push(data[i]);
            total.impression_count += parseInt(data[i].impression_count, 10);
            total.click_count += parseInt(data[i].click_count, 10);            
            data[i].cost = parseFloat(data[i].cost).toFixed(2);
            total.cost += parseFloat(data[i].cost);
        }
        total.click_ratio = total.click_count / total.impression_count;
        total.cost = total.cost.toFixed(2);
        this.model.allData.push(total);
        
        this.model.locationId = total.location_id;
        this.model.triggerPropertyChanged('locationId');
    },
    
    onViewAreaChange: function(id, area_id) {
        this.model.set('locationId', dn.util.getXmlAreaId(area_id));
    },
    
    refreshFlash: function() {
        var dateSpan = this.page.c('formSearch').c('reportCalendar').getValue(),
            url = report.order.config.url.locationFlashData +
            '?' + this.getSearchParam();
        
        baidu.g('lblDate').innerHTML = baidu.g('lblDate2').innerHTML =
            dn.util.getReportDateText(dateSpan);
        
        // TODO: remove the temp solution
        this.page.c('flash').rebindModel({
            flash_options: {
                id: 'flash',
                url: report.order.config.url.locationFlash,
                width: '473',
                height: '286',
                wmode: 'transparent',
                'vars' : {
                    'xml' : url
                }
            }
        });
        
        //this.page.c('flash').invokeMethod('getData', url);
    },
    
    refreshSummary: function() {
        var data;
        for (var i = 0; i < this.model.allData.length; i++) {
            if (this.model.allData[i].location_id == this.model.locationId) {
                data = this.model.allData[i];
                break;
            }
        }
        baidu.g('reportSummary').innerHTML = baidu.format(
            er.template.get('reportOrderLocationSummary'),
            data.location,
            data.impression_count,
            data.click_count,
            isNaN(data.click_ratio) ? '0' : (data.click_ratio * 100).toFixed(2) + '%',
            isNaN(data.click_ratio) ? '--' : (data.click_ratio * 100).toFixed(2) + '%',
            data.cost);
    }
};
baidu.inherits(report.order.Location, er.ListAction);
