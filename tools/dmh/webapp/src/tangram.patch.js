/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: tangram.patch.js 5258 2011-05-06 01:09:15Z liyubei $
 *
 **************************************************************************/



/**
 * src/tangram.patch.js ~ 2011/04/25 18:39:36
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5258 $
 * @description
 * 提供了一些对tangram的扩充方法，希望有朝一日这部分
 * 代码能进入主干，然后这个文件就没有存在的必要了.
 * XXX 如果使用主干上面的tangram，导致的问题就是
 * 必须提供一个externs定义文件，但是这个的工作量就比较大了，
 * 另外，如果使用externs文件来定义baidu下面的内容，那么使用
 * goog.provide('baidu')的地方就需要通过hack caldeps.py来实现，也
 * 不是一个好的版本....
 * 如何处理呢？....
 * 暂时恢复回去吧...
 **/

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

/**
 * Returns an object based on its fully qualified external name.  If you are
 * using a compilation pass that renames property names beware that using this
 * function will not find renamed properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |window|.
 * @return {?Object} The object or, if not found, null.
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

// DAN里面没有调用的地方（检测CLB和掘金）
// baidu.dom.htmlToDocumentFragement;

/**
 * 判断一个元素是否有值（不是null，不是undefined）
 * @param {*} source
 * @return {boolean}
 */
baidu.lang.hasValue = function(source) {
  return !(source === null || typeof source == 'undefined');
};

/**
 * 是否是一个简单的对象
 * @param {*} source 需要判断的对象.
 * @return {boolean} true是，false不是.
 */
// DAN里面没有调用的地方（检测CLB和掘金）
// baidu.lang.isPlainObject;

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

// DAN里面没有调用的地方（检测CLB和掘金）
// baidu.object.getCount;

/**
 * 去掉字符串中的html标签
 * @param {string} source 要处理的字符串.
 * @return {string}
 */
baidu.string.stripTags = function(source) {
  return String(source || '').replace(/<[^>]+>/g, '');
};

/**
 * 对目标字符串进行格式化
 * @suppress {duplicate}
 * @param {string} source  目标字符串.
 * @param {...*} var_args  提供相应数据的对象.
 * @return {string} 格式化后的字符串.
 */
baidu.string.format = function(source, var_args) {
  source = String(source);

  var opts = arguments[1];
  if ('undefined' != typeof opts) {
    if (baidu.object.isPlain(/** @type {Object} */ (opts))) {
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

// DAN里面没有调用的地方（检测CLB和掘金）
// baidu.array.isEmpty;

/**
 * 移除数组中的项
 * @param {Array} source 需要移除项的数组.
 * @param {*|function(*):boolean=} condition 要移除的项或移除匹配函数.
 * condition如果是Function类型，则会按function (item, index)方式调用判断，
 * 函数需要返回true或false。如果要移除Function类型的项，请传入自定义的判断函数。.
 * @see baidu.array.removeAt
 * @suppress {duplicate}
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

// DAN里面没有调用的地方（检测CLB和掘金）
// baidu.array.indexOf;


/**
 * 让IE6缓存背景图片
 */
if (baidu.ie && baidu.ie < 7) {
  try {
    document.execCommand('BackgroundImageCache', false, true);
  } catch (e) {}
}
// FIXME baidu.ajax.request -> (cacheable -> noCache)



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
