/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * src/ui/Dialog.alert.js ~ 2011/03/22 23:20:49
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * ui.Dialog.alert
 **/


goog.require('ui.Button');
goog.require('ui.Dialog');

goog.provide('ui.Dialog.alert');


/**
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.Dialog.Alert = function(options) {
  ui.Control.call(this, options);
  this.autoState = false;
  this.id = 'DialogAlert';

  // 因为init不会被page调用，因此在这里调用一下。
  this.init();
};
baidu.inherits(ui.Dialog.Alert, ui.Control);
baidu.addSingletonGetter(ui.Dialog.Alert);

/**
 * @inheritDoc
 */
ui.Dialog.Alert.prototype.init = function() {
  var frame = new ui.Dialog({
    id: 'frame',
    closeButton: false,
    title: '',
    width: 350
  });

  var okbtn = new ui.Button({
    id: 'okbtn',
    content: '确定'
  });

  this.addChild(frame);
  this.addChild(okbtn);

  ui.Dialog.Alert.superClass.init.call(this);
};

/**
 * @inheritDoc
 */
ui.Dialog.Alert.prototype.render = function(opt_main) {
  this.getFrame().render();
  this.getOkButton().appendTo(this.getFrame().getFoot());
  this.getOkButton().render();
  this.lifePhase = ui.lifeCycle.RENDERED;
};

/**
 * 获取对话框上面的确定按钮实例.
 * @return {ui.Button}
 */
ui.Dialog.Alert.prototype.getOkButton = function() {
  return /** @type {ui.Button} */ (this.getChild('okbtn'));
};

/**
 * 获取对话框实例.
 * @return {ui.Dialog}
 */
ui.Dialog.Alert.prototype.getFrame = function() {
  return /** @type {ui.Dialog} */ (this.getChild('frame'));
};

/**
 * @param {string} title 标题.
 * @param {string} content 内容.
 */
ui.Dialog.Alert.prototype.show = function(title, content) {
  var frame = this.getFrame();
  if (!frame.getRoot()) {
    this.render();
    this.bindEvent();
  }

  frame.show();
  frame.setTitle(title);
  frame.setContent(content);
};

/**
 * 设置点击"确定"按钮时候的处理函数.
 * @param {!Function} onok 处理函数.
 * @private
 */
ui.Dialog.Alert.prototype.setOkHandler = function(onok) {
  var me = this;
  this.getOkButton().onclick = function() {
    var isFunc = (typeof onok == 'function');
    if ((isFunc && onok() !== false) || !isFunc) {
      me.getFrame().hide();
    }
  }
};

/**
 * @param {Object} args alert对话框的参数.
 */
ui.Dialog.alert = function(args) {
  var dialog = ui.Dialog.Alert.getInstance();

  var title = args.title || '',
      content = args.content || '',
      onok = args.onok,
      type = args.type || 'warning',
      tpl = '<div class="ui-dialog-icon ui-dialog-icon-{0}"></div><div class="ui-dialog-text">{1}</div>';
      
  dialog.show(title, baidu.format(tpl, type, content));
  dialog.setOkHandler(onok);
};















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
