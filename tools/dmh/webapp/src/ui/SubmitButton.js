/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/SubmitButton.js
 * desc:    提交按钮
 * author:  yuanhongliang
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

goog.require('ui.Button');

goog.provide('ui.SubmitButton');



/**
 * ui.SubmitButton
 * @constructor
 * @extends {ui.Button}
 * @param {Object} options 控件初始化参数.
 * @export
 */
ui.SubmitButton = function(options) {
  ui.Button.call(this, options);
};
baidu.inherits(ui.SubmitButton, ui.Button);


/** @inheritDoc */
ui.SubmitButton.prototype.onclick = function() {
  var form,
      p = this.parent;
  while (p) {
    if (p instanceof ui.Form) {
      form = p;
      break;
    }
    p = p.parent;
  }

  if (form) {
    form.validateAndSubmit();
  }
};
