/**
 * 广告分创意视频报告
 */
report.ad.MaterialVideo = function() {
    er.ListAction.call(this);
};

report.ad.MaterialVideo.prototype = {
    view: 'materialVideo',

    initModel: function(query, callback) {
        this.model.fields = [
        	{
                title: '创意名',
                sortable: true,
                field:'material_name',
                width: 95,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['material_name'];
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
                field: 'video_impression_count',
                width: 64,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['video_impression_count'];
                }
            },
            {
                title: '最小化视窗曝光次数',
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
        callback();
    },

    paramAdapters: [new base.OneToManyParamAdapter(
            ',', 'date_range', ['start_time', 'end_time'])],

    afterInit: function(page) {
    	this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.data['ad.material_video'];
    },

    initBehaviorInternal: function() {
    	this.page.c('formSearch').c('reportCalendar').onselect =
            baidu.fn.bind(this.onReportCalendarSelect, this);
    	this.setTitleTxt();
    },

    onReportCalendarSelect: function() {
        this.setTitleTxt();
        this.page.c('formSearch').validateAndSubmit();
    },

    setTitleTxt: function() {
        this.page.c('lblDate').setContent(dn.util.getReportDateText(this.page.c('formSearch').c('reportCalendar').getValue()));
    }
};

baidu.inherits(report.ad.MaterialVideo, er.ListAction);
