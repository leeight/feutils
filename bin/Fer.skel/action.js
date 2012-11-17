/***************************************************************************
 *
 * Copyright (c) %(app.create.year)s Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * src/%(app.package.path)s/%(app.action_name)s.js ~ %(app.create.time)s
 * @author %(app.user.email)s (%(app.user.name)s)
 * @version $Revision$
 * @description
 * %(app.action_name)s相关的实现逻辑
 **/

goog.require('%(app.super_class)s');
goog.require('%(app.module)s.config');
goog.require('%(app.module)s.data');

goog.include('%(app.package.path)s/module.less');
goog.include('%(app.package.path)s/%(app.action_name)s.less');
goog.include('%(app.package.path)s/%(app.action_name)s.html');

goog.provide('%(app.name)s');

/**
 * @constructor
 * @extends {%(app.super_class)s}
 * @export
 */
%(app.name)s = function() {
    %(app.super_class)s.call(this);

    /**
     * 当前Action的View模板名称.
     * @type {string}
     */
    this.view = 'MAIN_PAGE_%(app.view_name)s';
};
baidu.inherits(%(app.name)s, %(app.super_class)s);

/** @inheritDoc */
%(app.name)s.prototype.initModel = function(argMap, callback) {
    // CODE HERE.

    callback();
};

/** @inheritDoc */
%(app.name)s.prototype.afterInit = function(page) {
    // CODE HERE.
};





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
