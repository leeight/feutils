/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * ReportCalendarForClient.js ~ Mar 7, 2011 3:27:52 PM
 * @author lixiang(lixiang05@baidu.com)
 * @version $Revision$
 * @description 报表日期选择控件，提供今天，昨天，最近7天及自定义选择日期.
 **/

goog.require('ui.InputControl');
goog.require('ui.MultiCalendarWithMini');

goog.provide('ui.ReportCalendarForClient');


/**
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.ReportCalendarForClient = function(options) {
    ui.InputControl.call(this, options);
    this.view = 'ReportCalendarForClient';
};
ui.ReportCalendarForClient.prototype = function() {

    /**
     * 根据默认模式设置日期区间
     * @this {ReportCalendarForClient}
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


    function onMultiSelected(value) {
        this.value = value;
        this.onselect(value);
    }

    return {
        onselect: function(value) {},

        /**
         * @inheritDoc
         * @this {ui.ReportCalendarForClient}
         */
        bindModel: function(model) {
            ui.ReportCalendarForClient.superClass.bindModel.call(this, model);

            if (typeof this.defaultMode !== 'undefined' && !this.paramValue) {
                setValueByMode.call(this);
            }

            this.c('mc').bindModel({
                value: this.value
            });
        },

        /**
         * @inheritDoc
         * @this {ReportCalendarForClient}
         */
        bindEvent: function() {
            ui.ReportCalendarForClient.superClass.bindEvent.call(this);

            this.c('mc').onselect = baidu.fn.bind(onMultiSelected, this);
        }
    };
}();
baidu.inherits(ui.ReportCalendarForClient, ui.InputControl);
