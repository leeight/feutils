/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: util.js 5186 2011-04-28 15:48:51Z liyubei $
 *
 **************************************************************************/



/**
 * src/ui/util.js ~ 2011/03/21 16:34:00
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5186 $
 * @description
 * 为什么用ui.Lib呢，因为我感觉用ui.Util看起来很难看
 **/

goog.require('Validator');

goog.require('ui');
goog.require('ui.InputControl');
goog.require('ui.Page');

goog.provide('ui.util');
goog.provide('ui.util.validate');

/**
 * @constructor
 */
ui.Lib = function() {
  /**
   * @type {?ui.Page}
   */
  this.pageMain = null;

  /**
   * @type {?ui.Page}
   */
  this.pagePopup = null;
};

/**
 * 创建控件，保持接口兼容
 * @deprecated
 */
ui.Lib.prototype.create = function(type, options, main) {
  options.type = type;
  return this.createControl(options, main);
};

/**
 * 创建页面控件
 * @param {string} view 页面模板名称.
 * @param {Element} main 控件最终render到main内部.
 * @param {boolean} isPopup 是否嵌入popup中.
 */
ui.Lib.prototype.createPage = function(view, main, isPopup) {
    var page = new ui.Page({
        view: view,
        main: main,
        autoState: false
    });
    if (isPopup) {
        page.id = 'frame';
        this.pagePopup = page;
    } else {
        this.pageMain = page;
    }
    return page;
};

/**
 * 根据ui属性字符串或ui属性对象创建一个控件。
 * @deprecated
 * @param {string|Object} attrs ui属性字符串或ui属性对象.
 * @param {Element} main 控件最终render到main内部.
 */
ui.Lib.prototype.createControl = function(attrs, main) {
    var refer = {},
        key, id, attrValue;

    if (typeof attrs === 'string') {
        attrs = this.parseAttrStr(attrs);
    }

    // 创建控件
    id = attrs.id;
    if (!id) {
        throw 'UI Control must have an id';
    }

    // 解析引用属性
    baidu.object.each(attrs, function(value, key) {
        if (typeof value === 'string') {
            if (value.indexOf('@') === 0) {
                refer[key] = value.substr(1);
                delete attrs[key];
            } else if (value.indexOf('&') === 0) {
                attrs[key] = baidu.getObjectByName(value.substr(1));
            }
        }
    });

    attrs.refer = refer;
    if (main) {
        attrs.main = main;
    }

    var clazz = /** @type {Function} */ (baidu.getObjectByName(attrs.type, ui) ||
                baidu.getObjectByName(attrs.type, window));
    return new clazz(attrs);
};

/**
 * 构造控件树
 *
 * @private
 * @param {Element} domParent 包含html片段的dom父节点.
 * @param {ui.Control} ctrlParent 父控件，构造出的所有控件都是它的子孙.
 */
ui.Lib.prototype.buildControlTree = function(domParent, ctrlParent) {
    if (!domParent || !domParent.childNodes ||
        !ctrlParent || !ctrlParent.addChild) {
        return;
    }

    var child, uiAttr, control;
    for (var i = 0; i < domParent.childNodes.length; i++) {
        child = domParent.childNodes[i];
        if (child.nodeType !== 1) {
            continue;
        }
        uiAttr = child.getAttribute('ui');
        if (uiAttr) {
            control = this.createControl(uiAttr, child);
            ctrlParent.addChild(control);
            // 递归构造控件树
            this.buildControlTree(child, control);
        } else {
            // 不是ui控件，继续往下查找
            this.buildControlTree(child, ctrlParent);
        }
    }
};

/**
 * 解析ui属性
 *
 * @private
 * @param {string} attrStr ui属性字符串.
 * @return {Object}
 */
ui.Lib.prototype.parseAttrStr = function(attrStr) {
    var attrs = {},
        attrArr = attrStr.split(';'),
        attrArrLen = attrArr.length,
        attrItem, attrSegment,
        attr, attrValue;
    while (attrArrLen--) {
        // 判断属性是否为空
        attrItem = attrArr[attrArrLen];
        if (!attrItem) {
            continue;
        }

        // 获取属性
        attrSegment = attrItem.split(':');
        attr = attrSegment[0];
        attrValue = attrSegment[1];
        // 之前没有值，直接设值；否则将其转化成数组形式存放
        if (!attrs[attr]) {
            attrs[attr] = attrValue;
        } else {
            if (!baidu.lang.isArray(attrs[attr])) {
                attrs[attr] = [attrs[attr]];
            }
            attrs[attr].push(attrValue);
        }
    }
    return attrs;
};

/**
 * 获取控件对象
 *
 * @param {string} domId 控件的domId.
 * @param {ui.Page=} opt_page 包含该控件Page.
 * @return {?ui.Control}
 */
ui.Lib.prototype.get = function(domId, opt_page) {
    var ids = domId.split('_'),
        page = opt_page || (ids[0] === 'frame' ? this.pagePopup : this.pageMain),
        i = (ids[0] === 'frame' ? 1 : 0),
        control = page;

    for (; i < ids.length; i++) {
        if (!control) {
            return null;
        }
        control = control.getChild(ids[i]);
    }
    return control;
};

ui.Lib.prototype.dispose = function() {
    if (this.pageMain) {
        this.pageMain.dispose();
    }
};


/**
 * 寻找dom元素下的控件集合
 *
 * @param {HTMLElement} container 要查找的容器元素.
 * @return {Object}
 */
ui.Lib.prototype.getControlsByContainer = function(container) {
    var els = container.getElementsByTagName('*'),
        len = els.length,
        controlId,
        domId,
        result = [];

    while (len--) {
        controlId = els[len].getAttribute('control');
        if (controlId) {
            domId = els[len].getAttribute('id');
            result.push(ui.util.get(domId));
        }
    }

    return result;
};

/**
 * 改变InputControl控件的disable状态
 *
 * @param {HTMLElement} container 容器元素.
 * @param {boolean} disabled disable状态.
 */
ui.Lib.prototype.disableFormByContainer = function(container, disabled) {
    var controls = this.getControlsByContainer(container),
        key, control;

    for (var i = 0; i < controls.length; i++) {
        control = controls[i];
        if (control instanceof ui.InputControl) {
            if (disabled) {
                control.disable();
            } else {
                control.enable();
            }
        }
    }
};

ui.util = new ui.Lib();
ui.util.validate = Validator;

baidu.on(window, 'unload', function() {
    ui.util.dispose();
});


















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
