var demo = {};

demo.config = function() {
    return {
        action: [
            {
                location: '/demo',
                action: 'demo.action'
            },
            {
                location: '/form',
                action: 'demo.form'
            },
            {
                location: '/list',
                action: 'demo.list'
            }
        ],

        listFields: [
             {
                 width: 216,
                 title: 'Title1',
                 sortable: true,
                 dragable: true,
                 field: 'name',
                 subEntry: true,
                 content: function(item) {
                     var value = item['name'];
                         return baidu.format(
                                 '<a href="#/slot/detail~id={0}" title="{1}">{1}</a>',
                                 item['adPositionId'],
                                 value);
                 }
             },
             {
                 title: 'Title2',
                 width: 120,
                 dragable: true,
                 field: 'channel',
                 content: function(item) {
                     return item['channelName'];
                 }
             }
         ]
    };
}();

er.controller.addModule(demo);
