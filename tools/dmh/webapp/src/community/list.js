/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: list.js 5180 2011-04-28 15:28:52Z liyubei $
 *
 **************************************************************************/



/**
 * list.js ~ 2011/02/17 22:36:46
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5180 $
 * @description
 * 生活圈列表
 **/


goog.require('base.BaseModel');
goog.require('community.config');
goog.require('community.data');
goog.require('dn.lang');
goog.require('er.ListAction');
goog.require('er.context');
goog.require('ui.Button');

goog.require('ui.Form');

goog.require('ui.Link');
goog.require('ui.PagableList');

goog.require('ui.Panel');

goog.include('community/list.html');

// init
goog.require('ui.SubmitButton');
goog.require('ui.TextInput');

goog.provide('community.List');

/**
 * 生活圈列表
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
community.List = function() {
  er.ListAction.call(this);

  this.model = new base.BaseModel({
    'fields' : community.config.listFields,
    'selectedItems': null,
    'searchParams': null,
    'listState': null
  });

  this.view = 'communityList';
};
baidu.inherits(community.List, er.ListAction);


/**
 * FIXME 不应该直接从ActionList中继承对应的属性
 * 初始化Action中的属性
 * @param {ui.Page} page 当前页面.
 */
community.List.prototype.afterInit = function(page) {
  this.formSearch = /** @type {ui.Form} */ (page.c('formSearch'));
  this.pnlBatch = /** @type {ui.Panel} */ (page.c('pnlOperation'));
  this.list = /** @type {ui.PagableList} */ (page.c('list'));
  this.requesterList = community.data['list'];
  this.requesterBatch = community.data['status_update'];
};

/** @inheritDoc */
community.List.prototype.initBehaviorInternal = function() {
  var me = this,
      communityStatusMap = er.context.get('communityStatusMap'),
      archiveButton = this.pnlBatch.getChild('batch-archive-button'),
      archiveStatus = communityStatusMap.getKey(archiveButton.getLabel());

  if (baidu.lang.hasValue(archiveStatus)) {
    archiveButton.onclick = function() {
      me.batchUpdate('status', archiveStatus);
    }
  }
};















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
