/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: mockup.js 5304 2011-05-07 06:22:03Z liyubei $
 *
 **************************************************************************/



/**
 * mockup.js ~ 2011/05/05 23:35:06
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5304 $
 * @description
 *
 **/


goog.require('baidu.mockup.register');
goog.require('dn.ConstMap');
goog.require('er.context');

goog.provide('material.mockup');

var material_read = {
  'success' : 'true',
  'message' : {},
  'result' : {
    'id': '创意的ID',
    'name' : '创意的名称',
    'm_type': 6,
    'src': 'http://www.google.com',
    'target_url': 'http://target_url.com',
    'target_window': '1',
    'collapse_type': '收缩状态物料类型 0Flash 1图片',
    'is_set_collapse_src': 1,
    'collapse_src_file_name' : '',
    'collapse_src': '资源的地址',
    'custom_player_url': '播放器外框',
    'html_code': '富媒体的HTML代码',
    'max_impression_time': '100',
    'has_anchor_overlay' : '1',
    'width' : 'width',
    'height' : 'height',
    'query' : 'MOCKUP QUERY',
    'status': 'xxx'
  }
};

var material_create_failed = {
  'success' : 'false',
  'message' : {
    'field' : {
      'name' : '人品不好',
      'type' : '人品不好',
      'src' : '人品不好',
      'query' : 'query太长',
      'target_url' : '人品不好',
      'target_window' : '人品不好',
      'collapse_src' : '人品不好',
      'custom_player_url' : '人品不好',
      'html_code' : '人品不好',
      'max_impression_time' : '人品不好',
      'width' : '不好',
      'height' : '不好'
    }
  }
};

var material_create_success = {
    'success': 'true',
    'message': { },
    'result': {
        'id': 9,
        'name': '李玉北',
        'type': 1,
        'src' : 'http:&#47;&#47;db-testing-ecom338.db01.baidu.com:8810&#47;media&#47;id=nHfdPjD4Pj01&#38;gp=407&#38;time=nHc4rHc1P1T1rf.jpg',
        'width' : 595,
        'height' : 452,
        'target_url' : 'http:&#47;&#47;www.google.com',
        'target_window' : 0,
        'collapse_type' : 0,
        'collapse_src_file_name' : '',
        'collapse_src' : '',
        'custom_player_url' : '',
        'html_code' : '',
        'max_impression_time' : 0,
        'status' : 0,
        'has_anchor_overlay' : 1
    }
};

baidu.mockup.register('/material/read', material_read);
baidu.mockup.register('/material/create', material_create_success);

er.context.set('targetWindowTypeList', [
  {'text': '原窗口', 'value': '0'},
  {'text': '新窗口', 'value': '1'}
]);

er.context.set('materialTypeList', [
  {'text': '标准视频', 'value': '0'},
  {'text': '标准视频（带搜索框）', 'value': '5'},
  {'text': '非标准视频', 'value': '1'},
  {'text': 'Flash', 'value': '2'},
  {'text': '图片', 'value': '3'},
  {'text': '富媒体', 'value': '4'},
  {'text': '角标视频', 'value': '6'}
]);

er.context.set('productTypeMap', new dn.ConstMap({
  '0': '视频',
  '1': '浮窗',
  '2': '路障',
  '3': '泰山压顶',
  '4': '通栏',
  '5': '画中画'
}));

er.context.set('visitor', {
  'id': 1790001,
  'name': '百度公司',
  'role_id': 1,
  'auth': {
    'DAN_ADRESOURCE_ESTIMATE': 1,
    'DAN_ACCOUNT': 1,
    'DAN_DELIVERY': 1,
    'DAN_PRODUCT': 1,
    'DAN_CUSTOMER_REPORT': 1,
    'DAN_INTERNAL_REPORT': 1
  }
});

er.context.set('videoPlayerMap', {
  'standard_v0': 'http://img.baidu.com/adm/video-player-no-search-box-1.3.swf',
  'standard_v1': 'http://img.baidu.com/adm/video-player-1.3.swf',
  'default_logo': 'http://img.baidu.com/adm/gm-logo-100x100.png',
  'upload_host': 'http://danvup.baidu.com'
});












/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
