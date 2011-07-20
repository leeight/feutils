/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    dn/loading.js
 * desc:    正在加载提示
 * author:  zhaolei,erik
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

goog.require('dn');
goog.require('ui.Mask');

goog.provide('dn.loading');

/**
 * @constructor
 */
dn.Loading = function() {
  this.ID = 'Loading';
  this.count = 0;
}

/**
 * 显示loading
 */
dn.Loading.prototype.show = function() {
    ui.Mask.show();
    if (baidu.g(this.ID)) {
        baidu.show(this.ID);
        if (baidu.ie && baidu.ie < 7) {
            baidu.g(this.ID).style.top = '120px';
        }
    }
    this.count++;
}

/**
 * 隐藏loading
 */
dn.Loading.prototype.hide = function() {
    this.count--;
    if (this.count === 0) {
        ui.Mask.hide();
        if (baidu.g(this.ID)) {
            baidu.hide(this.ID);
        }
    }
}

dn.loading = new dn.Loading();
