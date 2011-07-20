/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/RadioBox.js
 * desc:    单选控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-05-06 14:54:36 +0800 (周五, 06 五月 2011) $
 */

/**
 * 单选控件
 * @constructor
 * @extends {ui.BaseBox}
 * @param {Object} options 控件初始化参数.
 */
ui.RadioBox = function(options) {
    ui.BaseBox.call(this, options);

    this.form = 1;
    this.boxType = 'RadioBox';

    this.type = 'radiobox';
    this.wrapTag = 'INPUT';
    this.wrapType = 'radio';
};
baidu.inherits(ui.RadioBox, ui.BaseBox);
