/**
 * 广告分时视频报告
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
report.ad.PerhourVideo = function() {
    er.ListAction.call(this);
    this.model.type = null;
};

report.ad.PerhourVideo.prototype = {
    view: 'perhourVideo',

    initModel: function(query, callback) {
        this.model.fields = [
        	{
                title: '时段',
                sortable: true,
                width: 95,
                field:'hour',
                breakLine: true,
                dragable: true,
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
                dragable: true,
                content: function(item) {
                    return item['impression_count'];
                }
            },
            {
                title: '总曝光次数',
                sortable: true,
                field:'total_impression_count',
                width: 64,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['total_impression_count'];
                }
            },
            {
                title: '视频曝光次数',
                sortable: true,
                field:'video_impression_count',
                width: 64,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['video_impression_count'];
                }
            },
            {
                title: '最小化视频曝光次数',
                sortable: true,
                field:'collapse_impression_count',
                width: 85,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['collapse_impression_count'];
                }
            },
            {
                title: '有效收视次数',
                sortable: true,
                field:'valid_impression_count',
                width: 75,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['valid_impression_count'];
                }
            },
            {
                title: '点击次数',
                sortable: true,
                field:'click_count',
                width: 65,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['click_count'];
                }
            },
            {
                title: '有效收视平均时长（秒）',
                sortable: true,
                field:'avg_valid_impression_time',
                width: 100,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['avg_valid_impression_time'];
                }
            },
            {
                title: 'CPC（元）',
                sortable: true,
                field:'cpc',
                width: 60,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return dn.util.getFixed(item['cpc']);
                }
            },
            {
                title: '点击率',
                sortable: true,
                field:'click_ratio',
                width: 60,
                breakLine: true,
                dragable: true,
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
                dragable: true,
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

        this.model.types = er.context.get('reportTrendTypeHourVideoList');
        callback();
    },

    paramAdapters: [new base.OneToManyParamAdapter(
            ',', 'date_range', ['start_time', 'end_time'])],

    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.data['ad.perhour_video'];
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
        report.ad.PerhourVideo.superClass.onModelChanged.apply(this, arguments);

        if (propertyName === 'searchParams' || propertyName === 'type') {
            this.refreshFlash();
        }
    },

    refreshFlash: function() {
        var dateSpan = this.page.c('formSearch').c('reportCalendar').getValue(),
            url = report.ad.config.perhour_video_flashData +
            '?' + this.getSearchParam() + '&type=' + this.model.get('type');

        baidu.g('lblDate').innerHTML = dn.util.getReportDateText(dateSpan);

        this.page.c('flash').invokeMethod('getData', url);
    }
};

baidu.inherits(report.ad.PerhourVideo, er.ListAction);
