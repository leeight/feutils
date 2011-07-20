/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    dn/config.js
 * desc:    业务通用配置项
 * author:  yuanhongliang
 * date:    $Date: 2011-05-06 09:09:15 +0800 (周五, 06 五月 2011) $
 */


goog.provide('dn.config');

/**
 * 业务通用配置项
 * @type {Object}
 * @const
 */
dn.config = {
    'defaultIndex' : '/video/index',
    'defaultIndexMap':{},
    'navigator': [
        {
            name: 'PM工具',
            defaultIndex: 0,
            items: [
                {
                    name: '视频转换',
                    location: '/video/index',
                    auth: 'INTERNAL_REPORT',
                    sub : [
                      '/video/submit'
                    ]
                }
            ]
        }
    ],

    /**
     * 需要加载的模板配置
     * FIXME 如果自动删除编译之后无关的代码呢？
     */
    'template': dn.COMPILED ? ['/assets/tpl.html'] : [
        '/src/ui/CopyableArea.html',
        '/src/ui/MediaUploader.html',
        '/src/ui/Orientation.html',
        '/src/ui/Uploader.html',
        '/src/ui/Timeline.html',
        '/src/ui/PagableList.html',
        '/src/ui/SimpleSelector.html',
        '/src/ui/ListView.html',
        '/src/ui/List.html',
        
        
        '/src/video/uploadForm.html',        
        '/src/video/editForm.html'
        
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
            'text': 15,
            'value': 15
        },
        {
            'text': 30,
            'value': 30
        },
        {
            'text': 60,
            'value': 60
        },
        {
            'text': 120,
            'value': 120
        }
    ],

    'subListNoDataHtml': '<div class="dn-sublist-nodata">0条信息</div>',

    'listNoDataHtml': '<div class="dn-list-nodata">0条信息</div>'
};
