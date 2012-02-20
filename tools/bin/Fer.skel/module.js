/***************************************************************************
 *
 * Copyright (c) %(app.create.year)s Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * src/%(app.package.path)s/module.js ~ %(app.create.time)s
 * @author %(app.user.email)s (%(app.user.name)s)
 * @version $Revision$
 * @description
 * %(app.module)s这个模块
 **/

goog.require('er.controller');
goog.require('jn.util');

goog.provide('%(app.module)s.Fields');
goog.provide('%(app.module)s.config');
goog.provide('%(app.module)s.data');

/**
 * @const
 * @type {Object.<string, *>}
 */
%(app.module)s.Fields = {
    // CODE HERE.
};

/**
 * @type {Object}
 * @const
 */
%(app.module)s.config = {
    'action' : [
        // CODE HERE.
    ],

    'url' : {
        // CODE HERE.
    }
};

/**
 * 后端数据访问接口
 * @type {Object.<string, function(string, Function, Function)>}.
 */
%(app.module)s.data = jn.util.da_generator([
    // CODE HERE
]);

er.controller.addModule(%(app.module)s);





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
