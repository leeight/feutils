/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    account/account.js
 * desc:    账户管理模块
 * author:  刘磊
 */


goog.require('dn.util');
goog.require('er.context');
goog.require('er.controller');

goog.provide('account.config');
goog.provide('account.data');

/**
 * @type {Object}
 * @const
 */
account.config = {
    action: [
        {
            location: '/account/list',
            action: 'account.List'
        },
        {
            location: '/account/create',
            action: 'account.Form'
        }
    ],

    url: {
        list: '/account/list',
        create: '/account/create',
        batchDelete: '/account/batch_delete'
    },

    listFields: [
        {
            width: 50,
            title: '账户ID',
            dragable: true,
            field: 'id',
            content: function(item) {
                return item['id'];
            }
        },
        {
            width: 150,
            title: '账户名',
            dragable: true,
            field: 'name',
            content: function(item) {
                return item['name'];
            }
        },
        {
            width: 100,
            title: '角色',
            dragable: true,
            field: 'role_id',
            content: function(item) {
                var rolesMap = er.context.get('rolesMap');
                var index = item['role_id'];
                return rolesMap[index];
            }
        },
        {
            width: 100,
            title: '激活时间',
            dragable: true,
            field: 'active_time',
            content: function(item) {
                return baidu.date.format(dn.util
                        .stringToDate(item['active_time']), 'yyyy-M-d');
            }
        }
    ]
};

/**
 * @type {Object|{list:Function,create:Function,batch_delete:Function}}
 */
account.data = dn.util.da_generator([
    {
        name: 'list',
        url: account.config.url.list
    },
    {
        name: 'create',
        url: account.config.url.create
    },
    {
        name: 'batch_delete',
        url: account.config.url.batchDelete
    }
]);
er.controller.addModule(account);
