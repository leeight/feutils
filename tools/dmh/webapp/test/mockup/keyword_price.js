/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * desc:    人群设定模拟数据
 * author:  刘磊
 */

var keywordPriceList = {
    "success" : "true",
    "message" : {},
    "page" : {
        "result" : [ {
            "price" : {
                "0" : 1000,
                "1" : 2000,
                "2" : 3000,
                "3" : 4000,
                "4" : 5000,
                "5" : 6000,
                "6" : 7000,
                "7" : 8000,
                "8" : 9000
            }
        } ]
    }
};
mockup.register('/keyword_price/read', keywordPriceList);