/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    slot/dedicated/form.js
 * desc:    包断广告位表单
 * author:  yuanhongliang
 * date:    $Date: 2011-06-28 14:18:00 +0800 (周二, 28 六月 2011) $
 */
goog.require('er.context');
goog.require('slot.Form');

goog.provide('slot.dedicated.Form');

/**
 * 包断广告位表单类
 * @constructor
 * @extends {slot.Form}
 * @export
 */
slot.dedicated.Form = function() {
    slot.Form.call(this);

    this.model.slot_sub_type =
        er.context.get('slotSubTypeMap').getKey('泰山压顶广告位');
};
slot.dedicated.Form.prototype = {
    BACK_LOCATION: '/slot/dedicated/list',

    initTitle: function() {
        this.model.title = this.isModify() ? '修改包断广告位' : '创建包断广告位';
    },

    initSlotSubType: function() {
        this.model.slotSubTypes = [];
        var slotSubTypeList = er.context.get('slotSubTypeList');
        for (var i = 0; i < slotSubTypeList.length; i++) {
            if (slotSubTypeList[i].text !== '通栏广告位' &&
                slotSubTypeList[i].text !== '画中画广告位') {
                this.model.slotSubTypes.push(slotSubTypeList[i]);
            }
        }
    },

    initRelation: function() {
        this.model.relation = {
            '泰山压顶广告位': ['泰山压顶'],
            '路障广告位': ['路障'],
            '右下广告位': ['视频', '浮窗', '浮标视频', '浮标']
        };
        this.model.priceList = ['视频cpv', '视频cpm', '浮窗', '泰山压顶', '路障', '浮标', '浮标视频'];
        this.model.frequenceList = ['视频', '浮窗', '泰山压顶', '路障', '浮标', '浮标视频'];
    },

    getExtraParam: function() {
        var others = slot.dedicated.Form.superClass.getExtraParam.call(this);
        return others + (this.isModify() ? '' : '&slot_type=0');
    }
};
baidu.inherits(slot.dedicated.Form, slot.Form);
