/***************************************************************************
 *
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: config.js 5208 2011-05-04 03:27:47Z liyubei $
 *
 **************************************************************************/



/**
 * config.js ~ Mar 8, 2011 6:55:04 PM
 * @author yuanhongliang(yuanhongliang@baidu.com)
 * @version $Revision: 5208 $
 * @description 订单行报表配置信息
 **/

report.order.config = {
    url: {
        dailyFlash: '/assets/flash/line.swf',
        dailyFlashData: '/xml/report/order/daily',
        locationFlash: '/assets/flash/map.swf',
        locationFlashData: '/xml/report/order/location',
        perhourFlash: '/assets/flash/line.swf',
        perhourFlashData: '/xml/report/order/perhour'
    },
    
    fields : {
        daily: [
            {
                width: 80,
                title: '日期',
                dragable: true,
                sortable: true,
                field: 'date',
                content: function(item) {
                    if (!item.date) {
                        return '';
                    }
                    var datetime = dn.util.parseToDate(item.date);
                    return baidu.date.format(datetime, 'yyyy-MM-dd');
                }
            },
            {
                width: 80,
                title: '展现量',
                dragable: true,
                sortable: true,
                field: 'impression_count',
                content: function(item) {
                    return item.impression_count;
                }
            },
            {
                width: 80,
                title: '点击量',
                dragable: true,
                sortable: true,
                field: 'click_count',
                content: function(item) {
                    return item.click_count;
                }
            },
            {
                width: 80,
                title: '点击率',
                dragable: true,
                sortable: true,
                field: 'click_ratio',
                content: function(item) {
                    return (item.click_ratio * 100).toFixed(2) + '%';
                }
            },
            {
                width: 80,
                title: '展现独立访客',
                dragable: true,
                sortable: true,
                field: 'impression_uu',
                content: function(item) {
                    return item['impression_uu'];
                }
            },
            {
                width: 80,
                title: '点击独立访客',
                dragable: true,
                sortable: true,
                field: 'click_uu',
                content: function(item) {
                    return item['click_uu'];
                }
            },
            {
                width: 80,
                title: '独立访客点击率',
                dragable: true,
                sortable: true,
                field: 'click_uu_ratio',
                content: function(item) {
                    return (item['click_uu_ratio'] * 100).toFixed(2) + '%';
                }
            },
            {
                width: 80,
                title: '消费',
                dragable: true,
                sortable: true,
                field: 'cost',
                content: function(item) {
                    return '¥ ' + parseFloat(item['cost']).toFixed(2);
                }
            }
        ],
        location: [
            {
                width: 80,
                title: '地域',
                dragable: true,
                sortable: true,
                field: 'location',
                content: function(item) {
                    return item['location'];
                }
            },
            {
                width: 80,
                title: '展现量',
                dragable: true,
                sortable: true,
                field: 'impression_count',
                content: function(item) {
                    return item['impression_count'];
                }
            },
            {
                width: 80,
                title: '点击量',
                dragable: true,
                sortable: true,
                field: 'click_count',
                content: function(item) {
                    return item['click_count'];
                }
            },
            {
                width: 80,
                title: '点击率',
                dragable: true,
                sortable: true,
                field: 'click_ratio',
                content: function(item) {
                    return (item['click_ratio'] * 100).toFixed(2) + '%';
                }
            },
            {
                width: 80,
                title: '消费',
                dragable: true,
                sortable: true,
                field: 'cost',
                content: function(item) {
                    return '¥ ' + parseFloat(item['cost']).toFixed(2);
                }
            }
        ],
        perhour: [
            {
                width: 80,
                title: '时段',
                dragable: true,
                sortable: true,
                field: 'hour',
                content: function(item) {
                    return item['hour'];
                }
            },
            {
                width: 80,
                title: '展现量',
                dragable: true,
                sortable: true,
                field: 'impression_count',
                content: function(item) {
                    return item['impression_count'];
                }
            },
            {
                width: 80,
                title: '点击量',
                dragable: true,
                sortable: true,
                field: 'click_count',
                content: function(item) {
                    return item['click_count'];
                }
            },
            {
                width: 80,
                title: '点击率',
                dragable: true,
                sortable: true,
                field: 'click_ratio',
                content: function(item) {
                    return (item['click_ratio'] * 100).toFixed(2) + '%';
                }
            },
            {
                width: 80,
                title: '消费',
                dragable: true,
                sortable: true,
                field: 'cost',
                content: function(item) {
                    return '¥ ' + parseFloat(item['cost']).toFixed(2);
                }
            }
        ],
        frequency: [
            {
                title: '频次',
                sortable: false,
                width: 200,
                content: function(item) {
                    var frequency = parseInt(item['frequency'], 10);
                    return frequency > 10 ? '10次以上' : frequency + '次';
                }
            },
            {
                title: '覆盖独立访客数',
                sortable: true,
                field:'uu_count',
                width: 200,
                content: function(item) {
                    return item['uu_count'];
                }
            },
            {
                title: '比例',
                sortable: false,
                width: 600,
                breakLine: true,
                content: function(item) {
                    var loc = document.location.pathname,
                        uu_ratio = item['uu_ratio'];
                    if (loc.indexOf('client') != -1) {
                        return dn.util.drawNarrowGraph(uu_ratio);
                    } else {
                        return dn.util.drawGraph(uu_ratio);
                    }
                }
            }
        ],
        ad_video: [
            {
                width: 150,
                title: '广告名称',
                dragable: true,
                sortable: true,
                field: 'name',
                content: function(item) {
                    return item['name'];
                }
            },
            {
                width: 80,
                title: '总曝光次数',
                dragable: true,
                sortable: true,
                field: 'total_impression_count',
                content: function(item) {
                    return item['total_impression_count'];
                }
            },
            {
                width: 80,
                title: '视频曝光次数',
                dragable: true,
                sortable: true,
                field: 'video_impression_count',
                content: function(item) {
                    return item['video_impression_count'];
                }
            },
            {
                width: 80,
                title: '视最小化视窗曝光次数',
                dragable: true,
                sortable: true,
                field: 'collapse_impression_count',
                content: function(item) {
                    return item['collapse_impression_count'];
                }
            },
            {
                width: 80,
                title: '有效收视次数',
                dragable: true,
                sortable: true,
                field: 'valid_impression_count',
                content: function(item) {
                    return item['valid_impression_count'];
                }
            },
            {
                width: 80,
                title: '点击次数',
                dragable: true,
                sortable: true,
                field: 'click_count',
                content: function(item) {
                    return item['click_count'];
                }
            },
            {
                width: 80,
                title: '有效收视平均时长(秒)',
                dragable: true,
                sortable: true,
                field: 'avg_valid_impression_time',
                content: function(item) {
                    return item['avg_valid_impression_time'];
                }
            },
            {
                width: 80,
                title: 'CPC(元)',
                dragable: true,
                sortable: true,
                field: 'cpc',
                content: function(item) {
                    return '¥ ' + parseFloat(item['cpc']).toFixed(2);
                }
            },
            {
                width: 80,
                title: '点击率',
                dragable: true,
                sortable: true,
                field: 'click_ratio',
                content: function(item) {
                    return (item['click_ratio'] * 100).toFixed(2) + '%';
                }
            },
            {
                width: 80,
                title: '消费',
                dragable: true,
                sortable: true,
                field: 'cost',
                content: function(item) {
                    return '¥ ' + parseFloat(item['cost']).toFixed(2);
                }
            }
        ],
        ad_non_video: [
            {
                width: 150,
                title: '广告名称',
                dragable: true,
                sortable: true,
                field: 'name',
                content: function(item) {
                    return item['name'];
                }
            },
            {
                width: 80,
                title: '展现量',
                dragable: true,
                sortable: true,
                field: 'impression_count',
                content: function(item) {
                    return item['impression_count'];
                }
            },
            {
                width: 80,
                title: '点击量',
                dragable: true,
                sortable: true,
                field: 'click_count',
                content: function(item) {
                    return item['click_count'];
                }
            },
            {
                width: 80,
                title: '点击率',
                dragable: true,
                sortable: true,
                field: 'click_ratio',
                content: function(item) {
                    return (item['click_ratio'] * 100).toFixed(2) + '%';
                }
            },
            {
                width: 80,
                title: '消费',
                dragable: true,
                sortable: true,
                field: 'cost',
                content: function(item) {
                    return '¥ ' + parseFloat(item['cost']).toFixed(2);
                }
            }
        ]
    }
};
