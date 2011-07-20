/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/tab.js
 * desc:    Tab切换
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */



/**
 * Tab切换
 *
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件的配置信息.
 */
ui.Tab = function(options) {
    ui.Control.call(this, options);
};

ui.Tab.prototype = {

    bindEvent: function() {
        var me = this,
            tabs = me.tabs,
            len = tabs.length,
            i = 0,
            label;
        for (; i < len; i++) {
            label = ui.util.get(tabs[i].label);
            label.onclick = baidu.fn.bind(me.onclickHandler, me, tabs[i].label);
        }
        this.setDefault();
    },

    dispose: function() {
        for (var i = 0; i < this.tabs.length; i++) {
            ui.util.get(this.tabs[i].label).onclick = null;
        }

        ui.Tab.superClass.dispose.call(this);
    },

    /**
     * @inheritDoc
     */
    render: function(main) {
        main = main || this.main;

        ui.Tab.superClass.render.call(this, main);

        //baidu.dom.remove(main);
    },

    /**
     * 切换到指定label的tab
     *
     * @param {string} sLabel
     */
    go: function(sLabel) {
        var me = this,
            tabs = me.tabs,
            len = tabs.length,
            i = 0,
            tab,
            content,
            label,
            isCur;

        for (; i < len; i++) {
            tab = tabs[i];
            isCur = sLabel === tab.label;
            if (tab.content) {
                content = baidu.g(tab.content);
                content.style.display = isCur ? 'block' : 'none';
            }
            label = ui.util.get(tab.label);
            label.active(isCur);
        }
    },

    /**
     * 设置默认选项卡
     *
     * @private
     */
    setDefault: function() {
        var me = this,
            value = me.value;

        if (value) {
            me.go(value);
        }
    },

    onchanging: function() {},

    onchanged: function() {},

    /**
     * onclick事件
     *
     * @private
     */
    onclickHandler: function(label) {
        if (this.onchanging(label) !== false) {
            this.go(label);
            this.onchanged(label);
        }
    }
};


baidu.inherits(ui.Tab, ui.Control);