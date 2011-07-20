/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: app.js 5166 2011-04-27 10:01:26Z liyubei $
 *
 **************************************************************************/



/**
 * src/dn/app_init.js ~ 2011/03/22 12:27:32
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5166 $
 * @description
 * application init module
 **/

goog.require('er.controller');
goog.require('er.locator');

goog.require('app.Launch');
goog.require('app.module.ModuleLoader');
goog.require('app.module.ModuleManager');

goog.require('community.config');
goog.require('account.config');

goog.include('css/base.css');
goog.include('css/dn-list.css');
goog.include('css/dn-edit.css');

var moduleManager = app.module.ModuleManager.getInstance();
var moduleLoader = new app.module.ModuleLoader();

// Normally, this would be:
// moduleLoader.setDebugMode(!!goog.global['PLOVR_MODULE_USE_DEBUG_MODE']);
// But because this is still used with local files in "production," debug mode
// should always be used.
moduleLoader.setDebugMode(true);

moduleManager.setLoader(moduleLoader);
moduleManager.setAllModuleInfo(goog.global['PLOVR_MODULE_INFO']);
moduleManager.setModuleUris(goog.global['PLOVR_MODULE_URIS']);


// One problem with this use of exports is that it causes problems in RAW mode.
// These calls to goog.exportSymbol() define an example.api object in the global
// namespace. Therefore, when api.js is loaded in RAW mode, the call to
// goog.provide('example.api') throws an error because the pre-existing
// example.api object results in a "Namespace already declared" error.
//
// This is not a problem in SIMPLE or ADVANCED mode because the Compiler
// sets the value of goog.DEBUG such that goog.provide() no longer checks for
// duplicate namespaces at runtime because it assumes that the Compiler has
// already addressed such issues at compile time.
//
// The easiest way to solve this problem for RAW mode would be to add the
// following two exports in their own namespace, though that would likely be
// awkward for clients of the API. This is effectively what Gmail's Greasemonkey
// API does (http://code.google.com/p/gmail-greasemonkey/wiki/GmailGreasemonkey10API):
// the loading code is in the gmonkey.* namespace while the Gmail API is in the
// gmail.* namespace.

// goog.exportSymbol('example.api.load', function(callback) {
//  moduleManager.execOnLoad('api', callback);
// });

// goog.exportSymbol('example.api.isLoaded', function() {
//  var moduleInfo = moduleManager.getModuleInfo('api');
//  return moduleInfo ? moduleInfo.isLoaded() : false;
// });

er.Controller.prototype.originalEnterAction =
  er.Controller.prototype.enterAction;

/**
 * 重写er.Controller，实现异步加载app的支持
 * 先不考虑对loadAction的支持，应该也不难.
 * @param {{action:string,location:string,authority:string}} actionConfig Action的配置
 * @param {{type:string,referer:string,paramMap:Object,path:string,domId:string}} argMap 参数字典.
 */
er.Controller.prototype.enterAction = function(actionConfig, argMap) {
  // action -> name的映射
  // 我们的约定
  // 1. action的命名规则是{moduleName}.List,{moduleName}.Form
  var action = actionConfig.action,
      dotIndex = action.indexOf('.');
  if (dotIndex != -1) {
    var me = this,
        moduleName = action.substring(0, dotIndex);
    moduleManager.execOnLoad(moduleName, function() {
      me.currentAction = me.originalEnterAction(actionConfig, argMap);
    });
  } else {
    // FIXME
  }
};

app.Launch(function(){
  er.controller.init();
  er.locator.redirect('/community/list');
});
moduleManager.setLoaded('app');












/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
