/**
 * 关键词报告
 */
report.ad.Keywords = function() {
    er.ListAction.call(this);
};

report.ad.Keywords.prototype = {
    view: 'reportKeywords',

    initModel: function(query, callback) {
        this.model.fields = [
            {
                title: '关键词',
                sortable: true,
                field:'keyword',
                width: 95,
                breakLine: true,
                content: function(item) {
                    return item['keyword'];
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
            }
        ];
        callback();
    },

    paramAdapters: [new base.OneToManyParamAdapter(
            ',', 'date_range', ['start_time', 'end_time'])],

    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.data['ad.keywords'];
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
baidu.inherits(report.ad.Keywords, er.ListAction);
