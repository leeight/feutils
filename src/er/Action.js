/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    er/Action.js
 * desc:    Action, AbstractFormAction, ListAction, FormAction类定义
 * author:  yuanhongliang
 * date:    $Date$
 */
goog.require('base.BaseModel');
goog.require('base.IParamAdapter');
goog.require('base.RemoteListDataSource');
goog.require('er');

goog.provide('er.AbstractFormAction');
goog.provide('er.Action');
goog.provide('er.FormAction');
goog.provide('er.ListAction');

/**
 * er.Action
 * @constructor
 */
er.Action = function() {
};
er.Action.prototype = function() {
    return {
        /**
         * 进入当前action
         *
         * @protected
         * @this {er.Action}
         * @param {Object} argMap 进入的参数.
         */
        enter: function(argMap) {
            var me = this;

            if (!me.model) {
                me.model = {};
            }

            if (me.model instanceof base.BaseModel) {
                me.modelChangeHandler = baidu.fn.bind(me.onModelChanged, me);
                me.model.addPropertyChangedListener(me.modelChangeHandler);
            }

            // 保存argMap
            me.argMap = argMap;

            // 扩展onenter
            if (me.onenter) {
                me.onenter();
            }

            // 先将query中的key/value装入action.model
            baidu.object.each(argMap.paramMap, function(value, key) {
                // FIXME 有的时候需要转化value的格式，例如paramMap中的是
                // id=44128&adowner_name=&start_time=20110301000000&end_time=20110430000000&status=100
                // 但是我们希望获取到的start_time和end_time的参数值类型是Date，而不是string
                me.model[key] = value;
            });

            // 初始化model
            if (me.onbeforeinitmodel) {
                me.onbeforeinitmodel();
            }

            /**
             * 初始化model后的回调
             */
            function callback() {
                if (me.onafterinitmodel) {
                    me.onafterinitmodel();
                }
                me.render();
            }

            me.initModel(argMap, callback);
        },

        /**
         * 绘制当前action的显示
         *
         * @protected
         * @this {er.Action}
         */
        render: function() {
            var me = this,
                dom = baidu.g(me.argMap.domId),
                view = me.getView(),
                page = ui.util.createPage(view, dom, me.argMap.type === 'popup');

            me.page = page;

            me.beforeInit(page);

            page.init();

            me.afterInit(page);

            page.bindModel(me.model);

            me.beforeRender(page);

            page.render();

            me.enterDocument(page);

            page.bindEvent();

            me.initBehavior(page);

            me.done();
        },

        done: function() {
            var all = document.getElementsByTagName('*'),
                auth;
            if (er.controller.permit) {
                for (var i = 0, j = all.length; i < j; i++) {
                    auth = all[i].getAttribute('auth');
                    if (auth && !er.controller.permit(auth)) {
                        all[i].style.display = 'none';
                    }
                }
            }
        },

        /**
         * 获取view
         *
         * @protected
         * @this {er.Action}
         * @return {string} 当前action使用的view名称.
         */
        getView: function() {
            var view = this.view;

            switch (typeof view) {
            case 'object':
                return view[this.argMap.type];
            case 'function':
                return view.call(this);
            default:
                return String(view);
            }
        },

        /**
         * 初始化数据模型。这里默认只提供一种根据CONTEXT_INITER_LIST的串行实现，需要并行请覆盖此方法自行实现。
         * @this {er.Action}
         * @protected
         * @param {Object} argMap 初始化的参数.
         * @param {Function} callback 初始化完成的回调函数.
         */
        initModel: function(argMap, callback) {
            var me = this,
                path = argMap.path,
                paramMap = argMap.paramMap,
                getters = me.CONTEXT_INITER_LIST,
                i = -1,
                len = getters ? getters.length : 0,
                key;

            /**
             * Context初始化的回调函数
             *
             * @private
             */
            function repeatCallback() {
                i++;

                if (i < len) {
                    me[getters[i]].call(me, paramMap, repeatCallback);
                } else {
                    callback();
                }
            }

            // 开始初始化action指定的context
            repeatCallback();
        },

        /**
         * 模型属性发生变化事件监听器
         *
         * @protected
         * @param {string} propertyName 属性名.
         * @param {Object} newValue 当前值.
         * @param {Object} oldValue 之前值.
         */
        onModelChanged: function(propertyName, newValue, oldValue) {},

        /**
         * 页面即将初始化
         *
         * @protected
         * @param {Object} page 当前页控件.
         */
        beforeInit: function(page) {},

        /**
         * 页面已经初始化完毕
         *
         * @protected
         * @param {Object} page 当前页控件.
         */
        afterInit: function(page) {},

        /**
         * 页面即将渲染
         *
         * @protected
         * @param {Object} page 当前页控件.
         */
        beforeRender: function(page) {},

        /**
         * 页面已经渲染完毕，可以修改显示的状态了。
         *
         * @protected
         * @param {ui.Page} page 当前页控件.
         */
        enterDocument: function(page) {},

        /**
         * 初始化行为
         *
         * @protected
         * @param {ui.Page} page 前页控件.
         */
        initBehavior: function(page) {},

        /**
         * 保存视图状态
         *
         * @protected
         * @param {string} stateStr 状态字符串.
         */
        saveState: function(stateStr) {
            er.locator.redirect('~' + stateStr, true);
        },

        /**
         * 返回上一个location
         * @this {er.Action}
         * @protected
         */
        back: function() {
            var argMap = this.argMap,
                referer = argMap && argMap.referer;

            if (!argMap || argMap.type === 'popup') {
                return;
            }

            // 沿路返回或返回配置的location
            if (!referer || this.USE_BACK_LOCATION) {
                referer = this.BACK_LOCATION;
            }
            er.locator.redirect(referer);
        },

        /**
         * 离开当前action，执行清理动作
         * @this {er.Action}
         * @protected
         */
        leave: function() {
            if (this.onbeforeleave) {
                this.onbeforeleave();
            }

            if (this.model instanceof base.BaseModel) {
                this.model.removePropertyChangedListener(this.modelChangeHandler);
            }

            if (this.page) {
                this.page.dispose();
            }

            this.argMap = null;
            this.page = null;
        }
    };
}();

/**
 * @constructor
 * @extends {er.Action}
 */
er.AbstractFormAction = function() {
    er.Action.call(this);

    /**
     * 表单控件
     * @type {?ui.Form}
     */
    this.form = null;
};
er.AbstractFormAction.prototype = function() {
    return {
        /**
         * @inheritDoc
         * @protected
         * @param {ui.Page} page Page对象.
         */
        initBehavior: function(page) {
            er.AbstractFormAction.superClass.initBehavior.call(this, page);

            if (this.form) {
                var handler = baidu.fn.bind(this.onFormSubmit, this);
                this.form.onsubmit = /** @type {function(this:ui.Form, string)}*/ (handler);
            }
        },

        /**
         * @inheritDoc
         * @protected
         */
        leave: function() {
            if (this.form) {
                this.form.onsubmit = null;
            }
            this.form = null;

            er.AbstractFormAction.superClass.leave.call(this);
        },

        /**
         * 开始提交数据，请求的参数由ui.Form.onsubmit传递过来的
         * @protected
         * @param {string} params 请求参数.
         */
        onFormSubmit: function(params) {
            var finalParam = this.getFinalParam(params);
            this.doSubmit(finalParam);
        },

        /**
         * 获取最终请求参数
         * @protected
         * @this {er.AbstractFormAction}
         * @param {string} params 表单请求参数，由{ui.Form}传递过来.
         */
        getFinalParam: function(params) {
            params = this.processParam(params);
            var extraParam = this.getExtraParam();
            if (extraParam) {
                params += '&' + extraParam;
            }
            return params;
        },

        /**
         * 提交数据，请求的参数是最终的参数
         * @protected
         * @param {string} params 请求参数.
         */
        doSubmit: function(params) {},

        /**
         * 参数适配器链.
         * @type {Array.<base.IParamAdapter>}
         */
        paramAdapters: null,

        /**
         * 处理请求参数。如果需要修改，请覆写此方法。
         * @protected
         * @param {string} params 待处理的参数.
         * @return {string} 处理完的参数.
         */
        processParam: function(params) {
            if (baidu.lang.isArray(this.paramAdapters)) {
                for (var i = 0; i < this.paramAdapters.length; i++) {
                    params = this.paramAdapters[i].processParam(params);
                }
            }
            return params;
        },

        /**
         * 获取额外参数
         * @protected
         * @return {string} 检索参数.
         */
        getExtraParam: function() {
            return '';
        }
    };
}();
baidu.inherits(er.AbstractFormAction, er.Action);

/**
 * 列表Action类
 * @constructor
 * @extends {er.AbstractFormAction}
 */
er.ListAction = function() {
    er.AbstractFormAction.call(this);

    this.model = new base.BaseModel({
        'selectedItems': null,
        'searchParams': null,
        'listState': null
    });

    /**
     * 批量操作区域
     * @type {?ui.Panel}
     */
    this.pnlBatch = null;

    /**
     * 列表
     * @type {?ui.PagableList}
     */
    this.list = null;

    /**
     * 请求列表数据接口
     * @type {?function(string, Function)}
     */
    this.requesterList = null;

    /**
     * 批量操作接口
     * @type {?function(string, Function)}
     */
    this.requesterBatch = null;
};

er.ListAction.prototype = function() {
    return {
        /**
         * @override
         */
        afterInit: function() {
            throw new Error("Please implemented this method to initialize 'form', 'list', 'pnlBatch'");
        },

        /**
         * @inheritDoc
         */
        beforeRender: function(page) {
            this.list.datasource = new base.RemoteListDataSource(
                this.requesterList,
                baidu.fn.bind(this.getSearchParam, this)
            );
        },

        /**
         * 为了避免在子类里面的enterDocument调用superClass.enterDocument.call(this, page)
         * 提供了这个函数，子类值需要去实现这个函数就OK了
         * @protected
         */
        enterDocumentInternal: function() {},

        /**
         * @inheritDoc
         */
        enterDocument: function(page) {
            // FIXME: 将其他的formSearch改成form，之前不应该直接暴露formSearch...
            this.form = this.formSearch || this.form;

            this.model.triggerPropertyChanged('selectedItems');

            this.enterDocumentInternal();
        },


        /**
         * 其他的初始化行为逻辑
         * @see {enterDocumentInternal}
         */
        initBehaviorInternal: function() {},

        /**
         * @inheritDoc
         */
        initBehavior: function(page) {
            er.ListAction.superClass.initBehavior.call(this, page);

            this.list.onstatechange = baidu.fn.bind(this.onListStateChanged, this);
            this.list.onlistselect = baidu.fn.bind(this.onListSelected, this);

            this.initBehaviorInternal();

            this.list.getData();
        },

        /**
         * @inheritDoc
         */
        onModelChanged: function(propertyName, newValue, oldValue) {
            if (propertyName === 'selectedItems') {
                if (!this.pnlBatch) {
                    return;
                }
                var selectedItems = newValue;
                if (selectedItems && selectedItems.length) {
                    this.pnlBatch.enableChildren();
                } else {
                    this.pnlBatch.disableChildren();
                }
            }
            if (propertyName === 'listState' ||
                propertyName === 'searchParams') {
                this.list.getData();
                this.saveSearchAndListState();
            }
        },

        /**
         * 保存当前的页面的状态
         * @private
         */
        saveSearchAndListState: function() {
            var states = [],
                searchParams = this.model.get('searchParams'),
                listState = this.model.get('listState');
            if (searchParams) {
                states.push(searchParams);
            }
            if (listState) {
                baidu.object.each(listState, function(value, key) {
                    states.push(key + '=' + value);
                });
            }
            this.saveState(states.join('&'));
        },

        /**
         * FIXME 解释一下getSearchParam, getExtraParam, processParam
         * 这个函数的用处以及应用场景。
         *
         * 获取当前页面的检索参数
         * @private
         * @return {string} 检索参数.
         */
        getSearchParam: function() {
            var searchParam = this.model.get('searchParams');
            // 第一次请求时，没有检索参数，则从检索表单中直接获取，作为之后的检索参数。
            if (!searchParam && this.form) {
                searchParam = this.getFinalParam(this.form.getParams());
                this.model['searchParams'] = searchParam;
            }
            return searchParam;
        },

        /**
         * 分页列表状态改变事件的处理函数，如pageNo,pageSize,order,orderBy.
         * @private
         */
        onListStateChanged: function(state) {
            this.model.set('listState', state);
        },

        /**
         * 列表选择事件处理函数
         * @this {er.ListAction}
         * @private
         */
        onListSelected: function(selectedItems) {
            this.model.set('selectedItems', selectedItems);
        },

        /**
         * @inheritDoc
         * @this {er.ListAction}
         * @protected
         */
        doSubmit: function(params) {
            // 搜索时重置翻页
            if (this.list.resetPageNo) {
                this.list.resetPageNo();
            }
            // XXX: 不论搜索条件是否改变都触发请求
            this.model['searchParams'] = params;
            this.model.triggerPropertyChanged('searchParams');
        },

        /**
         * 批量更新或者删除，具体的操作和requesterBatch的行为有关系.
         * @param {string=} opt_field 属性名称.
         * @param {string=} opt_value 更新的值.
         */
        batchUpdate: function(opt_field, opt_value) {
            if (!this.requesterBatch) {
                return;
            }

            var me = this,
                selectedItems = me.model.get('selectedItems'),
                ids = [],
                params = [];
            baidu.each(selectedItems, function(item) {
                ids.push(item.id);
            });
            params.push('ids=' + ids.join(','));
            if (baidu.lang.hasValue(opt_field)) {
                params.push(opt_field + '=' + opt_value);
            }
            this.requesterBatch(params.join('&'), function() {
                me.list.getData();
            });
        },

        /**
         * 子类的销毁在这处理
         */
        leaveInternal: function() {},

        /**
         * @inheritDoc
         */
        leave: function() {
            if (this.list) {
                this.list.onstatechange = null;
                this.list.onlistselect = null;
            }

            this.pnlBatch = null;
            this.list = null;

            this.leaveInternal();

            er.ListAction.superClass.leave.call(this);
        }
    };
}();
baidu.inherits(er.ListAction, er.AbstractFormAction);

/**
 * 表单Action类
 * @constructor
 * @extends {er.AbstractFormAction}
 */
er.FormAction = function() {
    er.AbstractFormAction.call(this);

    /**
     * 表单
     * @type {ui.Form}
     */
    this.form = null;

    /**
     * 提交按钮
     * @type {ui.SubmitButton}
     */
    this.btnSubmit = null;

    /**
     * 返回按钮
     * @type {ui.Button}
     */
    this.btnCancel = null;

    /**
     * 提交请求的函数
     * @type {Function}
     */
    this.requester = null;
};
er.FormAction.prototype = function() {
    return {

        /**
         * @protected
         */
        initBehaviorInternal: function() {},

        /**
         * @inheritDoc
         */
        initBehavior: function(page) {
            er.FormAction.superClass.initBehavior.call(this, page);

            if (this.btnCancel) {
                this.btnCancel.onclick = baidu.fn.bind(this.onCancelClick, this);
            }

            this.initBehaviorInternal();
        },


        /**
         * 类似er.ListAction中enterDocumentInternal的作用。
         * @protected
         */
        enterDocumentInternal: function() {},

        /**
         * @inheritDoc
         */
        enterDocument: function(page) {
          er.FormAction.superClass.enterDocument.call(this, page);

          this.enterDocumentInternal();
        },

        /**
         * 点击返回按钮时候的处理函数.
         * @protected
         */
        onCancelClick: function() {
            this.back();
        },

        /**
         * 表单提交前的验证
         */
        onValidateForm: function() {},

        /**
         * @inheritDoc
         * @protected
         * @param {string} params 请求参数.
         */
        onFormSubmit: function(params) {
            // FIXME：验证步骤再表单中已经完成了，不应该放这再验证
            if (this.onValidateForm() === false) {
                return;
            }

            if (this.btnSubmit) {
                this.btnSubmit.disable();
            }

            er.FormAction.superClass.onFormSubmit.call(this, params);
        },

        /**
         * @inheritDoc
         * @protected
         */
        doSubmit: function(params) {
            if (this.requester) {
                this.requester(params,
                  baidu.fn.bind(this.onSubmitFinish, this),
                  baidu.fn.bind(this.onSubmitFail, this));
            }
        },

        /**
         * 处理返回的数据，可能会显示错误信息
         * @protected
         * @param {Object} data 后端返回的数据.
         */
        onSubmitFinish: function(data) {
            var controls = this.form.getInputControls(),
                i,
                errorMap,
                control,
                errorMessage;

            if (this.btnSubmit) {
                this.btnSubmit.enable();
            }

            // 当后端验证失败时
            // 处理后端验证结果
            if (data['success'] !== 'true') {
                errorMap = data['message']['field'];

                if (!errorMap) {
                    return;
                }

                // 这里的解析过程和processParam是逆序的
                if (baidu.lang.isArray(this.paramAdapters)) {
                    for (i = this.paramAdapters.length - 1; i >= 0; i--) {
                        this.paramAdapters[i].processObject(errorMap);
                    }
                }

                for (i = 0; i < controls.length; i++) {
                    control = controls[i];
                    if (!control.isDisabled()) {
                        errorMessage = errorMap[control.formName];
                        if (errorMessage) {
                            control.showError(errorMessage);
                        }
                    }
                }

                this.onSubmitFail(data);
                return;
            }

            if (this.onSubmitSucceed(data) !== false) {
                this.back();
            }
        },

        /**
         * 后端返回数据的错误处理函数
         * @protected
         * @param {Object} data 后端返回的数据结构
         */
        onSubmitFail: function(data) {
            if (this.btnSubmit) {
                this.btnSubmit.enable();
            }
        },

        /**
         * @protected
         */
        onSubmitSucceed: function(data) {
            if (this.isModify()) {
                dn.notice('修改成功');
            } else {
                dn.notice('新建成功');
            }
        },

        /**
         * 是否修改
         *
         * @private
         * @return {boolean} 是否是修改状态.
         */
        isModify: function() {
            return (/update$/).test(this.argMap.path);
        },

        /**
         * 子类的销毁在这处理
         */
        leaveInternal: function() {},

        /**
         * @inheritDoc
         */
        leave: function() {
            if (this.btnCancel) {
                this.btnCancel.onclick = null;
            }

            this.btnSubmit = null;
            this.btnCancel = null;

            this.leaveInternal();

            er.FormAction.superClass.leave.call(this);
        }
    };
}();
baidu.inherits(er.FormAction, er.AbstractFormAction);
