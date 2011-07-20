/**
 * 广告分地域非视频报告
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
report.ad.LocationNonVideo = function() {
    er.ListAction.call(this);
    this.model.locationId = null;
};

report.ad.LocationNonVideo.prototype = {
    view: 'locationNonVideo',

    initModel: function(query, callback) {
        this.model.fields = [
        	{
                title: '地域',
                sortable: true,
                field:'location',
                width: 95,
                breakLine: true,
                content: function(item) {
                    return item['location'];
                }
            },
            {
                title: '展现量',
                sortable: true,
                width: 64,
                field: 'impression_count',
                breakLine: true,
                content: function(item) {
                    return item['impression_count'];
                }
            },
            {
                title: '点击量',
                sortable: true,
                field:'click_count',
                width: 64,
                breakLine: true,
                content: function(item) {
                    return item['click_count'];
                }
            },
            {
                title: '点击率',
                sortable: true,
                field:'click_ratio',
                width: 60,
                breakLine: true,
                content: function(item) {
                    return dn.util.getPercent(item['click_ratio']);
                }
            },
            {
                title: '消费',
                sortable: true,
                field:'cost',
                width: 60,
                breakLine: true,
                content: function(item) {
                    return dn.util.getRMB(item['cost']);
                }
            }
        ];
        this.model.flash_options = {
                url: report.ad.config.location_flashfile,
                width: '473',
                height: '286',
                wmode: 'transparent',
                'vars' : {
                    'xml' : '/assets/flash/order-location-data.xml'
                  }
            };
        callback();
    },

    paramAdapters: [new base.OneToManyParamAdapter(
            ',', 'date_range', ['start_time', 'end_time'])],

    afterInit: function(page) {
    	this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.data['ad.location_non_video'];
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

    onModelChanged: function(propertyName, newValue, oldValue) {
    	report.ad.LocationNonVideo.superClass.onModelChanged.apply(this, arguments);

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
        total.click_ratio = 0 === total.click_count ? 0 : total.click_count / total.impression_count;
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
            url = report.ad.config.location_non_video_flashData +
            '?' + this.getSearchParam();

        baidu.g('lblDate').innerHTML = baidu.g('lblDate2').innerHTML =
            dn.util.getReportDateText(dateSpan);

        // TODO: remove the temp solution
        this.page.c('flash').rebindModel({
            flash_options: {
                id: 'flash',
                url: report.ad.config.location_flashfile,
                width: '473',
                height: '286',
                wmode: 'transparent',
                'vars' : {
                    'xml' : url
                  }
            }
        });
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
            er.template.get('reportAdLocationNonVideoSummary'),
            data.location,
            data.impression_count,
            data.click_count,
            dn.util.getZeroPercent((data.click_ratio * 100).toFixed(2) + '%'),
            data.cost);
    }
};

baidu.inherits(report.ad.LocationNonVideo, er.ListAction);
