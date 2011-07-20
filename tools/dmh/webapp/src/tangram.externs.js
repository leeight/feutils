/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: tangram.externs.js 5202 2011-05-03 08:19:16Z liyubei $
 *
 **************************************************************************/



/**
 * src/tangram.externs.js ~ 2011/04/28 09:58:07
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5202 $
 * @description
 * 七巧板的externs文件
 * @externs
 **/

/**
 * @type {Object}
 * @const
 */
var baidu = {
  'version' : '1.3.6'
};

/**
 * @type {Object}
 * @const
 */
baidu.lang = baidu.lang || {};

/**
 * 判断目标参数是否string类型或String对象
 * @param {*} source 目标参数
 * @return {boolean} 类型判断结果
 */
baidu.lang.isString = function(source) {};

baidu.isString = baidu.lang.isString;

/**
 * 判断目标参数是否为function或Function实例
 * @param {*} source 目标参数
 * @return {boolean} 类型判断结果
 */
baidu.lang.isFunction = function(source) {};

/**
 * 判断目标参数是否number类型或Number对象
 * @param {*} source 目标参数
 * @return {boolean} 类型判断结果
 */
baidu.lang.isNumber = function(source) {};

/**
 * 判断目标参数是否Array对象
 * @param {*} source 目标参数
 * @return {boolean} 类型判断结果
 */
baidu.lang.isArray = function(source) {};

/**
 * 判断目标参数是否Boolean对象
 * @param {*} source 目标参数
 * @return {boolean} 类型判断结果
 */
baidu.lang.isBoolean = function(source) {};

/**
 * 判断目标参数是否为Date对象
 * @param {*} source 目标参数
 * @return {boolean} 类型判断结果
 */
baidu.lang.isDate = function(source) {};

/**
 * 判断目标参数是否为Element对象
 * @param {*} source 目标参数
 * @return {boolean} 类型判断结果
 */
baidu.lang.isElement = function(source) {};

/**
 * 判断目标参数是否为Object对象
 * @param {*} source 目标参数
 * @return {boolean} 类型判断结果
 */
baidu.lang.isObject = function(source) {};

baidu.isObject = baidu.lang.isObject;

/**
 * 将一个变量转换成array
 * @param {*} source 需要转换成array的变量
 * @return {Array} 转换后的array
 */
baidu.lang.toArray = function(source) {};

/**
 * @return {string} guid.
 */
baidu.lang.guid = function() {};

/**
 * 自定义的事件对象。
 * @constructor
 * @param {string} type  事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
 * @param {Object=} opt_target 触发事件的对象
 */
baidu.lang.Event = function(type, opt_target) {};

/**
 * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
 * @constructor
 * @param {string=} opt_guid  对象的唯一标识
 */
baidu.lang.Class = function(opt_guid) {};

/**
 * 释放对象所持有的资源，主要是自定义事件。
 * TODO: 将_listeners中绑定的事件剔除掉
 */
baidu.lang.Class.prototype.dispose = function() {};

/**
 * 重载了默认的toString方法，使得返回信息更加准确一些。
 * @return {string} 对象的String表示形式
 */
baidu.lang.Class.prototype.toString = function() {};

/**
 * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * 事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，
 * 即"click"和"onclick"会被认为是同一种事件。
 * @param {string}   type     自定义事件的名称
 * @param {Function} handler  自定义事件被触发时应该调用的回调函数
 * @param {string=}  opt_key  为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
 */
baidu.lang.Class.prototype.addEventListener =
  function(type, handler, opt_key) {};

/**
 * 添加多个自定义事件。
 * @param {Object.<string, Function>|string}  events
 *  json对象，key为事件名称，value为事件被触发时应该调用的回调函数
 * @param {Function=} opt_fn  要挂载的函数
 */
baidu.lang.Class.prototype.addEventListeners = function(events, opt_fn) {};

/**
 * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * 如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
 * @param {string}   type     事件类型
 * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
 */
baidu.lang.Class.prototype.removeEventListener = function(type, handler) {};

/**
 * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。
 * 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件
 * @param {baidu.lang.Event|String} event Event对象，或事件名称(1.1.1起支持)
 * @param {Object=} opt_options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
 * @return {boolean} returnValue的结果.
 */
baidu.lang.Class.prototype.dispatchEvent = function(event, opt_options) {};

/**
 * 创建一个baidu.lang.Class的单例实例
 * @param {Object} json 直接挂载到这个单例里的预定属性/方法
 * @return {baidu.lang.Class} 一个实例
 */
baidu.lang.createSingle = function(json) {};

/**
 * 创建一个类，包括创造类的构造器、继承基类Class
 * @param {Function} constructor 类的构造器函数
 * @param {Object=} opt_options
 * @return {Function} 一个类对象
 */
baidu.lang.createClass = function(constructor, opt_options) {};

/**
 * 根据参数(guid)的指定，返回对应的实例对象引用
 * @param {string} guid 需要获取实例的guid
 * @return {?Object} 如果存在的话，返回;否则返回null。
 */
baidu.lang.instance = function(guid) {};

/**
 * 解除instance中对指定类实例的引用关系。
 * @param {string} guid 类的唯一标识
 */
baidu.lang.decontrol = function(guid) {};

/**
 * @type {baidu.lang.Class}
 */
baidu.lang.eventCenter;

/**
 * 为类型构造器建立继承关系
 * @param {Function} subClass 子类构造器.
 * @param {Function} superClass 父类构造器.
 * @param {string} className 类名标识.
 * 使subClass继承superClass的prototype，因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。
 * 这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。
 * 注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子
 */
baidu.lang.inherits = function(subClass, superClass, className) {};

baidu.inherits = baidu.lang.inherits;

/**
 * @type {Object}
 * @const
 */
baidu.string = {};

/**
 * 删除目标字符串两端的空白字符
 * @param {string} source 要处理的字符串
 * @return {string} 处理之后的字符串.
 */
baidu.string.trim = function(source) {};

baidu.trim = baidu.string.trim;

/**
 * 将目标字符串进行驼峰化处理
 * @param {string} source 目标字符串
 * @return {string} 驼峰化处理后的字符串
 */
baidu.string.toCamelCase = function(source) {};

/**
 * 将目标字符串中可能会影响正则表达式构造的字符串进行转义。
 * @param {string} source 目标字符串
 * @return {string} 转义后的字符串
 */
baidu.string.escapeReg = function(source) {};

/**
 * 对目标字符串进行html解码
 * @param {string} source 目标字符串
 * @return {string} html解码后的字符串
 */
baidu.string.decodeHTML = function(source) {};

baidu.decodeHTML = baidu.string.decodeHTML;

/**
 * 对目标字符串进行html编码
 * @param {string} source 目标字符串
 * @return {string} html编码后的字符串
 */
baidu.string.encodeHTML = function(source) {};

baidu.encodeHTML = baidu.string.encodeHTML;

/**
 * FIXME
 * 对目标字符串进行格式化,支持过滤
 * @param {string} source 目标字符串
 * @param {...*} var_args 提供相应数据的对象
 * @return {string} 格式化后的字符串
 */
baidu.string.filterFormat = function(source, var_args) {};

/**
 * 对js片段的字符做安全转义,编码低于255的都将转换成\x加16进制数
 * @param {string} source 待转义字符串
 * @return {string} 转义之后的字符串
 */
baidu.string.filterFormat.escapeJs = function(source) {};

baidu.string.filterFormat.js = baidu.string.filterFormat.escapeJs;

/**
 * 对字符串做安全转义,转义字符包括: 单引号,双引号,左右小括号,斜杠,反斜杠,上引号.
 * @param {string} source 待转义字符串.
 * @return {string} 转义之后的字符串.
 */
baidu.string.filterFormat.escapeString = function(source) {};

baidu.string.filterFormat.e = baidu.string.filterFormat.escapeString;

/**
 * 对数字做安全转义,确保是十进制数字;否则返回0.
 * @param {string} source 待转义字符串
 * @return {number} 转义之后的数字
 */
baidu.string.filterFormat.toInt = function(source) {};

baidu.string.filterFormat.i = baidu.string.filterFormat.toInt;

/**
 * 对目标字符串进行格式化
 * @param {string} source 目标字符串
 * @param {...*} var_args 提供相应数据的对象或多个字符串
 * @return {string} 格式化后的字符串
 */
baidu.string.format = function(source, var_args) {};

baidu.format = baidu.string.format;

/**
 * 将各种浏览器里的颜色值转换成 #RRGGBB 的格式
 * @param {string} color 颜色值字符串
 * @return {string} #RRGGBB格式的字符串或空
 */
baidu.string.formatColor = function(color) {};

/**
 * 获取目标字符串在gbk编码下的字节长度
 * @param {string} source 目标字符串
 * @return {number} 字节长度
 */
baidu.string.getByteLength = function(source) {};

/**
 * 对目标字符串按gbk编码截取字节长度
 * @param {string} source 目标字符串
 * @param {number} length 需要截取的字节长度
 * @param {string=} opt_tail 追加字符串,可选.
 * @return {string} 字符串截取结果
 */
baidu.string.subByte = function(source, length, opt_tail) {};

/**
 * 将目标字符串中常见全角字符转换成半角字符
 * @param {string} source 目标字符串
 * @return {string} 转换后的字符串
 */
baidu.string.toHalfWidth = function(source) {};

/**
 * 为目标字符串添加wbr软换行
 * @param {string} source 目标字符串
 * @return {string} 添加软换行后的字符串
 */
baidu.string.wbr = function(source) {};

/**
 * @type {Object}
 * @const
 */
baidu.json = {};

/**
 * 将字符串解析成json对象。注：不会自动祛除空格
 * @param {string} source 需要解析的字符串
 * @return {Object} 解析结果json对象
 */
baidu.json.parse = function(source) {};

baidu.json.decode = baidu.json.parse;

/**
 * 将json对象序列化
 * @param {*} value 需要序列化的json对象
 * @return {string} 序列化后的字符串
 */
baidu.json.stringify = function(value) {};

baidu.json.encode = baidu.json.stringify;

/**
 * @type {Object}
 * @const
 */
baidu.ajax = {};

/**
 * TODO 等到支持可选的field时候，就可以删掉|Object了。
 * @typedef {{data:?string, username:?string, password:?string,
 *  method:?string, headers:?Object, async:?boolean, noCache:?boolean,
 *  timeout:?number,
 *  replacer:function(string,string):string,
 *  ontimeout:function(XMLHttpRequest),
 *  onsuccess:function(XMLHttpRequest),
 *  onfailure:function(XMLHttpRequest),
 *  onbeforerequest:function(XMLHttpRequest),
 *  onstatus:function(XMLHttpRequest, number)}|!Object}
 */
baidu.ajax.RequestOptions;

/**
 * @param {string} url
 * @param {baidu.ajax.RequestOptions} options 发送请求的其他可选参数.
 * @return {XMLHttpRequest}
 */
baidu.ajax.request = function(url, options) {};

/**
 * @param {Element} form 需要提交的表单元素.
 * @param {baidu.ajax.RequestOptions} options 发送请求的选项参数.
 * @return {XMLHttpRequest}
 */
baidu.ajax.form = function(form, options) {};

/**
 * @param {string} url 发送请求的url地址.
 * @param {function(XMLHttpRequest)} onsuccess 请求成功之后的回调函数.
 * @return {XMLHttpRequest}
 */
baidu.ajax.get = function(url, onsuccess) {};

/**
 * @param {string} url 发送请求的url地址.
 * @param {?string} data 要发送的数据，&符号分割
 * @param {function(XMLHttpRequest)} onsuccess 请求成功之后的回调函数.
 * @return {XMLHttpRequest}
 */
baidu.ajax.post = function(url, data, onsuccess) {};

/**
 * @type {Object}
 * @const
 */
baidu.fn = {};

/**
 * @type {Function}
 */
baidu.fn.blank = function() {};

/**
 * 将一个静态函数变换成一个对象的方法，使其的第一个参数为this，或this[attr]
 * @param {Function}  func  要方法化的函数
 * @param {string=}   opt_attr  属性
 * @return {Function} 已方法化的函数
 */
baidu.fn.methodize = function(func, opt_attr) {};

/**
 * 包装函数的返回值，使其在能按照index指定的方式返回。
 * 如果其值为-1，直接返回返回值。
 * 如果其值为0，返回"返回值"的包装结果。
 * 如果其值大于0，返回第i个位置的参数的包装结果（从1开始计数）
 * @param {Function} func    需要包装的函数
 * @param {Function} wrapper 包装器
 * @param {number} mode 包装第几个参数
 * @return {Function} 包装后的函数
 */
baidu.fn.wrapReturnValue = function(func, wrapper, mode) {};

/**
 * 对函数进行集化，使其在第一个参数为array时，结果也返回一个数组
 * @param {Function}  func 需要包装的函数
 * @param {boolean=}  opt_recursive 是否递归包装（如果数组里面一项仍然是数组，递归），可选
 * @return {Function} 已集化的函数
 */
baidu.fn.multize = function(func, opt_recursive) {};

/**
 * 为对象绑定方法和作用域
 * @param {Function|string} func 要绑定的函数，或者一个在作用域下可用的函数名.
 * @param {Object} scope 执行运行时this，如果不传入则运行时this为函数本身.
 * @param {...*} var_args 一些额外的参数需要传递给func.
 * @return {Function} 封装后的函数
 */
baidu.fn.bind = function(func, scope, var_args) {};

/**
 * @type {Object}
 * @const
 */
baidu.object = {};

/**
 * 将源对象的所有属性拷贝到目标对象中
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @return {Object} 目标对象
 */
baidu.object.extend = function(target, source) {};

baidu.extend = baidu.object.extend;

/**
 * 遍历Object中所有元素，1.1.1增加
 * @param {Object} source 需要遍历的Object
 * @param {function(*, string)} iterator 对每个Object元素进行调用的函数，function (item, key)
 * @return {Object} 遍历的Object
 */
baidu.object.each = function(source, iterator) {};

/**
 * 获取目标对象的值列表
 * @param {Object} source 目标对象
 * @return {Array} 值列表
 */
baidu.object.values = function(source) {};

/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
 * @param {Object} source 需要检查的对象
 * @return {boolean} 检查结果
 */
baidu.object.isPlain = function(source) {};

/**
 * 对一个object进行深度拷贝
 * @param {Object} source 需要进行拷贝的对象
 * @return {Object} 拷贝后的新对象
 */
baidu.object.clone = function(source) {};

/**
 * 获取目标对象的键名列表
 * @param {Object} source 目标对象
 * @return {Array} 键名列表
 */
baidu.object.keys = function(source) {};

/**
 * 遍历object中所有元素，将每一个元素应用方法进行转换，返回转换后的新object。
 * @param   {Object}  source   需要遍历的object
 * @param   {Function} iterator 对每个object元素进行处理的函数
 * @return  {Object} map后的object
 */
baidu.object.map = function(source, iterator) {};

/**
 * 合并源对象的属性到目标对象。
 * @param {Object} target 目标对象.
 * @param {Object} source 源对象.
 * @param {Object=} opt_options optional merge选项.
 * @return {Object} merge后的object.
 */
baidu.object.merge = function(target, source, opt_options) {};

/**
 * @type {Object}
 * @const
 */
baidu.array = {};

/**
 * @param {Array} source 需要查询的数组.
 * @param {*} match 要匹配的项.
 * @param {number=} opt_fromIndex 开始的索引.
 * @return {number} 指定元素的索引位置，查询不到时返回-1.
 */
baidu.array.indexOf = function(source, match, opt_fromIndex) {};

/**
 * @param {Array} source 需要查询的数组.
 * @param {*} obj 需要匹配的项.
 * @return {boolean} 判断结果.
 */
baidu.array.contains = function(source, obj) {};

/**
 * @param {Array} source 需要遍历的数组.
 * @param {function(*, number)} iterator迭代器，如果返回false，则终止迭代.
 * @param {Object=} opt_thisObject 迭代器执行的时候的上下文.
 * @return {Array} 原始的数组输入.
 */
baidu.array.each = function(source, iterator, opt_thisObject) {};

baidu.each = baidu.array.each;

baidu.array.forEach = baidu.array.each;

/**
 * 清空一个数组，设置长度为0
 * @param {Array} source 要处理的数组.
 */
baidu.array.empty = function(source) {};

/**
 * 判断一个数组中是否所有元素都满足给定条件
 * @param {Array} source 需要判断的数组.
 * @param {function(*, number):boolean} iterator 判断函数.
 * @param {Object=} opt_thisObject 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @return {boolean} 判断结果，都满足返回true，否则返回false.
 */
baidu.array.every = function(source, iterator, opt_thisObject) {};


/**
 * 从数组中筛选符合条件的元素
 * @param {Array} source 需要筛选的数组
 * @param {function(*, number):boolean} iterator 对每个数组元素进行筛选的函数，该函数有两个参数，
 * 第一个为数组元素，第二个为数组索引值，function (item, index)，函数需要返回true或false
 * @param {Object=} opt_thisObject 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @return {Array} 符合条件的数组项集合
 */
baidu.array.filter = function(source, iterator, opt_thisObject) {};


/**
 * 从数组中寻找符合条件的第一个元素
 * @param {Array} source 需要查找的数组
 * @param {function(*, number):boolean} iterator 对每个数组元素进行查找的函数，该函数有两个参数，
 *  第一个为数组元素，第二个为数组索引值，function (item, index)，函数需要返回true或false
 * @return {*} 符合条件的第一个元素，找不到时返回null
 */
baidu.array.find = function(source, iterator) {};


/**
 * 将两个数组参数合并成一个类似hashMap结构的对象，这个对象使用第一个数组做为key，
 * 使用第二个数组做为值，如果第二个参数未指定，则把对象的所有值置为true。
 * @param {Array} keys 作为key的数组
 * @param {Array=} opt_values 作为value的数组，未指定此参数时，默认值将对象的值都设为true。
 * @return {Object} 合并后的对象{key : value}
 */
baidu.array.hash = function(keys, opt_values) {};


/**
 * 从后往前，查询数组中指定元素的索引位置
 * @param {Array} source 需要查询的数组
 * @param {*} match 查询项
 * @param {number=} opt_fromIndex 查询的起始位索引位置，如果为负数，
 * 则从source.length+fromIndex往前开始查找
 * @return {number} 指定元素的索引位置，查询不到时返回-1
 */
baidu.array.lastIndexOf = function(source, match, opt_fromIndex) {};


/**
 * 遍历数组中所有元素，将每一个元素应用方法进行转换，并返回转换后的新数组。
 * @param {Array}    source   需要遍历的数组.
 * @param {function(*, number)} iterator 对每个数组元素进行处理的函数.
 * @param {Object=} opt_thisObject 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @return {Array} map后的数组.
 */
baidu.array.map = function(source, iterator, opt_thisObject) {};

/**
 * 遍历数组中所有元素，将每一个元素应用方法进行合并，并返回合并后的结果。
 * @param {Array}    source 需要遍历的数组.
 * @param {Function} iterator 对每个数组元素进行处理的函数，函数接受四个参数：
 * 上一次reduce的结果（或初始值），当前元素值，索引值，整个数组.
 * @param {Object=}   opt_initializer 合并的初始项，如果没有此参数，默认用数组中的第一个值作为初始值.
 * @return {Array} reduce后的值.
 */
baidu.array.reduce = function(source, iterator, opt_initializer) {};

/**
 * 移除数组中的项
 * @param {Array} source 需要移除项的数组
 * @param {*} match 要移除的项
 * @return {Array} 移除后的数组
 */
baidu.array.remove = function(source, match) {};

/**
 * 移除数组中的项
 * @param {Array} source 需要移除项的数组
 * @param {number} index 要移除项的索引位置
 * @return {*} 被移除的数组项
 */
baidu.array.removeAt = function(source, index) {};

/**
 * 判断一个数组中是否有部分元素满足给定条件
 * @param {Array} source 需要判断的数组.
 * @param {function(*, number):boolean} iterator 判断函数.
 * @param {Object=} opt_thisObject 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @return {boolean} 判断结果.
 */
baidu.array.some = function(source, iterator, opt_thisObject) {};

/**
 * 过滤数组中的相同项。如果两个元素相同，会删除后一个元素。
 * @param {Array} source 需要过滤相同项的数组
 * @param {function(*,*):boolean} opt_compareFn 比较两个数组项是否相同的函数,两个数组项作为函数的参数。
 * @return {Array} 过滤后的新数组
 */
baidu.array.unique = function(source, opt_compareFn) {};

/**
 * @type {Object}
 * @const
 */
baidu.browser = baidu.browser || {};

/**
 * @type {number}
 */
baidu.browser.chrome;

/**
 * @type {number}
 */
baidu.browser.firefox;

/**
 * @type {number}
 */
baidu.browser.ie;

/**
 * @type {number}
 */
baidu.ie;

/**
 * @type {number}
 */
baidu.browser.maxthon;

/**
 * @type {number}
 */
baidu.browser.opera;

/**
 * @type {number}
 */
baidu.browser.safari;

/**
 * @type {boolean}
 */
baidu.browser.isGecko;

/**
 * @type {boolean}
 */
baidu.browser.isStrict;

/**
 * @type {boolean}
 */
baidu.browser.isWebkit;

/**
 * @type {Object}
 * @const
 */
baidu.platform = {};

/**
 * @type {boolean}
 */
baidu.platform.isAndroid;

/**
 * @type {boolean}
 */
baidu.platform.isIpad;

/**
 * @type {boolean}
 */
baidu.platform.isIphone;

/**
 * @type {boolean}
 */
baidu.platform.isMacintosh;

/**
 * @type {boolean}
 */
baidu.platform.isWindows;

/**
 * @type {boolean}
 */
baidu.platform.isX11;

/**
 * @type {Object}
 * @const
 */
baidu.cookie = {};

/**
 * @param {string} key 要检测的键值.
 * @return {boolean} 合法的情况下返回true，否则返回false.
 */
baidu.cookie._isValidKey = function(key) {};

/**
 * @param {string} key 需要获取cookie的键名.
 * @return {?string} cookie的值.
 */
baidu.cookie.getRaw = function(key) {};

/**
 * 获取cookie的值，用decodeURIComponent进行解码
 * @param {string} key 需要获取Cookie的键名
 * @return {?string} cookie的值，获取不到时返回null.
 */
baidu.cookie.get = function(key) {};

/**
 * 设置cookie的值，不对值进行编码
 * @param {string} key 需要设置Cookie的键名
 * @param {string} value 需要设置Cookie的值
 * @param {Object=} opt_options 设置Cookie的其他可选参数
 */
baidu.cookie.setRaw = function(key, value, opt_options) {};

/**
 * 删除cookie的值
 * @param {string} key 需要删除Cookie的键名
 * @param {Object=} opt_options 需要删除的cookie对应的 path domain 等值
 */
baidu.cookie.remove = function(key, opt_options) {};

/**
 * 设置cookie的值，用encodeURIComponent进行编码
 * @param {string} key 需要设置Cookie的键名
 * @param {string} value 需要设置Cookie的值
 * @param {Object=} opt_options 设置Cookie的其他可选参数
 */
baidu.cookie.set = function(key, value, opt_options) {};

/**
 * @type {Object}
 * @const
 */
baidu.date = {};

/**
 * 对目标日期对象进行格式化
 * @param {Date} source 目标日期对象
 * @param {string} pattern 日期格式化规则
 * @return {string} 格式化后的字符串
 */
baidu.date.format = function(source, pattern) {};

/**
 * 将目标字符串转换成日期对象
 * @param {string} source 目标字符串
 * @return {Date} 转换后的日期对象
 */
baidu.date.parse = function(source) {};

/**
 * @type {Object}
 * @const
 */
baidu.number = {};

/**
 * 对目标数字进行0补齐处理
 * @param {number} source 需要处理的数字
 * @param {number} length 需要输出的长度
 * @return {string} 对目标数字进行0补齐处理后的结果
 */
baidu.number.pad = function(source, length) {};

/**
 * 为目标数字添加逗号分隔
 * @param {number} source 需要处理的数字
 * @param {number=} opt_length 两次逗号之间的数字位数，默认为3位
 * @return {string} 添加逗号分隔后的字符串
 */
baidu.number.comma = function(source, opt_length) {};

/**
 * 生成随机整数，范围是[min, max]
 * @param   {number} min  随机整数的最小值
 * @param   {number} max  随机整数的最大值
 * @return  {number}    生成的随机整数
 */
baidu.number.randomInt = function(min, max) {};

/**
 * @type {Object}
 * @const
 */
baidu.event = {};

/**
 * 为目标元素添加事件监听器
 * @param {Element|string|Window} element 目标元素或目标元素id
 * @param {string} type 事件类型
 * @param {Function} listener 需要添加的监听器
 * @return {Element|Window} 目标元素
 */
baidu.event.on = function(element, type, listener) {};

baidu.on = baidu.event.on;

/**
 * 为目标元素移除事件监听器
 * @param {Element|string|Window} element 目标元素或目标元素id
 * @param {string} type 事件类型
 * @param {Function} listener 需要移除的监听器
 * @return {Element|Window} 目标元素
 */
baidu.event.un = function(element, type, listener) {};

baidu.un = baidu.event.un;

/**
 * 阻止事件的默认行为
 * @param {Event} event 事件对象
 */
baidu.event.preventDefault = function(event) {};

/**
 * 获取事件的触发元素
 * @param {Event} event 事件对象
 * @return {Element} 事件的触发元素
 */
baidu.event.getTarget = function(event) {};


/**
 * 触发已经注册的事件。注：在ie下不支持load和unload事件
 * @param {Element|string|Window} element 目标元素或目标元素id
 * @param {string} type 事件类型
 * @param {Object} options 触发的选项
 * @return {Element} 目标元素
 */
baidu.event.fire = function(element, type, options) {};

/**
 * 事件对象构造器，屏蔽浏览器差异的事件类
 * @param {Event}   event   事件对象
 * @param {Window=}  opt_win  窗口对象，默认为window
 * @constructor
 */
baidu.event.EventArg = function(event, opt_win) {};

/**
 * 阻止事件的默认行为
 * @return {baidu.event.EventArg} EventArg对象
 */
baidu.event.EventArg.prototype.preventDefault = function() {};

/**
 * 停止事件的传播
 * @return {baidu.event.EventArg} EventArg对象
 */
baidu.event.EventArg.prototype.stopPropagation = function() {};

/**
 * 停止事件
 * @return {baidu.event.EventArg} EventArg对象
 */
baidu.event.EventArg.prototype.stop = function() {};

/**
 * 获取扩展的EventArg对象
 * @param {Event} event 事件对象
 * @param {Window=} opt_win 触发事件元素所在的window
 * @return {baidu.event.EventArg} 扩展的事件对象
 */
baidu.event.get = function(event, opt_win) {};

/**
 * 获取键盘事件的键值
 * @param {Event} event 事件对象
 * @return {number} 键盘事件的键值
 */
baidu.event.getKeyCode = function(event) {};

/**
 * 获取鼠标事件的鼠标x坐标
 * @param {Event} event 事件对象
 * @return {number} 鼠标事件的鼠标x坐标
 */
baidu.event.getPageX = function(event) {};

/**
 * 为目标元素添加一次事件绑定
 * @param {Element|string} element 目标元素或目标元素id
 * @param {string} type 事件类型
 * @param {Function} listener 需要添加的监听器
 * @return {Element} 目标元素
 */
baidu.event.once = function(element, type, listener) {};

/**
 * 阻止事件传播
 * @param {Event} event 事件对象
 */
baidu.event.stopPropagation = function(event) {};

/**
 * 停止事件
 * @param {Event} event 事件对象
 */
baidu.event.stop = function(event) {};

/**
 * @type {Object}
 * @const
 */
baidu.page = {};

/**
 * 获取纵向滚动量
 * @return {number} 纵向滚动量
 */
baidu.page.getScrollTop = function() {};

/**
 * 获取横向滚动量
 * @return {number} 横向滚动量
 */
baidu.page.getScrollLeft = function() {};

/**
 * 取得当前页面里的目前鼠标所在的坐标（x y）
 * @return {{x:number,y:number}}
 */
baidu.page.getMousePosition = function() {};

/**
 * FIXME
 * 在页面中创建样式表对象
 * @param {Object} options 配置信息
 */
baidu.page.createStyleSheet = function(options) {};

/**
 * 获取页面高度
 * @return {number} 页面高度
 */
baidu.page.getHeight = function() {};

/**
 * 获取页面视觉区域高度
 * @return {number} 页面视觉区域高度
 */
baidu.page.getViewHeight = function() {};

/**
 * 获取页面视觉区域宽度
 * @return {number} 页面视觉区域宽度
 */
baidu.page.getViewWidth = function() {};

/**
 * 获取页面宽度
 * @return {number} 页面宽度
 */
baidu.page.getWidth = function() {};

/**
 * 延迟加载图片. 默认只加载可见高度以上的图片, 随着窗口滚动加载剩余图片.注意: 仅支持垂直方向.
 * @param {Object} options
 */
baidu.page.lazyLoadImage = function(options) {};

/**
 * 动态在页面上加载一个外部css文件
 * @param {string} path css文件路径
 */
baidu.page.loadCssFile = function(path) {};

/**
 * 动态在页面上加载一个外部js文件
 * @param {string} path js文件路径
 */
baidu.page.loadJsFile = function(path) {};

/**
 * @type {Object}
 * @const
 */
baidu.dom = {};

/**
 * 从文档中获取指定的DOM元素
 * @param {string|Element|HTMLDocument} id 元素的id或DOM元素
 * @return {?(Element|HTMLDocument)} 获取的元素，查找不到时返回null,
 * 如果参数不合法，直接返回参数
 */
baidu.dom.g = function(id) {};

baidu.G = baidu.dom.g;

baidu.g = baidu.dom.g;

/**
 * 为目标元素添加className
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} className 要添加的className，允许同时添加多个class，中间使用空白符分隔
 * @return {Element} 目标元素
 */
baidu.dom.addClass = function(element, className) {};

baidu.addClass = baidu.dom.addClass;

/**
 * 获取目标元素的直接子元素列表
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {Array.<Element>} 目标元素的子元素列表，没有子元素时返回空数组
 */
baidu.dom.children = function(element) {};

/**
 * 判断一个元素是否包含另一个元素
 * @param {Element|string} container 包含元素或元素的id
 * @param {Element|string} contained 被包含元素或元素的id
 * @return {boolean} contained元素是否被包含于container元素的DOM节点上
 */
baidu.dom.contains = function(container, contained) {};

/**
 * 设置目标元素的attribute值
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} key 要设置的attribute键名
 * @param {string} value 要设置的attribute值
 * @return {Element} 目标元素
 */
baidu.dom.setAttr = function(element, key, value) {};

baidu.setAttr = baidu.dom.setAttr;

/**
 * 批量设置目标元素的attribute值
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {Object} attributes 要设置的attribute集合
 * @return {Element} 目标元素
 */
baidu.dom.setAttrs = function(element, attributes) {};

baidu.setAttrs = baidu.dom.setAttrs;

/**
 * 创建 Element 对象。
 * @param {string} tagName 标签名称.
 * @param {Object=} opt_attributes 元素创建时拥有的属性，如style和className.
 * @return {Element} 创建的 Element 对象
 */
baidu.dom.create = function(tagName, opt_attributes) {};

/**
 * 拖曳管理器
 * @type {baidu.lang.Class}
 */
baidu.dom.ddManager;

/**
 * 获取目标元素所属的document对象
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {HTMLDocument} 目标元素所属的document对象
 */
baidu.dom.getDocument = function(element) {};

/**
 * 获取目标元素的computed style值。如果元素的样式值不能被浏览器计算，则会返回空字符串（IE）
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} key 要获取的样式名
 * @return {string} 目标元素的computed style值
 */
baidu.dom.getComputedStyle = function(element, key) {};

/**
 * 获取目标元素的样式值
 * TODO
 * 1. 无法解决px/em单位统一的问题（IE）
 * 2. 无法解决样式值为非数字值的情况（medium等 IE）
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} key 要获取的样式名
 * @return {string} 目标元素的样式值
 */
baidu.dom.getStyle = function(element, key) {};

baidu.getStyle = baidu.dom.getStyle;

/**
 * 获取目标元素相对于整个文档左上角的位置
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {{left:number,top:number}} 目标元素的位置，键值为top和left的Object。
 */
baidu.dom.getPosition = function(element) {};

/**
 * 拖动指定的DOM元素
 * FIXME
 * @param {Element|string} element 元素或者元素的id
 * @param {Object} options 拖曳配置项
 */
baidu.dom.drag = function(element, options) {};


/**
 * 设置目标元素的style样式值
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} key 要设置的样式名
 * @param {string} value 要设置的样式值
 * @return {Element} 目标元素
 */
baidu.dom.setStyle = function(element, key, value) {};

baidu.setStyle = baidu.dom.setStyle;

/**
 * 让一个DOM元素可拖拽
 * @param  {string|Element}   element         元素或者元素的ID.
 * @param  {Object=}          opt_options     选项.
 * @return {{cancel:Function}} 拖拽实例，包含cancel方法，可以停止拖拽.
 */
baidu.dom.draggable = function(element, opt_options) {};

/**
 * 检查两个元素是否相交
 * @param {Element|string} element1 要检查的元素或元素的id
 * @param {Element|string} element2 要检查的元素或元素的id
 * @return {boolean} 两个元素是否相交的检查结果
 */
baidu.dom.intersect = function(element1, element2) {};

/**
 * 让一个DOM元素可以容纳被拖拽的DOM元素
 * @param {Element|string} element 容器元素或者容器元素的ID
 * @param {Object=} opt_options 选项，拖拽元素对于容器元素的事件
 * @return {{cancel:Function}} cancel取消拖拽
 */
baidu.dom.droppable = function(element, opt_options) {};

/**
 * 删除一个节点下面的所有子节点。
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {Element} 目标元素
 */
baidu.dom.empty = function(element) {};

/**
 * 获取目标元素的第一个元素节点
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {?Element} 目标元素的第一个元素节点，查找不到时返回null
 */
baidu.dom.first = function(element) {};

/**
 * 获取目标元素的最后一个元素节点
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {?Element} 目标元素的最后一个元素节点，查找不到时返回null
 */
baidu.dom.last = function(element) {};

/**
 * 获取目标元素的下一个兄弟元素节点
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {?Element} 目标元素的下一个兄弟元素节点，查找不到时返回null
 */
baidu.dom.next = function(element) {};

/**
 * 获取目标元素的上一个兄弟元素节点
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {?Element} 目标元素的上一个兄弟元素节点，查找不到时返回null
 */
baidu.dom.prev = function(element) {};

/**
 * 获取目标元素符合条件的最近的祖先元素
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {function(Element):boolean} method 判断祖先元素条件的函数
 * @return {?Element} 符合条件的最近的祖先元素，查找不到时返回null
 */
baidu.dom.getAncestorBy = function(element, method) {};

/**
 * 获取目标元素指定元素className最近的祖先元素
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} className 祖先元素的class，只支持单个class
 * @return {?Element} 指定元素className最近的祖先元素，查找不到时返回null
 */
baidu.dom.getAncestorByClass = function(element, className) {};

/**
 * 获取目标元素指定标签的最近的祖先元素
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} tagName 祖先元素的标签名
 * @return {?Element} 指定标签的最近的祖先元素，查找不到时返回null
 */
baidu.dom.getAncestorByTag = function(element, tagName) {};

/**
 * 获取目标元素的属性值
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} key 要获取的attribute键名
 * @return {?string} 目标元素的attribute值，获取不到时返回null
 */
baidu.dom.getAttr = function(element, key) {};

baidu.getAttr = baidu.dom.getAttr;

/**
 * 获得元素的父节点
 * @param {Element|string} element   目标元素或目标元素的id
 * @return {?Element} 父元素，如果找不到父元素，返回null
 */
baidu.dom.getParent = function(element) {};

/**
 * 获得元素中的文本内容。
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {string} 元素中文本的内容
 */
baidu.dom.getText = function(element) {};

/**
 * 获取目标元素所属的window对象
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {Window} 目标元素所属的window对象
 */
baidu.dom.getWindow = function(element) {};

/**
 * 查询一个元素是否包含指定的属性
 * @param {Element|string} element DOM元素或元素的id
 * @param {string} name 要查找的属性名
 * @return {boolean} 是否包含此属性
 */
baidu.dom.hasAttr = function(element, name) {};

/**
 * 判断元素是否拥有指定的className
 * @param {Node|Element|string} element 目标元素或目标元素的id
 * @param {string} className 要判断的className，可以是用空格拼接的多个className
 * @return {boolean} 是否拥有指定的className，如果要查询的classname
 * 有一个或多个不在元素的className中，返回false
 */
baidu.dom.hasClass = function(element, className) {};

/**
 * 隐藏目标元素
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {Element} 目标元素
 */
baidu.dom.hide = function(element) {};

baidu.hide = baidu.dom.hide;

/**
 * 显示目标元素，即将目标元素的display属性还原成默认值。
 * 默认值可能在stylesheet中定义，或者是继承了浏览器的默认样式值
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {Element} 目标元素
 */
baidu.dom.show = function(element) {};

baidu.show = baidu.dom.show;

/**
 * 改变目标元素的显示/隐藏状态
 * @param {Element|string} element 目标元素或目标元素的id
 * @return {Element} 目标元素
 */
baidu.dom.toggle = function(element) {};

/**
 * 添加或者删除一个节点中的指定class，如果已经有就删除，否则添加
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} className 指定的className。允许同时添加多个class，中间使用空白符分隔
 */
baidu.dom.toggleClass = function(element, className) {};

/**
 * 将目标元素添加到基准元素之后
 * @param {Element|string} newElement 被添加的目标元素
 * @param {Element|string} existElement 基准元素
 * @return {Element} 被添加的目标元素
 */
baidu.dom.insertAfter = function(newElement, existElement) {};

/**
 * 将目标元素添加到基准元素之前
 * @param {Element|string} newElement 被添加的目标元素
 * @param {Element|string} existElement 基准元素
 * @return {Element} 被添加的目标元素
 */
baidu.dom.insertBefore = function(newElement, existElement) {};

/**
 * 在目标元素的指定位置插入HTML代码
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} position 插入html的位置信息，
 *  取值为beforeBegin,afterBegin,beforeEnd,afterEnd
 * @param {string} html 要插入的html
 * @return {Element} 目标元素
 */
baidu.dom.insertHTML = function(element, position, html) {};

baidu.insertHTML = baidu.dom.insertHTML;


/**
 * 通过className获取元素
 * @param {string} className 元素的class，只能指定单一的class，如果为空字符串或者纯空白的字符串，返回空数组。
 * @param {string|Element=} opt_element 开始搜索的元素，默认是document。
 * @param {string=} opt_tagName 要获取元素的标签名，如果没有值或者值为空字符串或者纯空白的字符串，表示不限制标签名。
 * @return {Array.<Element>} 获取的元素集合，查找不到或className参数错误时返回空数组.
 */
baidu.dom.q = function(className, opt_element, opt_tagName) {};

baidu.Q = baidu.dom.q;

baidu.q = baidu.dom.q;

/**
 * Sizzle
 * @type {Function}
 */
baidu.dom.query;

/**
 * 使函数在页面dom节点加载完毕时调用
 * @param {Function} callback 页面加载完毕时调用的函数.
 */
baidu.dom.ready = function(callback) {};

/**
 * 从DOM树上移除目标元素
 * @param {Element|string} element 需要移除的元素或元素的id
 */
baidu.dom.remove = function(element) {};

/**
 * 移除目标元素的className
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {string} className 要移除的className，允许同时移除多个class，中间使用空白符分隔
 * @return {Element} 目标元素
 */
baidu.dom.removeClass = function(element, className) {};

baidu.removeClass = baidu.dom.removeClass;

/**
 * 删除元素的某个样式
 * TODO
 * 1. 只支持现代浏览器，有一些老浏览器可能不支持
 * 2. 有部分属性无法被正常移除
 * @param {Element|String} element 需要删除样式的元素或者元素id
 * @param {string} styleName 需要删除的样式名字
 * @return {Element} 目标元素
 */
baidu.dom.removeStyle = function(element, styleName) {};

/**
 * 批量设置目标元素的style样式值
 * @param {Element|string} element 目标元素或目标元素的id
 * @param {Object} styles 要设置的样式集合
 * @return {Element} 目标元素
 */
baidu.dom.setStyles = function(element, styles) {};

baidu.setStyles = baidu.dom.setStyles;

/**
 * 按照border-box模型设置元素的height和width值。
 * 只支持元素的padding/border/height/width使用同一种计量单位的情况。
 * 不支持：
 * 1. 非数字值(medium)
 * 2. em/px在不同的属性中混用
 * @param {Element|string} element 元素或DOM元素的id
 * @param {{width:number,height:number}} size 包含height和width键名的对象
 * @return {Element}  设置好的元素
 */
baidu.dom.setBorderBoxSize = function(element, size) {};


/**
 * 按照border-box模型设置元素的height值
 * @param {Element|string} element DOM元素或元素的id
 * @param {number|string} height 要设置的height
 * @return {Element}  设置好的元素
 */
baidu.dom.setBorderBoxHeight = function(element, height) {};

baidu.dom.setOuterHeight = baidu.dom.setBorderBoxHeight;

/**
 * 按照border-box模型设置元素的width值
 * @param {Element|string}  element DOM元素或元素的id
 * @param {number|string}     width   要设置的width
 * @return {Element}  设置好的元素
 */
baidu.dom.setBorderBoxWidth = function(element, width) {};

baidu.dom.setOuterWidth = baidu.dom.setBorderBoxWidth;

/**
 * 绘制可以根据鼠标行为改变HTMLElement大小的resize handle
 * @param {Element|string} element 需要改变大小的元素或者元素的id.
 * @param {Object=} opt_options resizable参数配置
 * @return {{cancel:Function,update:Function,enable:Function}}
 */
baidu.dom.resizable = function(element, opt_options) {};

/**
 * 设置目标元素的top和left值到用户指定的位置
 * @param {Element|string}  element   目标元素或目标元素的id
 * @param {{top:number,left:number}} position   位置对象
 * @return {Element}  进行设置的元素
 */
baidu.dom.setPosition = function(element, position) {};

/**
 * @param {Element|string} node 需要包装的节点.
 * @return {baidu.element.Element}
 */
baidu.element = function(node) {};

baidu.e = baidu.element;

/**
 * Element类，所有扩展到链条上的方法都会被放在这里面
 * @param {Element|NodeList} node   目标元素，可以是数组或者单个node节点
 * @constructor
 */
baidu.element.Element = function(node) {};

/**
 * 以每一个匹配的元素作为上下文执行传递进来的函数，方便用户自行遍历dom。
 * @param {function(baidu.element.Element)} iterator 遍历DOM时调用的方法
 */
baidu.element.Element.prototype.each = function(iterator) {};

// TODO 很多额外的方法....

/**
 * 为element对象扩展一个方法。
 * @param {Object} json 要扩展的方法名以及方法
 */
baidu.element.extend = function(json) {};

/**
 * @type {Object}
 * @const
 */
baidu.sio = {};

/**
 * 通过script标签加载数据，加载完成由浏览器端触发回调
 * @param {string} url 加载数据的url
 * @param {Function=} opt_callback 数据加载结束时调用的函数
 * @param {Object=} opt_options 其他可选项
 */
baidu.sio.callByBrowser = function(url, opt_callback, opt_options) {};

/**
 * 通过script标签加载数据，加载完成由服务器端触发回调
 * @param {string} url 加载数据的url.
 * @param {Function|string} callback 服务器端调用的函数或函数名。
 *  如果没有指定本参数，将在URL中寻找options['queryField']做为callback的方法名.
 * @param {Object} opt_options 加载数据时的选项.
 */
baidu.sio.callByServer = function(url, callback, opt_options) {};

/**
 * @type {Object}
 * @const
 */
baidu.swf = {};

/**
 * @type {string}
 */
baidu.swf.version;

/**
 * 创建flash对象的html字符串
 * @param {Object}  options 创建flash的选项参数.
 * @return {string} flash对象的html字符串
 */
baidu.swf.createHTML = function(options) {};

/**
 * 在页面中创建一个flash对象
 * @param {Object}  options 创建flash的选项参数
 * @param {Element|string=} opt_target flash对象的父容器元素，不传递该参数时在当前代码位置创建flash对象。
 */
baidu.swf.create = function(options, opt_target) {};

/**
 * 获得flash对象的实例
 * @param {string} name flash对象的名称
 * @return {Element} flash对象的实例
 */
baidu.swf.getMovie = function(name) {};

/**
 * Js 调用 Flash方法的代理类.
 * @constructor
 * @param {string} id Flash的元素id.object标签id, embed标签name.
 * @param {string} property Flash的方法或者属性名称，用来检测Flash是否初始化好了.
 * @param {Function} loadedHandler 初始化之后的回调函数.
 */
baidu.swf.Proxy = function(id, property, loadedHandler) {};

/**
 * 获取flash对象.
 * @return {Element} Flash对象.
 */
baidu.swf.Proxy.prototype.getFlash = function() {};

/**
 * 判断Flash是否初始化完成,可以与js进行交互.
 */
baidu.swf.Proxy.prototype.isReady = function() {};

/**
 * 调用Flash中的某个方法
 * @param {string} methodName 方法名.
 * @param {...*} var_args 方法的参数.
 */
baidu.swf.Proxy.prototype.call = function(methodName, var_args) {};

/**
 * @type {Object}
 * @const
 */
baidu.url = {};

/**
 * 对字符串进行%&+/#=和空格七个字符进行url转义
 * @param {string} source 需要转义的字符串
 * @return {string} 转义之后的字符串.
 */
baidu.url.escapeSymbol = function(source) {};

/**
 * 根据参数名从目标URL中获取参数值
 * @param {string} url 目标URL
 * @param {string} key 要获取的参数名
 * @return {?string} 获取的参数值，获取不到时返回null
 */
baidu.url.getQueryValue = function(url, key) {};

/**
 * 将json对象解析成query字符串
 * @param {Object} json 需要解析的json对象
 * @param {Function=} replacer_opt 对值进行特殊处理的函数，function (value, key)
 * @return {string} 解析结果字符串
 */
baidu.url.jsonToQuery = function(json, replacer_opt) {};

/**
 * 解析目标URL中的参数成json对象
 * @param {string} url 目标URL
 * @return {Object} 解析结果对象
 */
baidu.url.queryToJson = function(url) {};

/* ====== 华丽的分割线 ====== */

/**
 * @constructor
 */
function UITableField() {
}

/**
 * 当前列的宽度
 * @type {number}
 */
UITableField.prototype.width;

/**
 * @type {boolean}
 */
UITableField.prototype.stable;

/**
 * @type {string}
 */
UITableField.prototype.title;

/**
 * @type {boolean}
 */
UITableField.prototype.sortable;

/**
 * @type {string}
 */
UITableField.prototype.field;

/**
 * @type {string}
 */
UITableField.prototype.tip;

/**
 * @type {boolean}
 */
UITableField.prototype.select;

/**
 * @type {string|function(Object):string}
 */
UITableField.prototype.content;

/**
 * @type {boolean}
 */
UITableField.prototype.breakLine;

/**
 * @type {boolean}
 */
UITableField.prototype.subEntry;

/**
 * @type {Function}
 */
UITableField.prototype.isSubEntryShow;


/**
 * @constructor
 */
function ListDataType() {}

/**
 * @type {string}
 */
ListDataType.prototype.success;

/**
 * @type {Object}
 */
ListDataType.prototype.message;

/**
 * @type {ListDataPageType}
 */
ListDataType.prototype.page;

/**
 * @constructor
 */
function ListDataPageType() {}

/**
 * @type {number}
 */
ListDataPageType.prototype.pageNo;

/**
 * @type {number}
 */
ListDataPageType.prototype.pageSize;

/**
 * @type {string}
 */
ListDataPageType.prototype.orderBy;

/**
 * @type {string}
 */
ListDataPageType.prototype.order;

/**
 * @type {number}
 */
ListDataPageType.prototype.totalCount;

/**
 * @type {Array.<*>}
 */
ListDataPageType.prototype.result;


/**
 * @param {string} id 广告位ID. 
 */
function BAIDU_DAN_showAd(id) {}

/**
 * @param {string} selector css选择符. 
 */
function $(selector) {}

/**
 * @param {Object} options 初始化选项. 
 */
$.prototype.imgAreaSelect = function(options){}
/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
