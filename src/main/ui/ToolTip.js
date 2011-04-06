/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/ToolTip.js
 * desc:    提示信息控件
 * author:  zhaolei,erik
 * date:    $Date$
 */

goog.require('ui.Control');
goog.require('er.template');

goog.provide('ui.ToolTip');


/**
 * 声明ToolTip组件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.ToolTip = function(options) {
    ui.Control.call(this, options);
    this.type = 'tooltip';

    /**
     * @type {string}
     */
    this.tipName;
};
baidu.inherits(ui.ToolTip, ui.Control);

/**
 * @inheritDoc
 */
ui.ToolTip.prototype.render = function(main) {
    if (!this.isRender) {
        ui.ToolTip.superClass.render.call(this, main);
        var me = this;
        main = me.main;

        main.setAttribute('tooltip', this.tipName);
        main.onmouseover = this.mouseOverHandler;
        main.onmouseout = this.mouseOutHandler;
        this.isRender = true;
    }
};

/**
 * @this {Element}
 */
ui.ToolTip.prototype.mouseOverHandler = function() {
    ui.ToolTip.show(this, this.getAttribute('tooltip'));
};

/**
 * @this {Element}
 */
ui.ToolTip.prototype.mouseOutHandler = function() {
    ui.ToolTip.hide();
};

/**
 * @inheritDoc
 */
ui.ToolTip.prototype.dispose = function() {
    if (this.main) {
        var main = this.main;
        main.onmouseover = null;
        main.onmouseout = null;
        this.main = null;
    }
};

/**
 * @param {string} name
 */
ui.ToolTip.getEventString = function(name) {
    return 'onmouseover="ui.ToolTip.show(this, \'' + name + '\')"'
            + ' onmouseout="ui.ToolTip.hide()"'
            + ' tooltip="' + name + '"';
};

/**
 * @private
 */
ui.ToolTip.preventHide = function() {
    if (ui.ToolTip.hideTimeout) {
        clearTimeout(ui.ToolTip.hideTimeout);
        ui.ToolTip.hideTimeout = 0;
    }
};

/**
 * @param {Element} entrance 需要显示的元素.
 * @param {{title:string,tip:string}|string} tipName 显示的内容.
 */
ui.ToolTip.show = function(entrance, tipName) {
    if (!tipName || !entrance) {
        return;
    }

    if (ui.ToolTip.isShow) {
        ui.ToolTip.preventHide();
    }

    var pos = baidu.dom.getPosition(entrance),
        layer = baidu.g('ToolTipLayer'),
        mainLeft = pos.left,
        mainTop = pos.top,
        mainWidth = entrance.offsetWidth,
        bodyWidth = document.body.offsetWidth,
        layerWidth = layer.offsetWidth,
        offsetX = 5,
        offsetY = -10,
        layerLeft = '',
        title,
        tip;

    if ('object' == typeof tipName) {
        title = tipName.title;
        tip = tipName.tip;
    } else {
        title = er.template.get(tipName + 'Title');
        tip = er.template.get(tipName);
    }
    ui.ToolTip.isShow = true;

    if (layerWidth + mainLeft < bodyWidth) {
        layerLeft = mainLeft + mainWidth + offsetX + 'px';
    } else {
        layerLeft = mainLeft - layerWidth - offsetX + 'px';
    }

    layer.style.left = layerLeft;
    layer.style.top = mainTop + offsetY + 'px';

    baidu.g('ToolTipLayerTitle').innerHTML = title;
    baidu.g('ToolTipLayerBody').innerHTML = tip;
};

/**
 * @type {number}
 */
ui.ToolTip.hideTimeout = 0;

/**
 * @type {boolean}
 */
ui.ToolTip.isShow = false;

/**
 * 隐藏ToolTip
 */
ui.ToolTip.hide = function() {
    ui.ToolTip.hideTimeout = setTimeout(function() {
        var layer = baidu.g('ToolTipLayer');
        layer.style.left = '-10000px';
        layer.style.top = '-10000px';
        ui.ToolTip.isShow = false;
    }, 200);
};

/**
 * @private
 */
ui.ToolTip.init = function() {
    var layer = document.createElement('dl'),
        title = document.createElement('dt'),
        body = document.createElement('dd');

    layer.id = 'ToolTipLayer';
    layer.className = 'ui-tooltip-layer';

    title.id = 'ToolTipLayerTitle';
    layer.appendChild(title);

    body.id = 'ToolTipLayerBody';
    layer.appendChild(body);

    layer.onmouseover = ui.ToolTip.preventHide;
    layer.onmouseout = ui.ToolTip.hide;
    document.body.appendChild(layer);
};
baidu.on(window, 'load', ui.ToolTip.init);
