/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: Page.js 5280 2011-05-06 06:54:36Z liyubei $
 *
 **************************************************************************/



/**
 * ui/Page.js ~ 2011/02/16 18:57:04
 * @author yuanhongliang
 * @version $Revision: 5280 $
 * @description
 * ui控件的基类
 **/

goog.require('ui.Control');

goog.provide('ui.Page');



/**
 * ui.Page
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.Page = function(options) {
  ui.Control.call(this, options);
};
baidu.inherits(ui.Page, ui.Control);
