/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    dn/initConst.js
 * desc:    const变量初始化
 * author:  yuanhongliang
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

goog.require('dn');
goog.require('er.context');

goog.provide('dn.initConst');
goog.provide('dn.ConstMap');

/**
 * 常量map类，具有根据value查找key的功能
 * @param {Object} map 需要包装的原生对象.
 * @constructor
 */
dn.ConstMap = function(map) {
    for (var key in map) {
        this[key] = map[key];
    }
}

/**
 * 根据value反向查找对应的key.
 * @param {*} value 需要查找的value
 * @return {?*}
 */
dn.ConstMap.prototype.getKey = function(value) {
    for (var key in this) {
        if (this[key] === value) {
            return key;
        }
    }
    return null;
};

/**
 * const变量初始化
 *
 * @param {Object} constMap const变量集合.
 */
dn.initConst = function(constMap) {
    /*
     * 将const变量初始化为List与Map
     * 便于各种查询
     */
    var constItem,
        constList,
        name,
        key,
        saveList,
        saveMap,
        flag;

    dn.extendConstMap(constMap);

    for (name in constMap) {
        constList = constMap[name];
        saveList = [];
        flag = false;

        if ('region_info' === name) {
            // 处理对象
            constItem = constMap[name];
            for (key in constItem) {
                saveList.push({
                    text: constItem[key],
                    value: key
                });
            }
            flag = true;
        } else if ('region_xml_flash' === name) {
            // 处理无需转换的自定义常量regionXmlFlashMap
            constItem = constMap[name];
            name = name.replace(/_\w/g, function($0) {
                return $0.substr(1).toUpperCase();
            });
            er.context.set(name + 'Map', constItem);
        } else {
            // 处理数组
            constItem = {};
            baidu.array.each(constList, function(item) {
              saveList.push({
                'text' : item['l'],
                'value' : item['v']
              });

              constItem[item['v']] = item['l'];
            });
            flag = true;
        }

        if (true === flag) {
            saveMap = new dn.ConstMap(constItem);

            // 将name转换成camel形式
            name = name.replace(/_\w/g, function($0) {
                return $0.substr(1).toUpperCase();
            });
            er.context.set(name + 'Map', saveMap);
            er.context.set(name + 'List', saveList);
        }
    }
};

/**
 * 扩展产品类型的内容
 * @param {Object} constMap 常量数据.
 */
dn.extendConstMap = function(constMap) {
  /**
   * 设置地区
   */
  function setRegionInfo(constMaps) {
      var data = constMaps['region_info'];
      var provinces = data['province'],
          len = provinces.length, province,
          provinceValue, cityLen, citys,
          city, map = {},
          cityProvince = {};

      while (len--) {
          province = provinces[len];
          provinceValue = province['v'];
          citys = data[provinceValue];

      map[provinceValue] = province['l'];
      if (!citys) {
          continue;
      }
      cityLen = citys.length;

      while (cityLen--) {
          city = citys[cityLen];
          map[city['v']] = city['l'];
          cityProvince[city['v']] = provinceValue;
      }
    }

    data.map = map;
    data.cityProvince = cityProvince;
    constMaps['region_info'] = data;
  }

    // FIXME: Remove me
    constMap['adproduct_type'] = constMap['product_type'].slice(0);

    setRegionInfo(constMap);
};




