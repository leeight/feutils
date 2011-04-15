/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * init.js ~ %(app.create.time)s
 * @author %(app.user.email)s (%(app.user.name)s)
 * @version $Revision$ 
 * @description 
 *  
 **/

goog.require('%(app)s.mockup');

goog.provide('%(app)s.init');

// app.Launch用来保证所有的tpl.html加载完了
app.Launch(function(){
  // model
  var model = {
    'fields' : %(app)s.config.listFields
  }

  // 初始化ui.Page
  app.Init('MAIN_PAGE', baidu.g('Main'), model);

  // 打桩
  %(app)s.mockup();

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
