/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: controller.js 5280 2011-05-06 06:54:36Z liyubei $
 *
 **************************************************************************/



/**
 * controller.js ~ 2011/03/24 23:37:46
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5280 $
 * @description
 * er.controller
 **/

goog.require('er.base');
goog.require('er.config');
goog.require('er.locator');

goog.provide('er.controller');


/**
 * @constructor
 * 控制器负责将对应的path转向给相应的action对象处理.
 */
er.Controller = function() {
  /**
   * Action的配置信息(path -> action)
   * @type {Object.<string, er.Controller.ActionConfigType>}
   * @private
   */
  this.container = {};

  /**
   * Action的配置信息(name -> action)
   * @type {Object.<string, er.Controller.ActionConfigType>}
   * @private
   */
  this.actionConfigMap = {};

  /**
   * FIXME
   * 如何定义一个Module呢？
   * @private
   */
  this.modules = [];

  /**
   * @private
   * @type {?er.Action}
   */
  this.currentAction = null;

  /**
   * 权限验证的函数
   * @type {?function(string):boolean}
   */
  this.permit = null;
};

/**
 * @typedef {{action:string,location:string,
 *            authority:string,noAuthLocation:string}}
 */
er.Controller.ActionConfigType;

/**
 * 跳转视图
 *
 * @param {string} path 路径.
 * @param {Object} paramMap 查询条件.
 * @param {string} referer 定位器.
 */
er.Controller.prototype.forward = function(path, paramMap, referer) {
  // 组合所需的argument对象
  var argMap = {
    type: 'main',
    referer: referer,
    paramMap: paramMap,
    path: path,
    domId: er.config.MAIN_ELEMENT_ID
  };

  this.reset();

  // 进入action
  this.currentAction = this.enterAction(this.container[path], argMap);
};

/**
 * 进入action
 *
 * @private
 * @param {er.Controller.ActionConfigType} actionConfig action配置对象.
 * @param {Object} argMap arg表.
 * @return {?er.Action} 需要进入的对象实例.
 */
er.Controller.prototype.enterAction = function(actionConfig, argMap) {
  if (!actionConfig) {
    return null;
  }

  var action = this.findAction(actionConfig),
      newAction = null,
      authority = actionConfig.authority;

  // 如果action不是单例，new一个实例
  if (er.base.isFunction(action)) {
    action = new action();
  }

  if (this.permit) {
    if (authority && !this.permit(authority)) {
      er.locator.redirect(actionConfig.noAuthLocation || '/');
      return null;
    }
  }

  newAction = action.enter(argMap);

  if (newAction) {
    // XXX 为什么这么做呢？请看src/material/form.js
    return newAction;
  }

  return action;
};


/**
 * 重置会话。卸载控件并清除显示区域内容
 * FIXME action中的controlMap对用户来说应该是不可见的，应该和
 * ui.manager结合起来，提供一个接口来创建ui.widget，然后reset的
 * 时候来保证通过调用那个接口创建的widget都会被dispose掉
 * @private
 */
er.Controller.prototype.reset = function() {
  if (this.currentAction) {
    this.currentAction.leave();
  }

  // 清空内容区域
  er.base.g(er.config.MAIN_ELEMENT_ID).innerHTML = '';
};


/**
 * 添加模块
 * @param {Object} module 注册的模块.
 */
er.Controller.prototype.addModule = function(module) {
  this.modules.push(module);
};

/**
 * 初始化控制器
 */
er.Controller.prototype.init = function() {
  var i = 0,
      len = this.modules.length,
      j, len2,
      loc,
      module, actions, actionConfig, actionName;

  for (; i < len; i++) {
    module = this.modules[i];

    // 初始化module
    if (module.init) {
      module.init();
    }

    // 注册action
    actions = module.config.action;
    if (actions) {
      for (j = 0, len2 = actions.length; j < len2; j++) {
        actionConfig = actions[j];
        loc = actionConfig.location;
        actionName = actionConfig.action;

        this.container[loc] = actionConfig;
        this.actionConfigMap[actionName] = actionConfig;
      }
    }
  }

  er.locator.init();
};

/**
 * 查找获取Action对象
 *
 * @private
 * @param {er.Controller.ActionConfigType} actionConfig action配置对象或action的对象路径.
 * @return {?er.Action} null没找到,否则返回Action的实例.
 */
er.Controller.prototype.findAction = function(actionConfig) {
  var propPath = actionConfig.action;
  return er.base.getObjectByName(propPath);
};


/**
 * 加载一个action
 *
 * @param {string} domId 容器dom元素id.
 * @param {string} actionName 要载入的action名称.
 * @param {Object=} opt_argMap 一些可选的arg参数，默认情况下通过
 * loadPopup载入的view都是create的状态，而有时候需要modify的状态
 * 此时就需要opt_argMap来发挥作用了，因为很多时候判断是不是处于
 * modify的状态是根据argMap的path来判断的.
 * @return {?er.Action} 对应的Action实例.
 */
er.Controller.prototype.loadAction = function(domId, actionName, opt_argMap) {
  var actionConfig = this.actionConfigMap[actionName],
      argMap = {
        type: 'popup',
        domId: domId
      };

  if (opt_argMap) {
    er.base.extend(argMap, opt_argMap);
  }

  return this.enterAction(actionConfig, argMap);
};

/**
 * instance
 * @type {er.Controller}
 */
er.controller = new er.Controller();





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
