/**
 * 资源预估创建表单
 * @constructor
 * @extends {er.FormAction}
 */
adresource.Form = function() {
    er.FormAction.call(this);
    this.model = new base.BaseModel({});
    this.view = 'adresourceCreate';
};

adresource.Form.prototype = {
    BACK_LOCATION: '/adresource/list',

    initModel: function(query, callback) {
        var me = this, pwm, productParam;

        function createCommunityListWorker(param) {
            return new base.FuncWorker(community.data.list, param ? param : '', function(data) {
                me.model.slot_datasourceMultiSitesLeft = data.page.result;
            });
        }
        function createSlotListWorker(param) {
            return new base.FuncWorker(slot.data.list, param ? param : '', function(data) {
                me.model.slot_datasourceSingleSiteLeft = data.page.result;
                me.model.singleSiteTotalCount = data.page.totalCount;
            });
        }

        me.model.communityslotRequester = community.data.slotlist;
        me.model.slotlistRequester = slot.data.list;
        me.model.types = er.context.get('productTypeList');

        pwm = new base.ParallelWorkerManager();
        pwm.addWorker(createCommunityListWorker('status=0'));

        //产品形式默认为空
        me.model.productType = '';
        //产品形式决定的默认广告位状态设为第一个产品形式的广告位状态
        me.model.datasourceSlotStatus = this.getEffectiveDatasourceStatus();
        pwm.addWorker(createSlotListWorker('status=106&page.pageNo=1&page.pageSize=15&type_join=false'));
        pwm.addDoneListener(callback);
        pwm.start();
    },

    getDatasourceStatusByText: function(productType) {
        var status = [];
        if (productType == '') return status;
        var slotStatusList = er.context.get('slotStatusFilterList');
        if (productType == '通栏' || productType == '画中画') {
            for (var i = 0; i < slotStatusList.length; i++) {
                if (slotStatusList[i].text !== '有请求' &&
                    slotStatusList[i].text !== '无请求' &&
                    slotStatusList[i].text !== '已存档') {

                    status.push(slotStatusList[i]);
                }
            }
        } else {
            for (var i = 0; i < slotStatusList.length; i++) {
                if (slotStatusList[i].text !== '有效' &&
                    slotStatusList[i].text !== '已存档') {
                    status.push(slotStatusList[i]);
                }
            }
        }
        return status;
    },

    getDatasourceStatusByValue: function(type) {
        var productTypeList = /** @type {Array} */ (er.context.get('productTypeList'));
        var productType = baidu.array.find(productTypeList, function(item, i) {
            return item.value == type;
        });
        return this.getDatasourceStatusByText(productType.text);
    },

    getEffectiveDatasourceStatus: function() {
        var filterList = /** @type {Array} */ (er.context.get('slotStatusFilterList'));
        return baidu.array.remove(filterList, function(item, i) {
            return item.text === '已存档';
        });
    },

    afterInit: function(page) {
        this.form = page.c('formAd');
        this.btnSubmit = page.c('formAd').c('btnSubmit');
        this.btnCancel = page.c('formAd').c('btnBack');
        this.requester = adresource.data.create;
    },

    initBehavior: function(page) {
        var me = this;
        this.form.c('chkCommunitySlot').onclick = baidu.fn.bind(me.toggleCommunity, me);
        this.form.c('chkKeywordsSlot').onclick = baidu.fn.bind(me.toggleKeywords, me);
        this.form.c('rbgType').onselect = baidu.fn.bind(this.onTypeSelect, this);
        adresource.Form.superClass.initBehavior.call(this, page);
    },

    onSubmitFail: function(data) {
        adresource.Form.superClass.onSubmitFail.call(this, data);
        if (data.message &&
           data.message.field &&
           data.message.field['keywords'] != undefined) {
            ui.util.validate.showError(baidu.g(this.form.c('orientKeywords').getId()),
                data.message.field['keywords'], 640);
        }
    },

    onValidateForm: function() {
        function clearPossibleError(me) {
            var arr = [
                baidu.g('beginTimeValueBlockFloat'),
                baidu.g('endTimeValueBlockFloat'),
                baidu.g(me.form.c('orientWeek').getId()),
                baidu.g(me.form.c('orientRegion').getId()),
                baidu.g(me.form.c('slotSelector').getId()),
                baidu.g(me.form.c('orientKeywords').getId()),
                baidu.g(me.form.c('txtMaxImpressionPerDay').getId()),
                baidu.g('wrapperCommunityKeywords')
            ];
            ui.util.validate.batchHideErrors(arr);
        };

        var rtn = true,
            formatter = baidu.date.format;
        clearPossibleError(this);

        if (this.form.c('beginTime').getValue().getTime() < +new Date) {
            ui.util.validate.showError(baidu.g('beginTimeValueBlockFloat'), '开始时间必须在当前时间之后');
            rtn = false;
        } else if (dn.util.getDatePart(this.form.c('beginTime').getValue()).getTime() >=
                   dn.util.getDatePart(this.form.c('endTime').getValue()).getTime() + 24 * 3600 * 1000) {
            ui.util.validate.showError(baidu.g('endTimeValueBlockFloat'), '开始时间必须在结束时间之前');
            rtn = false;
        }

        if (!this.form.c('orientWeek').getOrientValue()) {
            ui.util.validate.showError(baidu.g(this.form.c('orientWeek').getId()),
                '推广时段至少选择一个星期中的一小时', 640);
            rtn = false;
        }

        if (!this.form.c('orientRegion').getOrientValue()) {
            ui.util.validate.showError(baidu.g(this.form.c('orientRegion').getId()),
                '推广地域至少选择一个城市', 640);
            rtn = false;
        }

        if (parseInt(this.form.c('txtMaxImpressionPerDay').getValue(), 10) >
            parseInt(this.form.c('txtMaxImpressionPerCycle').getValue(), 10)) {
            ui.util.validate.showError(baidu.g(this.form.c('txtMaxImpressionPerDay').getId()),
              '按天的频次必须小于按广告投放周期的频次');
            rtn = false;
        }

        if (this.form.c('chkCommunitySlot').getChecked()) {
            var slotResult = this.form.c('slotSelector').getValue(),
                msg;
            if (!slotResult) {
                msg = '预算格式不正确，必须为正数';
                ui.util.validate.showError(baidu.g(this.form.c('slotSelector').getId()), msg);
                rtn = false;
            } else {
                if (slotResult.budget_role_ids == '') {
                    if (slotResult.orient_community == 1) {
                        msg = '生活圈定向，至少选择一个生活圈';
                    } else {
                        msg = '网站定向，至少选择一个网站';
                    }

                    ui.util.validate.showError(baidu.g(this.form.c('slotSelector').getId()), msg);
                    rtn = false;
                }
            }
        } else if (!this.form.c('chkKeywordsSlot').getChecked() &&
                   !this.form.c('chkCommunitySlot').getChecked()) {
            baidu.g('outerWrapperCommunityKeywords').setAttribute('style', 'margin:10px;width:400px;');
            ui.util.validate.showError(baidu.g('wrapperCommunityKeywords'), '生活圈(网站)和人群两者至少填写一种');
            rtn = false;
        }

        if (this.form.c('chkKeywordsSlot').getChecked() &&
            !this.form.c('orientKeywords').getOrientValue()) {
            ui.util.validate.showError(baidu.g(this.form.c('orientKeywords').getId()),
                '人群至少输入一个关键词', 640);
            rtn = false;
        }

        return rtn;
    },

    getExtraParam: function(page) {
        var arr = [];
        arr.push('start_time=' + baidu.date.format(this.form.c('beginTime').getValue(), this.form.c('beginTime').paramFormat) + '000000');
        arr.push('end_time=' + baidu.date.format(this.form.c('endTime').getValue(), this.form.c('endTime').paramFormat) + '235959');

        var slotResult = this.form.c('slotSelector').getValue();

        //生活圈网站选择广告位
        if (this.form.c('chkCommunitySlot').getChecked()) {
            arr.push('orient_community=' + slotResult.orient_community);
            arr.push('budget_role_ids=' + slotResult.budget_role_ids);
        }

        //推广时段
        arr.push('orient_hour=' + this.form.c('orientWeek').getOrientValue());

        //推广地域
        arr.push('orient_location=' + this.form.c('orientRegion').getOrientValue());

        //人群
        if (this.form.c('chkKeywordsSlot').getChecked()) {
            arr.push('keywords=' + this.form.c('orientKeywords').getOrientValue());
        }

        return arr.join('&');
    },

    onTypeSelect: function() {
        var type = this.form.c('rbgType').getValue();
        this.form.c('slotSelector').initByProductType(type, this.getEffectiveDatasourceStatus());
    },

    toggleCommunity: function() {
        ui.util.validate.hideError(baidu.g('wrapperCommunityKeywords'));
        baidu.g('outerWrapperCommunityKeywords').removeAttribute('style');
        var checked = this.form.c('chkCommunitySlot').getChecked();

        checked ?
        baidu.show('communitySlotWrapper') :
        baidu.hide('communitySlotWrapper');
    },

    toggleKeywords: function() {
        ui.util.validate.hideError(baidu.g('wrapperCommunityKeywords'));
        baidu.g('outerWrapperCommunityKeywords').removeAttribute('style');
        var checked = this.form.c('chkKeywordsSlot').getChecked();

        checked ?
        baidu.show('keywordsSlotWrapper') :
        baidu.hide('keywordsSlotWrapper');
    },

    initSlotSelectStatus: function() {
        if (this.model.keywords &&
            this.page.model.keywords.keywords.length > 0) {
            this.form.c('chkKeywordsSlot').setChecked(true);
        } else {
            this.form.c('chkKeywordsSlot').setChecked(false);
        }
        this.toggleKeywords();

        if (this.model.selectedSlot.budget_role_ids &&
            this.model.selectedSlot.budget_role_ids.length > 0) {
            this.form.c('chkCommunitySlot').setChecked(true);
        } else {
            this.form.c('chkCommunitySlot').setChecked(false);
        }

        this.toggleCommunity();
    }
};
baidu.inherits(adresource.Form, er.FormAction);
