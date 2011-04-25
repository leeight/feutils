/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * app/module.js ~ 2011/04/23 22:32:00
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * TODO 功能太弱...
 **/

goog.require('baidu');

goog.provide('app.module.ModuleLoader');
goog.provide('app.module.ModuleManager');

/**
 * @constructor
 */
app.module.ModuleManager = function() {
  this._modules = {};
  this._loader = null;
  this._moduleInfo = null;
  this._moduleUris = null;
};
baidu.addSingletonGetter(app.module.ModuleManager);

/**
 * @param {string} moduleName 模块的名字.
 */
app.module.ModuleManager.prototype.setLoaded = function(moduleName) {
  this._modules[moduleName] = true;
};

/**
 * @param {app.module.ModuleLoader} loader 模块的加载器.
 */
app.module.ModuleManager.prototype.setLoader = function(loader) {
  this._loader = loader;
};

/**
 * @param {Object} moduleInfo 模块的依赖信息.
 */
app.module.ModuleManager.prototype.setAllModuleInfo = function(moduleInfo) {
  this._moduleInfo = moduleInfo;
};

/**
 * @param {Object} moduleUris 模块的路径.
 */
app.module.ModuleManager.prototype.setModuleUris = function(moduleUris) {
  this._moduleUris = moduleUris;
};

/**
 * @param {string} moduleName 模块的名字.
 * @param {Function} callback 回调函数.
 */
app.module.ModuleManager.prototype.execOnLoad = function(moduleName, callback) {
  if (this._modules[moduleName] === true) {
    callback();
  } else {
    var moduleUrl = this._moduleUris[moduleName];
    if (moduleUrl) {
      this._loader.load(moduleUrl, callback);
    }
  }
};

// PLOVR_MODULE_INFO={"baidu":["app"],"app":[],"google":["app"]};
// PLOVR_MODULE_URIS={"baidu":"../output/module/module_baidu.js","app":"../output/module/module_app.js","google":"../output/module/module_google.js"};
// moduleManager.setLoader(moduleLoader);
// moduleManager.setAllModuleInfo(goog.global['PLOVR_MODULE_INFO']);
// moduleManager.setModuleUris(goog.global['PLOVR_MODULE_URIS']);


/**
 * @constructor
 */
app.module.ModuleLoader = function() {
  this._loadedUrl = {};
};

/**
 * @param {boolean} mode ....
 */
app.module.ModuleLoader.prototype.setDebugMode = function(mode) {
  // IGNORE
};

/**
 * @param {string} moduleUrl 模块的url地址.
 * @param {Function} callback 加载完毕之后的回调函数.
 */
app.module.ModuleLoader.prototype.load = function(moduleUrl, callback) {
  if (this._loadedUrl[moduleUrl] === true) {
    callback();
  } else {
    var scriptParent = document.getElementsByTagName('head')[0] ||
                       document.documentElement;

    var script = document.createElement('SCRIPT');
    script.type = 'text/javascript';
    script.src = moduleUrl;

    var me = this;
    if (baidu.ie) {
      script.onreadystatechange = function() {
        if (!this.readyState || this.readyState == 'loaded' ||
            this.readyState == 'complete') {
          // Guard against redundant state changes.
          script.onreadystatechange = baidu.emptyMethod;
          me._loadedUrl[moduleUrl] = true;
          callback();
        }
      };
    } else {
      script.onload = function() {
        me._loadedUrl[moduleUrl] = true;
        callback();
      };
    }

    scriptParent.appendChild(script);
  }
};



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
