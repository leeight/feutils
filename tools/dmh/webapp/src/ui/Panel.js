
goog.require('ui.Control');

goog.provide('ui.Panel');

/**
 * ui.Panel
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 * @export
 */
ui.Panel = function(options) {
    ui.Control.call(this, options);
};
baidu.inherits(ui.Panel, ui.Control);
