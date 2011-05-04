/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * app/app.js ~ 2011/04/12 23:22:59
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 *
 **/

goog.require('app.Worker');
goog.require('base.ParallelWorkerManager');
goog.require('er.template');
goog.require('ui.Page');
goog.require('ui.util');

goog.provide('app.Init');
goog.provide('app.InitFromElement');
goog.provide('app.Launch');

/**
 * @param {Function} main 主函数.
 */
app.Launch = function(main) {
  var pwm = new base.ParallelWorkerManager();
  if (goog.asyncResource.length > 0) {
    pwm.addWorker(new app.Worker(goog.asyncResource));
  }
  pwm.addDoneListener(function() {
    goog.asyncResource = [];
    main();
  });
  pwm.start();
};

/**
 * @param {string} view 当前页面的View.
 * @param {Element} main page所处的根节点.
 * @param {Object=} opt_model 当前页面的DataModel.
 * @param {boolean=} opt_isPopup 是否是popup状态，默认false.
 *
 * @return {ui.Page} 创建好的Page控件.
 */
app.Init = function(view, main, opt_model, opt_isPopup) {
  var model = opt_model || {},
      isPopup = opt_isPopup || false;

  var page = ui.util.createPage(view, main, isPopup);
  page.init();
  page.bindModel(model);
  page.render();
  page.bindEvent();

  return page;
};

/**
 * @param {Element} main page所处的根节点.
 * @param {Object=} opt_model 当前页面的DataModel.
 * @param {boolean=} opt_isPopup 是否是popup状态，默认false.
 *
 * @return {ui.Page} 创建好的Page控件.
 */
app.InitFromElement = function(main, opt_model, opt_isPopup) {
  var view = 'MAIN_PAGE_' + new Date().getTime();
  var source = '<!--target:' + view + '-->\n' + main.innerHTML;
  er.template.parse(source);

  return app.Init(view, main, opt_model, opt_isPopup);
};

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
