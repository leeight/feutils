/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * idl/ad/list.idl.js ~ 2011/07/29 11:59:33
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 
 **/

{
  "Request" : {
    "Url" : "/ad/list",
    "Parameters" : [
      "id",
      "name",
      "order_id",
      "adowner_name",
      "type",
      "status",
      "community",
      "keywords",
      "max_daily_consume",
      "residue",
      "budget_threshold",
      "start_time",
      "end_time",
      {
        "optional" : true,
        "Parameters" : [
          "page.order",
          "page.orderBy",
          "page.pageNo",
          "page.pageSize"
        ]
      }
    ]
  },
  "Response" : {
    "success" : "true",
    "message" : {},
    "page" : {
      "pageNo" : "number",
      "pageSize" : "number",
      "orderBy" : "string",
      "order" : "string",
      "totalCount" : "number",
      "result" : [
        {
          "id" : "string",
          "name" : "string",
          "adowner_name" : "string",
          "order_id" : "string",
          "type" : "string",
          "status" : "string",
          "orient_community" : "string",
          "orient_keywords" : "string",
          "max_daily_consume" : "string",
          "residue" : "string",
          "budget_threshold" : "string",
          "start_time" : "string",
          "end_time" : "string"
        }
      ]
    }
  }
}




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
