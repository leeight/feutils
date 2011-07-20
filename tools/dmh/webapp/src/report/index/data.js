/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * author:  刘磊
 */
report.index.data = function() {
    return dn.util.da_generator([
        {
            name: 'list',
            url: '/order/list'
        },{
            name: 'subList',
            url: '/ad/list'
        }
        
    ]);
}();
