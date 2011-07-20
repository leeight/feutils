/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: Menu.js 5156 2011-04-27 04:15:29Z liyubei $
 *
 **************************************************************************/



/**
 * report/Menu.js ~ 2011/02/19 16:35:02
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5156 $
 * @description
 * 报告页面左侧的列表控件
 **/

goog.require('report');
goog.require('ui.Control');

goog.provide('report.Menu');



/**
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
report.Menu = function(options) {
  ui.Control.call(this, options);
  this.type = 'report-menu';
};
baidu.inherits(report.Menu, ui.Control);


/**
 * @typedef {{className:string,actionName:string,text:string}}
 */
report.Menu.DataSourceType;


/**
 * 数据源.
 * @type {Array.<report.Menu.DataSourceType>}
 */
report.Menu.prototype.datasource;


/**
 * @type {string}
 */
report.Menu.prototype.itemTpl = '<li class="{0}"><a href="#" class="{1}" data-index="{2}">{3}</a></li>';

/**
 * 默认选中的菜单索引值.
 * @type {number}
 */
report.Menu.prototype.defaultItemIndex;

/**
 * @param {string} action Action的名字.
 * @param {number=} opt_index 菜单的索引值.
 */
report.Menu.prototype.onMenuClick = function(action, opt_index) {
};


/**
 * @private
 * @param {number} index 点击的菜单索引值.
 */
report.Menu.prototype.setSelectedStatus = function(index) {
  var liArray = baidu.g(this.getId()).getElementsByTagName('ul')[0].children,
      activeClass = this.getClass('active');
  baidu.array.each(liArray, function(li,i) {
    if (index === i) {
      baidu.addClass(li, activeClass);
    } else {
      baidu.removeClass(li, activeClass);
    }
  });
};


/** @inheritDoc */
report.Menu.prototype.render = function(opt_main) {
  report.Menu.superClass.render.call(this, opt_main);

  var html = [],
      me = this,
      liClass;

  html.push('<h2>客观维度选择</h2>');
  html.push('<ul>');
  baidu.array.each(me.datasource, function(item, i) {
    liClass = (i == me.defaultItemIndex) ? me.getClass('active') : '';
    html.push(baidu.format(me.itemTpl, liClass, item['className'], i, item['text']));
  });
  html.push('</ul>');

  this.main.innerHTML = html.join('');
  this.main.onclick = baidu.fn.bind(this._onMenuClick, this);
};


/**
 * @private
 * @param {Event} e 浏览器事件.
 */
report.Menu.prototype._onMenuClick = function(e) {
  var evt = e || window.event;
  var target = baidu.event.getTarget(evt);
  if (target) {
    var nodeName = target.nodeName;
    if (nodeName == 'A') {
      var index = parseInt(target.getAttribute('data-index'), 10);
      var item = this.datasource[index];
      if (item) {
        this.setSelectedStatus(index);
        this.onMenuClick(item['actionName'], index);
      }
    }
  }
  baidu.event.stop(evt);
};


/** @inheritDoc */
report.Menu.prototype.dispose = function() {
  this.main.onclick = null;

  report.Menu.superClass.dispose.call(this);
};




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
