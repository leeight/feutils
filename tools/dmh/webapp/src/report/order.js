/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: order.js 5185 2011-04-28 15:46:17Z liyubei $
 *
 **************************************************************************/



/**
 * order.js ~ 2011/03/08 17:14:59
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5185 $
 * @description
 *
 **/

goog.require('base.BaseModel');
goog.require('er.Action');

goog.provide('report.Order');



/**
 * @constructor
 * @extends {er.Action}
 */
report.Order = function() {
  er.Action.call(this);

  this.model = new base.BaseModel({});
};
baidu.inherits(report.Order, er.Action);


/**
 * 模板视图
 * @type {string}
 */
report.Order.prototype.view = 'orderReport';

/**
 * @const
 */
report.Order.MenuDataSource = [
  {
    'className' : 'dn-report-daily',
    'actionName' : 'report.order.Daily',
    'text' : '每日报告'
  },
  {
    'className' : 'dn-report-location',
    'actionName' : 'report.order.Location',
    'text' : '分地域报告'
  },
  {
    'className': 'dn-report-perhour',
    'actionName': 'report.order.Perhour',
    'text': '分时段报告'
  },
  {
    'className': 'dn-report-frequency',
    'actionName': 'report.order.Frequency',
    'text': '频次报告'
  },
  {
    'className': 'dn-report-video',
    'actionName': 'report.order.Ad',
    'text': '分广告报告'
  }
];


/** @inheritDoc */
report.Order.prototype.initModel = function(argMap, callback) {
  var me = this;

  // report menu datasource
  this.model['datasource'] = report.Order.MenuDataSource;
  this.model['index'] = this.argMap.paramMap['index'] || 0;

  var id = argMap.paramMap['id'];
  report.data.order_read('id=' + id, function(data) {
    if (data.success == 'true') {
      // order_name
      me.model['order_name'] = data.result['name'];
    } else {
      // TODO
    }
    callback();
  });
};

/**
 * @type {?er.Action}
 */
report.Order.prototype._currentAction;

/**
 * 保存一下页面的状态
 */
report.Order.prototype._saveState = function(id, index) {
  var state = 'id=' + id + '&index=' + index;
  er.locator.redirect('~' + state, true);
};

/** @inheritDoc */
report.Order.prototype.initBehavior = function(page) {
  report.Order.superClass.initBehavior.call(this, page);

  var me = this,
      menu = page.getChild('report-menu');

  menu.onMenuClick = function(actionName, opt_index) {
    if (me._currentAction != null) {
      me._currentAction.leave();
    }

    var id = me.argMap.paramMap['id'],
        index = opt_index || 0,
        actionParams = {
          'paramMap' : {
            'order_id' : id
          }
        };
    me._currentAction = er.controller.loadAction(
        'orderReportContainer', actionName, actionParams);
    me._currentAction.saveState = baidu.fn.blank;
    me._saveState(id, index);
  }

  // 加载第一个东东.
  var index = me.argMap.paramMap['index'] || 0,
      datasource = this.model['datasource'][index];
  if (datasource) {
    menu.onMenuClick(datasource['actionName'], index);
  }
};

/** @inheritDoc */
report.Order.prototype.leave = function() {
  if (this._currentAction != null) {
    this._currentAction.leave();
  }
  report.Order.superClass.leave.call(this);
};

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
