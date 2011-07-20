/**
 * 广告频次报告
 */
report.ad.Frequency = function() {
    er.ListAction.call(this);
};

report.ad.Frequency.prototype = {
    view: 'frequency',

    initModel: function(query, callback) {
        this.model.fields = [
        	{
                title: '频次',
                sortable: true,
                field:'frequency',
                width: 200,
                breakLine: true,
                content: function(item) {
                    return parseInt(item['frequency'],10) > 10 ? '10次以上' : item['frequency'] + '次';
                }
            },
            {
                title: '覆盖独立访客数',
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
                    var loc = document.location.pathname;
                    if (loc.indexOf('client') != -1) {
                        return dn.util.drawNarrowGraph(item['uu_ratio']);
                    } else {
                        return dn.util.drawGraph(item['uu_ratio']);
                    }

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
        this.requesterList = report.data['ad.frequency'];
    },

    initBehaviorInternal: function() {
    }
};

baidu.inherits(report.ad.Frequency, er.ListAction);
