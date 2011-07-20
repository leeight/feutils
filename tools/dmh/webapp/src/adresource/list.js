/**
 * 资源预估列表
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
adresource.List = function() {
    er.ListAction.call(this);
};

adresource.List.prototype = {
    view: 'adresourceList',

    CONTEXT_INITER_LIST: ['initFields'],

    initFields: function(query, callback) {
        this.model.fields = adresource.config.listFields;
        callback();
    },

    afterInit: function(page) {
        this.list = page.c('list');
        this.requesterList = adresource.data.list;
    },

    initBehavior: function(page) {
        adresource.List.superClass.initBehavior.call(this, page);
    }
};

baidu.inherits(adresource.List, er.ListAction);
