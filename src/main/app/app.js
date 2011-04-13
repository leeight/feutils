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
goog.require('ui.util');

goog.provide('app.Init');
goog.provide('app.Launch');

/**
 * @param {Function} main 主函数.
 */
app.Launch = function(main) {
  var pwm = new base.ParallelWorkerManager();
  if (goog.asyncResource.length > 0) {
    pwm.addWorker(new app.Worker(goog.asyncResource));
  }
  pwm.addDoneListener(main);
  pwm.start();
};

/**
 * @param {string} view 当前页面的View.
 * @param {Element} main page所处的根节点.
 * @param {Object=} opt_model 当前页面的DataModel.
 * @param {boolean=} opt_isPopup 是否是popup状态，默认false.
 */
app.Init = function(view, main, opt_model, opt_isPopup) {
  var model = opt_model || {},
      isPopup = opt_isPopup || false;

  var page = ui.util.createPage(view, main, isPopup);
  page.init();
  page.bindModel(model);
  page.render();
  page.bindEvent();
};

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
