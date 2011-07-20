/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: mockup.js 5180 2011-04-28 15:28:52Z liyubei $
 *
 **************************************************************************/



/**
 * mockup.js ~ 2011/04/25 23:10:32
 * @author liyubei@baidu.com (leeight)
 * @version $Revision: 5180 $
 * @description
 *
 **/

goog.require('baidu.mockup.register');
goog.require('dn.ConstMap');
goog.require('er.context');

goog.provide('community.mockup');

var community_list = {
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
              'id': 1,
              'name': '生活圈1',
              'status' : 1,
              'sale_price' : {
                '1' : 1000,
                '2' : 2000,
                '3' : 3000,
                '4' : 4000,
                '5' : 5000,
                '6' : 6000
              }
            },
            {
                'id': 2,
                'name': '生活圈2',
                'status' : 1,
                'sale_price' : {
                  '1' : 1000,
                  '2' : 2000,
                  '3' : 3000,
                  '4' : 4000,
                  '5' : 5000,
                  '6' : 6000
                }
            },
            {
                'id': 3,
                'name': '生活圈3',
                'status' : 1,
                'sale_price' : {
                  '1' : 1000,
                  '2' : 2000,
                  '3' : 3000,
                  '4' : 4000,
                  '5' : 5000,
                  '6' : 6000
                }
            },
            {
                'id': 4,
                'name': '生活圈4',
                'status' : 2,
                'sale_price' : {
                  '1' : 1000,
                  '2' : 2000,
                  '3' : 3000,
                  '4' : 4000,
                  '5' : 5000,
                  '6' : 6000
                }
            }
        ]
    }
};

var community_read_success = {
  'success' : 'true',
  'message' : {},
  'result' : {
    'id' : '123',
    'name' : "i'm mockup",
    'sale_price' : {
      '1' : '1000',
      '2' : '2000',
      '3' : '3999',
      '4' : '4900',
      '5' : '5000',
      '6' : '6000'
    }
  }
};

baidu.mockup.register('/community/read', community_read_success);
baidu.mockup.register('/community/list', community_list);

// 初始化er.context的内容
er.context.set('communityStatusMap', new dn.ConstMap({
  '0' : '正常',
  '1' : '存档'
}));
er.context.set('productTypeMap', new dn.ConstMap({
  '0' : '视频',
  '1' : '浮窗',
  '2' : '路障',
  '3' : '泰山压顶',
  '4' : '通栏',
  '5' : '画中画'
}));
er.context.set('productTypeList', [
  {'text': '视频', 'value': '0'},
  {'text': '浮窗', 'value': '1'},
  {'text': '路障', 'value': '2'},
  {'text': '泰山压顶', 'value': '3'},
  {'text': '通栏', 'value': '4'},
  {'text': '画中画', 'value': '5'}
]);




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
