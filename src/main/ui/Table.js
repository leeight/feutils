/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Table.js
 * desc:    表格控件
 * author:  zhaolei,erik
 * date:    $Date$
 */

goog.require('ui.Control');
goog.require('ui.ToolTip');

goog.provide('ui.Table');

/**
 * 表格框控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.Table = function(options) {
    ui.Control.call(this, options);
    this.type = 'table';

    /**
     * @type {string}
     */
    this.noDataHtml = this.noDataHtml || '';

    /**
     * 表格的字段.
     * @private
     * @type {Array.<Object>}
     */
    this.fields;

    /**
     * @private
     * @type {Array.<*>|string}
     */
    this.selectedValue;

    /**
     * multi,single或者其它值(没有单选或者多选列了).
     * @type {string}
     */
    this.select;

    /**
     * @type {Object}
     */
    this.checkboxField;

    /**
     * @type {Object}
     */
    this.radioboxField;

    /**
     * @type {string}
     */
    this.selectMode;

    /**
     * 是否去掉表头.
     * @type {boolean}
     */
    this.noTitle;

    /**
     * 是否支持列的排序.
     * @type {boolean}
     */
    this.sortable;
};

/**
 * @lends {ui.Table.prototype}
 */
ui.Table.prototype = {
    subEntryTipOpen: '点击展开',
    subEntryTipClose: '点击收起',

    /**
     * dom表格起始的html模板
     *
     * @private
     */
    tplTablePrefix: '<table cellpadding="0" cellspacing="0" border="0" width="{0}" control="{1}">',

    init: function() {
        ui.Table.superClass.init.call(this);
        this.setFields(this.fields);
    },

    /**
     * @inheritDoc
     */
    render: function(main) {
        var me = this;

        me.main = main || me.main;
        main = me.main;

        ui.Table.superClass.render.call(this, main);

        if (!me._fields) {
            return;
        }

        if (me.select === 'multi') {
            me.selection = [];
        }

        me.subrowIndex = null;
        me._width = me.getWidth();
        me.initColsWidth();
        main.style.width = me._width + 'px';

        me.renderHead();    // 绘制表格头
        me.renderBody();    // 绘制列表

        // 如果未绘制过，初始化resize处理
        if (!me.isRendered) {
            me.initResizeHandler();
        } else {
            // 重绘时触发onselect事件,control里设置dontOnSelect为true时则重绘时不触发onselect事件
            if (me.select) {
            	if (!me.dontOnSelect || me.dontOnSelect == false) {
            		me.onselect(me.selection);
            	}
            }
        }

        me.isRendered = true;
    },

    /**
     * 初始化列宽
     *
     * @private
     */
    initColsWidth: function() {
        var me = this,
            canExpand = [],
            leaveAverage,
            leftWidth,
            fields = me._fields,
            field,
            len = fields.length,
            offset,
            width, i;

        me.colsWidth = [];

        // 减去边框的宽度
        leftWidth = me._width - len - 2;

        // 读取列宽并保存
        for (i = 0; i < len; i++) {
            field = fields[i];
            width = parseInt(field.width, 10);
            leftWidth -= width;
            me.colsWidth.push(width);
            if (!field.stable) {
                canExpand.push(i);
            }
        }

        // 根据当前容器的宽度，计算可拉伸的每列宽度
        len = canExpand.length;
        leaveAverage = Math.round(leftWidth / len);
        for (i = 0; i < len; i++) {
            offset = Math.abs(leftWidth) > Math.abs(leaveAverage)
                        ? leaveAverage
                        : leftWidth;

            leftWidth -= offset;
            me.colsWidth[canExpand[i]] += offset;
        }
    },

    /**
     * 获取表格所在区域宽度
     *
     * @private
     * @return {number}
     */
    getWidth: function() {
        if (this.width) {
            return this.width;
        }

        // FIXME 有可能算出的width为0
        var me = this,
            width,
            rulerDiv = document.createElement('div'),
            parent = me.main.parentNode;

        parent.appendChild(rulerDiv);
        width = rulerDiv.offsetWidth;
        parent.removeChild(rulerDiv);

        return width;
    },

    refreshView: function() {
        this.handleResize();
    },

    /**
     * 初始化resize的event handler
     *
     * @private
     */
    initResizeHandler: function() {
        var me = this;
        me.viewWidth = baidu.page.getViewWidth();
        me.viewHeight = baidu.page.getViewHeight();

        me.resizeHandler = function() {
            var viewWidth = baidu.page.getViewWidth(),
                viewHeight = baidu.page.getViewHeight();

            if (viewWidth == me.viewWidth
                && viewHeight == me.viewHeight) {
                return;
            }

            me.viewWidth = viewWidth;
            me.viewHeight = viewHeight;
            me.handleResize();
        };
        baidu.on(window, 'resize', me.resizeHandler);
    },

    handleResize: function() {
        var me = this,
            head = baidu.g(me.getId('head'));
        me._width = me.getWidth();

        // 设置主区域宽度
        me.main.style.width = me._width + 'px';
        if (!baidu.g(me.getId('body'))) return;
        baidu.g(me.getId('body')).style.width = me._width + 'px';
        head && (head.style.width = me._width + 'px');

        // 重新绘制每一列
        me.initColsWidth();
        me.resetColumns();
    },

    /**
     * 第一列的多选框
     *
     * @private
     */
    checkboxField: {
        width: 30,
        stable: true,
        select: true,
        title: function() {
            return '<input type="checkbox" id="'
                    + this.getId('selectAll')
                    + '" onclick="'
                    + this.getStrCall('toggleSelectAll')
                    + '">';
        },

        content: function(item, index) {
            var selected = false;
            if (this.valueField && baidu.lang.isArray(this.selectedValue)) {
                for (var i = 0; i < this.selectedValue.length; i++) {
                    if (item[this.valueField] === this.selectedValue[i]) {
                        this.selection.push(item);
                        selected = true;
                        break;
                    }
                }
            }
            return '<input type="checkbox" id="'
                    + this.getId('multiSelect') + index
                    + '" onclick="' + this.getStrCall('rowCheckboxClick', index) + '"'
                    + (selected ? 'checked="checked"' : '') + '>';
        }
    },

    /**
     * 第一列的单选框
     *
     * @private
     */
    radioboxField: {
        width: 30,
        stable: true,
        title: '&nbsp;',
        select: true,
        content: function(item, index) {
            var id = this.getId('singleSelect'),
                selected = false;
            if (this.valueField) {
                if (item[this.valueField] === this.selectedValue) {
                    this.selection = item;
                    selected = true;
                }
            }
            return '<input type="radio" id="'
                    + id + index
                    + '" name=' + id + ' onclick="'
                    + this.getStrCall('selectSingle', index) + '"'
                    + (selected ? 'checked="checked"' : '') + '>';
        }
    },

    /**
     * 初始化表格的字段
     *
     * @protected
     * @param {Array.<Object>} fields 字段数组.
     */
    setFields: function(fields) {
        if (!fields) {
            return;
        }

        // 避免刷新时重新注入
        var _fields = fields.slice(0),
            len = _fields.length;
        while (len--) {
            if (!_fields[len]) {
                _fields.splice(len, 1);
            }
        }
        this._fields = _fields;

        if (!this.select) {
            return;
        }

        switch (this.select.toLowerCase()) {
            case 'multi':
                _fields.unshift(this.checkboxField);
                break;
            case 'single':
                _fields.unshift(this.radioboxField);
                break;
        }
    },

    /**
     * 获取列表体容器素
     *
     * @public
     * @return {HTMLElement}
     */
    getBody: function() {
        return baidu.g(this.getId('body'));
    },

    /**
     * 获取列表头容器元素
     *
     * @public
     * @return {HTMLElement}
     */
    getHead: function() {
        return baidu.g(this.getId('head'));
    },

    /**
     * 获取checkbox选择列表格头部的checkbox表单
     *
     * @private
     * @return {HTMLElement}
     */
    getHeadCheckbox: function() {
        return baidu.g(this.getId('selectAll'));
    },

    onselect: new Function(),

    /**
     * 行的checkbox点击时间处理函数
     *
     * @private
     */
    rowCheckboxClick: function(index) {
        if (this.selectMode != 'line') {
            this.selectMulti(index);
        } else {
            this.preSelectIndex = index;
        }
    },

    /**
     * 根据checkbox是否全部选中，更新头部以及body的checkbox状态
     *
     * @private
     * @param {number} index 需要更新的body中checkbox行，不传则更新全部.
     */
    selectMulti: function(index) {
        var me = this,
            inputs = me.getBody().getElementsByTagName('input'),
            i = 0,
            currentIndex = 0,
            allChecked = me,
            len = inputs.length,
            selectAll = me.getHeadCheckbox(),
            selected = [],
            selectedClass = me.getClass('row-selected'),
            cbIdPrefix = me.getId('multiSelect'),
            input, inputId, row,
            updateAll = !baidu.lang.hasValue(index);

        for (; i < len; i++) {
            input = inputs[i];
            inputId = input.id;
            if (input.getAttribute('type') == 'checkbox'
                && inputId && inputId.indexOf(cbIdPrefix) >= 0
            ) {
                // row = me.getRow(currentIndex); // add speed
                if (updateAll) {
                    row = input.parentNode;
                    while (1) {
                        if (row.tagName == 'DIV' // speed
                            && /^ui-table-row/.test(row.className)
                        ) {
                            break;
                        }
                        row = row.parentNode;
                    }
                }

                if (!input.checked) {
                    allChecked = false;

                    updateAll && baidu.removeClass(row, selectedClass); // add speed
                } else {
                    selected.push(me.datasource[currentIndex]);
                    updateAll && baidu.addClass(row, selectedClass);
                }
                currentIndex++;
            }
        }

        this.selection = selected;
        this.onselect(this.selection);
        if (!updateAll) {
            row = me.getRow(index);
            input = baidu.g(cbIdPrefix + index);
            if (input.checked) {
                baidu.addClass(row, selectedClass);
            } else {
                baidu.removeClass(row, selectedClass);
            }
        }
        selectAll.checked = allChecked;
    },

    /**
     * 单选选取
     *
     * @private
     * @param {number} index 选取的序号.
     */
    selectSingle: function(index) {
        var selectedClass = this.getClass('row-selected'),
            selectedIndex = this.selectedIndex;

        this.selection = this.datasource[index];
        if (this.onselect(this.selection)) {
            if ('number' == typeof selectedIndex) {
                baidu.removeClass(this.getRow(selectedIndex), selectedClass);
            }

            this.selectedIndex = index;
            baidu.addClass(this.getRow(index), selectedClass);
        }
    },

    /**
     * 全选/不选 所有的checkbox表单
     *
     * @private
     */
    toggleSelectAll: function() {
        this.selectAll(this.getHeadCheckbox().checked);
    },

    /**
     * 更新所有checkbox的选择状态
     *
     * @private
     * @param {boolean} checked 是否选中.
     */
    selectAll: function(checked) {
        var inputs = this.getBody().getElementsByTagName('input'),
            len = inputs.length,
            i = 0,
            index = 0,
            selected = [],
            selectedClass = this.getClass('row-selected'),
            input, inputId;

        for (; i < len; i++) {
            input = inputs[i];
            inputId = input.id;
            if (input.getAttribute('type') == 'checkbox'
                && inputId
                && inputId.indexOf('multiSelect') > 0) {
                inputs[i].checked = checked;

                if (checked) {
                    selected.push(this.datasource[index]);
                    baidu.addClass(this.getRow(index), selectedClass);
                } else {
                    baidu.removeClass(this.getRow(index), selectedClass);
                }

                index++;
            }
        }

        this.selection = selected;
        this.onselect(this.selection);
    },

    /**
     * 绘制表格头
     *
     * @private
     */
    renderHead: function() {
        var me = this,
            type = 'head',
            id = me.getId(type),
            head = baidu.g(id);

        if (me.noTitle) {
            return;
        }

        if (!head) {
            head = document.createElement('div');
            head.id = me.getId(type);
            head.className = me.getClass(type);
            head.setAttribute('control', me.id);

            // 绑定拖拽的事件处理
            if (me.dragable) {
                head.onmousemove = me.getHeadMoveHandler();
                head.onmousedown = me.getDragStartHandler();
            }
            me.main.appendChild(head);
        }

        head.style.width = me._width + 'px';
        head.innerHTML = me.getHeadHtml();
    },

    /**
     * 获取表格头鼠标移动的事件handler
     *
     * @private
     * @return {Function}
     */
    getHeadMoveHandler: function() {
        var me = this,
            dragClass = me.getClass('startdrag'),
            page = baidu.page,
            range = 8; // 可拖拽的单元格边界范围

        return function(e) {
            if (me.isDraging) {
                return;
            }

            e = e || window.event;
            var tar = e.srcElement || e.target,
                pageX = e.pageX || e.clientX + page.getScrollLeft(),
                pos,
                index,
                sortable;

            // 寻找th节点。如果查找不到，退出
            tar = me.findDragCell(tar);
            if (!tar) {
                return;
            }

            // 获取位置与序号
            pos = baidu.dom.getPosition(tar);
            index = tar.getAttribute('index');
            sortable = tar.getAttribute('sortable');

            // 如果允许拖拽，设置鼠标手型样式与当前拖拽点
            if (tar.getAttribute('dragleft')
                && pageX - pos.left < range
            ) {
                sortable && (me.titleOutHandler(tar)); // 清除可排序列的over样式
                baidu.addClass(this, dragClass);
                me.dragPoint = 'left';
                me.dragReady = 1;
            } else if (tar.getAttribute('dragright')
                       && pos.left + tar.offsetWidth - pageX < range
            ) {
                sortable && (me.titleOutHandler(tar)); // 清除可排序列的over样式
                baidu.addClass(this, dragClass);
                me.dragPoint = 'right';
                me.dragReady = 1;
            } else {
                baidu.removeClass(this, dragClass);
                sortable && (me.titleOverHandler(tar)); // 附加可排序列的over样式
                me.dragPoint = '';
                me.dragReady = 0;
            }
        };
    },

    /**
     * 查询拖拽相关的表格头单元格
     *
     * @private
     * @param {HTMLElement} target 触发事件的元素.
     * @return {?Node}
     */
    findDragCell: function(target) {
        while (target.nodeType == 1) {
            if (target.tagName == 'TH') {
                return target;
            }
            target = target.parentNode;
        }

        return null;
    },

    /**
     * 获取表格头鼠标点击拖拽起始的事件handler
     *
     * @private
     * @return {Function}
     */
    getDragStartHandler: function() {
        var me = this,
            dragClass = me.getClass('startdrag');

        return function(e) {
            if (baidu.g(me.getId('head')).className.indexOf(dragClass) < 0) {
                return;
            }

            e = e || window.event;
            var tar = e.target || e.srcElement;

            // 寻找th节点，如果查找不到，退出
            tar = me.findDragCell(tar);
            if (!tar) {
                return;
            }

            // 获取显示区域高度
            me.htmlHeight = document.documentElement.clientHeight;

            // 记忆起始拖拽的状态
            me.isDraging = true;
            me.dragIndex = tar.getAttribute('index');
            me.dragStart = e.pageX || e.clientX + baidu.page.getScrollLeft();

            // 绑定拖拽事件
            document.onmousemove = me.getDragingHandler();
            document.onmouseup = me.getDragEndHandler();

            // 显示拖拽基准线
            me.showDragMark(me.dragStart);

            // 阻止默认行为
            baidu.event.preventDefault(e);
            return false;
        };
    },

    /**
     * 获取拖拽中的事件handler
     *
     * @private
     * @desc 移动拖拽基准线.
     * @return {Function}
     */
    getDragingHandler: function() {
        var me = this;
        return function(e) {
            e = e || window.event;
            me.showDragMark(e.pageX || e.clientX + baidu.page.getScrollLeft());
            baidu.event.preventDefault(e);
            return false;
        };
    },

    /**
     * 显示基准线
     *
     * @private
     */
    showDragMark: function(left) {
        var me = this,
            mark = me.getDragMark();

        if (!me.top) {
            me.top = baidu.dom.getPosition(me.main).top;
        }

        if (!mark) {
            mark = me.createDragMark();
        }

        mark.style.top = me.top + 'px';
        mark.style.left = left + 'px';
        mark.style.height = me.htmlHeight - me.top + baidu.page.getScrollTop() + 'px';
    },

    /**
     * 隐藏基准线
     *
     * @private
     */
    hideDragMark: function() {
        var mark = this.getDragMark();
        mark.style.left = '-10000px';
        mark.style.top = '-10000px';
    },

    /**
     * 创建拖拽基准线
     *
     * @private
     * @return {Element}
     */
    createDragMark: function() {
        var mark = document.createElement('div');
        mark.id = this.getId('dragMark');
        mark.className = this.getClass('mark');
        mark.style.top = '-10000px';
        mark.style.left = '-10000px';
        document.body.appendChild(mark);

        return mark;
    },

    /**
     * 获取基准线的dom元素
     *
     * @private
     * @return {Element}
     */
    getDragMark: function() {
        return baidu.g(this.getId('dragMark'));
    },

    /**
     * 获取拖拽结束的事件handler
     *
     * @private
     * @return {Function}
     */
    getDragEndHandler: function() {
        var me = this;
        return function(e) {
            e = e || window.event;
            var minWidth = 40,
                index = parseInt(me.dragIndex, 10),
                pageX = e.pageX || e.clientX + baidu.page.getScrollLeft(),
                offsetX,
                fields = me._fields, field,
                fieldLen = fields.length,
                alters = [], alterWidths = [], alter, alterLen, alterWidth, alterSum = 0,
                colsWidth = me.colsWidth,
                leave, i, revise = 0,
                offsetWidth, currentWidth, roughWidth;

            // 校正拖拽元素
            // 如果是从左边缘拖动的话，拖拽元素应该上一列
            if (me.dragPoint == 'left') {
                index--;
            }

            // 校正拖拽列的宽度
            // 不允许小于最小宽度
            offsetX = pageX - me.dragStart;
            currentWidth = colsWidth[index] + offsetX;
            if (currentWidth < minWidth) {
                offsetX += (minWidth - currentWidth);
                currentWidth = minWidth;
            }

            // 查找宽度允许改变的列
            for (i = index + 1; i < fieldLen; i++) {
                if (!fields[i].stable) {
                    alters.push(i);
                    alterWidth = colsWidth[i];
                    alterWidths.push(alterWidth);
                    alterSum += alterWidth;
                }
            }

            // 计算允许改变的列每列的宽度
            leave = offsetX;
            alterLen = alters.length;
            for (i = 0; i < alterLen; i++) {
                alter = alters[i];
                alterWidth = alterWidths[i];    //当前列宽
                roughWidth = offsetX * alterWidth / alterSum; // 变更的列宽

                // 校正变更的列宽
                // roughWidth可能存在小数点
                if (leave > 0) {
                    offsetWidth = Math.ceil(roughWidth);
                } else {
                    offsetWidth = Math.floor(roughWidth);
                }
                offsetWidth = (Math.abs(offsetWidth) < Math.abs(leave) ? offsetWidth : leave);

                // 校正变更后的列宽
                // 不允许小于最小宽度
                alterWidth -= offsetWidth;
                leave -= offsetWidth;
                if (alterWidth < minWidth) {
                    revise += (minWidth - alterWidth);
                    alterWidth = minWidth;
                }

                colsWidth[alter] = alterWidth;
            }

            // 校正拖拽列的宽度
            // 当影响的列如果宽度小于最小宽度，会自动设置成最小宽度
            // 相应地，拖拽列的宽度也会相应减小
            currentWidth -= revise;
            colsWidth[index] = currentWidth;

            // 重新绘制每一列
            me.resetColumns();

            // 清除拖拽向全局绑定的事件
            document.onmousemove = null;
            document.onmouseup = null;

            me.isDraging = false;
            me.hideDragMark();

            baidu.event.preventDefault(e);
            return false;
        };
    },

    /**
     * 重新设置表格每个单元格的宽度
     *
     * @private
     */
    resetColumns: function() {
        var me = this,
            datasource = me.datasource || [],
            colsWidth = me.colsWidth,
            id = me.id,
            len = colsWidth.length,
            dLen = datasource.length,
            tds = me.getBody().getElementsByTagName('td'),
            tables = me.main.getElementsByTagName('table'),
            tdsLen = tds.length,
            index = 0,
            td,
            width, i, j;


        // 重新设置表格头的每列宽度
        if (!me.noTitle) {
            for (i = 0; i < len; i++) {
                width = colsWidth[i];
                baidu.g(me.getTitleCellId(i)).style.width = width + 'px';
            }
        }

        // 重新设置表格体的每行宽度
        j = tables.length;
        while (j--) {
            td = tables[j];
            if (td.getAttribute('control') == me.id) {
                td.setAttribute('width', me._width - 2);
            }
        }

        // 重新设置表格体的每列宽度
        j = 0;
        for (i = 0; i < tdsLen; i++) {
            td = tds[i];
            if (td.getAttribute('control') == id) {
                td.style.width = colsWidth[j % len] + 'px';
                j++;
            }
        }


    },

    /**
     * 获取表格头单元格的id
     *
     * @private
     * @param {number} index 单元格的序号.
     * @return {string}
     */
    getTitleCellId: function(index) {
        return this.getId('titleCell') + index;
    },

    /**
     * 获取表格头的html
     *
     * @private
     * @return {string}
     */
    getHeadHtml: function() {
        var me = this,
            fields = this._fields,
            len = fields.length,
            html = [],
            i, field, title, canDragBegin, canDragEnd,
            thCntrClass = me.getClass('thcntr'),
            thTextClass = me.getClass('thtext'),
            sortClass = me.getClass('thsort'),
            selClass = me.getClass('thsel'),
            tipClass = me.getClass('thhelp'),
            contentTpl,
            contentHtml,
            orderClass,
            sortIconHtml,
            sortable,
            currentSort,
            tipHtml;

        // 计算最开始可拖拽的单元格
		    // FIXME 修改bug，将dragable作为起始可拖拽的列
		    // 之前为啥是用stable来判断的？费解
        for (i = 0; i < len; i++) {
            if (fields[i].dragable) {
                canDragBegin = i;
                break;
            }
        }

        // 计算最后可拖拽的单元格
        for (i = len - 1; i >= 0; i--) {
            if (fields[i].dragable) {
                canDragEnd = i;
                break;
            }
        }

        // 拼装html
        html.push('<div class="ui-table-head-row">');
        html.push(baidu.format(me.tplTablePrefix, me._width - 2, me.id));
        html.push('<tr>');
        for (i = 0; i < len; i++) {
            field = fields[i];
            title = field.title;
            sortable = (me.sortable && field.sortable);
            currentSort = (sortable
                            && field.field
                            && field.field == me.orderBy);

            // 小提示图标html
            tipHtml = '';
            if (! me.noTip && field.tip) {
                tipHtml = baidu.format(me.tplTipIcon,
                                       tipClass,
                                       ui.ToolTip.getEventString(field.tip));
            }

            // 计算排序图标样式
            sortIconHtml = '';
            orderClass = '';
            if (sortable) {
                if (currentSort) {
                    orderClass = ' ' + me.getClass('th' + me.order)
                                    + ' ' + me.getClass('thcntr-sort');
                }
                sortIconHtml = baidu.format(me.tplSortIcon,
                                        sortClass);
            }

            // 计算内容html
            // 如果通过function制定title，则不绘制排序小图标
            if ('function' == typeof title) {
                contentHtml = title.call(me);
                sortIconHtml = '';
            } else {
                contentHtml = title || '';
            }

            if (contentHtml.indexOf('<') > -1) {
                contentTpl = '<div class="{0}">{1}</div>{2}';
            }
            else {
                contentTpl = '<div class="{0}" title="{1}">{1}</div>{2}';
            }

            contentHtml = baidu.format(contentTpl,
                                        thTextClass,
                                        contentHtml,
                                        sortIconHtml);
            html.push('<th id="' + this.getTitleCellId(i) + '" index="' + i + '"',
                        sortAction(field, i),
                        (i >= canDragBegin && i < canDragEnd ? ' dragright="1"' : ''),
                        (i <= canDragEnd && i > canDragBegin ? ' dragleft="1"' : ''),
                        ' style="width:' + me.colsWidth[i] + 'px">',
                        '<div class="' + thCntrClass + orderClass +
                        (field.select ? ' ' + selClass : '') + '">',
                        contentHtml,
                        tipHtml,
                        '</div></th>');
        }
        html.push('</tr></table></div>');
        return html.join('');

        /**
         * 获取表格排序的单元格预定义属性html
         *
         * @private
         * @return {string}
         */
        function sortAction(field, index) {
            if (me.sortable && field.sortable) {
                return baidu.format(
                            ' onmouseover="{0}" onmouseout="{1}" onclick="{2}" sortable="1"',
                            me.getStrRef() + '.titleOverHandler(this)',
                            me.getStrRef() + '.titleOutHandler(this)',
                            me.getStrRef() + '.titleClickHandler(this)');
            }

            return '';
        }
    },

    tplSortIcon: '<div class="{0}"></div>',
    tplTipIcon: '<div class="{0}" {1}></div>',

    /**
     * 表格头单元格鼠标移入的事件handler
     *
     * @private
     * @param {HTMLElement} cell 移出的单元格.
     */
    titleOverHandler: function(cell) {
        if (this.isDraging || this.dragReady) {
            return;
        }

        this.sortReady = 1;
        baidu.addClass(cell.firstChild, this.getClass('thcntr-hover'));
    },

    /**
     * 表格头单元格鼠标移出的事件handler
     *
     * @private
     * @param {HTMLElement} cell 移出的单元格.
     */
    titleOutHandler: function(cell) {
        this.sortReady = 0;
        baidu.removeClass(cell.firstChild, this.getClass('thcntr-hover'));
    },

    onsort: new Function(),

    /**
     * 表格头单元格点击的事件handler
     *
     * @private
     * @param {HTMLElement} cell 点击的单元格.
     */
    titleClickHandler: function(cell) {
        if (this.sortReady) { // 避免拖拽触发排序行为
            var me = this,
                field = me._fields[cell.getAttribute('index')],
                orderBy = me.orderBy,
                order = me.order;

            if (orderBy == field.field) {
                order = (!order || order == 'asc') ? 'desc' : 'asc';
            } else {
                order = 'desc';
            }

            me.onsort.call(me, field, order);
            me.order = order;
            me.orderBy = field.field;
            me.renderHead();

            me.renderBody();
        }
    },

    /**
     * 重置表头样式
     *
     * @private
     */
    resetHeadStyle: function() {
        var ths = this.getHead().getElementsByTagName('th'),
            len = ths.length,
            th;

        while (len--) {
            th = ths[len];
            baidu.removeClass(th.firstChild, this.getClass('thcntr-sort'));
        }
    },

    /**
     * @param {Function} handler 设置点击表格内容时候的处理函数.
     */
    setBodyClickHandler: function(handler) {
        var body = baidu.g(this.getId('body'));
        body.onclick = handler;
    },

    /**
     * 绘制表格主体
     *
     * @private
     */
    renderBody: function() {
        var me = this,
            type = 'body',
            id = me.getId(type),
            list = baidu.g(id),
            style;

        if (!list) {
            list = document.createElement('div');
            list.id = id;
            list.className = me.getClass(type);

            if (me.bodyHeight) {
                style = list.style;
                style.height = me.bodyHeight + 'px';
                style.overflowX = 'hidden';
                style.overflowY = 'scroll';
            }
            me.main.appendChild(list);
        }

        list.style.width = me._width + 'px';
        list.innerHTML = me.getBodyHtml();
    },

    /**
     * 获取表格体的单元格id
     *
     * @protected
     * @param {number} rowIndex 当前行序号.
     * @param {number} fieldIndex 当前字段序号.
     * @return {string}
     */
    getBodyCellId: function(rowIndex, fieldIndex) {
        return this.getId('cell') + rowIndex + '_' + fieldIndex;
    },

    /**
     * 获取表格主体的html
     *
     * @private
     * @return {string}
     */
    getBodyHtml: function() {
        var data = this.datasource || [],
            dataLen = data.length,
            html = [],
            i, j, item, field;

        if (!dataLen) {
            return this.noDataHtml;
        }

        for (i = 0; i < dataLen; i++) {
            item = data[i];
            html.push(this.getRowHtml(item, i));
        }

        return html.join('');
    },

    tplRowPrefix: '<div id="{0}" class="{1}" onmouseover="{2}" onmouseout="{3}" onclick="{4}">',

    /**
     * 获取表格行的html
     *
     * @protected
     * @param {Object} data 当前行的数据.
     * @param {number} index 当前行的序号.
     * @return {string}
     */
    getRowHtml: function(data, index) {
        var me = this,
            html = [],
            field,
            fields = me._fields,
            fieldLen = fields.length,
            colWidth,
            content,
            tdCntrClass = me.getClass('tdcntr'),
            tdBreakClass = me.getClass('tdbreak'),
            tdClass,
            subrow = me.subrow && me.subrow != 'false',
            subentry,
            subentryHtml,
            contentHtml,
            sortable,
            currentSort,
            orderClass,
            i;

        html.push(baidu.format(me.tplRowPrefix,
                               me.getId('row') + index,
                               me.getClass('row'),
                               me.getStrCall('rowOverHandler', index),
                               me.getStrCall('rowOutHandler', index),
                               me.getStrCall('rowClickHandler', index)),
                  baidu.format(me.tplTablePrefix, me._width - 2, me.id));

        for (i = 0; i < fieldLen; i++) {
            field = fields[i];
            content = field.content;
            colWidth = me.colsWidth[i];
            subentry = subrow && field.subEntry;
            tdClass = field.breakLine ? tdBreakClass : tdCntrClass;
            if (field.select) {
                tdClass += ' ' + me.getClass('tdsel');
            }

            /** 当点击表头排序时，改变表格样式 **/
            sortable = (me.sortable && field.sortable);
            currentSort = (sortable &&
                           field.field &&
                           field.field == me.orderBy);

            orderClass = '';
            if (sortable) {
                if (currentSort) {
                    orderClass = ' ' + me.getClass('tdcntr-sort');
                }
            }

            contentHtml = '<div class="' + tdClass + '">' + (field.breakLine ? '' : '<nobr>')
                            + ('function' == typeof content ? content.call(me, data, index, i) : data[content])
                            + (field.breakLine ? '' : '</nobr>') + '</div>';

            subentryHtml = '&nbsp;';
            if (subentry) {
                if (typeof field.isSubEntryShow != 'function'
                    || field.isSubEntryShow.call(me, data, index, i) !== false
                ) {
                    subentryHtml = me.getSubEntryHtml(index);
                }

                contentHtml = '<table width="100%" border="0" collpadding="0" collspacing="0">'
                    + '<tr><td width="' + (me.skin == 'white-table' ? 20 : 14) + '" align="right">'
                    + subentryHtml
                    + '</td><td>' + contentHtml + '</td></tr></table>';

            }
            html.push('<td id="' + me.getBodyCellId(index, i) + '"',
                    subentry ? ' class="' + me.getClass('subentryfield') + '"' : ' class="' + orderClass + '"',
                    ' style="width:' + colWidth + 'px" control="' + me.id,
                    '" row="' + index + '" col="' + i + '">',
                    contentHtml,
                    '</td>');
        }
        html.push('</tr></table></div>');

        // 子行html
        if (subrow) {
            html.push(me.getSubrowHtml(index));
        }

        return html.join('');
    },

    /**
     * subrow入口的html模板
     *
     * @private
     */
    tplSubEntry: '<div class="{0}" onmouseover="{2}" onmouseout="{3}" onclick="{4}" id="{1}" title="{5}"></div>',

    getSubEntryHtml: function(index) {
        var me = this;
        return baidu.format(me.tplSubEntry,
                            me.getClass('subentry'),
                            me.getSubentryId(index),
                            me.getStrCall('entryOver', index),
                            me.getStrCall('entryOut', index),
                            me.getStrCall('fireSubrow', index),
                            me.subEntryTipOpen);
    },

    getSubrowHtml: function(index) {
        return '<div id="' + this.getSubrowId(index)
                    + '" class="' + this.getClass('subrow') + '"'
                    + ' style="display:none"></div>';
    },

    getSubrow: function(index) {
        return baidu.g(this.getSubrowId(index));
    },

    getSubrowId: function(index) {
        return this.getId('subrow') + index;
    },

    getSubentryId: function(index) {
        return this.getId('subentry') + index;
    },

    entryOver: function(index) {
        var el = baidu.g(this.getSubentryId(index)),
            opened = /subentry-opened/.test(el.className),
            classBase = 'subentry-hover';

        if (opened) {
            classBase = 'subentry-opened-hover';
        }

        baidu.addClass(el, this.getClass(classBase));
    },

    entryOut: function(index) {
        var id = this.getSubentryId(index);
        baidu.removeClass(id, this.getClass('subentry-hover'));
        baidu.removeClass(id, this.getClass('subentry-opened-hover'));
    },

    fireSubrow: function(index) {
        var me = this,
            currentIndex = me.subrowIndex,
            datasource = me.datasource,
            dataLen = (datasource instanceof Array && datasource.length),
            dataItem;

        if (!dataLen || index >= dataLen) {
            return;
        }

        if (currentIndex !== index) {
            dataItem = datasource[index];
            if (me.onsubrowopen(index, dataItem) !== false) {
                me.openSubrow(index);
            }
        } else {
        	dataItem = datasource[index];
            if (me.onsubrowclose(index, dataItem) !== false) {
                me.closeSubrow(index);
            }
        }

        me.entryOver(index);
    },

    closeSubrow: function(index) {
        var me = this,
            subrowId = me.getSubrowId(index),
            entryId = me.getSubentryId(index);

        me.entryOut(index);
        me.subrowIndex = null;
        baidu.removeClass(entryId, me.getClass('subentry-opened'));
        baidu.removeClass(me.getRow(index), me.getClass('row-unfolded'));
        baidu.hide(subrowId);
        baidu.setAttr(entryId, 'title', me.subEntryTipOpen);

        return true;
    },

    onsubrowopen: new Function(),

    onsubrowclose: new Function(),

    openSubrow: function(index) {
        var me = this,
            currentIndex = me.subrowIndex,
            entry = baidu.g(me.getSubentryId(index));

        if (baidu.lang.hasValue(currentIndex)) {
            me.closeSubrow(currentIndex);
        }

        baidu.addClass(entry, me.getClass('subentry-opened'));
        baidu.addClass(me.getRow(index), me.getClass('row-unfolded'));
        entry.setAttribute('title', me.subEntryTipClose);
        baidu.show(me.getSubrowId(index));
        me.subrowIndex = index;
    },

    /**
     * 表格行鼠标移上的事件handler
     *
     * @private
     * @param {number} index 表格行序号.
     */
    rowOverHandler: function(index) {
        if (this.isDraging) {
            return;
        }

        var row = this.getRow(index);
        if (row) {
            baidu.addClass(row, this.getClass('row-over'));
        }
    },

    /**
     * 表格行鼠标移出的事件handler
     *
     * @private
     * @param {number} index 表格行序号.
     */
    rowOutHandler: function(index) {
        var row = this.getRow(index);
        if (row) {
            baidu.removeClass(row, this.getClass('row-over'));
        }
    },

    /**
     * 阻止行选，用于点击在行的其他元素，不希望被行选时。
     *
     * @public
     */
    preventLineSelect: function() {
        this.dontSelectLine = 1;
    },

    /**
     * 表格行鼠标点击的事件handler
     *
     * @private
     * @param {number} index 表格行序号.
     */
    rowClickHandler: function(index) {
        if (this.selectMode == 'line') {
            if (this.dontSelectLine) {
                this.dontSelectLine = false;
                return;
            }

            var input;

            switch (this.select) {
                case 'multi':
                    input = baidu.g(this.getId('multiSelect') + index);
                    // 如果点击的是checkbox，则不做checkbox反向处理
                    if (!baidu.lang.hasValue(this.preSelectIndex)) {
                        input.checked = !input.checked;
                    }
                    this.selectMulti(index);
                    this.preSelectIndex = null;
                    break;
                case 'single':
                    input = baidu.g(this.getId('singleSelect') + index);
                    input.checked = true;
                    this.selectSingle(index);
                    break;
            }
        }
    },

    /**
     * 获取表格内容行的dom元素
     *
     * @private
     * @param {number} index 行号.
     * @return {HTMLElement}
     */
    getRow: function(index) {
        return baidu.g(this.getId('row') + index);
    },

    /**
     * 获取选中的数据
     *
     * @public
     */
    getSelection: function() {
        return this.selection;
    },

    /**
     * 绑定模型后需重设_fields
     *
     * @public
     * @param {Object} model 数据模型.
     */
    bindModel: function(model) {
        ui.Table.superClass.bindModel.call(this, model);

        this.setFields(this.fields);
    },

    /**
     * 释放控件
     *
     * @protected
     */
    dispose: function() {
        var head = baidu.g(this.getId('head')),
            body = baidu.g(this.getId('body')),
            mark = baidu.g(this.getId('dragMark'));

        if (head) {
            head.onmousemove = null;
            head.onmousedown = null;
        }

        if (mark) {
            document.body.removeChild(mark);
        }

        if (body) {
            body.onclick = null;
        }

        ui.Table.superClass.dispose.call(this);

        if (this.resizeHandler) {
            baidu.un(window, 'resize', this.resizeHandler);
        }
    }
};
baidu.inherits(ui.Table, ui.Control);
