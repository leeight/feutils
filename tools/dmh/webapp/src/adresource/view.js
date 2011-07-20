goog.require('ui.Table');

/**
 * 资源预估结果页
 * @author zhoulianjie@baidu.com 
 * @constructor
 * @extends {er.Action}
 * @export
 */
adresource.View = function() {
    er.Action.call(this);
    this.model = new base.BaseModel({});
    this.view = 'adresourceView';
};

adresource.View.prototype = {
    BACK_LOCATION: '/adresource/list',

    resultFields: {
        result_fields: [
            {
                title: '',
                width: 230,
                field: '',
                breakLine: true,
                content: function(item) {
                    return item['name'];
                }
            },
            {
                title: 'Cookie',
                width: 230,
                field: 'cookie',
                content: function(item) {
                    return dn.util.getCommaFormat(item['cookie']);
                }
            },
            {
                title: '总展现量',
                width: 230,
                field: 'display',
                content: function(item) {
                    return dn.util.getCommaFormat(item['display']);
                }
            }
        ],
        community_result_fields: [
            {
                title: '生活圈',
                width: 230,
                field: 'name',
                breakLine: true,
                content: function(item) {
                    return item['name'];
                }
            },
            {
                title: '匹配值 Cookie',
                width: 230,
                field: 'match_cookie',
                content: function(item) {
                    return dn.util.getCommaFormat(item['match_cookie']);
                }
            },
            {
                title: '匹配值 展现',
                width: 230,
                field: 'match_display',
                content: function(item) {
                    return dn.util.getCommaFormat(item['match_display']);
                }
            },
            {
                title: '可预定值 Cookie',
                width: 230,
                field: 'available_cookie',
                content: function(item) {
                    return dn.util.getCommaFormat(item['available_cookie']);
                }
            },
            {
                title: '可预定值 展现',
                width: 230,
                field: 'available_display',
                content: function(item) {
                    return dn.util.getCommaFormat(item['available_display']);
                }
            }
        ],
        site_result_fields: [
            {
                title: '网站',
                width: 230,
                field: 'name',
                breakLine: true,
                content: function(item) {
                    return item['name'];
                }
            },
            {
                title: '匹配值 Cookie',
                width: 230,
                field: 'match_cookie',
                content: function(item) {
                    return dn.util.getCommaFormat(item['match_cookie']);
                }
            },
            {
                title: '匹配值 展现',
                width: 230,
                field: 'match_display',
                content: function(item) {
                    return dn.util.getCommaFormat(item['match_display']);
                }
            },
            {
                title: '可预定值 Cookie',
                width: 230,
                field: 'available_cookie',
                content: function(item) {
                    return dn.util.getCommaFormat(item['available_cookie']);
                }
            },
            {
                title: '可预定值 展现',
                width: 230,
                field: 'available_display',
                content: function(item) {
                    return dn.util.getCommaFormat(item['available_display']);
                }
            }
        ],
        community_fields: [
            {
                title: '生活圈',
                width: 796,
                subEntry: true,
                field: 'name',
                content: function(item) {
                    return item.name;
                }
            }
        ],
        community_sub_fields: [
            {
                title: '广告位名称',
                width: 320,
                breakLine: true,
                field: 'slotname',
                content: function(item) {
                    return item['slotname'];
                }
            },
            {
                title: '网站域名',
                width: 320,
                field: 'domain',
                breakLine: true,
                content: function(item) {
                    return item['domain'].join('<br/>');
                }
            },
            {
                title: '状态',
                width: 160,
                field: 'status',
                content: function(item) {
                    return dn.util.getStatusHtml(
                        er.context.get('slotStatusMap')[item['status']], 
                        slot.config.statusClassMap
                    );
                }
            }
        ],
        site_fields: [
            {
                title: '广告位名称',
                width: 365,
                field: 'slotname',
                breakLine: true,
                content: function(item) {
                    return item['slotname'];
                }
            },
            {
                title: '网站域名',
                width: 365,
                field: 'domain',
                breakLine: true,
                content: function(item) {
                    return item.domain.join('<br/>');
                }
            },
            {
                title: '状态',
                width: 90,
                field: 'status',
                content: function(item) {
                    return dn.util.getStatusHtml(er.context.get('slotStatusMap')[item['status']], 
                        slot.config.statusClassMap);
                }
            }
        ]
    },

    initModel: function(query, callback) {
        var me = this,
            resource;
        //5个table绑定字段和datasource
        me.model.result_fields = me.resultFields.result_fields;
        me.model.community_result_fields = me.resultFields.community_result_fields;
        me.model.site_result_fields = me.resultFields.site_result_fields;
        me.model.community_fields = me.resultFields.community_fields;
        me.model.site_fields = me.resultFields.site_fields;
        adresource.data.read('id=' + this.argMap.paramMap['id'], function(data) {
            resource = data.result;
            me.model.result_datasource = resource['result_page']['result'];
            me.model.community_result_datasource = resource['community_result_page']['result'];
            me.model.site_result_datasource = resource['site_result_page']['result'];
            me.model.community_datasource = resource['community_list']['result'];
            me.model.site_datasource = resource['site_list']['result'];
            for (var key in data.result) {
                me.model[key] = data.result[key];
            }
            me.model.orient_community_title = er.context.get('orientCommunityTypeMap')[me.model.orient_community];
            me.model.start_time = baidu.date.format(dn.util.parseToDate(me.model.start_time), 'yyyy-MM-dd');
            me.model.end_time = baidu.date.format(dn.util.parseToDate(me.model.end_time), 'yyyy-MM-dd');
            me.model.productType = me.orientHelper.genTypeText(me.model.type);
            callback();
        });
    },

    initBehavior: function() {
        var weekStr = this.orientHelper.getWeektimeString(this.page.model.orient_hour),
            regionStr = this.orientHelper.getRegionString(this.page.model.orient_location),
            keywordsStr = this.orientHelper.getInputString(this.page.model.keywords),
            keywordsNoneStr = this.orientHelper.getInputString(this.page.model.keywordsNoexist),
            emptyStr = '空',
            emptyNone = '无';

        baidu.g('weektimeResult').innerHTML = weekStr ? weekStr : emptyStr;

        baidu.g('regionResult').innerHTML = regionStr ? regionStr : emptyStr;
        baidu.g('keywordsResult').innerHTML = keywordsStr ? keywordsStr : emptyStr;
        baidu.g('keywordsNoneResult').innerHTML = keywordsNoneStr ? keywordsNoneStr : emptyStr;
        this.page.c('formInfo').c('tblCommunity').onsubrowopen = baidu.fn.bind(this.orientHelper.onShowSubList, this);
        this.orientHelper.toggleCommunitySite.call(this, parseInt(this.model.orient_community, 10));
        if ('' === this.model.max_impression_per_day_uu ||
            0 == this.model.max_impression_per_day_uu) {
            baidu.hide('lblDayWapper');
        }
        if ('' === this.model.max_impression_per_cycle_uu ||
            0 == this.model.max_impression_per_cycle_uu) {
            baidu.hide('lblCycleWapper');
        }
    },

    afterInit: function(page) {
        var me = this;
        this.page.c('btnBack').onclick = function() {
            er.locator.redirect(me.BACK_LOCATION);
        }
    },

    orientHelper: {
        genTypeText: function(types) {
            var rtn = [];
            baidu.array.each(types.split(','), function(item, i) {
                rtn.push(er.context.get('productTypeMap')[item]);
            });
            return rtn.join(',');
        },
        toggleCommunitySite: function(flag) {
            var slotType = {
                'MULTISITES': 1,
                'SINGLESITE': 2
            };
            if (slotType.MULTISITES === flag) {
                this.page.c('formInfo').c('tblCommunity').show();
                this.page.c('formInfo').c('tblSite').hide();
                baidu.hide('wrapperSiteResult');
                this.page.c('formInfo').c('tblCommunity').main.parentNode.style.marginLeft = '52px';
            }
            else {
                this.page.c('formInfo').c('tblCommunity').hide();
                baidu.hide('wrapperCommunityResult');
                this.page.c('formInfo').c('tblSite').show();
                this.page.c('formInfo').c('tblSite').main.parentNode.style.marginLeft = '64px';
            }
        },
        onShowSubList: function(index) {
            var SUBTABLE_IDPREFIX_LEFT = 'slotSubList',
                controlId = SUBTABLE_IDPREFIX_LEFT + index,
                me = this, table,
                mainTable = me.page.c('formInfo').c('tblCommunity'),
                listContainer,
                data = me.model.community_datasource[index].slotlist;

            var tpl = '<div id="{0}" class="cb-sublist-loading" style="height:24px;">{2}</div>' +
                    '<div id="{1}" class="cb-sublist-table" style="display:none"></div>' +
                    '<div style="width:320px;height:24px;"  id=\'{3}\'></div>';

            if (!me.page.c('formInfo').c('tblCommunity').c(controlId)) {
                mainTable.getSubrow(index).innerHTML =
                    baidu.format(tpl,
                        mainTable.getId('subListLoading' + index),
                        mainTable.getId('subListTable' + index),
                        dn.util.getLoadingHtml(),
                        mainTable.getId('Search' + index));

                listContainer = baidu.g(mainTable.getId('subListTable' + index)),
                // 隐藏加载条
                baidu.hide(mainTable.getId('subListLoading' + index));

                // 装载子列表控件
                if (!me.page.c('formInfo').c('tblCommunity').c(controlId)) {
                    baidu.show(listContainer);
                    //创建TABLE
                    table = ui.util.create('Table', {
                        id: controlId,
                        datasource: data,
                        fields: me.resultFields.community_sub_fields,
                        width: 790
                    });

                    table.appendTo(listContainer);
                    mainTable.addChild(table);
                }

                listContainer.style.marginLeft = '-30px';
            }

        },
        getWeektimeString: function(value) {
            function setOrientHour(val) {
                if (!val) return '';
                var myValue = [], tmp, temp, subItem;
                for (var i2 = 0; i2 < 7; i2++) {
                    temp = [];
                    myValue.push(temp);
                    for (var j2 = 0; j2 < 24; j2++) {
                        temp.push(0);
                    }
                }
                var itemValue = val.split(',');
                for (var j = 0, len2 = itemValue.length; j < len2; j += 2) {
                    subItem = itemValue[j];
                    temp = parseInt(subItem.substr(0, 1), 10) - 1;
                    i2 = parseInt(subItem.substr(1), 10);
                    j2 = parseInt(itemValue[j + 1].substr(1), 10);
                    for (; i2 < j2; i2++) {
                        myValue[temp][i2] = 1;
                    }
                }
                return myValue;
            }

            value = setOrientHour(value);
            var beginTime, prevTime,
                html = [], lineHtml,
                dayList = ['一', '二', '三', '四', '五', '六', '日'],
                emptyDay, i, j,
                sep = '<br>';

            function pushTime() {
                if (baidu.lang.hasValue(beginTime)) {
                    if (beginTime == 0 && prevTime == 24) {
                        lineHtml.push('全天投放');
                    } else {
                        lineHtml.push(beginTime + ':00 -- ' + prevTime + ':00');
                    }
                }

                beginTime = null;
                prevTime = null;
            }


            for (i = 0; i < 7; i++) {
                lineHtml = [];
                emptyDay = 1;

                for (j = 0; j < 24; j++) {
                    if (value[i][j]) {
                        if (!baidu.lang.hasValue(beginTime)) {
                            beginTime = j;
                        }

                        prevTime = j + 1;
                        emptyDay = 0;
                    } else {
                        pushTime();
                    }
                }

                pushTime();
                if (emptyDay) {
                    lineHtml.push('全天暂停');
                }
                html.push('星期' + dayList[i] + '：' + lineHtml.join(', '));
            }

            for (i = 0; i < 13; i++) {
                sep += '&nbsp;';
            }
            return html.join('<br/>');
        },
        getRegionString: function(value) {
            function setOrientRegion(val) {
                var myValue = {},tmp, subItem, citys,
                region = er.context.get('regionInfoMap'),
                temp = region.cityProvince;
                var itemValue = val;
                for (var j = 0, len2 = itemValue.length; j < len2; j++) {
                    subItem = itemValue[j];
                    if (subItem.length >= 3 && subItem !== '999') {
                        // subItem是二级城市，儿region.cityProvince是二级
                        // 城市到一级城市的对应关系
                        // i2是一级城市列表
                        var i2 = temp[subItem];
                        if (!myValue[i2]) {
                            myValue[i2] = [];
                        }
                        myValue[i2].push(subItem);
                    } else {
                        myValue[subItem] = [];
                        citys = region[subItem];
                        if (citys instanceof Array) {
                            for (var i2 = 0, j2 = citys.length; i2 < j2; i2++) {
                                myValue[subItem].push(citys[i2].v);
                            }
                        }
                    }
                }
                return myValue;
            }

            value = setOrientRegion(value);
            var data = er.context.get('regionInfoMap'),
                map = data.map,
                len, i, key,
                citys,
                html = [],
                allSelected = true,
                prifix = '';

            for (key in value) {
                citys = value[key];
                if (citys) {
                    if (!data[key] || citys.length == data[key].length) {
                        html.push(map[key]);
                    } else {
                        len = citys.length;
                        allSelected = false;
                        for (i = 0; i < len; i++) {
                            html.push(map[citys[i]]);
                        }
                    }
                }
            }

            if (allSelected && html.length == 36) prifix = '全国：';

            return prifix + html.join(', ');
        },
        getInputString: function(value) {
            var i, len = value.length,
                html = [];

            for (i = 0; i < len; i++) {
                if (value[i].length != 0) {
                    html.push(baidu.string.encodeHTML(value[i]));
                }
            }

            return html.join(', ');
        }
    }

};
baidu.inherits(adresource.View, er.Action);
