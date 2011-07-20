/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: permission.js 5156 2011-04-27 04:15:29Z liyubei $
 *
 **************************************************************************/



/**
 * permission.js ~ 2011/03/25 00:25:55
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5156 $
 * @description
 * er.permission
 **/

goog.provide('er.permission');


/**
 * @constructor
 * 权限控制器
 */
er.Permission = function() {
  this.permissible = {};
};

/**
 * 初始化权限控制器
 * @param {Object} data 权限初始化数据.
 */
er.Permission.prototype.init = function(data) {
  var key, item;
  for (key in data) {
    item = data[key];
    if ('object' == typeof item) {
      this.init(item);
    } else if (item) {
      this.permissible[key] = item;
    }
  }
};

/**
 * 判断是否拥有权限
 *
 * @param {string} name 权限名.
 * @return {boolean} true有权限，false没有权限.
 */
er.Permission.prototype.isAllow = function(name) {
  return !!this.permissible[name];
};

/**
 * instance
 * @type {er.Permission}
 */
er.permission = new er.Permission();

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
