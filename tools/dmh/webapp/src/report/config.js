/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: config.js 5156 2011-04-27 04:15:29Z liyubei $
 *
 **************************************************************************/



/**
 * config.js ~ 2011/02/19 16:25:38
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5156 $
 * @description
 *
 **/


/**
 * 报表相关的配置项
 */
report.config = {
  'action' : [
    {
      'location' : '/report/keywords',
      // FIXME 为啥要用字符串呢?
      'action' : 'report.Keywords'
    },
    {
      'location' : '/report/order',
      'action' : 'report.Order'
    },
    {
      'location' : '/report/order/daily',
      'action' : 'report.order.Daily'
    },
    {
      'location' : '/report/order/location',
      'action' : 'report.order.Location'
    },
    {
      'location' : '/report/order/perhour',
      'action' : 'report.order.Perhour'
    },
    {
      'location' : '/report/order/frequency',
      'action' : 'report.order.Frequency'
    },
    {
      'location' : '/report/order/ad',
      'action' : 'report.order.Ad'
    },
    {
      'location' : '/report/ad',
      'action' : 'report.Ad'
    },
    {
    	'location':'/report/ad/daily_video',
    	'action' : 'report.ad.DailyVideo'
    },
    {
    	'location':'/report/ad/daily_non_video',
    	'action' : 'report.ad.DailyNonVideo'
    },
    {
    	'location':'/report/ad/location_video',
    	'action' : 'report.ad.LocationVideo'
    },
    {
    	'location':'/report/ad/location_non_video',
    	'action' : 'report.ad.LocationNonVideo'
    },
    {
    	'location':'/report/ad/perhour_video',
    	'action' : 'report.ad.PerhourVideo'
    },
    {
    	'location':'/report/ad/perhour_non_video',
    	'action' : 'report.ad.PerhourNonVideo'
    },
    {
    	'location':'/report/ad/frequency',
    	'action' : 'report.ad.Frequency'
    },
    {
    	'location':'/report/ad/video_impression_time',
    	'action' : 'report.ad.VideoImpressionTime'
    },
    {
    	'location':'/report/ad/community_video',
    	'action' : 'report.ad.CommunityVideo'
    },
    {
    	'location':'/report/ad/community_non_video',
    	'action' : 'report.ad.CommunityNonVideo'
    },
    {
    	'location':'/report/ad/slot_video',
    	'action' : 'report.ad.SlotVideo'
    },
    {
    	'location':'/report/ad/slot_non_video',
    	'action' : 'report.ad.SlotNonVideo'
    },
    {
    	'location':'/report/ad/material_video',
    	'action' : 'report.ad.MaterialVideo'
    },
    {
    	'location':'/report/ad/material_non_video',
    	'action' : 'report.ad.MaterialNonVideo'
    },
    {
        'location':'/report/ad/keywords',
        'action' : 'report.ad.Keywords'
    },
    {
        'location' : '/report/index',
        'action' : 'report.index.List'
    } 
  ]
};




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
