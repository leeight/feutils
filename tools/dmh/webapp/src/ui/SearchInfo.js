/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/SearchInfo.js
 * desc:    搜索条件信息控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

/**
 * 搜索条件信息控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.SearchInfo = function(options) {
    //this.initOptions(options);
	ui.Control.call(this, options);
    this.type = 'searchInfo';
    this.separator = this.separator || ' | ';
};

ui.SearchInfo.prototype = {
    /**
     * 渲染控件
     *
     * @protected
     * @param {Object} main 控件挂载的DOM.
     */
    render: function(main) {
        var me = this;
        //ui.Base.render.call(me, main, false);
        ui.SearchInfo.superClass.render.call(me, main);

        if (me.main) {
            main = me.main;
            main.innerHTML = me.getHtml();
            main.style.display = (me.isShow ? '' : 'none');
        }

    },

    /**
     * 获取关闭按钮的html
     *
     * @private
     * @return {string}
     */
    getCloseHtml: function() {
        var me = this,
            type = 'close';

        return baidu.format(me.tplClose,
                            me.getClass(type),
                            me.getId(type),
                            me.getStrCall('closeHandler'),
                            me.getStrCall('closeOver'),
                            me.getStrCall('closeOut'));
    },

    /**
     * 获取左边小图标的html
     *
     * @private
     * @return {string}
     */
    getIconHtml: function() {
        return baidu.format(this.tplIcon, this.getClass('icon'));
    },

    /**
     * 获取search信息的html
     *
     * @private
     * @return {string}
     */
    getHtml: function() {
        return this.getIconHtml()
                + this.getTextHtml()
                + this.getCloseHtml();
    },

    /**
     * 获取信息内容部分的html
     *
     * @private
     * @return {string}
     */
    getTextHtml: function() {
        var text = [],
            fields = this.fields,
            len = (fields instanceof Array) && fields.length,
            i, value, field, j,
            ctxLen, contextItem, itemShow, ctxValue,
            context, tpl, ignore;

        this.isShow = false;
        if (len) {
            for (i = 0; i < len; i++) {
                field = fields[i];
                tpl = field.template;
                context = field.context;
                ignore = field.ignore;

                // 处理context参数类型： array 或 string
                if (baidu.lang.isArray(context)) {
                    itemShow = false;
                    ctxLen = context.length;
                    ctxValue = [];
                    while (ctxLen--) {
                        contextItem = context[ctxLen];
                        value = this.encodeValue(er.context.get(contextItem));
                        ctxValue.unshift(value);

                        if (baidu.lang.hasValue(value)
                            && baidu.lang.hasValue(ignore[ctxLen])
                            && value !== ignore[ctxLen]) {

                            itemShow = true;
                            this.isShow = true;
                        }
                    }

                    if (itemShow) {
                        ctxValue.unshift(tpl);
                        text.push(baidu.format.apply(window, ctxValue));
                    }
                } else {
                    value = this.encodeValue(er.context.get(context));

                    if (baidu.lang.hasValue(value) && value !== ignore) {
                        text.push(baidu.format(tpl, value));
                        this.isShow = true;
                    }
                }
            }
        }

        return baidu.format(this.tplText,
                            this.getClass('text'),
                            text.join(this.separator));
    },

    /**
     * 对value进行html转义
     *
     * @param {string} value
     * @return {string}
     */
    encodeValue: function(value) {
        if (typeof value == 'string') {
            return baidu.encodeHTML(value);
        }

        return value;
    },

    /**
     * 信息内容部分html模板
     *
     * @private
     */
    tplText: '<div class="{0}">{1}</div>',

    /**
     * 小图标部分html模板
     *
     * @private
     */
    tplIcon: '<div class="{0}"></div>',

    /**
     * 关闭按钮部分html模板
     *
     * @private
     */
    tplClose: '<div class="{0}" id="{1}" onclick="{2}" onmouseover="{3}" onmouseout="{4}"></div>',

    /**
     * 隐藏区域
     *
     * @private
     */
    hide: function() {
        try {
            baidu.hide(this.main);
        } catch (e) {}
    },

    /**
     * onclose事件预声明，容错
     *
     * @public
     */
    onclose: new Function(),

    /**
     * close按钮点击的handler
     *
     * @private
     */
    closeHandler: function() {
        if (this.onclose() !== false) {
            this.hide();
        }
    },

    /**
     * 获取close按钮元素
     *
     * @private
     * @return {HTMLElement}
     */
    getClose: function() {
        return baidu.g(this.getId('close'));
    },

    /**
     * 鼠标移上close按钮的handler
     *
     * @private
     */
    closeOver: function() {
        baidu.addClass(this.getClose(),
                       this.getClass('close') + '-hover');
    },

    /**
     * 鼠标移出close按钮的handler
     *
     * @private
     */
    closeOut: function() {
        baidu.removeClass(this.getClose(),
                          this.getClass('close') + '-hover');
    }
};

//ui.Base.derive(ui.SearchInfo);
baidu.inherits(ui.SearchInfo, ui.Control);

