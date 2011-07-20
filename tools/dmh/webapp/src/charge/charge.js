/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: charge.js 5258 2011-05-06 01:09:15Z liyubei $
 *
 **************************************************************************/



/**
 * charge.js ~ 2011/02/18 23:19:14
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5258 $
 * @description
 * 计费名相关的模块
 **/

goog.require('dn.util');
goog.require('er.context');
goog.require('er.controller');

goog.provide('charge.config');
goog.provide('charge.data');


/**
 * @type {Object}
 * @const
 */
charge.config = {
  'action' : [
    {
      'location' : '/charge/list',
      'action' : 'charge.List'
    },
    {
      'location' : '/charge/create',
      'action' : 'charge.Form'
    },
    {
      'location' : '/charge/update',
      'action' : 'charge.Form'
    }
  ],
  'listFields' : [
    {
      'width' : 200,
      'title' : '计费名',
      'field' : 'dn_name',
      'subEntry' : false,
      'content' : function(item) {
        return item['dn_name'];
      }
    },
    {
      'width' : 200,
      'title' : '域名',
      'field' : 'domain',
      'subEntry' : false,
      'content' : function(item) {
        return item['domain'];
      }
    },
    {
      'width' : 50,
      'title' : '操作',
      'content' : function(item) {
        return baidu.format(
            '<a href="#/charge/update~id={0}">修改</a>',
            item['id']
        );
      }
    }
  ]
};

/**
 * 计费名域名数据访问接口
 * @type {Object.<string, Function>}
 * @const
 */
charge.data = dn.util.da_generator([
  {
    'name': 'list',
    'url': '/charge/list'
  },
  {
    'name' : 'batch_delete',
    'url' : '/charge/batch_delete'
  },
  {
    'name' : 'create',
    'url' : '/charge/create'
  },
  {
    'name' : 'update',
    'url' : '/charge/update'
  }
]);
er.controller.addModule(charge);




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
