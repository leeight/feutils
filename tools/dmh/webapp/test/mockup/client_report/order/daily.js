/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: daily.js 2754 2011-03-08 11:07:26Z liyubei $ 
 * 
 **************************************************************************/
 
 
 
/**
 * daily.js ~ 2011/03/08 18:46:51
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 2754 $ 
 * @description 
 *  
 **/

var report_daily_success = {
  "success" : "true",
  "message" : {},
  "page" : {
    "pageNo":1, 
    "pageSize":15, 
    "orderBy":"orderId", 
    "order":"desc", 
    "totalCount":2, 
    "result" : [
      {
        "date" : '2012-12-20',
        "impression_count" : '99999',
        "click_count" : '100',
        "click_ratio" : '0%',
        "impression_uu" : '123',
        "click_uu" : '33',
        "click_uu_ratio" : '40%',
        "cost" : '99999', // 消费...
        "request_count" : '123'  // 请求量，仅仅管理端报告有此属性
      },
      {
        "date" : '2012-12-20',
        "impression_count" : '99999',
        "click_count" : '100',
        "click_ratio" : '0%',
        "impression_uu" : '123',
        "click_uu" : '33',
        "click_uu_ratio" : '40%',
        "cost" : '99999', // 消费...
        "request_count" : '123'  // 请求量，仅仅管理端报告有此属性
      }
    ]
  }
}


mockup.register('/client_report/order/daily', report_daily_success);



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
