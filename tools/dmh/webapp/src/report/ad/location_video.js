/**
 * 广告分地域视频报告
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
report.ad.LocationVideo = function() {
    er.ListAction.call(this);
    this.model.locationId = null;
};

report.ad.LocationVideo.prototype = {
    view: 'locationVideo',

    initModel: function(query, callback) {
        this.model.fields = [
          {
                title: '地域',
                sortable: true,
                field:'location',
                width: 95,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['location'];
                }
            },
            {
                title: '展现量',
                sortable: true,
                field:'impression_count',
                width: 64,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['impression_count'];
                }
            },
            {
                title: '总曝光次数',
                sortable: true,
                field:'total_impression_count',
                width: 64,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['total_impression_count'];
                }
            },
            {
                title: '视频曝光次数',
                sortable: true,
                field:'video_impression_count',
                width: 64,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['video_impression_count'];
                }
            },
            {
                title: '最小化视窗曝光次数',
                sortable: true,
                field:'collapse_impression_count',
                width: 63,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['collapse_impression_count'];
                }
            },
            {
                title: '有效收视次数',
                sortable: true,
                field:'valid_impression_count',
                width: 85,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['valid_impression_count'];
                }
            },
            {
                title: '点击次数',
                sortable: true,
                field:'click_count',
                width: 65,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['click_count'];
                }
            },
            {
                title: '有效收视平均时长（秒）',
                sortable: true,
                field:'avg_valid_impression_time',
                width: 100,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return item['avg_valid_impression_time'];
                }
            },
            {
                title: 'CPC（元）',
                sortable: true,
                field:'cpc',
                width: 60,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return dn.util.getFixed(item['cpc']);
                }
            },
            {
                title: '点击率',
                sortable: true,
                field:'click_ratio',
                width: 60,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return dn.util.getPercent(item['click_ratio']);
                }
            },
            {
                title: '消费',
                sortable: true,
                field:'cost',
                width: 60,
                breakLine: true,
                dragable: true,
                content: function(item) {
                    return dn.util.getRMB(item['cost']);
                }
            }
        ];
        this.model['flash_options'] = {
                url: report.ad.config.location_flashfile,
                width: '473',
                height: '286',
                wmode: 'transparent',
                'vars' : {
                    'xml' : '/assets/flash/order-location-data.xml'
                  }
            };
        this.model.flash_options = {
                url: report.ad.config.location_flashfile,
                width: '473',
                height: '286',
                wmode: 'transparent',
                'vars' : {
                    'xml' : '/assets/flash/order-location-data.xml'
                  }
            };
        callback();
    },

    paramAdapters: [new base.OneToManyParamAdapter(
            ',', 'date_range', ['start_time', 'end_time'])],

    afterInit: function(page) {
      this.formSearch = page.c('formSearch');
        this.list = page.c('list');
        this.requesterList = report.data['ad.location_video'];
    },

    enterDocumentInternal: function() {
        this.refreshFlash();
    },

    initBehaviorInternal: function() {
        this.page.c('formSearch').c('reportCalendar').onselect =
            baidu.fn.bind(this.onReportCalendarSelect, this);
        this.page.c('list').ongetdata = baidu.fn.bind(this.onListData, this);

        this.onViewAreaChangeHandler =
            baidu.fn.bind(this.onViewAreaChange, this);
        this.page.c('flash').addListener(ui.events.VIEWAREA_CHANGE,
            this.onViewAreaChangeHandler);
    },

    onModelChanged: function(propertyName, newValue, oldValue) {
      report.ad.LocationVideo.superClass.onModelChanged.apply(this, arguments);

        if (propertyName === 'searchParams') {
            this.refreshFlash();
        }
        if (propertyName === 'locationId') {
            this.refreshSummary();
        }
    },

    onReportCalendarSelect: function() {
        this.page.c('formSearch').validateAndSubmit();
    },

    onListData: function(data) {
        this.model.allData = [];
        var total = {
            location_id: -1,
            location: '全国',
            total_impression_count: 0,
            video_impression_count: 0,
            collapse_impression_count: 0,
            valid_impression_count: 0,
            click_count: 0,
            avg_valid_impression_time: 0,
            cpc: 0,
            click_ratio: 0,
            cost: 0
        };
        for (var i = 0; i < data.length; i++) {
          this.model.allData.push(data[i]);
          for (var key in total) {
            if (key != 'location_id' && key != 'location') {
              if (key.indexOf(/ratio/) > -1) {
                total[key] += parseFloat(data[i][key]);
              } else if('cost' === key) {
                total[key] += parseFloat(parseFloat(data[i][key]).toFixed(2));
                data[i][key] = parseFloat(data[i][key]).toFixed(2);
              } else if('avg_valid_impression_time' === key) {
                total[key] += parseFloat(data[i][key]) * parseInt(data[i]['valid_impression_count'], 10)
              } else {
                total[key] += parseInt(data[i][key], 10);
              }
            }
          }
        }
        total['avg_valid_impression_time'] = (0 == total['valid_impression_count']) ? 0 :
          dn.util.getFixed(total['avg_valid_impression_time'] / total['valid_impression_count']);
        total['cpc'] = (0 == total['click_count']) ? 0 : dn.util.getFixed(total['cost'] / total['click_count']);
        total.click_ratio = (0 == total['video_impression_count']) ? 0 : total['click_count'] / total['video_impression_count'];
        total.cost = dn.util.getFixed(total.cost);
        this.model.allData.push(total);

        this.model.locationId = total.location_id;
        this.model.triggerPropertyChanged('locationId');
    },

    onViewAreaChange: function(id, area_id) {
        this.model.set('locationId', dn.util.getXmlAreaId(area_id));
    },

    refreshFlash: function() {
        var dateSpan = this.page.c('formSearch').c('reportCalendar').getValue(),
            url = report.ad.config.location_video_flashData +
            '?' + this.getSearchParam();

        baidu.g('lblDate').innerHTML = baidu.g('lblDate2').innerHTML =
            dn.util.getReportDateText(dateSpan);

        this.page.c('flash').rebindModel({
            flash_options: {
                id: 'flash',
                url: report.ad.config.location_flashfile,
                width: '473',
                height: '286',
                wmode: 'transparent',
                'vars' : {
                    'xml' : url
                }
            }
        });
    },

    refreshSummary: function() {
        var data;
        for (var i = 0; i < this.model.allData.length; i++) {
            if (this.model.allData[i].location_id == this.model.locationId) {
                data = this.model.allData[i];
                break;
            }
        }
        if (data) {
          baidu.g('reportSummary').innerHTML = baidu.format(
              er.template.get('reportAdLocationVideoSummary'),
              data.location,
              data.total_impression_count,
              data.video_impression_count,
              data.collapse_impression_count,
              data.valid_impression_count,
              data.click_count,
              dn.util.getFixed(data.avg_valid_impression_time),
              dn.util.getFixed(data.cpc),
              dn.util.getZeroPercent((data.click_ratio * 100).toFixed(2) + '%'),
              dn.util.getFixed(data.cost));
        }
    }
};

baidu.inherits(report.ad.LocationVideo, er.ListAction);
