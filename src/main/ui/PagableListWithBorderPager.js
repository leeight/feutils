goog.require('base.DataSource');
goog.require('ui.Control');

goog.provide('ui.PagableListWithBorderPager');

/**
 * @constructor
 * @extends {ui.Control}
 */
ui.PagableListWithBorderPager = function(options) {
    /**
     * @type {?base.DataSource}
     */
    this.datasource = null;
    
    /**
     * @type {Array.<Object>}
     */
    this.fields = null;
    
    /**
     * @type {number}
     */
    this.pageNo = 1;

    /**
     * @type {number}
     */
    this.pageSize = 15;
    
    /**
     * @type {number}
     */
    this.pagerCount = 5;
    
    /**
     * @type {string}
     */
    this.orderBy = '';
    
    /**
     * @type {string}
     */
    this.order = '';
    
    /**
     * @type {boolean}
     */
    this.subrow = false;
    
    /**
     * @type {string}
     */
    this.select = 'multi';
    
    
    this.skin = null;

    ui.Control.call(this, options);
    
    /**
     * @type {string}
     */
    this.view = 'PagableListWithBorderPager';
};

ui.PagableListWithBorderPager.prototype = function() {

    function getDataCallback(data) {
        var page = data.page,
            totalCount = page.totalCount,
            pageNo = page.pageNo,
            pageSize = page.pageSize,
            totalPage = Math.ceil(totalCount / pageSize),
            startIndex = pageSize * (pageNo - 1) + 1,
            endIndex = pageSize * pageNo;

        // 开始和结束条目容错
        startIndex = Math.min(startIndex, totalCount);
        endIndex = Math.min(endIndex, totalCount);
        this.getChild('listTable').rebindModel({
            listFields: this.fields,
            result: page.result,
            order: page.order,
            orderBy: page.orderBy,
            subrow: this.subrow,
            select: this.select,
            skin: this.skin
        });
        this.getChild('listPager').rebindModel({
            pagerCount: this.pagerCount,
            page: pageNo,
            totalPage: totalPage
        });
        this.getChild('listInfo').rebindModel({
            startIndex: startIndex,
            endIndex: endIndex,
            totalCount: totalCount
        });
        this.getChild('pageSize').rebindModel({
            pageSize: pageSize
        });
    }

    /**
     * 表格排序
     *
     * @private
     * @param {string} field 排序字段.
     * @param {string} order 正序|倒序.
     */
    function onListSorted(field, order) {
        var fieldName = field.field;
        this.orderBy = fieldName;
        this.order = order;
        this.onstatechange(this.getState());
    }

    /**
     * 页数切换
     *
     * @private
     * @param {number} page 页数.
     */
    function onPageNoChanged(page) {
        this.pageNo = page;
        this.onstatechange(this.getState());
    }

    /**
     * 每页显示个数变化切换
     *
     * @private
     * @param {number} size 每页显示个数.
     */
    function onPageSizeChanged(size) {
        this.pageSize = size;
        this.onstatechange(this.getState());
    }

    function onListSelected(selectedItems) {
        this.onlistselect(selectedItems);
    }

    function onSubRowOpened(index) {
       var container = this.getChild('listTable').getSubrow(index),
            item = this.getChild('listTable').model.result[index];
        this.onsubrowopen(index, item);
    }

    return {

        /**
         * @this {ui.PagableListWithBorderPager}
         */
        onlistselect: function(selectedItems) {},

        /**
         * @this {ui.PagableListWithBorderPager}
         */
        onsubrowopen: function(container, item) {},

        /**
         * @this {ui.PagableListWithBorderPager}
         */
        onstatechange: function(pagableList) {},

        /**
         * @this {ui.PagableListWithBorderPager}
         * @return {{pageSize:number,pageNo:number,
         *           orderBy:string,order:string}}
         */
        getState: function() {
            return {
                pageSize: this.pageSize,
                pageNo: this.pageNo,
                orderBy: this.orderBy,
                order: this.order
            };
        },

        /**
         * @this {ui.PagableListWithBorderPager}
         */
        getData: function() {
            var params = this.getState();
            this.datasource.getData(params, baidu.fn.bind(getDataCallback, this));
        },

        /**
         * @inheritDoc
         * @this {ui.PagableListWithBorderPager}
         */
        bindEvent: function() {
            var listTable = this.getChild('listTable'),
                listPager = this.getChild('listPager'),
                pageSize = this.getChild('pageSize');

            listTable.onselect = baidu.fn.bind(onListSelected, this);
            listTable.onsubrowopen = baidu.fn.bind(onSubRowOpened, this);
            listTable.onsort = baidu.fn.bind(onListSorted, this);
            listPager.onselect = baidu.fn.bind(onPageNoChanged, this);
            pageSize.onselect = baidu.fn.bind(onPageSizeChanged, this);
        },

        /**
         * @inheritDoc
         * @this {ui.PagableListWithBorderPager}
         */
        dispose: function() {
            var listTable = this.getChild('listTable'),
                listPager = this.getChild('listPager'),
                pageSize = this.getChild('pageSize');

            listTable.onselect = null;
            listTable.onsubrowopen = null;
            listTable.onsort = null;
            listPager.onselect = null;
            pageSize.onselect = null;

            ui.PagableListWithBorderPager.superClass.dispose.call(this);
        }
    };
}();
baidu.inherits(ui.PagableListWithBorderPager, ui.Control);
