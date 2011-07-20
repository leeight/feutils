/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: keywords.js 5156 2011-04-27 04:15:29Z liyubei $
 *
 **************************************************************************/



/**
 * keywords.js ~ 2011/02/19 16:22:53
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5156 $
 * @description
 * 关键词报告
 **/


goog.require('er.ListAction');
goog.require('report');

goog.provide('report.Keywords');



/**
 * @constructor
 * @extends {er.ListAction}
 */
report.Keywords = function() {
  er.ListAction.call(this);

  /**
   * @type {base.BaseModel}
   */
  this.model = new base.BaseModel({
    'selectedItems': null,
    'searchParams': null,
    'listState': null
  });

  /**
   * @type {string}
   */
  // this.view = 'keywordsReport';
};
baidu.inherits(report.Keywords, er.ListAction);


/**
 * 数据表的配置信息，因为每个报表的配置信息不同，所以不方便
 * 统一放到report.config里面了.
 * @const
 * @type {Array.<Object>}
 */
report.Keywords.LIST_FIELDS = [
  {
    'title' : '关键词',
    'field' : 'keyword',
    'content' : function(item) {
      return item['keyword'];
    }
  },
  {
    'title' : '展现量',
    'field' : 'impression_count',
    'content' : function(item) {
      return item['impression_count'];
    }
  },
  {
    'title' : '点击量',
    'field' : 'click_count',
    'content' : function(item) {
      return item['click_count'];
    }
  },
  {
    'title' : '点击率',
    'field' : 'click_ratio',
    'content' : function(item) {
      return item['click_ratio'];
    }
  }
];


/** @inheritDoc */
report.Keywords.prototype.afterInit = function(page) {
  this.list = /** @type {ui.PagableList} */ page.c('list');
  this.requesterList = report.data.keywords;
};


/** @inheritDoc */
report.Keywords.prototype.initModel = function(argMap, callback) {
  // fields
  this.model['fields'] = report.Keywords.LIST_FIELDS;

  callback();
};



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
