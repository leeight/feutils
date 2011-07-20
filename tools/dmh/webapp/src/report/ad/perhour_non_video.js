/**
 * 广告分时非视频报告
 * @constructor
 * @extends {er.ListAction}
 */
report.ad.PerhourNonVideo = function() {
    er.ListAction.call(this);
    this.model.type = null;
};

report.ad.PerhourNonVideo.prototype = {
    view: 'perhourNonVideo',

    initModel: function(query, callback) {
        this.model.fields = [
        	{
                title: '时段',
                sortable: true,
                field:'hour',
                width: 95,
                breakLine: true,
                content: function(item) {
                    return item['hour'];
                }
            },
            {
                title: '展现量',
                sortable: true,
                field:'impression_count',
                width: 64,
                breakLine: true,
                content: function(item) {
                    return item['impression_count'];
                }
            },
            {
                title: '点击量',
                sortable: true,
                field:'click_count',
                width: 65,
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
                url: report.ad.config.daily_flashfile,
                width: '100%',
                height: '150',
                wmode: 'transparent'
            };

        this.model.types = er.context.get('reportTrendTypeHourNonVideoList');
        callback();
    },

    paramAdapters: [new base.OneToManyParamAdapter(
            ',', 'date_range', ['start_time', 'end_time'])],

    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.data['ad.perhour_non_video'];
    },

    enterDocumentInternal: function() {
        this.model.set('type', this.page.c('cbType').getValue());
    },

    initBehaviorInternal: function() {
        this.page.c('formSearch').c('reportCalendar').onselect =
            baidu.fn.bind(this.onReportCalendarSelect, this);
        this.page.c('cbType').onselect = baidu.fn.bind(this.onTypeSelect, this);
    },

    onReportCalendarSelect: function() {
        this.page.c('formSearch').validateAndSubmit();
    },

    onTypeSelect: function(value, selectedItem) {
        this.model.set('type', value);
    },

    onModelChanged: function(propertyName, newValue, oldValue) {
        report.ad.PerhourNonVideo.superClass.onModelChanged.apply(this, arguments);

        if (propertyName === 'searchParams' || propertyName === 'type') {
            this.refreshFlash();
        }
    },

    refreshFlash: function() {
        var dateSpan = this.page.c('formSearch').c('reportCalendar').getValue(),
            url = report.ad.config.perhour_non_video_flashData +
            '?' + this.getSearchParam() + '&type=' + this.model.get('type');

        baidu.g('lblDate').innerHTML = dn.util.getReportDateText(dateSpan);

        this.page.c('flash').invokeMethod('getData', url);
    }
};

baidu.inherits(report.ad.PerhourNonVideo, er.ListAction);
