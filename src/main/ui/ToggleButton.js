/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * ToggleButton.js ~ 2011/02/19 19:04:19
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * 有两种状态的按钮
 **/



/**
 * @constructor
 * @extends {ui.Button}
 * @param {Object} options 控件初始化参数.
 */
ui.ToggleButton = function(options) {
  ui.Button.call(this, options);
};
baidu.inherits(ui.ToggleButton, ui.Button);


/**
 * 按钮是否处于按下去的状态
 * @return {boolean} true按下去了,false没有.
 */
ui.ToggleButton.prototype._isToggled = function() {
  return this.getState('toggled');
};


/**
 * @param {boolean} isToogle 是否选中.
 */
ui.ToggleButton.prototype.setToggle = function(isToogle) {
  if (isToogle) {
    if (!this._isToggled()) {
      this.removeState('hover');
      this.removeState('press');
      this.setState('toggled');
    }
  } else {
    this.removeState('toggled');
  }
};


/** @inheritDoc */
ui.ToggleButton.prototype.clickHandler = function() {
  if (this.isDisabled()) {
    return;
  }

  this.setToggle(!this._isToggled());

  this.onclick();
};


/** @override */
ui.ToggleButton.prototype.mainOverHandler = function() {
  if (!this._isToggled()) {
    ui.ToggleButton.superClass.mainOverHandler.call(this);
  }
};


/** @override */
ui.ToggleButton.prototype.mainOutHandler = function() {
  if (!this._isToggled()) {
    ui.ToggleButton.superClass.mainOutHandler.call(this);
  }
};


/** @override */
ui.ToggleButton.prototype.mainDownHandler = function() {
  if (!this._isToggled()) {
    ui.ToggleButton.superClass.mainDownHandler.call(this);
  }
};


/** @override */
ui.ToggleButton.prototype.mainUpHandler = function() {
  if (!this._isToggled()) {
    ui.ToggleButton.superClass.mainUpHandler.call(this);
  }
};
















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
