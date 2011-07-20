/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: material.js 6944 2011-06-28 06:30:13Z lixiang05 $ 
 * 
 **************************************************************************/
 
 
 
/**
 * ../../test/mockup/material.js ~ 2011/02/17 01:01:23
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 6944 $ 
 * @description 
 * material mockup
 **/

var material_read = {
  "success" : "true",
  "message" : {},
  "result" : {
    "id": "创意的ID",
    "name" : "创意的名称",
    "m_type": 6,
    "src": "http://www.google.com",
    "target_url": "http://target_url.com",
    "target_window": "1",
    "collapse_type": "收缩状态物料类型 0Flash 1图片",
    "is_set_collapse_src": 1,
    "charge_mode": 1,
    "collapse_src_file_name" : "",
    "collapse_src": "资源的地址",
    "custom_player_url": "播放器外框",
    "html_code": "富媒体的HTML代码",
    "max_impression_time": "100",
    "has_anchor_overlay" : "1",
    "width" : "width",
    "height" : "height",
    "query" : "MOCKUP QUERY",
    "status": "xxx"
  }
};
mockup.register('/material/read', material_read);




var material_create_failed = {
  "success" : "false",
  "message" : {
    "field" : {
      "name" : "人品不好",
      "type" : "人品不好",
      "src" : "人品不好",
      "query" : "query太长",
      "target_url" : "人品不好",
      "target_window" : "人品不好",
      "collapse_src" : "人品不好",
      "custom_player_url" : "人品不好",
      "html_code" : "人品不好",
      "max_impression_time" : "人品不好",
      "width" : "不好",
      "height" : "不好"
    }
  }
};
// mockup.register("/material/create", material_create_failed);



var material_create_success = {
    "success": "true",
    "message": { },
    "result": {
        "id": 9,
        "name": "李玉北",
        "type": 1,
        "src" : "http:&#47;&#47;db-testing-ecom338.db01.baidu.com:8810&#47;media&#47;id=nHfdPjD4Pj01&#38;gp=407&#38;time=nHc4rHc1P1T1rf.jpg",
        "width" : 595,
        "height" : 452,
        "target_url" : "http:&#47;&#47;www.google.com",
        "target_window" : 0,
        "collapse_type" : 0,
        "collapse_src_file_name" : "",
        "collapse_src" : "",
        "custom_player_url" : "",
        "html_code" : "",
        "max_impression_time" : 0,
        "status" : 0,
        "has_anchor_overlay" : 1
    }
}
mockup.register("/material/create", material_create_success);












/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
