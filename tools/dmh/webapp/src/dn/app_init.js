/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: app_init.js 5156 2011-04-27 04:15:29Z liyubei $ 
 * 
 **************************************************************************/
 
 
 
/**
 * src/dn/app_init.js ~ 2011/03/22 12:27:32
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5156 $ 
 * @description 
 * application init module
 **/

// FIXME
goog.require('er.context');
goog.require('er.permission');
goog.require('er.controller');
goog.require('er.locator');
goog.require('Requester');
goog.require('dn.notice');
goog.require('dn.lang');
goog.require('dn.initConst');
goog.require('dn.TemplateWorker');
goog.require('base.ParallelWorkerManager');
goog.require('goog.module.ModuleLoader');
goog.require('goog.module.ModuleManager');

var moduleManager = goog.module.ModuleManager.getInstance();
var moduleLoader = new goog.module.ModuleLoader();

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

function constCallback(data) {
  dn.initConst(data.result);
}

function sessionCallback(data) {
  var visitor = data['result']['visitor'];
  er.context.set('visitor', visitor);
  er.context.set('pageSize', visitor['pageSize']);
  // 初始化用户的权限控制信息
  er.permission.init(visitor['auth']);
}

goog.exportSymbol('lang', dn.lang, dn);

var template = [
  '/src/ui/PagableList.html',
  '/src/community/form.html'
];
var pwm = new base.ParallelWorkerManager();
pwm.addWorker(new dn.TemplateWorker(template));
pwm.addWorker(new base.RequestWorker('/system_const/read', constCallback));
pwm.addWorker(new base.RequestWorker('/account/session', sessionCallback));

pwm.addDoneListener(function() {
  // This tells the module manager that the 'app' module has been loaded.
  // The module manager will not evaluate the code for any of app's
  // dependencies until it knows it has been loaded.
  moduleManager.setLoaded('app');

  moduleManager.execOnLoad('community.form.app', function(){
    er.controller.init();
    er.locator.redirect('/community/create'); 
  });
});
pwm.start();














/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
