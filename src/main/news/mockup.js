/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * mockup.js ~ 2011/04/23 23:44:46
 * @author liyubei@baidu.com (leeight)
 * @version $Revision$ 
 * @description 
 *  
 **/

goog.require('baidu.mockup.register');

goog.provide('news.mockup');

(function(){

var news_list = {
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
              "id": 1,
              "name": "生活圈1",
              "status" : 1,
              "sale_price" : {
                "1" : 1000,
                "2" : 2000,
                "3" : 3000,
                "4" : 4000,
                "5" : 5000,
                "6" : 6000
              }
            },
            {
                "id": 2,
                "name": "生活圈2",
                "status" : 1,
                "sale_price" : {
                  "1" : 1000,
                  "2" : 2000,
                  "3" : 3000,
                  "4" : 4000,
                  "5" : 5000,
                  "6" : 6000
                }
            },
            {
                "id": 3,
                "name": "生活圈3",
                "status" : 1,
                "sale_price" : {
                  "1" : 1000,
                  "2" : 2000,
                  "3" : 3000,
                  "4" : 4000,
                  "5" : 5000,
                  "6" : 6000
                }
            },
            {
                "id": 4,
                "name": "生活圈4",
                "status" : 2,
                "sale_price" : {
                  "1" : 1000,
                  "2" : 2000,
                  "3" : 3000,
                  "4" : 4000,
                  "5" : 5000,
                  "6" : 6000
                }
            }
        ]
    }
}

baidu.mockup.register('/news/list', news_list);

})();




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
