/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/CheckBox.js
 * desc:    多选控件
 * author:  zhaolei,erik
 * date:    $Date$
 */

/**
 * 多选控件
 * @constructor
 * @extends {ui.BaseBox}
 * @param {Object} options 控件初始化参数.
 */
ui.CheckBox = function(options) {
    ui.BaseBox.call(this, options);

    this.form = 1;
    this.boxType = 'CheckBox';

    this.type = 'checkbox';
    this.wrapTag = 'INPUT';
    this.wrapType = 'checkbox';

    this.defaultValue = this.defaultValue || 0;
};

ui.CheckBox.prototype = function() {

    function cancelClick(e) {
        e = e || window.event;
        baidu.event.preventDefault(e);
    }

    return {

        /**
         * 设置控件为readOnly
         *
         * @public
         * @param {Object} readOnly
         */
        setReadOnly: function(readOnly) {
            ui.CheckBox.superClass.setReadOnly.call(this, readOnly);

            if (readOnly) {
                this.main.readonly = 'readonly';

                // 创建一个disabled状态的checkbox和透明label覆盖在原checkbox上面，达到变灰的效果，同时接收事件。
                var fake = document.createElement('input'),
                    layer = document.createElement('label');
                fake.id = this.getId('fake');
                layer.id = this.getId('layer');
                fake.className = layer.className = 'ui-checkbox';
                fake.type = 'checkbox';
                fake.disabled = 'disabled';
                if (this.getChecked()) {
                    fake.checked = 'checked';
                }
                baidu.setStyle(fake, 'margin-left', -this.main.offsetWidth + 'px');
                layer.innerHTML = '&nbsp;'; // IE中要放点东西才能被点
                layer.htmlFor = this.getId();
                baidu.setStyles(layer, {
                    'width': this.main.offsetWidth + 'px',
                    'height': this.main.offsetHeight + 'px',
                    'font-size': '100px',
                    'overflow': 'hidden',
                    'margin-left': -this.main.offsetWidth + 'px'
                });
                baidu.dom.insertAfter(fake, this.main);
                baidu.dom.insertAfter(layer, fake);

                layer.onclick = this.main.onclick;
                baidu.event.on(this.main, 'click', cancelClick);
            } else {
                this.main.removeAttribute('readonly');

                baidu.g(this.getId('layer')).onclick = null;
                baidu.dom.remove(this.getId('layer'));
                baidu.dom.remove(this.getId('fake'));
                baidu.event.un(this.main, 'click', cancelClick);
            }
        }
    };
}();
baidu.inherits(ui.CheckBox, ui.BaseBox);
