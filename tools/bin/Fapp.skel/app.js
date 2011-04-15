/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * app.js ~ %(app.create.time)s
 * @author %(app.user.email)s (%(app.user.name)s)
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
goog.include('%(app.tpl.href)s');

// mockup
goog.require('%(app)s.mockup');

// init
goog.require('%(app)s.config');
goog.require('%(app)s.init');

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
