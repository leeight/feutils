/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * path:    mockup/account.js
 * desc:    账户管理模拟数据
 * author:  刘磊
 * date:    $Date: 2011-02-16$
 */

var accountList = {
  "success" : "true",
  "message" : {},
  "page" : {
    "pageNo":1, 
    "pageSize":120, 
    "orderBy":"", 
    "order":"desc", 
    "totalCount":502, 
    "result" : [
      {
        "id": "xx",
        "name": "xx",
        "role_id" : 1,
        "active_time" : "201112301123"
      },
      {
        "id": "xx",
        "name": "xx",
        "role_id" : 2,
        "active_time" : "201112301123"
      }
    ]
  }
};
mockup.register('/account/list', accountList);

var account_session_success = {
  "success" : "true",
  "message" : {},
  "result" : {
    "visitor" : {
      "id" : 'mockup-123456',
      "name" : '',
      "pageSize" : '15', // 每页的条数（用户配置项）
      "isFirstLogin" : false,
      "auth" : {
        "DAN_ADRESOURCE_ESTIMATE" : 1,
        "DAN_DELIVERY" : 1,
        "DAN_PRODUCT" : 1,
        "DAN_ACCOUNT" : 1,
        "DAN_INTERNAL_REPORT" : 1, // 管理端报告
        "DAN_CUSTOMER_REPORT" : 1  // 客户报告
      }
    }
  }
}
mockup.register('/account/session', account_session_success);

