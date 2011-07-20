/**
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/FlvPlayer.js
 * desc:    flv播放控件
 * author:  maoquan
 * date:    $Date: 2011-07-12 17:11:50
 */

goog.require('er.template');
goog.require('ui.Control');

goog.provide('ui.FlvPlayer');



/**
 * ui.FlvPlayer
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.FlvPlayer = function(options) {
  
  ui.Control.call(this, options);
  
  
};

ui.FlvPlayer.prototype.tpl = '<a id="{0}" href="{1}" style="display:block;width:{3}px;height:{4}px"></a> ';

ui.FlvPlayer.prototype.render = function(opt_main){
  
  var me = this;
  var main = opt_main || me.main;
  // 不要修改原来的options，万一被多个Flash实例公用就不好处理了。
  var options = baidu.object.clone(this.options);
  
  main.innerHTML = me.getHtml();
  
  ui.FlvPlayer.superClass.render.call(this);
  
  flowplayer(this.id, this.options.url);
};

/**
   * 获取HTML
   *
   * @private
   * @return {string} html代码.
   */
ui.FlvPlayer.prototype.getHtml = function() {

	return baidu.format(this.tpl,
		this.id,
        this.options.play_url,
        this.options.width,
        this.options.height
	);
};
  

baidu.inherits(ui.FlvPlayer, ui.Control);

