/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    account/List.js
 * desc:    账户管理模块
 * author:  刘磊
 */

goog.require('account.config');

goog.require('account.data');
goog.require('dn.lang');
goog.require('er.ListAction');
goog.require('er.context');
goog.require('ui.Button');
goog.require('ui.ComboBox');
goog.require('ui.Form');
goog.require('ui.Link');

goog.require('ui.PagableList');
goog.require('ui.Panel');

goog.require('ui.SubmitButton');
goog.require('ui.TextInput');

goog.include('account/list.html');

goog.provide('account.List');

/**
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
account.List = function() {
    er.ListAction.call(this);
};
account.List.prototype = {
    view: 'accountList',

    initModel: function(argMap, callback) {
        this.model.fields = account.config.listFields;
        this.model.roles = [
            {
                text: '全部',
                value: ''
            }
        ];
        var rolesList = er.context.get('rolesList');
        for (var i = 0; i < rolesList.length; i++) {
            this.model.roles.push(rolesList[i]);
        }
        callback();
    },

    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.pnlBatch = page.c('pnlOperation');
        this.list = page.c('list');
        this.requesterList = account.data.list;
        this.requesterBatch = account.data.batch_delete;
    },
    initBehaviorInternal: function() {
        var me = this,
            deleteButton = me.pnlBatch.getChild('batch-delete-button');

        deleteButton.onclick = function() {
            me.batchUpdate();
        }
    }
};
baidu.inherits(account.List, er.ListAction);
