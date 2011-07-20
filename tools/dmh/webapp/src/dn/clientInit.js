/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    dn/clientInit.js
 * desc:    客户端业务公共模块声明
 * author:  lixiang05
 * date:    $Date: 2011-03-25 20:07:00 +0800 (五, 25 三月 2011) $
 */


goog.require('dn.TemplateWorker');

goog.provide('dn.clientInit');

/**
 * 业务公共模块初始化
 */
dn.clientInit = (function() {
    var mainId = 'Main',
        url = dn.config.url;

    /**
     * 根据不同的角色返回不同的view.
     * @return {string} 默认的view页面。.
     */
    function getDefaultIndex() {
        var role_id = er.context.get('visitor')['role_id'];
        if (dn.config.defaultIndexMap[role_id]) {
            return dn.config.defaultIndexMap[role_id];
        }
        return dn.config.defaultIndex;
    }

    /**
     * 初始化器，初始化应用程序功能
     *
     * @private
     */
    function initer() {

        // 挂接全局actionenter的处理函数
        er.Action.prototype.onenter = onActionEnter;
        //er.Action.prototype.onbeforeinitmodel = showLoading;
        //er.Action.prototype.onafterinitmodel = hideLoading;

        // 挂接权限控制，初始化应用程序控制器
        er.controller.permit = dn.isAllow;

        er.controller.init();

        var loc = er.locator.getLocation();
        if (!loc || loc == '/') {
            er.locator.redirect(getDefaultIndex());
        }

        // 显示用户信息
//        baidu.g('userName').innerHTML =
//          er.context.get('visitor')['name'];
//        baidu.show('userInfo');
    }

    /**
     * action enter的切面处理函数
     *
     * @private
     */
    function onActionEnter() {
        dn.notice.open();
    }

    /**
     * 显示loading提示
     *
     * @private
     */
    function showLoading() {
        dn.loading.show();
    }

    /**
     * 隐藏loading提示
     *
     * @private
     */
    function hideLoading() {
        dn.loading.hide();
    }


    /**
     * 静态系统量请求的回调函数
     * @param {Object} data 系统常量.
     * @see {http://fe.baidu.com/doc/display-ads/meetings/20110121.text#%E7%B3%BB%E7%BB%9F%E5%B8%B8%E9%87%8F}
     * @private
     */
    function constCallback(data) {
        dn.initConst(data.result);
    }

    /**
     * 获取用户信息，更新er.context
     * @param {Object} data 用户信息.
     * @see {http://fe.baidu.com/doc/display-ads/meetings/20110121.text#%E7%94%A8%E6%88%B7Session}
     * @private
     */
    function sessionCallback(data) {
        var visitor = data.result.visitor;
        er.context.set('visitor', visitor);
        er.context.set('pageSize', visitor.pageSize);
        // 初始化用户的权限控制信息
        er.permission.init(visitor.auth);
    }

    var pwm = new base.ParallelWorkerManager();
    pwm.addWorker(new dn.TemplateWorker(dn.config.template));
    pwm.addWorker(new base.RequestWorker(url.sysInfo, constCallback));
    pwm.addWorker(new base.RequestWorker(url.session, sessionCallback));
    pwm.addDoneListener(function() {
        initer();
    });
    return function() {
        pwm.start();
    };
})();


baidu.on(window, 'load', dn.clientInit);
