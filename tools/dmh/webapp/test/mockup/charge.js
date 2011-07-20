/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: charge.js 1866 2011-02-28 10:21:10Z liyubei $ 
 * 
 **************************************************************************/
 
 
 
/**
 * ../../test/mockup/charge.js ~ 2011/02/19 12:31:11
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 1866 $ 
 * @description 
 * charge mockup
 **/
var charge_list_success = {
  "success" : "true",
  "message" : {},
  "page" : {
    "pageNo":1, 
    "pageSize":120,
    "orderBy":"", 
    "order":"desc",
    "totalCount":4,
    "result" : [
      {
        "id" : "对应关系ID",
        "dn_name" : "xxx",
        "domain" : "a.com"
      },
      {
        "id" : "2",
        "dn_name" : "xxx",
        "domain" : "b.com"
      }
    ]
  }
}
mockup.register("/charge/list", charge_list_success);



var charge_read_success = {
  "success" : "true",
  "message" : {},
  "result" : {
    "id" : "对应关系ID",
    "dn_name" : "xxx",
    "domain" : "a.com is mockup"
  }
};
mockup.register("/charge/read", charge_read_success);



var charge_update_success = {
  "success" : "true",
  "message" : {}
};
mockup.register("/charge/update", charge_update_success);

var charge_create_failure = {
  "success" : "false",
  "message" : {
    "field" : {
      "dn_name" : "不存在这个计费名",
      "domain" : "在黑名单里面"
    }
  }
};
mockup.register("/charge/create", charge_create_failure);









/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */

