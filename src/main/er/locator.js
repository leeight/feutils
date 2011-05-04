/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * locator.js ~ 2011/03/24 18:36:18
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * er.locator
 **/

goog.require('er.base');
goog.require('er.config');
// FIXME
// goog.require('er.controller');

goog.provide('er.locator');


/**
 * Hash定位器
 * <pre>
 * Locator = [ path ] [ ~ query ]
 * path    = "/" [ *char *( "/" *char) ]
 * query   = *qchar
 * char    = ALPHA | DIGIT
 * qchar   = char | "&" | "=".
 * <pre>
 * @constructor
 */
er.Locator = function() {
  /**
   * @private
   * @type {string}
   */
  this.currentPath = '';

  /**
   * @private
   * @type {string}
   */
  this.currentQuery = '';

  /**
   * @private
   * @type {string}
   */
  this.referer = '';

  /**
   * setInterval的定时器
   * @type {number}
   */
  this._timer = 0;
};

/**
 * onredirect event
 */
er.Locator.prototype.onredirect = function() {
  // empty
};

/**
 * 获取action的path信息，也就是hash中的部分
 * @return {string} 当前页面action的地址.
 */
er.Locator.prototype.getLocation = function() {
    var hash = document.location.hash;
    if (hash) {
        return hash.substr(1);
    }

    return '';
};

/**
 * 控制定位器转向
 *
 * @param {string} loc location位置.
 * @param {boolean=} preventDefault 不进入action的enter.
 */
er.Locator.prototype.redirect = function(loc, preventDefault) {
    // 未设置path时指向当前path
    if (/^~/.test(loc)) {
        loc = (this.currentPath || '/') + loc;
    }

    // 将location写入hash
    // 写入相同的hash在firefox和chrome下不会记录成2个历史记录项
    document.location.hash = loc;
    loc = document.location.hash.replace(/^#/, '');
    var locResult = this.parseLocation(loc),
        path = locResult.path,
        query = locResult.query;

    // 与当前location相同时不进行转向
    if (path === this.currentPath &&
        query === this.currentQuery) {
        return;
    }

    // 存储当前信息
    this.currentPath = path;
    this.currentQuery = query;

    // 触发onredirect事件
    this.onredirect();

    // ie下使用iframe保存历史
    if (er.base.ie) {
        er.base.g(er.config.CONTROL_IFRAME_ID).src =
          er.config.CONTROL_IFRAME_URL + '?' + loc;
    }

    if (!preventDefault) {
        er.controller.forward(this.currentPath,
          this.parseQuery(this.currentQuery), this.referer);
    }
    this.referer = loc;
};

/**
 * 解析location
 * @private
 * @param {string} loc 需要解析的url地址.
 * @return {{path:string,query:string}} path&query.
 */
er.Locator.prototype.parseLocation = function(loc) {
    var pair = loc.match(/^([^~]+)(~(.*))?$/),
        re = {};
    if (pair) {
        re.path = pair[1];
        re.query = (pair.length === 4 ? pair[3] : '');
    } else {
        re.path = '';
        re.query = '';
    }

    return re;
};

/**
 * 获取参数集合
 * @return {Object} url参数的集合.
 */
er.Locator.prototype.getParameterMap = function() {
    return this.parseQuery(this.currentQuery);
};

/**
 * 将参数解析为Map
 * @param {string=} opt_query 参数字符串.
 * @return {Object} 参数对象.
 */
er.Locator.prototype.parseQuery = function(opt_query) {
    var query = opt_query || '';
    var params = {},
        paramStrs = query.split('&'),
        len = paramStrs.length,
        item,
        key,
        value;

    while (len--) {
        item = paramStrs[len].split('=');
        key = item[0];
        value = item[1];
        if (key) {
            // firefox在读取hash时，会自动把encode的uri片段进行decode
            if (!er.base.firefox) {
                value = decodeURIComponent(value);
            }

            params[key] = value;
        }
    }

    return params;
};

/**
 * 获取action的path
 * @return {string} 当前页面的action的path.
 */
er.Locator.prototype.getPath = function() {
    return this.currentPath;
};

/**
 * 获取location的query
 * @return {string} 当前页面的url中的参数.
 */
er.Locator.prototype.getQuery = function() {
    return this.currentQuery;
};

/**
 * 初始化er.Locator
 */
er.Locator.prototype.init = function() {
    if (this._timer) {
        // 定时器已经启动了
        return;
    }

    var me = this,
        prevLocation;

    function changeListener() {
        var loc = me.getLocation();

        if (prevLocation !== loc) {
            prevLocation = loc;
            me.redirect(loc);
        }
    }

    if (er.base.ie) {
        var iframe = document.createElement('iframe'),
            style = iframe.style,
            size = 200,
            pos = '-1000px';

        iframe.id = er.config.CONTROL_IFRAME_ID;
        iframe.width = size;
        iframe.height = size;
        style.position = 'absolute';
        style.top = pos;
        style.left = pos;
        document.body.insertBefore(iframe, document.body.firstChild);
        iframe = null;
    }

    this._timer = setInterval(changeListener, 100);
};

/**
 * @type {er.Locator}
 */
er.locator = new er.Locator();


















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
