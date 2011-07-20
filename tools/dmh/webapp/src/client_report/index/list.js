/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:     client_report/index/list.js
 * author:   lixiang(lixiang05@baidu.com)
 * version:  $Revision: 4143 $
 * date:     $Date: 2011-03-25 20:02:30 +0800 (星期五, 18 三月 2011)$
 * desc:     客户端系统信息
 */

report.index.List = function() {
    er.ListAction.call(this);
};
report.index.List.prototype = {
    view: 'reportIndexList',
    CONTEXT_INITER_LIST: ['initFields', 'initTypes'],
    initFields: function(query, callback) {
        this.model.fields = [{
            width: 50,
            title: '订单行ID',
            dragable: true,
            field: 'id',
            subEntry: true,
            content: function(item) {
                return item['id'];
            }
        }, {
            width: 150,
            title: '订单行名称',
            dragable: true,
            field: 'name',
            content: function(item) {
                return item['name'];
            }
        }, {
            width: 60,
            title: '生效日期',
            dragable: true,
            sortable: true,
            field: 'effect_time',
            content: function(item) {
                return baidu.date.format(dn.util.stringToDate(item['effect_time']), 'yyyy-M-d');
            }
        }, {
            width: 60,
            title: '失效日期',
            dragable: true,
            sortable: true,
            field: 'expire_time',
            content: function(item) {
                return baidu.date.format(dn.util.stringToDate(item['expire_time']), 'yyyy-M-d');
            }
        }, {
            width: 60,
            title: '操作',
            dragable: true,
            content: function(item) {
                return dn.listHelper.operation([{
                    title: '查看详情',
                    location: '#/report/order~id=' + item['id'] + '&index=0'
                }]);
            }
        }];
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
        var LISTNAME = 'reportList', SUBLISTNAME = LISTNAME + 'Sub' + index, me = this, listTablerow, listTablesubrow, tpl, table, sublistTable, subListLoading, subData, sublistTableId, subListLoadingId;
        if (this.list.c(SUBLISTNAME))
            return false;

        listTablerow = baidu.g(baidu.g(LISTNAME + '_listTablerow' + index));
        listTablesubrow = baidu.g(baidu.g(LISTNAME + '_listTablesubrow' + index));
        sublistTableId = this.list.getId('subListTable' + index);
        subListLoadingId = this.list.getId('subListLoading' + index);
        tpl = '<div id="{0}" class="cb-sublist-loading" style="height:24px;">{2}</div>' + '<div id="{1}" class="cb-sublist-table" style="display:none"></div>';
        listTablesubrow.innerHTML = baidu.format(tpl, subListLoadingId, sublistTableId, dn.util.getLoadingHtml());
        baidu.show(listTablesubrow);
        report.index.data.subList('order_id=' + item['id'], function(data) {
            subData = data.page.result;
            // 创建TABLE
            table = ui.util.create('Table', {
                id: SUBLISTNAME,
                datasource: subData,
                noDataHtml: dn.config.subListNoDataHtml,
                fields: [{
                    width: 50,
                    title: '广告ID',
                    dragable: true,
                    field: 'id',
                    subEntry: true,
                    content: function(item) {
                        return item['id'];
                    }
                }, {
                    width: 150,
                    title: '广告名称',
                    dragable: true,
                    field: 'name',
                    content: function(item) {
                        return item['name'];
                    }
                }, {
                    width: 60,
                    title: '广告形式',
                    dragable: true,
                    field: 'type',
                    content: function(item) {
                        return er.context.get('productTypeMap')[item['type']];
                      }
                }, {
                    width: 60,
                    title: '',
                    dragable: true,
                    sortable: true,
                    field: 'expire_time',
                    content: function(item) {
                        return '';
                    }
                }, {
                    width: 60,
                    title: '操作',
                    dragable: true,
                    content: function(item) {
                        return dn.listHelper.operation([{
                            title: '查看详情',
                            location: '#/report/ad~id=' + item['id'] + '&index=0'
                        }]);
                    }
                }]
            });
            table.appendTo(baidu.g(sublistTableId));
            me.list.addChild(table);
            baidu.hide(subListLoadingId);
            baidu.show(sublistTableId);
        });

    }
};
baidu.inherits(report.index.List, er.ListAction);
