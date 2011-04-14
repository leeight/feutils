/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * app.js ~ 2011/04/13 15:27:55
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/

// 依赖的控件，依次列出来
goog.require('ui.PagableList');
goog.require('base.RemoteListDataSource');

// App相关的初始化函数
goog.require('app.Init');
goog.require('app.Launch');

// include的路径是相对于base.js的
goog.include('css/base.css');
goog.include('css/dn-list.css');
goog.include('../test/app/pageablelist/tpl.html');

// mockup
goog.require('baidu.Mockup');

// 用window.onload保证所有js脚本加载完了
window.onload = function() {
  var mockup = new baidu.Mockup();
  mockup.init();
  mockup.register('/community/list', {
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
  });

  // app.Launch用来保证所有的tpl.html加载完了
  app.Launch(function(){
    var listFields = [
      {
        'width' : 200,
        'title' : '生活圈名称',
        'field' : 'name',
        'subEntry' : false,
        'content' : function(item) {
          return item['name'];
        }
      },
      {
        'width' : 50,
        'title' : '状态',
        'field' : 'status',
        'subEntry' : false,
        'content' : function(item) {
          return item['status'];
        }
      },
      {
        'width' : 300,
        'title' : '刊例价',
        'field' : 'sale_price',
        'breakLine' : true,
        'content' : function(item) {
          return item['sale_price'];
        }
      },
      {
        'width' : 100,
        'title' : '操作',
        'content' : function(item) {
          return baidu.format('<a href="#/community/update~id={0}">修改</a>',
              item['id']);
        }
      }
    ]

    // model
    var model = {
      'fields' : listFields
    }

    // 初始化ui.Page
    app.Init('MAIN_PAGE', baidu.g('Main'), model);

    // 初始化PageableList
    var list = ui.util.get('list');
    list.datasource = new base.RemoteListDataSource(function(params, callback){
      baidu.ajax.get('/community/list', function(xhr){
        callback(goog.json.parse(xhr.responseText));
      });
    });
    list.getData();
  });
}



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
