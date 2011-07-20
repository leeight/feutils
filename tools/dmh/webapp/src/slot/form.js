/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    slot/form.js
 * desc:    广告位表单基类
 * author:  yuanhongliang
 * date:    $Date: 2011-06-28 14:18:00 +0800 (周二, 28 六月 2011) $
 */
goog.require('base.BaseModel');
goog.require('base.FuncWorker');
goog.require('base.ParallelWorkerManager');
goog.require('community.data');
goog.require('dn.lang');
goog.require('dn.util');
goog.require('er.FormAction');

goog.require('er.context');
goog.require('slot.config');
goog.require('slot.data');
goog.require('ui.Button');
goog.require('ui.CheckBox');
goog.require('ui.CheckBoxGroup');
goog.require('ui.Form');
goog.require('ui.Label');
goog.require('ui.ListView');
goog.require('ui.Orientation');
goog.require('ui.Panel');
goog.require('ui.RadioBoxGroup');

goog.require('ui.SimpleSelector');
goog.require('ui.SubmitButton');
goog.require('ui.TextInput');

goog.include('slot/form.html');

goog.provide('slot.Form');

/**
 * 广告位表单基类
 * @constructor
 * @extends {er.FormAction}
 * @export
 */
slot.Form = function() {
    er.FormAction.call(this);

    this.model = new base.BaseModel({
        slot_sub_type: null,
        type: null,
        communities: [],
        frequencyChecked: false,
        purchase_price: 0,
        sale_price: 0,
        videoPurchaseCpmPrice: 0,
        videoPurchaseCpvPrice: 0,
        floatPurchasePrice: 0,
        videoSaleCpmPrice: 0,
        videoSaleCpvPrice: 0,
        floatSalePrice: 0
    });
};
slot.Form.prototype = {
    view: 'slotEdit',

    initCommunityFields: function() {
        this.model.communityFields = [
            {
                title: '生活圈名称',
                field: 'name',
                content: function(item) {
                    return item.name;
                }
            }
        ];
    },

    initModel: function(query, callback) {
        var me = this, pwm;
        this.model.priceList = [];
        this.model.frequenceList = [];
        me.initTitle();
        me.initSlotSubType();
        me.initRelation();
        me.initCommunityFields();

        me.model.frequenceTypes = [];
        baidu.each(this.model.frequenceList, function(frequencyText) {
            me.model.frequenceTypes.push({
                text: frequencyText,
                value: er.context.get('productTypeMap').getKey(frequencyText)
            });
        });
        
        me.model.priceTypes = [];
        baidu.each(this.model.priceList, function(priceText) {
            me.model.priceTypes.push({
                text: priceText,
                value: er.context.get('productPriceTypeMap').getKey(priceText)
            });
        });

        me.model['repeater.ds'] = /** @type {Array} */ (me.model.frequenceTypes);
        me.model['repeater.tpl'] = er.template.get('frequencyTpl');
        me.model['priceRepeater.ds'] = /** @type {Array} */ (me.model.priceTypes);
        me.model['priceRepeater.tpl'] = er.template.get('priceTpl');

        pwm = new base.ParallelWorkerManager();
        pwm.addWorker(new base.FuncWorker(community.data.list,
            'status=' + er.context.get('communityStatusMap').getKey('正常'),
            function(data) {
                me.model.allCommunities = data.page.result;
            }));
        if (me.isModify() && me.model.id) {
            pwm.addWorker(new base.FuncWorker(slot.data.read,
                    'id=' + me.model.id,
                    function(data) {
                        me.attchToModel(data.result);
                    }
            ));
        }
        pwm.addDoneListener(callback);
        pwm.start();
    },

    attchToModel: function(slot) {
        var me = this;
        baidu.object.each(slot, function(value, key) {
            me.model[key] = value;
        });

        if (me.model.max_impression_freq_uu_hour 
                && me.model.max_impression_freq_uu_count) {
            me.model.frequencyChecked = true;
        }

        if (baidu.lang.isArray(me.model['max_impression_freq_uu_hour'])) {
            baidu.object.each(slot['max_impression_freq_uu_hour'], function(value, key) {
                me.model['max_impression_freq_uu_hour[' + key + ']'] = value;
            });
            
            baidu.object.each(slot['max_impression_freq_uu_count'], function(value, key) {
                me.model['max_impression_freq_uu_count[' + key + ']'] = value;
            });
            me.model['max_impression_freq_uu_hour'] = null;
            me.model['max_impression_freq_uu_count'] = null;
        }
        
        if (baidu.lang.isArray(me.model['purchase_price'])) {
            baidu.object.each(slot['purchase_price'], function(value, key) {
                me.model['purchase_price[' + key + ']'] = value;
            });
            
            baidu.object.each(slot['sale_price'], function(value, key) {
                me.model['sale_price[' + key + ']'] = value;
            });
            me.model['purchase_price'] = null;
            me.model['sale_price'] = null;
        }
        

        if (slot.adowner_blacklist) {
            me.model.adOwnerUsernames = {
                keywords:
                    dn.util.extractField(slot.adowner_blacklist, 'username')
            };
        }
        if (slot.communities) {
            me.model.communityIds =
                dn.util.extractField(slot.communities, 'id');
        }
    },

    afterInit: function(page) {
        this.form = page.c('form');
        this.btnSubmit = page.c('form').c('btnSubmit');
        this.btnCancel = page.c('form').c('btnCancel');
        this.requester = this.isModify() ? slot.data.update : slot.data.create;
    },

    enterDocument: function(page) {
        this.form.c('selCommunity').hide();

        if (this.isModify()) {
            baidu.hide('wrapperColumbusSlotId');
            ui.util.disableFormByContainer(
                    baidu.g('wrapperColumbusSlotId'), true);

            this.form.c('rbgSlotSubType').disable();
            this.form.c('rbgSlotSubType').hide();
            baidu.g('wrapperSlotSubType').innerHTML =
                er.context.get('slotSubTypeMap')[this.model.slot_sub_type];

            baidu.show('wrapperStatus');
            baidu.g('wrapperStatusText').innerHTML = dn.util.getStatusHtml(
                    er.context.get('slotStatusMap')[this.model.status],
                    slot.config.statusClassMap);
        }
    },

    initBehavior: function(page) {
        slot.Form.superClass.initBehavior.call(this, page);

        this.form.c('rbgSlotSubType').onselect =
            baidu.fn.bind(this.onSlotSubTypeSelect, this);

        this.form.c('cbgType').onselect =
            baidu.fn.bind(this.onTypeSelect, this);

        this.form.c('pnlAddCommunity').c('btnCommunity').onclick =
            baidu.fn.bind(this.toggleCommunitySelector, this);
        this.form.c('lvCommunity').onmodify =
            baidu.fn.bind(this.showCommunitySelector, this);
        this.form.c('selCommunity').onselect =
            baidu.fn.bind(this.onCommunitySelect, this);
        this.form.c('selCommunity').oncancel =
            baidu.fn.bind(this.onCommunityCancel, this);

        this.form.c('chkFrequency').onclick =
            baidu.fn.bind(this.toggleFrequency, this);

        this.model.triggerPropertyChanged('slot_sub_type');
        this.model.triggerPropertyChanged('frequencyChecked');

        //对于chkFrequency已被check的情况，其内部已自动trigger type
        if (!this.form.c('chkFrequency').getChecked()) {
            this.model.triggerPropertyChanged('type');
        }
        this.model.triggerPropertyChanged('communities');
    },

    onModelChanged: function(propertyName, newValue, oldValue) {
        if (propertyName === 'slot_sub_type') {
            var me = this,
                slotSubType = newValue,
                slotSubTypeText = er.context.get('slotSubTypeMap')[slotSubType],
                productTypeTexts = me.model.relation[slotSubTypeText];
            me.model.types = [];
            baidu.each(productTypeTexts, function(productTypeText) {
                me.model.types.push({
                    text: productTypeText,
                    value: er.context.get('productTypeMap').getKey(productTypeText)
                });
            });
            me.form.c('cbgType').rebindModel(me.model);
        }
        if (propertyName === 'type') {
            var me = this,
                type = newValue,
                isMultiType = type && type.indexOf(',') > 0;
            var showLayers = [], 
                hideLayers = [];
            var isfreqCheck = me.form.c('chkFrequency').getChecked();
            
            // 只有当frequency被check时才会对此层操作
            if (isfreqCheck) {
                baidu.each(me.model.frequenceTypes, function(frequenceType) {
                    hideLayers.push('frequence['+ frequenceType.value +']');
                });
            }
            baidu.each(me.model.priceTypes, function(priceType) {
                hideLayers.push('wrapperPrice['+ priceType.value +']');
            });
            baidu.each(hideLayers, function(hideLayer) {
                baidu.hide(hideLayer);
                ui.util.disableFormByContainer(baidu.g(hideLayer), true);
            });
            
            var types = [];
            if (isMultiType) {
               types = type.split(',');
            } else {
               if (type) {
                 types[0] = type;
               }
            }
            baidu.each(types, function(single) {
                if (single == '0') {
                    showLayers.push('wrapperPrice[0]');
                    showLayers.push('wrapperPrice[1]');
                } else {
                    var reIndex = parseInt(single) + 1; 
                    showLayers.push('wrapperPrice[' + reIndex + ']');
                }
                if (isfreqCheck) {
                    showLayers.push('frequence[' + single + ']');
                }
            });
            //批量展现
            baidu.each(showLayers, function(showLayer) {
                baidu.show(showLayer);
                ui.util.disableFormByContainer(baidu.g(showLayer), false);
            });
        }
        if (propertyName === 'communities') {
            var communities = newValue;
            if (communities && communities.length > 0) {
                this.form.c('pnlAddCommunity').hide();
                this.form.c('lvCommunity').show();
                this.form.c('lvCommunity').rebindModel(this.model);
            } else {
                this.form.c('pnlAddCommunity').show();
                this.form.c('lvCommunity').hide();
            }
        }
        if (propertyName === 'frequencyChecked') {
            var checked = newValue;
            this.form.c('chkFrequency').setChecked(checked);
            if (checked) {
                baidu.show('wrapperFrequency');
                this.model.triggerPropertyChanged('type');
            } else {
                baidu.hide('wrapperFrequency');
                ui.util.disableFormByContainer(
                    baidu.g('wrapperFrequency'), true);
            }

        }
    },

    onSlotSubTypeSelect: function(slotSubType) {
        // 因为defaultFirst的选择导致model中的type有脏数据
        this.model.set('type', null);
        this.model.set('slot_sub_type', slotSubType);
    },

    onTypeSelect: function(type) {
        this.model.set('type', this.form.c('cbgType').getValue());
    },

    toggleCommunitySelector: function() {
        this.form.c('selCommunity').toggle();
    },

    showCommunitySelector: function() {
        this.form.c('lvCommunity').hide();
        this.form.c('selCommunity').show();
    },

    onCommunitySelect: function(selectedItems) {
        this.model.set('communities', selectedItems);
        // FIXME 连续点击两次"OK"按钮，导致不会触发change的事件
        this.model.triggerPropertyChanged('communities');
    },

    onCommunityCancel: function() {
        // 一个线上隐藏很久的BUG是因为把"communities"错误的写成了"ommunities"
        var communities = this.model.get('communities');
        if (communities && communities.length) {
            this.form.c('lvCommunity').show();
        } else {
            this.form.c('pnlAddCommunity').show();
        }
    },

    toggleFrequency: function() {
        this.model.set('frequencyChecked',
                this.form.c('chkFrequency').getChecked());
    },

    getExtraParam: function() {
        var params = [],
            owners = this.form.c('orientAdOwners').getValue().keywords || [];
        if (this.isModify()) {
            params.push('id=' + this.model.id);
        }
        baidu.each(owners, function(value, i) {
            owners[i] = encodeURIComponent(value);
        });
        params.push('adowner_blacklist_usernames=' + owners.join(','));
        return params.join('&');
    },

    onSubmitFail: function(data) {
        slot.Form.superClass.onSubmitFail.call(this, data);
        if (data.message.field.adowner_blacklist_usernames) {
            Validator.showError(this.form.c('orientAdOwners').main,
                data.message.field.adowner_blacklist_usernames);
        } else {
            Validator.hideError(this.form.c('orientAdOwners').main);
        }
    }

};
baidu.inherits(slot.Form, er.FormAction);
