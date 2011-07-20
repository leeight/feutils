/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * path:    mockup/slot.js
 * desc:    广告位模拟数据
 * author:  yuanhongliang
 * date:    $Date: 2011-06-28 14:30:13 +0800 (周二, 28 六月 2011) $
 */

var slotList = {
    "success":"true",
    "message":{},
    "page":{
        "pageNo":2, 
        "pageSize":30, 
        "orderBy":"", 
        "order":"desc", 
        "totalCount":544, 
        "result":[
            {
                "id":1,
                "slot_type" : 0,
                "slot_sub_type" : 2,
                "columbus_slot_id":1,
                "name":"slot1",
                "username":"zhangshan",
                "domain" : ["a.com1", "b.com"],
                "type":'0,1',
                "status":1,
                "communities" : [
                    {
                        'id' : 1,
                        'name' : '生活圈1'
                    },
                    {
                        'id' : 2,
                        'name' : '生活圈2'
                    }
                ],
                "max_impression_freq_uu_hour":["2", "3", "", "", "", "", "4", "6"],
                "max_impression_freq_uu_count":["7", "8", "", "", "", "", "9", "10"],
                "adowner_blacklist" : [
                   {
                       "id" : 1,
                       "username" : '广告主1'
                   },
                   {
                     "id" : 2,
                     "username" : '广告主2'
                   }
                ],
                "purchase_price": ["1500", "1600", "2600", "", "", "", "", "2600", "2600"],
                "sale_price": ["3500", "3600", "3600", "", "", "", "", "3600", "3600"]
            },
            {
                "id":2,
                "slot_type" : 1,
                "slot_sub_type" : 3,
                "columbus_slot_id":2,
                "name":"slot2",
                "username":"zhangshan",
                "domain" : ["aa2.com"],
                "type":'2',
                "status":2,
                "communities" : [
                    {
                        'id' : 3,
                        'name' : '生活圈3'
                    }
                ],
                "max_impression_freq_uu_hour":["2", "3", "", "", "", "", "4", "6"],
                "max_impression_freq_uu_count":["7", "8", "", "", "", "", "9", "10"],
                "adowner_blacklist" : [
                ],
                "purchase_price": ["1500", "1600", "2600", "", "", "", "", "2600", "2600"],
                "sale_price": ["3500", "3600", "3600", "", "", "", "", "3600", "3600"]
            }
        ]
     }
};
var slotItem = {
    "success" : "true",
    "message" : {},
    "result" : {
        "id" : 1,
        "slot_type" : 0,
        "slot_sub_type" : 2,
        "name" : 'slot1',
        "username" : 'zhangshan',
        "domain" : [
            "a.com", "b.com"
        ],
        "type" : '0,1,6,7',
        "status" : 1,
        "communities" : [
            {
                'id' : 1,
                'name' : '生活圈1'
            },
            {
                'id' : 2,
                'name' : '生活圈2'
            }
        ],
        "max_impression_freq_uu_hour":["2", "3", "", "", "", "", "4", "6"],
        "max_impression_freq_uu_count":["7", "8", "", "", "", "", "9", "10"],
        "adowner_blacklist" : [
            {
                "id" : 1,
                "username" : '广告主1'
            },
            {
                "id" : 2,
                "username" : '广告主2'
            }
        ],
        "purchase_price": ["1500", "1600", "2600", "", "", "", "", "2600", "2600"],
        "sale_price": ["3500", "3600", "3600", "", "", "", "", "3600", "3600"]
    }
};
var slotList2 = {
	    "success" : "true",
	    "message" : {},
	    "page" : {
	        "pageNo":1, 
	        "pageSize":15, 
	        "orderBy":"id", 
	        "order":"desc", 
	        "totalCount":491, 
	        "result":[
	                                                            {
	                            "id" : 10000870,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '123',
	                            "columbus_slot_id" : 1115377,
	                            "username" : '',
	                            "domain" : [
	                              ""
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                           ], 
	                            "max_impression_freq_uu_hour": 0,
	                            "max_impression_freq_uu_count":  0,
	                            "adowner_blacklist" : [
	                                                              ],
	                            "purchase_price" : '0.0000',
	                            "sale_price" : '1.0000'
	                        },                                            {
	                            "id" : 10000663,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : 'werwr',
	                            "columbus_slot_id" : 1115381,
	                            "username" : '',
	                            "domain" : [
	                              ""
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                           ], 
	                            "max_impression_freq_uu_hour": 0,
	                            "max_impression_freq_uu_count":  0,
	                            "adowner_blacklist" : [
	                                                              ],
	                            "purchase_price" : '0.0000',
	                            "sale_price" : '1.0000'
	                        },                                            {
	                            "id" : 10000657,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : 'sfsf',
	                            "columbus_slot_id" : 1115384,
	                            "username" : '',
	                            "domain" : [
	                              ""
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                           ], 
	                            "max_impression_freq_uu_hour": 0,
	                            "max_impression_freq_uu_count":  0,
	                            "adowner_blacklist" : [
	                                                              ],
	                            "purchase_price" : '0.0000',
	                            "sale_price" : '1.0000'
	                        },                                            {
	                            "id" : 10000620,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 927214067,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        },                                                                           {
	                                              "id":2128989972,
	                                              "username":'测试广告主屏蔽'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        },                                            {
	                            "id" : 10000617,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '111111',
	                            "columbus_slot_id" : 11111,
	                            "username" : '11',
	                            "domain" : [
	                              "111"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                           ], 
	                            "max_impression_freq_uu_hour": 0,
	                            "max_impression_freq_uu_count":  0,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":49,
	                                              "username":'1'
	                                        }                                                               ],
	                            "purchase_price" : '1.0000',
	                            "sale_price" : '1.0000'
	                        },                                            {
	                            "id" : 10000607,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 330496948,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        },                                            {
	                            "id" : 10000603,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 287928410,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        },                                            {
	                            "id" : 10000601,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 800763741,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        },                                            {
	                            "id" : 10000598,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 973383499,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        },                                            {
	                            "id" : 10000592,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 526941460,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        },                                            {
	                            "id" : 10000588,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 200731905,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        },                                            {
	                            "id" : 10000585,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 251887196,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        },                                            {
	                            "id" : 10000581,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 139426874,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        },                                            {
	                            "id" : 10000577,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 994920096,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        },                                            {
	                            "id" : 10000573,
	                            "slot_type" : 0,
	                            "slot_sub_type" : 0,
	                            "name" : '测试包断广告位',
	                            "columbus_slot_id" : 858016132,
	                            "username" : 'sakyo',
	                            "domain" : [
	                              "baidu.com"
	                            ],
	                            "type" : '3', 
	                            "status" : 3,
	                            "communities" : [
	                                                                     {
	                                          'id' : 54 ,
	                                          'name' : '一二三'
	                                      },                                                                      {
	                                          'id' : 639 ,
	                                          'name' : 'stellayang'
	                                      }                                                            ], 
	                            "max_impression_freq_uu_hour": 2,
	                            "max_impression_freq_uu_count":  11,
	                            "adowner_blacklist" : [
	                                                                          {
	                                              "id":1509378,
	                                              "username":'1212'
	                                        }                                                               ],
	                            "purchase_price" : '12.0000',
	                            "sale_price" : '212.0000'
	                        }                                            ]       
	    }
	};
mockup.register('/slot/list', slotList);
mockup.register('/slot/batch_update', batchResult);
mockup.register('/slot/create', formSuccess);
mockup.register('/slot/read', slotItem);
mockup.register('/slot/update', formSuccess);
