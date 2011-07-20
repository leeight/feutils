/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ad/ad.js
 * desc:    广告模块声明
 * author:  jay
 * date:    2011-02-09
 */

goog.provide('ad');

var ad = {};

ad.config = {

  /**
   * action配置
   */
  'action': [
    {
      location: '/ad/list',
      action: 'ad.List'
    },
    {
      location: '/ad/create',
      action: 'ad.Form'
    },
    {
      location: '/ad/update',
      action: 'ad.Form'
    }
  ],

  /**
   * url配置
   */
  'url': {
    adList: '/ad/list',
    batchUpdate: '/ad/batch_update',
    create: '/ad/create',
    update: '/ad/update',
    read: '/ad/read'
  },

  /**
   * 状态颜色映射
   */
  'statusColorMap': {
    '1' : '#333333',//"非存档",
    '2' : '#333333',//"缺创意",
    '3' : '#48A31A',//"就绪",
    '4' : '#48A31A',//"投放中",
    '5' : '#000000',//"完成",
    '6' : '#FFAC2F',//"暂停",
    '7' : '#FFAC2F'//"已存档"
  },

  'INFINITE': '99991231235959',

  /**
   * 列表显示字段
   */
  'listFields': [
    {
      width: 90,
      title: '广告ID',
      sortable: true,
      dragable: false,
      field: 'id',
      content: function(item) {
        var value = item['id'];
        return baidu.format(
            '<a href="#/ad/update~id={0}" title="{0}">{0}</a>',
            value);
      }
    },

    {
      title: '广告名称',
      sortable: true,
      dragable: false,
      width: 130,
      breakLine: true,
      field: 'name',
      content: function(item) {
        return item['name'];
      }
    },

    {
      title: '广告主',
      sortable: false,
      dragable: false,
      breakLine: true,
      width: 110,
      field: 'adowner_name',
      content: function(item) {
        return item['adowner_name'];
      }
    },

    {
      title: '订单行ID',
      sortable: false,
      dragable: false,
      width: 100,
      field: 'order_id',
      content: function(item) {
        var links = [];
        links.push({
          'title': item['order_id'],
          'location': '#/order/detail~id=' + item['order_id']
        });

        return dn.listHelper.operation(links);
      }
    },

    {
      title: '产品形式',
      sortable: false,
      dragable: false,
      width: 80,
      field: 'type',
      content: function(item) {
        return er.context.get('productTypeMap')[item['type']];
      }
    },

    {
      title: '状态',
      sortable: false,
      dragable: false,
      width: 80,
      breakLine: true,
      field: 'status',
      content: function(item) {
        var color = ad.config.statusColorMap[item['status']];
        return dn.util.getStatusHtmlbyColor(er.context.get('adStatusMap')[item['status']], color);
      }
    },

    {
      title: '生活圈定向',
      sortable: false,
      dragable: false,
      width: 80,
      field: 'orient_community',
      content: function(item) {
        return er.context.get('orientCommunityTypeMap')[item['orient_community']];
      }
    },

    {
      title: '人群定向',
      sortable: false,
      dragable: false,
      width: 80,
      field: 'orient_keywords',
      content: function(item) {
        return er.context.get('orientKeywordsTypeMap')[item['orient_keywords']];
      }
    },

    {
      title: '剩余消费',
      sortable: false,
      dragable: false,
      width: 80,
      field: 'residue',
      content: function(item) {
        var price = item.residue;
        return '¥ ' + parseFloat(price).toFixed(2);
      }
    },

    {
      title: '预算',
      sortable: false,
      dragable: false,
      width: 80,
      field: 'budget_threshold',
      content: function(item) {
        var price = item.budget_threshold;
        return '¥ ' + parseFloat(price).toFixed(2);
      }
    },

    {
      title: '开始时间',
      sortable: true,
      dragable: false,
      width: 110,
      field: 'start_time',
      content: function(item) {
        return baidu.date.format(dn.util.parseToDate(item['start_time']), 'yyyy-MM-dd');
      }
    },

    {
      title: '结束时间',
      sortable: true,
      dragable: false,
      width: 110,
      field: 'end_time',
      content: function(item) {
        return ad.config.INFINITE == item['end_time'] ?
               '不限时间' :
               baidu.date.format(dn.util.parseToDate(item['end_time']), 'yyyy-MM-dd');
      }
    },

    {
      title: '操作',
      sortable: false,
      dragable: false,
      width: 120,
      field: 'name',
      content: function(item) {
        var links = [];
        links.push({
          'title': '修改',
          'location': '#/ad/update~id=' + item['id']
        });
        links.push({
          'title': '查看报告',
          'location': '#/report/ad~id=' + item['id']
        });

        return dn.listHelper.operation(links);
      }
    }
  ],

  /**
   * 物料列表的字段
   */
  'materialListFields' : [
    {
      'width' : 200,
      'title' : '创意名称',
      'field' : 'name',
      'subEntry' : false,
      'content' : function(item) {
        return item['name'];
      }
    },
    {
      'width' : 50,
      'title' : '类型',
      'field' : 'type',
      'subEntry' : false,
      'content' : function(item) {
        var materialTypeMap = er.context.get('materialTypeMap');
        return materialTypeMap[item['m_type']];
      }
    },
    {
      'width' : 50,
      'title' : '状态',
      'field' : 'status',
      'subEntry' : false,
      'content' : function(item) {
        var materialStatusMap = er.context.get('materialStatusMap');
        return materialStatusMap[item['status']];
      }
    },
    {
      'width' : 100,
      'title' : '操作',
      'content' : function(item) {
        var links = [];
        links.push({
          'title': '修改',
          'location': '#/material/update~id=' + item['id']
        });
        links.push({
          'title': '归档',
          'location': '#/material/status_update~id=' + item['id']
        });
        links.push({
          'title' : '预览',
          'blank' : true,
          'location' : '/material/preview?id=' + item['id']
        });

        return dn.listHelper.operation(links);
      }
    }
  ]
};

er.controller.addModule(ad);
