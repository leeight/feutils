/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: app.js 5280 2011-05-06 06:54:36Z liyubei $ 
 * 
 **************************************************************************/
 
 
 
/**
 * ../test/app/combobox/app.js ~ 2011/04/11 23:34:12
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5280 $ 
 * @description 
 *  
 **/


goog.require('app.Launch');
goog.require('ui.util');
goog.require('ui.Page');
goog.require('ui.ListView');

window.onload = function(){
  // hook
  ui.Page.prototype.instChildrenFromTpl = function() {
    // this.main的已经有内容了，不需要改变什么了
    // 此时已经没有 er.template.get 的事情了
    ui.util.buildControlTree(this.main, this);
  }

  /**
  * @return {ui.Page}
  */
  function GetPage(model) {
    var main = document.getElementById('Main'),
        page = ui.util.createPage('MAIN_PAGE', main, false);

    page.init();
    page.bindModel(model);
    page.render();
    page.bindEvent();

    return page;
  }

  function main() {
    var page = GetPage({
      datasource : [
        { 'name' : 'google' },
        { 'name' : 'baidu' },
        { 'name' : 'sina' }
      ],
      fields : [
        {
          'title' : '生活圈名称',
          'field' : 'name',
          'content' : function(item) {
            return item['name']
          }
        }
      ]
    });
  }
  app.Launch(main);
};





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
