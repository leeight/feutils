/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: list.js 5258 2011-05-06 01:09:15Z liyubei $
 *
 **************************************************************************/



/**
 * list.js ~ 2011/02/18 23:19:56
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5258 $
 * @description
 * 计费名列表页面
 **/

goog.require('base.BaseModel');
goog.require('charge.data');
goog.require('dn.lang');
goog.require('er.ListAction');

goog.require('ui.Button');
goog.require('ui.Form');
goog.require('ui.Link');
goog.require('ui.PagableList');
goog.require('ui.Panel');
goog.require('ui.SubmitButton');
goog.require('ui.TextInput');

goog.include('charge/list.html');

goog.provide('charge.List');



/**
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
charge.List = function() {
  er.ListAction.call(this);

  this.model = new base.BaseModel({
    'fields' : charge.config.listFields,
    'selectedItems': null,
    'searchParams': null,
    'listState': null
  });

  this.view = 'chargeList';
};
baidu.inherits(charge.List, er.ListAction);


/** @inheritDoc */
charge.List.prototype.afterInit = function(page) {
  this.formSearch = page.c('formSearch');
  this.pnlBatch = page.c('pnlOperation');
  this.list = page.c('list');
  this.requesterList = charge.data.list;
  this.requesterBatch = charge.data.batch_delete;
};


/** @inheritDoc */
charge.List.prototype.initBehaviorInternal = function() {
  var me = this,
      deleteButton = me.pnlBatch.getChild('batch-delete-button');

  deleteButton.onclick = function() {
    me.batchUpdate();
  }
};




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
