/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * app.js ~ 2011/04/13 15:27:55
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/

// 依赖的控件，依次列出来
goog.require('ui.PagableList');
goog.require('base.RemoteListDataSource');

// App相关的初始化函数
goog.require('app.Init');
goog.require('app.Launch');

// include的路径是相对于base.js的
goog.include('css/base.css');
goog.include('css/dn-list.css');
goog.include('../test/app/pageablelist/tpl.html');

// mockup
goog.require('baidu.Mockup');
goog.require('app.mockup');
goog.require('app.config');
goog.require('app.init');

// 用window.onload保证所有js脚本加载完了
// window.onload = function() {

// }



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
