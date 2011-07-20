/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * path:    mockup/order.js
 * desc:    订单行模拟数据
 * author:  yuanhongliang
 * date:    $Date: 2011-03-01 19:36:39 +0800 (周二, 01 三月 2011) $
 */

var orderList = {
    "success":"true",
    "message":{},
    "page":{
        "pageNo":2, 
        "pageSize":30, 
        "orderBy":"", 
        "order":"desc", 
        "totalCount":544, 
        "result":[
            {
                "id" : 1,
                "name" : 'order1',
                "status" : 1,
                "contract_number": 2,
                "customer_manager" : '张三',
                "sale_assistant" : '张三',
                "channel_manager" : '张三',
                "agent" : '默认客户',
                "adowner_name" : '完美时空',
                "effect_time" : '20101214000000',
                "expire_time" : '99991231235959',
                "import_time" : '20101214000000',
                "money" : 100,
                "discount" : 0.9
            },
            {
                "id" : 2,
                "name" : 'order2',
                "status" : 2,
                "contract_number": 3,
                "customer_manager" : '张三',
                "sale_assistant" : '张三',
                "channel_manager" : '张三',
                "agent" : '默认客户',
                "adowner_name" : '完美时空',
                "effect_time" : '20101214000000',
                "expire_time" : '20101231000000',
                "import_time" : '20101214000000',
                "money" : 100,
                "discount" : 0.95
            }
        ]
     }
};
var orderItem = {
    "success" : "true",
    "message" : {},
    "result" : {
        "id" : 1,
        "name" : 'order1',
        "status" : 1,
        "contract_number": 2,
        "customer_manager" : '张三',
        "sale_assistant" : '张三',
        "channel_manager" : '张三',
        "agent" : '默认客户',
        "adowner_name" : '完美时空',
        "effect_time" : '20101214000000',
        "expire_time" : '99991231235959',
        "import_time" : '20101214000000',
        "money" : 100,
        "discount" : 0.9
    }
};

mockup.register('/order/list', orderList);
mockup.register('/order/read', orderItem);
mockup.register('/order/update', formSuccess);
