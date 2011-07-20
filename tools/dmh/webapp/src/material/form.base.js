/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: form.base.js 6942 2011-06-28 06:18:00Z kangyongliang $
 *
 **************************************************************************/



/**
 * form.base.js ~ 2011/03/14 23:34:05
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 6942 $
 * @description
 * 创建物料表单的基类
 **/

goog.require('base.BaseModel');
goog.require('base.ParallelWorkerManager');
goog.require('base.RequestWorker');
goog.require('base.UrlPrefixConverter');
goog.require('dn.lang');

goog.require('er.FormAction');
goog.require('material.data');
goog.require('ui.Button');
goog.require('ui.CheckBox');
goog.require('ui.Form');
goog.require('ui.FormTab');
goog.require('ui.Label');
goog.require('ui.MediaUploader');
goog.require('ui.RadioBoxGroup');
goog.require('ui.SubmitButton');

goog.require('ui.TextInput');
goog.require('ui.VideoUploader');
goog.include('material/form.html');

goog.provide('material.form.Base');

/**
 * @constructor
 * @extends {er.FormAction}
 * @export
 */
material.form.Base = function() {
  er.FormAction.call(this);

  /**
   * @type {base.BaseModel}
   */
  this.model = new base.BaseModel({
    'form_header' : 'form_header',
    'product_type_text': 'product_type_text',
    'name' : '',
    'type_options' : [],
    'm_type' : '',
    'target_url' : '',
    'target_window_options' : [],
    // 关键词
    'query' : '',
    // 是否允许点击监控
    'has_anchor_overlay_options' : [
      { 'text' : '允许', 'value' : '1' },
      { 'text' : '禁止', 'value' : '0' }
    ],
    'has_anchor_overlay' : '0',
    // default values
    'target_window' : '0',
    'max_impression_time' : '5',
    'html_code' : '',
    // FIXME cfg暂时无用，但是没有这个配置项，控件无法使用
    'upload_url' : '',
    'video_host' : '', // 视频服务器地址
    'src_uploader_cfg' : {
      'width' : 'width',
      'height' : 'height',
      'url' : 'materialUrl',
      'local' : 'materialLocalPath'
    }
  });
};
baidu.inherits(material.form.Base, er.FormAction);


/**
 * FIXME 没有/material/list
 * @const {string}
 */
material.form.Base.prototype.BACK_LOCATION = '/material/list';


/**
 * 获取对应的广告类型
 * @protected
 * @return {string} product_type.
 */
material.form.Base.prototype.getProductType = function() {
  var params = this.argMap.paramMap;

  // '0' -> 标准视频
  return params['product_type'] || '0';
};


/**
 * 获取新旧窗口打开选项的数据源，供RadioBoxGroup控件来使用
 * @return {Array.<*>} 数据源.
 */
material.form.Base.prototype.getTargetWindowOptions = function() {
  return /** @type {Array} */ (er.context.get('targetWindowTypeList'));
};


/**
 * @protected
 */
material.form.Base.prototype.view = baidu.abstractMethod;


/**
 * @protected
 * 获取可选的物料类型，结果会受到product_type的影响
 * @return {Array.<*>} 支持的无聊类型.
 */
material.form.Base.prototype.getMaterialTypeOptions = baidu.abstractMethod;


/**
 * 初始化默认的model
 * @protected
 */
material.form.Base.prototype.initDefaultModel = baidu.abstractMethod;


/**
 * 根据文本来查找物料的默认类型
 * @param {string} text 文本内容.
 * @param {string=} opt_defValue 如果没有找到就用这个默认值.
 * @return {string} 物料类型.
 */
material.form.Base.prototype.getMaterialTypeByText = function(text, opt_defValue) {
  var list = /** @type {Array} */ (er.context.get('materialTypeList'));
  var need = baidu.array.filter(list, function(item) {
    return item.text == text;
  });
  var first = need[0];

  return first ? first.value : opt_defValue;
};


/**
 * 这些数据都是不需要和后端进行交互的.
 * @private
 */
material.form.Base.prototype._initTypes = function() {
  // product_type_text
  var typeMap = er.context.get('productTypeMap'),
      type = this.getProductType();
  this.model.product_type_text = typeMap[type];
  // type_options
  this.model.type_options = this.getMaterialTypeOptions();

  // target_window_options
  this.model.target_window_options = this.getTargetWindowOptions();

  this.model.form_header = this.isModify() ? '修改创意' : '创建创意';

  // upload_url
  var visitor = er.context.get('visitor'),
      id = visitor.id,
      name = visitor.name,
      upload_url_prefix = '/material/upload';

  var upload_url = baidu.format('{0}?userId4Check={1}&token={2}',
      upload_url_prefix, id, name);
  this.model.upload_url = upload_url;

  // video_host
  // 'http://yf-sdcrd-danbs01.yf01.baidu.com:8080'
  this.model.video_host = er.context.get('videoPlayerMap')['upload_host'];

  // 预览缩略图的时候，最大的宽度
  // 因为loadPopup的时候，Dialog有宽度的，不要把它撑开
  // max_preview_width
  if (this.argMap.paramMap['max_preview_width']) {
    this.model['max_preview_width'] =
        parseInt(this.argMap.paramMap['max_preview_width'], 10);
  }
};


/**
 * @inheritDoc
 */
material.form.Base.prototype.initModel = function(argMap, callback) {
  var me = this,
      pwm = new base.ParallelWorkerManager();

  this._initTypes();

  if (this.isModify()) {
    var worker = new base.RequestWorker(
        '/material/read', 'id=' + argMap.paramMap['id'],
        function(data) {
          if (data.success == 'true') {
            me.initModelImpl(data.result);
            me._initMediaUploaderDataSource();
          } else {
            dn.notice('读取数据失败，请重试！');
            me.back();
          }
        });

    pwm.addWorker(worker);
  } else {
    this.initDefaultModel();
  }

  pwm.addDoneListener(callback);
  pwm.start();
};


/**
 * 为页面上面的多个MediaUploader准备数据源.
 * @private
 */
material.form.Base.prototype._initMediaUploaderDataSource = function() {
  // 初始化MediaUploader的datasource
  // 1. src_datasource
  // 2. custom_player_url_datasource
  // 3. collapse_src_datasource

  var me = this;

  me.model['src_datasource'] = {
    'width' : me.model['width'],
    'height' : me.model['height'],
    'preview_url' : me.model['src'],
    'local_file_name' : me.model['src_file_name']
  };
  me.model['custom_player_url_datasource'] = {
    'width' : me.model['width'],
    'height' : me.model['height'],
    'preview_url' : me.model['custom_player_url'],
    'local_file_name' : me.model['custom_player_file_name']
  };
  me.model['collapse_src_datasource'] = {
    'width' : '100',
    'height' : '100',
    'preview_url' : me.model['collapse_src'],
    'local_file_name' : me.model['collapse_src_file_name']
  };
};


/**
 * 请求后端数据，更新context.
 * @param {Object} result 后端返回的数据.
 */
material.form.Base.prototype.initModelImpl = function(result) {
  var me = this;
  var key_list = [
    'name', 'html_code', 'custom_player_url', 'query', 'src',
    'has_anchor_overlay', 'target_window', 'target_url', 'collapse_src',
    'collapse_src_type', 'm_type', 'max_impression_time', 'width', 'height',
    'src_file_name', 'is_set_collapse_src', 'collapse_src_file_name',
    'custom_player_file_name'
  ];
  baidu.array.each(key_list, function(key) {
    if (baidu.lang.hasValue(result[key])) {
      // FIXME dn.util.decodeString
      me.model[key] = dn.util.decodeString(result[key]);
    }
  });
};


/**
 * @protected
 * 子类去实现这个方法，完成自己特定的功能
 */
material.form.Base.prototype.enterDocumentInternal = baidu.fn.blank;


/** @inheritDoc */
material.form.Base.prototype.enterDocument = function() {
  var form = this.page.getChild('form'),
      type = form.getChild('m-type'),
      target_url = /** @type {ui.TextInput} */ (form.getChild('target-url')),
      has_anchor_overlay = form.getChild('has-anchor-overlay');
  var anchor_overlay_tab = new ui.FormTab({
    'id' : 'anchor-overlay-tab',
    'tabs' : [
      {
        'label' : has_anchor_overlay.getChildAt(0).getId(),
        'content' : 'anchor-overlay-container'
      },
      {
        'label' : has_anchor_overlay.getChildAt(1).getId(),
        'content' : 'anchor-overlay-container-dummy'
      }
    ]
  });
  this.page.addChild(anchor_overlay_tab);

  if (this.isModify()) {
    // FIXME 奇怪的行为
    type.disableChildren();
  }

  // urlprefix convert
  if (target_url) {
    target_url.setConverter(new base.UrlPrefixConverter('http://'));
  }
  this.enterDocumentInternal();
};


/** @inheritDoc */
material.form.Base.prototype.afterInit = function() {
  this.form = this.page.getChild('form');
  this.btnSubmit = this.form.getChild('btnSubmit');
  this.btnCancel = this.form.getChild('btnCancel');
  this.requester = this.isModify() ?
                   material.data.update :
                   material.data.create;
};


/**
 * @protected
 * @return {string} 额外的参数，不同的form可能需要返回不用的内容.
 */
material.form.Base.prototype.getExtraParamInternal = function() {
  return '';
};


/** @inheritDoc */
material.form.Base.prototype.getExtraParam = function() {
  var extra_params = 'product_type=' + this.getProductType();
  if (this.isModify()) {
    extra_params += '&id=' + this.argMap.paramMap['id'];
  }

  var child_extra_params = this.getExtraParamInternal();
  return extra_params + (child_extra_params ? '&' + child_extra_params : '');
};



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
