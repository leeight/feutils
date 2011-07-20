/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: mockup.js 5258 2011-05-06 01:09:15Z liyubei $
 *
 **************************************************************************/



/**
 * mockup.js ~ 2011/05/05 23:35:06
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5258 $
 * @description
 *
 **/


goog.require('baidu.mockup.register');
goog.require('dn.ConstMap');
goog.require('er.context');

goog.provide('charge.mockup');


var charge_list_success = {
  'success' : 'true',
  'message' : {},
  'page' : {
    'pageNo': 1,
    'pageSize': 120,
    'orderBy': '',
    'order': 'desc',
    'totalCount': 4,
    'result' : [
      {
        'id' : '对应关系ID',
        'dn_name' : 'xxx',
        'domain' : 'a.com'
      },
      {
        'id' : '2',
        'dn_name' : 'xxx',
        'domain' : 'b.com'
      }
    ]
  }
};

var charge_read_success = {
  'success' : 'true',
  'message' : {},
  'result' : {
    'id' : '对应关系ID',
    'dn_name' : 'xxx',
    'domain' : 'a.com is mockup'
  }
};

var charge_update_success = {
  'success' : 'true',
  'message' : {}
};

var charge_create_failure = {
  'success' : 'false',
  'message' : {
    'field' : {
      'dn_name' : '不存在这个计费名',
      'domain' : '在黑名单里面'
    }
  }
};

baidu.mockup.register('/charge/list', charge_list_success);
baidu.mockup.register('/charge/read', charge_read_success);
baidu.mockup.register('/charge/update', charge_update_success);
baidu.mockup.register('/charge/create', charge_create_failure);



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
