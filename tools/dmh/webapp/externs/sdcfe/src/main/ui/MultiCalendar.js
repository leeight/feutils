/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/MultiCalendar.js
 * desc:    多日期选择器
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 *
 * cssList:
 *      'over',
 *      'show',
 *      'point',
 *      'layer',
 *      'body',
 *      'foot',
 *      'begin',
 *      'end',
 *      'input',
 *      'year',
 *      'month',
 *      'itemshow',
 *      'prev',
 *      'next',
 *      'label',
 *      'prev-td',
 *      'next-td',
 *      'yinfo',
 *      'mactive'
 *
 * idList:
 *      'show',
 *      'layer',
 *      'foot',
 *      'begin',
 *      'end',
 *      'beginInput',
 *      'endInput',
 *      'beginYinfo',
 *      'endYinfo',
 *      'beginMonth',
 *      'endMonth',
 *      'beginCal',
 *      'endCal',
 *      'mPrefix'
 */

goog.require('baidu');
goog.require('ui.Button');
goog.require('ui.InputControl');
goog.require('ui.MonthView');

goog.provide('ui.MultiCalendar');

/**
 * 多日期选择器
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.MultiCalendar = function(options) {
    ui.InputControl.call(this, options);

    // 类型声明，用于生成控件子dom的id和class
    this.type = 'mcal';


    // 创建子控件对象：日历部件与按钮
    var id = this.id,
        now = new Date();


    this.controlMap = {
        'begin' : id + 'begin',
        'end' : id + 'end',
        'ok' : id + 'ok',
        'cancel': id + 'cancel'
    };




    // 声明按钮文字
    this.okStr = '确定';
    this.cancelStr = '取消';

    // 初始化当前日期
    this.value = this.value || {
        begin: now,
        end: now
    };

    // 初始化显示的日期
    this.view = {
        begin: new Date(this.value.begin),
        end: new Date(this.value.end)
    };

    // 声明日期格式
    this.dateFormat = 'yyyy-MM-dd';

    // 声明浮动层侧边的说明
    this.beginSideTitle = '开始日期';
    this.endSideTitle = '结束日期';

    // 偏向大小
    this.offsetSize = '-10000px';
};

ui.MultiCalendar.prototype = {
    /**
     * 主显示区域的模板
     * @private
     */
    tplMain: '<span id="{0}" class="{1}">{2}</span><div class="{3}"></div>',

    /**
     * 浮动层html模板
     * @private
     */
    tplLayer: '<div class="{0}">{1}{2}</div><div id="{3}" class="{4}"></div>',

    /**
     * 浮动层单侧html模板
     * @private
     */
    tplSide: '<div class="{0}"><div class="{2}">{1}</div><div class="{3}">{4}</div><div id="{5}" class="{6}">{7}</div><div id="{8}"></div></div>',

    /**
     * 浮动层月份单元的html模板
     * @private
     */
    tplMonth: '<td class="{1}" id="{2}" month="{3}" onclick="{4}">{0}</td>',

    /**
     * 浮动层侧边头部的html模板
     * @private
     */
    tplSideHead: '<span class="{4}">{0}</span><input type="text" id="{1}" value="{2}" class="{3}">',

    /**
     * 浮动层年份单元的html模板
     * @private
     */
    tplYear: '<span class="{1}" id="{2}">{0}</span>',

    /**
     * 获取取消按钮的点击handler
     *
     * @private
     * @return {Function}
     */
    getCancelHandler: function() {
        var me = this;
        return function() {
            me.hideLayer();
        };
    },

    /**
     * 获取确定按钮的点击handler
     *
     * @private
     * @return {Function}
     */
    getOkHandler: function() {
        var me = this,
            parse = baidu.date.parse;

        function getValue(type) {
            return parse(me.getInput(type).value) ||
                   me.c(me.controlMap[type]).getValue();
        }

        return function() {
            var begin = getValue('begin'),
                end = getValue('end'),
                dvalue = end - begin,
                value;

            if (dvalue > 0) {
                value = {
                    'begin': begin,
                    'end': end
                };
            } else {
                value = {
                    'begin': end,
                    'end': begin
                };
            }

            if (me.onselect(value) !== false) {
                me.value = value;
                me.repaintMain();
                me.hideLayer();
            }
        };
    },

    onselect: function() {},

    /**
     * 获取日历选择的事件handler
     *
     * @private
     * @return {Function}
     */
    getSelectHandler: function(type) {
        var me = this;
        return function(date) {
            me.tempValue[type] = date;
            me.getInput(type).value = baidu.date.format(date, me.dateFormat);
        };
    },

    /**
     * 重新绘制main区域
     *
     * @private
     */
    repaintMain: function() {
        baidu.g(this.getId('show')).innerHTML = this.getValueText();
    },

    /**
     * 重新绘制浮动层侧边栏的显示内容
     *
     * @private
     * @param {string} type 侧边栏类型，begin|end.
     */
    repaintSide: function(type) {
        var me = this,
            viewDate = me.view[type],
            year = viewDate.getFullYear(),
            month = viewDate.getMonth(),
            value = me.value[type],
            cal = me.c(me.controlMap[type]),
            idPrefix = me.getId('mPrefix') + type,
            mactiveClass = me.getClass('mactive'),
            td;

        // 绘制输入框的内容
        me.getInput(type).value = baidu.date.format(value, me.dateFormat);

        // 绘制年份
        baidu.g(me.getId(type + 'Yinfo')).innerHTML = year + '年';

        // 绘制月份
        me.dealMonthItems(type, month);

        // 绘制日历部件
        cal.value = value;
        cal.setView(viewDate);
    },


    /**
     * 绘制控件
     *
     * @public
     * @param {HTMLElement} main 控件元素.
     */
    render: function(main) {
        var me = this;
        main = me.main;
        if (main && main.tagName !== 'DIV') {
            return;
        }

        //ui.Base.render.call(me, main, true);
        ui.MultiCalendar.superClass.render.call(me, main, true);
        me.main.innerHTML = me.getMainHtml();
        me.renderLayer();
    },

    /**
     * 获取控件的html
     *
     * @private
     * @return {string}
     */
    getMainHtml: function() {
        var me = this,
            show = 'show';
        return baidu.format(me.tplMain,
                            me.getId(show),
                            me.getClass(show),
                            me.getValueText(),
                            me.getClass('point'));
    },

    /**
     * 绘制浮动层
     *
     * @private
     */
    renderLayer: function() {
        var me = this, id = me.id,
            layerId = me.getId('layer'),
            layer = baidu.g(layerId),
            value = me.value,
            begin = value.begin,
            end = value.end,
            foot, btn,
            okButton = ui.util.create('Button', {'id': id + 'ok'}),
	        cancelButton = ui.util.create('Button', {'id': id + 'cancel'});

        cancelButton.onclick = this.getCancelHandler();
	    okButton.onclick = this.getOkHandler();


        if (layer) {
            me.repaintLayer();
            return;
        }
        // 初始化浮动层div属性
        layer = document.createElement('div');
        layer.className = me.getClass('layer');
        layer.id = layerId;
        layer.style.left = me.offsetSize;
        layer.style.top = me.offsetSize;
        layer.setAttribute('control', me.id);

        layer.innerHTML = baidu.format(me.tplLayer,
            me.getClass('body'),
            me.getLayerSideHtml('begin', begin),
            me.getLayerSideHtml('end', end),
            me.getId('foot'),
            me.getClass('foot'));

        // 将浮动层+到页面中
        document.body.appendChild(layer);

        // 绘制浮动层内的日历部件
        me.renderMonthView();

        // 绘制浮动层腿部的按钮
        foot = baidu.g(me.getId('foot'));
        function renderBtn(type) {
            btn = document.createElement('div');
            btn.innerHTML = me[type + 'Str'];
            foot.appendChild(btn);
            var ctrl = type == 'ok' ? okButton : cancelButton;
            ctrl.render(btn);
        }
        renderBtn('ok');
        renderBtn('cancel');

        this.addChild(okButton);
	    this.addChild(cancelButton);

        // 挂载浮动层的全局点击关闭
        me.layerController = me.getLayerController();
        baidu.on(document, 'click', me.layerController);
    },

    /**
     * 获取浮动层侧边栏的html
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {Date} date 要显示的日期.
     * @return {string}
     */
    getLayerSideHtml: function(type, date) {
        var me = this,
            month = date.getMonth(),
            year = date.getFullYear(),
            valueStr = baidu.date.format(date, me.dateFormat);

        return baidu.format(me.tplSide,
                            me.getClass(type),
                            me.getSideHeadHtml(type, valueStr),
                            me.getClass('itemshow'),
                            me.getClass('year'),
                            me.getYearHtml(type, year),
                            me.getId(type + 'Month'),
                            me.getClass('month'),
                            me.getMonthHtml(type, month),
                            me.getId(type + 'Cal'));
    },

    /**
     * 获取浮动层中月份显示区域的html
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {string} month 要显示的月份.
     * @return {string}
     */
    getMonthHtml: function(type, month) {
        var me = this,
            html = ['<table cellpadding="0" cellspacing="0" border="0"><tr>'],
            unit = 'month';


        html.push('<td class="' + me.getClass('prev-td') + '">'
                        + me.getArrowHtml(type, unit, 'prev') + '</td>',
                    me.dealMonthItems(type, month, true),
                    '<td class="' + me.getClass('next-td') + '">'
                        + me.getArrowHtml(type, unit, 'next') + '</td>',
                    '</tr></table>');
        return html.join('');
    },

    /**
     * 处理月份选择单元的显示
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {string} month 要显示的月份.
     * @param {string} re 需要返回html or 直接渲染.
     * @return {?string}
     */
    dealMonthItems: function(type, month, re) {
        var me = this,
            from = month - 2,
            mactiveClass = me.getClass('mactive'),
            i, current, show,
            idPrefix = me.getId('mPrefix') + type;
        if (from < 0) {
            from = 0;
        } else if (from > 7) {
            from = 7;
        }

        var html = [];
        for (i = 0; i < 5; i++) {
            current = from + i;
            show = current + 1 + '月';

            if (re) {
                html.push(
                    baidu.format(me.tplMonth,
                        show,
                        current == month ? mactiveClass : '',
                        idPrefix + i,
                        current,
                        me.getStrRef() + '.viewMonth(this)'
                    ));
            } else {
                var td = baidu.g(idPrefix + i);
                td.setAttribute('month', current);
                td.innerHTML = show;
                if (current == month) {
                    baidu.addClass(td, mactiveClass);
                } else {
                    baidu.removeClass(td, mactiveClass);
                }
            }
        }

        if (re) {
            return html.join('');
        }

        return null;
    },

    /**
     * 显示当前td表示的月份的日期
     *
     * @private
     */
    viewMonth: function(el) {
        var me = this,
            type = /begin/.test(el.id) ? 'begin' : 'end',
            activeClass = me.getClass('mactive'),
            view = me.view[type];

        me.view[type] = new Date(view.getFullYear(),
                                 el.getAttribute('month'),
                                 1);

        for (var i = 0; i < 5; i++) {
            baidu.removeClass(me.getId('mPrefix') + type + i, activeClass);
        }

        baidu.addClass(el, activeClass);
        me.c(me.controlMap[type]).setView(me.view[type]);
    },

    /**
     * 获取浮动层中年份显示区域的html
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {string} year 要显示的年份.
     * @return {string}
     */
    getYearHtml: function(type, year) {
        var me = this,
            unit = 'year';

        return me.getArrowHtml(type, unit, 'prev')
               + baidu.format(me.tplYear,
                                year + '年',
                                me.getClass('yinfo'),
                                me.getId(type + 'Yinfo'))
               + me.getArrowHtml(type, unit, 'next');
    },

    /**
     * 获取月份或年份的小箭头的html
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {string} unit 箭头所属单元,year|month.
     * @param {string} prevOrNext 箭头表示的前进或后退.
     * @return {string}
     */
    getArrowHtml: function(type, unit, prevOrNext) {
        return baidu.format('<span class="{0}" onclick="{1}"></span>',
                            this.getClass(prevOrNext),
                            this.getStrCall('changeView', type, unit, prevOrNext));
    },

    /**
     * 改变浮动层view显示的日期
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {string} unit 箭头所属单元,year|month.
     * @param {string} prevOrNext 箭头表示的前进或后退.
     */
    changeView: function(type, unit, prevOrNext) {
        var me = this,
            viewDate = me.view[type],
            year = viewDate.getFullYear(),
            month = viewDate.getMonth();

        if (unit == 'month') {
            if (prevOrNext == 'prev') {
                month--;
            } else {
                month++;
            }
        } else {
            if (prevOrNext == 'prev') {
                year--;
            } else {
                year++;
            }
        }

        me.view[type] = new Date(year, month, 1);
        me.repaintSide(type);
    },

    /**
     * 获取侧边栏头部的html
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {string} value 日期输入框的值.
     * @return {string}
     */
    getSideHeadHtml: function(type, value) {
        var me = this;
        return baidu.format(me.tplSideHead,
                            me[type + 'SideTitle'],
                            me.getId(type + 'Input'),
                            value,
                            me.getClass('input'),
                            me.getClass('label'));
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
        if (this.getLayer().style.left != this.offsetSize) {
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
        this.getLayer().style.left = this.offsetSize;
        this.getLayer().style.top = this.offsetSize;
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
            layer = me.getLayer(),
            value = me.value,
            layerLeft;

        // 创建临时日期存储变量
        me.tempValue = {
            'begin': value.begin,
            'end': value.end
        };

        // 更新浮动层显示的日期
        me.view = {
            'begin': value.begin,
            'end': value.end
        };


        me.repaintLayer();
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
     * 获取浮动层元素
     *
     * @private
     * @return {HTMLElement}
     */
    getLayer: function() {
        return baidu.g(this.getId('layer'));
    },

    /**
     * 获取input输入框
     *
     * @private
     * @param {string} type 输入框类别，begin|end.
     * @return {HTMLElement}
     */
    getInput: function(type) {
        return baidu.g(this.getId(type + 'Input'));
    },

    /**
     * 重新绘制layer
     *
     * @private
     */
    repaintLayer: function() {
        this.repaintSide('begin');
        this.repaintSide('end');
    },

    /**
     * 绘制浮动层内的日历部件
     *
     * @private
     */
    renderMonthView: function() {
        var me = this,
        	id = me.id,
            view = me.view,
	        beginMonthView = ui.util.create('MonthView', {'id': id + 'begin'}),
	        endMonthView = ui.util.create('MonthView', {'id': id + 'end'});

	    beginMonthView.onselect = this.getSelectHandler('begin');
	    endMonthView.onselect = this.getSelectHandler('end');

	    //var begin = me.c(me.controlMap['begin']),
        //	end = me.c(me.controlMap['end']);


        // 设置左右日历部件的显示
	    beginMonthView.setView(view.begin);
	    endMonthView.setView(view.end);

        // 重新绘制日历部件
        beginMonthView.appendTo(baidu.g(me.getId('beginCal')));
        endMonthView.appendTo(baidu.g(me.getId('endCal')));

        this.addChild(beginMonthView);
	    this.addChild(endMonthView);
    },

    /**
     * 获取当前选中日期区间的显示字符
     *
     * @private
     * @return {string}
     */
    getValueText: function() {
        var value = this.getValue(),
            begin = value.begin,
            end = value.end,
            format = this.dateFormat,
            formatter = baidu.date.format;

        if (begin && end) {
            return formatter(begin, format)
                    + ' 至 '
                    + formatter(end, format);
        }

        return '';
    },

    /**
     * 获取当前选取的日期
     *
     * @public
     * @return {string}
     */
    getValue: function() {
        return this.value;
    },

    /**
     * 设置当前选取的日期
     *
     * @public
     * @param {Date} date 选取的日期.
     */
    setValue: function(date) {
        if (date && date.begin && date.end) {
            this.value = date;
            this.repaintMain();
        }
    },

    /**
     * 释放控件
     *
     * @protected
     */
    dispose: function() {
        ui.MultiCalendar.superClass.dispose.call(this);
        document.body.removeChild(baidu.g(this.getId('layer')));
        baidu.un(document, 'click', this.layerController);
    }
};

baidu.inherits(ui.MultiCalendar, ui.InputControl);
