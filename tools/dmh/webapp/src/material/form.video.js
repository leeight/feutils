/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: form.video.js 6402 2011-05-30 09:28:35Z liyubei $
 *
 **************************************************************************/



/**
 * form.video.js ~ 2011/03/14 23:37:39
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 6402 $
 * @description
 * 创建视频创意的表单.
 **/

goog.require('material.form.Base');

goog.provide('material.form.Video');

/**
 * 创建 视频 广告创意的时候用到这个Form
 * @constructor
 * @extends {material.form.Base}
 * @export
 */
material.form.Video = function() {
  material.form.Base.call(this);
};
baidu.inherits(material.form.Video, material.form.Base);


/** @inheritDoc */
material.form.Video.prototype.view = function() {
  return 'videoEditForm';
};


/** @inheritDoc */
material.form.Video.prototype.getMaterialTypeOptions = function() {
  var list = /** @type {Array} */ (er.context.get('materialTypeList'));

  return baidu.array.filter(list, function(item, index) {
    return item.text.indexOf('视频') > 0;
  });
};


/**
 * @inheritDoc
 */
material.form.Video.prototype.initDefaultModel = function() {
  var type = this.getMaterialTypeByText('标准视频（带搜索框）', '5');
  // 不需要预览效果
  this.model['src_auto_perview'] = false;
  this.initModelImpl({ 'm_type' : type, 'has_anchor_overlay' : 1,
    'target_window' : 1, 'is_set_collapse_src': 0});
};


/** @inheritDoc */
material.form.Video.prototype.enterDocumentInternal = function() {
  var form = this.page.getChild('form'),
      type = form.getChild('m-type'),
      width = form.getChild('width'),
      height = form.getChild('height');
  var tab = new ui.FormTab({
    'id' : 'type-tab',
    'tabs' : [
      {
        'label' : type.getChildAt(0).getId(),
        'content' : 'standard-params-container'
      },
      {
        'label' : type.getChildAt(1).getId(),
        'content' : 'standard-with-search-box-params-container'
      },
      {
        'label' : type.getChildAt(2).getId(),
        'content' : 'custom-player-params-container'
      },
      {
          'label' : type.getChildAt(3).getId(),
          'content' : 'corner-mark-params-container'
        }
    ]
  });

  var diaplay_tab = new ui.FormTab({
    'id' : 'display-tab',
    'tabs' : [
      {
        'label' : type.getChildAt(0).getId(),
        'content' : 'standard-video-container'
      },
      {
        'label' : type.getChildAt(1).getId(),
        'content' : 'standard-with-search-box-video-container'
      },
      {
        'label' : type.getChildAt(2).getId(),
        'content' : 'custom-player-video-container'
      },
      {
          'label' : type.getChildAt(3).getId(),
          'content' : 'corner-mark-video-container'
      }
    ]
  });
  this.page.addChild(tab);
  this.page.addChild(diaplay_tab);

  //disable所有的collapse src上传控件
  this.form.c('with-search-collapse-src').disable();
  this.form.c('collapse-src').disable();
  this.form.c('corner-mark-collapse-src').disable();

  if (this.isModify()) {
    this._initHasCollapseSrcStatus();
  }

};

material.form.Video.prototype._initHasCollapseSrcStatus = function() {
  //根据创意类型判断勾选哪个浮标选择按钮
  //FIXME 这里有些类似hardcode的意思，建议建立以一个常量对象保存这些类别代码
  if (this.model.m_type == '5') {
    this.toggleCollapseSrc('collapse-src-container-width-search',
                           'chk-has-collapse-src-with-search',
                           'with-search-collapse-src');
  } else if (this.model.m_type == '0') {
    this.toggleCollapseSrc('collapse-src-container',
                           'chk-has-collapse-src',
                           'collapse-src');
  } else if (this.model.m_type == '6') {
    this.toggleCollapseSrc('collapse-src-container-corner-mark',
                           'chk-has-collapse-src-for-corner-mark',
                           'corner-mark-collapse-src');
  }
};

material.form.Video.prototype.toggleCollapseSrc = function(outerId, checkId, srcId) {
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
material.form.Video.prototype.processParam = function(params) {
  // 在这里需要对params中的width和height进行一下处理，原因是
  // 1. 标准视频的大小是360*300
  // 2. 非标准视频的大小根据上传播放器而定
  // 对于如下的场景，我切换到非标准视频，上传了一个播放器，width和height被设置为950*300
  // 然后再切换到标准视频，上传一个视频文件，然后提交，此时应该提交的width和height是360*300

  var form = this.page.getChild('form'),
      type = form.getChild('m-type'),
      width = form.getChild('width'),
      height = form.getChild('height'),
      collapseSrcChk,
      collapseSrc_url;

  //如果为定制图标，则返回绝对地址
  if (params.indexOf('&is_set_collapse_src=') == -1) {
      params += '&collapse_src=' + er.context.get('videoPlayerMap')['default_logo'];
  }
  if (type.getValue() != '1') {
    var new_params = params.replace(/&(width|height)=(\d+)?/g, '');
    return new_params + '&width=322&height=292';
  } else {
    return params;
  }
};


/** @inheritDoc */
material.form.Video.prototype.initBehaviorInternal = function() {
  var form = this.page.getChild('form'),
      type = form.getChild('m-type'),
      width = form.getChild('width'),
      height = form.getChild('height');

  var player = form.getChild('custom-player-url');
  /**
   * @this {ui.MediaUploader}
   */
  player.addListener(ui.events.UPLOAD_SUCCESS, function() {
    // 非标准播放器，需要设置宽度和高度
    var rawValue = this.getRawValue();
    if (rawValue.success == 'true') {
      // 虽然设置了值，但是用户是看不到滴...
      width.setValue(rawValue.result.width);
      height.setValue(rawValue.result.height);
    } else {
      // TODO
    }
  });

  //绑定浮标选择事件
  this.form.c('chk-has-collapse-src-with-search').onclick =
      baidu.fn.bind(this.toggleCollapseSrc, this,
                   'collapse-src-container-width-search',
                   'chk-has-collapse-src-with-search',
                   'with-search-collapse-src');
  this.form.c('chk-has-collapse-src').onclick =
      baidu.fn.bind(this.toggleCollapseSrc, this,
                   'collapse-src-container',
                   'chk-has-collapse-src',
                   'collapse-src');
  this.form.c('chk-has-collapse-src-for-corner-mark').onclick =
      baidu.fn.bind(this.toggleCollapseSrc, this,
                   'collapse-src-container-corner-mark',
                   'chk-has-collapse-src-for-corner-mark',
                   'corner-mark-collapse-src');
  this.page.c('display-tab').onselect = baidu.fn.bind(this.onCollapseSrcTabSelect, this);

};

material.form.Video.prototype.onCollapseSrcTabSelect = function(tab) {
  var container = baidu.g(tab.content);
  var controls = ui.util.getControlsByContainer(container);
  var control;

  for (var i = 0; i < controls.length; i++) {
      control = controls[i];
      if (control instanceof ui.InputControl &&
          control.type == 'checkbox' &&
          control.formName == 'is_set_collapse_src' &&
          !control.getChecked()) {
          // tabForm控件会在选定后自动将其下所有inputControl enable起来，
          // 这里要降不需要enable的浮标控件disable掉
          ui.util.disableFormByContainer(baidu.g(control.target), true);
          break;
      }
  }
};

/** @inheritDoc */
material.form.Video.prototype.getExtraParamInternal = function() {
  var form = this.page.getChild('form'),
      type = form.getChild('m-type'),
      src = form.getChild('src'),
      custom_player_url = form.getChild('custom-player-url'),
      params = [];

  var player_url = null;
  // 'http://fe.baidu.com/doc/zhanglili/dan/standard-player.swf';
  switch (type.getValue()) {
    case '0':
      // 标准视频，没有搜索框
      player_url = er.context.get('videoPlayerMap')['standard_v0'];
      params.push(baidu.format('custom_player_url={0}',
          encodeURIComponent(player_url)));
      break;
    case '5':
      // 标准视频，有搜索框
      player_url = er.context.get('videoPlayerMap')['standard_v1'];
      params.push(baidu.format('custom_player_url={0}',
          encodeURIComponent(player_url)));
      break;
    case '6':
      // 角标视频
      player_url = er.context.get('videoPlayerMap')['standard_v1'];
      params.push(baidu.format('custom_player_url={0}',
          encodeURIComponent(player_url)));
      break;
    default:
      break;
  }

  // 添加src_file_name参数
  if (src && src.getLocalPath()) {
    params.push('src_file_name=' +
        encodeURIComponent(src.getLocalPath()));
  }
  if (custom_player_url && custom_player_url.getLocalPath()) {
    params.push('custom_player_file_name=' +
        encodeURIComponent(custom_player_url.getLocalPath()));
  }


  return params.join('&');
};



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
