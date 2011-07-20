/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: init.js 5280 2011-05-06 06:54:36Z liyubei $ 
 * 
 **************************************************************************/
 
 
 
/**
 * src/dn/app_init.js ~ 2011/03/22 12:27:32
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5280 $ 
 * @description 
 * application init module
 **/

goog.require('baidu');

goog.require('app.module.ModuleLoader');
goog.require('app.module.ModuleManager');

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

function LoadApplication(name) {
  moduleManager.execOnLoad(name, function(){
    var fn = /** @type {Function} */ (goog.getObjectByName(name + '.app.start'));
    if (fn) {
      fn();
    }
  });
}
  
moduleManager.setLoaded('app');
baidu.on(window, 'load', function(){
  baidu.on('load-baidu-app', 'click', function(){
    LoadApplication('baidu');
  });
  baidu.on('load-google-app', 'click', function(){
    LoadApplication('google');
  });
  baidu.on('load-news-app', 'click', function(){
    LoadApplication('news');
  });
});












/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
