/**
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/MediaUploader.js
 * desc:    图片、Flash上传控件
 * author:  erik,zhaolei
 * date:    $Date: 2011-06-12 17:11:50 +0800 (周日, 12 六月 2011) $
 */

goog.require('er.template');
goog.require('ui.Uploader');
goog.require('ui.events');

goog.include('ui/MediaUploader.html');

goog.provide('ui.MediaUploader');



/**
 * ui.MediaUploader
 * @constructor
 * @extends {ui.Uploader}
 */
ui.MediaUploader = function(options) {
  ui.Uploader.call(this, options);

  this.type = 'uploader';
  this.form = 1;
};
baidu.inherits(ui.MediaUploader, ui.Uploader);


/**
 * 显示预览信息的的容器
 * @type {Element}
 */
ui.MediaUploader.prototype.wrapper;


/**
 * 初始化的数据源，修改的时候会用到
 * @type {Object}
 */
ui.MediaUploader.prototype.datasource;


/**
 * 上传的媒体类型，用来决定怎么显示预览的结果.
 * @type {string}
 */
ui.MediaUploader.prototype.mediatype = 'media';


/**
 * TODO 可能是不需要的
 * @type {Object}
 */
ui.MediaUploader.prototype.conf;


/**
 * 服务器返回的原始数据内容
 * @private
 * @type {Object}
 */
ui.MediaUploader.prototype._rawValue;


/**
 * 默认显示预览效果
 * @type {boolean}
 */
ui.MediaUploader.prototype.autoPreview = true;


/**
 * @type {number}
 */
ui.MediaUploader.prototype.fitsize;

/**
 * 用来标记后端是否返回了错误.情况是这样子的
 * 1. 用户通过修改后缀名来上传一个非jpg的文件
 * 2. 后端返回了错误，但是可以提交数据，因为前端
 * 通过验证了
 * 此时就需要这个字段去修改prototype.validate函数
 * @type {boolean}
 */
ui.MediaUploader.prototype._isValidate;

/**
 * 文件的最大体积
 * @type {number}
 */
ui.MediaUploader.prototype._maxFileSize = -1;

/**
 * 设置上传文件可以允许的大小
 * XXX 只支持Firefox和Chrome，以及其它实现了File接口的浏览器
 * @param {string|number} maxFileSize 最大文件大小，可以支持10M, 10k, 10，默认单位是字节.
 */
ui.MediaUploader.prototype.setMaxFileSize = function(maxFileSize) {
  var value = parseFloat(maxFileSize, 10);

  var cstr = String(maxFileSize).toLowerCase();
  var lastChar = cstr.charAt(cstr.length - 1);
  if (lastChar == 'm') {
    value *= 1024 * 1024;
  } else if (lastChar == 'k') {
    value *= 1024;
  } else {
    // ignore
  }

  this._maxFileSize = value;
};

/**
 * 获取上传成功之后的原始数据内容
 * @return {Object} 原始数据，类似{"success":"true", "message":{},...}.
 */
ui.MediaUploader.prototype.getRawValue = function() {
  // TODO
  return this._rawValue;
};


/**
 * @private
 * @param {string} notification 提示样式.
 */
ui.MediaUploader.prototype.addNotification = function(notification) {
  this.clearNotification();
  baidu.addClass(this.main, this.getClass(notification));
};


/**
 * 清除提示信息.
 * @private
 */
ui.MediaUploader.prototype.clearNotification = function() {
  baidu.removeClass(this.main, this.getClass('uploaded'));
  baidu.removeClass(this.main, this.getClass('uploading'));
};

/** @inheritDoc */
ui.MediaUploader.prototype.validate = function() {
  if (this._isValidate === false) {
    return false;
  } else {
    return ui.MediaUploader.superClass.validate.call(this);
  }
};
/**
 * 恢复浏览器的历史记录，否则会影响er的历史管理的功能.
 * 删掉iframe，然后再插入即可。Thx songao@baidu.com
 * @private
 */
ui.MediaUploader.prototype.restoreBrowserHistory = function() {
  var iframe = baidu.g(this.getId('ifr')),
      container;
  if (iframe) {
    // 直接remove节点IE6下面没有效果，重置innerHTML就OK了
    container = iframe.parentNode;
    container.innerHTML = baidu.format(
      '<iframe class="{0}" src="about:blank" id="{1}" name="{2}"></iframe>',
      this.getClass('ifr'),
      this.getId('ifr'),
      this.getId('ifrName')
    );
  }
};


/** @inheritDoc */
ui.MediaUploader.prototype.bindEvent = function() {
  ui.MediaUploader.superClass.bindEvent.call(this);

  var me = this;
  this.addListener(ui.events.BEFORE_CHANGE, function() {
    // 清除后端的标记，这样子就只是采用后缀名的检查了
    me._isValidate = true;
    if (me.validate()) {
      me.addNotification('uploading');
      // 隐藏错误的提示信息.
      me.hideError();
    } else {
      return false;
    }

    if (me._maxFileSize != -1) {
      var fileEl = baidu.g(me.getId('file'));
      if (fileEl.files) {
        fileEl = /** @type {HTMLInputElement} */ (fileEl.files[0]);
        var fileSize = fileEl.fileSize || fileEl.size || 0;
        if (fileSize > me._maxFileSize) {
          me.clearNotification();
          me.showError('文件太大了，当前是' + fileSize + '字节，最多允许' + me._maxFileSize + '字节');
          return false;
        }
      }
    }
  });

  this.addListener(ui.events.UPLOAD_SUCCESS, function() {
    me._isValidate = true;
    me.addNotification('uploaded');
    setTimeout(function() {
      me.clearNotification();
    }, 5000);
    me.restoreBrowserHistory();
  });

  this.addListener(ui.events.UPLOAD_FAILURE, function() {
    me._isValidate = false;
    me.clearNotification();
    me.restoreBrowserHistory();
  });
};


/**
 * 获取合适的尺寸
 *
 * @private
 * @param {{width:number,height:number}|Object} sizes 图片实际宽高对象.
 * @return {{width:number,height:number}|Object}
 */
ui.MediaUploader.prototype.getFitSize = function(sizes) {
  var maxSize = (sizes.width > sizes.height) ? sizes.width : sizes.height,
      fitSize = this.fitsize,
      zoomPer;
  if (maxSize > fitSize) {
    zoomPer = fitSize / maxSize;
    return {
      'width': Math.floor(zoomPer * sizes.width),
      'height': Math.floor(zoomPer * sizes.height)
    };
  } else {
    return sizes;
  }
};


/** @inheritDoc */
ui.MediaUploader.prototype.render = function(opt_main) {
  ui.MediaUploader.superClass.render.call(this, opt_main);

  this.wrapper = document.createElement('DIV');
  this.wrapper.id = this.getId('wrapper');
  baidu.addClass(this.wrapper, this.getClass('preview'));
  baidu.dom.insertAfter(this.wrapper, this.main);

  if (this.datasource) {
    // 修改的状态
    this.showPreview(this.datasource);
  }
};


/**
 * 显示预览的内容
 * @param {Object} obj 预览数据.
 * @private
 */
ui.MediaUploader.prototype.showPreview = function(obj) {
  var me = this,
      type = me.mediatype,
      preview = '';

  if (type == 'image') {
    preview = me.getImg(obj);
  } else if (type == 'flash') {
    preview = me.getFla(obj);
  } else if (type == 'media') {
    var mediaType = me._guessMediaType(obj['preview_url']);
    if (mediaType == 'image') {
      preview = me.getImg(obj);
    } else if (mediaType == 'flash') {
      preview = me.getFla(obj);
    }
  }

  this.wrapper.innerHTML = preview;

  // 设置要显示的文件名，验证的时候需要用到文件名.
  if (obj.local_file_name) {
    me.setLocalPath(obj.local_file_name);
  }
};


/** @inheritDoc */
ui.MediaUploader.prototype.processResponse = function(data) {
  if (data.success == 'true') {
    this._rawValue = data;
    if (this.autoPreview) {
      this.showPreview(data.result);
    }
    this.trigger(ui.events.UPLOAD_SUCCESS);
  } else {
    var errorMessage = data.message['ERROR'];
    if (errorMessage) {
      this.showError(errorMessage);
    }
    this.trigger(ui.events.UPLOAD_FAILURE);
  }
};


/**
 * 根据预览地址猜测媒体类型
 * @private
 * @param {string} url 预览地址.
 * @return {string} 媒体类型.
 */
ui.MediaUploader.prototype._guessMediaType = function(url) {
  var index = url.lastIndexOf('.') + 1;
  var ext = url.substring(index).toLowerCase();
  if (ext == 'jpg' || ext == 'gif' || ext == 'jpeg' || ext == 'png') {
    return 'image';
  } else if (ext == 'swf') {
    return 'flash';
  } else {
    return '';
  }
};


/**
 * 获取预览图片
 *
 * @private
 * @param {Object} obj 物料信息.
 * @return {string}
 */
ui.MediaUploader.prototype.getImg = function(obj) {
  var sizes = this.getFitSize(obj),
      tpl = er.template.get('MediaUploaderImg');

  return baidu.format(tpl,
      this.getId('preview-img'),
      obj['preview_url'],
      sizes.width,
      sizes.height
  );
};


/**
 * 获取预览Flash
 *
 * @private
 * @param {Object} obj 物料信息.
 * @return {string}
 */
ui.MediaUploader.prototype.getFla = function(obj) {
  var sizes = this.getFitSize(obj);

  return baidu.swf.createHTML({
    'id' : this.getId('preview-fla'),
    'url' : obj['preview_url'],
    'width' : sizes.width,
    'height': sizes.height,
    'wmode' : 'transparent'
  });
};


/** @inheritDoc */
ui.MediaUploader.prototype.getValue = function(opt_raw) {
  if (opt_raw) {
    // Validator的请求
    return this.getLocalPath();
  } else {
    // 正常表单的提交请求
    var rawValue = this._rawValue;
    if (rawValue && rawValue.success == 'true') {
      return rawValue['result']['preview_url'];
    } else if (this.datasource) {
      // 修改的状态
      return this.datasource['preview_url'];
    } else {
      return '';
    }
  }
};


/** @inheritDoc */
ui.MediaUploader.prototype.dispose = function() {
  this.wrapper = null;
  ui.MediaUploader.superClass.dispose.call(this);
};
