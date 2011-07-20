/**
 * 
 */
var adList = {
    "success" : "true",
    "message" : {},
    "page" : {
        "pageNo" : 2,
        "pageSize" : 30,
        "orderBy" : "",
        "order" : "desc",
        "totalCount" : 502,
        "result" : [ {
            "id" : '1212',
            "name" : '广告asdf',
            "adowner_name" : '阿斯顿发',
            "order_id" : '232323',
            "type" : 2,
            "status" : '6', // 广告状态，枚举类型
            "orient_community" : '2', // 生活圈定向类型
            "orient_keywords" : '2', // 人群定向类型
            "max_daily_consume" : '200', //日消费限额
            "residue" : '100', //剩余消费
            "budget_threshold" : '3100', //预算
            "start_time" : '20091212092435',
            "end_time" : '20111212062646'

        }, {
            "id" : '1212',
            "name" : '广告asdf',
            "adowner_name" : '阿斯顿发',
            "order_id" : '232323',
            "type" : '5',
            "status" : '4', // 广告状态，枚举类型
            "orient_community" : '2', // 生活圈定向类型
            "orient_keywords" : '1', // 人群定向类型
            "max_daily_consume" : '200', //日消费限额
            "residue" : '100', //剩余消费
            "budget_threshold" : '3100', //预算
            "start_time" : '20091212054321',
            "end_time" : '20111212213211'

        }, {
            "id" : '1215',
            "name" : '广告asdf',
            "adowner_name" : '阿斯顿发',
            "order_id" : '232323',
            "type" : '5',
            "status" : '4', // 广告状态，枚举类型
            "orient_community" : '2', // 生活圈定向类型
            "orient_keywords" : '1', // 人群定向类型
            "max_daily_consume" : '200', //日消费限额
            "residue" : '100', //剩余消费
            "budget_threshold" : '3100', //预算
            "start_time" : '20091212054321',
            "end_time" : '20111212213211'

        }
        ]
    }
};
var batchResult = {
        "success" : "true",
        "message" : {}
    };
var adItem={
        "success" : "true",
        "message" : {},
        "result" : {
          "id": "12343",
          "type": 0,
          "name": "mockup-我是广告名称",
          "is_supplement": 1,
          "supplement_price" : '20', //补量产品价格
          "max_daily_consume" : '200', //日消费限额
          "residue" : '200', //剩余消费
          "status" : "1",
          "start_time": '20110328230000',
          "end_time": '20110529020000',
          "impression_threshold": "",
          "budget_threshold": "2333",
          "max_impression_per_day_uu": "12",
          "max_impression_per_cycle_uu": "33",
          "orient_hour": "301,305,501,502,509,524",
          "orient_location": ["1", "2", "3", "4", "5", "6", "7"],
          "orient_community": "1",
          /* "budget_role_ids": [],
            "budget_role_slot_ids":[],
        "budget_role_values": [],
         */
          "budget_role_ids": ["40", "86", "639"],
            "budget_role_slot_ids":[
                {"id":"40","value":["109","129","130"]},//id为生活圈ID，value为改生活圈下选择的广告位
                {"id":"86","value":["185","187"]},
                {"id":"639","value":["10000314"]}
            ],
          "budget_role_values": ["100", "200", "300"],
          
          "keywords": [],
          "materials": [
            {
              "id": "创意的ID",
              "type": "创意的类型",
              "src": "创意的资源地址",
              "target_url": "创意的点击链接地址",
              "target_window": "0原窗口，1新窗口",
              "collapse_type": "收缩状态物料类型 0Flash 1图片",
              "collapse_src": "资源的地址",
              "custom_player_url": "播放器外框",
              "html_code": "富媒体的HTML代码",
              "status": "创意的状态"
            }
          ],
          "order" : {
            // 订单行的详情
            "id" : '12',
            "name" : 'mockup-order-name',
            "contract_number" : '',
            "customer_manager" : '',
            "sale_assistant" : '',
            "channel_manager" : '',
            "agent" : '',
            "adowner_name" : '',
            "effect_time" : '20121220132313',
            "expire_time" : '',
            "import_time" : '',
            "money" : '',
            "discount" : ''
          }
        }
      }

mockup.register("/ad/list", adList);
mockup.register('/ad/batch_update', batchResult);
mockup.register('/ad/create', formSuccess);
mockup.register('/ad/read', adItem);
mockup.register('/ad/update', formSuccess);
