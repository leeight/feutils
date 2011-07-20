/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: form.floatVideo.js 6402 2011-06-12 09:28:35Z lixiang $
 *
 **************************************************************************/



/**
 * form.floatVideo.js ~ 2011/03/14 23:37:39
 * @author lixiang(liyubei@baidu.com)
 * @version $Revision: 6402 $
 * @description
 * 创建视频创意的表单.
 **/

goog.require('material.form.Base');

goog.provide('material.form.FloatVideo');

/**
 * 创建 视频 广告创意的时候用到这个Form
 * @constructor
 * @extends {material.form.Base}
 * @export
 */
material.form.FloatVideo = function() {
  material.form.Base.call(this);
};
baidu.inherits(material.form.FloatVideo, material.form.Base);


/** @inheritDoc */
material.form.FloatVideo.prototype.view = function() {
  return 'floatVideoEditForm';
};
/** @inheritDoc */
material.form.FloatVideo.prototype.getMaterialTypeOptions = function() {
    var list = /** @type {Array} */ (er.context.get('materialTypeList'));

    return baidu.array.filter(list, function(item, index) {
        return item.text == '标准视频（带搜索框）';
    });
};

/**
 * @inheritDoc
 */
material.form.FloatVideo.prototype.initDefaultModel = function() {
  var type = this.getMaterialTypeByText('标准视频（带搜索框）', '5');
  // 不需要预览效果
  this.model['src_auto_perview'] = false;
  this.initModelImpl({ 'm_type' : type, 'has_anchor_overlay' : 1,
    'target_window' : 1, 'is_set_collapse_src': 0});
};


/** @inheritDoc */
material.form.FloatVideo.prototype.enterDocumentInternal = function() {
  var form = this.page.getChild('form'),
      width = form.getChild('width'),
      height = form.getChild('height'),
      me = this;
  baidu.hide('floatVideo-type-container');

  //disable所有的collapse src上传控件
  this.form.c('with-search-collapse-src').disable();
  
  if (this.isModify()) {
    this._initHasCollapseSrcStatus();
  }

};

material.form.FloatVideo.prototype._initHasCollapseSrcStatus = function() {
  this.toggleCollapseSrc('collapse-src-container-width-search',
                         'chk-has-collapse-src-with-search',
                         'with-search-collapse-src');
};

material.form.FloatVideo.prototype.toggleCollapseSrc = function(outerId, checkId, srcId) {
  var checked = this.form.c(checkId).getChecked();
  if (checked) {
    baidu.show(outerId);
    this.form.c(srcId).enable();
  } else {
    this.form.c(srcId).hideError();
    baidu.hide(outerId);
    this.form.c(srcId).disable();
  }
};

/** @inheritDoc */
material.form.FloatVideo.prototype.processParam = function(params) {
  // 在这里需要对params中的width和height进行一下处理，原因是
  // 1. 标准视频的大小是360*300
  // 2. 非标准视频的大小根据上传播放器而定
  // 对于如下的场景，我切换到非标准视频，上传了一个播放器，width和height被设置为950*300
  // 然后再切换到标准视频，上传一个视频文件，然后提交，此时应该提交的width和height是360*300

  var form = this.page.getChild('form'),
      width = form.getChild('width'),
      height = form.getChild('height'),
      collapseSrcChk,
      collapseSrc_url;

  //如果为定制图标，则返回绝对地址
  if (params.indexOf('&is_set_collapse_src=') == -1) {
      params += '&collapse_src=' + er.context.get('videoPlayerMap')['default_logo'];
  }
  var new_params = params.replace(/&(width|height)=(\d+)?/g, '');
  return new_params + '&width=322&height=292';
};


/** @inheritDoc */
material.form.FloatVideo.prototype.initBehaviorInternal = function() {
  var form = this.page.getChild('form'),
      width = form.getChild('width'),
      height = form.getChild('height');

  //绑定浮标选择事件
  this.form.c('chk-has-collapse-src-with-search').onclick =
      baidu.fn.bind(this.toggleCollapseSrc, this,
                   'collapse-src-container-width-search',
                   'chk-has-collapse-src-with-search',
                   'with-search-collapse-src');

};


/** @inheritDoc */
material.form.FloatVideo.prototype.getExtraParamInternal = function() {
  var form = this.page.getChild('form'),
      src = form.getChild('src'),
      params = [];

  var player_url = null;
  // 'http://fe.baidu.com/doc/zhanglili/dan/standard-player.swf';
  player_url = er.context.get('videoPlayerMap')['standard_v1'];
  params.push(baidu.format('custom_player_url={0}',
     encodeURIComponent(player_url)));

  // 添加src_file_name参数
  if (src && src.getLocalPath()) {
    params.push('src_file_name=' +
        encodeURIComponent(src.getLocalPath()));
  }

  return params.join('&');
};



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
