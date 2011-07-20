var adresourceList = {
	"success" : "true",
	"message" : {},
	"page" : {
		"pageNo" : 2,
		"pageSize" : 30,
		"orderBy" : "",
		"order" : "desc",
		"totalCount" : 502,
		"result" : [{
	        "id" : '1',
	        "name" : '预估任务-360buy通栏广告预估-2011.01.30',
	        "status" : '1',
	        "submit_date" : '20110228230000'
	      },
	      {
	          "id" : '2',
	          "name" : '预估任务-360buy通栏广告预估-2011.01.30',
	          "status" : '2',
	          "submit_date" : '20110228230000'
	      },
	      {
	          "id" : '3',
	          "name" : '预估任务-360buy通栏广告预估-2011.01.30',
	          "status" : '1',
	          "submit_date" : '20110228230000'
	      },
	      {
	          "id" : '4',
	          "name" : '预估任务-360buy通栏广告预估-2011.01.30',
	          "status" : '3',
	          "submit_date" : '20110228230000'
	      },
	      {
	          "id" : '5',
	          "name" : '预估任务-360buy通栏广告预估-2011.01.30',
	          "status" : '2',
	          "submit_date" : '20110228230000'
	      }
		]
	}
};

var adresourceItem={
        "success" : "true",
        "message" : {},
        "result" : {
          "id": "12343",
          "type": '0,3,5',
          "name": "我是广告名称", 
          "status" : "1",
          "start_time": '20110228230000',
          "end_time": '20110529020000',
          "max_impression_per_day_uu": "22",
          "max_impression_per_cycle_uu": "33",
          "orient_hour": "301,305,501,502,509,524",
          "orient_location": [ "1","2", "3", "4", "5", "6", "7"],
          "orient_community": "1",
          /*
          "budget_role_ids": ["1", "2", "3"],
			"budget_role_slot_ids":[
				{"id":"1","value":["1","3","7"]},//id为生活圈ID，value为改生活圈下选择的广告位
				{"id":"2","value":["2","4"]},
				{"id":"3","value":["1","5"]}
			],
          "budget_role_values": ["100", "200", "300"],
          */
          "keywords": ["IT", "白领", "XXX"],
          "keywordsNoexist":["ITNO", "白领NO", "XXXNO"],
          "result_page" : {//广告资源预估结果
              "pageNo":1, 
              "pageSize":120, 
              "orderBy":"orderId", 
              "order":"desc", 
              "totalCount":4, 
              "result" : [
                {                 
                  "name" : '匹配值',
                  "cookie" : '500000',//cookie值
                  "display" : '700000'//展现值
                },
                {                 
                    "name" : '可预定值',
                    "cookie" : '800000',//cookie值
                    "display" : '1000000'//展现值
                 }
              ]
            },
          "community_result_page" : {//分生活圈预估结果列表
              "pageNo":1, 
              "pageSize":120, 
              "orderBy":"orderId", 
              "order":"desc", 
              "totalCount":4, 
              "result" : [
                {                 
                  "name" : '生活圈1',
                  "match_cookie" : '500000',
                  "match_display" : '600000',
                  "available_cookie" : '700000',
                  "available_display" : '800000'
                },
                {                 
                    "name" : '生活圈2',
                    "match_cookie" : '500000',
                    "match_display" : '600000',
                    "available_cookie" : '700000',
                    "available_display" : '800000'
                  },
                  {                 
                      "name" : '生活圈3',
                      "match_cookie" : '500000',
                      "match_display" : '600000',
                      "available_cookie" : '700000',
                      "available_display" : '800000'
                   },
                   {                 
                        "name" : '生活圈4',
                        "match_cookie" : '500000',
                        "match_display" : '600000',
                        "available_cookie" : '700000',
                        "available_display" : '800000'
                   }
              ]
            },
          "site_result_page" : {//分网站预估结果
              "pageNo":1, 
              "pageSize":120, 
              "orderBy":"orderId", 
              "order":"desc", 
              "totalCount":4, 
              "result" : [
                {
                  "name" : '网站1',
                  "match_cookie" : '500000',
                  "match_display" : '600000',
                  "available_cookie" : '700000',
                  "available_display" : '800000'
                },
                {
                    "name" : '网站2',
                    "match_cookie" : '500000',
                    "match_display" : '600000',
                    "available_cookie" : '700000',
                    "available_display" : '800000'
                  },
                  {
                      "name" : '网站3',
                      "match_cookie" : '500000',
                      "match_display" : '600000',
                      "available_cookie" : '700000',
                      "available_display" : '800000'
                    },
                    {
                        "name" : '网站4',
                        "match_cookie" : '500000',
                        "match_display" : '600000',
                        "available_cookie" : '700000',
                        "available_display" : '800000'
                      },
                      {
                          "name" : '网站5',
                          "match_cookie" : '500000',
                          "match_display" : '600000',
                          "available_cookie" : '700000',
                          "available_display" : '800000'
                        }
              ]
            },
            "site_list":{
				"pageNo":1, 
				"pageSize":120, 
				"orderBy":"orderId", 
				"order":"desc", 
				"totalCount":4, 
				"result" : [
				            {
				            	"slotname":'百度知道内容页-通栏',
				            	"domain":['www.baidu.com/zhoujielun','tieba.baidu.com/jay'],
				            	"status":'2',
				            	"budget":'50'
				            }
				           ,
				           {
				        	   	"slotname":'百度知道内容页-通栏',
				            	"domain":['www.baidu.com/zhoujielun','tieba.baidu.com/jay'],
				            	"status":'2',
				            	"budget":'50'				        	   
				           }
				            ]
            },
            "community_list":{
            	"pageNo":1, 
				"pageSize":120, 
				"orderBy":"orderId", 
				"order":"desc", 
				"totalCount":4,
				"result":[
				          {
				        	  "name":"生活圈1",
				        	  "budget":"5000",
				        	  "slotlist":[
									{
										"slotname":'百度知道内容页-通栏',
										"domain":['www.baidu.com/zhoujielun','tieba.baidu.com/jay'],
										"status":'2'
									},
									{
										"slotname":'百度知道内容页-通栏',
										"domain":['www.baidu.com/zhoujielun','tieba.baidu.com/jay'],
										"status":'2'
									}
				        	              ]
				          },
				          {
				        	  "name":"生活圈1",
				        	  "budget":"5000",
				        	  "slotlist":[
									{
										"slotname":'百度知道内容页-通栏',
										"domain":['www.baidu.com/zhoujielun','tieba.baidu.com/jay'],
										"status":'2'
									},
									{
										"slotname":'百度知道内容页-通栏',
										"domain":['www.baidu.com/zhoujielun','tieba.baidu.com/jay'],
										"status":'2'
									}
				        	              ]
				          }
				          ]
            }

        }
      }

var adresourceQueryItem = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120000, 
		    "orderBy":"orderId", 
		    "order":"desc", 
		    "totalCount":1, 
		    "result" : [
		      {
		    	  "query" : '鲜花',
		    	  "status" : '0'
		      },
		      {
		    	  "query" : '牛粪',
		    	  "status" : '0'
		      },
		      {
		    	  "query" : '江山',
		    	  "status" : '0'
		      },
		      {
		    	  "query" : '美人',
		    	  "status" : '0'
		      }
		    ]
		  }
		}
 
	
mockup.register("/adresource/list", adresourceList);
mockup.register('/adresource/create', formSuccess);
mockup.register('/adresource/read', adresourceItem);
mockup.register('/adresource/query', adresourceQueryItem);