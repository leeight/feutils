/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * init.js ~ 2011/04/14 18:12:11
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/

goog.require('app.mockup');

goog.provide('app.init');

// app.Launch用来保证所有的tpl.html加载完了
app.Launch(function(){
  // model
  var model = {
    'fields' : app.config.listFields
  }

  // 初始化ui.Page
  app.Init('MAIN_PAGE', baidu.g('Main'), model);

  // 打桩
  app.mockup();

  // 初始化PageableList
  var list = ui.util.get('list');
  list.datasource = new base.RemoteListDataSource(function(params, callback){
    baidu.ajax.get('/community/list', function(xhr){
      callback(goog.json.parse(xhr.responseText));
    });
  });
  list.getData();
});



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
