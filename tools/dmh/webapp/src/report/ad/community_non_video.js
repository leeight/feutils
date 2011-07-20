/**
 * 广告生活圈非视频报告
 */
report.ad.CommunityNonVideo = function() {
    er.ListAction.call(this);
};

report.ad.CommunityNonVideo.prototype = {
    view: 'communityNonVideo',

    initModel: function(query, callback) {
        this.model.fields = [
        	{
                title: '生活圈名称',
                sortable: true,
                field:'community_name',
                width: 95,
                breakLine: true,
                content: function(item) {
                    return item['community_name'];
                }
            },
            {
                title: '展现量',
                sortable: true,
                field: 'impression_count',
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
        callback();
    },

    paramAdapters: [new base.OneToManyParamAdapter(
            ',', 'date_range', ['start_time', 'end_time'])],

    afterInit: function(page) {
    	this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.data['ad.community_non_video'];
    },

    initBehaviorInternal: function() {
        this.setTitleTxt();
    	this.page.c('formSearch').c('reportCalendar').onselect =
            baidu.fn.bind(this.onReportCalendarSelect, this);
    },

    onReportCalendarSelect: function() {
        this.setTitleTxt();
        this.page.c('formSearch').validateAndSubmit();
    },

    setTitleTxt: function() {
        this.page.c('lblDate').setContent(dn.util.getReportDateText(this.page.c('formSearch').c('reportCalendar').getValue()));
    }
};

baidu.inherits(report.ad.CommunityNonVideo, er.ListAction);
