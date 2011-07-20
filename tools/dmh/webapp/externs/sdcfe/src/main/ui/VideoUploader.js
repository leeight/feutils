/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: VideoUploader.js 5280 2011-05-06 06:54:36Z liyubei $
 *
 **************************************************************************/



/**
 * src/ui/VideoUploader.js ~ 2011/03/10 11:13:53
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5280 $
 * @description
 * 上传视频的控件，和MediaUploader有些差异
 * 1. 上传的地址是随机的，不是固定的，每次选择的文件修改之后，都需要
 * 更改form的action，规则是：
 * http://{host}/commit/{video_id}/{callback}
 * 其中：host和callback是基本固定的，video_id是每次随机生成的。
 **/

goog.require('ui.MediaUploader');

goog.provide('ui.VideoUploader');



/**
 * @constructor
 * @extends {ui.MediaUploader}
 * @param {Object} options 控件初始化参数.
 */
ui.VideoUploader = function(options) {
  ui.MediaUploader.call(this, options);
};
baidu.inherits(ui.VideoUploader, ui.MediaUploader);


/**
 * 视频服务器地址.
 * @type {string}
 */
ui.VideoUploader.prototype.host;


/** @inheritDoc */
ui.VideoUploader.prototype.datakey = 'file';


/**
 * 生成一个随机的字符串，用来当作video id，长度必须是32，全部大写.
 * @private
 * @return {string}
 */
ui.VideoUploader.prototype._genVideoId = function() {
  var video_id = '';
  while (video_id.length < 32) {
    video_id += (Math.floor(Math.random() * 2147483648).toString(36));
  }

  return video_id.substring(0, 32).toUpperCase();
};


/** @inheritDoc */
ui.VideoUploader.prototype.getRequestUrl = function() {
  var video_id = this._genVideoId();
  var callback = 'parent.' + this.getStrRef() + '.processResponse';
  return this.host + '/commit/' + encodeURIComponent(video_id) + '/' + encodeURIComponent(callback);
};


/** @inheritDoc */
ui.VideoUploader.prototype.bindEvent = function() {
  ui.VideoUploader.superClass.bindEvent.call(this);

  var me = this;
  this.addListener(ui.events.BEFORE_CHANGE, function() {
    // 每次文件的更改，都生成一个随机的ID
    var action = me.getRequestUrl();
    document.forms[me.getId('form')].action = action;
  });
};


















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
