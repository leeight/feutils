/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    dn/clientConfig.js
 * desc:    客户端业务通用配置项
 * author:  lixiang05
 * date:    $Date: 2011-03-25 16:09:55 +0800 (五, 25 三月 2011) $
 */


/**
 * 客户端业务通用配置项
 */
dn.config = {
    'defaultIndex' : '/report/index',
    'defaultIndexMap': {
      // 管理员 + 销售 + 客服 都去/ad/list
      '4' : '/report/index'  // 客户
    },


    /**
     * 需要加载的模板配置
     * FIXME 如果自动删除编译之后无关的代码呢？
     */
    'template': dn.COMPILED ? ['/assets/tpl.html'] : [
        '/src/ui/CopyableArea.html',
        '/src/ui/MediaUploader.html',
        '/src/ui/Orientation.html',
        '/src/ui/Uploader.html',
        '/src/ui/PagableList.html',
        '/src/ui/SimpleSelector.html',
        '/src/ui/ListView.html',
        '/src/ui/ReportCalendar.html',
        '/src/ui/ReportCalendarForClient.html',
        '/src/ui/SlotSelector.html',
        '/src/ui/List.html',

        '/src/demo/demo.action.html',
        '/src/demo/form.html',
        '/src/demo/list.html',

        '/src/client_report/order.html',
        '/src/client_report/order/daily.html',
        '/src/client_report/order/location.html',
        '/src/client_report/order/perhour.html',
        '/src/client_report/order/frequency.html',
        '/src/client_report/order/ad.html',
        '/src/client_report/ad.html',
        '/src/client_report/ad/daily_video.html',
        '/src/client_report/ad/community_non_video.html',
        '/src/client_report/ad/community_video.html',
        '/src/client_report/ad/daily_non_video.html',
        '/src/client_report/ad/frequency.html',
        '/src/client_report/ad/location_non_video.html',
        '/src/client_report/ad/location_video.html',
        '/src/client_report/ad/material_non_video.html',
        '/src/client_report/ad/material_video.html',
        '/src/client_report/ad/perhour_non_video.html',
        '/src/client_report/ad/perhour_video.html',
        '/src/client_report/ad/slot_non_video.html',
        '/src/client_report/ad/slot_video.html',
        '/src/client_report/ad/video_impression_time.html',
        '/src/client_report/index/list.html'

    ],

    /**
     * url配置
     */
    'url': {
        'sysInfo' : '/system_const/read',
        'session' : '/account/session'
    },

    /**
     * 预置列表长度
     */
    'pageSize': [
        {
            'text': '15页',
            'value': 15
        },
        {
            'text': '30页',
            'value': 30
        },
        {
            'text': '60页',
            'value': 60
        },
        {
            'text': '120页',
            'value': 120
        }
    ],

    'subListNoDataHtml': '<div class="dn-sublist-nodata">0条信息</div>',

    'listNoDataHtml': '<div class="dn-list-nodata">0条信息</div>'
};
