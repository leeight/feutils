demo.Form = function() {
    er.Action.call(this);
};

demo.Form.prototype = {
    view: 'demoEdit',

    CONTEXT_INITER_LIST: ['someContext'],

    someContext: function(query, callback) {
        var me = this;
        setTimeout(function() {
            var listSource = new base.RemoteRSDataSource();
            listSource.getDataInternal = function(keyword, pageSize, pageNo, callback) {
                callback({
                    'success': 'true',
                    'message': {},
                    'page': {
                        'pageNo': 1,
                        'pageSize': 2,
                        'orderBy': '0',
                        'order': 'desc',
                        'totalCount': 2,
                        'result': [
                                  {
                                      text: 'a',
                                      value: '1'
                                  },
                                  {
                                      text: 'b',
                                      value: '2'
                                  }
                              ]
                    }
                });
            };

            me.model = {
                title: '测试表单',
                creator: 'someone@baidu.com',
                langOK: '确定',
                langCancel: 'Cancel',
                cbDataSource: [
                    {
                        text: 'a',
                        value: '1'
                    },
                    {
                        text: 'b',
                        value: '2'
                    }
                ],
                searchInfoFields: [
                                  {
                                	  context: 'keyword',
                                	  ignore: '',
                                	  template: '包含',
                                	  searchTip: '请输入'
                                  }
                                  ],
                timeDemo: new Date(),
                urlDemo: 'http://www.baidu.com',
                textDemo: 'Label的文字',
                fieldsDemo: [{
                                title: 'text',
                                width: 70,
                                stable: true,
                                field: 'text',
                                content: function(item) {
                                    return item.text;
                                }
                            },
                            {
                                title: 'value',
                                width: 70,
                                stable: false,
                                field: 'value',
                                content: function(item) {
                                    return item.value;
                                }
                            }],
                listSource: listSource,
                uploaderConf: {
                    'width' : 'width',
                    'height': 'height',
                    'url' : 'materialUrl',
                    'local' : 'materialLocalPath'
                }
            };

            callback();

        }, 1000);
    },

    enterDocument: function(page) {
        /*var m = new base.BaseModel(),
            f = function(){
                alert(arguments[0] + ':' + arguments[1] + ':' + arguments[2]);
            };
        m.a = 1;
        m.addPropertyChangedListener(f);
        m.setA(2);
        m.removePropertyChangedListener(f);
        m.setA(3);
        var a = new base.ObservableList([1]),
            f = function(){
                alert(arguments[0] + ':' + arguments[1].length + ':' + arguments[2].length);
            };
        a.addListChangedListener(f);
        a.push(2);
        a.removeListChangedListener(f);
        a.push(3);*/
    },

    initBehavior: function(page) {
        this.page.getChild('formDemo').onsubmit = function(parmaStr) {
            alert(parmaStr);
        };
    }
};
baidu.inherits(demo.Form, er.Action);

demo.form = new demo.Form();
