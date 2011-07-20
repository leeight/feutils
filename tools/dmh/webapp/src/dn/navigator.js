/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    dn/navigator.js
 * desc:    导航功能
 * author:  zhaolei,erik
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

/**
 * 导航功能
 */
dn.navigator = (function() {
    var domId = 'Nav',
        mainId = 'navMain',
        itemIdPrefix = 'navItem',
        subIdPrefix = 'navSub',
        subItemIdPrefix = 'navSubItem',
        container = [],
        currentIndex = -1,
        currentSubIndex = -1,
        itemHoverClass = 'nav-item-hover',
        selectedClass = 'nav-selected',
        subClass = 'nav-sub',
        mainClass = 'nav-main';

    var mainLiTpl = '<li class="{0}" onmouseover="{2}" onmouseout="{3}" onclick="{4}" id="{5}">{1}</li>',
        linkTpl = '<a class="{0}" href="{1}" hidefocus="true">{2}</a>';

    /**
     * 获取导航栏的html
     *
     * @private
     * @return {string} 导航栏的html.
     */
    function getHtml() {
        var mainHtml = [],
            subHtml = [],
            items, def,
            unit, itemsHtml, sub,
            i, len, j, len2, subLoc, subName,
            sepNum;

        for (i = 0, len = container.length; i < len; i++) {
            unit = container[i];
            items = unit.items;

            def = unit.defaultLocation || items[unit.defaultIndex].location;
            mainHtml.push(
                baidu.format(mainLiTpl,
                             '',
                             baidu.format(linkTpl,
                                          '',
                                          '#' + def,
                                          unit.name),
                             'dn.navigator.promptSub(' + i + ')',
                             'dn.navigator.resetSub()',
                             'dn.navigator.setSub(' + i + ')',
                             itemIdPrefix + i)
                             );

            itemsHtml = [];
            sepNum = 0;
            for (j = 0, len2 = items.length; j < len2; j++) {
                sub = items[j];
                subName = sub.name;
                subLoc = sub.location;

                if (subName == 'separator') {
                    if (sepNum > 0 && j < len2 - 1) {
                        itemsHtml.push('<li class="nav-separator">&nbsp;</li>');
                        sepNum = 0;
                    }
                } else if (subName) {
                    sepNum++;
                    itemsHtml.push(
                        baidu.format(
                            '<li class="{1}" id="{0}">{2}</li>',
                            (subItemIdPrefix + i + '-' + j),
                             '',
                             baidu.format(
                                linkTpl,
                                (subName.length > 4 ? 'nav-wide' : ''),
                                '#' + subLoc,
                                sub.name)
                        )
                    );
                }
            }

            subHtml.push(
                baidu.format(
                    '<ul class="{0}" id="{1}" onmouseover="{3}" onmouseout="{4}">{2}</ul>',
                    subClass,
                    subIdPrefix + i,
                    itemsHtml.join(''),
                    'dn.navigator.promptSub(' + i + ')',
                    'dn.navigator.resetSub()'));
        }

        return baidu.format(
                    '<ul class="{0}" id="{1}">{2}</ul>',
                    mainClass,
                    mainId,
                    mainHtml.join('')) + subHtml.join('');
    }

    /**
     * 获取sub对应的html元素
     *
     * @private
     * @param {number} index sub的序号.
     */
    function getSub(index) {
        return baidu.g(subIdPrefix + index);
    }

    /**
     * 获取item对应的html元素
     *
     * @private
     * @param {number} index sub的序号.
     */
    function getItem(index) {
        return baidu.g(itemIdPrefix + index);
    }

    var nav = {
        /**
         * 鼠标移上时预提示sub
         *
         * @private
         * @param {number} index sub的序号.
         */
        promptSub: function(index) {
            var current = getSub(currentIndex),
                promptSub = getSub(index),
                item = getItem(index);

            baidu.addClass(item, itemHoverClass);

            if (current) {
                baidu.hide(current);
            }

            if (promptSub) {
                baidu.show(promptSub);
            }
        },

        /**
         * 重置sub的显示
         *
         * @private
         */
        resetSub: function() {
            for (var i = 0, len = container.length; i < len; i++) {
                var sub = getSub(i),
                    item = getItem(i),

                    subDisplay = 'none',
                    itemClass = '';

                if (i == currentIndex) {
                    itemClass = selectedClass;
                    subDisplay = '';
                }

                item.className = itemClass;
                sub.style.display = subDisplay;
            }
        },

        /**
         * 设置当前显示的sub
         *
         * @private
         * @param {number} index sub的序号.
         */
        setSub: function(index) {
            currentIndex = index;
            nav.resetSub();
        },

        /**
         * 注册导航栏项
         *
         * @param {Object} classes 注册的导航栏大类项.
         */
        register: function(classes) {
            /**
             * 注册一项
             * @type {Object} item 一个主菜单，里面含有子菜单的信息
             */
            function registerItem(item) {
                item = baidu.object.clone(item);
                var subItems = item.items,
                    subItemLen = subItems.length,
                    defLocation = item.defaultLocation,
                    len,
                    loc,
                    subItem,
                    auth,
                    stay = false,
                    staySeparator = false;

                // 权限判断
                while (subItemLen--) {
                    subItem = subItems[subItemLen];
                    auth = subItem.auth;
                    loc = subItem.location;

                    if (!auth || dn.isAllow(auth)) {
                        if (subItem.name != 'separator') {
                            // 这个主菜单可以被显示
                            staySeparator = stay = true;
                        } else {
                            if (!staySeparator) {
                                subItems.splice(subItemLen, 1);
                            }
                            staySeparator = false;
                        }
                    } else {
                        // 没有权限显示这个子菜单
                        subItems.splice(subItemLen, 1);
                        if (defLocation instanceof Array) {
                            // 如果defLocation是数组，而且数组中含有
                            // 这个没有权限子菜单的URL，那么就需要从数组中
                            // 删除这个URL
                            len = defLocation.length;
                            while (len--) {
                                if (defLocation[len] == loc) {
                                    defLocation.splice(len, 1);
                                }
                            }
                        }
                    }
                }

                if (stay) {
                    container.push(item);
                    if (defLocation instanceof Array) {
                        // 因为item.defaultLocation可能是被删除的子菜单的
                        // URL，所以此时需要重新赋值一下
                        item.defaultLocation = defLocation[0];
                    }
                }
            }

            if (baidu.lang.isArray(classes)) {
                for (var i = 0, len = classes.length; i < len; i++) {
                    registerItem(classes[i]);
                }
            } else {
                registerItem(classes);
            }
        },

        /**
         * 绘制导航
         *
         */
        render: function() {
            var el = baidu.g(domId);
            el.innerHTML = getHtml();
        },

        /**
         * 重绘导航
         *
         */
        repaint: function() {
            var loc = er.locator.getLocation(),
                path = er.locator.getPath(),
                i, len, item, defLoc,
                j, len2, subs, subItemId, sub, subLoc, subName, subActive,
                k, len3, subordinate;

            for (i = 0, len = container.length; i < len; i++) {
                item = container[i];
                subs = item.items;
                defLoc = item.defaultLocation;

                if (defLoc && defLoc == loc) {
                    currentIndex = i;
                }

                for (j = 0, len2 = subs.length; j < len2; j++) {
                    subActive = false;
                    sub = subs[j];
                    subordinate = sub.sub;
                    subLoc = sub.location;
                    subName = sub.name;
                    subItemId = subItemIdPrefix + i + '-' + j;

                    if (sub.name == 'separator' || !subLoc || !subName) {
                        continue;
                    }

                    if (subLoc == loc || subLoc == path) {
                        currentIndex = i;
                        currentSubIndex = j;
                        subActive = true;
                    } else if (subordinate) {
                        for (k = 0, len3 = subordinate.length; k < len3; k++) {
                            if (subordinate[k] == loc || subordinate[k] == path) {
                                subActive = true;
                                currentIndex = i;
                                currentSubIndex = j;
                                break;
                            }
                        }
                    }

                    // 控制二级菜单的active状态
                    if (subActive) {
                        baidu.addClass(subItemId, selectedClass);
                    } else {
                        baidu.removeClass(subItemId, selectedClass);
                    }
                }
            }

            nav.resetSub();
            baidu.show(domId);
        }
    };

    return nav;
})();
