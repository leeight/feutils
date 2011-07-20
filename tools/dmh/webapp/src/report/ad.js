/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: ad.js 6997 2011-06-30 03:46:21Z kangyongliang $
 *
 **************************************************************************/



/**
 * ad.js ~ 2011/03/08 17:36:42
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 6997 $
 * @description
 * 广告的报告信息
 **/

goog.require('base.BaseModel');
goog.require('er.Action');

goog.provide('report.Ad');


/**
 * @constructor
 * @extends {er.Action}
 */
report.Ad = function() {
  er.Action.call(this);

  this.model = new base.BaseModel({});
};
baidu.inherits(report.Ad, er.Action);

/**
 * 模板视图
 * @type {string}
 */
report.Ad.prototype.view = 'adReport';

/**
 * @const
 */
report.Ad.MenuDataSource = [
  {
    'className': 'dn-report-daily',
    'actionName': 'report.ad.DailyVideo',
    'text': '每日报告'
  },
  {
    'className': 'dn-report-location',
    'actionName': 'report.ad.LocationVideo',
    'text': '分地域报告'
  },
  {
    'className': 'dn-report-perhour',
    'actionName': 'report.ad.PerhourVideo',
    'text': '分时段报告'
  },
  {
    'className': 'dn-report-frequency',
    'actionName': 'report.ad.Frequency',
    'text': '频次报告'
  },
  {
    'className': 'dn-report-video-impression',
    'actionName': 'report.ad.VideoImpressionTime',
    'text': '播放时长报告'
  },
  {
    'className': 'dn-report-community',
    'actionName': 'report.ad.CommunityVideo',
    'text': '生活圈报告'
  },
  {
    'className': 'dn-report-slot',
    'actionName': 'report.ad.SlotVideo',
    'text': '分网站报告'
  },
  {
    'className': 'dn-report-material',
    'actionName': 'report.ad.MaterialVideo',
    'text': '分创意报告'
  },
  {
    'className': 'dn-report-keywords',
    'actionName': 'report.ad.Keywords',
    'text': '关键词报告'
  }
];

/**
 * @const
 */
report.Ad.MenuDataSourceNonVideo = [
  {
    'className': 'dn-report-daily',
    'actionName': 'report.ad.DailyNonVideo',
    'text': '每日报告'
  },
  {
    'className': 'dn-report-location',
    'actionName': 'report.ad.LocationNonVideo',
    'text': '分地域报告'
  },
  {
    'className': 'dn-report-perhour',
    'actionName': 'report.ad.PerhourNonVideo',
    'text': '分时段报告'
  },
  {
    'className': 'dn-report-frequency',
    'actionName': 'report.ad.Frequency',
    'text': '频次报告'
  },
  {
    'className': 'dn-report-community',
    'actionName': 'report.ad.CommunityNonVideo',
    'text': '生活圈报告'
  },
  {
    'className': 'dn-report-slot',
    'actionName': 'report.ad.SlotNonVideo',
    'text': '分网站报告'
  },
  {
    'className': 'dn-report-material',
    'actionName': 'report.ad.MaterialNonVideo',
    'text': '分创意报告'
  },
  {
    'className': 'dn-report-keywords',
    'actionName': 'report.ad.Keywords',
    'text': '关键词报告'
  }
];

/**
 * 删掉菜单中的项目
 * @private
 * @param {Array.<string>} item_names 需要删掉的菜单的名字.
 */
report.Ad.prototype._deleteMenuItems = function(item_names) {
  var datasource = this.model['datasource'],
      item = null;
  for (var i = 0; i < datasource.length; i++) {
    item = datasource[i];
    for (var k = 0, z = item_names.length; k < z; k++) {
      if (item['text'] == item_names[k]) {
        datasource.splice(i, 1);
        i--;
        break;
      }
    }
  }
};

/** @inheritDoc */
report.Ad.prototype.initModel = function(argMap, callback) {
  var me = this;

  // order_name & ad_name
  var id = argMap.paramMap['id'];
  report.data.ad_read('id=' + id, function(data) {
    if (data.success == 'true') {
      var ad = data.result;
      if (ad) {
        // 面包屑导航
        me.model['ad_id'] = ad['id'];
        me.model['ad_name'] = ad['name'];
        var order = ad.order;
        if (order) {
          me.model['order_link'] = '#/report/order~id=' + order['id'];
          me.model['order_name'] = '订单行：' + order['name'];
        }

        // 右侧菜单
        if (ad['type'] == '0' || ad['type'] == '6') {
          // 视频广告
          me.model['datasource'] = report.Ad.MenuDataSource;
        } else {
          // 非视频广告
          me.model['datasource'] = report.Ad.MenuDataSourceNonVideo;
        }

        // 如果是”客户端“report，则删除”关键词“
        var loc = document.location.pathname;
        if (loc.indexOf('client') != -1) {
            me._deleteMenuItems(['关键词报告']);
        }
        // FIXME 只有对“客户端”的时候下面的代码才会起作用
        /*
        // 过滤一下生活圈报告或者网站报告，因为生活圈定向和网站定向是互斥的
        // 详情请见：http://icafe.baidu.com:8100/jtrac/app/item/DAN-159/
        var orient_community = ad['orient_community'];
        if (orient_community == '1') {
          // 生活圈定向
          me._deleteMenuItems(['分网站报告']);
        } else if (orient_community == '2') {
          // 网站定向
          me._deleteMenuItems(['生活圈报告']);
        } else if (orient_community == '0') {
          // 没有
          me._deleteMenuItems(['生活圈报告', '分网站报告']);
        }
        */
        me.model['index'] = me.argMap.paramMap['index'] || 0;

        // 加载ad/list，搜索条件是order_id
        report.data.ad_list('order_id=' + order['id'], function(ad_data) {
          if (ad_data.success == 'true') {
            var ad_datasource = [];
            baidu.array.each(ad_data.page.result, function(item) {
              ad_datasource.push({
                'text' : '广告：' + item['name'],
                'value' : item['id']
              });
            });
            me.model['ad_datasource'] = ad_datasource;
          } else {
            // TODO
          }
          callback();
        });
      }
    } else {
      // TODO
    }
  });
};

/**
 * @type {?er.Action}
 */
report.Ad.prototype._currentAction;

/**
 * 保存一下页面的状态
 */
report.Ad.prototype._saveState = function(id, index) {
  var state = 'id=' + id + '&index=' + index;
  er.locator.redirect('~' + state, true);
};

/** @inheritDoc */
report.Ad.prototype.initBehavior = function(page) {
  report.Ad.superClass.initBehavior.call(this, page);

  var me = this,
      ad_list = page.getChild('ad-list'),
      menu = page.getChild('report-menu');

  menu.onMenuClick = function(actionName, opt_index) {
    if (me._currentAction != null) {
      me._currentAction.leave();
    }

    var id = me.argMap.paramMap['id'],
        index = opt_index || 0,
        actionParams = {
          'paramMap' : {
            'ad_id' : id
          }
        };
    me._currentAction = er.controller.loadAction(
        'adReportContainer', actionName, actionParams);
    me._currentAction.saveState = baidu.fn.blank;
    me._saveState(id, index);
  }

  // 加载第一个东东.
  var index = me.argMap.paramMap['index'] || 0,
      datasource = this.model['datasource'][index];
  if (datasource) {
    menu.onMenuClick(datasource['actionName'], index);
  }

  ad_list.onselect = baidu.fn.bind(this._onAdListChange, this);
};

/**
 * @param {*} value 选中的值.
 * @param {Object} item 选中的项.
 */
report.Ad.prototype._onAdListChange = function(value, item) {
  var query = document.location.hash.replace(/#([^~]+)~/, '');
  var location = query.replace(/id=(\d+)?/, function() {
    return 'id=' + value;
  });
  er.locator.redirect('~' + location);
};

/** @inheritDoc */
report.Ad.prototype.leave = function() {
  if (this._currentAction != null) {
    this._currentAction.leave();
  }
  report.Ad.superClass.leave.call(this);
};





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
