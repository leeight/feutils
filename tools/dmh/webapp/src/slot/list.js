/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    slot/list.js
 * desc:    广告位列表基类
 * author:  yuanhongliang
 * date:    $Date: 2011-05-07 13:14:27 +0800 (周六, 07 五月 2011) $
 */
goog.require('community.data');
goog.require('er.ListAction');
goog.require('er.context');
goog.require('slot.config');
goog.require('slot.data');
goog.require('ui.Button');
goog.require('ui.ComboBox');
goog.require('ui.Form');
goog.require('ui.Link');
goog.require('ui.PagableList');

goog.require('ui.Panel');
goog.require('ui.SubmitButton');
goog.require('ui.TextInput');

goog.include('slot/list.html');

goog.provide('slot.List');

/**
 * 广告位列表基类
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
slot.List = function() {
    er.ListAction.call(this);
};
slot.List.prototype = {
    view: 'slotList',

    CONTEXT_INITER_LIST: [
        'initLink',
        'initFields',
        'initTypes',
        'initStatus',
        'initSlotSubType',
        'initCommunities'
    ],

    initFields: function(query, callback) {
        this.model.fields = slot.config.listFields;
        callback();
    },

    initCommunities: function(query, callback) {
        var me = this;
        me.model.communities = [{text: '全部', value: ''}];
        community.data.list(
            'status=' + er.context.get('communityStatusMap').getKey('正常'),
            function(data) {
                var communities = data.page.result;
                for (var i = 0; i < communities.length; i++) {
                    me.model.communities.push({
                        text: communities[i].name,
                        value: communities[i].id
                    });
                }
                callback();
            });
    },

    afterInit: function(page) {
        this.formSearch = page.c('formSearch');
        this.pnlBatch = page.c('pnlOperation');
        this.list = page.c('list');
        this.requesterList = slot.data.list;
        this.requesterBatch = slot.data.batchUpdate;
    },

    initBehavior: function(page) {
        slot.List.superClass.initBehavior.call(this, page);

        var pnl = page.c('pnlOperation'),
            slotStatusMap = er.context.get('slotStatusMap');
        pnl.c('btnArchive').onclick =
            baidu.fn.bind(this.setStatus, this, slotStatusMap.getKey('已存档'));
        pnl.c('btnStop').onclick =
            baidu.fn.bind(this.setStatus, this, slotStatusMap.getKey('已停止'));
        pnl.c('btnResume').onclick =
            baidu.fn.bind(this.setStatus, this, -1); // 恢复用状态-1，由后端确定恢复后的状态
    },

    /**
     * 批量设置状态
     * @param {number} status 状态值.
     * @this {slot.List}
     */
    setStatus: function(status) {
        this.batchUpdate('status', status);
    }
};
baidu.inherits(slot.List, er.ListAction);
