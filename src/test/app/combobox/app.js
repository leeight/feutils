/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * ../test/app/combobox/app.js ~ 2011/04/11 23:34:12
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/


goog.require('baidu');
goog.require('ui.util');
goog.require('ui.Page');
goog.require('ui.ComboBox');

baidu.on(window, 'load', function(){
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

  var page = GetPage({
    value : 'baidu',
    datasource : [
      { text : 'google', value : 'google' },
      { text : 'baidu', value : 'baidu' }
    ]
  });
  // var btn = /** @type {ui.Button} */ (page.getChild("button"));
  // alert(btn.getLabel());
});





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
