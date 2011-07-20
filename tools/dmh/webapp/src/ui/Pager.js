/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Pager.js
 * desc:    分页控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

goog.require('ui.Control');

goog.include('css/ui-pager.css');

goog.provide('ui.Pager');

/**
 * 文本输入框组件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 * @export
 */
ui.Pager = function(options) {
    ui.Control.call(this, options);

    /**
     * @type {string}
     */
    this.type = 'pager';

    /**
     * @type {boolean}
     */
    this.autoState = false;

    /**
     * @type {string}
     */
    this.prevWord = this.prevWord || '&lt;&nbsp;上一页';

    /**
     * @type {string}
     */
    this.nextWord = this.nextWord || '下一页&nbsp;&gt;';

    /**
     * @type {string}
     */
    this.omitWord = this.omitWord || '...';

    /**
     * 显示多少个页码.
     * @type {number}
     * @noalias
     */
    this.showCount = parseInt(this.showCount, 10) || 5;

    /**
     * 总的页数
     * @type {number}
     * @noalias
     */
    this.total = 0;

    /**
     * 当前页
     * @type {number}
     * @noalias
     */
    this.page = 1;
};

ui.Pager.prototype = /** @lends {ui.Pager.prototype} */ {
    /**
     * 获取文本输入框的值
     *
     * @return {number}
     */
    getPage: function() {
        return this.page + 1;//恶心
    },

    /**
     * @inheritDoc
     */
    render: function(main) {
        var me = this;
        ui.Pager.superClass.render.call(me, main);

        me.total = parseInt(me.total, 10) || 0;

        // 恶心的系统要求我们，page是从1开始的，在这里修改成本最小了
        me.page = parseInt(me.page, 10) || 1;

        // 绘制内容部分
        this.renderPages();
    },

    tplMain: '<ul>{0}</ul>',
    tplItem: '<li onmouseover="{3}" onmouseout="{4}"><span class="{0}" onclick="{1}">{2}</span></li>',
    tplInfo: '<li><span class="{0}">{1}</span></li>',

    /**
     * 绘制页码区
     *
     * @private
     */
    renderPages: function() {
        var me = this,
            html = [],
            total = me.total,
            last = total - 1,
            page = me.page - 1,// 恶心
            itemClass = me.getClass('item'),
            disClass = me.getClass('disabled'),
            omitWord = baidu.format(me.tplInfo,
                                     me.getClass('omit'),
                                     me.omitWord),
            i, begin;

        if (total <= 0) {
            this.main.innerHTML = '';
            return;
        }

        // 计算起始页
        if (page < me.showCount - 1) {
            begin = 0;
        } else if (page > total - me.showCount) {
            begin = total - me.showCount;
        } else {
            begin = page - Math.floor(me.showCount / 2);
        }
        if (begin < 0) {
            begin = 0;
        }

        // 绘制前一页的link
        if (page > 0) {
            html.push(me.getItemHtml(me.getClass('prev'),
                                     me.getStrCall('select', page - 1),
                                     me.prevWord));
        } else {
            html.push(baidu.format(me.tplInfo,
                                   disClass,
                                   me.prevWord));
        }

        // 绘制前缀
        if (begin > 0) {
            html.push(me.getItemHtml(this.getClass('prev'),
                                     this.getStrCall('select', 0),
                                     1),
                      omitWord);
        }

        // 绘制中间的序号
        for (i = 0; i < me.showCount && begin + i < total; i++) {
            if (begin + i != page) {
            html.push(me.getItemHtml(itemClass,
                                     me.getStrCall('select', begin + i),
                                     1 + begin + i)
                      );
            } else {
                html.push(baidu.format(me.tplInfo,
                                       me.getClass('selected'),
                                       1 + begin + i)
                         );
            }
        }

        // 绘制后缀
        if (begin < total - me.showCount) {
            html.push(omitWord,
                      me.getItemHtml(itemClass,
                                     me.getStrCall('select', last),
                                     total)
                      );
        }


        // 绘制后一页的link
        if (page < last) {
            html.push(me.getItemHtml(me.getClass('next'),
                                     me.getStrCall('select', page + 1),
                                     me.nextWord));
        } else {
            html.push(baidu.format(me.tplInfo,
                                   disClass,
                                   me.nextWord));
        }

        this.main.innerHTML = baidu.format(me.tplMain,
                                           html.join(''));
    },

    /**
     * @private
     */
    getItemHtml: function(sClass, sClick, sText) {
        var me = this,
            strRef = me.getStrRef(),
            itemOver = strRef + '.itemOverHandler(this)',
            itemOut = strRef + '.itemOutHandler(this)';
            return baidu.format(me.tplItem,
                                sClass,
                                sClick,
                                sText,
                                itemOver,
                                itemOut);
    },

    onselect: new Function(),

    /**
     * 选择页码
     *
     * @param {number} page 选中页数.
     */
    select: function(page) {
        page++;// 恶心
        if (this.onselect(page) !== false) {
            this.page = page;
            this.renderPages();
        }
    }
};

/**
 * @param {Element} item 页码元素.
 * @export
 */
ui.Pager.prototype.itemOverHandler = function(item) {
    baidu.addClass(item, this.getClass('hover'));
};

/**
 * @param {Element} item 页码元素.
 * @export
 */
ui.Pager.prototype.itemOutHandler = function(item) {
    baidu.removeClass(item, this.getClass('hover'));
};
baidu.inherits(ui.Pager, ui.Control);
