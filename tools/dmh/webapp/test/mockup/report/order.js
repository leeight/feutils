/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/

/**
 * order.js ~ Mar 8, 2011 6:40:37 PM
 * 
 * @author yuanhongliang(yuanhongliang@baidu.com)
 * @version $Revision$
 * @description 订单行报告数据模拟
 */

var orderDailyReport = {
    "success" : "true",
    "message" : {},
    "page" : {
        "pageNo" : 2,
        "pageSize" : 30,
        "orderBy" : "date",
        "order" : "desc",
        "totalCount" : 544,
        "result" : [
            {
                "date" : '20100308',
                "impression_count" : 1000000,
                "click_count" : 1000,
                "click_ratio" : 0.01,
                "impression_uu" : 1000000,
                "click_uu" : 1000,
                "click_uu_ratio" : 0.01,
                "cost" : 123123,
                "request_count" : 1000000
            },
            {
                "date" : '20100307',
                "impression_count" : 1000000,
                "click_count" : 1000,
                "click_ratio" : 0.01,
                "impression_uu" : 1000000,
                "click_uu" : 1000,
                "click_uu_ratio" : 0.01,
                "cost" : 123123,
                "request_count" : 1000000
            }
        ]
    }
};

mockup.register('/report/order/daily', orderDailyReport);

var orderLocationReport = {
  "success" : "true",
  "message" : {},
  "page" : {
    "pageNo":1, 
    "pageSize":120, 
    "orderBy":"impression_count", 
    "order":"desc", 
    "totalCount":4, 
    "result" : [
      {
        "location_id" : '123',
        "location" : '北京',
        "impression_count" : '9999999',
        "click_count" : '0',
        "click_ratio" : '0.07',
        "impression_uu" : '345',
        "click_uu" : '1',
        "click_uu_ratio" : '0%',
        "cost" : '123', // 消费...
        "request_count" : ''  // 请求量，仅仅管理端报告有此属性
      },
      {
        "location_id" : '123',
        "location" : '北京',
        "impression_count" : '88888',
        "click_count" : '88888',
        "click_ratio" : '0.08',
        "impression_uu" : '123',
        "click_uu" : '123',
        "click_uu_ratio" : '100%',
        "cost" : '123', // 消费...
        "request_count" : ''  // 请求量，仅仅管理端报告有此属性
      }
    ]
  }
}
mockup.register('/report/order/location', orderLocationReport);

var orderHourReport = {
    "success" : "true",
    "message" : {},
    "page" : {
        "pageNo" : 2,
        "pageSize" : 30,
        "orderBy" : "date",
        "order" : "desc",
        "totalCount" : 544,
        "result" : [
            {
                "hour" : '00:00-01:00',
                "impression_count" : 1000000,
                "click_count" : 1000,
                "click_ratio" : 0.01,
                "cost" : 123123
            },
            {
                "hour" : '01:00-02:00',
                "impression_count" : 1000000,
                "click_count" : 1000,
                "click_ratio" : 0.01,
                "cost" : 123123
            }
        ]
    }
};

mockup.register('/report/order/perhour', orderHourReport);

var orderFrequencyReport = {
    "success" : "true",
    "message" : {},
    "page" : {
        "pageNo" : 2,
        "pageSize" : 30,
        "orderBy" : "uu_count",
        "order" : "desc",
        "totalCount" : 544,
        "result" : [
            {
                "frequency" : '1',
                "uu_count" : 232,
                "uu_ratio" : 0.89
            },
            {
                "frequency" : '2',
                "uu_count" : 23,
                "uu_ratio" : 0.08
            }
        ]
    }
};

mockup.register('/report/order/frequency', orderFrequencyReport);

var orderAdVideoReport = {
    "success" : "true",
    "message" : {},
    "page" : {
        "pageNo" : 2,
        "pageSize" : 30,
        "orderBy" : "video_impression_uu",
        "order" : "desc",
        "totalCount" : 544,
        "result" : [
            {
                "name" : 'ad1', // 视频广告名称
                "total_impression_count" : 1000,
                "video_impression_count" : 1000,
                "collapse_impression_count" : 100, // 最小化视频曝光次数
                "valid_impression_count" : 10, // 有效播放次数
                "click_count" : 10,
                "avg_valid_impression_time" : 5.6, // 有效收视平均时长
                "cpc" : 10,
                "click_ratio" : 0.02,
                "cost" : 1000
            },
            {
                "name" : 'ad1', // 视频广告名称
                "total_impression_count" : 1000,
                "video_impression_count" : 1000,
                "collapse_impression_count" : 100, // 最小化视频曝光次数
                "valid_impression_count" : 10, // 有效播放次数
                "click_count" : 10,
                "avg_valid_impression_time" : 5.6, // 有效收视平均时长
                "cpc" : 10,
                "click_ratio" : 0.02,
                "cost" : 1000
            }
        ]
    }
};

mockup.register('/report/order/ad_video', orderAdVideoReport);

var orderAdNonVideoReport = {
    "success" : "true",
    "message" : {},
    "page" : {
        "pageNo" : 2,
        "pageSize" : 30,
        "orderBy" : "video_impression_uu",
        "order" : "desc",
        "totalCount" : 544,
        "result" : [
            {
                "name" : 'ad1',
                "impression_count" : 1000,
                "click_count" : 10,
                "click_ratio" : 0.02,
                "cost" : 1000
            },
            {
                "name" : 'ad1',
                "impression_count" : 1000,
                "click_count" : 10,
                "click_ratio" : 0.02,
                "cost" : 1000
            }
        ]
    }
};

mockup.register('/report/order/ad_non_video', orderAdNonVideoReport);
