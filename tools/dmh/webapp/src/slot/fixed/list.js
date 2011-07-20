/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    slot/fixed/list.js
 * desc:    固定广告位列表
 * author:  yuanhongliang
 * date:    $Date: 2011-05-07 13:14:27 +0800 (周六, 07 五月 2011) $
 */
goog.require('er.context');
goog.require('slot.List');

goog.provide('slot.fixed.List');

/**
 * 固定广告位列表类
 * @constructor
 * @extends {slot.List}
 * @export
 */
slot.fixed.List = function() {
    slot.List.call(this);
};
slot.fixed.List.prototype = {
    initLink: function(query, callback) {
        this.model.hrefCreate = '#/slot/fixed/create';
        callback();
    },

    initTypes: function(query, callback) {
        this.model.types = [{text: '全部', value: ''}];
        var productTypeList = er.context.get('productTypeList');
        for (var i = 0; i < productTypeList.length; i++) {
            if (productTypeList[i].text === '通栏' ||
                productTypeList[i].text === '画中画') {
                this.model.types.push(productTypeList[i]);
            }
        }
        callback();
    },

    initSlotSubType: function(query, callback) {
        var me = this;
        me.model.slotSubTypes = [{text: '全部', value: ''}];
        baidu.each(er.context.get('slotSubTypeList'), function(slotSubType) {
            if (slotSubType.text === '通栏广告位' ||
                slotSubType.text === '画中画广告位') {
                me.model.slotSubTypes.push(slotSubType);
            }
        });
        callback();
    },

    initStatus: function(query, callback) {
        this.model.allStatus = [];
        var slotStatusList = er.context.get('slotStatusFilterList');
        for (var i = 0; i < slotStatusList.length; i++) {
            if (slotStatusList[i].text !== '有请求' &&
                slotStatusList[i].text !== '无请求') {
                this.model.allStatus.push(slotStatusList[i]);
            }
        }
        callback();
    },

    getExtraParam: function() {
        return 'slot_type=1';
    }
};
baidu.inherits(slot.fixed.List, slot.List);