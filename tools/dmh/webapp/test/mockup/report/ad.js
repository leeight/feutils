/**
 * 
 */

var report_ad_daily_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "date" : '20110122010239', // 日期
		        "total_impression_count" : '1200',
		        "video_impression_count" : '320',
		        "video_impression_uu" : '1292',
		        "collapse_impression_count" : '23', // 最小化视频曝光次数
		        "valid_impression_count" : '34', // 有效播放次数
		        "click_count" : '45',
		        "click_uu" : '56',
		        "avg_valid_impression_time" : '23', // 有效收视平均时长
		        "cpc" : '3435',
		        "click_ratio" : '23%',
		        "click_uu_ratio" : '34%',
		        "cost" : '3133',
		        "request_count" : '2424',  // 请求量，仅仅管理端报告有此属性
			    "impression_count" : '2222'  // 展现次数
		      },
		      {
			        "date" : '20110122010239', // 日期
			        "total_impression_count" : '1200',
			        "video_impression_count" : '320',
			        "video_impression_uu" : '1292',
			        "collapse_impression_count" : '23', // 最小化视频曝光次数
			        "valid_impression_count" : '34', // 有效播放次数
			        "click_count" : '45',
			        "click_uu" : '56',
			        "avg_valid_impression_time" : '23', // 有效收视平均时长
			        "cpc" : '3435',
			        "click_ratio" : '23%',
			        "click_uu_ratio" : '34%',
			        "cost" : '3133',
			        "request_count" : '2424', // 请求量，仅仅管理端报告有此属性
			        "impression_count" : '2222'  // 展现次数
			      },
			      {
				        "date" : '20110122010239', // 日期
				        "total_impression_count" : '1200',
				        "video_impression_count" : '320',
				        "video_impression_uu" : '1292',
				        "collapse_impression_count" : '23', // 最小化视频曝光次数
				        "valid_impression_count" : '34', // 有效播放次数
				        "click_count" : '45',
				        "click_uu" : '56',
				        "avg_valid_impression_time" : '23', // 有效收视平均时长
				        "cpc" : '3435',
				        "click_ratio" : '23%',
				        "click_uu_ratio" : '34%',
				        "cost" : '3133',
				        "request_count" : '2424', // 请求量，仅仅管理端报告有此属性
				        "impression_count" : '2222'  // 展现次数
				      }
		    ]
		  }
		}

mockup.register('/report/ad/daily_video', report_ad_daily_video);

var report_ad_daily_non_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "date" : '20110202030234', // 日期
		        "impression_count" : '123',
		        "click_count" : '23',
		        "click_ratio" : '34',
		        "impression_uu" : '45',
		        "click_uu" : '23',
		        "click_uu_ratio" : '345',
		        "cost" : '24343',
		        "request_count" : '23433335'  // 请求量，仅仅管理端报告有此属性
		      },
		      {
			        "date" : '20110202030234', // 日期
			        "impression_count" : '123',
			        "click_count" : '23',
			        "click_ratio" : '34',
			        "impression_uu" : '45',
			        "click_uu" : '23',
			        "click_uu_ratio" : '345',
			        "cost" : '24343',
			        "request_count" : '23433335'  // 请求量，仅仅管理端报告有此属性
			      },
			      {
				        "date" : '20110202030234', // 日期
				        "impression_count" : '123',
				        "click_count" : '23',
				        "click_ratio" : '34',
				        "impression_uu" : '45',
				        "click_uu" : '23',
				        "click_uu_ratio" : '345',
				        "cost" : '24343',
				        "request_count" : '23433335'  // 请求量，仅仅管理端报告有此属性
				      }
		    ]
		  }
		};
mockup.register('/report/ad/daily_non_video', report_ad_daily_non_video);

var report_ad_location_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "location_id" : '123',
		        "location" : '北京',
		        "total_impression_count" : '1524',
		        "video_impression_count" : '134',
		        "video_impression_uu" : '1234',
		        "collapse_impression_count" : '134', // 最小化视频曝光次数
		        "valid_impression_count" : '24', // 有效播放次数
		        "click_count" : '245',
		        "click_uu" : '34',
		        "avg_valid_impression_time" : '14.25', // 有效收视平均时长
		        "cpc" : '1423',
		        "click_ratio" : '0.3400',
		        "click_uu_ratio" : '0.3500',
		        "cost" : '34552.7077',
		        "request_count" : '525', // 请求量，仅仅管理端报告有此属性
		        "impression_count" : '2222'  // 展现次数
		      },
		      {
			        "location_id" : '123',
			        "location" : '北京2',
			        "total_impression_count" : '1524',
			        "video_impression_count" : '134',
			        "video_impression_uu" : '1234',
			        "collapse_impression_count" : '134', // 最小化视频曝光次数
			        "valid_impression_count" : '10', // 有效播放次数
			        "click_count" : '245',
			        "click_uu" : '34',
			        "avg_valid_impression_time" : '10.25', // 有效收视平均时长
			        "cpc" : '1423',
			        "click_ratio" : '0.3400',
			        "click_uu_ratio" : '0.3500',
			        "cost" : '34552.9098',
			        "request_count" : '525', // 请求量，仅仅管理端报告有此属性
			        "impression_count" : '2222'  // 展现次数
			      }
		    ]
		  }
		};
mockup.register('/report/ad/location_video',report_ad_location_video);

var report_ad_location_non_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "location_id" : '123',
		        "location" : '北京',
		        "impression_count" : '13',
		        "click_count" : '24',
		        "click_ratio" : '0.35',
		        "impression_uu" : '64',
		        "impression_uu_ratio" : '0.35',
		        "click_uu_ratio" : '0.24',
		        "cost" : '23523',
		        "request_count" : '5235'  // 请求量，仅仅管理端报告有此属性
		      },
		      {
			        "location_id" : '123',
			        "location" : '北京2',
			        "impression_count" : '13',
			        "click_count" : '24',
			        "click_ratio" : '0.25',
			        "impression_uu" : '64',
			        "impression_uu_ratio" : '0.35',
			        "click_uu_ratio" : '0.24',
			        "cost" : '23523',
			        "request_count" : '5235'  // 请求量，仅仅管理端报告有此属性
			      }
		    ]
		  }
		};
mockup.register('/report/ad/location_non_video',report_ad_location_non_video);

var report_ad_perhour_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "hour" : '0:00-1:00', // 时段
		        "total_impression_count" : '1323',
		        "video_impression_count" : '34',
		        "video_impression_uu" : '2',
		        "collapse_impression_count" : '3', // 最小化视频曝光次数
		        "valid_impression_count" : '4', // 有效播放次数
		        "click_count" : '2',
		        "click_uu" : '5',
		        "avg_valid_impression_time" : '67', // 有效收视平均时长
		        "cpc" : '888',
		        "click_ratio" : '46',
		        "click_uu_ratio" : '5',
		        "cost" : '7',
		        "request_count" : '3', // 请求量，仅仅管理端报告有此属性
		        "impression_count" : '2222'  // 展现次数
		      },
		      {
			        "hour" : '2:00-3:00', // 时段
			        "total_impression_count" : '1323',
			        "video_impression_count" : '34',
			        "video_impression_uu" : '2',
			        "collapse_impression_count" : '3', // 最小化视频曝光次数
			        "valid_impression_count" : '4', // 有效播放次数
			        "click_count" : '2',
			        "click_uu" : '5',
			        "avg_valid_impression_time" : '67', // 有效收视平均时长
			        "cpc" : '888',
			        "click_ratio" : '46',
			        "click_uu_ratio" : '5',
			        "cost" : '7',
			        "request_count" : '3', // 请求量，仅仅管理端报告有此属性
			        "impression_count" : '2222'  // 展现次数
			      }
		    ]
		  }
		};
mockup.register('/report/ad/perhour_video',report_ad_perhour_video);

var report_ad_perhour_non_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "hour" : '4:00-5:00', // 时段
		        "impression_count" : '242',
		        "click_count" : '23',
		        "click_ratio" : '23%',
		        "impression_uu" : '2353',
		        "impression_uu_ratio" : '35%',
		        "click_uu_ratio" : '25%',
		        "cost" : '2535',
		        "request_count" : '333333333'  // 请求量，仅仅管理端报告有此属性
		      },
		      {
			        "hour" : '5:00-6:00', // 时段
			        "impression_count" : '242',
			        "click_count" : '23',
			        "click_ratio" : '23%',
			        "impression_uu" : '2353',
			        "impression_uu_ratio" : '35%',
			        "click_uu_ratio" : '25%',
			        "cost" : '2535',
			        "request_count" : '333333333'  // 请求量，仅仅管理端报告有此属性
			      }
		    ]
		  }
		};
mockup.register('/report/ad/perhour_non_video',report_ad_perhour_non_video);

var report_ad_frequency = {
		  "success" : "true",
		    "message" : {},
		    "page" : {
		      "pageNo":1, 
		      "pageSize":120, 
		      "orderBy":"orderId", 
		      "order":"desc", 
		      "totalCount":4, 
		      "result" : [
		        {
		          "frequency" : '1次', // 展示次数
		          "uu_count" : '232',
		          "uu_ratio" : '0.89839'
		        },
		        {
			          "frequency" : '2次', // 展示次数
			          "uu_count" : '12',
			          "uu_ratio" : '0.11832'
			        }
		      ]
		    }
		};
mockup.register('/report/ad/frequency',report_ad_frequency);

var report_ad_video_impression_time = {
		  "success" : "true",
		    "message" : {},
		    "page" : {
		      "pageNo":1, 
		      "pageSize":120, 
		      "orderBy":"orderId", 
		      "order":"desc", 
		      "totalCount":4, 
		      "result" : [
		        {
		          "impression_time" : '1秒', // 播放时间
		          "uu_count" : '2424',
		          "uu_ratio" : '0.4923'
		        },
		        {
			          "impression_time" : '2秒', // 播放时间
			          "uu_count" : '424',
			          "uu_ratio" : '0.2923'
			        }
		      ]
		    }
		};
mockup.register('/report/ad/video_impression_time',report_ad_video_impression_time);

var report_ad_community_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "community_name" : '生活圈1', // 生活圈名称
		        "total_impression_count" : '243',
		        "video_impression_count" : '25',
		        "video_impression_uu" : '142',
		        "collapse_impression_count" : '53', // 最小化视频曝光次数
		        "valid_impression_count" : '35', // 有效播放次数
		        "click_count" : '45',
		        "click_uu" : '64',
		        "avg_valid_impression_time" : '363', // 有效收视平均时长
		        "cpc" : '3653',
		        "click_ratio" : '24%',
		        "click_uu_ratio" : '42%',
		        "cost" : '5352',
		        "request_count" : '535',  // 请求量，仅仅管理端报告有此属性
		        "impression_count" : '222'  // 展现次数
		      },
		      {
			        "community_name" : '生活圈1', // 生活圈名称
			        "total_impression_count" : '243',
			        "video_impression_count" : '25',
			        "video_impression_uu" : '142',
			        "collapse_impression_count" : '53', // 最小化视频曝光次数
			        "valid_impression_count" : '35', // 有效播放次数
			        "click_count" : '45',
			        "click_uu" : '64',
			        "avg_valid_impression_time" : '363', // 有效收视平均时长
			        "cpc" : '3653',
			        "click_ratio" : '24%',
			        "click_uu_ratio" : '42%',
			        "cost" : '5352',
			        "request_count" : '535',  // 请求量，仅仅管理端报告有此属性
			        "impression_count" : '222'  // 展现次数
			      }
		    ]
		  }
		};
mockup.register('/report/ad/community_video',report_ad_community_video);

var report_ad_community_non_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "community_name" : '生活圈1', // 生活圈名称
		        "impression_count" : '234',
		        "click_count" : '24',
		        "click_ratio" : '32%',
		        "impression_uu" : '2424',
		        "impression_uu_ratio" : '44%',
		        "click_uu_ratio" : '55%',
		        "cost" : '2434',
		        "request_count" : '1324'  // 请求量，仅仅管理端报告有此属性
		      },
		      {
			        "community_name" : '生活圈2', // 生活圈名称
			        "impression_count" : '234',
			        "click_count" : '24',
			        "click_ratio" : '32%',
			        "impression_uu" : '2424',
			        "impression_uu_ratio" : '44%',
			        "click_uu_ratio" : '55%',
			        "cost" : '2434',
			        "request_count" : '1324'  // 请求量，仅仅管理端报告有此属性
			      }
		    ]
		  }
		};
mockup.register('/report/ad/community_non_video',report_ad_community_non_video);

var report_ad_slot_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "slot_name" : '广告位1', // 广告位名称
		        "total_impression_count" : '233',
		        "video_impression_count" : '45',
		        "video_impression_uu" : '324',
		        "collapse_impression_count" : '243', // 最小化视频曝光次数
		        "valid_impression_count" : '4252', // 有效播放次数
		        "click_count" : '2534',
		        "click_uu" : '2456',
		        "avg_valid_impression_time" : '2442', // 有效收视平均时长
		        "cpc" : '14',
		        "click_ratio" : '24%',
		        "click_uu_ratio" : '23%',
		        "cost" : '675',
		        "request_count" : '244',  // 请求量，仅仅管理端报告有此属性
	            "impression_count" : '222'  // 展现次数
		      },
		      {
			        "slot_name" : '广告位2', // 广告位名称
			        "total_impression_count" : '233',
			        "video_impression_count" : '45',
			        "video_impression_uu" : '324',
			        "collapse_impression_count" : '243', // 最小化视频曝光次数
			        "valid_impression_count" : '4252', // 有效播放次数
			        "click_count" : '2534',
			        "click_uu" : '2456',
			        "avg_valid_impression_time" : '2442', // 有效收视平均时长
			        "cpc" : '14',
			        "click_ratio" : '24%',
			        "click_uu_ratio" : '23%',
			        "cost" : '675',
			        "request_count" : '244',  // 请求量，仅仅管理端报告有此属性
			        "impression_count" : '222'  // 展现次数
			      }
		    ]
		  }
		};
mockup.register('/report/ad/slot_video',report_ad_slot_video);

var report_ad_slot_non_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "slot_name" : ' 广告位3', //名称
		        "impression_count" : '35',
		        "click_count" : '56',
		        "click_ratio" : '4%',
		        "impression_uu" : '35',
		        "impression_uu_ratio" : '6%',
		        "click_uu_ratio" : '24%',
		        "cost" : '244',
		        "request_count" : '575'  // 请求量，仅仅管理端报告有此属性
		      },
		      {
			        "slot_name" : ' 广告位4', //名称
			        "impression_count" : '35',
			        "click_count" : '56',
			        "click_ratio" : '4%',
			        "impression_uu" : '35',
			        "impression_uu_ratio" : '6%',
			        "click_uu_ratio" : '24%',
			        "cost" : '244',
			        "request_count" : '575'  // 请求量，仅仅管理端报告有此属性
			      }
		    ]
		  }
		};
mockup.register('/report/ad/slot_non_video',report_ad_slot_non_video);

var report_ad_material_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "material_name" : '创意1', // 创意名称
		        "total_impression_count" : '3424',
		        "video_impression_count" : '2324',
		        "video_impression_uu" : '335',
		        "collapse_impression_count" : '12', // 最小化视频曝光次数
		        "valid_impression_count" : '42', // 有效播放次数
		        "click_count" : '41',
		        "click_uu" : '142',
		        "avg_valid_impression_time" : '1434', // 有效收视平均时长
		        "cpc" : '13443',
		        "click_ratio" : '34%',
		        "click_uu_ratio" : '23%',
		        "cost" : '25352',
		        "request_count" : '5252', // 请求量，仅仅管理端报告有此属性
		        "impression_count" : '2222'  // 展现次数
		      },
		      {
			        "material_name" : '创意2', // 创意名称
			        "total_impression_count" : '3424',
			        "video_impression_count" : '2324',
			        "video_impression_uu" : '335',
			        "collapse_impression_count" : '12', // 最小化视频曝光次数
			        "valid_impression_count" : '42', // 有效播放次数
			        "click_count" : '41',
			        "click_uu" : '142',
			        "avg_valid_impression_time" : '1434', // 有效收视平均时长
			        "cpc" : '13443',
			        "click_ratio" : '34%',
			        "click_uu_ratio" : '23%',
			        "cost" : '25352',
			        "request_count" : '5252', // 请求量，仅仅管理端报告有此属性
			        "impression_count" : '2222'  // 展现次数
			      }
		    ]
		  }
		};
mockup.register('/report/ad/material_video',report_ad_material_video);

var report_ad_material_non_video = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		      {
		        "material_name" : '创意3', // 创意名称
		        "impression_count" : '23',
		        "click_count" : '43',
		        "click_ratio" : '34',
		        "impression_uu" : '53',
		        "impression_uu_ratio" : '64%',
		        "click_uu_ratio" : '56%',
		        "cost" : '2535',
		        "request_count" : '666'  // 请求量，仅仅管理端报告有此属性
		      },
		      {
			        "material_name" : '创意4', // 创意名称
			        "impression_count" : '23',
			        "click_count" : '43',
			        "click_ratio" : '34',
			        "impression_uu" : '53',
			        "impression_uu_ratio" : '64%',
			        "click_uu_ratio" : '56%',
			        "cost" : '2535',
			        "request_count" : '666'  // 请求量，仅仅管理端报告有此属性
			      }
		    ]
		  }
		};
mockup.register('/report/ad/material_non_video',report_ad_material_non_video);

var report_ad_keywords = {
        "success" : "true",
        "message" : {},
        "page" : {
          "pageNo":1, 
          "pageSize":120, 
          "orderBy":"orderId", 
          "order":"desc", 
          "totalCount":4, 
          "result" : [
            {
              "keyword" : 'google',
              "impression_count" : '10000',
              "click_count" : '20000',
              "click_ratio" : '0.0333',
              "impression_uu" : '233',
              "click_uu" : 'click_uu',
              "click_uu_ratio" : '0.8323',
              "impression_uu_ratio" : '0.4323'
            },
            {
              "keyword" : '百度',
              "impression_count" : '10000',
              "click_count" : '20000',
              "click_ratio" : '0.3323',
              "impression_uu" : '434',
              "click_uu" : 'click_uu',
              "click_uu_ratio" : '0.3393',
              "impression_uu_ratio" : '0.3323'
            }
          ]
        }
      }
;
mockup.register('/report/ad/keywords',report_ad_keywords);
