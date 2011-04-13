goog.provide('baidu');

// (function() {
    /**
     * 声明baidu包
     * @type {Object}
     */
    var baidu = {version: '1-1-0'};

    /**
     * When defining a class Foo with an abstract method bar(), you can do:
     *
     * Foo.prototype.bar = goog.abstractMethod
     *
     * Now if a subclass of Foo fails to override bar(), an error
     * will be thrown when bar() is invoked.
     *
     * Note: This does not take the name of the function to override as
     * an argument because that would make it more difficult to obfuscate
     * our JavaScript code.
     *
     * @type {!Function}
     * @throws {Error} when invoked to indicate the method should be
     *   overridden.
     */
    baidu.abstractMethod = function() {
        throw Error('unimplemented abstract method');
    };

    baidu.emptyMethod = function() {
    };

    /**
     * Returns an object based on its fully qualified external name.  If you are
     * using a compilation pass that renames property names beware that using this
     * function will not find renamed properties.
     *
     * @param {string} name The fully qualified name.
     * @param {Object=} opt_obj The object within which to look; default is
     *     |window|.
     * @return {Object} The object or, if not found, null.
     */
    baidu.getObjectByName = function(name, opt_obj) {
        var parts = name.split('.');
        var cur = opt_obj || window;
        for (var part; part = parts.shift(); ) {
            if (cur[part] != null) {
                cur = cur[part];
            } else {
                return null;
            }
        }
        return cur;
    };

    /**
     * Adds a {@code getInstance} static method that always return the same instance
     * object.
     * @param {!Function} ctor The constructor for the class to add the static
     *     method to.
     */
    baidu.addSingletonGetter = function(ctor) {
      ctor.getInstance = function() {
        return ctor.instance_ || (ctor.instance_ = new ctor());
      };
    };

    /**
     * 声明baidu.ajax包
     */
    baidu.ajax = baidu.ajax || {};

    /**
     * 发送get请求的简单外观接口
     *
     * @param {string}   url                需要发送请求的地址.
     * @param {function(XMLHttpRequest)} onsuccess 请求成功之后调用的函数.
     * @return {XMLHttpRequest} 发送请求的xhr对象.
     */
    baidu.ajax.get = function(url, onsuccess) {
        return baidu.ajax.request(url, {'onsuccess': onsuccess});
    };

    /**
     * 发送post请求的简单外观接口
     *
     * @param {string}   url                需要发送请求的地址.
     * @param {string}   data               需要发送的数据.
     * @param {function(XMLHttpRequest)} onsuccess optional 请求成功之后调用的函数。传递的参数是xhr对象.
     * @return {XMLHttpRequest} 发送请求的xhr对象.
     */
    baidu.ajax.post = function(url, data, onsuccess) {
        return baidu.ajax.request(
            url,
            {
                'onsuccess': onsuccess,
                'method': 'POST',
                'data': data
            }
        );
    };

    /**
     * TODO 等到支持可选的field时候，就可以删掉|Object了。
     * @typedef {{data:?string, username:?string, password:?string,
     *  method:?string, headers:?Object, async:?boolean, cacheable:?boolean,
     *  onsuccess:function(XMLHttpRequest),onfailure:function(XMLHttpRequest),
     *  onstatus:function(XMLHttpRequest, number)}|!Object}
     */
    baidu.ajax.RequestOptions;

    /**
     * 使用XMLHttpRequest对象发送请求
     *
     * @param {string} url              需要发送请求的地址.
     * @param {baidu.ajax.RequestOptions} options 发送请求的其他可选参数.
     * @config {boolean}  async      是否是异步请求。默认是异步请求
     * @config {string}   data       需要发送的数据。如果是GET请求的话，不需要这个属性
     * @config {string}   username   用户名
     * @config {string}   password   密码
     * @config {string}   method     请求的类型，默认是GET
     * @config {Object}   headers    要设置的request headers
     * @config {Function} onsuccess  请求成功之后调用的函数。传递的参数是xhr对象
     * @config {Function} onfailure  请求失败之后调用的函数。传递的参数是xhr对象
     * @config {Function} onstatus   请求成功之后调用的函数。传递的参数是xhr对象和状态码
     * @config {Function} on状态码    如事件是on404时，如果返回码是404，调用这个函数
     * @return {XMLHttpRequest} 发送请求的xhr对象.
     */
    baidu.ajax.request = function(url, options) {
        /**
         * readyState发生变更时调用
         *
         * @ignore
         */
        function stateChangeHandler() {
            if (xhr.readyState == 4) {
                try {
                    var stat = xhr.status;
                } catch (ex) {
                    // 在请求时，如果网络中断，Firefox会无法取得status
                    fire('failure');
                    return;
                }

                fire(stat);

                // http://www.never-online.net/blog/article.asp?id=261
                // case 12002: // Server timeout
                // case 12029: // dropped connections
                // case 12030: // dropped connections
                // case 12031: // dropped connections
                // case 12152: // closed by server
                // case 13030: // status and statusText are unavailable

                // IE error sometimes returns 1223 when it
                // should be 204, so treat it as success
                if ((stat >= 200 && stat < 300)
                    || stat == 304
                    || stat == 1223) {
                    fire('success');
                } else {
                    fire('failure');
                }

                /*
                 * NOTE: Testing discovered that for some bizarre reason, on Mozilla, the
                 * JavaScript <code>XmlHttpRequest.onreadystatechange</code> handler
                 * function maybe still be called after it is deleted. The theory is that the
                 * callback is cached somewhere. Setting it to null or an empty function does
                 * seem to work properly, though.
                 *
                 * On IE, there are two problems: Setting onreadystatechange to null (as
                 * opposed to an empty function) sometimes throws an exception. With
                 * particular (rare) versions of jscript.dll, setting onreadystatechange from
                 * within onreadystatechange causes a crash. Setting it from within a timeout
                 * fixes this bug (see issue 1610).
                 *
                 * End result: *always* set onreadystatechange to an empty function (never to
                 * null). Never set onreadystatechange from within onreadystatechange (always
                 * in a setTimeout()).
                 */
                window.setTimeout(
                    function() {
                        // 避免内存泄露
                        xhr.onreadystatechange = new Function();
                        if (async) {
                            xhr = null;
                        }
                    }, 0);
            }
        }

        /**
         * 获取XMLHttpRequest对象
         *
         * @ignore
         * @return {?XMLHttpRequest} XMLHttpRequest对象.
         */
        function getXHR() {
            if (window['ActiveXObject']) {
                try {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                } catch (e) {
                    try {
                        return new ActiveXObject('Microsoft.XMLHTTP');
                    } catch (e2) {}
                }
            }
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
            return null;
        }

        /**
         * 触发事件
         *
         * @ignore
         * @param {string} type 事件类型.
         */
        function fire(type) {
            type = 'on' + type;
            var handler = eventHandlers[type],
                globelHandler = baidu.ajax[type];

            // 不对事件类型进行验证
            if (handler) {
                if (type != 'onsuccess') {
                    handler(xhr);
                } else {
                    handler(xhr, xhr.responseText);
                }
            } else if (globelHandler) {
                //onsuccess不支持全局事件
                if (type == 'onsuccess') {
                    return;
                }
                globelHandler(xhr);
            }
        }


        options = options || {};
        var data = options.data || '',
            async = !(options.async === false),
            username = options.username || '',
            password = options.password || '',
            method = (options.method || 'GET').toUpperCase(),
            headers = options.headers || {},
            cacheable = options.cacheable || false,
            eventHandlers = {},
            key, xhr;

        for (key in options) {
            // 将options参数中的事件参数复制到eventHandlers对象中
            // 这里复制所有options的成员，eventHandlers有冗余
            // 但是不会产生任何影响，并且代码紧凑
            eventHandlers[key] = options[key];
        }

        headers['X-Request-By'] = 'baidu.ajax';


        try {
            xhr = getXHR();

            if (method == 'GET') {
                if (data) {
                    url += (url.indexOf('?') >= 0 ? '&' : '?') + data;
                    data = null;
                }
                if (!cacheable) {
                    url += (url.indexOf('?') >= 0 ? '&' : '?') + 'b' + (new Date()).getTime() + '=1';
                }
            }

            if (username) {
                xhr.open(method, url, async, username, password);
            } else {
                xhr.open(method, url, async);
            }

            if (async) {
                xhr.onreadystatechange = stateChangeHandler;
            }

            // 在open之后再进行http请求头设定
            if (method == 'POST') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            }

            for (key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }

            fire('beforerequest');
            xhr.send(data);

            if (!async) {
                stateChangeHandler();
            }
        } catch (ex) {
            fire('failure');
        }

        return xhr;
    };

    /**
     * 声明baidu.browser包
     */
    baidu.browser = baidu.browser || {};

    (function() {
    var match = null;
    /**
     * 判断是否为safari浏览器
     */
    if (match = /chrome\/(\d+\.\d)/i.exec(navigator.userAgent)) {
        baidu.browser.chrome = parseFloat(match[1]);
    }

    /**
     * 判断是否为firefox浏览器
     */
    if (match = /firefox\/(\d+\.\d)/i.exec(navigator.userAgent)) {
        baidu.browser.firefox = parseFloat(match[1]);
    }

    /**
     * 判断是否为ie浏览器
     */
    if (match = /msie (\d+\.\d)/i.exec(navigator.userAgent)) {
        baidu.ie = baidu.browser.ie = parseFloat(match[1]);
    }

    /**
     * 判断是否为isGecko
     */
    baidu.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);

    /**
     * 判断是否为标准模式
     */
    baidu.browser.isStrict = document.compatMode == 'CSS1Compat';

    /**
     * 判断是否为isWebkit
     */
    baidu.browser.isWebkit = /webkit/i.test(navigator.userAgent);

    /**
     * 判断是否为maxthon浏览器
     */
    try {
        if (match = /(\d+\.\d)/.exec(window.external['max_version'])) {
            baidu.browser.maxthon = parseFloat(match[1]);
        }
    } catch (e) {}

    /**
     * 判断是否为opera浏览器
     */
    if (match = /opera\/(\d+\.\d)/i.exec(navigator.userAgent)) {
        baidu.browser.opera = parseFloat(match[1]);
    }

    /**
     * 判断是否为safari浏览器
     */
    if ((match = (/(\d+\.\d)(\.\d)?\s+safari/i.exec(navigator.userAgent)) && !/chrome/i.test(navigator.userAgent))) {
        baidu.browser.safari = parseFloat(match[1]);
    }
    })();

    /**
     * 声明baidu.date包
     * @type {Object}
     */
    baidu.date = baidu.date || {};

    /**
     * 对目标日期对象进行格式化
     *
     * @param {Date}  source  目标日期对象.
     * @param {string}  pattern 日期格式化规则.
     * @return {string} 格式化后的字符串.
     */
    baidu.date.format = function(source, pattern) {
        if ('string' != typeof pattern) {
            return source.toString();
        }

        function replacer(patternPart, result) {
            pattern = pattern.replace(patternPart, result);
        }

        var pad = baidu.number.pad,
            year = source.getFullYear(),
            month = source.getMonth() + 1,
            date2 = source.getDate(),
            hours = source.getHours(),
            minutes = source.getMinutes(),
            seconds = source.getSeconds();

        replacer(/yyyy/g, pad(year, 4));
        replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
        replacer(/MM/g, pad(month, 2));
        replacer(/M/g, month);
        replacer(/dd/g, pad(date2, 2));
        replacer(/d/g, date2);

        replacer(/HH/g, pad(hours, 2));
        replacer(/H/g, hours);
        replacer(/hh/g, pad(hours % 12, 2));
        replacer(/h/g, hours % 12);
        replacer(/mm/g, pad(minutes, 2));
        replacer(/m/g, minutes);
        replacer(/ss/g, pad(seconds, 2));
        replacer(/s/g, seconds);

        return pattern;
    };

    /**
     * 将目标字符串转换成日期对象
     *
     * @param {string} source 目标字符串.
     * @return {?Date} 转换后的日期对象.
     */
    baidu.date.parse = function(source) {
        var match = null;
        if (match = /^(2\d{3})[-\/]?([01]\d)[-\/]?([0-3]\d)$/.exec(source)) {
            return new Date(
                parseInt(match[1], 10),
                parseInt(match[2], 10) - 1,
                parseInt(match[3], 10)
            );
        }

        return null;
    };

    /**
     * 声明baidu.dom包
     */
    baidu.dom = baidu.dom || {};

    /**
     * @param {string} htmlString 需要转化的html代码.
     * @return {!Node} Document Framgment.
     */
    baidu.dom.htmlToDocumentFragement = function(htmlString) {
        var doc = document,
            tempDiv = doc.createElement('div');
        if (baidu.ie > 0) {
            // @see http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx#1
            tempDiv.innerHTML = '<br>' + htmlString;
            tempDiv.removeChild(tempDiv.firstChild);
        } else {
            tempDiv.innerHTML = htmlString;
        }

        if (tempDiv.childNodes.length == 1) {
            return /** @type {!Node} */ (tempDiv.removeChild(tempDiv.firstChild));
        } else {
            var fragment = doc.createDocumentFragment();
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }
            return fragment;
        }
    };

    /**
     * 从目标元素指定的方向搜索元素
     *
     * @param {HTMLElement|string} element   目标元素或目标元素的id.
     * @param {string}             direction 遍历的方向名称，取值为previousSibling,nextSibling.
     * @param {string}             start     遍历的开始位置，取值为firstChild,lastChild,previousSibling,nextSibling.
     * @return {HTMLElement} 搜索到的元素，如果没有找到，返回 null.
     */
    baidu.dom._matchNode = function(element, direction, start) {
        element = baidu.dom.g(element);

        for (var node = element[start]; node; node = node[direction]) {
            if (node.nodeType == 1) {
                return node;
            }
        }

        return null;
    };

    /**
     * 获取目标元素的第一个子元素节点
     *
     * @param {HTMLElement|string} element 目标元素或目标元素的id.
     * @return {HTMLElement} 第一个子元素，如果没有找到，返回 null.
     */
    baidu.dom.first = function(element) {
        return baidu.dom._matchNode(element, 'nextSibling', 'firstChild');
    };

    /**
     * 获取目标元素之后的一个元素节点
     *
     * @param {HTMLElement|string} element 目标元素或目标元素的id.
     * @return {HTMLElement} 之后的元素节点，如果没有找到，返回 null.
     */
    baidu.dom.next = function(element) {
        return baidu.dom._matchNode(element, 'nextSibling', 'nextSibling');
    };

    /**
     * 提供给setAttr与getAttr方法作名称转换使用
     * ie6,7下class要转换成className
     */

    baidu.dom._NAME_ATTRS = {
        'cellpadding': 'cellPadding',
        'cellspacing': 'cellSpacing',
        'colspan': 'colSpan',
        'rowspan': 'rowSpan',
        'valign': 'vAlign',
        'usemap': 'useMap',
        'frameborder': 'frameBorder'
    };

    if (baidu.browser.ie < 8) {
        baidu.dom._NAME_ATTRS['for'] = 'htmlFor';
        baidu.dom._NAME_ATTRS['class'] = 'className';
    } else {
        baidu.dom._NAME_ATTRS['htmlFor'] = 'for';
        baidu.dom._NAME_ATTRS['className'] = 'class';
    }

    /**
     * 设置DOM元素的属性值
     * 获取元素属性使用getAttr方法
     *
     * @param {Element|string} element 目标元素或目标元素的id.
     * @param {string} key 属性名称.
     * @param {string} value 属性值.
     * @return {Element} 被操作的DOM元素.
     */
    baidu.dom.setAttr = function(element, key, value) {
        element = baidu.dom.g(element);
        if ('style' == key) {
            element.style.cssText = value;
        }
        else {
            key = baidu.dom._NAME_ATTRS[key] || key;
            element.setAttribute(key, value);
        }
        return element;
    };

    // 声明快捷方法
    baidu.setAttr = baidu.dom.setAttr;

    /**
     * 提供给setStyle与getStyle使用
     */
    baidu.dom._styleFixer = baidu.dom._styleFixer || {};

    /**
     * 提供给setStyle与getStyle使用
     */
    baidu.dom._styleFixer.opacity = baidu.browser.ie ? {
        get: function(element) {
            var filter = element.style.filter;
            filter && filter.indexOf('opacity=') >= 0 ? (parseFloat(filter.match(/opacity=([^)]*)/)[1]) / 100) + '' : '1';
        },

        set: function(element, value) {
            var style = element.style;
            // 只能Quirks Mode下面生效??
            style.filter = (style.filter || '').replace(/alpha\([^\)]*\)/gi, '') + (value == 1 ? '' : 'alpha(opacity=' + value * 100 + ')');
            // IE filters only apply to elements with "layout."
            style.zoom = 1;
        }
    } : null;

    /**
     * 添加或者删除一个节点中的指定class，如果已经有，就删除；否则添加
     * @static
     *
     * @param {HTMLElement|string}  element   目标元素或目标元素的id.
     * @param {string}        className 指定的className。允许同时添加多个class，中间使用空白符分隔.
     *
     * @description 传入多个class时，只要其中有一个class不在当前元素中，则添加所有class，否则删除所有class。
     *
     */
    baidu.dom.toggleClass = function(element, className) {
        if (baidu.dom.hasClass(element, className)) {
            baidu.dom.removeClass(element, className);
        }else {
            baidu.dom.addClass(element, className);
        }
    };

    /**
     * 判断一个DOM元素或一个字符串内是否存在指定的className
     * @static
     *
     * @param {HTMLElement|string}  element   目标元素或目标元素的id.
     * @param {string}        className 要判断的class，可以是多个className用空格拼接.
     *
     * @return {boolean}            如果要寻找的classname有一个或多个不在元素的className中，返回false.
     */
    baidu.dom.hasClass = function(element, className) {
        element = baidu.dom.g(element);
        var classArray = baidu.string.trim(className).split(/\s+/),
            len = classArray.length;

        className = element.className.split(/\s+/).join(' ');

        while (len--) {
            if (!(new RegExp('(^| )' + classArray[len] + '( |\x24)')).test(className)) {
                return false;
            }
        }
        return true;
    };

    /**
     * 添加目标元素的className
     * 使用者应保证提供的className合法性，不应包含不合法字符
     * className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html
     *
     * @param {Element|string} element   目标元素或目标元素的id.
     * @param {string}             className 要添加的class。允许同时添加多个class，中间使用空白符分隔.
     * @return {Element} 被操作的DOM元素.
     */
    baidu.dom.addClass = function(element, className) {
        element = baidu.dom.g(element);

        var trim = baidu.string.trim,
            classes = trim(className).split(/\s+/),
            len = classes.length;
        className = element.className.split(/\s+/).join(' ');

        while (len--) {
            (new RegExp('(^| )' + classes[len] + '( |$)')).test(className)
                && classes.splice(len, 1);
        }

        element.className = trim(className + ' ' + classes.join(' '));
        return element;
    };

    // 声明快捷方法
    baidu.addClass = baidu.dom.addClass;

    /**
     * 获取目标元素的直接子元素列表
     *
     * @param {HTMLElement|string} element 目标元素或目标元素的id.
     * @return {Array} DOM元素列表.
     */
    baidu.dom.children = function(element) {
        element = baidu.dom.g(element);

        for (var children = [], tmpEl = element.firstChild; tmpEl; tmpEl = tmpEl.nextSibling) {
            if (tmpEl.nodeType == 1) {
                children.push(tmpEl);
            }
        }

        return children;
    };


    /**
     * 从文档中获取指定的DOM元素
     *
     * @param {string|Element} id 元素的id或DOM元素.
     * @return {?Element} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数.
     */
    baidu.dom.g = function(id) {
        if ('string' == typeof id || id instanceof String) {
            return document.getElementById(id);
        } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9 || id.nodeType == 11)) {
            return id;
        }
        return null;
    };

    // 声明快捷方法
    baidu.g = baidu.G = baidu.dom.g;


    /**
     * 获取目标元素所属的document对象
     *
     * @param {Element|string} element 目标元素或目标元素的id.
     * @return {Document|Element} element所属的document对象.
     */
    baidu.dom.getDocument = function(element) {
        element = baidu.dom.g(element);
        return element.nodeType == 9 ? element : element.ownerDocument || element.document;
    };

    /*
     * 获取目标元素元素相对于整个文档左上角的位置
     *
     * @param {Element|string} element 目标元素或目标元素的id
     * @return {{left:number,top:number}}
     */
    baidu.dom.getPosition = function(element) {
        var doc = baidu.dom.getDocument(element),
            browser = baidu.browser;

        element = baidu.dom.g(element);

        // Gecko browsers normally use getBoxObjectFor to calculate the position.
        // When invoked for an element with an implicit absolute position though it
        // can be off by one. Therefor the recursive implementation is used in those
        // (relatively rare) cases.
        var BUGGY_GECKO_BOX_OBJECT = browser.isGecko > 0 &&
                                     doc.getBoxObjectFor &&
                                     baidu.dom.getStyle(element, 'position') == 'absolute' &&
                                     (element.style.top === '' || element.style.left === '');

        // NOTE(arv): If element is hidden (display none or disconnected or any the
        // ancestors are hidden) we get (0,0) by default but we still do the
        // accumulation of scroll position.

        var pos = {'left': 0, 'top': 0};

        var viewportElement = (browser.ie && !browser.isStrict) ? doc.body : doc.documentElement;

        if (element == viewportElement) {
            // viewport is always at 0,0 as that defined the coordinate system for this
            // function - this avoids special case checks in the code below
            return pos;
        }

        var parent = null;
        var box;

        if (element.getBoundingClientRect) { // IE and Gecko 1.9+
            box = element.getBoundingClientRect();

            pos.left = Math.floor(box.left) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
            pos.top = Math.floor(box.top) + Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);

            // IE adds the HTML element's border, by default it is medium which is 2px
            // IE 6 and 7 quirks mode the border width is overwritable by the following css html { border: 0; }
            // IE 7 standards mode, the border is always 2px
            // This border/offset is typically represented by the clientLeft and clientTop properties
            // However, in IE6 and 7 quirks mode the clientLeft and clientTop properties are not updated when overwriting it via CSS
            // Therefore this method will be off by 2px in IE while in quirksmode
            pos.left -= doc.documentElement.clientLeft;
            pos.top -= doc.documentElement.clientTop;

            if (browser.ie && !browser.isStrict) {
                pos.left -= 2;
                pos.top -= 2;
            }
        } else if (doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT/* && !goog.style.BUGGY_CAMINO_*/) { // gecko
            // Gecko ignores the scroll values for ancestors, up to 1.9.  See:
            // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
            // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

            box = doc.getBoxObjectFor(element);
            var vpBox = doc.getBoxObjectFor(viewportElement);
            pos.left = box.screenX - vpBox.screenX;
            pos.top = box.screenY - vpBox.screenY;
        } else { // safari/opera
            parent = element;

            do {
                pos.left += parent.offsetLeft;
                pos.top += parent.offsetTop;

                // In Safari when hit a position fixed element the rest of the offsets
                // are not correct.
                if (browser.isWebkit > 0 && baidu.dom.getStyle( /** @type {HTMLElement} */ (parent), 'position') == 'fixed') {
                    pos.left += doc.body.scrollLeft;
                    pos.top += doc.body.scrollTop;
                    break;
                }

                parent = parent.offsetParent;
            } while (parent && parent != element);

            // opera & (safari absolute) incorrectly account for body offsetTop
            if (browser.opera > 0 || (browser.isWebkit > 0 && baidu.dom.getStyle(element, 'position') == 'absolute')) {
                pos.top -= doc.body.offsetTop;
            }

            // accumulate the scroll positions for everything but the body element
            parent = element.offsetParent;
            while (parent && parent != doc.body) {
                pos.left -= parent.scrollLeft;
                // see https://bugs.opera.com/show_bug.cgi?id=249965
                if (!browser.opera || parent.tagName != 'TR') {
                    pos.top -= parent.scrollTop;
                }
                parent = parent.offsetParent;
            }
        }

        return pos;
    };

    /**
     * 获取DOM元素的样式值
     *
     * @param {Element|string} element 目标元素或目标元素的id.
     * @param {string}             key     要获取的样式名.
     * @return {string} 要获取的样式值.
     */
    baidu.dom.getStyle = function(element, key) {
        var dom = baidu.dom;

        element = dom.g(element);
        key = baidu.string.toCamelCase(key);

        var value = element.style[key];

        // 在取不到值的时候，用fixer进行修正
        if (!value) {
            var fixer = dom._styleFixer[key],
                /* 在IE下，Element没有在文档树上时，没有currentStyle属性 */
                style = element.currentStyle || (baidu.browser.ie ? element.style : window.getComputedStyle(element, null));

            if ('string' == typeof fixer) {
                value = style[fixer];
            } else if (fixer && fixer.get) {
                value = fixer.get(element, style);
            } else {
                value = style[key];
            }
        }

        /* 检查结果过滤器 */
        if (fixer = dom._styleFilter) {
            value = fixer.filter(key, value, 'get');
        }

        return value;
    };

    // 声明快捷方法
    baidu.getStyle = baidu.dom.getStyle;


    /**
     * 隐藏目标元素
     *
     * @param {Element|string} element 目标元素或目标元素的id.
     * @return {Element|string} 被操作的DOM元素.
     */
    baidu.dom.hide = function(element) {
        if (element) {
            element = baidu.dom.g(element);
            element.style.display = 'none';
        }
        return element;
    };

    // 声明快捷方法
    baidu.hide = baidu.dom.hide;

    /**
     * 将目标元素添加到基准元素之后
     *
     * @param {Element|string} newElement   被添加的目标元素.
     * @param {Element|string} existElement 基准元素.
     * @return {Element} 被添加的DOM元素.
     */
    baidu.dom.insertAfter = function(newElement, existElement) {
        var g, existParent;
        g = baidu.dom.g;
        newElement = g(newElement);
        existElement = g(existElement);
        existParent = existElement.parentNode;

        if (existParent) {
            existParent.insertBefore(newElement, existElement.nextSibling);
        }
        return newElement;
    };

    /**
     * 将目标元素添加到基准元素之前
     *
     * @param {Element|string} newElement   被添加的目标元素.
     * @param {Element|string} existElement 基准元素.
     * @return {Element} 被添加的DOM元素.
     */
    baidu.dom.insertBefore = function(newElement, existElement) {
        var g, existParent;
        g = baidu.dom.g;
        newElement = g(newElement);
        existElement = g(existElement);
        existParent = existElement.parentNode;

        if (existParent) {
            existParent.insertBefore(newElement, existElement);
        }

        return newElement;
    };


    /**
     * 从DOM树上移除目标元素
     *
     * @param {Element|string} element 必需，目标元素或目标元素的id.
     * @return {Element} 被操作的DOM元素.
     */
    baidu.dom.remove = function(element) {
        element = baidu.dom.g(element);
        var tmpEl = element.parentNode;
        if (tmpEl) {
            tmpEl.removeChild(element);
        }
        return element;
    };

    /**
     * 移除目标元素的className
     * 使用者应保证提供的className合法性，不应包含不合法字符
     * className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html
     *
     * @param {Element|string} element   目标元素或目标元素的id.
     * @param {string}             className 要移除的class，允许同时移除多个class，中间使用空白符分隔.
     * @return {Element} 被操作的DOM元素.
     */
    baidu.dom.removeClass = function(element, className) {
        element = baidu.dom.g(element);
        var trim = baidu.string.trim;

        element.className =
            trim(element.className.split(/\s+/).join('  ')
                    .replace(
                        new RegExp('(^| )('
                            + trim(className).split(/\s+/).join('|')
                            + ')( |\x24)', 'g'),
                        ' ')
                    .replace(/\s+/g, ' '));

        return element;
    };

    // 声明快捷方法
    baidu.removeClass = baidu.dom.removeClass;

    /**
     * 设置DOM元素的样式值
     *
     * @param {Element|string}  element 目标元素或目标元素的id.
     * @param {string}              key     要设置的样式名.
     * @param {string}              value   要设置的样式值.
     * @return {Element} 被操作的DOM元素.
     */
    baidu.dom.setStyle = function(element, key, value) {
        var dom = baidu.dom, fixer;

        // 放弃了对firefox 0.9的opacity的支持
        element = dom.g(element);
        key = baidu.string.toCamelCase(key);

        if (fixer = dom._styleFilter) {
            value = fixer.filter(key, value, 'set');
        }

        fixer = dom._styleFixer[key];
        (fixer && fixer.set) ? fixer.set(element, value) : (element.style[fixer || key] = value);

        return element;
    };

    // 声明快捷方法
    baidu.setStyle = baidu.dom.setStyle;

    /**
     * 批量设置DOM元素的样式值
     *
     * @param {Element|string} element 目标元素或目标元素的id.
     * @param {Object}             styles  要设置的样式集合.
     * @return {Element} 被操作的DOM元素.
     */
    baidu.dom.setStyles = function(element, styles) {
        element = baidu.dom.g(element);

        for (var key in styles) {
            baidu.dom.setStyle(element, key, styles[key]);
        }

        return element;
    };

    // 声明快捷方法
    baidu.setStyles = baidu.dom.setStyles;

    /**
     * 显示目标元素
     * 存在的问题是：如果在CSS中定义的样式是display:none
     *
     * @param {Element|string} element 目标元素或目标元素的id.
     * @return {Element|string} 被操作的DOM元素.
     */
    baidu.dom.show = function(element) {
        if (element) {
            element = baidu.dom.g(element);
            element.style.display = '';
        }
        return element;
    };

    // 声明快捷方法
    baidu.show = baidu.dom.show;

    /**
     * 改变目标元素的显示/隐藏状态
     * 存在的问题是：如果在CSS中定义的样式是display:none
     *
     * @param {Element|string} element 目标元素或目标元素的id.
     * @return {Element} 被操作的DOM元素.
     */
    baidu.dom.toggle = function(element) {
        element = baidu.dom.g(element);
        element.style.display = element.style.display == 'none' ? '' : 'none';

        return element;
    };

    /**
     * 声明baidu.event包
     */
    baidu.event = baidu.event || {};

    /**
     * 事件对象构造器
     * 监听框架中事件时需要传入框架window对象
     * @constructor
     * @param {Event}   event        事件对象.
     * @param {Window}  win optional 窗口对象，默认为window.
     */
    baidu.event.EventArg = function(event, win) {
        win = win || window;
        event = event || win.event;
        var doc = win.document;

        this.target = event.srcElement;
        this.keyCode = event.which;
        for (var k in event) {
            var item = event[k];
            // 避免拷贝preventDefault等事件对象方法
            if ('function' != typeof item) {
                this[k] = item;
            }
        }

        if (!this.pageX && this.pageX !== 0) {
            this.pageX = (event.clientX || 0)
                            + (doc.documentElement.scrollLeft
                                || doc.body.scrollLeft);
            this.pageY = (event.clientY || 0)
                            + (doc.documentElement.scrollTop
                                || doc.body.scrollTop);
        }
        this._event = event;
    };

    /**
     * 阻止事件的默认行为
     */
    baidu.event.EventArg.prototype.preventDefault = function() {
        if (this._event.preventDefault) {
            this._event.preventDefault();
        } else {
            this._event.returnValue = false;
        }
        return this;
    };

    /**
     * 停止事件的传播
     */
    baidu.event.EventArg.prototype.stopPropagation = function() {
        if (this._event.stopPropagation) {
            this._event.stopPropagation();
        } else {
            this._event.cancelBubble = true;
        }
        return this;
    };

    /**
     * 停止事件
     */
    baidu.event.EventArg.prototype.stop = function() {
        return this.stopPropagation().preventDefault();
    };

    /**
     * 事件监听器的存储表
     * @private
     */
    baidu.event._listeners = baidu.event._listeners || [];

    /**
     * 卸载所有事件监听器
     * @private
     */
    baidu.event._unload = function() {
        var lis = baidu.event._listeners,
            len = lis.length,
            standard = !!window.removeEventListener,
            item, el;

        while (len--) {
            item = lis[len];
            el = item[0];
            if (el.removeEventListener) {
                el.removeEventListener(item[1], item[3], false);
            } else if (el.detachEvent) {
                el.detachEvent('on' + item[1], item[3]);
            }
        }

        if (standard) {
            window.removeEventListener('unload', baidu.event._unload, false);
        } else {
            window.detachEvent('onunload', baidu.event._unload);
        }
    };

    // 在页面卸载的时候，将所有事件监听器移除
    if (window.attachEvent) {
        window.attachEvent('onunload', baidu.event._unload);
    } else {
        window.addEventListener('unload', baidu.event._unload, false);
    }

    /**
     * 获取扩展的事件对象
     *
     * @param {Event}  event 原生事件对象.
     * @param {Window} win   窗体对象.
     * @return {baidu.event.EventArg} 扩展的事件对象.
     */
    baidu.event.get = function(event, win) {
        return new baidu.event.EventArg(event, win);
    };

    /**
     * 获取键盘事件的键值
     *
     * @param {Event} event 事件对象.
     * @return {number} 键盘事件的键值.
     */
    baidu.event.getKeyCode = function(event) {
        return event.which || event.keyCode;
    };

    /**
     * 获取鼠标事件的鼠标x坐标
     *
     * @param {Event} event 事件对象.
     * @return {number} 鼠标事件的鼠标x坐标.
     */
    baidu.event.getPageX = function(event) {
        var result = event.pageX,
            doc = document;
        if (!result && result !== 0) {
            result = (event.clientX || 0)
                        + (doc.documentElement.scrollLeft
                            || doc.body.scrollLeft);
        }
        return result;
    };

    /**
     * 获取鼠标事件的鼠标y坐标
     *
     * @param {Event} event 事件对象.
     * @return {number} 鼠标事件的鼠标y坐标.
     */
    baidu.event.getPageY = function(event) {
        var result = event.pageY,
            doc = document;
        if (!result && result !== 0) {
            result = (event.clientY || 0)
                        + (doc.documentElement.scrollTop
                            || doc.body.scrollTop);
        }
        return result;
    };

    /**
     * 获取事件的触发元素
     *
     * @param {Event} event 事件对象.
     * @return {EventTarget|Element} 事件的触发元素.
     */
    baidu.event.getTarget = function(event) {
        return event.target || event.srcElement;
    };

    /**
     * 为目标元素添加事件监听器
     *
     * @param {Element|string|Window} element  目标元素或目标元素id.
     * @param {string}                    type     事件类型.
     * @param {Function}                  listener 事件监听器.
     * @return {Element|Window} 目标元素.
     */
    baidu.event.on = function(element, type, listener) {
        type = type.replace(/^on/i, '');
        if ('string' == typeof element) {
            element = baidu.dom.g(element);
        }

        // 事件监听器挂载
        if (element.addEventListener) {
            element.addEventListener(type, listener, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, listener);
        }

        return element;
    };

    // 声明快捷方法
    baidu.on = baidu.event.on;

    /**
     * 阻止事件的默认行为
     *
     * @param {Event} event 事件对象.
     */
    baidu.event.preventDefault = function(event) {
       if (event.preventDefault) {
           event.preventDefault();
       } else {
           event.returnValue = false;
       }
    };

    /**
     * 停止事件
     *
     * @param {Event} event 事件对象.
     */
    baidu.event.stop = function(event) {
        baidu.event.stopPropagation(event);
        baidu.event.preventDefault(event);
    };

    /**
     * 停止事件的传播
     *
     * @param {Event} event 事件对象.
     */
    baidu.event.stopPropagation = function(event) {
       if (event.stopPropagation) {
           event.stopPropagation();
       } else {
           event.cancelBubble = true;
       }
    };

    /**
     * 为目标元素移除事件监听器
     *
     * @param {Element|string|Window} element  目标元素或目标元素id.
     * @param {string}                    type     事件类型.
     * @param {Function}                  listener 事件监听器.
     * @return {Element|Window} 目标元素.
     */
    baidu.event.un = function(element, type, listener) {
        if ('string' == typeof element) {
            element = baidu.dom.g(element);
        }
        type = type.replace(/^on/i, '');

        if (element.removeEventListener) {
            element.removeEventListener(type, listener, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, listener);
        }

        return element;
    };

    // 声明快捷方法
    baidu.un = baidu.event.un;

    /**
     * 声明baidu.json包
     */
    baidu.json = baidu.json || {};

    /**
     * 声明baidu.lang包
     */
    baidu.lang = baidu.lang || {};

    /**
     * 判断目标参数是否Array对象
     *
     * @param {*} source 目标参数.
     * @return {boolean} 类型判断结果.
     */
    baidu.lang.isArray = function(source) {
        return '[object Array]' == Object.prototype.toString.call(
                                   /** @type {Object}*/ (source));
    };

    baidu.lang.isFunction = function(source) {
        return 'function' == typeof source;
    };

    /**
     * 判断目标参数是否Element对象
     *
     * @param {*} source 目标参数.
     * @return {boolean} 类型判断结果.
     */
    baidu.lang.isElement = function(source) {
        return !!(source && source.nodeName && source.nodeType == 1);
    };

    baidu.lang.hasValue = function(source) {
        return !(source === null || typeof source == 'undefined');
    };

    /**
     * 判断目标参数是否number类型或Number对象
     *
     * @param {*} source 目标参数.
     * @return {boolean} 类型判断结果.
     */
    baidu.lang.isNumber = function(source) {
        return '[object Number]' == Object.prototype.toString.call(
                                    /** @type {Object}*/ (source));
    };

    /**
     * 判断目标参数是否Object对象
     *
     * @param {*} source 目标参数.
     * @return {boolean} 类型判断结果.
     */
    baidu.lang.isObject = function(source) {
        return 'function' == typeof source || !!(source && 'object' == typeof source);
    };

    // 声明快捷方法
    baidu.isObject = baidu.lang.isObject;

    /**
     * 判断目标参数是否string类型或String对象
     *
     * @param {*} source 目标参数.
     * @return {boolean} 类型判断结果.
     */
    baidu.lang.isString = function(source) {
        return '[object String]' == Object.prototype.toString.call(
                                    /** @type {Object}*/ (source));
    };

    /**
     * 是否是一个简单的对象
     * @param {*} source 需要判断的对象.
     * @return {boolean} true是，false不是.
     */
    baidu.lang.isPlainObject = function(source) {
        return '[object Object]' == Object.prototype.toString.call(
                                    /** @type {Object}*/ (source));
    };

    // 声明快捷方法
    baidu.isString = baidu.lang.isString;

    /**
    * 为类型构造器建立继承关系
    * @param {Function} subClass 子类构造器.
    * @param {Function} superClass 父类构造器.
    * @param {string} className 类名标识.
    * 使subClass继承superClass的prototype，因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。
    * 这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。
    * 注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子.
    * @see baidu.lang.Class
    */
    baidu.lang.inherits = function(subClass, superClass, className) {
       var key, proto, selfProps = subClass.prototype, clazz = new Function();
       clazz.prototype = superClass.prototype;
       proto = subClass.prototype = new clazz();
       for (key in selfProps) {
          proto[key] = selfProps[key];
          }
       subClass.prototype.constructor = subClass;
       subClass.superClass = superClass.prototype;
       // 类名标识，兼容Class的toString，基本没用
       if ('string' == typeof className) {
          proto._className = className;
          }
       };
    // 声明快捷方法
    baidu.inherits = baidu.lang.inherits;

    /**
     * 声明baidu.object包
     */
    baidu.object = baidu.object || {};

    /**
     * 对一个object进行深度拷贝
     *
     * @param {Object} source 需要进行拷贝的对象.
     * @return {Object} 拷贝后的新对象.
     */
    baidu.object.clone = function(source) {
        var result = source, i, len;
        if (!source
            || source instanceof Number
            || source instanceof String
            || source instanceof Boolean) {
            return result;
        } else if (source instanceof Array) {
            result = [];
            var resultLen = 0;
            for (i = 0, len = source.length; i < len; i++) {
                result[resultLen++] = baidu.object.clone(source[i]);
            }
        } else if (source instanceof Date) {
            result = new Date(source.getTime());
        } else if ('object' == typeof source) {
            result = {};
            for (i in source) {
                if (source.hasOwnProperty(i)) {
                    result[i] = baidu.object.clone(source[i]);
                }
            }
        }

        return result;
    };

    /**
     * 将源对象的所有属性拷贝到目标对象中
     *
     * @param {Object} target 目标对象.
     * @param {Object} source 源对象.
     * @return {Object} 目标对象.
     */
    baidu.object.extend = function(target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
        return target;
    };

    /**
     * Whether the object/map/hash is empty.
     *
     * @param {Object} obj The object to test.
     * @return {boolean} true if obj is empty.
     */
    baidu.object.isEmpty = function(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    };

    /**
     * 循环遍历object中的每一个元素
     *
     * @param {Object} source 需要遍历的数组.
     * @param {Function} iterator 对每个数组元素进行调用的函数.
     * @return {Object} 原始的输入内容，可能被修改过.
     */
    baidu.object.each = function(source, iterator) {
        var returnValue, key, item;
        if ('function' == typeof iterator) {
            for (key in source) {
                if (source.hasOwnProperty(key)) {
                    item = source[key];
                    returnValue = iterator.call(source, item, key);
                    if (returnValue === false) {
                        break;
                    }
                }
            }
        }
        return source;
    };



    /**
     * Returns the number of key-value pairs in the object map.
     *
     * @param {Object} obj The object for which to get the number of key-value
     *     pairs.
     * @return {number} The number of key-value pairs in the object map.
     */
    baidu.object.getCount = function(obj) {
        // JS1.5 has __count__ but it has been deprecated so it raises a warning...
        // in other words do not use. Also __count__ only includes the fields on the
        // actual object and not in the prototype chain.
        var rv = 0;
        for (var key in obj) {
            rv++;
        }
        return rv;
    };

    // 声明快捷方法
    baidu.extend = baidu.object.extend;


    /**
     * 声明baidu.page包
     */
    baidu.page = baidu.page || {};

    /**
     * 获取页面高度
     *
     * @return {number} 页面高度.
     */
    baidu.page.getHeight = function() {
        var doc = document,
            body = doc.body,
            html = doc.documentElement,
            client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;

        return Math.max(html.scrollHeight, body.scrollHeight, client.clientHeight);
    };

    /**
     * 获取横向滚动量
     *
     * @return {number} 横向滚动量.
     */
    baidu.page.getScrollLeft = function() {
        var d = document;
        return d.documentElement.scrollLeft || d.body.scrollLeft;
    };

    /**
     * 获取纵向滚动量
     *
     * @return {number} 纵向滚动量.
     */
    baidu.page.getScrollTop = function() {
        var d = document;
        return d.documentElement.scrollTop || d.body.scrollTop;
    };

    /**
     * 获取页面视觉区域高度
     *
     * @return {number} 页面视觉区域高度.
     */
    baidu.page.getViewHeight = function() {
        var doc = document,
            client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

        return client.clientHeight;
    };

    /**
     * 获取页面视觉区域宽度
     *
     * @return {number} 页面视觉区域宽度.
     */
    baidu.page.getViewWidth = function() {
        var doc = document,
            client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

        return client.clientWidth;
    };

    /**
     * 获取页面宽度
     *
     * @return {number} 页面宽度.
     */
    baidu.page.getWidth = function() {
        var doc = document,
            body = doc.body,
            html = doc.documentElement,
            client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;

        return Math.max(html.scrollWidth, body.scrollWidth, client.clientWidth);
    };

    /**
     * 动态在页面上加载一个外部css文件
     *
     * @param {string} path css文件路径.
     */
    baidu.page.loadCssFile = function(path) {
        var element = document.createElement('link');

        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('type', 'text/css');
        element.setAttribute('href', path);

        document.getElementsByTagName('head')[0].appendChild(element);
    };

    /**
     * 动态在页面上加载一个外部js文件
     *
     * @param {string} path js文件路径.
     */
    baidu.page.loadJsFile = function(path) {
        var element = document.createElement('script');

        element.setAttribute('type', 'text/javascript');
        element.setAttribute('src', path);
        element.setAttribute('defer', 'defer');

        document.getElementsByTagName('head')[0].appendChild(element);
    };

    /**
     * 声明baidu.string包
     */
    baidu.string = baidu.string || {};

    /**
     * 对目标字符串进行html解码
     *
     * @param {string} source 目标字符串.
     * @return {string} html解码后的字符串.
     */
    baidu.string.decodeHTML = function(source) {
        var str = String(source)
                    .replace(/&quot;/g, '"')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&');

        str = str.replace(/&#([\d]+);/g, function($0, $1) {
            return String.fromCharCode(parseInt($1, 10));
        });

        return str;
    };

    baidu.decodeHTML = baidu.string.decodeHTML;

    /**
     * 对目标字符串进行html编码
     *
     * @param {string} source 目标字符串.
     * @return {string} html编码后的字符串.
     */
    baidu.string.encodeHTML = function(source) {
        return String(source)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
    };

    baidu.encodeHTML = baidu.string.encodeHTML;

    /**
     * 对目标字符串进行格式化
     *
     * @param {string}          source  目标字符串.
     * @param {Object|string}   opts    提供相应数据的对象.
     * @return {string} 格式化后的字符串.
     */
    baidu.string.format = function(source, opts) {
        source = String(source);

        if ('undefined' != typeof opts) {
            if (baidu.lang.isPlainObject(opts)) {
                return source.replace(/\$\{(.+?)\}/g,
                    function(match, key) {
                        var replacer = opts[key];
                        if ('function' == typeof replacer) {
                            replacer = replacer(key);
                        }
                        return ('undefined' == typeof replacer ? '' : replacer);
                    });
            } else {
                var data = Array.prototype.slice.call(arguments, 1),
                    len = data.length;
                return source.replace(/\{(\d+)\}/g,
                    function(match, index) {
                        index = parseInt(index, 10);
                        return (index >= len ? match : data[index]);
                    });
            }
        }

        return source;
    };

    // 声明快捷方法
    baidu.format = baidu.string.format;

    /**
     * 获取目标字符串在gbk编码下的字节长度
     * 假设：非x00-xff的都是双字节
     *
     * @param {string} source 目标字符串.
     * @return {number} 字节长度.
     */
    baidu.string.getByteLength = function(source) {
        return String(source).replace(/[^\x00-\xff]/g, 'ci').length;
    };

    /**
     * 将目标字符串进行驼峰化处理
     *
     * @param {string} source 目标字符串.
     * @return {string} 驼峰化处理后的字符串.
     */
    baidu.string.toCamelCase = function(source) {
        return String(source).replace(/[-_]\D/g, function(match) {
                    return match.charAt(1).toUpperCase();
                });
    };

    /**
     * 删除目标字符串两端的空白字符
     *
     * @param {string} source 目标字符串.
     * @return {string} 删除两端空白字符后的字符串.
     */
    baidu.string.trim = function(source) {
        return source.replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, '');
    };

    // 声明快捷方法
    baidu.trim = baidu.string.trim;

    baidu.string.stripTags = function(source) {
        return String(source || '').replace(/<[^>]+>/g, '');
    };

    /**
     * 声明baidu.swf包
     */
    baidu.swf = baidu.swf || {};

    /**
     * 在页面中创建一个flash对象
     *
     * @param {Object} options 创建flash的选项参数.
     * @config {string} id                  要创建的flash的标识
     * @config {string} url                 flash文件的url
     * @config {string} errorMessage        未安装flash player或flash player版本号过低时的提示
     * @config {string} ver                 最低需要的flash player版本号
     * @config {string} width               flash的宽度
     * @config {string} height              flash的高度
     * @config {string} align               flash的对齐方式
     * @config {string} base                设置用于解析swf文件中的所有相对路径语句的基本目录或URL
     * @config {string} bgcolor             swf文件的背景色
     * @config {string} salign              缩放的swf文件在由width和height设置定义的区域内的位置
     * @config {string} menu                是否显示右键菜单
     * @config {string} loop                播放到最后一帧时是否重新播放
     * @config {string} play                flash是否在浏览器加载时就开始播放
     * @config {string} quality             设置flash播放的画质
     * @config {string} scale               设置flash内容如何缩放来适应设置的宽高
     * @config {string} wmode               flash的显示模式
     * @config {string} allowscriptaccess   flash与页面的通信权限
     * @config {string} allownetworking     设置swf文件中允许使用的网络API
     * @config {string} allowfullscreen     是否允许flash全屏
     * @config {string} seamlesstabbing     允许设置执行无缝跳格，从而使用户能跳出flash应用程序。该参数只能在安装Flash7及更高版本的Windows中使用
     * @config {string} devicefont          静态文本对象是否以设备字体呈现
     * @config {string} swliveconnect       第一次加载flash时浏览器是否应启动Java
     * @config {Object} vars                要传递给flash的参数
     * @param {Element|string} target 创建flash的父容器元素.
     */
    baidu.swf.create = function(options, target) {
        options = options || {};
        var html = baidu.swf.createHTML(options)
                   || options['errorMessage']
                   || '';

        target = baidu.dom.g(target);
        if (target) {
            target.innerHTML = html;
        } else {
            document.write(html);
        }
    };

    /**
     * 创建flash对象的html字符串
     *
     * @param {Object} options              创建flash的选项参数.
     * @config {string} id                  要创建的flash的标识
     * @config {string} url                 flash文件的url
     * @config {string} ver                 最低需要的flash player版本号
     * @config {string} width               flash的宽度
     * @config {string} height              flash的高度
     * @config {string} align               flash的对齐方式
     * @config {string} base                设置用于解析swf文件中的所有相对路径语句的基本目录或URL
     * @config {string} bgcolor             swf文件的背景色
     * @config {string} salign              缩放的swf文件在由width和height设置定义的区域内的位置
     * @config {string} menu                是否显示右键菜单
     * @config {string} loop                播放到最后一帧时是否重新播放
     * @config {string} play                flash是否在浏览器加载时就开始播放
     * @config {string} quality             设置flash播放的画质
     * @config {string} scale               设置flash内容如何缩放来适应设置的宽高
     * @config {string} wmode               flash的显示模式
     * @config {string} allowscriptaccess   flash与页面的通信权限
     * @config {string} allownetworking     设置swf文件中允许使用的网络API
     * @config {string} allowfullscreen     是否允许flash全屏
     * @config {string} seamlesstabbing     允许设置执行无缝跳格，从而使用户能跳出flash应用程序。该参数只能在安装Flash7及更高版本的Windows中使用
     * @config {string} devicefont          静态文本对象是否以设备字体呈现
     * @config {string} swliveconnect       第一次加载flash时浏览器是否应启动Java
     * @config {Object} vars                要传递给flash的参数
     * @return {string} flash对象的html字符串.
     */
    baidu.swf.createHTML = function(options) {
        options = options || {};
        var version = baidu.swf.version,
            needVersion = options['ver'] || '6.0.0',
            vUnit1, vUnit2, i, k, len, item, tmpOpt = {};

        // 复制options，避免修改原对象
        for (k in options) {
            tmpOpt[k] = options[k];
        }
        options = tmpOpt;

        // 浏览器支持的flash插件版本判断
        if (version) {
            version = version.split('.');
            needVersion = needVersion.split('.');
            for (i = 0; i < 3; i++) {
                vUnit1 = parseInt(version[i], 10);
                vUnit2 = parseInt(needVersion[i], 10);
                if (vUnit2 < vUnit1) {
                    break;
                } else if (vUnit2 > vUnit1) {
                    return ''; // 需要更高的版本号
                }
            }
        } else {
            return ''; // 未安装flash插件
        }

        var vars = options['vars'],
            objProperties = ['classid', 'codebase', 'id', 'width', 'height', 'align'];

        // 初始化object标签需要的classid、codebase属性值
        options['align'] = options['align'] || 'middle';
        options['classid'] = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
        options['codebase'] = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0';
        options['movie'] = options['url'] || '';
        delete options['vars'];
        delete options['url'];

        // 初始化flashvars参数的值
        if ('string' == typeof vars) {
            options['flashvars'] = vars;
        } else {
            var fvars = [];
            for (k in vars) {
                item = vars[k];
                if (item) {
                    fvars.push(k + '=' + encodeURIComponent(item));
                }
            }
            options['flashvars'] = fvars.join('&');
        }

        // 构建IE下支持的object字符串，包括属性和参数列表
        var str = ['<object '];
        for (i = 0, len = objProperties.length; i < len; i++) {
            item = objProperties[i];
            str.push(' ', item, '="', options[item], '"');
        }
        str.push('>');
        var params = {
            'wmode' : 1,
            'scale' : 1,
            'quality' : 1,
            'play' : 1,
            'loop' : 1,
            'menu' : 1,
            'salign' : 1,
            'bgcolor' : 1,
            'base' : 1,
            'allowscriptaccess' : 1,
            'allownetworking' : 1,
            'allowfullscreen' : 1,
            'seamlesstabbing' : 1,
            'devicefont' : 1,
            'swliveconnect' : 1,
            'flashvars' : 1,
            'movie' : 1
        };

        for (k in options) {
            item = options[k];
            if (params[k] && item) {
                str.push('<param name="' + k + '" value="' + item + '" />');
            }
        }

        // 使用embed时，flash地址的属性名是src，并且要指定embed的type和pluginspage属性
        options['src'] = options['movie'];
        options['name'] = options['id'];
        delete options['id'];
        delete options['movie'];
        delete options['classid'];
        delete options['codebase'];
        options['type'] = 'application/x-shockwave-flash';
        options['pluginspage'] = 'http://www.macromedia.com/go/getflashplayer';


        // 构建embed标签的字符串
        str.push('<embed');
        // 在firefox、opera、safari下，salign属性必须在scale属性之后，否则会失效
        // 经过讨论，决定采用BT方法，把scale属性的值先保存下来，最后输出
        var salign;
        for (k in options) {
            item = options[k];
            if (item) {
                if ((new RegExp('^salign\x24', 'i')).test(k)) {
                    salign = item;
                    continue;
                }

                str.push(' ', k, '="', item, '"');
            }
        }

        if (salign) {
            str.push(' salign="', salign, '"');
        }
        str.push('></embed></object>');

        return str.join('');
    };

    /**
     * 获得flash对象的实例
     *
     * @param {string} name flash对象的名称.
     * @return {HTMLElement} flash对象的实例.
     */
    baidu.swf.getMovie = function(name) {
        return document[name] || window[name];
    };

    /**
     * 浏览器支持的flash插件版本
     */
    baidu.swf.version = (function() {
        var n = navigator;
        if (n.plugins && n.mimeTypes.length) {
            var plugin = n.plugins['Shockwave Flash'];
            if (plugin && plugin.description) {
                return plugin.description
                        .replace(/([a-zA-Z]|\s)+/, '')
                        .replace(/(\s)+r/, '.') + '.0';
            }
        } else if (window['ActiveXObject'] && !window.opera) {
            for (var i = 10; i >= 2; i--) {
                try {
                    var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
                    if (c) {
                        var version = c.GetVariable('$version');
                        return version.replace(/WIN/g, '').replace(/,/g, '.');
                    }
                } catch (e) {}
            }
        }
    })();

    /**
     * 声明baidu.number包
     */
    baidu.number = baidu.number || {};
    /**
     * 为目标数字添加逗号分隔
     *
     * @param {number} source          目标数字.
     * @param {number} length optional 两次逗号之间的数字位数.
     * @return {string} 对目标数字处理后的结果.
     */
    baidu.number.comma = function(source, length) {
        var pair = String(source).split('.'),
            integer = pair[0].split('').reverse().join(''),
            reg;

        if (!length || length < 1) {
            length = 3;
        }

        reg = new RegExp('\\d{' + length + '}', 'g');
        integer = integer.replace(reg,
            function(s) {
                return s + ',';
            }).split('').reverse().join('');

        if (integer.charAt(0) == ',') {
            integer = integer.slice(1);
        }

        pair[0] = integer;
        return pair.join('.');
    };

    /**
     * 对目标数字进行0补齐处理
     *
     * @param {number} source 目标数字.
     * @param {number} length 需要输出的长度.
     * @return {string} 对目标数字处理后的结果.
     */
    baidu.number.pad = function(source, length) {
        var pre = '',
            negative = (source < 0),
            string = String(Math.abs(source));

        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }

        return (negative ? '-' : '') + pre + string;
    };

    /**
     * baidu.array
     * @type {Object}
     */
    baidu.array = baidu.array || {};

    /**
    * 遍历数组中所有元素
    * @param {Array} source 需要遍历的数组.
    * @param {Function} iterator 对每个数组元素进行调用的函数，该函数有两个参数，第一个为数组元素，第二个为数组索引值，function (item, index)。.
    * each方法不支持对Object的遍历,对Object的遍历使用baidu.object.each 。.
    *
    * @return {Array} 遍历的数组.
    */
    baidu.array.each = function(source, iterator) {
      var returnValue, item, i, len = source.length;
      if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
          item = source[i];
          returnValue = iterator.call(source, item, i);
          if (returnValue === false) {
            break;
          }
        }
      }
      return source;
    };
    // 声明快捷方法
    baidu.each = baidu.array.each;

    /**
     * 过滤数组中的相同项
     *
     * @param {Array} source 需要过滤相同项的数组.
     * @param {Function} compareFn optional 比较2个数组项是否相同的函数.
     * @return {Array} 过滤后的新数组.
     */
    baidu.array.unique = function(source, compareFn) {
        var len = source.length, result = source.slice(0), i, datum;
        if ('function' != typeof compareFn) {
            compareFn = function(item1, item2) {
                return item1 === item2;
            };
        }
        // 从后往前双重循环比较
        // 如果两个元素相同，删除后一个
        while (--len > 0) {
            datum = result[len];
            i = len;
            while (i--) {
                if (compareFn(datum, result[i])) {
                    result.splice(len, 1);
                    break;
                }
            }
        }
        return result;
    };

    baidu.array.filter = function(source, iterator) {
        var result = [], resultIndex = 0, len = source.length, item, i;
        if ('function' == typeof iterator) {
            for (i = 0; i < len; i++) {
                item = source[i];
                if (true === iterator.call(source, item, i)) {
                    // resultIndex用于优化对result.length的多次读取
                    result[resultIndex++] = item;
                }
            }
        }
        return result;
    };

    /**
     * 从数组中寻找符合条件的第一个元素
     * @name baidu.array.find
     * @function
     * @param {Array} source 需要查找的数组.
     * @param {function(*, number):boolean} iterator 对每个数组元素进行查找的函数，
     * 该函数有两个参数，第一个为数组元素，第二个为数组索引值，
     * function (item, index)，函数需要返回true或false.
     * @see baidu.array.filter,baidu.array.indexOf
     *
     * @return {*} 符合条件的第一个元素，找不到时返回null.
     */
    baidu.array.find = function(source, iterator) {
        var item, i, len = source.length;

        if ('function' == typeof iterator) {
            for (i = 0; i < len; i++) {
                item = source[i];
                if (true === iterator.call(source, item, i)) {
                    return item;
                }
            }
        }

        return null;
    };


    /**
     * Whether the array is empty.
     * @param {Array} arr The array to test.
     * @return {boolean} true if empty.
     */
    baidu.array.isEmpty = function(arr) {
        return arr.length == 0;
    };

    /**
     * 移除数组中的项
     * @param {Array} source 需要移除项的数组.
     * @param {*|function(*):boolean=} condition 要移除的项或移除匹配函数.
     * condition如果是Function类型，则会按function (item, index)方式调用判断，
     * 函数需要返回true或false。如果要移除Function类型的项，请传入自定义的判断函数。.
     * @see baidu.array.removeAt
     *
     * @return {Array} 移除后的数组.
     */
    baidu.array.remove = function(source, condition) {
        var len = source.length,
            iterator = condition;

        if ('function' != typeof condition) {
            iterator = function(item) {
                return condition === item;
            };
        }

        while (len--) {
            if (true === iterator.call(source, source[len], len)) {
                source.splice(len, 1);
            }
        }
        return source;
    };

    /**
     * 查询数组中指定元素的索引位置
     * @name baidu.array.indexOf
     * @function
     * @param {Array} source 需要查询的数组.
     * @param {*|function(*, number):boolean=} condition 查询项或查询函数，
     * 查询函数有两个参数，第一个参数为数组元素，第二个参数为数组索引值
     * function (item, position)。.
     * @param {number} [position] 查询的起始位索引位置.
     * @see baidu.array.find,baidu.array.lastIndexOf
     *
     * @return {number} 指定元素的索引位置，查询不到时返回-1.
     */
    baidu.array.indexOf = function(source, condition, position) {
        var len = source.length,
            iterator = condition;

        // 参考ecma262的String.prototype.indexOf实现
        // 为undefined时归0，否则进行ToInteger(参见ecma262 3rd 9.4)
        position = Number(position) || 0;
        position = position < 0 ? Math.ceil(position) : Math.floor(position);
        position = Math.min(Math.max(position, 0), len);

        if ('function' != typeof condition) {
            iterator = function(item) {
                return condition === item;
            };
        }

        for (; position < len; position++) {
            if (true === iterator.call(source, source[position], position)) {
                return position;
            }
        }

        return -1;
    };


    /**
     * 判断一个数组中是否包含给定元素
     * @param {Array} source 需要判断的数组.
     * @param {*} obj 要查找的元素.
     * @return {boolean} 判断结果.
     * @author berg
     */
    baidu.array.contains = function(source, obj) {
        return (baidu.array.indexOf(source, obj) >= 0);
    };


    /**
    * 将目标字符串中可能会影响正则表达式构造的字符串进行转义
    * 主要转义如下的字符： .*+?^=!:${}()|[\]/\
    *
    * @param {string} source 目标字符串.
    * @return {string} 转义后的字符串.
    */
    baidu.string.escapeReg = function(source) {
       return String(source) .replace(new RegExp('([.*+?^=!:\x24{}()|[\\]\/\\\\])', 'g'), '\\\x241');
    };
    /**
    * 通过className获取元素
    * 不保证返回数组中DOM节点的顺序和文档中DOM节点的顺序一致。
    *
    * @param {string} className 需要搜索的class，只能指定单一的class，如果为空字符串或者纯空白的字符串，返回null.
    * @param {HTMLElement|string} element optional 从这个节点开始搜索，没有的话，默认是document.
    * @param {string} tagName optional 指定要获取元素的标签名，如果没有值或者值为空字符串或者纯空白的字符串，表示不限制.
    * @return {Array} 结果的数组，如果没有结果，数组的长度为0，或者是className参数错误，返回null。.
    */
    baidu.dom.q = function(className, element, tagName) {
       var result = [], trim = baidu.string.trim, len, i, elements, node;
       if (!(className = trim(className))) {
          return null;
          }
       // 初始化element参数
       if ('undefined' == typeof element) {
          element = document;
          }
       else {
          element = baidu.dom.g(element);
          if (!element) {
             return result;
             }
          }
       // 初始化tagName参数
       tagName && (tagName = trim(tagName).toUpperCase());
       // 查询元素
       if (element.getElementsByClassName) {
          elements = element.getElementsByClassName(className);
          len = elements.length;
          for (i = 0; i < len; i++) {
             node = elements[i];
             if (tagName && node.tagName != tagName) {
                continue;
                }
             result[result.length] = node;
             }
          }
       else {
          className = new RegExp('(^|\\s)' + baidu.string.escapeReg(className) + '(\\s|\x24)');
          elements = tagName ? element.getElementsByTagName(tagName) : (element.all || element.getElementsByTagName('*'));
          len = elements.length;
          for (i = 0; i < len; i++) {
             node = elements[i];
             className.test(node.className) && (result[result.length] = node);
             }
          }
       return result;
    };
    // 声明快捷方法
    baidu.q = baidu.Q = baidu.dom.q;

    /**
     * @namespace baidu.fn 对方法的操作，解决内存泄露问题。
     * @type {Object}
     */
    baidu.fn = baidu.fn || {
    };
    /**
    * 为对象绑定方法和作用域
    * @param {Function|string} func 要绑定的函数，或者一个在作用域下可用的函数名.
    * @param {Object} scope 执行运行时this，如果不传入则运行时this为函数本身.
    * @param {...*} var_args 一些额外的参数需要传递给func.
    * @version 1.3
    *
    * @return {Function} 封装后的函数.
    */
    baidu.fn.bind = function(func, scope, var_args) {
       var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : null;
       return function() {
          var fn = baidu.lang.isString(func) ? scope[func] : func, args = (xargs) ? xargs.concat([].slice.call(arguments, 0)) : arguments;
          return fn.apply(scope || fn, args);
       };
    };


    /**
     * 将字符串解析成json对象
     *
     * @param {string} source 需要解析的字符串.
     * @return {Object} 解析结果json对象.
     */
    baidu.json.decode = function(source) {
        return baidu.json.parse(source);
    };

    /**
     * 将字符串解析成json对象
     *
     * @param {string} source 需要解析的字符串.
     * @return {Object} 解析结果json对象.
     */
    baidu.json.parse = function(source) {
        return eval('(' + source + ')');
    };

    /**
     * 让IE6缓存背景图片
     */
    if (baidu.ie && baidu.ie < 7) {
        try {
            document.execCommand('BackgroundImageCache', false, true);
        } catch (e) {}
    }

//    window.baidu = baidu;
// })();
