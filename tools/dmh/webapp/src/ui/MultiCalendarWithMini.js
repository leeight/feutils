/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/MultiCalendarWithMini.js
 * desc:    内嵌MiniCalendar的多日期选择器
 * author:  lixiang
 * date:    $Date: 2011-03-25 20:02:30 +0800 (星期五, 18 三月 2011) $
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


goog.require('ui.Button');
goog.require('ui.InputControl');
goog.require('ui.MonthView');

goog.provide('ui.MultiCalendarWithMini');

/**
 * 内嵌MiniCalendar的多日期选择器
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.MultiCalendarWithMini = function(options) {
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


    // 偏向大小
    this.offsetSize = '-10000px';
};

ui.MultiCalendarWithMini.prototype = {
    /**
     * 主显示区域的模板
     * @private
     */
    tplMain: '<span id="{0}" class="{1}">{2}</span><div class="{3}"></div>',

    /**
     * 浮动层html模板
     * @private
     */
    tplLayer: '<div id="{5}"></div><div class="{0}">{1}{2}</div><div id="{3}" class="{4}"></div><div id="{6}"></div>',

    /**
     * 浮动层单侧html模板
     * @private
     */
    tplSide: '<div class="{0}"><div class="{1}">{2}</div><div id="{3}"></div></div>',

    /**
     * 浮动层月份单元的html模板
     * @private
     */
    tplMonth: '<td class="{1}" id="{2}" month="{3}" onclick="{4}">{0}</td>',

    /**
     * 浮动层年份单元的html模板
     * @private
     */
    tplYear: '<div class="{0}" id="{1}"></div>',



    /**
     * 浮动层年月单元的html模板
     * @private
     */
    tplYearMonth: '<table><tbody><tr><td align="left" width="40">{0}</td><td align="left" width="70">{1}</td><td align="left" width="60">{2}</td><td align="right" width="40">{3}</td></tr></tbody></table>',



    /**
     * 获取显示年份，以2001年为起点的40年
     */
    getYearsContainer: function() {
        var begin_year = 2001;
        var _yearContainer = [];
        for (var i = 0; i < 40; i++) {
            _yearContainer.push({'value': begin_year, 'text': begin_year});
            begin_year++;
        }
        return _yearContainer;
    },


    /**
     * 获取显示月份
     */
    getMonthsContainer: function() {
        var begin_month = 1;
        var _monthContainer = [];
        for (var i = 0; i < 12; i++) {
            _monthContainer.push({'value': begin_month, 'text': begin_month});
            begin_month++;
        }
        return _monthContainer;
    },


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
            return me.c(me.controlMap[type]).getValue();
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

            // 触发mini日历的选择事件
            me.c('mmc').select({
                begin: me.tempValue['begin'],
                end: me.tempValue['end']
            });

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


        // 绘制月份下拉框的内容
        var monthSelect = me.getChild(type + 'monthselect');
        monthSelect.setValue(month + 1);

        // 绘制年份下拉框的内容
        var yearSelect = me.getChild(type + 'yearselect');
        yearSelect.setValue(year);


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

        ui.MultiCalendarWithMini.superClass.render.call(me, main, true);
        me.renderLayer();
        me.main.innerHTML = me.getMainHtml();
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
            head, foot, btn, closeButton,
            okButton = new ui.Button({'id': id + 'ok', 'skin': 'white-button'}),
            cancelButton = new ui.Button({'id': id + 'cancel', 'skin': 'white-button'}),
            mmc = ui.util.create('MiniMultiCalendar', {'value': value,
                                                       'id': 'mmc',
                                                       'skin': me.skin + '-mmcal'}),
            closeLabel = new ui.Button({'id': id + 'buttonctrlmcalmyCalclose',
                                                   'skin': 'btnlayerclose'});
        cancelButton.onclick = this.getCancelHandler();
        okButton.onclick = this.getOkHandler();
        closeLabel.onclick = this.getCancelHandler();
        mmc.onselect = baidu.fn.bind(onMiniSelected, this);

        function onMiniSelected(value) {
            var me = this;
            if (me.onselect(value) !== false) {
                me.value = value;
                me.repaintMain();
                me.hideLayer();
            }
        }

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
            me.getClass('foot'),
            me.getId('head'),
            me.getId('closeButton')
            );

        // 将浮动层+到页面中
        document.body.appendChild(layer);

        // 绘制浮动层内的日历部件
        me.renderMonthView();

        // 绘制浮动层内部的年/月份选择部件
        me.renderYearMonthView('begin', 'year', begin.getFullYear());
        me.renderYearMonthView('end', 'year', end.getFullYear());
        me.renderYearMonthView('begin', 'month', begin.getMonth() + 1);
        me.renderYearMonthView('end', 'month', end.getMonth() + 1);

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


        // 绘制浮动层头部迷你日历
        head = baidu.g(me.getId('head'));
        mmc.render(head);
        this.addChild(mmc);


        // 绘制右上角关闭按钮
        closeButton = baidu.g(me.getId('closeButton'));
        closeLabel.render(closeButton);
        this.addChild(closeLabel);



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
                            me.getClass('func'),
                            me.getYearMonthHtml(type),
                            me.getId(type + 'Cal'));
    },


    /**
     * 获取浮动层中年份月份显示区域的html
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {string} year 要显示的年份.
     * @param {string} month 要显示的月份.
     * @return {string}
     */
    getYearMonthHtml: function(type) {
        var me = this;

        return baidu.format(me.tplYearMonth,
                            me.getArrowHtml(type, 'month', 'prev'),
                            baidu.format(me.tplYear,
                                         me.getClass('Yinfo'),
                                         me.getId(type + 'Yinfo')),
                                         baidu.format(me.tplYear,
                                         me.getClass('Minfo'),
                                         me.getId(type + 'Minfo')),
                                         me.getArrowHtml(type, 'month', 'next'));
    },

    /**
     * 获取年/月选择的点击handler
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {string} unit 箭头所属单元,year|month.
     * @return {Function}
     */
    getYearMonthSelectHandler: function(type, unit) {
        var me = this;

        return function(value, selectItem) {
            var viewDate = me.view[type],
                year = viewDate.getFullYear(),
                month = viewDate.getMonth(),
                date = viewDate.getDate();
            var newDate;

            if (unit == 'year') {
                newDate = new Date(value, month, date);
            } else if (unit == 'month') {
                newDate = new Date(year, value - 1, date);
            }

            me.tempValue[type] = newDate;

            me.c('mmc').select({
                begin: me.tempValue['begin'],
                end: me.tempValue['end']
            });

            me.view[type] = newDate;
            me.repaintSide(type);
        };
    },



    /**
     * 获取月份控制的小箭头的html
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {string} unit 箭头所属单元,year|month.
     * @param {string} prevOrNext 箭头表示的前进或后退.
     * @return {string}
     */
    getArrowHtml: function(type, unit, prevOrNext) {
        return baidu.format('<div class="{0}" onclick="{1}"></div>',
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

                // comboBox的层位于Calendar层的外部，因此要使用id来判断是否与
                // Calender拥有从属关系
                if (tar.id.indexOf(me.getId()) != -1) {
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
     * 重新绘制layer
     *
     * @private
     */
    repaintLayer: function() {
        this.repaintSide('begin');
        this.repaintSide('end');
    },

    /**
     * 绘制浮动层内的年/月份选择部件
     *
     * @private
     * @param {string} type 侧边栏类型,begin|end.
     * @param {string} unit 箭头所属单元,year|month.
     * @param {string} value 选择的数值.
     *
     */
    renderYearMonthView: function(type, unit, value) {
        var me = this;
        var datasource;
        var target;
        var lable = document.createElement('span');

        if (unit == 'year') {
            target = baidu.g(me.getId(type + 'Yinfo'));
            lable.innerHTML = '年';
            datasource = me.getYearsContainer();
        } else if (unit == 'month') {
            target = baidu.g(me.getId(type + 'Minfo'));
            lable.innerHTML = '月';
            datasource = me.getMonthsContainer();
        }


        var select = ui.util.create('ComboBox', {'id': type + unit + 'select',
                                                 'skin': me.skin + '-combobox',
                                                 'datasource': datasource,
                                                 'defaultFirst': 1,
                                                 'value': value,
                                                 'width': unit == 'year' ? 50 : 40});



        select.onselect = this.getYearMonthSelectHandler(type, unit);
        select.appendTo(target);
        target.appendChild(lable);

        this.addChild(select);
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
            beginMonthView = ui.util.create('MonthView', {'id': id + 'begin', 'skin': me.skin + '-month'}),
            endMonthView = ui.util.create('MonthView', {'id': id + 'end', 'skin': me.skin + '-month'});

        beginMonthView.onselect = this.getSelectHandler('begin');
        endMonthView.onselect = this.getSelectHandler('end');


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
            formatter = baidu.date.format,
            shortcut = this.getChild('mmc');

        if (begin && end) {
            return (shortcut && shortcut.getName()) ||
                   formatter(begin, format) +
                   ' 至  ' +
                   formatter(end, format);
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
        ui.MultiCalendarWithMini.superClass.dispose.call(this);
        document.body.removeChild(baidu.g(this.getId('layer')));
        baidu.un(document, 'click', this.layerController);
    }


};

baidu.inherits(ui.MultiCalendarWithMini, ui.InputControl);
