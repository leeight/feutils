/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: mockup.js 5303 2011-05-07 05:14:27Z liyubei $
 *
 **************************************************************************/



/**
 * mockup.js ~ 2011/05/07 00:10:23
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5303 $
 * @description
 * slot mockup
 **/

goog.require('baidu.mockup.register');
goog.require('dn.ConstMap');
goog.require('er.context');

goog.provide('slot.mockup');

var slotList = {
    'success' : 'true',
    'message' : {},
    'page' : {
        'pageNo': 1,
        'pageSize': 15,
        'orderBy': 'id',
        'order': 'desc',
        'totalCount': 155,
        'result': [
                                                            {
                            'id' : 10000346,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : '固定广告位-300*250-dan-img广告',
                            'columbus_slot_id' : 1115267,
                            'username' : '',
                            'domain' : [
                              ''
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                                     {
                                          'id' : 639 ,
                                          'name' : 'stellayang'
                                      }],
                            'max_impression_freq_uu_hour': 0,
                            'max_impression_freq_uu_count': 0,
                            'adowner_blacklist' : [
                                                              ],
                            'purchase_price' : '0.0000',
                            'sale_price' : '3.0000'
                        }, {
                            'id' : 10000279,
                            'slot_type' : 1,
                            'slot_sub_type' : 3,
                            'name' : '广告位201',
                            'columbus_slot_id' : 1116201,
                            'username' : '广告用户名201',
                            'domain' : [
                              'slots1116201.cn'
                            ],
                            'type' : '4',
                            'status' : 2,
                            'communities' : [
                                                                     {
                                          'id' : 40 ,
                                          'name' : 'sdfasf'
                                      }],
                            'max_impression_freq_uu_hour': 24,
                            'max_impression_freq_uu_count': 6,
                            'adowner_blacklist' : [
                                                              ],
                            'purchase_price' : '10.0000',
                            'sale_price' : '10.0000'
                        }, {
                            'id' : 10000276,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : '广告位118',
                            'columbus_slot_id' : 1116118,
                            'username' : '广告用户名118',
                            'domain' : [
                              'slots1116118.cn'
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                                     {
                                          'id' : 150 ,
                                          'name' : '庆庆22090'
                                      }],
                            'max_impression_freq_uu_hour': 0,
                            'max_impression_freq_uu_count': 0,
                            'adowner_blacklist' : [
                                                              ],
                            'purchase_price' : '10.0000',
                            'sale_price' : '10.0000'
                        }, {
                            'id' : 10000275,
                            'slot_type' : 1,
                            'slot_sub_type' : 3,
                            'name' : '广告位117',
                            'columbus_slot_id' : 1116117,
                            'username' : '广告用户名117',
                            'domain' : [
                              'slots1116117.cn'
                            ],
                            'type' : '4',
                            'status' : 2,
                            'communities' : [
                                                                     {
                                          'id' : 98 ,
                                          'name' : '庆庆2'
                                      }],
                            'max_impression_freq_uu_hour': 24,
                            'max_impression_freq_uu_count': 6,
                            'adowner_blacklist' : [
                                                              ],
                            'purchase_price' : '10.0000',
                            'sale_price' : '10.0000'
                        }, {
                            'id' : 10000269,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : '广告位111',
                            'columbus_slot_id' : 1116111,
                            'username' : '广告用户名111',
                            'domain' : [
                              'slots1116111.cn'
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                                     {
                                          'id' : 97 ,
                                          'name' : '庆庆1'
                                      }],
                            'max_impression_freq_uu_hour': 24,
                            'max_impression_freq_uu_count': 6,
                            'adowner_blacklist' : [
                                                              ],
                            'purchase_price' : '10.0000',
                            'sale_price' : '10.0000'
                        }, {
                            'id' : 10000268,
                            'slot_type' : 1,
                            'slot_sub_type' : 3,
                            'name' : '广告位110',
                            'columbus_slot_id' : 1116110,
                            'username' : '广告用户名110',
                            'domain' : [
                              'slots1116110.cn'
                            ],
                            'type' : '4',
                            'status' : 2,
                            'communities' : [
                                                                     {
                                          'id' : 95 ,
                                          'name' : '天才你勒格去'
                                      }],
                            'max_impression_freq_uu_hour': 0,
                            'max_impression_freq_uu_count': 0,
                            'adowner_blacklist' : [
                                                              ],
                            'purchase_price' : '10.0000',
                            'sale_price' : '10.0000'
                        }, {
                            'id' : 10000262,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : '广告位104',
                            'columbus_slot_id' : 1116104,
                            'username' : '广告用户名104',
                            'domain' : [
                              'slots1116104.cn'
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                                     {
                                          'id' : 49 ,
                                          'name' : '严飞'
                                      }],
                            'max_impression_freq_uu_hour': 0,
                            'max_impression_freq_uu_count': 0,
                            'adowner_blacklist' : [
                                                              ],
                            'purchase_price' : '10.0000',
                            'sale_price' : '10.0000'
                        }, {
                            'id' : 10000261,
                            'slot_type' : 1,
                            'slot_sub_type' : 3,
                            'name' : '广告位103',
                            'columbus_slot_id' : 1116103,
                            'username' : '广告用户名103',
                            'domain' : [
                              'slots1116103.cn'
                            ],
                            'type' : '4',
                            'status' : 2,
                            'communities' : [
                                                                     {
                                          'id' : 54 ,
                                          'name' : '一二三'
                                      }],
                            'max_impression_freq_uu_hour': 0,
                            'max_impression_freq_uu_count': 0,
                            'adowner_blacklist' : [
                                                              ],
                            'purchase_price' : '10.0000',
                            'sale_price' : '10.0000'
                        }, {
                            'id' : 10000257,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : 'fixedtest1',
                            'columbus_slot_id' : 401888480,
                            'username' : 'qatest',
                            'domain' : [
                              'qatest.com'
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                                     {
                                          'id' : 40 ,
                                          'name' : 'sdfasf'
                                      }, {
                                          'id' : 81 ,
                                          'name' : '严飞ktv00'
                                      }, {
                                          'id' : 86 ,
                                          'name' : 'sdfsdadfsadfadfsa'
                                      }],
                            'max_impression_freq_uu_hour': 45,
                            'max_impression_freq_uu_count': 1200,
                            'adowner_blacklist' : [
                                                                          {
                                              'id': 1509378,
                                              'username': '1212'
                                        }],
                            'purchase_price' : '120.0000',
                            'sale_price' : '223.0000'
                        }, {
                            'id' : 10000250,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : '测试固定广告位',
                            'columbus_slot_id' : 940929571,
                            'username' : 'sakyo',
                            'domain' : [
                              'baidu.com'
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                           ],
                            'max_impression_freq_uu_hour': 2,
                            'max_impression_freq_uu_count': 10,
                            'adowner_blacklist' : [
                                                                          {
                                              'id': 1509378,
                                              'username': '1212'
                                        }],
                            'purchase_price' : '125858.0000',
                            'sale_price' : '212.0000'
                        }, {
                            'id' : 10000248,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : '测试固定广告位',
                            'columbus_slot_id' : 883803834,
                            'username' : 'sakyo',
                            'domain' : [
                              'baidu.com'
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                           ],
                            'max_impression_freq_uu_hour': 2,
                            'max_impression_freq_uu_count': 10,
                            'adowner_blacklist' : [
                                                                          {
                                              'id': 1509378,
                                              'username': '1212'
                                        }],
                            'purchase_price' : '125858.0000',
                            'sale_price' : '212.0000'
                        }, {
                            'id' : 10000246,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : '测试固定广告位',
                            'columbus_slot_id' : 252983573,
                            'username' : 'sakyo',
                            'domain' : [
                              'baidu.com'
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                           ],
                            'max_impression_freq_uu_hour': 2,
                            'max_impression_freq_uu_count': 10,
                            'adowner_blacklist' : [
                                                                          {
                                              'id': 1509378,
                                              'username': '1212'
                                        }],
                            'purchase_price' : '125858.0000',
                            'sale_price' : '212.0000'
                        }, {
                            'id' : 10000244,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : '测试固定广告位',
                            'columbus_slot_id' : 21291326,
                            'username' : 'sakyo',
                            'domain' : [
                              'baidu.com'
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                           ],
                            'max_impression_freq_uu_hour': 2,
                            'max_impression_freq_uu_count': 10,
                            'adowner_blacklist' : [
                                                                          {
                                              'id': 1509378,
                                              'username': '1212'
                                        }],
                            'purchase_price' : '125858.0000',
                            'sale_price' : '212.0000'
                        }, {
                            'id' : 10000242,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : '测试固定广告位',
                            'columbus_slot_id' : 149637572,
                            'username' : 'sakyo',
                            'domain' : [
                              'baidu.com'
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                           ],
                            'max_impression_freq_uu_hour': 2,
                            'max_impression_freq_uu_count': 10,
                            'adowner_blacklist' : [
                                                                          {
                                              'id': 1509378,
                                              'username': '1212'
                                        }],
                            'purchase_price' : '125858.0000',
                            'sale_price' : '212.0000'
                        }, {
                            'id' : 10000239,
                            'slot_type' : 1,
                            'slot_sub_type' : 4,
                            'name' : '测试固定广告位',
                            'columbus_slot_id' : 231062395,
                            'username' : 'sakyo',
                            'domain' : [
                              'baidu.com'
                            ],
                            'type' : '5',
                            'status' : 2,
                            'communities' : [
                                                           ],
                            'max_impression_freq_uu_hour': 2,
                            'max_impression_freq_uu_count': 10,
                            'adowner_blacklist' : [
                                                                          {
                                              'id': 1509378,
                                              'username': '1212'
                                        }],
                            'purchase_price' : '125858.0000',
                            'sale_price' : '212.0000'
                        }]
    }
};

var slotItem = {
  'success' : 'true',
  'message' : {},
  'result' : {
     'id' : 10000239,
     'slot_type' : 1,
     'slot_sub_type' : 4,
     'name' : '测试固定广告位',
     'columbus_slot_id' : 231062395,
     'username' : 'sakyo',
     'domain' : [
          'baidu.com'
     ],
     'type' : '5',
     'status' : 2,
     'communities' : [
                   ],
     'max_impression_freq_uu_hour': 2,
     'max_impression_freq_uu_count': 10,
     'adowner_blacklist' : [
                            {
                 'id': 1509378,
                 'username': '1212'
              }],
     'purchase_price' : '125858.0000',
     'sale_price' : '212.0000'
  }
};

baidu.mockup.register('/slot/list', slotList);
baidu.mockup.register('/slot/read', slotItem);
// baidu.mockup.register('/slot/batch_update', batchResult);
// baidu.mockup.register('/slot/create', formSuccess);
// baidu.mockup.register('/slot/update', formSuccess);


er.context.set('slotSubTypeMap', new dn.ConstMap({
  '0': '泰山压顶广告位',
  '1': '路障广告位',
  '2': '右下广告位',
  '3': '通栏广告位',
  '4': '画中画广告位'
}));
er.context.set('slotSubTypeList', [
  {'text': '泰山压顶广告位', 'value': '0'},
  {'text': '路障广告位', 'value': '1'},
  {'text': '右下广告位', 'value': '2'},
  {'text': '通栏广告位', 'value': '3'},
  {'text': '画中画广告位', 'value': '4'}
]);
er.context.set('communityStatusMap', new dn.ConstMap({
  '0': '正常',
  '1': '存档'
}));
er.context.set('communityStatusList', [
  {'text': '正常', 'value': '0'},
  {'text': '存档', 'value': '1'}
]);
er.context.set('slotStatusFilterList', [
  {'text': '非存档', 'value': '106'},
  {'text': '有请求', 'value': '100'},
  {'text': '无请求', 'value': '101'},
  {'text': '有效', 'value': '102'},
  {'text': '已停止', 'value': '103'},
  {'text': '已存档', 'value': '104'},
  {'text': '全部', 'value': '105'}
]);
er.context.set('slotStatusMap', new dn.ConstMap({
  '0': '有请求',
  '1': '无请求',
  '2': '有效',
  '3': '已停止',
  '4': '已存档'
}));
















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
