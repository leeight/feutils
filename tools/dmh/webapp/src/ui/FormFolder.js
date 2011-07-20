/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/FormFolder.js.js
 * desc:    表单折叠控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

/**
 * ui.FormFolder
 * @constructor
 * @extends {ui.Control}
 */
ui.FormFolder = function(options) {
    //this.initOptions(options);
    ui.Control.call(this, options);
    this.type = 'formfolder';
};

ui.FormFolder.prototype = {
    /**
     * 绘制控件
     *
     * @public
     * @param {HTMLElement} main 控件主元素.
     */
    render: function(main) {
        var me = this;
        //ui.Base.render.call(me, main);
        ui.FormFolder.superClass.render.call(me, main);

        if (!me.isRender) {
            me.main.onclick = me.getClickHandler();
            if (me.closed) {
                me.close();
            }
            me.isRender = true;
        }
    },

    /**
     * 获取点击事件处理函数
     *
     * @private
     * @return {Function}
     */
    getClickHandler: function() {
        var me = this;
        return function() {
            me.toggle();
        };
    },

    /**
     * 打开/关闭 下一个元素
     *
     * @private
     */
    toggle: function() {
        if (this.main.getAttribute('isClosed')) {
            this.open();
        } else {
            this.close();
        }
    },

    /**
     * 打开 下一个元素
     *
     * @private
     */
    open: function() {
        var main = this.main,
            next = main.nextSibling;

        while (next.nodeType != 1) {
            next = next.nextSibling;
        }

        baidu.show(next);
        baidu.removeClass(main, this.getClass('closed'));
        main.setAttribute('isClosed', '');
    },

    /**
     * 关闭 下一个元素
     *
     * @private
     */
    close: function() {
        var main = this.main,
            next = main.nextSibling;

        while (next.nodeType != 1) {
            next = next.nextSibling;
        }

        baidu.hide(next);
        baidu.addClass(main, this.getClass('closed'));
        main.setAttribute('isClosed', '1');
    },

    /**
     * 释放控件
     *
     * @public
     */
    dispose: function() {
        this.main.onclick = null;
        //ui.Base.dispose.call(this);
        ui.FormFolder.superClass.dispose.call(this);
    }
};

//ui.Base.derive(ui.FormFolder);
baidu.inherits(ui.FormFolder, ui.Control);
