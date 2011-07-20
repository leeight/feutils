/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/BoxGroup.js
 * desc:    选项组控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

/**
 * 选项组控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 参数.
 * @description 该控件不往DOM上画东西，只做一些全选、反选、取值的事情
 */
ui.BoxGroup = function(options) {
    ui.Control.call(this, options);

    this.tag = 'INPUT';
    // 类型列表，控件对应的type
    this.typeMap = {
        CheckBox: 'checkbox',
        RadioBox: 'radio'
    };
};

ui.BoxGroup.prototype = {

    /**
     * 获取选项组选中的值
     *
     * @return {Array}
     */
    getValue: function() {
        var me = this,
            els = me.getDOMList(),
            len = els.length,
            re = [],
            i = 0;

        for (; i < len; i++) {
            var el = els[i];
            if (!!el.checked) {
                re.push(el.value);
            }
        }

        return re;
    },

    /**
     * 对选项组下所有选项进行全选
     *
     * @description 仅多选控件可用
     */
    selectAll: function() {
        var me = this,
            els = me.getDOMList();
            len = els.length,
            i = 0;

        if (me.ui != 'CheckBox') {
            return;
        }

        for (; i < len; i++) {
            els[i].checked = true;
        }
    },

    /**
     * 对选项组下所有选项进行反选
     *
     * @description 仅多选控件可用
     */
    selectInverse: function() {
        var me = this,
            els = me.getDOMList();
            len = els.length,
            i = 0;

        if (me.ui != 'CheckBox') {
            return;
        }

        for (; i < len; i++) {
            var el = els[i];
            el.checked = !el.checked;
        }
    },

    /**
     * 获取选项组下的DOM元素列表
     *
     * @return {Array}
     */
    getDOMList: function() {
        var me = this,
            group = me.id,
            uiType = me.typeMap[me.ui],
            els = document.getElementsByTagName(me.tag),
            len = els.length,
            i = 0,
            re = [];

        for (; i < len; i++) {
            var el = els[i],
                controlId = el.getAttribute('control'),
                control;


            if (!controlId) {
                continue;
            }

            control = ui.util.get(controlId);

            if (control && el.type == uiType && control.formName == group) {
                re.push(el);
            }
        }

        return re;
    }
};
baidu.inherits(ui.BoxGroup, ui.Control);
