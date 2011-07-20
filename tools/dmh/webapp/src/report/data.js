/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: data.js 5156 2011-04-27 04:15:29Z liyubei $
 *
 **************************************************************************/



/**
 * data.js ~ 2011/02/19 16:39:13
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5156 $
 * @description
 * 报表的数据访问接口
 **/

report.data = dn.util.da_generator([
  {
    'name' : 'order_read',
    'url' : '/order/read'
  },
  {
    'name' : 'ad_read',
    'url' : '/ad/read'
  },
  {
    'name' : 'ad_list',
    'url' : '/ad/list'
  },
  {
    'name' : 'order_daily',
    'url' : '/report/order/daily'
  },
  {
    'name' : 'order_location',
    'url' : '/report/order/location'
  },
  {
  	'name': 'ad.daily_video',
  	'url' : '/report/ad/daily_video'
  },
  {
  	'name': 'ad.daily_non_video',
  	'url' : '/report/ad/daily_non_video'
  },
  {
  	'name': 'ad.location_video',
  	'url' : '/report/ad/location_video'
  },
  {
  	'name': 'ad.location_non_video',
  	'url' : '/report/ad/location_non_video'
  },
  {
  	'name': 'ad.perhour_video',
  	'url' : '/report/ad/perhour_video'
  },
  {
  	'name': 'ad.perhour_non_video',
  	'url' : '/report/ad/perhour_non_video'
  },
  {
  	'name': 'ad.frequency',
  	'url' : '/report/ad/frequency'
  },
  {
  	'name': 'ad.video_impression_time',
  	'url' : '/report/ad/video_impression_time'
  },
  {
  	'name': 'ad.community_video',
  	'url' : '/report/ad/community_video'
  },
  {
  	'name': 'ad.community_non_video',
  	'url' : '/report/ad/community_non_video'
  },
  {
  	'name': 'ad.slot_video',
  	'url' : '/report/ad/slot_video'
  },
  {
  	'name': 'ad.slot_non_video',
  	'url' : '/report/ad/slot_non_video'
  },
  {
  	'name': 'ad.material_video',
  	'url' : '/report/ad/material_video'
  },
  {
  	'name': 'ad.material_non_video',
  	'url' : '/report/ad/material_non_video'
  },
  {
    'name': 'ad.keywords',
    'url' : '/report/ad/keywords'
  }
]);















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
