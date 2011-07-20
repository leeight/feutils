/**
 * 广告每日视频报告
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
report.ad.DailyVideo = function() {
    er.ListAction.call(this);
    this.model.type = null;
};

report.ad.DailyVideo.prototype = {
    view: 'dailyVideo',

    initModel: function(query, callback) {
        this.model.fields = [
        	{
                title: '日期',
                sortable: true,
                field:'date',
                width: 60,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return baidu.date.format(dn.util.parseToDate(item['date']), 'yyyy-MM-dd');
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
                title: '曝光独立访客',
                sortable: true,
                field:'video_impression_uu',
                width: 63,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['video_impression_uu'];
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
                width: 50,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['click_count'];
                }
            },
            {
                title: '点击独立访客',
                sortable: true,
                field:'click_uu',
                width: 65,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['click_uu'];
                }
            },
            {
                title: '有效收视平均时长（秒）',
                sortable: true,
                field:'avg_valid_impression_time',
                width: 60,
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
                title: '独立访客点击率',
                sortable: true,
                field:'click_uu_ratio',
                width: 80,
                dragable: true,
                breakLine: true,
                content: function(item) {
                    return dn.util.getPercent(item['click_uu_ratio']);
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

        this.model.types = er.context.get('reportTrendTypeDailyVideoList');

        callback();
    },

    paramAdapters: [new base.OneToManyParamAdapter(
            ',', 'date_range', ['start_time', 'end_time'])],

    afterInit: function(page) {
    	this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.data['ad.daily_video'];
    },

    enterDocumentInternal: function() {
        this.model.set('type', this.page.c('cbType').getValue());

        if (screen.width > 1280) {
          if (this.list) {
            this.list.removeSkin('small-header');
          }
        }
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
    	report.ad.DailyVideo.superClass.onModelChanged.apply(this, arguments);

        if (propertyName === 'searchParams' || propertyName === 'type') {
            this.refreshFlash();
        }
    },

    refreshFlash: function() {
        var dateSpan = this.page.c('formSearch').c('reportCalendar').getValue(),
            url = report.ad.config.daily_video_flashData +
            '?' + this.getSearchParam() + '&type=' + this.model.get('type');

        baidu.g('lblDate').innerHTML = dn.util.getReportDateText(dateSpan);

        this.page.c('flash').invokeMethod('getData', url);
    }
};

baidu.inherits(report.ad.DailyVideo, er.ListAction);
