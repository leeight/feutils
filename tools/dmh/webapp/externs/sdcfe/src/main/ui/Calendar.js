/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Calendar.js
 * desc:    单日期选择器
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

goog.require('ui.InputControl');
goog.require('ui.MonthView');

goog.provide('ui.Calendar');

/**
 * 单日期选择器
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 * 参数说明：
 * value：date对象
 * defalutTime是默认值，为date对象，支持日历控件默认为空
 * defaultHour默认小时 *.
 */
ui.Calendar = function(options) {
    ui.InputControl.call(this, options);

    // 类型声明，用于生成控件子dom的id和class
    this.type = 'cal';

    /**
     * 日期选择的处理函数
     * @private
     * @type {?function(Date)}
     */
    this.selectHandler = null;
};

/**
 * @lends {ui.Calendar.prototype}
 */
ui.Calendar.prototype = {
    /**
     * 主显示区域的html
     * @private
     */
    tplMain: '<input type="text" id="{0}" class="{1}" value="{3}"><div class="{2}"></div>',

    /**
     * 日历选择浮动层月份区域的html模板
     * @private
     */
    tplMonth: '<div id="{0}" class="{1}"><div class="{2}"><span class="{3}" onclick="{6}"></span><span class="{5}" id="{7}">{4}</span></div><div></div></div>',

    /**
     * 设置当前显示的起始月份日期
     * @param {Date} view 当前显示的月份日期.
     */
    setView: function(view) {
        var me = this;

        // 记录当前显示的起始日期
        me.month = view.getMonth();
        me.year = view.getFullYear();

        // 重新绘制日历小部件
        me.renderMonthView();

        // 更新当前显示的年份和月份信息
        baidu.g(me.getId('mInfoLeft')).innerHTML = me.getMonthInfo(me.month);
        baidu.g(me.getId('mInfoRight')).innerHTML = me.getMonthInfo(me.month + 1);
    },

    /**
     * 获取view中日期被选取的事件handler
     * @private
     * @return {function(Date)}
     */
    getSelectHandler: function() {
        var me = this;

        return function(date) {
            me.setDate(date);

            // 隐藏提示信息。
            me.validate();
        };
    },

    /**
     * 设置日期
     *
     * @private
     */
    setDate: function(date, keepLayer) {
        var me = this,
            format = 'yyyy-MM-dd',
            oHour;
        if (!date) return;
        // 不能直接等于date，有可能这里已经有小时了

        if (me.value) oHour = me.value.getHours();
        me.value = date;
        if (oHour) me.value.setHours(oHour);
        var input = baidu.g(me.getId('input'));

        // 更新输入框中的选中日期
        input.value = baidu.date.format(date, format);

        // 避免绘制的递归，直接调用日历部件的私有绘制方法
        me.getChild('left').paintSelected(date);
        me.getChild('right').paintSelected(date);

        //调用外部事件
        me.onselect(date);

        // 隐藏浮动层
        !keepLayer && me.hideLayer();
    },

    onselect: new Function(),

    bindModel: function(model) {
        ui.Calendar.superClass.bindModel.call(this, model);
    },

    /**
     * @inheritDoc
     */
    render: function(opt_main) {
        // 初始化显示日期的年月
        var now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // 加这个标识符，是为了区分，到底是默认值还是传过来的（比如修改），否则小时数有可能都是0
        this.isDefaultValue = false;
        if (!this.value)
            this.isDefaultValue = true;

        if (this.isDefaultValue) {
            if (this.defaultTime === '') {
                this.value = null;
            } else {
                this.value = this.defaultTime || new Date(now.getTime());
            }
        }

        this.month = parseInt(this.month, 10) || now.getMonth();
        this.year = parseInt(this.year, 10) || now.getFullYear();

        var me = this,
            main = opt_main || me.main;
        if (main.tagName != 'DIV') {
            return;
        }

        // 由于hour值有可能改变到day，所以放在这里
        main.innerHTML = me.getMainHtml();

        me.renderLayer();

        ui.Calendar.superClass.render.call(this, main);

        me.initBehavior();
    },

    /**
     * 绘制浮动层
     *
     * @private
     */
    renderLayer: function() {
        var me = this,
            layer = document.createElement('div'),
            layerCntr = document.createElement('div');


        // 初始化浮动层div属性
        layer.className = me.getClass('layer');
        layer.id = me.getId('layer');
        layer.style.left = '-10000px';
        layer.style.top = '-10000px';
        layer.setAttribute('control', me.id);

        if (me.layerZIndex) {
            layer.style.zIndex = me.layerZIndex;
        }

        // 恶，多加一层为了支持设计稿中多出来的那个白色框框
        layerCntr.className = me.getClass('layercntr');
        layer.appendChild(layerCntr);

        // 初始化浮动层的html
        layerCntr.innerHTML =
            // 左边月份区域html
            baidu.format(me.tplMonth,
                            me.getId('layerLeft'),
                            me.getClass('mleft'),
                            me.getClass('mhead-left'),
                            me.getClass('mprev'),
                            me.getMonthInfo(me.month),
                            me.getClass('minfo-left'),
                            me.getStrCall('prevMonth'),
                            me.getId('mInfoLeft')) +
            // 右边月份区域html
            baidu.format(me.tplMonth,
                            me.getId('layerRight'),
                            me.getClass('mright'),
                            me.getClass('mhead-right'),
                            me.getClass('mnext'),
                            me.getMonthInfo(me.month + 1),
                            me.getClass('minfo-right'),
                            me.getStrCall('nextMonth'),
                            me.getId('mInfoRight'));


        // 将浮动层+到页面中
        document.body.appendChild(layer);

        // 创建日历部件的控件对象
        var leftMonthView =
                ui.util.create('MonthView',
                    {'id': 'left', value: me.value},
                    baidu.g(me.getId('layerLeft')).lastChild),
            rightMonthView =
                ui.util.create('MonthView',
                    {'id': 'right', value: me.value},
                    baidu.g(me.getId('layerRight')).lastChild);

        me.addChild(leftMonthView);
        me.addChild(rightMonthView);

        // 绘制浮动层内的日历部件
        me.renderMonthView();

        // 挂载浮动层的全局点击关闭
        me.layerController = me.getLayerController();
        baidu.on(document, 'click', me.layerController);
    },

    /**
     * @inheritDoc
     */
    initBehavior: function() {
        var me = this,
            left = me.getChild('left'),
            right = me.getChild('right'),
            input = baidu.g(me.getId('input'));

        this.selectHandler = this.getSelectHandler();
        if (left) {
            left.onselect = this.selectHandler;
        }

        if (right) {
            right.onselect = this.selectHandler;
        }

        if (input) {
            input.onblur = baidu.fn.bind(me.convertInputToDate, me);
        }
    },

    convertInputToDate: function() {
        if (!this.validate()) {
            return;
        }

        var text = baidu.g(this.getId('input')).value,
            date = baidu.date.parse(text);
        this.setDate(date, true);
    },

    /**
     * 获取浮动层关闭器
     *
     * @private
     * @return {Function}
     */
    getLayerController: function() {
        var me = this;
        return function(e) {
            e = e || window.event;
            var tar = e.target || e.srcElement;

            while (tar && tar.nodeType === 1) {
                if (tar.getAttribute('control') == me.id) {
                    if (tar.id != me.getId('layer')) {
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
     * 显示|隐藏 浮动层
     *
     * @private
     */
    toggleLayer: function() {
        var me = this;
        if (baidu.g(me.getId('layer')).style.left != '-10000px') {
            me.hideLayer();
        } else {
            me.showLayer();
        }
    },

    /**
     * 隐藏浮动层
     *
     * @private
     */
    hideLayer: function() {
        baidu.g(this.getId('layer')).style.left = '-10000px';
        this.removeState('active');
    },

    /**
     * 显示浮动层
     *
     * @private
     */
    showLayer: function() {
        var me = this,
            main = baidu.g(me.getId()),
            pos = baidu.dom.getPosition(main),
            pageWidth = baidu.page.getWidth(),
            layer = baidu.g(me.getId('layer')),
            layerLeft;

        if (pageWidth < (pos.left + layer.offsetWidth)) {
            layerLeft = pos.left + main.offsetWidth - layer.offsetWidth + 'px';
        } else {
            layerLeft = pos.left + 'px';
        }
        layer.style.left = layerLeft;
        layer.style.top = pos.top + main.offsetHeight + 'px';
        this.setState('active');
    },

    /**
     * 绘制浮动层内的日历部件
     *
     * @private
     */
    renderMonthView: function() {
        var me = this,
            left = me.getChild('left'),
            right = me.getChild('right');

        // 设置左右日历部件的显示
        left.setView(new Date(me.year, me.month, 1));
        right.setView(new Date(me.year, me.month + 1, 1));

        // 重新绘制日历部件
        left.render();
        right.render();
    },

    /**
     * 获取控件的html
     *
     * @private
     * @return {string}
     */
    getMainHtml: function() {
        var me = this,
            input = 'input',
            date = me.getValue();

        // FIXME BUG
        return baidu.format(me.tplMain,
                            me.getId(input),
                            me.getClass(input),
                            me.getClass('point'),
                            date ? baidu.date.format(date, 'yyyy-MM-dd') : '');
    },

    /**
     * 当前显示的日历区域转到下一个月
     *
     * @private
     */
    nextMonth: function() {
        var me = this;
        me.setView(new Date(me.year, me.month + 1, 1));
    },

    /**
     * 当前显示的日历区域转到上一个月
     *
     * @private
     */
    prevMonth: function() {
        var me = this;
        me.setView(new Date(me.year, me.month - 1, 1));
    },

    /**
     * 当前显示的日历区域转到下一年
     *
     * @private
     */
    nextYear: function() {
        var me = this;
        me.setView(new Date(me.year + 1, me.month, 1));
    },

    /**
     * 当前显示的日历区域转到上一年
     *
     * @private
     */
    prevYear: function() {
        var me = this;
        me.setView(new Date(me.year - 1, me.month, 1));
    },

    /**
     * 获取显示的年份文字
     *
     * @private
     * @return {string}
     */
    getYearInfo: function() {
        return this.year + ' 年';
    },

    /**
     * 获取显示的月份文字
     *
     * @private
     * @param {number} month 要显示的月份.
     * @return {string}
     */
    getMonthInfo: function(month) {
        var m = 1 + month;
        return m > 12 ? [this.year + 1, '年', m - 12, '月'].join('') : [this.year, '年', m, '月'].join('');
    },

    /**
     * 获取当前选取的日期
     * @return {string}
     */
    getValue: function(raw) {
        if (raw) {
            return baidu.g(this.getId('input')).value;
        }
        return this.value || null;
    },

    /**
     * 设置当前选取的日期
     * @param {Date|string} date 选取的日期.
     */
    setValue: function(date) {
        // TODO add converter
        if (baidu.lang.isString(date)) {
            date = dn.util.parseToDate(date);
        }

        this.value = date;
        if (this.isRendered()) {
            this.getChild('left').select(date);
            this.getChild('right').select(date);
        }
    },

    /**
     * 获取参数值
     * @return {?string}
     */
    getParamValue: function() {
        // FIXME 为什么必须要保证这两个条件都成立呢？
        if (this.value && baidu.trim(baidu.g(this.getId('input')).value)) {
            return baidu.date.format(this.value, this.paramFormat) || null;
        } else {
            return '';
        }
    },

    /**
     * 释放控件
     *
     * @protected
     */
    dispose: function() {
        var input = baidu.g(this.getId('input'));
        if (input) {
            input.onblur = null;
        }
        document.body.removeChild(baidu.g(this.getId('layer')));
        baidu.un(document, 'click', this.layerController);
        this.layerController = null;
        this.selectHandler = null;

        ui.Calendar.superClass.dispose.call(this);
    }
};
baidu.inherits(ui.Calendar, ui.InputControl);
