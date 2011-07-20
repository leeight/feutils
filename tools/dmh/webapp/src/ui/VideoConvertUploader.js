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
  this.url = '/bin/ffmpeg/upload.php'
  
};
baidu.inherits(ui.VideoConvertUploader, ui.Uploader);

/**
 * 显示预览信息的的容器
 * @type {Element}
 */
ui.VideoConvertUploader.prototype.wrapper;


/** @inheritDoc */
ui.VideoConvertUploader.prototype.render = function(opt_main) {
  ui.VideoConvertUploader.superClass.render.call(this, opt_main);

  this.wrapper = document.createElement('DIV');
  this.wrapper.id = this.getId('wrapper');
  baidu.addClass(this.wrapper, this.getClass('preview'));
  baidu.dom.insertAfter(this.wrapper, this.main);

};



/**
 * 处理服务器端返回的数据.
 * @protected
 * @param {ui.Uploader.ResponseType} data 服务器返回的数据.
 */

ui.VideoConvertUploader.prototype.processResponse = function(data) {
  if (data.success === true) {
    //保存视频信息
    er.context.set('video.info', data.result);
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
