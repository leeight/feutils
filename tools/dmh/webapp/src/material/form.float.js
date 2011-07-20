/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: form.flash.js 6941 2011-06-28 05:59:01Z lixiang05 $
 *
 **************************************************************************/



/**
 * form.flash.js ~ 2011/03/14 23:38:55
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 6941 $
 * @description
 * 创建 路障/浮窗/泰山压顶 广告创意的时候用到这个Form
 **/

goog.require('material.form.Base');
goog.require('ui.FormTab');

goog.provide('material.form.Float');

/**
 * 创建 浮标 广告创意的时候用到这个Form
 * 目前支持一种创意形式：Flash
 * @constructor
 * @extends {material.form.Base}
 * @export
 */
material.form.Float = function() {
  material.form.Base.call(this);
};
baidu.inherits(material.form.Float, material.form.Base);


/** @inheritDoc */
material.form.Float.prototype.view = function() {
  return 'floatEditForm';
};


/** @inheritDoc */
material.form.Float.prototype.getMaterialTypeOptions = function() {
  return [];
};


/**
 * @inheritDoc
 */
material.form.Float.prototype.initDefaultModel = function() {
  var type = this.getMaterialTypeByText('Flash', '2');
  
  this.model.collapse_ext = 'ext,swf,gif,jpg,jpeg';
  
  this.initModelImpl({ 'm_type' : type });
};


/** @inheritDoc */
material.form.Float.prototype.enterDocumentInternal = function() {
  var type = this.page.c('form').c('m-type');
  var productTypeMap = /** @type {dn.ConstMap} */ (er.context.get('productTypeMap'));
  var productType = this.getProductType();
  baidu.hide('flash-type-container');
};


/** @inheritDoc */
material.form.Float.prototype.initBehaviorInternal = function() {
  var form = this.page.getChild('form'),
      width = form.getChild('width'),
      height = form.getChild('height'),
      uploader = form.getChild('flash-url'),
      mType = form.getChild('m-type');

  /**
   * @this {ui.MediaUploader}
   */
  uploader.addListener(ui.events.UPLOAD_SUCCESS, function() {
    var rawValue = this.getRawValue();
    var medType = this._guessMediaType(rawValue.result.preview_url);
    if (rawValue.success == 'true') {
      width.setValue(rawValue.result.width);
      height.setValue(rawValue.result.height);
      //根据上传文件类型修改创意类型
      if (medType == 'flash'){
        mType.setValue('2');
      } else {
        mType.setValue('3');
      }
    } else {
      // TODO
    }
  });
};


/** @inheritDoc */
material.form.Float.prototype.getExtraParamInternal = function() {
  var form = this.page.getChild('form'),
      src = form.getChild('flash-url'),
      params = [];

  // 添加src_file_name参数
  if (src && src.getLocalPath()) {
    params.push('src_file_name=' +
        encodeURIComponent(src.getLocalPath()));
  }

  return params.join('&');
};



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
