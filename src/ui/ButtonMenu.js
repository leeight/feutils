/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/ButtonMenu.js
 * desc:    按钮目录控件
 * author:  zhaolei,erik
 * date:    $Date$
 */

/**
 * 按钮目录控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.ButtonMenu = function(options) {
    ui.Control.call(this, options);

    this.type = 'buttonmenu';
};

ui.ButtonMenu.prototype = {
    tpl: '<div id="{2}" class="{1}">{0}</div><div class="{3}"></div>',

    /** @inheritDoc */
    render: function(opt_main) {
        var me = this,
            main = opt_main || me.main;

        ui.ButtonMenu.superClass.render.call(me, main);
        if (!me.isRender) {
            me.content = me.main.innerHTML;

            me.main.innerHTML = me.getMainHtml();
            me.initBehavior();
            me.initLayer();

            me.isRender = true;
        }
    },

    /**
     * 获取主区域的html
     *
     * @private
     * @return {string}
     */
    getMainHtml: function() {
        var me = this;

        return baidu.format(
            me.tpl,
            me.content || 'buttonmenu',
            me.getClass('label'),
            me.getId('label'),
            me.getClass('icon')
        );
    },

    /**
     * 初始化控件行为
     *
     * @private
     */
    initBehavior: function() {
        var me = this;

        me.main.onclick = me.getMainClickHandler();
        me.docClick = me.getDocClickHandler();
        baidu.on(document, 'click', me.docClick);
    },

    /**
     * 初始化浮动层
     *
     * @private
     */
    initLayer: function() {
        var me = this,
            id = me.id,
            layer = document.createElement('div'),
            list = me.datasource,
            len = (list instanceof Array) && list.length,
            html = [],
            strRef = me.getStrRef(),
            itemTpl = '<li control="{0}" value="{2}" index="{3}" onmouseover="{4}" onmouseout="{5}">{1}</li>',
            i,
            item;

        layer.id = me.getId('layer');
        layer.className = me.getClass('layer');
        layer.setAttribute('control', id);
        layer.style.width = (me.layerWidth || (me.main.offsetWidth - 2)) + 'px';

        if (len) {
            html.push('<ul>');
            for (i = 0; i < len; i++) {
                item = list[i];
                html.push(
                    baidu.format(
                        itemTpl,
                        id,
                        item.text,
                        item.value,
                        i,
                        strRef + '.itemOver(this)',
                        strRef + '.itemOut(this)'
                    ));
            }
            html.push('</ul>');
        }

        layer.innerHTML = html.join('');
        document.body.appendChild(layer);
    },

    /*
     * @itemValue itemValue
     * @hidden {Boolean} true to hide ,false to display
     *
     */
    hideItem: function(itemValue,hidden) {
        var layerId = this.getId('layer'),
            layerEl = baidu.g(layerId),
            items = document.getElementsByTagName('li');

        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            if (item.getAttribute('index') == itemValue) {
                hidden ? baidu.hide(item) : baidu.show(item);
            }
        }
    },
    itemOver: function(dom) {
        baidu.addClass(dom, 'item-hover');
    },

    itemOut: function(dom) {
        baidu.removeClass(dom, 'item-hover');
    },

    /**
     * 显示浮动层
     *
     * @private
     */
    showLayer: function() {
        var layer = baidu.g(this.getId('layer')),
            mainPos = baidu.dom.getPosition(this.main);

        this.setState('active');
        layer.style.left = mainPos.left - 5 + 'px';
        layer.style.top = mainPos.top + 21 + 'px';
    },

    /**
     * 隐藏浮动层
     *
     * @private
     */
    hideLayer: function() {
        var layerId = this.getId('layer');

        this.removeState('active');
        baidu.g(layerId).style.left = '-10000px';
    },

    /**
     * 显示/隐藏 浮动层
     *
     * @private
     */
    toggleLayer: function() {
        if (this.getState('active')) {
            this.hideLayer();
        } else {
            this.showLayer();
        }
    },

    /**
     * 获取主元素点击的处理函数
     *
     * @private
     * @return {Function}
     */
    getMainClickHandler: function() {
        var me = this;
        return function() {
            if (me.validate) {
                if (me.validate()) {
                    me.toggleLayer();
                }
            } else {
                me.toggleLayer();
            }
        };
    },

    /**
     * 获取document点击的处理函数
     *
     * @private
     * @return {Function}
     */
    getDocClickHandler: function() {
        var me = this;
        return function(e) {
            e = e || window.event;
            var tar = e.target || e.srcElement,
                item,
                value;

            // 向上查找元素
            while (tar && tar.nodeType == 1) {
                if (tar == me.main) {
                    return;
                } else if (tar.getAttribute('control') == me.id) {
                    // 触发onselect
                    if (tar.tagName == 'LI') {
                        value = tar.getAttribute('value');
                        item = me.datasource[parseInt(tar.getAttribute('index'), 10)];
                        me.onselect(value, item);
                    }

                    break;
                }

                tar = tar.parentNode;
            }

            // 隐藏浮动层
            me.hideLayer();
        };
    },

    /**
     * 事件声明，容错
     *
     * @private
     */
    onselect: new Function(),

    /**
     * 释放控件
     *
     * @public
     */
    dispose: function() {
        this.main.onclick = null;
        baidu.un(document, 'click', this.docClick);
        baidu.dom.remove(this.getId('layer'));

        ui.ButtonMenu.superClass.dispose.call(this);
    }
};
baidu.inherits(ui.ButtonMenu, ui.Control);
