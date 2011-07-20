/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/FormSwitch.js
 * desc:    表单开关控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

/**
 * ui.FormSwitch
 * @constructor
 * @extends {ui.Control}
 */
ui.FormSwitch = function(options) {
    //this.initOptions(options);
    ui.Control.call(this, options);
    this.type = 'formswitch';
};

ui.FormSwitch.prototype = {
    init: function() {
        var openEl = this.getOpen(),
            closeEl = this.getClose();

        openEl.appendChild(this.getCloseSwitch());
        closeEl.appendChild(this.getOpenSwitch());
    },

    getOpen: function() {
        return baidu.g(this.open);
    },

    getClose: function() {
        return baidu.g(this.close);
    },

    getOpenSwitch: function() {
        var el = document.createElement('a');
        el.className = this.getClass();
        el.innerHTML = this.openText;
        el.onclick = this.getOpenHandler();

        return el;
    },

    getCloseSwitch: function() {
        var el = document.createElement('a');
        el.className = this.getClass();
        el.innerHTML = this.closeText;
        el.onclick = this.getCloseHandler();

        return el;
    },

    onopen: new Function(),

    getOpenHandler: function() {
        var me = this;
        return function() {
            if (me.onopen() !== false) {
                me.openIt();
            }
        };
    },

    onclose: new Function(),

    getCloseHandler: function() {
        var me = this;
        return function() {
            if (me.onclose() !== false) {
                me.closeIt();
            }
        };
    },

    openIt: function() {
        baidu.hide(this.getClose());
        baidu.show(this.getOpen());
    },

    closeIt: function() {
        baidu.show(this.getClose());
        baidu.hide(this.getOpen());
    },

    dispose: function() {
        this.getOpen().onclick = null;
        this.getClose().onclick = null;
    }
};

//ui.Base.derive(ui.FormSwitch);
baidu.inherits(ui.FormSwitch, ui.Control);
