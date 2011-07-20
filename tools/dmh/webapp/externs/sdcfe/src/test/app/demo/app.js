/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: app.js 5280 2011-05-06 06:54:36Z liyubei $ 
 * 
 **************************************************************************/
 
 
 
/**
 * app.js ~ 2011/04/13 15:27:55
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5280 $ 
 * @description 
 *  
 **/

// 依赖的控件，依次列出来
goog.require('ui.Button');
// goog.require('...');

// App相关的初始化函数
goog.require('app.Init');
goog.require('app.Launch');

// include的路径是相对于base.js的
goog.include('../test/app/demo/tpl.html');

// 用window.onload保证所有js脚本加载完了
window.onload = function() {
  // app.Launch用来保证所有的tpl.html加载完了
  app.Launch(function(){
    // 初始化ui.Page
    app.Init('MAIN_PAGE', baidu.g('Main'));
  });
}



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
