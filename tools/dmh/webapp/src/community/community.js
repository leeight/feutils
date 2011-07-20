/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    community/community.js
 * desc:    生活圈模块
 * author:  yuanhongliang
 * date:    $Date: 2011-05-31 10:50:20 +0800 (周二, 31 五月 2011) $
 */


goog.require('dn.util');
goog.require('er.context');
goog.require('er.controller');

goog.provide('community.config');
goog.provide('community.data');

/**
 * 生活圈的配置信息
 * @type {Object}
 * @const
 */
community.config = {
  'action' : [
    {
      'location' : '/community/list',
      'action' : 'community.List'
    },
    {
      'location' : '/community/create',
      'action' : 'community.Form'
    },
    {
      'location' : '/community/update',
      'action' : 'community.Form'
    }
  ],

  'listFields' : [
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
        var communityStatusMap = er.context.get('communityStatusMap');
        var status = item['status'];
        return communityStatusMap[status];
      }
    },
    {
      'width' : 300,
      'title' : '刊例价',
      'field' : 'sale_price',
      'breakLine' : true,
      'content' : function(item) {
        var sale_price = item['sale_price'];
        var productTypeMap = er.context.get('productPriceTypeMap');
        var html = [];
        baidu.object.each(productTypeMap, function(value, key) {
          html.push( value + '刊例价：' + sale_price[key]);
        });

        return html.join('&nbsp;,&nbsp;');
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
};

/**
 * 生活圈的数据访问接口
 */
community.data = dn.util.da_generator([
  {
    'name': 'list',
    'url': '/community/list'
  },
  {
    'name' : 'status_update',
    'url' : '/community/status_update'
  },
  {
    'name' : 'create',
    'url' : '/community/create'
  },
  {
    'name' : 'update',
    'url' : '/community/update'
  },
  {
    'name' : 'read',
    'url' : '/community/read'
  },
  {
    'name' : 'slotlist',
    'url' : '/community/slotlist'
  }
]);
er.controller.addModule(community);
