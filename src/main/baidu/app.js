/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * app.js ~ 2011/04/22 16:52:14
 * @author liyubei@baidu.com (leeight)
 * @version $Revision$ 
 * @description 
 *  
 **/

// goog.ENABLE_DEBUG = true;

// 依赖的控件，依次列出来
goog.require('ui.Button');

// App相关的初始化函数
goog.require('app.Init');
goog.require('app.Launch');

// include的路径是相对于base.js的
goog.include('css/base.css');
goog.include('baidu/tpl.html');

// baidu app module
goog.require('app.module.ModuleManager');

goog.provide('baidu.app.start');

/**
 * @export
 */
baidu.app.start = function() {
  // app.Launch用来保证所有的tpl.html加载完了
  app.Launch(function(){
    // 初始化ui.Page
    app.Init('MAIN_PAGE_BAIDU', baidu.g('Main'));
  });
  app.module.ModuleManager.getInstance().setLoaded('baidu');
};
goog.run(baidu.app.start);














/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
