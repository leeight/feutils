/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: mockup.js 6591 2011-06-12 08:52:51Z liyubei $
 *
 **************************************************************************/



/**
 * @file mockup.js
 * @author leeight(liyubei@baidu.com)
 * @date 2010/08/30 17:06:00
 * @version $Revision: 6591 $
 * @brief 接管baidu.ajax.request请求，针对某些
 * 特定的请求，直接返回内容
 *
 **/

/**
 * @brief
 * baidu.mockup构造函数
 *
 * @constructor
 * @retval
 * @see
 * @note
 * @author leeight
 * @date 2010/08/30 17:08:07
**/
baidu.mockup = function() {
};

/**
 * @private
 * @type {object}
 */
baidu.mockup.prototype.maps_ = {};

/**
 * @private
 * @type {object}
 */
baidu.mockup.prototype.maps_once_ = {};

/**
 * 初始化，给baidu.ajax.request添加一个钩子
 */
baidu.mockup.prototype.init = function() {
    var me = this,
        req_ = baidu.ajax.request;
    baidu.ajax.request = function(url, options) {
        var found_in_mock = false;
        for (var k in me.maps_) {
            if (url.indexOf(k) == 0) {
                if (typeof console == 'object' && typeof console.log == 'function') {
                    console.log('[MOCKUP]' + options.method.toUpperCase() + ' ' + url + ' ' + options.data);
                    console.log(me.maps_[k]);
                }

                // 如果是这个URL的话，那么就...
                var fn = options['onsuccess'];
                if (typeof fn == 'function') {
                    var text = goog.json.serialize(me.maps_[k]);
                    var xhr = {
                        'responseText' : text
                    };
                    fn.call(null, xhr, xhr.responseText);
                    if (me.maps_once_[k]) {
                        me.unregister(k);
                    }
                    found_in_mock = true;
                    break;
                }
            }
        }
        if (!found_in_mock) {
            req_.call(null, url, options);
        }
    };
};

/**
 * 去掉对某个URL结果的mockup
 * @param {string} key url地址的前缀.
 */
baidu.mockup.prototype.unregister = function(key) {
    this.maps_[key] = null;
    this.maps_once_[key] = null;

    delete this.maps_[key];
    delete this.maps_once_[key];
};

/**
 * @brief
 * 针对一些URL注册一些直接返回的内容
 *
 * @param {string} url 请求的开始内容.
 * @param {object} rv 直接返回的内容.
 */
baidu.mockup.prototype.register = function(url, rv) {
    var maps = this.maps_;
    if (maps[url]) {
        throw Error('duplicate url = [' + url + ']');
    }else {
        maps[url] = rv;
    }
};

/**
 * 注册之后，只使用一次
 *
 * @param {string} url 请求的开始内容.
 * @param {object} rv 直接返回的内容.
 */
baidu.mockup.prototype.register_once = function(url, rv) {
    this.register(url, rv);
    this.maps_once_[url] = true;
};

var mockup = new baidu.mockup();
mockup.init();
