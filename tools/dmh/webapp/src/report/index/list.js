/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * author:  刘磊
 */

/**
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
report.index.List = function() {
    er.ListAction.call(this);
};

report.index.List.MAIN_FIELDS = [
    {
        width: 50,
        title: '订单行ID',
        dragable: true,
        field: 'id',
        subEntry: true,
        content: function(item) {
            return item['id'];
        }
    },
    {
        width: 150,
        title: '订单行名称',
        dragable: true,
        field: 'name',
        content: function(item) {
            return item['name'];
        }
    },
    {
        width: 60,
        title: '生效日期',
        dragable: true,
        field: 'effect_time',
        content: function(item) {
            return baidu.date.format(dn.util.stringToDate(item['effect_time']), 'yyyy-M-d');
        }
    },
    {
        width: 60,
        title: '失效日期',
        dragable: true,
        field: 'expire_time',
        content: function(item) {
            return baidu.date.format(dn.util.stringToDate(item['expire_time']), 'yyyy-M-d');
        }
    },
    {
        width: 60,
        title: '操作',
        dragable: true,
        content: function(item) {
            return dn.listHelper.operation([{
                title: '查看详情',
                location: '#/report/order~id=' + item['id'] + '&index=0'
            }]);
        }
    }
];

report.index.List.SUB_FIELDS = [
    {
        width: 40,
        title: '广告ID',
        dragable: true,
        field: 'id',
        subEntry: true,
        content: function(item) {
            return item['id'];
        }
    },
    {
        width: 100,
        title: '广告名称',
        dragable: true,
        field: 'name',
        content: function(item) {
            return item['name'];
        }
    },
    {
        width: 50,
        title: '广告形式',
        dragable: true,
        field: 'type',
        content: function(item) {
            return er.context.get('productTypeMap')[item['type']];
          }
    },
    {
        width: 60,
        title: '操作',
        dragable: true,
        content: function(item) {
            return dn.listHelper.operation([{
                title: '查看详情',
                location: '#/report/ad~id=' + item['id'] + '&index=0'
            }]);
        }
    }
];

report.index.List.CLIENT_SUB_FIELDS = [
    {
        width: 50,
        title: '广告ID',
        dragable: true,
        field: 'id',
        subEntry: true,
        content: function(item) {
            return item['id'];
        }
    },
    {
        width: 150,
        title: '广告名称',
        dragable: true,
        field: 'name',
        content: function(item) {
            return item['name'];
        }
    },
    {
        width: 60,
        title: '广告形式',
        dragable: true,
        field: 'type',
        content: function(item) {
            return er.context.get('productTypeMap')[item['type']];
          }
    },
    {
        width: 60,
        title: '',
        dragable: true,
        sortable: true,
        field: 'expire_time',
        content: function(item) {
           return '';
        }
    },{
        width: 60,
        title: '操作',
        dragable: true,
        content: function(item) {
            return dn.listHelper.operation([{
                title: '查看详情',
                location: '#/report/ad~id=' + item['id'] + '&index=0'
            }]);
        }
    }
];

report.index.List.prototype = {
    view: 'reportIndexList',
    CONTEXT_INITER_LIST: ['initFields', 'initTypes'],
    initFields: function(query, callback) {
        this.model.fields = report.index.List.MAIN_FIELDS;
        callback();
    },

    initTypes: function(query, callback) {
        this.model.roles = [{
            text: '全部',
            value: ''
        }];
        var rolesList = er.context.get('rolesList');
        for (var i = 0; i < rolesList.length; i++) {
            this.model.roles.push(rolesList[i]);
        }
        callback();
    },
    afterInit: function(page) {
        this.list = page.c('reportList');
        this.requesterList = report.index.data.list;
        this.requesterBatch = report.index.data.batch_delete;
    },
    initBehaviorInternal: function() {
        this.list.onsubrowopen = baidu.fn.bind(this.onShowSubList, this);
    },
    onShowSubList: function(index, item) {
        var LISTNAME = 'reportList',
            SUBLISTNAME = LISTNAME + 'Sub' + index,
            me = this,
            listTablerow,
            listTablesubrow,
            tpl,
            table,
            sublistTable,
            subListLoading,
            subData,
            sublistTableId,
            subListLoadingId;

        listTablerow = baidu.g(LISTNAME + '_listTablerow' + index);
        listTablesubrow = baidu.g(LISTNAME + '_listTablesubrow' + index);

        if (this.list.c(SUBLISTNAME)) {
            listTablesubrow.innerHTML = '';
            me.list.removeChild(this.list.c(SUBLISTNAME));
        }

        sublistTableId = this.list.getId('subListTable' + index);
        subListLoadingId = this.list.getId('subListLoading' + index);
        tpl = '<div id="{0}" class="cb-sublist-loading" style="height:24px;">{2}</div>' +
              '<div id="{1}" class="cb-sublist-table" style="display:none"></div>';
        listTablesubrow.innerHTML = baidu.format(tpl, subListLoadingId,
            sublistTableId, dn.util.getLoadingHtml());
        baidu.show(listTablesubrow);
        report.index.data.subList('order_id=' + item['id'], function(data) {
            subData = data.page.result;
            
            // 创建TABLE
            var width;
            var fields;
            
            // 如果是”客户端“report，subrow的fields的部分参数不同。
            if (report.isClient()) {
                fields = report.index.List.CLIENT_SUB_FIELDS;
            } else {
                fields = report.index.List.SUB_FIELDS;
                width = 790;
            }
            table = ui.util.create('Table', {
                id: SUBLISTNAME,
                datasource: subData,
                noDataHtml: dn.config.subListNoDataHtml,
                fields: fields,
                width: width
            });
            table.appendTo(baidu.g(sublistTableId));
            me.list.addChild(table);
            baidu.hide(subListLoadingId);
            baidu.show(sublistTableId);
        });
    }
};
baidu.inherits(report.index.List, er.ListAction);
