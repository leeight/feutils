/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: mockup.js 5181 2011-04-28 15:30:19Z liyubei $
 *
 **************************************************************************/



/**
 * mockup.js ~ 2011/04/25 23:10:32
 * @author liyubei@baidu.com (leeight)
 * @version $Revision: 5181 $
 * @description
 *
 **/

goog.require('baidu.mockup.register');
goog.require('dn.ConstMap');
goog.require('er.context');

goog.provide('account.mockup');

var account_list = {
  'success' : 'true',
  'message' : {},
  'page' : {
    'pageNo' : 1,
    'pageSize': 15,
    'orderBy': 'id',
    'order': 'desc',
    'totalCount' : 3,
    'result' : [
      {
        'id' : 2902672,
        'name' : 'danadmin',
        'role_id' : 1,
        'active_time' : '20110331152700'
      },
      {
        'id' : 1793135,
        'name' : '白云海',
        'role_id' : 1,
        'active_time' : '20110427101618'
      },
      {
        'id' : 1792586,
        'name' : 'chengxi-ALB',
        'role_id' : 4,
        'active_time' : '20110331182800'
      }
    ]
  }
};
baidu.mockup.register('/account/list', account_list);

er.context.set('rolesList', [
  {'text': '管理员', 'value': '1'},
  {'text': '销售', 'value': '2'},
  {'text': '客服', 'value': '3'},
  {'text': '客户', 'value': '4'}
]);
er.context.set('rolesMap', {'1': '管理员', '2': '销售', '3': '客服', '4': '客户'});




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
