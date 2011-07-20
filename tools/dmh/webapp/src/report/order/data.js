/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: data.js 5156 2011-04-27 04:15:29Z liyubei $
 *
 **************************************************************************/



/**
 * data.js ~ Mar 8, 2011 6:55:18 PM
 * @author yuanhongliang(yuanhongliang@baidu.com)
 * @version $Revision: 5156 $
 * @description 订单行数据访问模块
 **/

/**
 * 订单行数据访问模块
 */
report.order.data = dn.util.da_generator([
    {
        name: 'daily',
        url: '/report/order/daily'
    },
    {
        name: 'location',
        url: '/report/order/location'
    },
    {
        name: 'perhour',
        url: '/report/order/perhour'
    },
    {
        name: 'frequency',
        url: '/report/order/frequency'
    },
    {
        name: 'ad_video',
        url: '/report/order/ad_video'
    },
    {
        name: 'ad_non_video',
        url: '/report/order/ad_non_video'
    }
]);
