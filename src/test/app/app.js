/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * app.js ~ 2011/04/13 00:35:10
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/


goog.require('app.Launch');
goog.require('ui.util');
goog.require('ui.Page');
goog.require('ui.Button');
goog.require('ui.ComboBox');
goog.require('ui.ListView');

window.onload = function() {
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

  function main(){
    var model = {
      'list_datasource' : [
        { 'name' : 'google' },
        { 'name' : 'baidu' },
        { 'name' : 'sina' }
      ],
      'list_fields' : [
        {
          'title' : '生活圈名称',
          'field' : 'name',
          'content' : function(item) {
            return item['name']
          }
        }
      ],
      'combobox_datasource' : [
        { text : 'google', value : 'google' },
        { text : 'baidu', value : 'baidu' }
      ],
      'combobox_value' : 'baidu'
    };
    var page = GetPage(model);

    var btn = /** @type {ui.Button} */ (page.getChild("button"));
    btn.onclick = function() {
      alert(this.getLabel());
    }
  }
  app.Launch(main)
}






















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
