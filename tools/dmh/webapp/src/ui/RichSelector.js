/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/RichSelector.js
 * desc:    复合型选择器
 * author:  zhaolei,erik
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

/**
 * 复合型选择器
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.RichSelector = function(options) {
    ui.InputControl.call(this, options);

    // 类型声明，用于生成控件子dom的id和class
    this.type = 'richsel';
    this.form = 1;
    this.tplPrefix = 'RichSelector';

    // 初始化default
    this.defaultValue = this.defaultValue || '';
    this.defaultText = this.defaultText || '';
    var def = this['default'];
    if (def) {
    	this.defaultValue = def.value;
        this.defaultText = def.text;
    }
    if (this.defaultValue) {
        this['default'] = {
            text: this.defaultText,
            value: this.defaultValue
        };
    }

    this.dialogWidth = this.dialogWidth || 660;
    this.select = this.select || 'single';
    this.comboWidth = this.comboWidth || 140;
    this.listDragable = !!this.listDragable;
    this.noListDataHtml = this.noListDataHtml || er.template.get('RichSelectorSubListEmpty');

    this.listInfo = {
        'pageSize' : 10,
        'pageNo' : 1,
        'pagerCount' : 5
    };

    var dialog = ui.util.create('Dialog',
                                    {
                                        id: 'dialog',
                                        title: this.dialogTitle,
                                        width: this.dialogWidth,
                                        skin: this.dialogSkin
                                    });
    this.addChild(dialog);

    this.multiList = [];
};

ui.RichSelector.prototype = {
    /**
     * 绘制控件
     *
     * @public
     * @param {HTMLElement} main 控件的容器元素.
     */
    render: function(main) {
        main = main || this.main;

        ui.RichSelector.superClass.render.call(this, main);

        main.innerHTML = this.getEntryHtml() + this.getSubHtml();

        var refresher = this.getMainRefresher();
        this.mainRefresher = refresher;

        //main.onmouseover = refresher;
        //main.onmouseout = refresher;
        //main.onmousedown = refresher;
        //main.onmouseup = refresher;
        //main.onmousemove = refresher;

        this.initControls(main);
    },

    getMainRefresher: function() {
        var me = this;
        return function() {
            me.refreshView();
        };
    },

    refreshView: function() {
        var clazz = this.getClass('noexist');
        baidu.dom.toggleClass(this.main, clazz);
    },

    /**
     * 是否是按钮类型
     */
    isBtnType: function() {
        return this.boxtype == 'button' ? true : false;
    },

    tplTipIcon: '<div class="{0}" {1}></div>',
    tplOptional: '<div class="form-optional">（选填）</div>',

    /**
     * 获取入口区域的html
     *
     * @private
     * @return {string}
     */
    getEntryHtml: function() {
        var me = this,
            html = '<div class="' + me.getClass('entry') + '">',
            tipClass = this.getClass('tip');

        if (me.isBtnType()) {
            html += me.getBtnHtml();
        } else {
            html += me.getBoxHtml();
        }

        if (me.tip) {
            html += baidu.format(me.tplTipIcon,
                                   tipClass,
                                   ui.ToolTip.getEventString(me.tip));
        }

        if (me.isOptional) {
            html += me.tplOptional;
        }

        html += '</div>';
        return html;
    },

    /**
     * 获取入口区域按钮的html
     *
     * @private
     * @return {string}
     */
    getBtnHtml: function() {
        var tpl = er.template.get(this.tplPrefix + 'Btn');
        return baidu.format(
            tpl,
            this.buttonText,
            this.getId('ButtonResult'),
            this.getClass('btn-result'),
            this.defaultText || '',
            this.resultTip ? '' : 'display:none'
        );
    },

    /**
     * 获取入口区域combobox的html
     *
     * @private
     * @return {string}
     */
    getBoxHtml: function() {
        return baidu.format(
                    er.template.get(this.tplPrefix + 'Box'),
                    this.comboWidth);
    },

    /**
     * 初始化子控件
     *
     * @private
     * @param {HTMLElement} main 控件主区域.
     */
    initControls: function(main) {
        var me = this;
        me.main = main;
        me.instChildrenFromMain();

        me.getChild('SubList').noDataHtml = me.noListDataHtml;

        if (me.isBtnType()) {
            me.initBtn();
        } else {
            me.initComboBox();
        }

        me.initSub();
    },


    /**
     * 获取子选择区域的html
     *
     * @private
     * @return {string}
     */
    getSubHtml: function() {
        var me = this,
            innerHtml = me.getSubHeadHtml()
                + me.getSubListHtml()
                + me.getSubFootHtml()
                + (me.listFootTip ? me.getSubFootAlertTipHtml() : '')
                + me.getSubCancelHtml();

        return baidu.format(
                    er.template.get(this.tplPrefix + 'Sub'),
                    me.getId('sub'),
                    me.getClass('sub'),
                    innerHtml);
    },

    /**
     * 获取子选择区域的元素
     *
     * @private
     * @return {HTMLElement}
     */
    getSub: function() {
        return baidu.g(this.getId('sub'));
    },

    /**
     * 获取子选择区域头部的html
     *
     * @private
     * @return {string}
     */
    getSubHeadHtml: function() {
        var me = this;

        return baidu.format(
                    er.template.get(this.tplPrefix + 'SubHead'),
                    me.getClass('sub-head'),
                    me.subTitle,
                    me.getClass('sub-title'),
                    me.searchText);
    },
    /**
     *
     *
     */
    getSubFootAlertTipHtml: function() {
        var me = this;
        return baidu.format(
                    er.template.get(this.tplPrefix + 'SubFootAlertTip'),
                    me.listFootTip);
    },

    /**
     * 获取子选择区域底部的html
     *
     * @private
     * @return {string}
     */
    getSubFootHtml: function() {
        return er.template.get(this.tplPrefix + 'SubFoot');
    },

    /**
     * 获取子选择区域列表的html
     *
     * @private
     * @return {string}
     */
    getSubListHtml: function() {
        return baidu.format(
                    er.template.get(this.tplPrefix + 'SubList'),
                    this.select,
                    this.listDragable ? '1' : '');
    },

    /**
     * 获取子选择区域取消按钮段的html
     *
     * @private
     * @return {string}
     */
    getSubCancelHtml: function() {
        var submit = this.select == 'multi' ? this.getSubmitHtml() : '';

        return baidu.format(
                    er.template.get(this.tplPrefix + 'SubCancel'),
                    submit,
                    this.footTip || '');
    },

    getSubmitHtml: function() {
        return er.template.get(this.tplPrefix + 'Submit');
    },

    /**
     * 初始化子选择区域的控件行为
     *
     * @private
     */
    initSub: function() {
        var me = this,
            list = me.getChild('SubList'),
            pager = me.getChild('SubPager'),
            search = me.getChild('SubBtn'),
            input = me.getChild('SubInput'),
            cancel = me.getChild('SubCancel'),
            submit = me.getChild('Submit') || null;

        list.setFields(me.listFields);
        if (me.isBtnType()) {
            if (me.select == 'single') {
                list.onselect = me.getListBtnSelectHandler();
            } else {
                list.onselect = me.getListBtnMultiSelectHandler();
                submit.onclick = me.getSubmitHandler();
            }
        } else {
            list.onselect = me.getListSelectHandler();
        }
        cancel.onclick = me.getSubCancelHandler();
        var searchHandler = me.getSearchHandler();
        search.onclick = searchHandler;
        input.onenter = searchHandler;
        pager.onselect = me.getPageChangeHandler();

        if (!me.lazyRequest) {
            me.showSubList();
        }
        me.hideSub();
    },

    hideSub: function() {
        baidu.hide(this.getSub());
    },

    showSub: function() {
        baidu.show(this.getSub());
        this.refreshView();
    },

    /**
     * 获取列表选取的事件handler
     *
     * @private
     * @return {Function}
     */
    getListSelectHandler: function() {
        var me = this;
        return function(index) {
            var comboBox = me.getChild('ComboBox'),
                comboData = me.comboboxData,
                selectData = me.listInfo.list[index],

                comboItem = {
                    'text': selectData[me.nameField],
                    'value': selectData[me.idField]
                },
                isExist = false,
                len = comboData.length,
                i;

            // 往combobox中加选中的选项
            for (i = 0; i < len; i++) {
                if (comboData[i].value == comboItem.value) {
                    isExist = true;
                    break;
                }
            }

            if (!isExist) {
                comboData.push(comboItem);
                comboBox.setDataSource(comboData);
                comboBox.render();
            }

            comboBox.setValue(comboItem.value);
            me.value = comboItem;

            me.onlistselect(me.value.value);
            me.hideSub();
        };
    },

    getListBtnSelectHandler: function() {
        var me = this;
        return function(index) {
            var selectData = me.listInfo.list[index],
                item = {
                    'text' : selectData[me.nameField],
                    'value' : selectData[me.idField]
                };

            if (me.onselect) {
                me.onselect(item, selectData);
            }

            me.value = item;
            me.selectData = selectData;
            me.refreshBtnResult();
            me.btnActive(0);
            me.hideSub();
        };
    },

    refreshBtnResult: function() {
        var value = this.value,
            text = value ? value.text : (value.defaultText || '');

        baidu.g(this.getId('ButtonResult')).innerHTML = text;
    },

    /**
     * 多列列表选择
     */
    getListBtnMultiSelectHandler: function() {
        var me = this;
        return function(index) {
            var len = index.length,
                i = 0,
                re = [],
                z;
            for (; i < len; i++) {
                z = index[i];
                re.push(me.listInfo.list[z]);
            }

            if (me.onselect) {
                me.onselect(re);
            }

            me.multiList = re;
        };
    },

    onselect: new Function(),
    onsubmit: new Function(),

    /**
     * 获取页数切换的事件handler
     *
     * @private
     * @return {Function}
     */
    getPageChangeHandler: function() {
        var me = this;
        return function(page) {
            me.listInfo.pageNo = page;
            me.showSubList();
        };
    },

    /**
     * 获取搜索按钮点击的事件handler
     *
     * @private
     * @return {Function}
     */
    getSearchHandler: function() {
        var me = this;
        return function() {
            me.listInfo.pageNo = 1;
            me.showSubList();
        };
    },

    /**
     * 显示sub列表
     */
    showSubList: function() {
        var me = this,
            input = me.getChild('SubInput'),
            listInfo = me.listInfo,
            callback = me.subListCallback,
            params = {
                keyword: input.getValue(),
                pageSize: listInfo.pageSize,
                pageNo: listInfo.pageNo
            };

        // 初始化callback函数
        if (!callback) {
            callback = me.getSubListCallback();
            me.subListCallback = callback;
        }

        me.listSource && me.listSource.getData(params, callback);
    },


    /**
     * 获取请求sub列表的回调函数
     *
     * @private
     * @return {Function}
     */
    getSubListCallback: function() {
        var me = this;
        return function(data) {
            var page = data.page,
                listInfo = me.listInfo,
                totalCount = page.totalCount,
                pageNo = page.pageNo,
                pageSize = page.pageSize,
                totalPage = Math.floor(totalCount / pageSize),
                startIndex = pageSize * (pageNo - 1) + 1,
                endIndex = pageSize * pageNo;

			if (typeof me.onGetDataBack == 'function')
			{
				me.onGetDataBack(data);
			}

            if (totalCount % pageSize != 0) {
                totalPage++;
            }

            // 开始和结束条目容错
            startIndex = Math.min(startIndex, totalCount);
            endIndex = Math.min(endIndex, totalCount);

            listInfo.totalCount = totalCount;
            listInfo.pageNo = pageNo;
            listInfo.totalPage = totalPage;
            listInfo.startIndex = startIndex;
            listInfo.endIndex = endIndex;
            listInfo.list = page.result;

            me.renderSubList();
            me.refreshView();
        };
    },

	onGetDataBack: function(data) {
	},

    /**
     * 绘制sub列表区域
     *
     * @private
     */
    renderSubList: function() {
        var me = this,
            sub = me.getSub(),
            subDisplay = sub.style.display,
            listInfo = me.listInfo,
            list = me.getChild('SubList'),
            pager = me.getChild('SubPager'),
            info = me.getChild('SubInfo');

        baidu.show(sub);
        pager.showCount = listInfo.pagerCount;
        pager.page = listInfo.pageNo;
        pager.total = listInfo.totalPage;

        info.start = listInfo.startIndex;
        info.end = listInfo.endIndex;
        info.total = listInfo.totalCount;

        list.datasource = listInfo.list;
        list.width = me.width || list.width;

        info.render();
        pager.render();
        list.render();
        sub.style.display = subDisplay;
    },

    /**
     * 获取取消按钮点击的事件handler
     *
     * @private
     * @return {Function}
     */
    getSubCancelHandler: function() {
        var me = this;
        return function() {
            if (me.isBtnType()) {
                me.btnActive(0);
            } else {
                me.resetCombobox();
            }

            me.onlistselectcancel();
            me.hideSub();
        };
    },

    getSubmitHandler: function() {
        var me = this;
        return function() {
            if (me.onsubmit) {
                me.onsubmit(me.multiList);
            }
        };
    },

    resetCombobox: function() {
        var value = this.getValue();
        if (!value && !this.dontSelectDefault) {
            value = this['default'];
        }

        this.getChild('ComboBox').setValue((value ? value.value : null));
    },

    /**
     * 初始化按钮
     *
     * @private
     */
    initBtn: function() {
        var btn = this.getChild('Button');
        btn.onclick = this.getBtnClickHandler(btn);
    },

    /**
     * 按钮状态
     *
     * @param {boolean} stat
     * @private
     */
    btnActive: function(stat) {
        this.getChild('Button').active(!!stat);
    },

    /**
     * 按钮点击事件
     *
     * @private
     */
    getBtnClickHandler: function(btn) {
        var me = this;

        return function() {
            var stat = btn.getState('active');

            if (stat) {
                me.hideSub();
                me.btnActive(0);
            } else {
                me.showSub();
                if (me.lazyRequest) {
                    me.showSubList();
                }
                me.btnActive(1);
            }
        };
    },

    /**
     * 初始化主区域combobox的控件行为
     *
     * @private
     */
    initComboBox: function() {
        var me = this,
            box = me.getChild('ComboBox'),
            defaultValue = me.defaultValue,
            data = [
                {
                    'text': me.selectText,
                    'value': 'FromExists',
                    'icon': 'list'
                }
            ];

        if (!me.noNew) {
            data.push({
                'text': me.newText,
                'value': 'FromNew',
                'icon': 'add'
            });
        }

        if (me.defaultText) {
            data.push({
                'text': me.defaultText,
                'value': defaultValue
            });
        }

        if (me.value && me.value.value != defaultValue) {
            data.push(me.value);
            defaultValue = me.value.value;
        }
        me.comboboxData = data;

        box.setDataSource(data);
        box.render();
        if (!me.dontSelectDefault || this.value) {
            box.setValue(defaultValue);
        }
        box.onselect = me.getBoxSelectHandler();
    },

    /**
     * 获取Combobox选取的事件handler
     *
     * @private
     * @return {Function}
     */
    getBoxSelectHandler: function() {
        var me = this;
        return function(value, selected) {
            me.hideDialog();
            me.hideSub();
            if (me.onboxselect) {
                me.onboxselect(value, selected);
            }

            switch (value) {
                case 'FromExists':
                    me.showSub();
                    if (me.lazyRequest) {
                        me.showSubList();
                    }
                    break;
                case 'FromNew':
                    me.showNewDialog();
                    break;
                default:
                    me.value = selected;
                    break;
            }
        };
    },
    onboxselect: function() {},
    onlistselect: function() {},
    onlistselectcancel: function() {},

    showNewDialog: function() {
        var me = this,
            action,
            dialog = me.getDialog(),
            okBtn = dialog.getChild('NewOK'),
            cancelBtn = dialog.getChild('NewCancel'),
            dialogFoot;

        ui.Mask.show('richsel' + me.id);
        dialog.show();

        if (!me.isDialogInit) {
            me.isDialogInit = true;

            okBtn = ui.util.create('Button',
                                      {
                                          id: 'NewOK',
                                          content: '完成',
                                          skin: 'btnsubmit'
                                      });
            dialogFoot = dialog.getFoot();
            dialogFoot.innerHTML = '';
            okBtn.appendTo(dialog.getFoot());
            dialog.addChild(okBtn);

            cancelBtn = ui.util.create('Button',
                                      {
                                          id: 'NewCancel',
                                          content: '返回',
                                          skin: 'btnback'
                                      });
            cancelBtn.appendTo(dialog.getFoot());
            dialog.addChild(cancelBtn);
            cancelBtn.onclick = me.getNewCancelHandler();
            dialog.onclose = me.getNewCancelHandler();
        } else {
            okBtn.enable();
        }

        action = er.controller.loadPopup(dialog.getBodyId(),
                                             me.dialogAction,
                                             me.actionArg);
        me.actionObject = action;
        action.onsubmitfinished = me.getDialogOkHandler();

        if (action.getSubmitHandler) {
            okBtn.onclick = action.getSubmitHandler(okBtn);
        } else {
            okBtn.onclick = function() {
                action.validateAndSubmit(okBtn);
            };
        }
    },

    getDialogOkHandler: function() {
        var me = this;
        return function(data) {
            var selectData = {
                'text': data[me.nameField],
                'value': data[me.idField]
            },
            comboData = me.comboboxData,
            comboBox = me.getChild('ComboBox');

            comboData.push(selectData);
            comboBox.setDataSource(comboData);
            comboBox.render();
            comboBox.setValue(selectData.value);

            me.value = selectData;
            me.hideDialog();
            me.leaveAction();
        };
    },

    leaveAction: function() {
        var action = this.actionObject;

        if (action) {
            action.leave();
            baidu.g(this.getDialog().getBodyId()).innerHTML = '';
            this.actionObject = null;
        }
    },

    getNewCancelHandler: function() {
        var me = this;
        return function() {
            me.hideDialog();
            me.resetCombobox();
            me.leaveAction();
        };
    },

    getDialog: function() {
        return this.getChild('dialog');
    },

    hideDialog: function() {
        var dialog = this.getDialog();
        if (dialog) {
            dialog.hide();
        }
        ui.Mask.hide('richsel' + this.id);
    },

    /**
     * 获取当前选取的项
     *
     * @public
     * @return {Object}
     */
    getValue: function() {
        return this.value || null;
    },

    getSelectData: function() {
        return this.selectData || null;
    },

    /**
     * 获取当前选取的值
     *
     * @public
     * @return {string}
     */
    getParamValue: function() {
        //return this.value || this.defaultValue;
        return (this.value && this.value.value) || this.defaultValue;
    },
    /**
     */
    showAlertTip: function() {
        baidu.show('deliveryMaterialRichSelectorSubFootAlertTip');
        window.setTimeout(function() {baidu.hide('deliveryMaterialRichSelectorSubFootAlertTip');},3000);
    },

    /**
     * 释放控件
     *
     * @protected
     */
    dispose: function() {
        var me = this,
            main = me.main;

        me.leaveAction();
        main.onmouseover = null;
        main.onmouseout = null;
        main.onmousedown = null;
        main.onmouseup = null;
        main.onmousemove = null;
        main = null;

        me.subListCallback = null;
        ui.Mask.hide('richsel' + this.id);
        ui.RichSelector.superClass.dispose.call(me);
    }
};
baidu.inherits(ui.RichSelector, ui.InputControl);
