/***************************************************************************
 *
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * src/a/this_is_a_module/module.js ~ 2012/01/23 09:49:12
 * @author leeight@gmail.com (leeight)
 * @version $Revision$
 * @description
 * a.this_is_a_module这个模块
 **/

goog.require('er.controller');
goog.require('jn.util');

goog.provide('a.this_is_a_module.Fields');
goog.provide('a.this_is_a_module.config');
goog.provide('a.this_is_a_module.data');

/**
 * @const
 * @type {Object.<string, *>}
 */
a.this_is_a_module.Fields = {
    // CODE HERE.
};

/**
 * @type {Object}
 * @const
 */
a.this_is_a_module.config = {
    'action' : [
        // CODE HERE.
        {
            'location' : '/jn/demo/helloworld',
            'action' : 'jn.demo.Helloworld'
        },
        {
            'location' : '/jn/demo/helloui',
            'action' : 'jn.demo.Helloui'
        },
        {
            'location' : '/jn/demo/hellodata',
            'action' : 'jn.demo.Hellodata'
        }
    ],

    'url' : {
        // CODE HERE.
    }
};

/**
 * 后端数据访问接口
 * @type {Object.<string, function(string, Function, Function)>}.
 */
a.this_is_a_module.data = jn.util.da_generator([
    // CODE HERE
]);

er.controller.addModule(a.this_is_a_module);





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
