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

goog.require('base.ParallelWorkerManager');
goog.require('app.Worker');

goog.provide('app.Launch');

/**
 * @param {Function} main 主函数
 */
app.Launch = function(main) {
  var pwm = new base.ParallelWorkerManager();
  if (goog.asyncResource.length > 0) {
    pwm.addWorker(new app.Worker(goog.asyncResource));
  }
  pwm.addDoneListener(main);
  pwm.start();
}

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
