/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Dialog.js
 * desc:    对话框控件
 * author:  zhaolei,erik
 * date:    $Date$
 */

goog.require('ui.Control');
goog.require('ui.Mask');

goog.provide('ui.Dialog');

/**
 * 对话框控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.Dialog = function(options) {
    ui.Control.call(this, options);

    this.type = 'dialog';
    this.top = this.top || 137;

    this.resizeHandler = this.getResizeHandler();
};
baidu.inherits(ui.Dialog, ui.Control);

/**
 * 对话框主体和尾部的html模板
 * @private
 * @type {string}
 */
ui.Dialog.prototype.tplBF = '<div class="{1}" id="{0}"></div>';

/**
 * 对话框头部的html模板
 * @private
 * @type {string}
 */
ui.Dialog.prototype.tplHead = '<div id="{0}" class="{1}"><div id="{2}" class="{3}">{4}</div>{5}</div>';

/**
 * 关闭按钮的html模板
 * @private
 * @type {string}
 */
ui.Dialog.prototype.tplClose = '<div class="{0}" id="{1}">&nbsp;</div>';

/**
 * 对话框现在的状态，是否显示还是隐藏.
 * @private
 * @type {boolean}
 */
ui.Dialog.prototype.isShow = false;

/**
 * 是否显示关闭按钮.
 * @private
 * @type {boolean}
 */
ui.Dialog.prototype.closeButton;

/**
 * 对话框的宽度
 * @private
 * @type {number}
 */
ui.Dialog.prototype.width;

/**
 * 对话框标题上面的文字
 * @private
 * @type {string}
 */
ui.Dialog.prototype.title;

/**
 * 显示对话框
 */
ui.Dialog.prototype.show = function() {
    var main = this.getDOM();
    if (!main) {
        this.render();
        baidu.on(window, 'resize', this.resizeHandler);
    }

    this.resizeHandler();
    ui.Mask.show('dialog');
    this.isShow = true;
};

/**
 * 隐藏对话框
 */
ui.Dialog.prototype.hide = function() {
    if (this.isShow) {
        baidu.un(window, 'resize', this.resizeHandler);
        var main = this.getDOM();
        main.style.left = main.style.top = '-10000px';
        ui.Mask.hide('dialog');
        this.isShow = false;
    }
};

/**
 * 设置宽度
 * @param {number} width 宽度.
 */
ui.Dialog.prototype.setWidth = function(width) {
    this.width = width;
    this.main.style.width = width + 'px';
    if (this.isShow) {
        this.resizeHandler();
    }
};

/**
 * 设置标题文字
 *
 * @param {string} html 要设置的文字，支持html.
 */
ui.Dialog.prototype.setTitle = function(html) {
    var el = baidu.g(this.getId('title'));
    if (el) {
        el.innerHTML = html;
    }
    this.title = html;
};

/**
 * 设置内容
 *
 * @param {string} content 要设置的内容，支持html.
 */
ui.Dialog.prototype.setContent = function(content) {
    var body = this.getBody();
    if (body) {
        body.innerHTML = content;
        ui.util.buildControlTree(body, this);
    }
};


/**
 * 获取页面resize的事件handler
 *
 * @private
 * @return {Function}
 */
ui.Dialog.prototype.getResizeHandler = function() {
    var me = this,
        page = baidu.page;

    return function() {
        var main = me.getDOM(),
            left = (document.body.clientWidth - main.offsetWidth) / 2;

        if (left < 0) {
            left = 0;
        }

        main.style.left = left + 'px';
        // 新需求里改为35px，为的是考虑屏幕小的用户不需要滚动才能看见弹出框
        main.style.top = page.getScrollTop() + me.top + 'px';
    };
};


/**
 * 关闭对话框
 * @private
 */
ui.Dialog.prototype.close = function() {
    this.hide();
    this.onclose();
};

/**
 * 处理关闭的事件.
 * @protected
 */
ui.Dialog.prototype.onclose = baidu.emptyMethod;

/**
 * @inheritDoc
 */
ui.Dialog.prototype.render = function() {
    var me = this,
        id = me.getId(),
        main;

    // 避免重复创建
    if (baidu.g(id)) {
        return;
    }

    // 创建HTMLElement
    main = document.createElement('div');
    me.main = main;
    ui.Dialog.superClass.render.call(this, main);

    // 设置样式
    if (me.width) {
        main.style.width = me.width + 'px';
    }
    main.style.left = '-10000px';

    // 写入结构
    main.innerHTML = me.getHeadHtml()
                    + me.getBFHtml('body')
                    + me.getBFHtml('foot');

    // 挂载到body
    document.body.appendChild(main);
};

/**
 * 获取对话框头部的html
 *
 * @private
 * @return {string}
 */
ui.Dialog.prototype.getHeadHtml = function() {
    var me = this,
        head = 'head',
        title = 'title',
        close = 'close';

    return baidu.format(me.tplHead,
                        me.getId(head),
                        me.getClass(head),
                        me.getId(title),
                        me.getClass(title),
                        me.title,
                        (me.closeButton === false ? '' :
                            baidu.format(me.tplClose,
                                         me.getClass(close),
                                         me.getId(close)))
                        );
};

/**
 * @inheritDoc
 */
ui.Dialog.prototype.bindEvent = function() {
    ui.Dialog.superClass.bindEvent.call(this);
    if (this.closeButton !== false) {
        var close = this.getClose();
        close.onclick = baidu.fn.bind(this.close, this);
        close.onmouseover = baidu.fn.bind(this.closeOver, this);
        close.onmouseout = baidu.fn.bind(this.closeOut, this);
    }
};

/**
 * 获取对话框主体和腿部的html
 *
 * @private
 * @param {string} type 类型，body|foot.
 * @return {string}
 */
ui.Dialog.prototype.getBFHtml = function(type) {
    var me = this;
    return baidu.format(me.tplBF,
                        me.getId(type),
                        me.getClass(type),
                        '');
};

/**
 * 获取对话框主体的dom元素
 *
 * @return {Element}
 */
ui.Dialog.prototype.getBody = function() {
    return baidu.g(this.getBodyId());
};

/**
 * 获取body元素的dom id
 * @return {string}
 */
ui.Dialog.prototype.getBodyId = function() {
    return this.getId('body');
};

/**
 * 获取对话框腿部的dom元素
 * @return {Element}
 */
ui.Dialog.prototype.getFoot = function() {
    return baidu.g(this.getId('foot'));
};

/**
 * 获取对话框dom元素，也就是main元素
 * @return {Element}
 */
ui.Dialog.prototype.getDOM = function() {
    return baidu.g(this.getId());
};

/**
 * 获取close按钮元素
 *
 * @private
 * @return {Element}
 */
ui.Dialog.prototype.getClose = function() {
    return baidu.g(this.getId('close'));
};

/**
 * 鼠标移上close按钮的handler
 *
 * @private
 */
ui.Dialog.prototype.closeOver = function() {
    baidu.addClass(this.getClose(),
                   this.getClass('close-hover'));
};

/**
 * 鼠标移出close按钮的handler
 *
 * @private
 */
ui.Dialog.prototype.closeOut = function() {
    baidu.removeClass(this.getClose(),
                      this.getClass('close-hover'));
};

/**
 * @inheritDoc
 */
ui.Dialog.prototype.dispose = function() {
    baidu.un(window, 'resize', this.resizeHandler);
    this.resizeHandler = null;

    if (this.closeButton !== false) {
        var close = this.getClose();
        if (close) {
            close.onclick = null;
            close.onmouseover = null;
            close.onmouseout = null;
        }
    }

    var main = this.getDOM();
    if (main) {
        main.innerHTML = '';
        document.body.removeChild(main);
        main = null;
    }

    ui.Dialog.superClass.dispose.call(this);
};
