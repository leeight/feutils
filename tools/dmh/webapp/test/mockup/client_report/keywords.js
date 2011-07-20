/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: keywords.js 343 2011-02-19 11:03:20Z liyubei $ 
 * 
 **************************************************************************/
 
 
 
/**
 * ../../test/mockup/keywords.js ~ 2011/02/19 16:41:25
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 343 $ 
 * @description 
 * keywords report mockup
 **/

var report_keywords_success = {
  "success" : "true",
  "message" : {},
  "page" : {
    "pageNo":1, 
    "pageSize":120, 
    "orderBy":"orderId", 
    "order":"desc", 
    "totalCount":4, 
    "result" : [
      {
        "keyword" : 'google',
        "impression_count" : '10000',
        "click_count" : '20000',
        "click_ratio" : '3%%',
        "impression_uu" : 'xxxxx',
        "click_uu" : 'click_uu',
        "click_uu_ratio" : 'click_uu_ratio',
        "impression_uu_ratio" : 'impression_uu_ratio'
      },
      {
        "keyword" : '百度',
        "impression_count" : '10000',
        "click_count" : '20000',
        "click_ratio" : '3%%',
        "impression_uu" : 'xxxxx',
        "click_uu" : 'click_uu',
        "click_uu_ratio" : 'click_uu_ratio',
        "impression_uu_ratio" : 'impression_uu_ratio'
      }
    ]
  }
}
mockup.register('/client_report/keywords', report_keywords_success);





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
