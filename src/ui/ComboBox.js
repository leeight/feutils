/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/ComboBox.js
 * desc:    组合框
 * author:  zhaolei,erik
 * date:    $Date$
 */

goog.require('ui.InputControl');

goog.provide('ui.ComboBox');

/**
 * 组合框控件
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.ComboBox = function(options) {
    ui.InputControl.call(this, options);

    this.type = 'combobox';
    this.form = 1;

    this.emptyLabel = '<div class="' + this.getClass('cur-def') + '">请选择</div>';
    this.offsetSize = '-10000px';

    this.options = this.datasource || [];
    this.index = -1;
    this.maxItem = 10;

    /**
     * @private
     * @type {Array.<*>}
     */
    this.datasource;

    /**
     * @private
     * @type {string}
     */
    this.disabledItemTipId;
};

ui.ComboBox.prototype = {
    // 主体部分模板
    tplMain: '<div id="{0}" class="{1}" value="" style="width:{4}px"><nobr>{2}</nobr></div><div class="{3}"></div>',

    onselect: new Function(),

    /**
     * 获取主体部分HTML
     *
     * @return {string}
     */
    getMainHtml: function() {
        var me = this;

        var textWidth = me.width - 20;
        if(this.skin == 'select-menu') {
           textWidth -= 10;
        } 
        
        return baidu.format(me.tplMain,
                            me.getId('cur'),
                            me.getClass('cur'),
                            me.emptyLabel,
                            me.getClass('btn'),
                            textWidth);
    },

    bindModel: function(model) {
        ui.ComboBox.superClass.bindModel.call(this, model);

        this.options = this.datasource || [];
    },

    /** @inheritDoc */
    render: function(opt_main) {
        var me = this,
            main = opt_main || me.main;

        me.main.style.width = me.width + 'px';
        me.main.innerHTML = me.getMainHtml();

        me.renderLayer();
        me.setReadOnly(!!me.readOnly);

        if (baidu.lang.hasValue(me.value)) {
            me.setValue(me.value);
        } else if (me.defaultFirst) {
            me.selectByIndex(0);
        }

        ui.ComboBox.superClass.render.call(this, main);
    },

    /**
     * 绘制下拉列表
     * @private
     */
    renderLayer: function() {
        var me = this,
            layerId = me.getId('layer'),
            layer,
            len = me.options.length,
            maxItem = me.maxItem,
            itemHeight;

        layer = baidu.g(layerId);
        if (!layer) {
            layer = document.createElement('div');
            layer.id = me.getId('layer');
            layer.className = me.getClass('layer');
            layer.style.top = me.offsetSize;
            layer.style.left = me.offsetSize;
            layer.style.width = me.width + 'px';
            layer.setAttribute('control', me.id);
            document.body.appendChild(layer);

            // 挂载全局事件管理器
            me.layerController = me.getLayerController();
            baidu.on(document, 'click', me.layerController);
        }

        layer.innerHTML = me.getLayerHtml();

        if (len > maxItem) {
            itemHeight = baidu.dom.children(layer)[0].offsetHeight;
            layer.style.height = maxItem * (itemHeight + 1) + 'px';
        }


        // TODO:页面resize的时候需要调整浮动层的位置
    },

    // Layer中每个选项的模板
    tplItem: '<div id="{0}" {9} class="{1}" index="{2}" value="{3}" dis="{4}" cmd="select" onmouseover="{6}" onmouseout="{7}" style="width:{10}px">{8}<nobr>{5}</nobr></div>',
    // Item中图标层的模板
    tplIcon: '<span class="{0}"></span>',

    /**
     * 获取下拉列表层的HTML
     *
     * @return {string}
     */
    getLayerHtml: function() {
        var me = this,
            options = me.options,
            i = 0,
            len = options.length,
            html = [],
            basicClass = me.getClass('item'),
            itemClass,
            dis,
            item,
            strRef = me.getStrRef(),
            iconClass,
            iconHtml,
            titleTip;

        for (; i < len; i++) {
            itemClass = basicClass;
            dis = 0;
            item = options[i];
            iconHtml = '';

            // 初始化icon的HTML
            if (item.icon) {
                iconClass = me.getClass('icon-' + item.icon);
                iconHtml = baidu.format(me.tplIcon, iconClass);
            }

            // 初始化基础样式
            if (item.style) {
                itemClass += ' ' + basicClass + '-' + item.style;
            }

            // 初始化不可选中的项
            if (item.disabled) {
                dis = 1;
                itemClass += ' ' + basicClass + '-disabled';
            }

            // 初始化选中样式
            if (item.value == me.value) {
                itemClass += ' ' + me.getClass('item-selected');
            }
            if (me.titleTip) {
                titleTip = 'title="' + item.text + iconHtml + '"';
            }

            var itemWidth = me.width;

            if (this.skin == 'select-menu') {
                itemWidth =  itemWidth - 16;
            } else if (this.skin == 'select-button') {
                itemWidth =  itemWidth - 10;
            }

            html.push (
                baidu.format(me.tplItem,
                    me.getId('item') + i,
                    itemClass,
                    i,
                    item.value,
                    dis,
                    item.text,
                    strRef + '.itemOverHandler(this)',
                    strRef + '.itemOutHandler(this)',
                    iconHtml,
                    titleTip,
                    itemWidth
                    ));
        }

        return html.join('');
    },

    /**
     * 捕获列表的事件
     *
     */
    getLayerController: function() {
        var me = this;

        return function(e) {
            if (me.getState('disabled')) {
                return;
            }

            e = e || window.event;
            var tar = e.target || e.srcElement;

            while (tar && tar.nodeType === 1) {
                var val = tar.getAttribute('control'),
                    index = tar.getAttribute('index'),
                    tarId = me.getId('item') + index;

                if (tar.getAttribute('cmd') == 'select' && tarId == tar.id) {
                    if (tar.getAttribute('dis') == 1) {
                        if (me.disabledItemTipId) {
                            baidu.show(me.disabledItemTipId);
                            window.setTimeout(function() {baidu.hide(me.disabledItemTipId);},3000);
                        }
                    } else {
                        me.hideLayer();
                        me.selectByIndex(parseInt(index, 10), true);
                    }
                    return;
                } else if (val == me.id) {
                    if (!me.readOnly && tar.id == me.getId()) {
                        me.toggleLayer();
                    }
                    return;
                }
                tar = tar.parentNode;
            }

            me.hideLayer();
        };
    },

    /**
     * 显示层
     *
     */
    showLayer: function() {
        var me = this,
            main = me.main,
            mainPos = baidu.dom.getPosition(main),
            layer = me.getLayer(),
            pageVHeight = baidu.page.getViewHeight(),
            layerVHeight = mainPos.top
                         + main.offsetHeight
                         + layer.offsetHeight
                         - baidu.page.getScrollTop(),
            layerTop;
        if (pageVHeight > layerVHeight) {
            layerTop = mainPos.top + main.offsetHeight;
        } else {
            layerTop = mainPos.top - layer.offsetHeight;
        }

        if (layer) {
          layer.style.top = layerTop + 'px';
          layer.style.left = mainPos.left + 'px';
        }
        me.setState('active');
    },

    /**
     * 隐藏层
     *
     */
    hideLayer: function() {
        var me = this,
            layer = me.getLayer();
        if (layer) {
          layer.style.left = me.offsetSize;
          layer.style.top = me.offsetSize;
        }
        me.removeState('active');
    },

    /**
     * 开|关 层的展示
     *
     */
    toggleLayer: function() {
        var me = this;
        if (me.getLayer().style.left != me.offsetSize) {
            me.hideLayer();
        } else {
            me.showLayer();
        }
    },

    /**
     * 获取list部分的DOM元素
     *
     * @return {HTMLElement}
     */
    getLayer: function() {
        return baidu.G(this.getId('layer'));
    },

    /**
     * 获取ComboBox当前选项部分的DOM元素
     *
     * @return {HTMLElement}
     */
    getCur: function() {
        return baidu.G(this.getId('cur'));
    },

    /**
     * 获取当前ComboBox选中的值
     *
     * @return {string}
     */
    getValue: function() {
        // FIX #854
        if (null == this.main) {
            return '';
        }
        return this.value || '';
    },

    /**
     * 设置数据来源
     *
     * @param {Array} datasource 列表数据源.
     */
    setDataSource: function(datasource) {
        this.options = datasource || this.options;
    },

    /**
     * 获取数据源
     *
     * @return {Array}
     */
    getDataSource: function() {
        return this.options || [];
    },

    /**
     * 根据值选择选项
     *
     * @param {string} value 值.
     */
    setValue: function(value) {
        var me = this,
            layer = me.getLayer(),
            items = layer.getElementsByTagName('div'),
            len = items.length,
            i = 0,
            item;

        for (i = 0, len = items.length; i < len; i++) {
            item = items[i].getAttribute('value');
            if (item == value) {
                me.selectByIndex(i);
                return;
            }
        }

        me.value = '';
        me.index = -1;
        me.selectByIndex(-1);
    },

    /**
     * 根据索引选择选项
     *
     * @param {number} index 选项的索引序号.
     * @param {boolean} isDispatch 是否发送事件.
     */
    selectByIndex: function(index, isDispatch) {
        var selected = this.options[index],
            value;

        if (!selected) {
            value = null;
        } else {
            value = selected.value;
        }


        this.index = index;
        this.value = value;

        if (isDispatch === true && this.onselect(value, selected) === false) {
            return;
        }

        this.repaint();
    },

    /**
     * 重绘控件
     *
     */
    repaint: function() {
        var selected = this.options[this.index],
            word = selected ? selected.text : this.emptyLabel,
            el = this.getCur();

        if (el) {
            // 有的时候，选择了一个内容，页面就刷新了，此时就
            // 无法获取到el元素了.
            el.title = baidu.string.stripTags(word);
            el.innerHTML = '<nobr>' + word + '</nobr>';
        }

        this.repaintLayer();
    },

    /**
     * 重绘选项列表层
     *
     */
    repaintLayer: function() {
        var me = this,
            index = me.index,
            layer = me.getLayer(),
            first = null,
            selectedClass = me.getClass('item-selected');

        if (layer) {
            first = layer.firstChild;
            while (first) {
                if (first.getAttribute('index') == index) {
                    baidu.addClass(first, selectedClass);
                    //me.getCur().innerHTML = first.innerHTML;
                } else {
                    baidu.removeClass(first, selectedClass);
                }
                first = first.nextSibling;
            }
        }
    },

    /**
     * 选项移上事件
     *
     * @param {HTMLElement} item 选项.
     */
    itemOverHandler: function(item) {
        if (item.getAttribute('dis') == 1) {
            return;
        }

        var index = item.getAttribute('index');
        baidu.addClass(this.getId('item') + index, this.getClass('item') + '-hover');
    },

    /**
     * 选项移开事件
     *
     * @param {HTMLElement} item 选项.
     */
    itemOutHandler: function(item) {
        var index = item.getAttribute('index');
        baidu.removeClass(this.getId('item') + index, this.getClass('item') + '-hover');
    },

    /**
     * 设置为disabled
     *
     * @public
     */
    disable: function() {
        ui.ComboBox.superClass.disable.call(this);
        this.hideLayer();
    },

    /**
     * 销毁控件
     *
     */
    dispose: function() {
        var me = this;
        me.layerController && baidu.un(document, 'click', me.layerController);
        document.body.removeChild(me.getLayer());
        ui.ComboBox.superClass.dispose.call(me);
    }
};
baidu.inherits(ui.ComboBox, ui.InputControl);
