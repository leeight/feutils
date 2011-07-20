/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: ad.js 3234 2011-03-11 09:32:35Z yuanhongliang $
 *
 **************************************************************************/



/**
 * ad.js ~ Mar 8, 2011 5:38:41 PM
 * @author yuanhongliang(yuanhongliang@baidu.com)
 * @version $Revision: 3234 $
 * @description 订单行分广告报表控制器
 **/

goog.require('report.order');

goog.provide('report.order.Ad');

/**
 * 订单行分广告报表控制器类
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
report.order.Ad = function() {
    er.ListAction.call(this);

    this.model.listState2 = null;

    this.list2 = null;

    this.requesterList2 = null;
};
report.order.Ad.prototype = {
    view: 'reportOrderAd',
    
    paramAdapters: [new base.OneToManyParamAdapter(
        ',', 'date_range', ['start_time', 'end_time'])],
        
    initModel: function(query, callback) {
        callback();
    },
        
    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.list2 = page.c('list2');
        this.requesterList = report.order.data.ad_video;
        this.requesterList2 = report.order.data.ad_non_video;
    },

    beforeRender: function(page) {
        report.order.Ad.superClass.beforeRender.call(this, page);
        this.list2.datasource = new base.RemoteListDataSource(
            this.requesterList2,
            baidu.fn.bind(this.getSearchParam, this)
        );
    },
    
    enterDocumentInternal: function() {
        this.list2.onstatechange = baidu.fn.bind(this.onListStateChanged2, this);

        this.list2.getData();

        this.page.c('tabAd').rebindModel(
            {
                tabConfig: [
                    {
                        label: this.page.c('tabVideo').domId,
                        content: this.page.c('list').domId
                    },
                    {
                        label: this.page.c('tabNonVideo').domId,
                        content: this.page.c('list2').domId
                    }
                ],
                activeTab: this.page.c('tabVideo').domId
            }
        );
    },
    
    initBehaviorInternal: function() {
        this.page.c('formSearch').c('reportCalendar').onselect =
            baidu.fn.bind(this.onReportCalendarSelect, this);
        this.page.c('tabAd').onchanged =
            baidu.fn.bind(this.onTabSwitch, this);
    },
    
    leaveInternal: function() {
        this.page.c('formSearch').c('reportCalendar').onselect = null;
        this.page.c('tabAd').onchanged = null;

        this.list2.onstatechange = null;
        this.list2 = null;
    },
    
    onModelChanged: function(propertyName, newValue, oldValue) {
        report.order.Ad.superClass.onModelChanged.apply(this, arguments);
        if (propertyName === 'listState' ||
            propertyName === 'searchParams') {
            this.list2.getData();
        }
    },

    /**
     * 分页列表状态改变事件的处理函数，如pageNo,pageSize,order,orderBy.
     * @this {report.order.Ad}
     * @private
     */
    onListStateChanged2: function(state) {
        this.model.set('listState2', state);
    },
    
    onReportCalendarSelect: function() {
        this.page.c('formSearch').validateAndSubmit();
    },

    onTabSwitch: function(label) {
        if (label === this.page.c('tabVideo').domId) {
            this.page.c('list').c('listTable').handleResize();
        } else {
            this.page.c('list2').c('listTable').handleResize();
        }
    }
};
baidu.inherits(report.order.Ad, er.ListAction);
