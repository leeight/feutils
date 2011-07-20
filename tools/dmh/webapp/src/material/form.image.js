/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: form.image.js 5304 2011-05-07 06:22:03Z liyubei $
 *
 **************************************************************************/



/**
 * form.image.js ~ 2011/03/14 23:39:58
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5304 $
 * @description
 * 创建 通栏/画中画 广告创意的时候用到这个Form
 **/

goog.require('material.form.Base');

goog.provide('material.form.Image');

/**
 * 创建 通栏/画中画 广告创意的时候用到这个Form
 * 支持两种创意形式：Flash和图片
 * @constructor
 * @extends {material.form.Base}
 * @export
 */
material.form.Image = function() {
  material.form.Base.call(this);
};
baidu.inherits(material.form.Image, material.form.Base);


/** @inheritDoc */
material.form.Image.prototype.view = function() {
  return 'imageEditForm';
};


/**
 * @inheritDoc
 */
material.form.Image.prototype.getMaterialTypeOptions = function() {
  var list = /** @type {Array} */ (er.context.get('materialTypeList'));

  return baidu.array.filter(list, function(item, index) {
    return item.text == '图片' || item.text == 'Flash';
  });
};


/**
 * @inheritDoc
 */
material.form.Image.prototype.initDefaultModel = function() {
  var type = this.getMaterialTypeByText('图片', '1');
  this.initModelImpl({ 'm_type' : type });
};

/**
 * 获取控件所在的那一行form-row元素
 * @private
 * @param {ui.Control} control ui控件.
 * @return {?Node} 控件所在行的DOM节点.
 */
material.form.Image.prototype._getFormRow = function(control) {
  var root = control.getRoot();
  if (root) {
    var parent = root.parentNode;
    do {
      if (baidu.dom.hasClass(parent, 'form-row')) {
        return parent;
      } else {
        parent = parent.parentNode;
      }
    } while (parent != document.body || parent != null);
  }
  return null;
};

/**
 * 选中Flash的时候，点击监控是可选的
 * 选中图片的时候，点击监控是必选的
 * @private
 * @param {{label:string,content:string}} tab 选中的tab.
 */
material.form.Image.prototype._onTabSelect = function(tab) {
  var has_anchor_overlay = this.page.c('form').c('has-anchor-overlay');
  var form_row = this._getFormRow(has_anchor_overlay);

  if (tab.content == 'image-container') {
    // 展开点击监控同时隐藏两个radiobox
    var anchor_overlay_tab = this.page.getChild('anchor-overlay-tab');
    anchor_overlay_tab.gotoTabByValue(1);

    if (form_row) {
      baidu.hide(form_row);
    }
  } else {
    if (form_row) {
      baidu.show(form_row);
    }
  }
};

/** @inheritDoc */
material.form.Image.prototype.enterDocumentInternal = function() {
  var type = this.page.c('form').c('m-type');
  var tab = new ui.FormTab({
    'id' : 'type-tab',
    'tabs' : [
      {
        'label' : type.getChildAt(0).getId(),
        'content' : 'flash-container'
      },
      {
        'label' : type.getChildAt(1).getId(),
        'content' : 'image-container'
      }
    ]
  });
  // 事件必须现在绑定，否则第一次初始化的时候，可能状态不正常
  tab.onselect = baidu.fn.bind(this._onTabSelect, this);

  this.page.addChild(tab);
};


/** @inheritDoc */
material.form.Image.prototype.initBehaviorInternal = function() {
  var form = this.page.getChild('form'),
      width = form.getChild('width'),
      height = form.getChild('height'),
      image_uploader = form.getChild('image-url'),
      flash_uploader = form.getChild('flash-url');

  /**
   * @param {ui.MediaUploader} uploader 上传控件.
   */
  function afterUpload(uploader) {
    var rawValue = uploader.getRawValue();
    if (rawValue.success == 'true') {
      width.setValue(rawValue.result.width);
      height.setValue(rawValue.result.height);
    } else {
      // TODO
    }
  }


  flash_uploader.addListener(ui.events.UPLOAD_SUCCESS, function() {
    afterUpload(this);
  });
  image_uploader.addListener(ui.events.UPLOAD_SUCCESS, function() {
    afterUpload(this);
  });
};


/** @inheritDoc */
material.form.Image.prototype.getExtraParamInternal = function() {
  var form = this.page.getChild('form'),
      image_url = form.getChild('image-url'),
      flash_url = form.getChild('flash-url');

  var params = [];

  if (!flash_url.isDisabled()) {
    params.push('src_file_name=' +
        encodeURIComponent(flash_url.getLocalPath()));
  } else if (!image_url.isDisabled()) {
    params.push('src_file_name=' +
        encodeURIComponent(image_url.getLocalPath()));
  } else {
    // TODO
  }

  return params.join('&');
};



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
