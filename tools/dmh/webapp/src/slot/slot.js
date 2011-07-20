/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    slot/slot.js
 * desc:    广告位模块
 * author:  yuanhongliang
 * date:    $Date: 2011-06-28 14:18:00 +0800 (周二, 28 六月 2011) $
 */

goog.require('dn.listHelper');
goog.require('er.context');
goog.require('er.controller');

goog.provide('slot.config');
goog.provide('slot.data');

/**
 * 广告位配置信息
 * @type {Object}
 * @const
 */
slot.config = {
    action: [
        {
            location: '/slot/dedicated/list',
            action: 'slot.dedicated.List'
        },
        {
            location: '/slot/dedicated/create',
            action: 'slot.dedicated.Form'
        }
        ,
        {
            location: '/slot/dedicated/update',
            action: 'slot.dedicated.Form'
        },
        {
            location: '/slot/fixed/list',
            action: 'slot.fixed.List'
        },
        {
            location: '/slot/fixed/create',
            action: 'slot.fixed.Form'
        }
        ,
        {
            location: '/slot/fixed/update',
            action: 'slot.fixed.Form'
        }
    ],

    url: {
        list: '/slot/list',
        batchUpdate: '/slot/batch_update',
        create: '/slot/create',
        update: '/slot/update',
        read: '/slot/read'
    },

    listFields: [
          {
              width: 40,
              title: '广告位ID',
              dragable: true,
              field: 'id',
              content: function(item) {
                  return item.id;
              }
          },
          {
              width: 150,
              title: '广告位名称',
              dragable: true,
              field: 'name',
              content: function(item) {
                  return item.name;
              }
          },
          {
              width: 100,
              title: '广告管家广告位ID',
              dragable: true,
              field: 'columbus_slot_id',
              content: function(item) {
                  return item['columbus_slot_id'];
              }
          },
          {
              width: 80,
              title: '用户名',
              dragable: true,
              field: 'username',
              content: function(item) {
                  return item['username'];
              }
          },
          {
              width: 80,
              title: '域名',
              dragable: true,
              breakLine: true,
              field: 'domain',
              content: function(item) {
                  return item.domain.join('<br/>');
              }
          },
          {
              width: 70,
              title: '广告位类型',
              dragable: true,
              breakLine: true,
              field: 'slot_sub_type',
              content: function(item) {
                  return er.context.get('slotSubTypeMap')[item.slot_sub_type];
              }
          },
          {
              width: 55,
              title: '产品类型',
              dragable: true,
              field: 'type',
              content: function(item) {
                  var types = item.type.split(',');
                  baidu.each(types, function(type, i) {
                    types[i] = er.context.get('productTypeMap')[type];
                  });
                  return types.join('+');
              }
          },
          {
              width: 40,
              title: '状态',
              dragable: true,
              field: 'status',
              content: function(item) {
                  return dn.util.getStatusHtml(
                          er.context.get('slotStatusMap')[item.status],
                          slot.config.statusClassMap);
              }
          },
          {
              width: 60,
              title: '生活圈',
              dragable: true,
              breakLine: true,
              content: function(item) {
                  var communities = item.communities,
                      names = [];
                  for (var i = 0; i < communities.length; i++) {
                      names.push(communities[i].name);
                  }
                  return names.join('<br/>');
              }
          },
          {
              width: 90,
              title: '频次设置',
              dragable: true,
              breakLine: true,
              content: function(item) {
                  var freqCountArray = item.max_impression_freq_uu_count,
                      freqHourArray = item.max_impression_freq_uu_hour,
                      resultArray = [],
                      productTypes = er.context.get('productTypeMap'),
                      result,
                      label;
                  baidu.each(freqCountArray, function(freq, index){
                      label = productTypes[index];
                      if (freq != "") {
                          resultArray.push(baidu.format('{2}每个独立访客<br/>{0}次展现/{1}小时',
                              freq,
                              freqHourArray[index],
                              label));
                      }
                  });

                  if (resultArray.length > 0) {
                      return resultArray.join('<br/>');
                  } else {
                      return '';
                  }
              }
          },
          {
              width: 60,
              title: '屏蔽广告主',
              dragable: true,
              breakLine: true,
              content: function(item) {
                  var adOwners = item['adowner_blacklist'],
                      names = [];
                  for (var i = 0; i < adOwners.length; i++) {
                      names.push(adOwners[i].username);
                  }
                  return names.join('<br/>');
              }
          },
          {
              width: 80,
              title: '采购价',
              dragable: true,
              breakLine: true,
              field: 'purchase_price',
              content: function(item) {
                  var priceArray = item.purchase_price,
                      resultArray = [],
                      priceTypes = er.context.get('productPriceTypeMap'),
                      result,
                      label;
                  baidu.each(priceArray, function(price, index){
                      label = priceTypes[index];
                      if (price != "") {
                          resultArray.push(baidu.format('¥ {0}' + label,
                              parseFloat(price).toFixed(2)));
                      }
                  });

                  if (resultArray.length > 0) {
                      return resultArray.join('<br/>');
                  } else {
                      return '';
                  }
              }
          },
          {
              width: 80,
              title: '刊例价',
              dragable: true,
              breakLine: true,
              field: 'sale_price',
              content: function(item) {
                  var priceArray = item.sale_price,
                      resultArray = [],
                      priceTypes = er.context.get('productPriceTypeMap'),
                      result,
                      label;
                      baidu.each(priceArray, function(price, index){
                          label = priceTypes[index];
                          if (price != "") {
                              resultArray.push(baidu.format('¥ {0}' + label,
                                  parseFloat(price).toFixed(2)));
                          }
                      });

                  if (resultArray.length > 0) {
                      return resultArray.join('<br/>');
                  } else {
                      return '';
                  }
              }
          },
          {
              width: 50,
              title: '操作',
              dragable: true,
              content: function(item) {
                  return dn.listHelper.operation([{
                      title: dn.lang.btnModify,
                      location: '#/slot/' +
                          (item.slot_type ? 'fixed' : 'dedicated') +
                          '/update~id=' + item.id
                  }]);
              }
          }
      ],

      statusClassMap: {
          '有请求' : 'status-valid',
          '无请求' : 'status-invalid',
          '有效' : 'status-valid',
          '已停止' : 'status-normal',
          '已存档' : 'status-warning'
      }
};

/**
 * 广告位数据访问对象
 * @type {Object.<string, Function>}
 * @const
 */
slot.data = dn.util.da_generator([
    // 广告位列表数据
    {
        name: 'list',
        url: slot.config.url.list
    },
    {
        name: 'batchUpdate',
        url: slot.config.url.batchUpdate
    },
    {
        name: 'create',
        url: slot.config.url.create
    },
    {
        name: 'update',
        url: slot.config.url.update
    },
    {
        name: 'read',
        url: slot.config.url.read
    }
]);

// register the module
er.controller.addModule(slot);
