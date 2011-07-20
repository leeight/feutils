/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: mockup.js 5296 2011-05-06 13:45:10Z liyubei $
 *
 **************************************************************************/



/**
 * mockup.js ~ 2011/05/05 23:35:06
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5296 $
 * @description
 *
 **/


goog.require('baidu.mockup.register');
goog.require('dn.ConstMap');
goog.require('er.context');

goog.provide('order.mockup');

var orderList = {
    'success': 'true',
    'message': {},
    'page': {
        'pageNo': 2,
        'pageSize': 30,
        'orderBy': '',
        'order': 'desc',
        'totalCount': 544,
        'result': [
            {
                'id' : 1,
                'name' : 'order1',
                'status' : 1,
                'contract_number': 2,
                'customer_manager' : '张三',
                'sale_assistant' : '张三',
                'channel_manager' : '张三',
                'agent' : '默认客户',
                'adowner_name' : '完美时空',
                'effect_time' : '20101214000000',
                'expire_time' : '99991231235959',
                'import_time' : '20101214000000',
                'money' : 100,
                'discount' : 0.9
            },
            {
                'id' : 2,
                'name' : 'order2',
                'status' : 2,
                'contract_number': 3,
                'customer_manager' : '张三',
                'sale_assistant' : '张三',
                'channel_manager' : '张三',
                'agent' : '默认客户',
                'adowner_name' : '完美时空',
                'effect_time' : '20101214000000',
                'expire_time' : '20101231000000',
                'import_time' : '20101214000000',
                'money' : 100,
                'discount' : 0.95
            }
        ]
     }
};
var orderItem = {
    'success' : 'true',
    'message' : {},
    'result' : {
        'id' : 1,
        'name' : 'order1',
        'status' : 1,
        'contract_number': 2,
        'customer_manager' : '张三',
        'sale_assistant' : '张三',
        'channel_manager' : '张三',
        'agent' : '默认客户',
        'adowner_name' : '完美时空',
        'effect_time' : '20101214000000',
        'expire_time' : '99991231235959',
        'import_time' : '20101214000000',
        'money' : 100,
        'discount' : 0.9
    }
};

baidu.mockup.register('/order/list', orderList);
baidu.mockup.register('/order/read', orderItem);
// baidu.mockup.register('/order/update', formSuccess);

er.context.set('orderStatusMap', {
  '1': '未处理',
  '2': '已处理',
  '3': '已存档'
});
er.context.set('orderStatusFilterList', [
  {'text': '全部', 'value': '100'},
  {'text': '非存档', 'value': '101'},
  {'text': '未处理', 'value': '102'},
  {'text': '已处理', 'value': '103'},
  {'text': '已存档', 'value': '104'}
]);

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
