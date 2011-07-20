goog.require('ad');

goog.provide('ad.data');

/**
 *
 */
ad.data = function() {
    var url = ad.config.url;

    return dn.util.da_generator([
        // 广告列表数据
        {
            name: 'list',
            url: url.adList
        },
        //更新广告状态操作：归档、恢复、暂停
        {
        	name: 'batchUpdate',
        	url: url.batchUpdate
        },
        {
            name: 'create',
            url: url.create
        },
        {
            name: 'update',
            url: url.update
        },
        {
            name: 'read',
            url: url.read
        },

        // 为了去掉ad和material的依赖关系，在这里定义了一个
        // 对material的操作接口
        {
            'name': 'material_status_update',
            'url' : '/material/status_update'
        }
    ]);
}();
