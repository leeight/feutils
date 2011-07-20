/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: ReportCalendar.js 5302 2011-05-06 15:45:28Z liyubei $
 *
 **************************************************************************/



/**
 * ReportCalendar.js ~ Mar 7, 2011 3:27:52 PM
 * @author yuanhongliang(yuanhongliang@baidu.com)
 * @version $Revision: 5302 $
 * @description 报表日期选择控件，提供今天，昨天，前7天及自定义选择日期.
 **/

goog.require('ui.InputControl');
goog.require('ui.MiniMultiCalendar');
goog.require('ui.MultiCalendar');

goog.provide('ui.ReportCalendar');


/**
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.ReportCalendar = function(options) {
    ui.InputControl.call(this, options);
    
    /**
     * 默认选中的类型（今天[0]，昨天[1]，前七天[2]）
     * @type {string}
     */
    this.defaultMode;

    this.view = 'ReportCalendar';
};
ui.ReportCalendar.prototype = function() {

    /**
     * 根据默认模式设置日期区间
     * @this {ui.ReportCalendar}
     */
    function setValueByMode() {
        var now = new Date(),
            today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            yesterday,
            begin,
            end;

        switch (parseInt(this.defaultMode, 10)) {
        case 0:
            this.value = {
                begin: today,
                end: today
            };
            break;
        case 1:
            yesterday = new Date(today.getTime());
            yesterday.setDate(yesterday.getDate() - 1);
            this.value = {
                begin: yesterday,
                end: yesterday
            };
            break;
        case 2:
            begin = new Date(today.getTime());
            end = new Date(today.getTime());
            end.setDate(end.getDate() - 1);
            begin.setDate(begin.getDate() - 7);

            this.value = {
                begin: begin,
                end: end
            };
            break;
        }
    }

    function onMiniSelected(value) {
        this.value = value;
        this.c('mc').rebindModel({
            value: value
        });
        this.onselect(value);
    }

    function onMultiSelected(value) {
        this.value = value;
        this.c('mmc').rebindModel({
            value: value
        });
        this.onselect(value);
    }

    return {
        onselect: function(value) {},

        /**
         * @inheritDoc
         * @this {ui.ReportCalendar}
         */
        bindModel: function(model) {
            ui.ReportCalendar.superClass.bindModel.call(this, model);

            if (typeof this.defaultMode !== 'undefined' && !this.paramValue) {
                setValueByMode.call(this);
            }

            this.c('mc').bindModel({
                value: this.value
            });
            this.c('mmc').bindModel({
                value: this.value
            });
        },

        /**
         * @inheritDoc
         * @this {ui.ReportCalendar}
         */
        bindEvent: function() {
            ui.ReportCalendar.superClass.bindEvent.call(this);

            this.c('mmc').onselect = baidu.fn.bind(onMiniSelected, this);
            this.c('mc').onselect = baidu.fn.bind(onMultiSelected, this);
        }
    };
}();
baidu.inherits(ui.ReportCalendar, ui.InputControl);
