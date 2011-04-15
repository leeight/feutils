/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * app.js ~ ${app.create.time}
 * @author ${app.user.name}(${app.user.email})
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
// goog.include('css/base.css');
// goog.include('css/dn-list.css');
goog.include('${app.tpl.href}');

// mockup
goog.require('${app}.mockup');

// init
goog.require('${app}.config');
goog.require('${app}.init');

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
