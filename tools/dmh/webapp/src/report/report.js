/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: report.js 5156 2011-04-27 04:15:29Z liyubei $
 *
 **************************************************************************/



/**
 * report.js ~ 2011/02/19 16:23:07
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 5156 $
 * @description
 * 报告
 **/

goog.provide('report');

var report = {};


/**
 * @description
 * 判断当前显示是客户端系统还是服务端系统
 * @return {boolean} 是或不是
 */

report.isClient = function() {
    if (document.location.pathname.indexOf('client') != -1) {
        return true;
    } else {
        return false;
    }
};
report.ad = {};
report.index = {};
report.ad.config = {
    daily_flashfile: '/assets/flash/line.swf',
    location_flashfile: '/assets/flash/map.swf',
    daily_video_flashData: '/xml/report/ad/daily_video',
    daily_non_video_flashData: '/xml/report/ad/daily_non_video',
    location_video_flashData: '/xml/report/ad/location_video',
    location_non_video_flashData: '/xml/report/ad/location_non_video',
    perhour_video_flashData: '/xml/report/ad/perhour_video',
    perhour_non_video_flashData: '/xml/report/ad/perhour_non_video'
};

er.controller.addModule(report);



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
