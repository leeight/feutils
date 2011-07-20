/**
 * 广告编辑页
 * @constructor
 * @extends {er.FormAction}
 */
ad.Form = function() {
    er.FormAction.call(this);
    this.model = new base.BaseModel({
      'materials' : [
      /*
        { 'id' : 1, 'name' : 'AAA', 'type' : 'google', 'status' : 'baidu' },
        { 'id' : 2, 'name' : 'BBB', 'type' : 'google', 'status' : 'baidu' },
        { 'id' : 3, 'name' : 'CCC', 'type' : 'google', 'status' : 'baidu' }
      */
      ],
      'material_list_fields' : ad.config.materialListFields
    });
    this.view = 'adEdit';
};

ad.Form.prototype = {
    BACK_LOCATION: '/ad/list',

    CONTEXT_INITER_LIST: ['initModels', 'initUpdatedSlotlist'],

    /**
     * ParallelWorkerManager貌似不能解决并行中有串行的情况，暂时使用CONTEXT_INITER_LIST解决，to优化
     */
    initUpdatedSlotlist: function(query, callback) {
      var me = this;
      if (me.isModify()) {
          var pwm = new base.ParallelWorkerManager();
          pwm.addWorker(new base.FuncWorker(slot.data.list, 'type=' + me.model.productType + '&status=106&page.pageNo=1&page.pageSize=15&type_join=false', function(data) {
              me.model.slot_datasourceSingleSiteLeft = data.page.result;
              me.model.singleSiteTotalCount = data.page.totalCount;
            }));
          pwm.addWorker(new base.FuncWorker(slot.data.list, 'type=' + me.model.productType + '&status=106&community_id=-1&type_join=false', function(data) {
              me.model.noCommunitySlotlist = data.page.result;
            }));
          pwm.addDoneListener(callback);
          pwm.start();
      } else {
        callback();
      }
    },

    createCommunityListWorker: function(param) {
      var me = this;
      return new base.FuncWorker(community.data.list, param ? param : '', function(data) {
        me.model.slot_datasourceMultiSitesLeft = data.page.result;
      });
    },

    createSlotListWorker: function(param) {
      var me = this;
      return new base.FuncWorker(slot.data.list, param ? param : '', function(data) {
        me.model.slot_datasourceSingleSiteLeft = data.page.result;
        me.model.singleSiteTotalCount = data.page.totalCount;
      });
    },

    initModels: function(query, callback) {
      var me = this,
          pwm,
          productParam;
      me.model.communityslotRequester = community.data.slotlist;
      me.model.slotlistRequester = slot.data.list;
      me.model.types = er.context.get('productTypeList');
      me.model.chargeModes = er.context.get('chargeModeList');

      pwm = new base.ParallelWorkerManager();
      pwm.addWorker(me.createCommunityListWorker('status=0'));
      if (me.isModify()) {
        me.model.title = '修改广告';
        var readAdWorker = new base.FuncWorker(ad.data.read,
          'id=' + me.argMap.paramMap['id'],
          function(data) {
            me.attchToModel(data.result);
          }
        );
        pwm.addWorker(readAdWorker);
      } else {
        me.model.title = '新建广告';
        // 产品形式默认为空
        me.model.productType = '';
        // 日消费限额默认值“总预算/投放天数*1.05”
        me.model.max_daily_consume = 200;
        // 剩余消费默认值为0
        me.model.residue = 0;

        //计费方式默认为cpm
        me.model.charge_mode = '0';

        // 产品形式决定的默认广告位状态设为第一个产品形式的广告位状态
        me.model.datasourceSlotStatus = me.getDatasourceStatusByText(er.context.get('productTypeList')[0].text);
        pwm.addWorker(me.createSlotListWorker('status=106&page.pageNo=1&page.pageSize=15&type_join=false'));
      }
      pwm.addDoneListener(callback);
      pwm.start();
    },

    attchToModel: function(adItem) {
        var me = this;
        baidu.object.extend(adItem, {
            order_id: adItem.order.id
        });

        for (var key in adItem) {
            this.model[key] = adItem[key];
        }

        this.model.name = dn.util.decodeString(this.model.name);
        this.model.billing_factor = parseFloat(this.model.billing_factor).toFixed(2);
        this.model.discount_rate = parseFloat(this.model.discount_rate).toFixed(4);
        this.model.budget_threshold = parseFloat(this.model.budget_threshold).toFixed(2);

        this.model.start_time = dn.util.parseToDate(adItem.start_time);
        this.model.end_time = dn.util.parseToDate(adItem.end_time);

        for (var i = 0; i < adItem.budget_role_values; i++) {
            adItem.budget_role_values[i] = parseFloat(adItem.budget_role_values[i]).toFixed(2);
        }

        this.model.selectedSlot = {
               orient_community: adItem.orient_community,
                budget_role_ids: adItem.budget_role_ids,
                budget_role_values: adItem.budget_role_values,
                budget_role_slot_ids: adItem.budget_role_slot_ids
        };
        this.model.productType = adItem.type;
        this.model.datasourceSlotStatus = this.getDatasourceStatusByValue(adItem.type);

        this.model.orient_hour = {weektime: this.setOrientHour(adItem.orient_hour)};
        this.model.orient_location = {region: this.setOrientRegion(adItem.orient_location)};
        this.model.keywords = {keywords: this.model.keywords};
    },

    setOrientRegion: function(val) {
        var myValue = {},tmp, subItem, citys,
        region = er.context.get('regionInfoMap'),
        temp = region.cityProvince;
        var itemValue = val;
        for (var j = 0, len2 = itemValue.length; j < len2; j++) {
            subItem = itemValue[j];
            if (subItem.length >= 3 && subItem !== '999') {
                // subItem是二级城市，儿region.cityProvince是二级
                // 城市到一级城市的对应关系
                // i2是一级城市列表
                var i2 = temp[subItem];
                if (!myValue[i2]) {
                    myValue[i2] = [];
                }
                myValue[i2].push(subItem);
            } else {
                myValue[subItem] = [];
                citys = region[subItem];
                if (citys instanceof Array) {
                    for (var i2 = 0, j2 = citys.length; i2 < j2; i2++) {
                        myValue[subItem].push(citys[i2].v);
                    }
                }
            }
        }
        return myValue;
    },

    setOrientHour: function(val) {
        if (!val) return '';
        var myValue = [], tmp, temp, subItem;
        for (var i2 = 0; i2 < 7; i2++) {
            temp = [];
            myValue.push(temp);
            for (var j2 = 0; j2 < 24; j2++) {
                temp.push(0);
            }
        }
        var itemValue = val.split(',');
        for (var j = 0, len2 = itemValue.length; j < len2; j += 2) {
            subItem = itemValue[j];
            temp = parseInt(subItem.substr(0, 1), 10) - 1;
            var i2 = parseInt(subItem.substr(1), 10);
            j2 = parseInt(itemValue[j + 1].substr(1), 10);
            for (; i2 < j2; i2++) {
                myValue[temp][i2] = 1;
            }
        }
        return myValue;
    },

    /** @inheritDoc */
    enterDocumentInternal: function() {
      if (this.isModify()) {
        this.initSlotSelectStatus();
        this.form.c('rbgType').disableChildren();
        var type = this.form.c('rbgType').getValue();
        if(type != '0'){
            baidu.hide('charge_mode_row');
            this.form.c('chargeMode').disable();
        } else {
            this.form.c('chargeMode').disableChildren();
        }
        this.form.c('chkIsSupplement').setReadOnly(true);
        this.form.c('txtOrderId').setReadOnly(true);
      } else {
        baidu.hide('charge_mode_row');
        this.form.c('chargeMode').disable();
      }
    },

    getDatasourceStatusByText: function(productType) {
        var status = [];
        if (productType == '') return status;
        var slotStatusList = er.context.get('slotStatusFilterList');
        if (productType == '通栏' || productType == '画中画') {
            for (var i = 0; i < slotStatusList.length; i++) {
                if (slotStatusList[i].text !== '有请求' && slotStatusList[i].text !== '无请求' && slotStatusList[i].text !== '已存档') {
                    status.push(slotStatusList[i]);
                }
            }
        }
        else {
            for (var i = 0; i < slotStatusList.length; i++) {
                if (slotStatusList[i].text !== '有效' && slotStatusList[i].text !== '已存档') {
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

    /** @inheritDoc */
    afterInit: function(page) {
      this.form = page.c('formAd');
      this.btnSubmit = page.c('formAd').c('btnSubmit');
      this.btnCancel = page.c('formAd').c('btnBack');
      this.requester = this.isModify() ? ad.data.update : ad.data.create;
    },

    /** @inheritDoc */
    initBehavior: function(page) {
      ad.Form.superClass.initBehavior.call(this, page);
      var me = this;
      this.form.c('chkCommunitySlot').onclick = baidu.fn.bind(me.toggleCommunity, me);
      this.form.c('chkKeywordsSlot').onclick = baidu.fn.bind(me.toggleKeywords, me);
      this.form.c('rbgType').onselect = baidu.fn.bind(this.onTypeSelect, this);
      this.form.c('btnAddMaterial').onclick = baidu.fn.bind(me._addMaterial, me);
      this.form.c('materialList').setBodyClickHandler(baidu.fn.bind(me._onBodyClickHandler, me));
    },

    onSubmitFail: function(data) {
        ad.Form.superClass.onSubmitFail.call(this, data);
        if (data.message && data.message.field && data.message.field['keywords'] != undefined) {
            ui.util.validate.showError(baidu.g(this.form.c('orientKeywords').getId()), data.message.field['keywords'], 640);
        }
    },

    /**
     * 点击物料列表的时候，对应的处理函数
     * @param {Event} e 事件对象.
     */
    _onBodyClickHandler: function(e) {
      var evt = e || window.event,
          ele = baidu.event.getTarget(evt);
      if (ele && ele.nodeName == 'A') {
        // 这里不直接使用ele.href的原因是浏览器会返回一个绝对地址过来
        // 例如，代码里面写的是'#/material/update'
        // 获取到的地址就有可能是'http://dantest.baidu.com:8080/main.html#/material/update
        // 但是因为Tomcat会自动给新用户在main.html中添加jsessionid，如果jsessionid的值恰好是
        // 数字开头，例如
        // http://dantest.baidu.com:8080/main.html;jsessionid=94XXXXXXXXX#/material/update
        // 后面获取id的时候就一直返回固定的`94`，很悲剧吧。
        // 当然，修改正则表达式是可以解决这个问题的，但是我没有修改，哈哈。
        // http://icafe.baidu.com:8100/jtrac/app/item/DAN-176
        var href = ele.getAttribute('href', 2);
        if (href.indexOf('/material/status_update') > -1) {
          // 归档
          var match = /id=(\d+)/.test(href);
          if (match) {
            var id = RegExp.$1;
            if (id) {
              // 1. 提交请求
              // 2. 删除model中的数据
              // 3. 更新视图
              var me = this;
              ad.data.material_status_update('ids=' + id + '&status=2', function(data) {
                if (data.success == 'true') {
                  var index = -1;
                  baidu.array.each(/** @type {Array} */(me.model['materials']), function(item, position) {
                    if (item.id == id) {
                      index = position;

                      // break the iterator
                      return false;
                    }
                  });
                  if (index >= 0) {
                    me.model['materials'].splice(index, 1);
                    me._repaintMaterialList();
                  }
                }
              });
            }
          }
        } else if (href.indexOf('/material/update') > -1) {
          // 修改
          var match = /id=(\d+)/.test(href);
          if (match) {
            this._updateMaterial(RegExp.$1);
          }
        } else if (href.indexOf('/material/preview') > -1) {
          return true;
        }
        baidu.event.stop(evt);
      }
    },

    /**
     * 重新更新物料列表
     * @private
     */
    _repaintMaterialList: function() {
      var table = this.form.getChild('materialList');
      table.rebindModel({ 'materials' : this.model['materials'] });
    },

    /**
     * 更新this.model中的物料数据，并更新物料列表的内容
     * @private
     */
    _addOrUpdateMaterial: function(data) {
      var i, j, item, index = -1;
      for (i = 0, j = this.model['materials'].length; i < j; i++) {
        item = this.model['materials'][i];
        if (item['id'] == data['id']) {
          index = i;
          this.model['materials'][i] = data;
          // 更新
          break;
        }
      }
      if (index == -1) {
        // 追加一条记录
        this.model['materials'].push(data);
      }

      this._repaintMaterialList();
    },

    /**
     * 关闭添加，修改物料对话框
     * @private
     */
    _closeDialog: function() {
      dn.util.unloadPopup(this.page);
    },

    /**
     * 更新物料，添加或者创建
     * @private
     * @param {Object} data 物料数据.
     */
    _onMaterialChange: function(data) {
      this._addOrUpdateMaterial(data.result);
      this._closeDialog();

      // disable action back function
      return false;
    },

    /**
     * 关闭Dialog，不添加物料
     * @private
     */
    _cancelMaterial: function() {
      this._closeDialog();
    },

    /**
     * 返回逗号分割的物料ID
     * @return {string} 逗号分割的物料ID.
     */
    _getMaterialIds: function() {
      var ids = [];
      baidu.array.each(this.model['materials'], function(item) {
        ids.push(item.id);
      });
      return ids.join(',');
    },

    /**
     * 修改或者更新物料的对话框
     * @param {Object} actionParams 额外的argMap对象.
     * @suppress {checkTypes}
     */
    _launchMaterialDialog: function(actionParams) {
      var action = dn.util.loadPopup(this.page, 'material.Form', {
          title: '创建创意',
          width: 630
      }, actionParams);
      action.onSubmitSucceed = baidu.fn.bind(this._onMaterialChange, this);
      action.back = baidu.fn.bind(this._cancelMaterial, this);
    },

    /**
     * 获取当前选中的产品类型.
     * @return {string} 产品类型.
     */
    _getProductType: function() {
      return this.form.c('rbgType').getValue();
    },

    /**
     * 新增广告创意
     * @private
     */
    _addMaterial: function() {
      var product_type = this._getProductType();
      var actionParams = {
        'paramMap' : {
          'max_preview_width' : 400,
          'product_type' : product_type
        }
      };
      this._launchMaterialDialog(actionParams);
    },

    /**
     * 更新物料
     * @param {string} id 物料ID.
     */
    _updateMaterial: function(id) {
      var product_type = this._getProductType();
      var actionParams = {
        'path' : '/material/update',
        'paramMap' : {
          'id' : id,
          'max_preview_width' : 400,
          'product_type' : product_type
        }
      };
      this._launchMaterialDialog(actionParams);
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
      if (!this.isModify() && this.form.c('beginTime').getValue().getTime() < +new Date) {
        ui.util.validate.showError(baidu.g('beginTimeValueBlockFloat'), '开始时间必须在当前时间之后');
        rtn = false;
      } else if (dn.util.getDatePart(this.form.c('beginTime').getValue()).getTime() >=
              dn.util.getDatePart(this.form.c('endTime').getValue()).getTime() + 24 * 3600 * 1000) {
        ui.util.validate.showError(baidu.g('endTimeValueBlockFloat'), '开始时间必须在结束时间之前');
        rtn = false;
      }

      if (!this.form.c('orientWeek').getOrientValue()) {
        ui.util.validate.showError(baidu.g(this.form.c('orientWeek').getId()), '推广时段至少选择一个星期中的一小时', 640);
        rtn = false;
      }

      if (!this.form.c('orientRegion').getOrientValue()) {
        ui.util.validate.showError(baidu.g(this.form.c('orientRegion').getId()), '推广地域至少选择一个城市', 640);
        rtn = false;
      }

      if (parseInt(this.form.c('txtMaxImpressionPerDay').getValue(), 10) >
         parseInt(this.form.c('txtMaxImpressionPerCycle').getValue(), 10)) {
        ui.util.validate.showError(baidu.g(this.form.c('txtMaxImpressionPerDay').getId()), '按天的频次必须小于按广告投放周期的频次');
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
          } else if (slotResult.budget_num >
                    parseInt(this.form.c('txtBudget').getValue(), 10)) {
            ui.util.validate.showError(baidu.g(this.form.c('slotSelector').getId()), '生活圈(网站)的总预算值必须小于等于该广告的预算');
            rtn = false;
          }
        }
      }else if (!this.form.c('chkKeywordsSlot').getChecked() &&
               !this.form.c('chkCommunitySlot').getChecked()) {
        baidu.g('outerWrapperCommunityKeywords').setAttribute('style', 'margin:10px;width:400px;');
        ui.util.validate.showError(baidu.g('wrapperCommunityKeywords'), '生活圈(网站)和人群两者至少填写一种');
        rtn = false;
      }

      if (this.form.c('chkKeywordsSlot').getChecked() &&
         !this.form.c('orientKeywords').getOrientValue()) {
        ui.util.validate.showError(baidu.g(this.form.c('orientKeywords').getId()), '人群至少输入一个关键词', 640);
        rtn = false;
      }

      /*
      if (this.model['materials'].length <= 0) {
        ui.util.validate.showError(baidu.g(this.form.c('materialList').getId()), '创意列表为空');
        rtn = false;
      }*/

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
            arr.push('budget_role_values=' + slotResult.budget_role_values);
        }

        //推广时段
        arr.push('orient_hour=' + this.form.c('orientWeek').getOrientValue());

        //推广地域
        arr.push('orient_location=' + this.form.c('orientRegion').getOrientValue());

        //人群
        if (this.form.c('chkKeywordsSlot').getChecked()) {
            arr.push('keywords=' + this.form.c('orientKeywords').getOrientValue());
        }

      //创意ID
      arr.push('material_ids=' + this._getMaterialIds());

        if (this.isModify()) {
            arr.push('id=' + this.model.id);
        }

        return arr.join('&');
    },

    onTypeSelect: function() {
        var type = this.form.c('rbgType').getValue();
        this.form.c('slotSelector').initByProductType(type, this.getDatasourceStatusByValue(type));
        this.form.c('chkIsSupplement').setChecked(false);
        if (type == '0') {
            baidu.show('charge_mode_row');
            this.form.c('chargeMode').enable();
        } else {
            if (type == '6' || type == '7') {
                this.form.c('chkIsSupplement').setChecked(true);
            }
            baidu.hide('charge_mode_row');
            this.form.c('chargeMode').disable();
        }
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
        if (this.model.keywords && this.page.model.keywords.keywords.length > 0) {
            this.form.c('chkKeywordsSlot').setChecked(true);
        }
        else {
            this.form.c('chkKeywordsSlot').setChecked(false);
        }
        this.toggleKeywords();

        if (this.model.selectedSlot.budget_role_ids && this.model.selectedSlot.budget_role_ids.length > 0) {
            this.form.c('chkCommunitySlot').setChecked(true);
        }
        else {
            this.form.c('chkCommunitySlot').setChecked(false);
        }
        this.toggleCommunity();
    }
};
baidu.inherits(ad.Form, er.FormAction);
