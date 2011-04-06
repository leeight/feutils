/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/MonthView.js
 * desc:    日历月份显示单元
 * author:  zhaolei,erik
 * date:    $Date$
 */

goog.require('baidu');
goog.require('ui');
goog.require('ui.Control');

goog.provide('ui.MonthView');

/**
 * 日历月份显示单元
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.MonthView = function(options) {
	ui.Control.call(this, options);

	this.eventTypes = ['mouseover', 'mouseout', 'focus', 'blur'];
	this.handlers = {};

	this.type = 'month';

	var now = new Date();
	this.year = parseInt(this.year, 10) || now.getFullYear();
	this.month = parseInt(this.year, 10) || now.getMonth();
};

ui.MonthView.prototype = {
    /**
     * 日期的模板
     * @private
     */
    tplItem: '<td year="{1}" month="{2}" date="{0}" class="{4}" id="{3}" onmouseover="{5}" onmouseout="{6}" onclick="{7}">{0}</td>',
	//TODO: 是否需要对模板string进行抽取

	/**
	 * 标题显示配置
	 */
	titleWords: ['一', '二', '三', '四', '五', '六', '日'],

	/**
	 * 设置当前显示的月份日期
	 *
	 * @public
	 * @param {Date} view 当前显示的月份日期.
	 */
	setView: function(view) {
        this.month = view.getMonth();
        this.year = view.getFullYear();
        this.render();
	},

	/**
	 * 绘制控件
	 */
	render: function() {
	    var main = this.main;
	    if (main) {
	        main.className = this.getClass();
	        main.innerHTML = this.getHtml();
	        this.paintSelected(this.value);
	    }
	    ui.MonthView.superClass.render.call(this, main);
    },

    /**
     * 获取控件的html
     *
     * @private
     * @return {string}
     */
    getHtml: function() {
        var me = this,
            html = ['<table border="0" cellpadding="0" cellspacing="0" class="' + me.getClass('main') + '"><thead><tr>'],
            index = 0,
            year = me.year,
            month = me.month,
            repeater = new Date(year, month, 1),
            nextMonth = new Date(year, month + 1, 1),
            begin = 1 - (repeater.getDay() + 6) % 7,
            titles = me.titleWords,
            tLen = titles.length,
            tIndex,
            virtual,
            overClass = me.getClass('over'),
            overHandler = "baidu.addClass(this, '" + overClass + "')",
            outHandler = "baidu.removeClass(this, '" + overClass + "')";
        for (tIndex = 0; tIndex < tLen; tIndex++) {
            html.push('<td class="' + me.getClass('title') + '">' + titles[tIndex] + '</td>');
        }
        html.push('</tr></thead><tbody><tr>');
        repeater.setDate(begin);

        while (nextMonth - repeater > 0 || index % 7 !== 0) {
            if (begin > 0 && index % 7 === 0) {
                html.push('</tr><tr>');
            }

            virtual = (repeater.getMonth() != month);
            html.push(
                baidu.format(me.tplItem,
                    repeater.getDate(),
                    repeater.getFullYear(),
                    repeater.getMonth(),
                    me.getItemId(repeater),
                    (virtual ? me.getClass('virtual') : me.getClass('item')),
                    (virtual ? '' : overHandler),
                    (virtual ? '' : outHandler),
                    (virtual ? '' : me.getStrRef() + '.selectByItem(this)')
                ));

            repeater = new Date(year, month, ++begin);
            index++;
        }

        html.push('</tr></tbody></table>');
        return html.join('');
    },

    /**
     * 通过item的dom元素选择日期
     *
     * @private
     * @param {HTMLElement} item dom元素td.
     */
    selectByItem: function(item) {
        var date = item.getAttribute('date'),
            month = item.getAttribute('month'),
            year = item.getAttribute('year');

        this.select(new Date(year, month, date));
    },

    onselect: new Function(),

    /**
     * 选择当前日期
     *
     * @param {Date} date 当前日期.
     */
    select: function(date) {
        if (!date) {
            return;
        }

        if (this.onselect(date) !== false) {
            this.paintSelected(date);
        }
    },

    /**
     * 绘制当前选择的日期
     *
     * @private
     * @param {Date} date 要绘制的当前选择日期.
     */
    paintSelected: function(date) {
        var me = this,
            selectedClass = me.getClass('selected'),
            item;

        if (me.value) {
            item = baidu.g(me.getItemId(me.value));
            item && baidu.removeClass(item, selectedClass);
        }

        if (date) {
            me.value = date;
            item = baidu.g(me.getItemId(date));
            item && baidu.addClass(item, selectedClass);
        }
    },

    /**
     * 获取日期对应的dom元素item的id
     *
     * @private
     * @param {Date} date 日期.
     * @return {string}
     */
    getItemId: function(date) {
        return this.getId()
                    + date.getFullYear()
                    + date.getMonth()
                    + date.getDate();
    },

    /**
     * 获取当前选择的日期
     * @return {?Date}
     */
    getValue: function() {
        return this.value || null;
    }
};
baidu.inherits(ui.MonthView, ui.Control);
