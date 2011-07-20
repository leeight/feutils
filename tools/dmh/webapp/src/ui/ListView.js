/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/ListView.js
 * desc:    列表显示控件
 * author:  yuanhongliang
 * date:    $Date: 2011-05-07 13:14:27 +0800 (周六, 07 五月 2011) $
 */

goog.require('ui.Control');
goog.require('ui.Label');
goog.require('ui.Button');
goog.require('ui.Table');

goog.include('ui/ListView.html');
goog.include('css/ui-richsel.css');

goog.provide('ui.ListView');

/**
 * ui.ListView
 * @constructor
 * @extends {ui.Control}
 * @export
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
