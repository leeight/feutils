/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    video/video.js
 * desc:    广告模块声明
 * author:  maoquan
 * date:    2011-07-06
 */

goog.provide('video');

var video = {};

video.config = {

  /**
   * action配置
   */
  'action': [
    {
      location: '/video/index',
      action: 'video.UploadForm'
    },
    {
      location: '/video/edit',
      action: 'video.EditForm'
    },
    {
      location: '/video/preview',
      action: 'video.Preview'
    }
  ],

  /**
   * url配置
   */
  'url': {
    convert: 'bin/ffmpeg/video.php',
    upload : '/bin/ffmpeg/upload.php'
  },
  
  'loading' : {
    load : '加载中，请稍后...',
    upload : '正在上传视频...',
    convert : '正在转换视频...',
    preview : '正在载入预览...'
  },
  
  /**
   * ffmpeg所在路径前缀
   */
  'FFMPEG_PATH': 'bin/ffmpeg/',
  
  /**
   * 视频可调整的最大最小值
   */
  'size': {
    //视频转换的固定尺寸
    FIXED_WIDTH: 306,
    FIXED_HEIGHT: 228,
    //用户操作界面的宽度
    FIXED_OPERATE_WIDTH:580
  },
  
  /**
   * 预览使用的DAN广告配置项
   */
  'DAN_AD_CONFIG': {  
    "_stype" : 2,  
    "_w" : 360,  
    "_h" : 262,  
    "_type" : "json_html",  
    "_html" : {
      "url_parameter" : "s=0&sid=0&t=0&aid=0&name=0&mid=0",
      "dn_ad_id":123,
      "product_type":0,
      "material_type":1,
      "src":"NEED_REPLACE.flv",
      "width":324,
      "height":297,
      "player_url": "bin/ffmpeg/video-player-1.5.swf",
      "collapse_type":0,
      "collapse_src":"",
      "target_url":"NEED_REPLACE.FLV",
      "rcv_url":"http://www.baidu.com/s?from=dan",
      "query":"",
      "target_window":1,
      "html_code":"",
      "max_impression_time":0
    },  
    "_fxp" : false,  
    "_sf" : false,  
    "_st" : 0,  
    "_top" : 0,  
    "_left" : 0,  
    "_hs" : 0,  
    "_vs" : 0,  
    "_bf" : true,  
    "_isMlt" : 3,  
    "_qid"  : "95565e4b5d8f72dc"  
  }
};

video.data = function() {
    var url = video.config.url;

    return dn.util.da_generator([
        // 用户上传视频
        {
            name: 'convert',
            url: url.convert
        }
    ]);
}();


er.controller.addModule(video);
