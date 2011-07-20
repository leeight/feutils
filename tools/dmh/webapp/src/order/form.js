/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    order/form.js
 * desc:    广告位表单基类
 * author:  yuanhongliang
 * date:    $Date: 2011-02-26 12:04:36 +0800 (Sat, 26 Feb 2011) $
 */

goog.require('base.BaseModel');
goog.require('dn.util');
goog.require('er.FormAction');

goog.require('order.data');
goog.require('ui.Button');
goog.require('ui.Form');
goog.require('ui.Hidden');
goog.require('ui.Label');
goog.require('ui.Link');
goog.require('ui.Panel');
goog.require('ui.SubmitButton');

goog.require('ui.TextInput');
goog.include('order/detail.html');

goog.provide('order.Form');

/**
 * 订单行表单
 * @constructor
 * @extends {er.FormAction}
 * @export
 */
order.Form = function() {
    er.FormAction.call(this);

    this.model = new base.BaseModel();
};
order.Form.prototype = {
    view: 'orderDetail',

    BACK_LOCATION: '/order/list',

    initModel: function(query, callback) {
        var me = this;

        order.data.read('id=' + me.model.id, function(data) {
            me.attchToModel(data.result);
            callback();
        });
    },

    attchToModel: function(order) {
        var me = this;
        baidu.object.each(order, function(value, key) {
            me.model[key] = value;
        });
        if (me.model.import_time) {
            me.model.import_time =
                baidu.date.format(dn.util.parseToDate(me.model.import_time),
                    'yyyy-MM-dd HH:mm');
        }
        if (me.model.effect_time) {
            me.model.effect_time =
                baidu.date.format(dn.util.parseToDate(me.model.effect_time),
                    'yyyy-MM-dd');
        }
        if (me.model.expire_time) {
            me.model.expire_time =
                me.model.expire_time.indexOf('9999') === 0 ? '长期生效' :
                baidu.date.format(dn.util.parseToDate(me.model.expire_time),
                    'yyyy-MM-dd');
        }
        if (me.model.money) {
            me.model.money = '¥ ' + parseFloat(me.model.money).toFixed(2);
        }
    },

    afterInit: function(page) {
        this.form = page.c('form');
        this.btnSubmit = page.c('form').c('btnSubmit');
        this.btnCancel = page.c('btnBack');
        this.requester = order.data.update;
    },

    initBehavior: function(page) {
        order.Form.superClass.initBehavior.call(this, page);

        page.c('pnlName').c('btnModify').onclick =
            baidu.fn.bind(this.switchToModify, this);
        page.c('form').c('btnCancel').onclick =
            baidu.fn.bind(this.switchToNormal, this);
    },

    onSubmitSucceed: function() {
        this.model.name = this.page.c('form').c('txtName').getValue();
        this.page.c('pnlName').c('lblName').rebindModel(this.model);
        this.switchToNormal();
        // XXX: 返回false不跳转到列表页
        return false;
    },

    switchToModify: function() {
        this.page.c('pnlName').hide();
        this.page.c('form').show();
    },

    switchToNormal: function() {
        this.page.c('pnlName').show();
        this.page.c('form').hide();
    }
};
baidu.inherits(order.Form, er.FormAction);
