/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: config.js 5280 2011-05-06 06:54:36Z liyubei $ 
 * 
 **************************************************************************/
 
 
 
/**
 * config.js ~ %(app.create.time)s
 * @author %(app.user.email)s (%(app.user.name)s)
 * @version $Revision: 5280 $ 
 * @description 
 *  
 **/

goog.provide('%(app)s.config');

/**
 * @type {Object}
 * @const
 */
%(app)s.config = {
  listFields : [
    {
      'width' : 200,
      'title' : '生活圈名称',
      'field' : 'name',
      'subEntry' : false,
      'content' : function(item) {
        return item['name'];
      }
    },
    {
      'width' : 50,
      'title' : '状态',
      'field' : 'status',
      'subEntry' : false,
      'content' : function(item) {
        return item['status'];
      }
    },
    {
      'width' : 300,
      'title' : '刊例价',
      'field' : 'sale_price',
      'breakLine' : true,
      'content' : function(item) {
        return item['sale_price'];
      }
    },
    {
      'width' : 100,
      'title' : '操作',
      'content' : function(item) {
        return baidu.format('<a href="#/%(app)s/update~id={0}">修改</a>',
            item['id']);
      }
    }
  ]
}




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
