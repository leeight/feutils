/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/ListView.js
 * desc:    列表显示控件
 * author:  yuanhongliang
 * date:    $Date$
 */

/**
 * ui.ListView
 * @constructor
 * @extends {ui.Control}
 */
ui.ListView = function(options) {
    ui.Control.call(this, options);

    this.title = '';
    this.withModifyButton = true;
    this.datasource = null;
    this.view = 'ListViewer';
    this.type = 'richsel';
};
ui.ListView.prototype = function() {

    function onBtnModifyClick() {
        this.onmodify(this.datasource);
    }

    return {
        onmodify: function(list) {},

        bindModel: function(model) {
            ui.ListView.superClass.bindModel.call(this, model);

            this.c('lblTitle').bindModel({title: this.title});
            this.c('list').bindModel({
                datasource: this.datasource,
                fields: this.fields
            });
        },

        render: function(main) {
            ui.ListView.superClass.render.call(this, main);

            if (!this.withModifyButton) {
                this.c('btnModify').hide();
            }
        },

        bindEvent: function() {
            ui.ListView.superClass.bindEvent.call(this);

            this.c('btnModify').onclick = baidu.fn.bind(onBtnModifyClick, this);
        },

        dispose: function() {
            this.c('btnModify').onclick = null;

            ui.ListView.superClass.dispose.call(this);
        }
    };
}();
baidu.inherits(ui.ListView, ui.Control);
