/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    order/order.js
 * desc:    订单行模块
 * author:  yuanhongliang
 * date:    $Date: 2011-06-09 18:03:24 +0800 (周四, 09 六月 2011) $
 */

goog.require('dn.listHelper');
goog.require('dn.util');
goog.require('er.context');
goog.require('er.controller');

goog.provide('order.config');
goog.provide('order.data');

/**
 * 订单行配置信息
 * @type {Object}
 * @const
 */
order.config = {
  action: [
      {
          location: '/order/list',
          action: 'order.List'
      },
      {
          location: '/order/detail',
          action: 'order.Form'
      }
  ],

  url: {
      list: '/order/list',
      read: '/order/read',
      update: '/order/update'
  },

  listFields: [
        {
            width: 80,
            title: '订单行ID',
            dragable: true,
            field: 'id',
            content: function(item) {
                return baidu.format(
                        '<a href="#/order/detail~id={0}">{0}</a>',
                        item.id);
            }
        },
        {
            width: 150,
            title: '订单行名称',
            dragable: true,
            breakLine: true,
            field: 'name',
            content: function(item) {
                return item.name;
            }
        },
        {
            width: 60,
            title: '状态',
            dragable: true,
            field: 'status',
            content: function(item) {
                return dn.util.getStatusHtml(
                        er.context.get('orderStatusMap')[item.status],
                        order.config.statusClassMap);
            }
        },
        {
            width: 60,
            title: '合同号',
            dragable: true,
            field: 'contract_number',
            content: function(item) {
                return item['contract_number'];
            }
        },
        {
            width: 80,
            title: '客户经理',
            dragable: true,
            field: 'customer_manager',
            content: function(item) {
                return item['customer_manager'];
            }
        },
        {
            width: 80,
            title: '销售助理',
            dragable: true,
            field: 'sale_assistant',
            content: function(item) {
                return item['sale_assistant'];
            }
        },
        {
            width: 80,
            title: '渠道经理',
            dragable: true,
            field: 'channel_manager',
            content: function(item) {
                return item['channel_manager'];
            }
        },
        {
            width: 80,
            title: '代理公司',
            dragable: true,
            breakLine: true,
            field: 'agent',
            content: function(item) {
                return item['agent'];
            }
        },
        {
            width: 80,
            title: '广告主',
            dragable: true,
            breakLine: true,
            field: 'adowner_name',
            content: function(item) {
                return item['adowner_name'];
            }
        },
        {
            width: 80,
            title: '生效日期',
            dragable: true,
            field: 'effect_time',
            content: function(item) {
                if (!item['effect_time']) {
                    return '';
                }
                var datetime = dn.util.parseToDate(item.effect_time);
                return baidu.date.format(datetime, 'yyyy-MM-dd');
            }
        },
        {
            width: 80,
            title: '失效日期',
            dragable: true,
            field: 'expire_time',
            content: function(item) {
                if (!item.expire_time) {
                    return '';
                }

                if (item.expire_time.indexOf('9999') === 0) {
                    return '长期生效';
                } else {
                    var datetime = dn.util.parseToDate(item.expire_time);
                    return baidu.date.format(datetime, 'yyyy-MM-dd');
                }
            }
        },
        {
            width: 120,
            title: '导入日期',
            dragable: true,
            field: 'import_time',
            content: function(item) {
                if (!item.import_time) {
                    return '';
                }

                var datetime = dn.util.parseToDate(item.import_time);
                return baidu.date.format(datetime, 'yyyy-MM-dd HH:mm');
            }
        },
        {
            width: 80,
            title: '现金',
            dragable: true,
            field: 'money',
            content: function(item) {
                var price = item.money;
                return '¥ ' + parseFloat(price).toFixed(2);
            }
        },
        {
            width: 60,
            title: '折扣率',
            dragable: true,
            field: 'discount',
            content: function(item) {
                return item['discount'];
            }
        },
        {
            width: 140,
            title: '操作',
            dragable: true,
            breakLine: true,
            content: function(item) {
              var id = item['id'];
                return dn.listHelper.operation([
                    {
                        title: '查看详情',
                        location: '#/order/detail~id=' + id
                    },
                    {
                        title: '查看报告',
                        location: '#/report/order~id=' + id
                    },
                    {
                        title: '新增广告',
                        location: '#/ad/create~order_id=' + id
                    },
                    {
                        title: '查看广告',
                        location: '#/ad/list~order_id=' + id
                    }
                ]);
            }
        }
    ],

    statusClassMap: {
        '已处理' : 'status-valid',
        '未处理' : 'status-invalid',
        '已存档' : 'status-normal'
    }
};

/**
 * 订单行数据访问对象
 * @type {Object.<string, Function>}
 */
order.data = dn.util.da_generator([
    // 广告位列表数据
    {
        name: 'list',
        url: order.config.url.list
    },
    {
        name: 'update',
        url: order.config.url.update
    },
    {
        name: 'read',
        url: order.config.url.read
    }
]);

// register a module
er.controller.addModule(order);
