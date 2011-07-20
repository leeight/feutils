/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * desc:    人群设定模块
 * author:  刘磊
 */

goog.require('dn.listHelper');
goog.require('dn.util');
goog.require('er.context');
goog.require('er.controller');

goog.provide('keywordPrice.config');
goog.provide('keywordPrice.data');

/**
 * @type {Object}
 * @const
 */
keywordPrice.config = {
  action: [
    {
      location: '/keyword_price/list',
      action: 'keywordPrice.List'
    },
    {
      location: '/keyword_price/update',
      action: 'keywordPrice.Form'
    }
  ],

  url: {
    list: '/keyword_price/read',
    update: '/keyword_price/update',
    create: '/keyword_price/create'
  },

  listFields: [
    {
      width: 50,
      title: '人群定向',
      dragable: true,
      content: function() {
          return '人群定向';
      }
    },
    {
      width: 150,
      title: '刊例价',
      dragable: true,
      field: 'price',
      breakLine: true,
      content: function(item) {
          var sale_price = item['price'];
          var productTypeMap = er.context.get('productPriceTypeMap');
          var html = [];
          baidu.object.each(productTypeMap, function(value, key) {
            html.push( value + '刊例价：' + sale_price[key]);
          });

          return html.join('&nbsp;,&nbsp;');
      }
    },
    {
      width: 20,
      title: '操作',
      dragable: true,
      content: function(item) {
          var links = [];
          links.push({
              'title' : '修改',
              'location' : '#/keyword_price/update'
          });
          return dn.listHelper.operation(links);
      }
    }
  ]
};

/**
 * @type {Object.<string, Function>}
 */
keywordPrice.data = dn.util.da_generator([
  {
    name: 'list',
    url: keywordPrice.config.url.list
  },
  {
    name: 'create',
    url: keywordPrice.config.url.create
  },
  {
    name: 'update',
    url: keywordPrice.config.url.update
  }
]);

// register the module
er.controller.addModule(keywordPrice);
