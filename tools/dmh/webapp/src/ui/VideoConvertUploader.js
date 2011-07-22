/**
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/VideoConvertUploader.js
 * desc:    图片、Flash上传控件
 * author:  erik,zhaolei
 * date:    $Date: 2011-06-12 17:11:50 +0800 (周日, 12 六月 2011) $
 */

goog.require('er.template');
goog.require('ui.Uploader');
goog.require('ui.events');

goog.include('ui/VideoConvertUploader.html');

goog.provide('ui.VideoConvertUploader');



/**
 * ui.VideoConvertUploader
 * @constructor
 * @extends {ui.Uploader}
 */
ui.VideoConvertUploader = function(options) {
  ui.Uploader.call(this, options);

  this.type = 'Uploader';
  this.form = 1;
  this.url = video.config.url.upload;
  
};
baidu.inherits(ui.VideoConvertUploader, ui.Uploader);

/**
 * 显示预览信息的的容器
 * @type {Element}
 */
ui.VideoConvertUploader.prototype.wrapper;

/**
 * 绑定事件
 */
ui.VideoConvertUploader.prototype.bindEvent = function() {
    
    var me = this;
    
    ui.VideoConvertUploader.superClass.bindEvent.call(me);
    
    
    this.addListener(ui.events.BEFORE_CHANGE, function(){
        dn.loading.show(video.config.loading.upload);
    });
};

/** @inheritDoc */
ui.VideoConvertUploader.prototype.render = function(opt_main) {
  ui.VideoConvertUploader.superClass.render.call(this, opt_main);
};

/**
 * 处理服务器端返回的数据.
 * @protected
 * @param {ui.Uploader.ResponseType} data 服务器返回的数据.
 */

ui.VideoConvertUploader.prototype.processResponse = function(data) {
  
  dn.loading.hide();
  
  if (data.success === true) {
    //保存视频信息
    er.context.set('video.info', data.result);
    //存入cookie，用户刷新当前页而不是从上传页面过来时记住上次上传的视频信息
    //cookie有效时间为当天，因为每天夜里服务器会清除所有用户上传的视频
    var now = new Date();
    baidu.cookie.set('video.info', baidu.json.stringify(data.result), {expires : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)});
    //进入第二步，视频编辑
    er.locator.redirect('/video/edit');
    //this.trigger(ui.events.UPLOAD_SUCCESS);
  } else {
    var errorMessage = data.message['ERROR'];
    if (errorMessage) {
      this.showError(errorMessage);
    }
    this.trigger(ui.events.UPLOAD_FAILURE);
  }
};

/**
 * 获取HTML
 *
 * @private
 * @return {string} html代码.
 */
ui.VideoConvertUploader.prototype.getHtml = function() {
  var me = this,
      tpl = er.template.get('Uploader'),
      id = me.getId('');

  return baidu.format(tpl,
      me.getRequestUrl(),
      me.getId('localPathCntr'),
      me.getId('btnCntr'),
      me.getClass('file'),
      me.getId('file'),
      me.datakey,
      me.getClass('ifr'),
      me.getId('ifr'),
      me.getId('ifrName'),
      me.getId('ifrName'),
      me.getId('form'),
      id,
      me.getClass('fake')
  );
};
