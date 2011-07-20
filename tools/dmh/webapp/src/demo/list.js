demo.List = function() {
    er.Action.call(this);

    this.model = new base.BaseModel({
        fieldsDemo: null,
        selectedItems: null,
        searchParams: null,
        listState: null
    });
};

demo.List.prototype = {
    view: 'demoList',

    CONTEXT_INITER_LIST: ['someContext'],

    someContext: function(query, callback) {
        var me = this;
        setTimeout(function() {
            me.model.fieldsDemo = demo.config.listFields;

            callback();

        }, 1000);
    },

    afterInit: function(page) {
        var ds = new base.RemoteListDataSource(function(param, callback) {
            //alert(param);
            callback({
                'success': 'true',
                'message': {},
                'page': {
                'pageNo': 2,
                'pageSize': 30,
                'orderBy': '',
                'order': 'desc',
                'totalCount': 502,
                'result': [
                                    {
                        'adPositionId': 99595,
                        'name': '1112',
                        'channelName': 'HelloNews',
                        'type': 0,
                        'sizeType': 1,
                        'width': 100,
                        'height': 100,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 99567,
                        'name': '1111',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 760,
                        'height': 90,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 98955,
                        'name': 'gewageag',
                        'channelName': '游戏',
                        'type': 0,
                        'sizeType': 0,
                        'width': 1024,
                        'height': 60,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 97707,
                        'name': '弹窗 111',
                        'channelName': '默认频道',
                        'type': 2,
                        'sizeType': 0,
                        'width': 960,
                        'height': 90,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': -1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 97706,
                        'name': '漂浮 1111',
                        'channelName': '默认频道',
                        'type': 1,
                        'sizeType': 0,
                        'width': 960,
                        'height': 90,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': -1,
                        'hasData': 0,
                        'deliveryStatus': 1
                        }
                                        ,
                                {
                        'adPositionId': 96869,
                        'name': '哇哈哈快速版本又上线了',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 640,
                        'height': 60,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 96543,
                        'name': 'hellonews8',
                        'channelName': 'HelloNews',
                        'type': 0,
                        'sizeType': 0,
                        'width': 960,
                        'height': 90,
                        'description': '',
                        'status': 1,
                        'flag': 1,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 96536,
                        'name': 'testessdfdsf',
                        'channelName': 'union开关',
                        'type': 0,
                        'sizeType': 0,
                        'width': 728,
                        'height': 90,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 96025,
                        'name': 'wefgs',
                        'channelName': 'bb',
                        'type': 0,
                        'sizeType': 0,
                        'width': 360,
                        'height': 300,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 95023,
                        'name': 'zhanglili-multimedia',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 300,
                        'height': 120,
                        'description': '测试document.write用',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 0,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 91978,
                        'name': 'tets008',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 1,
                        'width': 300,
                        'height': 600,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 91173,
                        'name': '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 960,
                        'height': 75,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 91132,
                        'name': '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 1024,
                        'height': 60,
                        'description': '1',
                        'status': 1,
                        'flag': 1,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 90998,
                        'name': '主题描述slot021',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 728,
                        'height': 90,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 90997,
                        'name': '主题描述slot',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 960,
                        'height': 90,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 90996,
                        'name': '主题悬浮slot',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 580,
                        'height': 90,
                        'description': '',
                        'status': 1,
                        'flag': 1,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 90995,
                        'name': '主题链接slot',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 640,
                        'height': 60,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 90978,
                        'name': 'testUnion444',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 760,
                        'height': 60,
                        'description': 'ds',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 90977,
                        'name': 'list',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 1024,
                        'height': 60,
                        'description': 'lala',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 90971,
                        'name': 'testunion4',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 960,
                        'height': 90,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 90966,
                        'name': 'union4',
                        'channelName': 'union开关',
                        'type': 0,
                        'sizeType': 0,
                        'width': 960,
                        'height': 90,
                        'description': 'union4des',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 90964,
                        'name': 'union4_test',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 960,
                        'height': 90,
                        'description': 'test',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 90665,
                        'name': 'union开关slot01',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 960,
                        'height': 75,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 0,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 89264,
                        'name': 'HelloNews',
                        'channelName': 'gsg',
                        'type': 0,
                        'sizeType': 0,
                        'width': 960,
                        'height': 75,
                        'description': 'fds',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 88154,
                        'name': 'zhanglili-flash-200',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 1,
                        'width': 400,
                        'height': 400,
                        'description': '',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 0,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 88112,
                        'name': 'zhanglili-image-200',
                        'channelName': '默认频道',
                        'type': 1,
                        'sizeType': 1,
                        'width': 400,
                        'height': 400,
                        'description': '广告位信息收集测试',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': -1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 88111,
                        'name': 'zhanglili-image-20',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 200,
                        'height': 200,
                        'description': '广告位信息收集测试',
                        'status': 1,
                        'flag': 0,
                        'cproRestFlag': 0,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 88109,
                        'name': 'zhanglili-text',
                        'channelName': '默认频道',
                        'type': 0,
                        'sizeType': 0,
                        'width': 960,
                        'height': 90,
                        'description': '广告位信息收集测试',
                        'status': 1,
                        'flag': 1,
                        'cproRestFlag': 0,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 85621,
                        'name': '按小时投放广告位',
                        'channelName': '游戏',
                        'type': 0,
                        'sizeType': 0,
                        'width': 728,
                        'height': 90,
                        'description': '',
                        'status': 1,
                        'flag': 1,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                                        ,
                                {
                        'adPositionId': 85491,
                        'name': '快速版本',
                        'channelName': 'gsg',
                        'type': 0,
                        'sizeType': 0,
                        'width': 1024,
                        'height': 60,
                        'description': '快速版本第一期上线',
                        'status': 1,
                        'flag': 1,
                        'cproRestFlag': 1,
                        'hasData': 0,
                        'deliveryStatus': 3
                        }
                    ]
                 }
                });
        });
        ds.getExtraParam = baidu.fn.bind(this.getSearchParam, this);
        page.getChild('listDemo').datasource = ds;
    },

    enterDocument: function(page) {
        this.page.c('pnlOperation').c('btnDelete').disable();
        this.page.c('listDemo').getData();
    },

    initBehavior: function(page) {
        this.page.c('listDemo').onstatechange = baidu.fn.bind(this.onListStateChanged, this);
        this.page.c('listDemo').onlistselect = baidu.fn.bind(this.onListSelected, this);
        this.page.c('formSearch').onsubmit = baidu.fn.bind(this.onSearch, this);
    },

    onModelChanged: function(propertyName, newValue, oldValue) {
        if (propertyName === 'selectedItems') {
            var selectedItems = newValue;
            if (selectedItems.length === 0) {
                this.page.c('pnlOperation').c('btnDelete').disable();
            } else {
                this.page.c('pnlOperation').c('btnDelete').enable();
            }
        }
        if (propertyName === 'searchParams' || propertyName === 'listState') {
            this.page.c('listDemo').getData();
            var states = [],
                searchParams = this.model.getSearchParams(),
                listState = this.model.getListState();
            if (searchParams) {
                states.push(searchParams);
            }
            if (listState) {
                for (var key in listState) {
                    states.push(key + '=' + listState[key]);
                }
            }
            this.saveState(states.join('&'));
        }
    },

    getSearchParam: function() {
        return this.model.getSearchParams();
    },

    onListStateChanged: function(state) {
        this.model.setListState(state);
    },

    onListSelected: function(selectedItems) {
        this.model.setSelectedItems(selectedItems);
    },

    onSearch: function(params) {
        this.model.setSearchParams(params);
    }
};
baidu.inherits(demo.List, er.Action);

demo.list = new demo.List();
