/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * path:    mockup/community.js
 * desc:    生活圈模拟数据
 * author:  yuanhongliang
 * date:    $Date: 2011-03-08 12:00:43 +0800 (周二, 08 三月 2011) $
 */

var communities = {
    "success" : "true",
    "message" : {},
    "page" : {
        "pageNo":1, 
        "pageSize":120, 
        "orderBy":"", 
        "order":"desc", 
        "totalCount":4, 
        "result" : [
            {
              "id": 1,
              "name": "生活圈1",
              "status" : 1,
              "sale_price" : {
                "1" : 1000,
                "2" : 2000,
                "3" : 3000,
                "4" : 4000,
                "5" : 5000,
                "6" : 6000
              }
            },
            {
                "id": 2,
                "name": "生活圈2",
                "status" : 1,
                "sale_price" : {
                  "1" : 1000,
                  "2" : 2000,
                  "3" : 3000,
                  "4" : 4000,
                  "5" : 5000,
                  "6" : 6000
                }
            },
            {
                "id": 3,
                "name": "生活圈3",
                "status" : 1,
                "sale_price" : {
                  "1" : 1000,
                  "2" : 2000,
                  "3" : 3000,
                  "4" : 4000,
                  "5" : 5000,
                  "6" : 6000
                }
            },
            {
                "id": 4,
                "name": "生活圈4",
                "status" : 2,
                "sale_price" : {
                  "1" : 1000,
                  "2" : 2000,
                  "3" : 3000,
                  "4" : 4000,
                  "5" : 5000,
                  "6" : 6000
                }
            }
        ]
    }
};
mockup.register('/community/list', communities);

var community_create_success = {
  "success" : "true",
  "message" : {}
};

var community_create_failure = {
  "success" : "false",
  "message" : {
    "field" : {
      "name" : "名称的人品不好",
      // FIXME
      "sale_price[1]" : '错误信息不好显示了...',
      "sale_price[2]" : '错误信息不好显示了...',
      "sale_price[3]" : '错误信息不好显示了...',
      "sale_price[4]" : '错误信息不好显示了...',
      "sale_price[5]" : '错误信息不好显示了...'
    }
  }
};
mockup.register('/community/create', community_create_failure);

var community_batch_update_success = {
  "success" : "true",
  "message" : {}
};
mockup.register('/community/batch_update', community_batch_update_success);

var community_read_success = {
  "success" : "true",
  "message" : {},
  "result" : {
    "id" : "123",
    "name" : "i'm mockup",
    "sale_price" : {
      "1" : "1000",
      "2" : "2000",
      "3" : "3999",
      "4" : "4900",
      "5" : "5000",
      "6" : "6000"
    }
  }
}
mockup.register('/community/read', community_read_success);

var slotList = {
		  "success" : "true",
		  "message" : {},
		  "page" : {
		    "pageNo":1, 
		    "pageSize":120, 
		    "orderBy":"", 
		    "order":"desc", 
		    "totalCount":4, 
		    "result" : [
		        {
		          "id":"1",
		          "name":"生活圈1",
		          "status":"",
		          "slotlist":[
		            // 生活圈下广告位列表
		            {
		              "id":"1",
		              "name":'百度知道内容页-通栏',
		              "domain":[
		                'www.baidu.com/zhoujielun',
		                'tieba.baidu.com'
		              ],
		              "status":'2'
		            },
		            {
		              "id":"2",
		              "name":'百度知道内容页-通栏',
		              "domain":[
		                'www.baidu.com/zhoujielun',
		                'tieba.baidu.com'
		              ],
		              "status":'2'
		            }
		          ]
		        },
		        {
		        	  "id":"2",
			          "name":"生活圈2",
			          "status":"",
			          "slotlist":[
			            // 生活圈下广告位列表
			            {
			              "id":"3",
			              "name":'百度知道内容页-通栏',
			              "domain":[
			                'www.baidu.com/zhoujielun',
			                'tieba.baidu.com'
			              ],
			              "status":'2'
			            },
			            {
			              "id":"4",
			              "name":'百度知道内容页-通栏',
			              "domain":[
			                'www.baidu.com/zhoujielun',
			                'tieba.baidu.com'
			              ],
			              "status":'2'
			            }
			          ]
			        },
			        {
			        	  "id":"3",
				          "name":"生活圈3",
				          "status":"",
				          "slotlist":[
				            // 生活圈下广告位列表
				            {
				              "id":"5",
				              "name":'百度知道内容页-通栏',
				              "domain":[
				                'www.baidu.com/zhoujielun',
				                'tieba.baidu.com'
				              ],
				              "status":'2'
				            },
				            {
				              "id":"6",
				              "name":'百度知道内容页-通栏',
				              "domain":[
				                'www.baidu.com/zhoujielun',
				                'tieba.baidu.com'
				              ],
				              "status":'2'
				            }
				          ]
				        },
				        {
				        	  "id":"4",
					          "name":"生活圈4",
					          "status":"",
					          "slotlist":[
					            // 生活圈下广告位列表
					            {
					              "id":"7",
					              "name":'百度知道内容页-通栏',
					              "domain":[
					                'www.baidu.com/zhoujielun',
					                'tieba.baidu.com'
					              ],
					              "status":'2'
					            },
					            {
					              "id":"8",
					              "name":'百度知道内容页-通栏',
					              "domain":[
					                'www.baidu.com/zhoujielun',
					                'tieba.baidu.com'
					              ],
					              "status":'2'
					            }
					          ]
					        }
		      ]
		  }
		}
mockup.register('/community/slotlist', slotList);