/**
 * 资源预估数据操作
 */
adresource.data = function() {
    var url = adresource.config.url;

    return dn.util.da_generator([
        {
            name: 'list',
            url: url.list
        },
        {
            name: 'create',
            url: url.create
        },
        {
            name: 'read',
            url: url.read
        },
        {
        	name: 'keywords',
        	url: url.keywords
        }
    ]);
}();
