/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: mockup.js 5258 2011-05-06 01:09:15Z liyubei $
 *
 **************************************************************************/



/**
 * mockup.js ~ 2011/05/06 00:02:14
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5258 $
 * @description
 * keyword_price mockup
 **/

goog.require('baidu.mockup.register');
goog.require('dn.ConstMap');
goog.require('er.context');

goog.provide('keywordPrice.mockup');

var keywordPriceList = {
    'success' : 'true',
    'message' : {},
    'page' : {
        'result' : [{
            'price' : {
                '0' : 1000,
                '1' : 2000,
                '2' : 3000,
                '3' : 4000,
                '4' : 5000,
                '5' : 6000
            }
        }]
    }
};

var keywordPriceUpdate = {
    'success' : 'true',
    'message' : {}
};

baidu.mockup.register('/keyword_price/read', keywordPriceList);
baidu.mockup.register('/keyword_price/update', keywordPriceUpdate);

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
