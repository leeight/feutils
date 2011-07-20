/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    account/form.js
 * desc:    账户管理表单基类
 * author:  刘磊
 * $Date$
 */

goog.require('account.data');
goog.require('er.FormAction');
goog.require('er.context');
goog.require('ui.Button');
goog.require('ui.Form');
goog.require('ui.Label');
goog.require('ui.RadioBoxGroup');

goog.require('ui.SubmitButton');
goog.require('ui.TextInput');

goog.include('account/form.html');

goog.provide('account.Form');

/**
 * @constructor
 * @extends {er.FormAction}
 */
account.Form = function() {
    er.FormAction.call(this);
};
account.Form.prototype = {
    view: 'createRoles',

    initModel: function(argMap, callback) {
        this.model.title = '新建账户';
        this.model.roles = [];
        var rolesList = er.context.get('rolesList');
        for (var i = 0; i < rolesList.length; i++) {
            this.model.roles.push(rolesList[i]);
        }
        callback();
    },

    afterInit: function(page) {
        this.form = page.c('form');
        this.btnSubmit = page.c('form').c('btnSubmit');
        this.btnCancel = page.c('form').c('btnCancel');
        this.requester = this.isModify() ?
                         account.data.update :
                         account.data.create;
    }
};
baidu.inherits(account.Form, er.FormAction);
