/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * ui/externs.js ~ 2011/04/04 21:32:34
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 这里面定义在prototype上面的属性，说明是需要在模版中
 * 使用的，通过定义在externs中，避免被编译器rename
 **/

/**
 * @type {Object}
 */
var ui = {};

/**
 * @constructor
 * @param {Object} options 控件初始化参数.
 */
ui.Control = function(options) {}

/**
 * @type {string}
 */
ui.Control.prototype.skin;

/**
 * @type {string}
 */
ui.Control.prototype.view;



/**
 * @constructor
 * @param {Object} options 控件初始化参数.
 */
ui.Button = function(options) {}

/**
 * @type {string}
 */
ui.Button.prototype.content;

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
