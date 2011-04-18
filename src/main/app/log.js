/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * log.js ~ 2011/04/18 09:39:19
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * app.Log
 **/

goog.provide('app.log');

/**
 * @type {Object}
 * @const
 */
app.log = {};

/**
 * @param {string} url url地址，发送的数据都在这里面.
 */
app.Log.send = function(url) {
  // 以下代码来自立理的邮件，这里仅仅是整理了格式和稍微的调整
  var img = new Image(),
      key = 'app_log_img_' + Math.floor(Math.random() *
            2147483648).toString(36);

  // 这里一定要挂在window下
  // 在IE中，如果没挂在window下，这个img变量又正好被GC的话，img的请求会abort
  // 导致服务器收不到日志
  window[key] = img;

  img.onload = img.onerror = img.onabort = function() {
    // 下面这句非常重要
    // 如果这个img很不幸正好加载了一个存在的资源，又是个gif动画
    // 则在gif动画播放过程中，img会多次触发onload
    // 因此一定要清空
    img.onload = img.onerror = img.onabort = null;

    window[key] = null;

    // 下面这句非常重要
    // new Image创建的是DOM，DOM的事件中形成闭包环引用DOM是典型的内存泄露
    // 因此这里一定要置为null
    img = null;
  };

  // 一定要在注册了事件之后再设置src
  // 不然如果图片是读缓存的话，会错过事件处理
  // 最后，对于url最好是添加客户端时间来防止缓存
  // 同时服务器也配合一下传递Cache-Control: no-cache;
  img.src = url;
};





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
