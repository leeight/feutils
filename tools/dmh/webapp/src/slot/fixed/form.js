/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    slot/fixed/form.js
 * desc:    固定广告位表单
 * author:  yuanhongliang
 * date:    $Date: 2011-06-28 14:18:00 +0800 (周二, 28 六月 2011) $
 */
goog.require('er.context');
goog.require('slot.Form');

goog.provide('slot.fixed.Form');

/**
 * 固定广告位表单类
 * @constructor
 * @extends {slot.Form}
 * @export
 */
slot.fixed.Form = function() {
    slot.Form.call(this);

    this.model.slot_sub_type = er.context.get('slotSubTypeMap').getKey('通栏广告位');
};
slot.fixed.Form.prototype = {

    BACK_LOCATION: '/slot/fixed/list',

    initTitle: function() {
        this.model.title = this.isModify() ? '修改固定广告位' : '创建固定广告位';
    },

    initSlotSubType: function() {
        this.model.slotSubTypes = [];
        var slotSubTypeList = er.context.get('slotSubTypeList');
        for (var i = 0; i < slotSubTypeList.length; i++) {
            if (slotSubTypeList[i].text === '通栏广告位' ||
                slotSubTypeList[i].text === '画中画广告位') {
                this.model.slotSubTypes.push(slotSubTypeList[i]);
            }
        }
    },

    initRelation: function() {
        this.model.relation = {
            '通栏广告位': ['通栏'],
            '画中画广告位': ['画中画']
        };

        this.model.priceList = ['通栏', '画中画'];
        this.model.frequenceList = ['通栏', '画中画'];
    },

    getExtraParam: function() {
        var others = slot.fixed.Form.superClass.getExtraParam.call(this);
        return others + (this.isModify() ? '' : '&slot_type=1');
    }
};
baidu.inherits(slot.fixed.Form, slot.Form);
