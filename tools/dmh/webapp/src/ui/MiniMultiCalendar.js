/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/MiniMultiCalendar.js
 * desc:    小型多日期选择器
 * author:  zhaolei,erik
 * date:    $Date: 2011-04-28 23:48:51 +0800 (周四, 28 四月 2011) $
 */


goog.require('ui.InputControl');

goog.provide('ui.MiniMultiCalendar');

/**
 * 多日期选择器
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.MiniMultiCalendar = function(options) {
    ui.InputControl.call(this, options);

    // 类型声明，用于生成控件子dom的id和class
    this.type = 'mmcal';


    this.now = this.now || new Date();

    // 初始化当前日期
    this.value = this.value || {
        begin: this.now,
        end: this.now
    };
};

ui.MiniMultiCalendar.prototype = {
    /**
     * 比较两个日期是否同一天
     *
     * @private
     * @param {Date} date1 日期.
     * @param {Date} date2 日期.
     * @return {boolean}
     */
    isSameDate: function(date1, date2) {
        if (date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()) {
            return true;
        }

        return false;
    },

    /**
     * 日期区间选项列表
     *
     * @private
     */
    optionList: [
        {
            text: '今天',
            getValue: function() {
                var now = this.now,
                    today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                return {
                    begin: today,
                    end: today
                };
            }
        },
        {
            text: '昨天',
            getValue: function() {
                var yesterday = new Date(this.now.getTime());
                yesterday.setDate(yesterday.getDate() - 1);

                return {
                    begin: yesterday,
                    end: yesterday
                };
            }
        },
        {
            text: '前七天',
            getValue: function(value) {
                var begin = new Date(this.now.getTime()),
                    end = new Date(this.now.getTime());

                end.setDate(end.getDate() - 1);
                begin.setDate(begin.getDate() - 7);

                return {
                    begin: begin,
                    end: end
                };
            }
        }
    ],

    /**
     * 获取选中的日期区间
     *
     * @public
     * @return {Object}
     */
    getValue: function() {
        return this.value;
    },

    /**
     * 绘制控件
     *
     * @public
     * @param {HTMLElement} main 控件元素.
     */
    render: function(main) {
        var me = this;
        if (main && main.tagName !== 'DIV') {
            return;
        }

        ui.MiniMultiCalendar.superClass.render.call(me, main);
        me.main.innerHTML = me.getHtml();
    },

    /**
     * 获取控件的html
     *
     * @private
     * @return {string}
     */
    getHtml: function() {
        var me = this,
            value = me.value,
            opList = me.optionList,
            len = opList.length, i, opName, opValue, option,
            idPrefix = me.getId('option'), clazz, callStr,
            html = [];
        me._currentName = '';
        for (i = 0; i < len; i++) {
            option = opList[i];
            opValue = option.getValue.call(me);
            opName = option.text;
            clazz = me.getClass('option');
            callStr = ' onclick="' + me.getStrCall('_selectIndex', i) + '"';

            if (dn.util.isSameDate(value.begin, opValue.begin) &&
                dn.util.isSameDate(value.end, opValue.end)) {
                clazz = clazz + ' ' + me.getClass('option-selected');
                callStr = '';
                me._currentName = opName;
            }

            html.push(
                baidu.format(me.itemTpl,
                    i,
                    clazz,
                    idPrefix + i,
                    option.text,
                    callStr));
        }

        return html.join('&nbsp;|&nbsp;');
    },

    itemTpl: '<span index="{0}" class="{1}" id="{2}"{4}>{3}</span>',

    onselect: function() {},

    /**
     * 根据索引选取日期
     *
     * @private
     * @param {number} index
     */
    _selectIndex: function(index) {
        var opList = this.optionList, value;
        if (index < 0 || index >= opList.length) {
            return;
        }

        value = opList[index].getValue.call(this);
        var tempCurrentName = this._currentName;
        this._currentName = opList[index].text;

        if (this.onselect(value) !== false) {
            this.select(value);
        } else {
          this._currentName = tempCurrentName;
        }
    },

    /**
     * 选取日期区间
     *
     * @public
     * @param {Object} value 日期区间对象.
     */
    select: function(value) {
        this.value = value;
        this.render();
    },

    /**
     * 获取当前快捷方式的名称
     * 
     * @public
     * @return {string}
     */
    getName: function () {
        return this._currentName;
    }
};
baidu.inherits(ui.MiniMultiCalendar, ui.InputControl);
