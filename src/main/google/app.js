/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * app.js ~ 2011/04/23 23:45:09
 * @author liyubei@baidu.com (leeight)
 * @version $Revision$ 
 * @description 
 *  
 **/

goog.ENABLE_DEBUG = true;

// 依赖的控件，依次列出来
goog.require('ui.PagableList');
goog.require('base.RemoteListDataSource');

// App相关的初始化函数
goog.require('app.Init');
goog.require('app.Launch');

// include的路径是相对于base.js的
goog.include('css/base.css');
goog.include('css/dn-list.css');
goog.include('google/tpl.html');

// mockup
goog.require('google.mockup');

// init
goog.require('google.config');

// google app module
goog.require('app.module.ModuleManager');

goog.provide('google.app.start');

/**
 * google.app.start
 * @export
 */
google.app.start = function() {
  // app.Launch用来保证所有的tpl.html加载完了
  app.Launch(function(){
    // model
    var model = {
      'fields' : google.config.listFields
    }

    // 初始化ui.Page
    app.Init('MAIN_PAGE_google', baidu.g('Main'), model);

    // 初始化PageableList
    var list = ui.util.get('google-list');
    list.datasource = new base.RemoteListDataSource(function(params, callback){
      baidu.ajax.get('/google/list', function(xhr){
        callback(app.json.parse(xhr.responseText));
      });
    });
    list.getData();
  });
  app.module.ModuleManager.getInstance().setLoaded('google');
};
goog.run(google.app.start);
















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
