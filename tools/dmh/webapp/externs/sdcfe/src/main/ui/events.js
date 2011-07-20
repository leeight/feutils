/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: events.js 5280 2011-05-06 06:54:36Z liyubei $
 *
 **************************************************************************/



/**
 * src/ui/events.js ~ 2011/03/02 21:06:08
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5280 $
 * @description
 * 事件类型的定义
 **/

goog.require('ui');

goog.provide('ui.events');


/**
 * @enum {string}
 */
ui.events = {
  // 浏览器事件
  LOAD: 'load',
  CLICK: 'click',
  DBCLICK: 'dbclick',
  MOUSE_OVER: 'mouseover',
  MOUSE_OUT: 'mouseout',

  // 自定义的事件
  VIEWAREA_CHANGE: 'viewareachange',
  BEFORE_CHANGE: 'beforechange',
  BEFORE_UPLOAD: 'beforeupload',
  UPLOAD_SUCCESS: 'uploadsuccess',
  UPLOAD_FAILURE: 'uploadfailure'
};




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
