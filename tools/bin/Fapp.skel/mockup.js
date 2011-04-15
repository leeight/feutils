/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * mockup.js ~ %(app.create.time)s
 * @author %(app.user.email)s (%(app.user.name)s)
 * @version $Revision$ 
 * @description 
 *  
 **/

goog.require('baidu.Mockup');

goog.provide('%(app)s.mockup');

(function(){

var community_list = {
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

%(app)s.mockup = function() {
  var mockup = new baidu.Mockup();
  mockup.init();
  mockup.register('/community/list', community_list);
}

})();




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
