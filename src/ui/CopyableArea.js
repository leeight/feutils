/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/CopyableArea.js
 * desc:    可复制的文本区域控件
 * author:  zhaolei,erik
 * date:    $Date$
 */

/**
 * 文本输入框组件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.CopyableArea = function(options) {
	ui.Control.call(this, options);

    this.type = 'copyarea';
    this.flashSrc = this.flashSrc || '/img/clipboard.swf';
    this.successText = this.successText || '复制成功！';
    this.tip = this.tip || '';
    this.textInput = this.textInput || false;

    ui.CopyableArea.container[this.id] = this;
};

ui.CopyableArea.prototype = {

    /**
     * 绘制控件
     *
     * @param {HTMLElement} main 控件主元素.
     */
    render: function(main) {
        var me = this,
            value = me.value;
        main = main || me.main;

        main.innerHTML = me.getMainHtml()
                           + baidu.format(er.template.get('CopyableAreaTip'), this.tip)
                           + me.getFlashHtml()
                           + me.getInfoHtml()
                           + me.getSuccessHtml();

        ui.CopyableArea.superClass.render.call(me, main);
        if (value) {
            me.setValue(value);
        }
    },

    /**
     * 设置textarea的值
     *
     * @param {string} value
     */
    setValue: function(value) {
        var text = baidu.g(this.getId('text')),
            len = value.split('\n').length,
            height = Math.max(len * 20 + 4, 60);

        if (text.tagName == 'TEXTAREA') {
            text.style.height = height + 'px';
        }

        text.value = value;
    },

    /**
     * 设置tip的值
     *
     * @param {string} tip
     */
    setTip: function(tip) {
    	baidu.q('ui-copyarea-tip', baidu.g(this.getId()))[0].innerHTML = tip;
    },

    /**
     * 获取主区域的html
     *
     * @private
     * @return {string}
     */
    getMainHtml: function() {
        return baidu.format(
                   (this.textInput
                        ? er.template.get('CopyableTextInputMain')
                        : er.template.get('CopyableAreaMain')),
                   this.getId('text'));
    },

    /**
     * 获取复制的flash的html
     *
     * @private
     * @return {string}
     */
    getFlashHtml: function() {
        return baidu.format(
                   er.template.get('CopyableAreaFlash'),
                   this.getId('flash'),
                   this.flashSrc,
                   this.getClipStr(),
                   this.getId('text')
                   );
    },

    /**
     * 获取信息区域的html
     *
     * @private
     * @return {string}
     */
    getInfoHtml: function() {
        if (this.info) {
            return baidu.format(
                       er.template.get('CopyableAreaInfo'),
                       this.info
                       );
        }

        return '';
    },

    /**
     * 获取复制成功提示的html
     *
     * @private
     * @return {string}
     */
    getSuccessHtml: function() {
        return baidu.format(
                       er.template.get('CopyableAreaSuccess'),
                       this.getId('success'),
                       this.successText
                       );
    },

    getClipStr: function() {
        return 'ui.CopyableArea.container.' + this.id + '.getCodeAndCopy';
    },

    getCodeAndCopy: function() {
        var me = this;

        me.getSuccess().style.left = me.textInput ? '470px' : '810px';
        me.textInput && (me.getSuccess().style.marginBottom = '-5px');
        setTimeout(function() {
            me.getSuccess().style.left = '-10000px';
        }, 3000);

        baidu.g(me.getId('text')).select();
        return baidu.g(me.getId('text')).value;
    },

    /**
     * 获取success提示的dom
     *
     * @return {HTMLElement}
     */
    getSuccess: function() {
        return baidu.g(this.getId('success'));
    },

    /**
     * 释放控件
     *
     * @private
     */
    dispose: function() {
        delete ui.CopyableArea.container[this.id];
        ui.CopyableArea.superClass.dispose.call(this);
    }
};

ui.CopyableArea.container = {};
baidu.inherits(ui.CopyableArea, ui.Control);
