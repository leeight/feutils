/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: material.js 5304 2011-05-07 06:22:03Z liyubei $
 *
 **************************************************************************/



/**
 * material.js ~ 2011/02/16 10:00:08
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5304 $
 * @description
 * material module
 **/

goog.require('dn.util');

goog.provide('material.config');
goog.provide('material.data');

/**
 * @type {Object}
 * @const
 */
material.config = {
  'action' : [
    {
      'location' : '/material/create',
      'action' : 'material.Form'
    },
    {
      'location' : '/material/update',
      'action' : 'material.Form'
    }
  ]
};

/**
 * @type {Object|{read:Function,create:Function,update:Function}}
 * @const
 */
material.data = dn.util.da_generator([
  {
    name: 'read',
    url: '/material/read'
  },

  {
    name: 'create',
    url: '/material/create'
  },

  {
    name: 'update',
    url: '/material/update'
  }
]);

// register a module
er.controller.addModule(material);



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
