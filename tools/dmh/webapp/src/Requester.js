/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    Requester.js
 * desc:    请求发送器
 * author:  zhaolei,erik
 * date:    $Date: 2011-07-01 18:09:16 +0800 (周五, 01 七月 2011) $
 */

goog.require('er.context');
goog.require('dn.loading');
goog.require('ui.Dialog.alert');

goog.provide('Requester');

/**
 * 请求发送器
 */
var Requester = (function() {
    var DEFAULT_SERVER_ERROR = {
        'success':'false',
        'message':{
            'global':'服务器错误'
        }
    };

    /**
     * 获取success的回调函数
     *
     * @private
     * @param {XMLHttpRequest} xhr xhr对象.
     * @param {function(Object)} onsuccess 自定义回调行为.
     * @param {function(Object)=} opt_onfailure 自定义的数据解析函数.
     */
    function responseHandler(xhr, onsuccess, opt_onfailure) {
        var data, 
            message, 
            errorTitle, 
            errorWord, 
            msgOkClick,
            onfailure = opt_onfailure || baidu.fn.blank;

        dn.loading.hide();
        try {
            data = baidu.json.parse(xhr.responseText);
        } catch (e) {
            // 不要提示“数据解析出错”了，PM不爽这个东东
             
            // ui.Dialog.alert({
            //    title: '数据解析出错',
            //    content: '数据解析出错',
            //    onok: msgOkClick
            // });
            onfailure(DEFAULT_SERVER_ERROR);
            return;
        }

        if (typeof data == 'object') {
            if (data['success'] != 'true') {
                // 全局错误信息
                message = data['message'];

                // 判断错误类型
                if (message.global) {
                    errorTitle = '系统提示';
                    errorWord = message.global;
                } else if (message.noSession) {
                    errorTitle = '系统超时';
                    errorWord = message.noSession;
                    msgOkClick = gotoIndex;
                } else if (!message.field) {
                    errorTitle = '系统提示';
                    errorWord = '请求失败(未知错误)';
                } else {
                    onsuccess(data);
                    return;
                }

                // 提示错误
                ui.Dialog.alert({
                    title: errorTitle,
                    content: errorWord,
                    onok: msgOkClick
                });
                onfailure(data);
            } else {
                // 成功回调
                onsuccess(data);
            }
        }
    }

    /**
     * 返回登录页
     *
     * @private
     */
    function gotoIndex() {
        document.location.href = '/index.html';
    }

    function getUserId4Check() {
        var visitor = er.context.get('visitor');
        return 'userId4Check=' + (!!visitor ? visitor['id'] : 0);
    }

    /**
     * @lends {Requester}
     */
    return {
        /**
         * 发送登陆用户的post请求
         *
         * @param {string} url 请求url.
         * @param {string} params 发送参数.
         * @param {function(Object)} onsuccess 请求成功的回调函数.
         * @param {function(Object)=} onfailure 请求失败的回掉函数.
         * @param {{dontRetry:boolean}=} opt_options 其他的参数
         */
        post: function(url, params, onsuccess, onfailure, opt_options) {
            var realURL = url + '?' + getUserId4Check(),
                dontRetry = false,
                dataPaser = null,
                customFailHandler = onfailure || baidu.fn.blank,
                defaultFailHandler;

            if (opt_options) {
                dontRetry = !!opt_options['dontRetry'];
            }

            if (!dontRetry) {
                defaultFailHandler = function() {
                    dn.loading.hide();
                    Requester.post(url, params, onsuccess, onfailure, {
                      "dontRetry" : true
                    });
                };
            } else {
                defaultFailHandler = function() {
                    dn.loading.hide();
                    ui.Dialog.alert({
                        title: '请求失败',
                        content: '请求失败，请稍后再试'
                    });
                };
            }

            dn.loading.show();

            baidu.ajax.request(realURL, {
                'timeout' : 30000,  // 30s
                'method' : 'post',
                'data' : params,
                'onsuccess' : function(xhr) {
                    responseHandler(xhr, onsuccess, 
                        /** @type {function(Object)}*/ (customFailHandler));
                },
                'onfailure' : function(xhr) {
                    defaultFailHandler();
                    customFailHandler(DEFAULT_SERVER_ERROR);
                },
                'ontimeout' : function(xhr) {
                    dn.loading.hide();
                    // 防止请求在timeout后返回带来副作用
                    xhr.onreadystatechange = baidu.fn.blank;
                    ui.Dialog.alert({
                        title: '请求超时',
                        content: '请求超时，请重试'
                    });
                }
            });
        },

        get: function(url, params, onsuccess) {
            url = url + '?' + getUserId4Check();
            baidu.ajax.request(url, {
                'method' : 'get',
                'data' : params,
                'onsuccess' : function(xhr) {
                    responseHandler(xhr, onsuccess);
                }
            });
        },

        /**
         * 获取验证用户id的参数串
         *
         * @return {string} 用户的id.
         */
        getUserId4Check: getUserId4Check
    };
})();
