/**
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Uploader.js
 * desc:    基础上传控件
 * author:  bosn,zhaolei
 * date:    $Date$
 */

goog.require('ui.Button');
goog.require('ui.InputControl');
goog.require('ui.TextInput');
goog.require('ui.events');
goog.require('er.template');

goog.provide('ui.Uploader');



/**
 * ui.Uploader
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.Uploader = function(options) {
  ui.InputControl.call(this, options);

  /**
   * 上传按钮上面显示的文本
   * @type {string}
   * @private
   */
  this.text;
  this.type = 'uploader';
  this.form = 1;

  var id = this.id,
      btn = new ui.Button({
        'id': 'btn',
        'content': this.text
      }),
      localPath = new ui.TextInput({
        'id': 'localPath',
        'width': 160
      });
  this.addChild(btn);
  this.addChild(localPath);
};
baidu.inherits(ui.Uploader, ui.InputControl);


/**
 * 上传文件的地址
 * @type {string}
 */
ui.Uploader.prototype.url;


/**
 * 上传文件中的表单字段
 * @type {string}
 */
ui.Uploader.prototype.datakey = 'filedata';


/** @inheritDoc */
ui.Uploader.prototype.render = function(opt_main) {
  var me = this;
  var main = opt_main || me.main;

  main.innerHTML = me.getHtml();

  me.initControls();

  ui.Uploader.superClass.render.call(me, main);
};


/**
 * 初始化控件
 *
 * @private
 */
ui.Uploader.prototype.initControls = function() {
  var me = this,
      elBtn = baidu.g(me.getId('btnCntr')),
      elLocalPath = baidu.g(me.getId('localPathCntr')),
      elFile = me.getFile();

  me.getChild('btn').main = elBtn;
  me.getChild('localPath').main = elLocalPath;

  elFile.onchange = me.onchangeHandler();
};


/**
 * onchange事件
 *
 * @private
 * @return {Function} 回掉函数.
 */
ui.Uploader.prototype.onchangeHandler = function() {
  var me = this,
      file = me.getFile(),
      localPath = me.getChild('localPath');
  return function() {
    if (file.value) {
      localPath.setValue(file.value);
      // trigger的返回值类似于returnValue的形式.
      if (false !== me.trigger(ui.events.BEFORE_CHANGE)) {
        me.onchange();
      }
    }
  };
};


/**
 * 设置文件路径
 * @param {string} text 需要设置的文件路径.
 */
ui.Uploader.prototype.setLocalPath = function(text) {
  this.getChild('localPath').setValue(text);
};


/**
 * 获取文件路径
 * @return {string} 文件路径.
 */
ui.Uploader.prototype.getLocalPath = function() {
  return this.getChild('localPath').getValue();
};


/**
 * 获取file表单
 *
 * @private
 * @return {HTMLElement} 文件表单字段.
 */
ui.Uploader.prototype.getFile = function() {
  return baidu.g(this.getId('file'));
};


/**
 * 提交表单
 * @private
 */
ui.Uploader.prototype.submit = function() {
  this.trigger(ui.events.BEFORE_UPLOAD);
  document.forms[this.getId('form')].submit();
};


/**
 * onchange事件（容错）
 */
ui.Uploader.prototype.onchange = function() {
  this.submit();
};


/**
 * 获取HTML
 *
 * @private
 * @return {string} html代码.
 */
ui.Uploader.prototype.getHtml = function() {
  var me = this,
      tpl = er.template.get('Uploader'),
      id = me.getId('');

  return baidu.format(tpl,
      me.getRequestUrl(),
      me.getId('localPathCntr'),
      me.getId('btnCntr'),
      me.getClass('file'),
      me.getId('file'),
      me.datakey,
      me.getClass('ifr'),
      me.getId('ifr'),
      me.getId('ifrName'),
      me.getId('ifrName'),
      me.getId('form'),
      id
  );
};


/**
 * 获取请求URL，必须包含如下的部分
 * 1. token
 * 2. userId4Check
 * 3. callback
 * @private
 * @return {string} 上传文件的地址.
 */
ui.Uploader.prototype.getRequestUrl = function() {
  var callback = this.getStrRef() + '.processResponse';
  return this.url + '&callback=parent.' + callback;
};

/** @typedef {{success:string,message:Object,result:Object}} */
ui.Uploader.ResponseType;

/**
 * 处理服务器端返回的数据.
 * @protected
 * @param {ui.Uploader.ResponseType} data 服务器返回的数据.
 */
ui.Uploader.prototype.processResponse = function(data) {
  // TODO
};


/**
 * 获取callback信息外围元素
 *
 * @private
 * @return {HTMLElement}
 */
ui.Uploader.prototype.getWrapper = function() {
  return baidu.g(this.wrapper);
};


/**
 * 释放控件
 *
 * @protected
 */
ui.Uploader.prototype.dispose = function() {
  ui.Uploader.superClass.dispose.call(this);
};
