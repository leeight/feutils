/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    dn/isAllow.js
 * desc:    验证权限是否允许
 * author:  zhaolei,erik
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

/**
 * 验证权限是否允许
 *
 * @param {string} name 权限名，支持aaa.bbb与aaa_bbb.
 *
 * @return {boolean} true or false.
 */
dn.isAllow = function(name) {
    name = name.toUpperCase().replace(/\./g, '_');
    return er.permission.isAllow('DAN_' + name);
};
