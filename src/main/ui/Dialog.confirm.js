/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * src/ui/Dialog.confirm.js ~ 2011/03/23 01:10:28
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * ui.Dialog.confirm
 **/


goog.require('ui.Button');
goog.require('ui.Dialog');

goog.provide('ui.Dialog.confirm');


/**
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.Dialog.Confirm = function(options) {
  ui.Control.call(this, options);
  this.autoState = false;
  this.id = 'DialogConfirm';

  // 因为init不会被page调用，因此在这里调用一下。
  this.init();
};
baidu.inherits(ui.Dialog.Confirm, ui.Control);
baidu.addSingletonGetter(ui.Dialog.Confirm);

/**
 * @inheritDoc
 */
ui.Dialog.Confirm.prototype.init = function() {
  var frame = new ui.Dialog({
    id: 'frame',
    title: '',
    width: 350
  });

  var okbtn = new ui.Button({
    id: 'okbtn',
    content: '确定'
  });

  var cancelbtn = new ui.Button({
    id: 'cancelbtn',
    content: '取消'
  });

  this.addChild(frame);
  this.addChild(okbtn);
  this.addChild(cancelbtn);

  ui.Dialog.Confirm.superClass.init.call(this);
};

/**
 * @inheritDoc
 */
ui.Dialog.Confirm.prototype.render = function(opt_main) {
  var frame = this.getFrame();
  var okbtn = this.getButton('okbtn');
  var cancel = this.getButton('cancelbtn');

  frame.render();
  okbtn.appendTo(frame.getFoot());
  okbtn.render();
  cancel.appendTo(frame.getFoot());
  cancel.render();

  this.lifePhase = ui.lifeCycle.RENDERED;
};

/**
 * 获取对话框上面的确定按钮实例.
 * @private
 * @param {string} id 子控件按钮的Id.
 * @return {ui.Button}
 */
ui.Dialog.Confirm.prototype.getButton = function(id) {
  return /** @type {ui.Button} */ (this.getChild(id));
};

/**
 * 获取对话框实例.
 * @return {ui.Dialog}
 */
ui.Dialog.Confirm.prototype.getFrame = function() {
  return /** @type {ui.Dialog} */ (this.getChild('frame'));
};

/**
 * @param {string} title 标题.
 * @param {string} content 内容.
 */
ui.Dialog.Confirm.prototype.show = function(title, content) {
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
 * @private
 */
ui.Dialog.Confirm.prototype._setHandler = function(id, handler) {
  var me = this,
      btn = this.getButton(id);

  if (btn) {
    btn.onclick = function() {
      var callable = typeof handler == 'function';
      if ((callable && handler() !== false) || !callable) {
        me.getFrame().hide();
      }
    }
  }
};

/**
 * 设置点击"确定"按钮时候的处理函数.
 * @param {!Function} onok 处理函数.
 */
ui.Dialog.Confirm.prototype.setOkHandler = function(onok) {
  this._setHandler('okbtn', onok);
};

/**
 * 点击"取消"按钮时候的处理函数.
 * @param {!Function} oncancel 处理函数.
 */
ui.Dialog.Confirm.prototype.setCancelHandler = function(oncancel) {
  this._setHandler('cancelbtn', oncancel);
};

/**
 * @param {Object} args alert对话框的参数.
 */
ui.Dialog.confirm = function(args) {
  var dialog = ui.Dialog.Confirm.getInstance();

  var title = args.title || '',
      content = args.content || '',
      onok = args.onok,
      oncancel = args.oncancel,
      type = args.type || 'warning',
      tpl = '<div class="ui-dialog-icon ui-dialog-icon-{0}"></div><div class="ui-dialog-text">{1}</div>';

  dialog.show(title, baidu.format(tpl, type, content));
  dialog.setOkHandler(onok);
  dialog.setCancelHandler(oncancel);
};



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
