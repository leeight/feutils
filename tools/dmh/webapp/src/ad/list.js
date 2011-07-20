/**
 * 广告列表
 */

/**
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
ad.List = function() {
    er.ListAction.call(this);
};

ad.List.prototype = {
    view: 'adList',

    CONTEXT_INITER_LIST: ['initTime', 'initFields', 'initTypes', 'initStatus', 'initCommunities', 'initKeywords'],

    initTime: function(query, callback) {
    	var paser = function(date) {
    		if (baidu.lang.isDate(date)) {
    			return date;
    		}
    		else if (date.length == 14) {
    			return dn.util.parseToDate(date);
    		}
    		else {
    			return new Date(date);
    		}
    	}

    	if (this.model.start_time) {
    		this.model.start_time = dn.util.parseToDate(this.model.start_time);
    		this.model.end_time = dn.util.parseToDate(this.model.end_time);
    	}
        callback();
    },

    initFields: function(query, callback) {
        this.model.fields = ad.config.listFields;
        callback();
    },

    initTypes: function(query, callback) {
        var defaultOption = [{text: '全部', value: ''}];
        this.model.searchTypes = defaultOption.concat(er.context.get('productTypeList'));
        callback();
    },

    initStatus: function(query, callback) {
        this.model.searchAdStatus = er.context.get('adStatusFilterList');
        callback();
    },

    initCommunities: function(query, callback) {
    	this.model.searchCommunity = er.context.get('orientCommunityTypeList');
        callback();
    },

    initKeywords: function(query, callback) {
    	this.model.searchKeywords = er.context.get('orientKeywordsTypeList');
        callback();
    },

    afterInit: function(page) {
    	this.formSearch = page.c('formSearch');
        this.pnlBatch = page.c('pnlOperation');
        this.list = page.c('listAd');
        this.requesterList = ad.data.list;
        this.requesterBatch = ad.data.batchUpdate;
    },

    initBehavior: function(page) {
        ad.List.superClass.initBehavior.call(this, page);

        var pnl = this.page.c('pnlOperation');
        pnl.c('btnPause').onclick = baidu.fn.bind(this.setStatus, this, 6);
        pnl.c('btnRecover').onclick = baidu.fn.bind(this.setStatus, this, -6);
        pnl.c('btnDelete').onclick = baidu.fn.bind(this.setStatus, this, 7);
    },

    /**
     * 批量设置状态
     * @param {Number} status 状态值.
     */
    setStatus: function(status) {
        this.batchUpdate('status', status);
    },

    processParam: function(params) {
    	return params.replace(/(end_time=\d{8})(\d{6})/, function($0,$1) {
    		return $1 + '235959';
    	});
    }
};
baidu.inherits(ad.List, er.ListAction);
