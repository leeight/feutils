/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * ui/externs.js ~ 2011/04/04 21:32:34
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * 这里面定义在prototype上面的属性，说明是需要在模版中
 * 使用的，通过定义在externs中，避免被编译器rename
 **/

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









/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */