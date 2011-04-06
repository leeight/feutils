/*
 * er(ecom ria)
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    er.js
 * desc:    er(ecom ria)是一个用于支撑富ajax应用的框架
 * author:  erik
 */

var er = function() {
    /*
     * 预声明
     */
    var config_ = {         // 声明配置
            CONTROL_IFRAME_ID: 'ERHistroyRecorder',
            CONTROL_IFRAME_URL: '/assets/history.html',
            MAIN_ELEMENT_ID: 'Main'
        },

        locator_,           // 声明定位器
        controller_,        // 声明控制器
        context_,           // 声明上下文数据管理器
        template_,          // 声明模板解析器
        stateHolder_,       // 声明状态保持器
        permission_;        // 声明权限管理器

    /**
     * Hash定位器
     *
     * @desc
     *      Locator = [ path ] [ ~ query ]
     *      path    = "/" [ *char *( "/" *char) ]
     *      query   = *qchar
     *      char    = ALPHA | DIGIT
     *      qchar   = char | "&" | "=".
     */
    locator_ = function() {
        var currentPath = '',
            currentQuery = '';

        /**
         * 获取location信息
         *
         * @return {string} 当前页面的地址.
         */
        function getLocation() {
            var hash = document.location.hash;
            if (hash) {
                return hash.substr(1);
            }

            return '';
        }

        /**
         * 控制定位器转向
         *
         * @param {string} loc location位置.
         * @param {boolean} preventDefault 不进入action的enter.
         */
        function redirect(loc, preventDefault) {
            // 未设置path时指向当前path
            if (/^~/.test(loc)) {
                loc = (currentPath || '/') + loc;
            }

            // 将location写入hash
            // 写入相同的hash在firefox和chrome下不会记录成2个历史记录项
            document.location.hash = loc;
            loc = document.location.hash.replace(/^#/, '');
            var locResult = parseLocation(loc),
                path = locResult.path,
                query = locResult.query;

            // 与当前location相同时不进行转向
            if (path === currentPath && query === currentQuery) {
                return;
            }

            // 存储当前信息
            currentPath = path;
            currentQuery = query;

            // 触发onredirect事件
            locator_.onredirect();

            // ie下使用iframe保存历史
            if (baidu.ie) {
                baidu.g(config_.CONTROL_IFRAME_ID).src =
                  config_.CONTROL_IFRAME_URL + '?' + loc;
            }
            controller_.forward(currentPath, currentQuery, loc, preventDefault);
        }

        /**
         * 解析location
         *
         * @private
         * @param {string} loc 需要解析的url地址.
         * @return {{path:string,query:string}} path&query.
         */
        function parseLocation(loc) {
            var pair = loc.match(/^([^~]+)(~(.*))?$/),
                re = {};
            re.path = pair[1];
            re.query = (pair.length === 4 ? pair[3] : '');

            return re;
        }

        /**
         * 获取参数集合
         *
         * @return {Object} url参数的集合.
         */
        function getParameterMap() {
            return parseQuery(currentQuery);
        }

        /**
         * 将参数解析为Map
         *
         * @param {string} query 参数字符串.
         * @return {Object} 参数对象.
         */
        function parseQuery(query) {
            query = query || '';
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
                    if (!baidu.browser.firefox) {
                        value = decodeURIComponent(value);
                    }

                    params[key] = value;
                }
            }

            return params;
        }

        /**
         * 获取location的path
         *
         * @return {string} 当前页面的location.
         */
        function getPath() {
            return currentPath;
        }

        /**
         * 获取location的query
         *
         * @return {string} 当前页面的url中的参数.
         */
        function getQuery() {
            return currentQuery;
        }

        /**
         * 初始化locator
         */
        function init() {
            var prevLocation;

            /**
             * @private
             */
            function changeListener() {
                var loc = locator_.getLocation();

                if (prevLocation !== loc) {
                    prevLocation = loc;
                    locator_.redirect(loc);
                }
            }

            if (baidu.ie) {
                var iframe = document.createElement('iframe'),
                    style = iframe.style,
                    size = 200,
                    pos = '-1000px';

                iframe.id = config_.CONTROL_IFRAME_ID;
                iframe.width = size;
                iframe.height = size;
                style.position = 'absolute';
                style.top = pos;
                style.left = pos;
                document.body.appendChild(iframe);
                iframe = null;
            }

            setInterval(changeListener, 100);
        }

        // 返回暴露的方法
        return {
            redirect : redirect,
            getPath : getPath,
            getQuery : getQuery,
            getLocation : getLocation,
            getParameterMap : getParameterMap,
            parseQuery : parseQuery,
            init : init,
            onredirect : function() {}
        };
    }();

    /**
     * 控制器
     *
     * @desc
     *      控制器负责将对应的path转向给相应的action对象处理.
     */
    controller_ = function() {
        var container = {},
            actionConfigMap = {},
            authorityMap = {},
            modules = [],
            currentPath,
            currentActionConfig,
            currentLocation,
            currentAction;


        /**
         * 跳转视图
         *
         * @param {Object} path 路径.
         * @param {Object} query 查询条件.
         * @param {string} loc 定位器.
         * @param {boolean} preventDefault 不进入action的enter.
         */
        function forward(path, query, loc, preventDefault) {
            // location相同时不做forward
            if (loc === currentLocation) {
                return;
            }

            // 组合所需的argument对象
            var argMap = {
                    type: 'main',
                    referer: currentLocation,
                    paramMap: locator_.parseQuery(query),
                    path: path,
                    domId: config_.MAIN_ELEMENT_ID
                };

            // 记录当前的locator
            currentLocation = loc;

            if (preventDefault) {
                return;
            }

            reset();

            currentActionConfig = container[path];  // 记录当前的action
            currentPath = path;             // 记录当前的path

            // 进入action
            currentAction = enterAction(currentActionConfig, argMap);
        }

        /**
         * 进入action
         *
         * @private
         * @param {{action:string,location:string,
         *         authority:string,noAuthLocation:string}|Object} actionConfig action配置对象.
         * @param {Object} argMap arg表.
         * @return {?er.Action} 需要进入的对象实例.
         */
        function enterAction(actionConfig, argMap) {
            if (!actionConfig) {
                return null;
            }

            var action = findAction(actionConfig),
                newAction = null,
                authority = actionConfig.authority;

            // 如果action不是单例，new一个实例
            if (baidu.lang.isFunction(action)) {
                action = new action();
            }

            if (controller_.permit) {
                if (authority && !controller_.permit(authority)) {
                    locator_.redirect(actionConfig.noAuthLocation || '/');
                    return;
                }
            }

            newAction = action.enter(argMap);

            if (newAction) {
                // XXX 为什么这么做呢？请看src/material/form.js
                return newAction;
            }

            return action;
        }

        /**
         * 重置会话。卸载控件并清除显示区域内容
         * FIXME action中的controlMap对用户来说应该是不可见的，应该和
         * ui.manager结合起来，提供一个接口来创建ui.widget，然后reset的
         * 时候来保证通过调用那个接口创建的widget都会被dispose掉
         * @private
         */
        function reset() {
            if (currentAction) {
                currentAction.leave();
            }

            // 清空内容区域
            baidu.g(config_.MAIN_ELEMENT_ID).innerHTML = '';
        }

        /**
         * 添加模块
         *
         * @param {Object} module 注册的模块.
         */
        function addModule(module) {
            modules.push(module);
        }

        /**
         * 初始化控制器
         */
        function init() {
            var i = 0,
                len = modules.length,
                j, len2,
                loc,
                module, actions, actionConfig, actionName;

            for (; i < len; i++) {
                module = modules[i];

                // 初始化module
                if (module.init) {
                    module.init();
                }

                // 注册action
                actions = module.config.action;
                if (actions) {
                    for (j = 0, len2 = actions.length; j < len2; j++) {
                        actionConfig = actions[j];
                        loc = actionConfig.location;
                        actionName = actionConfig.action;

                        container[loc] = actionConfig;
                        actionConfigMap[actionName] = actionConfig;
                    }
                }
            }

            locator_.init();
        }

        /**
         * 查找获取Action对象
         *
         * @private
         * @param {Object|string} propPath action配置对象或action的对象路径.
         * @return {?er.Action} null没找到,否则返回Action的实例.
         */
        function findAction(propPath) {
            if (!propPath) {
                return null;
            } else if ('object' === typeof propPath) {
                propPath = propPath.action;
            }

            var action = window,
                props = propPath.split('.'),
                i, len;

            for (i = 0, len = props.length; i < len; i++) {
                action = action[props[i]];
                if (!action) {
                    action = null;
                    break;
                }
            }

            return action;
        }

        /**
         * 加载一个action
         *
         * @param {string} domId 容器dom元素id.
         * @param {string} actionName 要载入的action名称.
         * @param {Object=} opt_argMap 一些可选的arg参数，默认情况下通过
         * loadPopup载入的view都是create的状态，而有时候需要modify的状态
         * 此时就需要opt_argMap来发挥作用了，因为很多时候判断是不是处于
         * modify的状态是根据argMap的path来判断的.
         * @return {?er.Action} 对应的Action实例.
         */
        function loadAction(domId, actionName, opt_argMap) {
            var actionConfig = actionConfigMap[actionName],
                argMap = {
                    type: 'popup',
                    domId: domId
                };

            if (opt_argMap) {
                baidu.extend(argMap, opt_argMap);
            }

            return enterAction(actionConfig, argMap);
        }

        return {
            forward: forward,
            addModule: addModule,
            init: init,
            loadAction: loadAction
        };
    }();

    /**
     * 运行时的上下文数据管理器
     *
     * @desc
     *      context为上下文数据提供环境.
     */
    context_ = function() {
        var applicationContext = {};    // application级别数据容器

        return {

            /**
             * 设置应用环境上下文
             *
             * @param {string|Object} key 环境变量名.
             * @param {Object} value 环境变量值.
             */
            set: function(key, value) {
                applicationContext[key] = value;
            },

            /**
             * 获取应用环境上下文变量
             *
             * @param {string} key 上下文变量名.
             * @return {Object} 环境变量值.
             */
            get: function(key) {
                return applicationContext[key];
            }
        };
    }();

    /**
     * 状态保持器
     *
     * @desc
     *      状态保持器能根据path保持相关Context狀態.
     */
    stateHolder_ = (function() {
        var stateMap = {};

        return {
            /**
             * 获取状态
             *
             * @param {string} path 状态名.
             * @return {Object} 状态参数表.
             */
            get: function(path) {
                return stateMap[path] || null;
            },

            /**
             * 设置状态
             *
             * @param {string} path 状态名.
             * @param {Object} state 状态對象.
             */
            set: function(path, state) {
                stateMap[path] = state;
            }
        };
    })();

    /**
     * 简易的模板解析器
     */
    template_ = function() {
        var container = {};

        /**
         * 解析模板变量的值。现在实际上只做字符串的静态绑定。
         *
         * @private
         * @param {string} varName 变量名.
         * @return {string} 变量的值.
         */
        function parseVariable(varName) {
            var match = varName.match(/:([a-z]+)$/);
            if (match && match.length > 1) {
                return parseVariableByType(
                  varName.replace(/:[a-z]+$/i, ''), match[1]);
            }

            return '';
        }

        /**
         * 解析带有类型的模板变量的值
         *
         * @private
         * @param {string} varName 变量名.
         * @param {string} type 变量类型，暂时为lang|config.
         * @return {string} 变量的值.
         */
        function parseVariableByType(varName, type) {
            var variable;

            type = type.toLowerCase();
            if (type === 'lang' || type === 'config') {
                // TODO：和dn解耦
                variable = dn[type][varName];
            } else {
                throw 'Not handled';
            }

            if (hasValue(variable)) {
                return variable;
            }

            return '';
        }

        // 返回暴露的方法
        return {
            /**
             * 获取指定模板target的HTML片段
             *
             * @param {string} target HTML片段的名称.
             * @return {string} HTML片段.
             */
            get : function(target) {
                return container[target] || '';
            },

            /**
             * 获取指定模板合并后的内容
             *
             * @param {string} view 模板名称.
             * @return {string} 合并之后的内容.
             */
            getMerged: function(view) {
                return template_.get(view).replace(
                        /\$\{([.:a-z0-9_]+)\}/ig,
                        function($0, $1) {
                            return parseVariable($1);
                        });
            },

            /**
             * 合并模板与数据
             *
             * @param {HTMLElement} output  要输出到的容器元素.
             * @param {Object}      view    视图模板.
             */
            merge: function(output, view) {
                if (output) {
                    output.innerHTML = template_.getMerged(view);
                }
            },

            /**
             * 解析模板
             *
             * @param {string} source 模板源.
             */
            parse : function(source) {
                var lines = source.split(/\r?\n/),
                    linesLen = lines.length,
                    linesIndex = 0,
                    targetStartRule = /<!--\s*target:\s*([a-zA-Z0-9]+)\s*-->/,
                    targetEndRule = /<!--\s*\/target\s*-->/,
                    importRule = /<!--\s*import:\s*([a-zA-Z0-9]+)\s*-->/,
                    key,
                    line,
                    segment,
                    current = [],
                    currentName, tempName,
                    currentContainer = {};

                // 逐行读取解析target
                for (; linesIndex < linesLen; linesIndex++) {
                    line = lines[linesIndex];

                    if (line.length <= 0) {
                        continue;
                    }

                    if (targetStartRule.test(line)) {
                        // 开始target的读取
                        tempName = RegExp.$1;
                        segment = line.split(targetStartRule);
                        addLine(segment[0]);
                        addTpl();
                        current = [];
                        currentName = tempName;
                        addLine(segment[2]);

                    } else if (targetEndRule.test(line)) {
                        // 结束target的读取
                        segment = line.split(targetEndRule);
                        addLine(segment[0]);
                        addTpl();

                    } else {
                        addLine(line);
                    }
                }
                addTpl();

                // 解析import
                for (key in currentContainer) {
                    if (container[key]) {
                        alert('Template: ' + key + ' already exists!');
                    }
                    container[key] = parseImport(currentContainer[key]);
                }

                /**
                 * 解析import
                 * @param {string} source HTML片段的名称.
                 * @return {string} source解析之后的内容.
                 */
                function parseImport(source) {
                    if (importRule.test(source)) {
                        return parseImport(source.replace(importRule,
                            function($0, $1) {
                                return currentContainer[$1] ||
                                       container[$1] ||
                                       '';
                            }
                        ));
                    }

                    return source;
                }

                /**
                 * 向临时容器里添加行
                 *
                 * @param {string} str 当前行的html代码.
                 */
                function addLine(str) {
                    if (str && currentName) {
                        current.push(str);
                    }
                }

                /**
                 * 将当前读出字符添加到模板变量
                 */
                function addTpl() {
                    if (currentName) {
                        if (currentName in currentContainer) {
                            alert('Template: ' + currentName + ' is exist');
                        } else {
                            currentContainer[currentName] = current.join('\n');
                        }
                    }
                    currentName = null;
                }
            }
        };
    }();

    /**
     * 权限管理器
     *
     * @desc
     *      权限管理器为页面提供了是否允许访问的权限控制，也能通过isAllow方法判断是否拥有权限。.
     */
    permission_ = function() {
        var permissible = {};

        function init(data) {
            var key, item;
            for (key in data) {
                item = data[key];
                if ('object' == typeof item) {
                    init(item);
                } else if (item) {
                    permissible[key] = item;
                }
            }
        }

        return {
            /**
             * 初始化权限数据
             *
             * @param {Object} data 权限数据.
             */
            init: init,

            /**
             * 判断是否拥有权限
             *
             * @param {string} name 权限名.
             * @return {boolean} true有权限，false没有权限.
             */
            isAllow: function(name) {
                return !!permissible[name];
            }
        };
    }();

    /**
     *
     */
    function init() {

    }

    /**
     * 判断变量是否有值。null或undefined时返回false
     *
     * @param {*} variable 需要检测的变量.
     * @return {boolean} true/false.
     */
    function hasValue(variable) {
        return !(variable === null || typeof variable == 'undefined');
    }

    var ramdomMap_ = {};

    /**
     * 获取不重复的随机串
     *
     * @param {number} len 随机串长度.
     * @return {string} 随机字符串.
     */
    function random(len) {
        len = len || 10;

        var chars = 'qwertyuiopasdfghjklzxcvbnm1234567890',
            charsLen = chars.length,
            len2 = len,
            rand = '';

        while (len2--) {
            rand += chars.charAt(Math.floor(Math.random() * charsLen));
        }

        if (ramdomMap_[rand]) {
            return random(len);
        }

        ramdomMap_[rand] = 1;
        return rand;
    }

    // 返回er框架主object，暴露相应的组件
    return {
        locator: locator_,
        config: config_,
        controller: controller_,
        context: context_,
        template: template_,
        permission: permission_,
        init: init
    };
}();
