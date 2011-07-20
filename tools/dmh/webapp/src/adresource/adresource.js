/**
 * 资源预估模块声明
 */
var adresource = {};

adresource.config = (function() {
    return {
        /**
         * action配置
         */
        'action': [
    		{
    		    location: '/adresource/list',
    		    action: 'adresource.List'
    		},
    		{
                location: '/adresource/create',
                action: 'adresource.Form'
            },
            {
                location: '/adresource/read',
                action: 'adresource.View'
            },
            {
            	location: '/adresource/keywords',
            	action: 'adresource.Keywords'
            }
	    ],

        /**
         * url配置
         */
	    url: {
            list: '/adresource/list',
            create: '/adresource/create',
            read: '/adresource/read',
            keywords: '/adresource/query'
        },

        /**
         * 状态颜色映射
         */
        'statusColorMap': {
                '1' : '#48A31A',//"完成",
                '2' : '#FFAC2F',//"处理中"
                '3' : '#FF0000' //失败
        },

        /**
         * 列表显示字段
         */
        'listFields': [
                     {
                         title: '预估任务名称',
                         sortable: false,
                         dragable: false,
                         width: 480,
                         field: 'name',
                         breakLine: true,
                         content: function(item) {                             
                             if (parseInt(item['status'], 10) == 2) {
                                 return baidu.format(
                                         '<a href="#/adresource/read~id={1}" title="{0}">{0}</a>',
                                         item['name'],
                                         item['id']);
                             }
                             else {
                                 return item['name'];
                             }
                         }
                     },
                     {
                         title: '预估任务状态',
                         sortable: false,
                         dragable: false,
                         width: 165,
                         field: 'status',
                         content: function(item) {
                        	 var color = adresource.config.statusColorMap[item['status']];
                             return dn.util.getStatusHtmlbyColor(er.context.get('adresourceStatusMap')[item['status']], color);
                         }
                     },
                     {
                         title: '提交日期',
                         sortable: true,
                         dragable: false,
                         width: 220,
                         field: 'submit_date',
                         content: function(item) {
                             return baidu.date.format(dn.util.parseToDate(item['submit_date']), 'yyyy-MM-dd');
                         }
                     },
                     {
                         title: '操作',
                         sortable: false,
                         dragable: false,
                         width: 220,
                         field: 'name',
                         content: function(item) {
                        	 if (parseInt(item['status'], 10) == 2) {
	                             var links = [];
	                             links.push({
	                                  'title': '查看结果',
	                                  'location': '#/adresource/read~id=' + item['id']
	                             });

	                             return dn.listHelper.operation(links);
                        	 }
                        	 else {
                        		 return '';
                        	 }
                         }
                     }

                 ]
    };
})();

er.controller.addModule(adresource);
