/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: form.flash.js 6981 2011-06-29 08:21:10Z kangyongliang $
 *
 **************************************************************************/



/**
 * form.flash.js ~ 2011/03/14 23:38:55
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 6981 $
 * @description
 * 创建 路障/浮窗/泰山压顶 广告创意的时候用到这个Form
 **/

goog.require('material.form.Base');
goog.require('ui.FormTab');

goog.provide('material.form.Flash');

/**
 * 创建 路障/浮窗/泰山压顶 广告创意的时候用到这个Form
 * 支持两种创意形式：Flash和富媒体
 * @constructor
 * @extends {material.form.Base}
 * @export
 */
material.form.Flash = function() {
  material.form.Base.call(this);
};
baidu.inherits(material.form.Flash, material.form.Base);


/** @inheritDoc */
material.form.Flash.prototype.view = function() {
  return 'flashEditForm';
};


/** @inheritDoc */
material.form.Flash.prototype.getMaterialTypeOptions = function() {
  var list = /** @type {Array} */ (er.context.get('materialTypeList'));
  return baidu.array.filter(list, function(item, index) {
      return item.text == 'Flash' || item.text == '富媒体';
  });
};


/**
 * @inheritDoc
 */
material.form.Flash.prototype.initDefaultModel = function() {
  var type = this.getMaterialTypeByText('Flash', '1');

//  if (this.model.product_type_text == '浮窗') {
//      this.model.collapse_ext = 'ext,swf,gif,jpg,jpeg';
//  } else {
      this.model.collapse_ext = 'ext,swf';
//  }

  this.initModelImpl({ 'm_type' : type });
};


/** @inheritDoc */
material.form.Flash.prototype.enterDocumentInternal = function() {
  var type = this.page.c('form').c('m-type');
  var productTypeMap = /** @type {dn.ConstMap} */ (er.context.get('productTypeMap'));
  var productType = this.getProductType();
  var tab;
  tab = new ui.FormTab({
        'id' : 'type-tab',
        'tabs' : [
        {
          'label' : type.getChildAt(0).getId(),
          'content' : 'flash-container'
        },
        {
          'label' : type.getChildAt(1).getId(),
          'content' : 'html-code-container'
        }
        ]
  });

  this.page.addChild(tab);

  // 是否显示collapse_src的控件
  // XXX 只对于路障广告展示，其它广告不展示
  if (productType != productTypeMap.getKey('路障')) {
        baidu.hide('standard-collapse-src-container');
        ui.util.disableFormByContainer(baidu.g('standard-collapse-src-container'), true);
  }

  baidu.hide('flash-type-container');
};


/** @inheritDoc */
material.form.Flash.prototype.initBehaviorInternal = function() {
  var form = this.page.getChild('form'),
      width = form.getChild('width'),
      height = form.getChild('height'),
      uploader = form.getChild('flash-url');

  /**
   * @this {ui.MediaUploader}
   */
  uploader.addListener(ui.events.UPLOAD_SUCCESS, function() {
    var rawValue = this.getRawValue();
    if (rawValue.success == 'true') {
      width.setValue(rawValue.result.width);
      height.setValue(rawValue.result.height);
    } else {
      // TODO
    }
  });
};


/** @inheritDoc */
material.form.Flash.prototype.getExtraParamInternal = function() {
  var form = this.page.getChild('form'),
      src = form.getChild('flash-url'),
      collapse_src = form.getChild('collapse-src'),
      params = [];

  // 添加src_file_name参数
  if (src && src.getLocalPath()) {
    params.push('src_file_name=' +
        encodeURIComponent(src.getLocalPath()));
  }
  if (collapse_src && collapse_src.getLocalPath()) {
    params.push('collapse_src_file_name=' +
        encodeURIComponent(collapse_src.getLocalPath()));
  }

  return params.join('&');
};



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
