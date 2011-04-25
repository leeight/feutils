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
goog.include('css/base.css');
goog.include('css/dn-list.css');
goog.include('%(app.tpl.href)s');

// mockup
goog.require('%(app)s.mockup');

// init
goog.require('%(app)s.config');

// google app module
goog.require('app.module.ModuleManager');

goog.provide('%(app)s.app.start');

/**
 * %(app)s.app.start
 * @export
 */
%(app)s.app.start = function() {
  // app.Launch用来保证所有的tpl.html加载完了
  app.Launch(function(){
    // model
    var model = {
      'fields' : %(app)s.config.listFields
    }

    // 初始化ui.Page
    app.Init('MAIN_PAGE_%(app)s', baidu.g('Main'), model);

    // 初始化PageableList
    var list = ui.util.get('%(app)s-list');
    list.datasource = new base.RemoteListDataSource(function(params, callback){
      baidu.ajax.get('/%(app)s/list', function(xhr){
        callback(app.json.parse(xhr.responseText));
      });
    });
    list.getData();
  });
  app.module.ModuleManager.getInstance().setLoaded('%(app)s');
};
goog.run(%(app)s.app.start);
















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
