/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: actions.js 6591 2011-06-12 08:52:51Z liyubei $ 
 * 
 **************************************************************************/
 
 
 
/**
 * actions.js ~ 2011/06/12 15:49:20
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 6591 $ 
 * @description 
 *  
 **/

goog.require('er.controller');
goog.require('er.Action');
goog.require('ui.MediaUploader');

goog.include('../test/ui/demo/actions.tpl.html');

goog.provide('dan.test.Action1');
goog.provide('dan.test.Action2');
goog.provide('dan.test.Uploader');

/**
 * @constructor
 * @extends {ui.MediaUploader}
 * @param {Object} options 控件初始化参数
 */
dan.test.Uploader = function(options) {
  ui.MediaUploader.call(this, options);
}
baidu.inherits(dan.test.Uploader, ui.MediaUploader);

dan.test.Uploader.prototype.processResponse = function(data) {
  // do nothing here
}

dan.test.Uploader.prototype.bindEvent = function() {
  dan.test.Uploader.superClass.bindEvent.call(this);

  var me = this;
  this.addListener(ui.events.BEFORE_UPLOAD, function(){
    // fake data
    setTimeout(function(){
      me.trigger(ui.events.UPLOAD_SUCCESS);
    }, 1000);
  });
}

/**
 * @constructor
 * @extends {er.Action}
 */
dan.test.Action1 = function(){
  er.Action.call(this);
  this.view = 'Action1View';
}
baidu.inherits(dan.test.Action1, er.Action);

/**
 * @constructor
 * @extends {er.Action}
 */
dan.test.Action2 = function(){
  er.Action.call(this);
  this.view = 'Action2View';
  this.model = {};
}
baidu.inherits(dan.test.Action2, er.Action);

dan.test.Action2.prototype.initModel = function(argMap, callback){
  this.model['upload_url'] = '#';
  callback();
}


// register module
er.controller.addModule({
  'config' : {
    'action' : [
      {
        'location' : '/action1',
        'action' : 'dan.test.Action1'
      },
      {
        'location' : '/action2',
        'action' : 'dan.test.Action2'
      }
    ]
  }
});

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
