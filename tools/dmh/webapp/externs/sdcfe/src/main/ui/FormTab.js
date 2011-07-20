/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/FormTab.js
 * desc:    表单Tab控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

/**
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 构造的选项.
 */
ui.FormTab = function(options) {
    ui.Control.call(this, options);
    this.tabs = this.datasource || this.tabs;
};

ui.FormTab.prototype = {
    /**
     * 初始化FormTab行为
     */
    init: function(isRefresh) {
        var me = this,
            listener,
            tabs = me.tabs,
            len = tabs.length,
            i = 0,
            tab,
            tabLabel,
            current;

        me.labelClickListeners = me.labelClickListeners || [];
        for (; i < len; i++) {
            tab = tabs[i];
            tabLabel = me.getLabel(tab['label']);

            if (tabLabel.checked) {
                current = tab['label'];
            }

            if (!isRefresh) {
                // XXX 必须使用me.getId()，不能使用me.id，因为要考虑到
                // loadPopup的情况
                tabLabel.setAttribute('formTab', me.getId());
                listener = me.getLabelClickListener(tab['label']);
                baidu.on(tabLabel, 'click', listener);
                me.labelClickListeners.push([tabLabel, listener]);
            }
        }

        me.gotoTab(current);
    },

    /**
     * 获取label点击的事件监听器
     *
     * @private
     * @return {Function}
     */
    getLabelClickListener: function(labelName) {
        var me = this;
        return function() {
            me.gotoTab(labelName);
        };
    },

    /**
     * goto一个tab
     *
     * @private
     * @param {string} labelStr 要goto的label.
     */
    gotoTab: function(labelStr) {
        var me = this,
            tabs = me.tabs,
            len = tabs.length,
            i = 0, key,
            tab,
            content,
            tabLabel,
            isCur,
            els, elLen, tabAttr, subTabInited = {};

        for (; i < len; i++) {
            tab = tabs[i];
            isCur = (labelStr == tab['label']);

            content = me.getContent(tab.content);
            tabLabel = me.getLabel(tab['label']);

            content.style.display = isCur ? 'block' : 'none';
            // FIXME 和#851相关，待修复
            // 这个问题是这样的，比如在新建物料这个表单里，有四种类型的广告物料类型，
            // 这里的切换使用了formTab。假设我们要创建的是文字类型广告物料因为提交
            // 表单前要对表单控件进行验证，如果不disable掉其他类型下 的表单控件，验证就通不过。
            ui.util.disableFormByContainer(content, !isCur);

            // 这里暂时没有return false的需求……
            // 所以先控制显示隐藏，然后触发事件
            if (isCur) {
                me.onselect(tab);
            }

            // 重新初始化子fromtab的状态
            if (isCur) {
                els = content.getElementsByTagName('*');
                elLen = els.length;
                while (elLen--) {
                    tabAttr = els[elLen].getAttribute('formTab');
                    if (tabAttr && !subTabInited[tabAttr]) {
                        subTabInited[tabAttr] = 1;
                        ui.util.get(tabAttr).init(true);
                    }
                }
            }

            tabLabel.checked = isCur;
        }
    },

    onselect: new Function(),

    /**
     * 获取label对应的dom元素
     *
     * @private
     * @param {string} tabLabel label名称.
     * @return {HTMLElement}
     */
    getLabel: function(tabLabel) {
        return ui.util.get(tabLabel).main;
    },

    /**
     * 通过值获取labelId
     *
     * @private
     * @param {string} value 值.
     * @return {?string}
     */
    getLabelNameByValue: function(value) {
        var tabs = this.tabs,
            len = tabs.length,
            i = 0,
            tab;

        for (; i < len; i++) {
            tab = ui.util.get(tabs[i].label);
            if (tab.getValue() == value) {
                return tab.getId();
            }
        }

        return null;
    },

    gotoTabByValue: function(value) {
        var me = this,
            labelName = me.getLabelNameByValue(value);

        me.gotoTab(labelName);
    },

    /**
     * 获取content对应的dom元素
     *
     * @private
     * @param {string} content content名称.
     * @return {HTMLElement}
     */
    getContent: function(content) {
        return baidu.g(content);
    },

    /**
     * 释放控件
     *
     * @public
     */
    dispose: function() {
        var me = this,
            listeners = me.labelClickListeners,
            len = listeners.length, i, item;

        while (len--) {
            item = listeners[len];
            baidu.un(item[0], 'click', item[1]);
            item.splice(0, 1);
            listeners.splice(len, 1);
        }

        ui.FormTab.superClass.dispose.call(this);
    }
};

baidu.inherits(ui.FormTab, ui.Control);
