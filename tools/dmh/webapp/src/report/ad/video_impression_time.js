/**
 * 广告播放时长报告
 */
report.ad.VideoImpressionTime = function() {
    er.ListAction.call(this);
};

report.ad.VideoImpressionTime.prototype = {
    view: 'videoImpressionTime',

    initModel: function(query, callback) {
        this.model.fields = [
        	{
                title: '视频播放时长',
                sortable: true,
                field:'impression_time',
                width: 200,
                breakLine: true,
                content: function(item) {
                    return parseInt(item['impression_time'],10) > 30 ? '30秒以上' : item['impression_time'] + '秒';                    
                }
            },
            {
                title: '播放次数',
                sortable: true,
                field: 'uu_count',
                width: 200,
                breakLine: true,
                content: function(item) {
                    return item['uu_count'];
                }
            },
            {
                title: '比例',
                sortable: true,
                field:'uu_ratio',
                width: 600,
                breakLine: true,
                content: function(item) {
                    return dn.util.drawGraph(item['uu_ratio']);
                }
            }
        ];

        var me = this;
        ad.data.read('id=' + me.model.ad_id, function(data) {
            me.model.lblToday = baidu.date.format(dn.util.parseToDate(data.result.order.effect_time), 'yyyy年MM月dd日');
            callback();
        });
    },

    afterInit: function(page) {
    	this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.data['ad.video_impression_time'];
    },

    initBehaviorInternal: function() {
    }
};

baidu.inherits(report.ad.VideoImpressionTime, er.ListAction);
