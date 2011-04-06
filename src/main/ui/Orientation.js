/*
 * cb-web
 * Copyright 2010 Baidu Inc. All rights reserved.
 *
 * path:    ui/Orientation.js
 * desc:    定位控件
 * author:  zhaolei,erik
 * date:    $Date$
 * dependent: Context, cb, ui.ComboBox, ui.Table
 */

/**
 * 定位控件 处理地域、时间、人群三种控件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.Orientation = function(options) {
    //this.initOptions(options);
    ui.Control.call(this, options);

    // 类型声明，用于生成控件子dom的id和class
    this.type = 'orient';
    this.form = 1;
    this.moduleTitle = {'weektime': '推广时段',
				    	'keywords': this.inputHeadTitle,
				    	'region': '推广地域'};

    this.entryText = this.entryText || '添加定位';
    if (!this.orientType) {
    	throw new Error('Please set orientType.');
    }
};

ui.Orientation.prototype = (function() {
    //id管理器
    var idMgr = {
    	//Orientation ctrl
    	selectorModules: 'selectorModules',
    	selectorRelative: 'selectorRelative',
    	btnOrientOK: 'btnOrientOK',
    	btnOrientCancel: 'btnOrientCancel',
    	//keywords:
    	orientInputKeywordsTxt: 'orientInputKeywordsTxt',
    	orientInputKeywordsErr: 'orientInputKeywordsErr',
    	orientInputKeywords: 'orientInputKeywords'

    };

    /**
     * 公共语言声明
     *
     * @private
     */
    var lang = {
        'add' : '添加',
        'added' : '已添加',
        'addAll' : '全部添加',
        'remove' : '删除',
        'removeAll' : '全部删除',
        'listSummary': '共&nbsp;{0}&nbsp;条'
    };

    var regionOpenedProvClass = 'ui-table-subentry-opened';

    /**
     * 输入类型选择模块的初始化器
     *
     * @private
     * @param {HTMLElement} main 初始化的dom元素.
     * @param {Object} control 控件对象.
     */
    function inputSelectorIniter(main, control) {
        var modName = this.name,
            modValue = control.viewValue[modName],
            inputIntroType = control.inputIntroType ? control.inputIntroType : modName;

        // 初始化视图的值
        if (!modValue) {
            control.viewValue[modName] = [];
        }

        // 填入html骨架
        main.innerHTML = baidu.format(
                            er.template.get('UIOrientSelectorInput'),
                            control.getStrRef() + ".selInputSelect(this,'" + modName + "')",
                            er.template.get('UIOrientSelectorInputIntro'
                                + inputIntroType.charAt(0).toUpperCase()
                                + inputIntroType.substr(1))
                                );
        //ui.util.get('formAd_orientRegion').selInputSelect(this,'keywords')  onblur works?
    }

    /**
     * 输入类型选择模块的刷新器
     *
     * @private
     * @param {HTMLElement} main 初始化的dom元素.
     * @param {Object} control 控件对象.
     */
    function inputSelectorRefresher(control) {
        var modName = this.name,
            value = control.viewValue[modName],
            input = baidu.g(idMgr.orientInputKeywordsTxt);

        input.value = value.join('\n');
    }

    /**
     *
     * @param {Object} dom
     * @param {Object} modName
     */
    var inputExtendToControl = {
        selInputSelect: function(dom, modName) {
            var value = dom.value.split(/\r?\n/),
                len = value.length;

            while (len--) {
                if (value[len].length == 0) {
                    value.splice(len, 1);
                }
            }

            this.viewValue[modName] = value;
        }
    };

    /**
     * 输入类型的参数串获取函数
     *
     * @private
     * @param {Array} value 选中的列表值.
     * @return {string}
     */
    function inputGetParamString(value) {
        var i, len = value.length,
            str = [];

        for (i = 0; i < len; i++) {
            if (value[i].length != 0) {
                str.push(encodeURIComponent(value[i].replace(/,|;|:|"|'/g,'')));
            }
        }

        return str.join(',');
    }

    /**
     * 输入类型的显示串获取函数
     *
     * @private
     * @param {Array} value 选中的列表值.
     * @return {string}
     */
    function inputGetValueString(value) {
        var i, len = value.length,
            html = [];

        for (i = 0; i < len; i++) {
            if (value[i].length != 0) {
                html.push(baidu.string.encodeHTML(value[i].replace(/,|;|:|"|'/g,'')));
            }
        }

        return html.join(', ');
    }

    /**
     * 选择器的功能模块列表
     *
     * @desc
     *      扩展属性extendToControl内的方法会扩展到控件上，所以this指针为控件对象.
     * @private
     */
    var selectorModuleMap = {
        /**
         * 地域选择功能
         */
        region: {
            relative: ['eq', 'ne'],
            getData: function() {
            	return er.context.get('regionInfoMap');
            },

            /**
             * 检测用户选择的值是否合法.
             * FIX BUG #856
             *
             * @private
             * @param {Object} value 控件的值.
             * @param {string} modName 模块的类型，例如region, resolution之类的.
             * @param {ui.Orientation} control 当前控件的实例.
             *
             * @return {boolean} true -> 合法，false -> 非法.
             */
            validate: function(value, modName, control) {
                return !baidu.object.isEmpty(value);
            },

            /**
             * 地域选择模块的初始化器
             *
             * @private
             * @param {HTMLElement} main 初始化的dom元素.
             * @param {Object} control 控件对象.
             */
            init: function(main, control) {
                var modName = this.name,
                    modValue = control.viewValue[modName],
                    leftId = control.getId('selectorLList' + modName),
                    rightId = control.getId('selectorRList' + modName),
                    data,len,i,
                    defaultAll = control.defaultValue == "all"? true:false;

                // 初始化视图的值
                if (!modValue) {
                    control.viewValue[modName] = {};                    
                    if(defaultAll){
	                    data = this.getData().province;
	                    len = data.length;
	
		                for (i = 0; i < len; i++) {
		                	control.selSelectProvince(data[i].v, modName, true);
		                }
	                
		                control.value[modName] = baidu.object.clone(control.viewValue[modName]);
                    }
	                
                }
                // 填入html骨架
                main.innerHTML = baidu.format(
                                    er.template.get('UIOrientSelectorRegion'),
                                    control.getId('selectorLRList' + modName),
                                    leftId,
                                    rightId);

                this.initRegionCityLayer(main, control);
                this.initRegionProvince(main, control);
                this.initRegionSelected(main, control);
            },

            refreshView: function(control) {
                var noexistClass = control.getClass('nima'),
                    modName = this.name;

                //ie很恶心，不解释
                baidu.dom.toggleClass(
                    control.getId('selectorLList' + modName),
                    noexistClass);

                baidu.dom.toggleClass(
                    control.getId('selectorRList' + modName),
                    noexistClass);
            },

            /**
             * 初始化选中的地域
             *
             * @private
             * @param {HTMLElement} main 初始化的dom元素.
             * @param {Object} control 控件对象.
             */
            initRegionSelected: function(main, control) {
                var modName = this.name,
                    id = control.getId('selectorRList' + modName),
                    rightEl = baidu.g(id),
                    rightHtml = [],
                    rightBody = document.createElement('div'),
                    rightFoot = document.createElement('div'),
                    spanClass = control.getClass('sel-listentry');

                // 右边选中信息表格html拼接
                rightHtml.push(
                    baidu.format(
                        er.template.get('UIOrientSelectorRegionRightHead'),
                        spanClass,
                        lang.removeAll,
                        control.getStrCall('selUnselectAllProvince', modName)),
                    '<div class="' + control.getClass('sel-regionrb')
                        + '" id="' + control.getId('selectorRListBody' + modName)
                        + '"></div>');


                // 初始化右侧列表
                rightBody.innerHTML = rightHtml.join('');
                rightEl.appendChild(rightBody);
                rightFoot.innerHTML = baidu.format(lang.listSummary, '0');
                rightFoot.className = control.getClass('sel-rfoot');
                rightEl.appendChild(rightFoot);
            },

            /**
             * 初始化城市浮动层
             *
             * @private
             * @param {HTMLElement} main 初始化的dom元素.
             * @param {Object} control 控件对象.
             */
            initRegionCityLayer: function(main, control) {
                var cityLayer = document.createElement('div'),
                    id = control.getId('SelectorCityLayer');

                cityLayer.id = id;
                cityLayer.className = control.getClass('sel-citylayer');
                cityLayer.style.left = '-10000px';

                cityLayer.onmouseover = function() {
                    this.style.left = this.getAttribute('left') + 'px';
                };

                cityLayer.onmouseout = function(e) {
                    e = e || window.event;
                    var tar = e.srcElement || e.target;

                    if (tar.id !== id) {
                        while (tar && tar.nodeType == 1) {
                            if (tar.id == id) {
                                return;
                            }
                            tar = tar.parentNode;
                        }
                    }

                    control.selCloseCityLayer();
                };

                main.appendChild(cityLayer);
                cityLayer = null;
            },

            /**
             * 初始化显示省份的列表
             *
             * @private
             * @param {HTMLElement} main 初始化的dom元素.
             * @param {Object} control 控件对象.
             */
            initRegionProvince: function(main, control) {
                var modName = this.name,
                    id = control.getId('selectorLList' + modName),
                    data = this.getData(),
                    provinces = data.province, i,
                    provinceLen = provinces.length,
                    province, provinceValue, provinceId,
                    provinceIdPrefix = control.getId('selectorLRList' + modName),

                    leftEl = baidu.g(id),
                    leftHtml = [],
                    leftBody = document.createElement('div'),
                    leftFoot = document.createElement('div'),

                    spanClass = control.getClass('sel-listentry'),
                    itemHtml = er.template.get('UIOrientSelectorRegionProvItem'),
                    callStr, tdId, tdIdPrefix = control.getId('selectorProvince');

                // 左边省信息表格html拼接
                leftHtml.push(
                    baidu.format(
                        er.template.get('UIOrientSelectorRegionLeftHead'),
                        spanClass,
                        lang.addAll,
                        control.getStrCall('selSelectAllProvince', modName)),
                    '<div class="' + control.getClass('sel-regionlb') + '"><table><tr>');

                for (i = 0; i < provinceLen; i++) {
                    if (i != 0 && i % 4 === 0) {
                        leftHtml.push('</tr><tr>');
                    }

                    province = provinces[i];
                    provinceValue = province.v;
                    provinceId = provinceIdPrefix + provinceValue;
                    callStr = control.getStrCall('selToggleSelectProvince', provinceValue, modName);

                    leftHtml.push(
                        baidu.format(
                            itemHtml,
                            provinceId,
                            callStr,
                            control.getStrRef()
                                + ".selOpenCityLayer('"
                                + modName + "','"
                                + provinceValue + "', this)",
                            control.getStrCall('selCloseCityLayer'),
                            province.l,
                            tdIdPrefix + provinceValue));
                }
                while (i % 4 != 0) {
                    leftHtml.push('<td>&nbsp;</td>');
                    i++;
                }
                leftHtml.push('</tr></table>');

                // 初始化左侧列表
                leftBody.innerHTML = leftHtml.join('');
                leftEl.appendChild(leftBody);
                //leftFoot.innerHTML = baidu.format(lang.listSummary, provinces.length);
                leftFoot.innerHTML = '&nbsp;';
                leftFoot.className = control.getClass('sel-lfoot');
                leftEl.appendChild(leftFoot);
            },

            /**
             * 地域选择模块的刷新器
             *
             * @private
             * @param {HTMLElement} main 初始化的dom元素.
             */
            refresh: function(control) {
                var modName = this.value,
                    data = this.getData(),
                    provinces = data.province, i,
                    provinceLen = provinces.length,
                    province, provinceValue, selectedProv,
                    selected = control.viewValue[modName],
                    leftActiveClass = control.getClass('sel-regioncol-active'),
                    idPrefix = control.getId('selectorLRList' + modName),
                    rightId = control.getId('selectorRListBody' + modName),
                    right = baidu.g(rightId),
                    rightHtml = [],
                    rightCount = 0,
                    rightClass,
                    rightItemTpl = er.template.get('UIOrientSelectorRegionRightItem'),
                    lvMap = data.map,
                    checkbox, citys, cityLen, j,
                    icon;

                // 重绘左侧列表的选中状态
                for (i = 0; i < provinceLen; i++) {
                    province = provinces[i];
                    provinceValue = province.v;
                    checkbox = baidu.g(idPrefix + provinceValue);
                    selectedProv = selected[provinceValue];

                    if (selectedProv
                        && (selectedProv.length > 0 || !data[provinceValue])
                    ) {
                        checkbox.checked = true;
                        baidu.addClass(checkbox.parentNode, leftActiveClass);
                    } else {
                        checkbox.checked = false;
                        baidu.removeClass(checkbox.parentNode, leftActiveClass);
                    }

                }

                // 重绘右侧选中列表
                for (i in selected) {
                    citys = selected[i];
                    cityLen = citys.length;
                    icon = '';
                    province = data[i];
                    rightClass = ' ui-orient-sel-province';

                    if (cityLen > 0 && province && cityLen < province.length) {
                        icon = '<div class="ui-table-subentry '
                                + regionOpenedProvClass + '"'
                                + '" onclick="'
                                + control.getStrRef()
                                + '.selToggleSelectedProvince(this)"></div>';

                        rightClass += ' ui-orient-sel-province-virtual';
                    }

                    rightHtml.push(
                        baidu.format(
                            rightItemTpl,
                            lvMap[i],
                            lang.remove,
                            control.getStrCall('selUnselectProvince', i, modName),
                            rightClass,
                            icon,
                            i
                        ));
                    rightCount++;

                    if (province && cityLen < province.length) {
                        rightCount--; // 不将未完全选中的省份计算在内
                        for (j = 0; j < cityLen; j++) {
                            rightHtml.push(
                                baidu.format(
                                    rightItemTpl,
                                    lvMap[citys[j]],
                                    lang.remove,
                                    control.getStrCall('selUnselectCity', citys[j], i, modName),
                                    ' ui-orient-sel-city-seled',
                                    '&nbsp;',
                                    i
                                ));
                            rightCount++;
                        }
                    }
                }

                right.innerHTML = rightHtml.join('');
                right.parentNode.nextSibling.innerHTML = baidu.format(lang.listSummary, rightCount);

                // 重绘浮动层
                var layer = baidu.g(control.getId('SelectorCityLayer')),
                    layerProvince = layer.getAttribute('province'),
                    layerSelMap = {}, checkboxs, cbsLen;

                if (layerProvince) {
                    citys = selected[layerProvince];
                    if (citys) {
                        cityLen = citys.length;
                        while (cityLen--) {
                            layerSelMap[citys[cityLen]] = 1;
                        }
                    }

                    checkboxs = layer.getElementsByTagName('input');
                    cbsLen = checkboxs.length;
                    while (cbsLen--) {
                        checkbox = checkboxs[cbsLen];
                        var matcher = checkbox.id.match(/(\d+)$/);
                        checkbox.checked = matcher && layerSelMap[matcher[1]];
                    }
                }
            },

            /**
             * 获取地域的显示串
             *
             * @private
             * @param {Object} value 选中的地域数据.
             * @return {string}
             */
            getValueString: function(value) {
                var data = this.getData(),
                    map = data.map,
                    len, i, key,
                    citys,
                    html = [],
                    allSelected = true,
                    prifix = '';

                for (key in value) {
                    citys = value[key];
                    if (citys) {
                        if (!data[key] || citys.length == data[key].length) {
                            html.push(map[key]);
                        } else {
                            len = citys.length;
                            allSelected = false;
                            for (i = 0; i < len; i++) {
                                html.push(map[citys[i]]);
                            }
                        }
                    }
                }
                
                if(allSelected && html.length == 36) prifix = '全国：';

                return prifix + html.join(', ');
            },

            /**
             * 获取地域的参数串
             *
             * @private
             * @param {Object} value 选中的地域数据.
             * @return {string}
             */
            getParamString: function(value) {
                var data = this.getData(),
                    map = data.map,
                    len, i, key,
                    citys,
                    html = [];

                for (key in value) {
                    citys = value[key];
                    if (citys) {
                        if (!data[key] || citys.length == data[key].length) {
                            html.push(key);
                        } else {
                            len = citys.length;
                            for (i = 0; i < len; i++) {
                                html.push(citys[i]);
                            }
                        }
                    }
                }

                return html.join(',');
            },

            extendToControl: {
                /**
                 * 展开选择的省所属市
                 *
                 * @private
                 * @param {Object} provinceDom 省的dom元素.
                 */
                selOpenSelectedProvince: function(provinceDom) {
                    baidu.addClass(provinceDom, regionOpenedProvClass);
                    provinceDom.setAttribute('isclose', '');
                    while (1) {
                        provinceDom = provinceDom.parentNode;
                        if (provinceDom.className == 'ui-table-row') {
                            break;
                        }
                    }

                    var dom = provinceDom.nextSibling,
                        province = provinceDom.getAttribute('province');

                    while (dom && dom.getAttribute('province') == province) {
                        dom.style.display = '';
                        dom = dom.nextSibling;
                    }
                },

                /**
                 * 关闭选择的省所属市
                 *
                 * @private
                 * @param {Object} provinceDom 省的dom元素.
                 */
                selCloseSelectedProvince: function(provinceDom) {
                    provinceDom.setAttribute('isclose', '1');
                    baidu.removeClass(provinceDom, regionOpenedProvClass);
                    while (1) {
                        provinceDom = provinceDom.parentNode;
                        if (provinceDom.className == 'ui-table-row') {
                            break;
                        }
                    }

                    var dom = provinceDom.nextSibling,
                        province = provinceDom.getAttribute('province');

                    while (dom && dom.getAttribute('province') == province) {
                        dom.style.display = 'none';
                        dom = dom.nextSibling;
                    }
                },

                /**
                 * 打开/关闭 选择的省所属市
                 *
                 * @private
                 * @param {Object} provinceDom 省的dom元素.
                 */
                selToggleSelectedProvince: function(provinceDom) {
                    if (provinceDom.getAttribute('isclose')) {
                        this.selOpenSelectedProvince(provinceDom);
                    } else {
                        this.selCloseSelectedProvince(provinceDom);
                    }
                },

                /**
                 * 全部选中所有的省
                 *
                 * @private
                 * @param {Object} modName 模块名.
                 */
                selSelectAllProvince: function(modName) {
                    var mod = this.getSelectorModule(modName),
                        data = mod.getData().province,
                        len = data.length, i;

                    for (i = 0; i < len; i++) {
                        this.selSelectProvince(data[i].v, modName, true);
                    }
                    mod.refresh(this);
                },

                /**
                 * 删除选中所有的省
                 *
                 * @private
                 * @param {Object} modName 模块名.
                 */
                selUnselectAllProvince: function(modName) {
                    var mod = this.getSelectorModule(modName);
                    this.viewValue[modName] = {};
                    mod.refresh(this);
                },

                /**
                 * 选择省份
                 *
                 * @private
                 * @param {Object} province 省份表识.
                 * @param {Object} modName 模块名.
                 * @param {Object} noRefresh 是否不刷新视图.
                 */
                selSelectProvince: function(province, modName, noRefresh) {
                    var mod = this.getSelectorModule(modName),
                        data = mod.getData()[province],
                        len = (data && data.length) || 0, i,
                        selected = this.viewValue[modName],
                        cityList;

                    if (!selected[i]) {
                        cityList = [];
                        for (i = 0; i < len; i++) {
                            cityList.push(data[i].v);
                        }
                        selected[province] = cityList;
                    }

                    if (!noRefresh) {
                        mod.refresh(this);
                    }
                },

                /**
                 * 取消选择省份
                 *
                 * @param {Object} province 省份表识.
                 * @param {Object} modName 模块名.
                 */
                selUnselectProvince: function(province, modName) {
                    var mod = this.getSelectorModule(modName),
                        selected = this.viewValue[modName];

                    if (selected && selected[province]) {
                        delete selected[province];
                        mod.refresh(this);
                    }
                },

                /**
                 * 选择/取消选择 省份
                 *
                 * @param {Object} province 省份表识.
                 * @param {Object} modName 模块名.
                 */
                selToggleSelectProvince: function(province, modName) {
                    var id = this.getId('selectorLRList' + modName) + province,
                        checked = baidu.g(id).checked;

                    if (checked) {
                        this.selSelectProvince(province, modName);
                    } else {
                        this.selUnselectProvince(province, modName);
                    }
                },

                /**
                 * 选择城市
                 *
                 * @private
                 * @param {Object} city
                 * @param {Object} province
                 * @param {Object} modName
                 */
                selSelectCity: function(city, province, modName) {
                    var mod = this.getSelectorModule(modName),
                        selected = this.viewValue[modName],
                        selectedProv;

                    selectedProv = selected[province];
                    if (!selectedProv) {
                        selectedProv = [];
                        selected[province] = selectedProv;
                    }

                    selectedProv.push(city);
                    mod.refresh(this);
                },

                /**
                 * 取消选择城市
                 *
                 * @private
                 * @param {Object} city
                 * @param {Object} province
                 * @param {Object} modName
                 */
                selUnselectCity: function(city, province, modName) {
                    var mod = this.getSelectorModule(modName),
                        selected = this.viewValue[modName],
                        citys = selected[province], citysLen;

                    if (citys) {
                        citysLen = citys.length;

                        while (citysLen--) {
                            if (citys[citysLen] == city) {
                                citys.splice(citysLen, 1);
                                if (citys.length == 0) {
                                    delete selected[province];
                                }
                                mod.refresh(this);
                                break;
                            }
                        }
                    }
                },

                /**
                 * 选择/取消选择 城市
                 *
                 * @private
                 * @param {Object} city
                 * @param {Object} province
                 * @param {Object} modName
                 */
                selToggleSelectCity: function(city, province, modName) {
                    var id = this.getId('selectorCity') + city,
                        checked = baidu.g(id).checked;

                    if (checked) {
                        this.selSelectCity(city, province, modName);
                    } else {
                        this.selUnselectCity(city, province, modName);
                    }
                },

                /**
                 * 显示城市选择浮动层
                 *
                 * @private
                 */
                selOpenCityLayer: function(modName, province, label) {
                    var mod = this.getSelectorModule(modName),
                        data = mod.getData()[province];

                    if (!data) {
                        return;
                    }

                    var len = data.length, i, value, item,
                        itemHtml = er.template.get('UIOrientSelectorRegionCityItem'),
                        html = [],
                        idPrefix = this.getId('selectorCity'),
                        layer = baidu.g(this.getId('SelectorCityLayer')),
                        left = label.offsetLeft
                                + Math.min(50, label.offsetWidth)
                                + label.parentNode.parentNode.offsetLeft,
                        selected = this.viewValue[modName], selLen,
                        selectMap = {};

                    if (selected) {
                        selected = selected[province];
                        if (selected) {
                            selLen = selected.length;
                            while (selLen--) {
                                selectMap[selected[selLen]] = 1;
                            }
                        }
                    }
                    layer.setAttribute('province', province);
                    layer.setAttribute('left', left);
                    for (i = 0; i < len; i++) {
                        item = data[i];
                        value = item.v;

                        html.push(
                            baidu.format(
                                itemHtml,
                                idPrefix + value,
                                this.getStrCall('selToggleSelectCity', value, province, modName),
                                item.l,
                                (selectMap[value] ? ' checked="checked"' : '')
                                ));
                    }

                    layer.innerHTML = html.join('');
                    layer.style.left = left + 'px';
                    layer.scrollTop = 0;
                },

                /**
                 * 隐藏城市选择浮动层
                 *
                 * @private
                 */
                selCloseCityLayer: function() {
                    baidu.g(this.getId('SelectorCityLayer')).style.left = '-10000px';
                }
            }
        },

        /**
         * 时间选择功能
         */
        weektime: {
            relative: ['eq'],

            /**
             * 检测用户选择的值是否合法.
             * FIX BUG #856
             *
             * @private
             * @param {Array.<*>} value 控件的值.
             * @param {string} modName 模块的类型，例如region, resolution之类的.
             * @param {ui.Orientation} control 当前控件的实例.
             *
             * @return {boolean} true -> 合法，false -> 非法.
             */
            validate: function(value, modName, control) {
                for (var i = 0; i < 7; i++) {
                    for (var j = 0; j < 24; j++) {
                        if (value[i][j] != 0) {
                            return true;
                        }
                    }
                }
                return false;
            },

            /**
             * 时间选择模块初始化器
             *
             * @private
             * @param {HTMLElement} main 初始化的dom元素.
             * @param {Object} control 控件对象.
             */
            init: function(main, control) {
                var idPrefix = 'SelectorDate',
                    modName = this.name,
                    modValue = control.viewValue[modName],
                    defaultValue = [],
                    lineValue, i, j, v,
                    defaultAll = control.defaultValue == "all"? true:false;
                
                // 初始化视图的值
                if (!modValue) {
                	v = defaultAll? 1:0;
                    for (i = 0; i < 7; i++) {
                        lineValue = [];
                        defaultValue.push(lineValue);

                        for (j = 0; j < 24; j++) {
                            lineValue.push(v);
                        }
                    }

                    control.viewValue[modName] = defaultValue;
                    if(defaultAll) control.value[modName] = baidu.object.clone(control.viewValue[modName]);
                }

                main.innerHTML = baidu.format(
                                    er.template.get('UIOrientSelectorWeektime'),
                                    control.getId('WeektimeBody'),
                                    control.getId('WeektimeCount'),
                                    control.getStrCall('selSelectAllTime', modName),
                                    control.getStrCall('selSelectWorkTime', modName),
                                    control.getStrCall('selSelectWeekendTime', modName));

                this.initWeektimeBody(control);
            },

            /**
             * 初始化weektime选择器主体视图
             *
             * @param {Object} control 控件对象.
             */
            initWeektimeBody: function(control) {
                var modName = this.name,
                    html = [er.template.get('UIOrientSelectorWtBodyHead')],
                    dayWords = ['一', '二', '三', '四', '五', '六', '日'],
                    ctrlRef = control.getStrRef(),
                    line, cbid,
                    i, j,
                    tplPrefix = 'UIOrientSelectorWt',
                    timeTpl = er.template.get(tplPrefix + 'Time'),
                    headTimeTpl = er.template.get(tplPrefix + 'HeadTime'),
                    lineBeginTpl = er.template.get(tplPrefix + 'LineBegin'),
                    lineMidTpl = er.template.get(tplPrefix + 'LineMid'),
                    lineEndTpl = er.template.get(tplPrefix + 'LineEnd');


                // 拼装html：头部time列表
                html.push('<div class="ui-orient-sel-wtbodyline" id="'
                              + control.getId('WeektimeHead') + '">'
                              + '<div class="ui-orient-sel-wtday">&nbsp;'
                              + lineMidTpl);
                for (j = 0; j < 24; j++) {
                    if (j > 0 && j % 6 == 0) {
                        html.push(lineMidTpl);
                    }
                    html.push(
                        baidu.format(
                            headTimeTpl,
                            control.getId('SelWTTimeHead' + j),
                            j,
                            ctrlRef + '.selTimeHeadOverOut(this,1)',
                            ctrlRef + '.selTimeHeadOverOut(this)',
                            ctrlRef + ".selSelectTimes('" + modName + "', this)"
                            ));
                }
                html.push(lineEndTpl);

                // 拼装html：时间体列表
                for (i = 0; i < 7; i++) {
                    cbid = control.getId('SelWTtimeDayCheckbox' + i);
                    html.push(
                        baidu.format(
                            lineBeginTpl,
                            control.getId('SelWTtimeDayLine' + i),
                            cbid,
                            i,
                            ctrlRef + '.selSelectTimeDay(\'' + modName + '\', this)',
                            '星期' + dayWords[i]
                        ),
                        lineMidTpl);

                    for (j = 0; j < 24; j++) {
                        if (j > 0 && j % 6 == 0) {
                            html.push(lineMidTpl);
                        }
                        html.push(
                            baidu.format(
                                timeTpl,
                                control.getId('SelWTtime-' + i + '-' + j),
                                i,
                                j,
                                ctrlRef + '.selTimeOverOut(this,1)',
                                ctrlRef + '.selTimeOverOut(this)',
                                ctrlRef + ".selWTtimeClick('" + modName + "', this)"
                            ));
                    }
                    html.push(lineEndTpl);
                }

                // html写入
                baidu.g(control.getId('WeektimeBody')).innerHTML = html.join('');

                // 挂载行移入移出事件
                function lineOver(e) {
                    baidu.addClass(this, control.getClass('sel-wtbodylinehover'));
                }

                function lineOut(e) {
                    baidu.removeClass(this, control.getClass('sel-wtbodylinehover'));
                }

                for (i = 0; i < 7; i++) {
                    line = baidu.g(control.getId('SelWTtimeDayLine' + i));
                    line.onmouseover = lineOver;
                    line.onmouseout = lineOut;
                }

                // 释放dom对象的引用
                line = null;
            },

            /**
             * 刷新weektime选择器的视图
             *
             * @private
             * @param {Object} control 控件对象.
             */
            refresh: function(control) {
                var modName = this.name,
                    value = control.viewValue[modName],
                    lineValue, lineActive, lineCb,
                    headStates = [],
                    activeHeadClass = control.getClass('sel-wttimehead-active'),
                    selectedClass = control.getClass('sel-wktimesel'),
                    head = baidu.g(control.getId('WeektimeHead')).getElementsByTagName('div'),
                    divs = baidu.g(control.getId('WeektimeBody')).getElementsByTagName('div'),
                    divLen = divs.length,
                    div,
                    divMatch,
                    headDiv,
                    i, j,
                    count = 0,
                    lineEl, lineDivs, wttime, time;

                // 初始化状态表
                for (i = 0; i < 24; i++) {
                    headStates.push(1);
                }

                // 遍历头部状态
                for (i = 0; i < 7; i++) {
                    lineEl = baidu.g(control.getId('SelWTtimeDayLine' + i));
                    lineDivs = lineEl.getElementsByTagName('div');
                    j = lineDivs.length;
                    while (j--) {
                        wttime = lineDivs[j];
                        if (control.selIsWTtime(wttime)) {
                            time = parseInt(wttime.getAttribute('time'), 10);
                            if (!value[i][time]) {
                                headStates[time] = 0;
                            }
                        }
                    }
                }

                // 刷新time头部状态
                j = head.length;
                while (j--) {
                    div = head[j];
                    divMatch = /SelWTTimeHead([0-9]+)$/.exec(div.id);
                    if (divMatch && divMatch.length == 2) {
                        if (headStates[parseInt(divMatch[1], 10)]) {
                            baidu.addClass(div, activeHeadClass);
                        } else {
                            baidu.removeClass(div, activeHeadClass);
                        }
                    }
                }

                // 刷新时间项状态
                while (divLen--) {
                    div = divs[divLen];
                    divMatch = /SelWTtime-([0-9]+)-([0-9]+)$/.exec(div.id);
                    if (divMatch && divMatch.length == 3) {
                        if (value[parseInt(divMatch[1], 10)][parseInt(divMatch[2], 10)]) {
                            baidu.addClass(div, selectedClass);
                        } else {
                            baidu.removeClass(div, selectedClass);
                        }
                    }
                }

                // 刷新checkbox状态
                for (i = 0; i < 7; i++) {
                    lineValue = value[i];
                    lineActive = true;

                    for (j = 0; j < 24; j++) {
                        if (!lineValue[j]) {
                            lineActive = false;
                        } else {
                            count++;
                        }
                    }

                    baidu.g(control.getId('SelWTtimeDayCheckbox' + i)).checked = lineActive;
                }


                // 刷新选中日期数状态
                baidu.g(control.getId('WeektimeCount')).innerHTML = count;
            },
            
            clearViewValue:function(control){
            	var modName = this.name;
                control.viewValue[modName] = [];
                for(var i = 0;i<7;i++){
                	control.viewValue[modName].push([]);
                }
            },

            /**
             * 获取时间的显示串
             *
             * @private
             * @param {Array} value 时间值.
             * @return {string}
             */
            getValueString: function(value) {
                var beginTime, prevTime,
                    html = [], lineHtml,
                    dayList = ['一', '二', '三', '四', '五', '六', '日'],
                    emptyDay, i, j,
                    sep = '<br>';

                function pushTime() {
                    if (baidu.lang.hasValue(beginTime)) {
                        if (beginTime == 0 && prevTime == 24) {
                            lineHtml.push('全天投放');
                        } else {
                            lineHtml.push(beginTime + ':00 -- ' + prevTime + ':00');
                        }
                    }

                    beginTime = null;
                    prevTime = null;
                }


                for (i = 0; i < 7; i++) {
                    lineHtml = [];
                    emptyDay = 1;

                    for (j = 0; j < 24; j++) {
                        if (value[i][j]) {
                            if (!baidu.lang.hasValue(beginTime)) {
                                beginTime = j;
                            }

                            prevTime = j + 1;
                            emptyDay = 0;
                        } else {
                            pushTime();
                        }
                    }

                    pushTime();
                    if (emptyDay) {
                        lineHtml.push('全天暂停');
                    }
                    html.push('星期' + dayList[i] + '：' + lineHtml.join(', '));
                }


                for (i = 0; i < 22; i++) {
                    sep += '&nbsp;';
                }
                return html.join(sep);
            },

            /**
             * 获取时间的参数串
             *
             * @private
             * @param {Array} value 时间值.
             * @return {string}
             */
            getParamString: function(value) {
                var beginTime, prevTime,
                    str = [],
                    i, j;

                function formatTime(time) {
                    time = String(time);
                    if (time.length > 1) {
                        return time;
                    }

                    return '0' + time;
                }

                function pushTime() {
                    if (baidu.lang.hasValue(beginTime)) {
                        str.push(i + formatTime(beginTime), i + formatTime(prevTime));
                    }
                    beginTime = null;
                    prevTime = null;
                }

                for (i = 1; i < 8; i++) {
                    for (j = 0; j < 24; j++) {
                        if (value[i - 1][j]) {
                            if (!baidu.lang.hasValue(beginTime)) {
                                beginTime = j;
                            }

                            prevTime = j + 1;
                        } else {
                            pushTime();
                        }
                    }

                    pushTime();
                }

                return str.join(',');
            },

            /**
             * 为控件扩展的方法表
             */
            extendToControl: {
                /**
                 * 选中时间
                 *
                 * @private
                 * @param {Object} modName 模块名.
                 * @param {Object} day 星期.
                 * @param {Object} time 时间.
                 * @param {Object} isSelected 是否选中.
                 * @param {Object} noRrefresh 是否不刷新视图.
                 */
                selSelectTime: function(modName, day, time, isSelected, noRrefresh) {
                    var value = this.viewValue[modName];
                    value[day][time] = (isSelected ? 1 : 0);

                    if (!noRrefresh) {
                        this.getSelectorModule(modName).refresh(this);
                    }
                },

                /**
                 * 根据时间选中时间区块
                 *
                 * @private
                 * @param {Object} modName 模块名.
                 * @param {Object} dom 时间区块的dom元素.
                 */
                selSelectTimes: function(modName, dom) {
                    var isSelected = (dom.className.indexOf(this.getClass('sel-wttimehead-active')) < 0),
                        time = parseInt(dom.getAttribute('time'), 10),
                        i, div;

                    for (i = 0; i < 7; i++) {
                        div = baidu.g(this.getId('SelWTtime-' + i + '-' + time));
                        this.selSelectTime(
                            modName,
                            parseInt(div.getAttribute('day'), 10),
                            time,
                            isSelected,
                            true);
                    }

                    this.getSelectorModule(modName).refresh(this);
                },

                /**
                 * 根据星期选中时间区块
                 *
                 * @private
                 * @param {Object} modName 模块名.
                 * @param {Object} dom 星期表单的dom元素.
                 */
                selSelectTimeDay: function(modName, dom, dontRefresh) {
                    var isSelected = dom.checked,
                        divs = dom.parentNode.parentNode.getElementsByTagName('div'),
                        len = divs.length, div;

                    while (len--) {
                        div = divs[len];
                        if (this.selIsWTtime(div)) {
                            this.selSelectTime(
                                modName,
                                parseInt(div.getAttribute('day'), 10),
                                parseInt(div.getAttribute('time'), 10),
                                isSelected,
                                true);
                        }
                    }

                    if (!dontRefresh) {
                        this.getSelectorModule(modName).refresh(this);
                    }
                },

                /**
                 * 选中所有时间
                 *
                 * @private
                 * @param {Object} modName 模块名.
                 */
                selSelectAllTime: function(modName, begin, end, checkbox) {
                    begin = 0;
                    end = 7;

                    for (; begin < end; begin++) {
                        checkbox = baidu.g(this.getId('SelWTtimeDayCheckbox' + begin));
                        checkbox.checked = true;
                        this.selSelectTimeDay(modName,
                                              checkbox,
                                              true);
                    }

                    this.getSelectorModule(modName).refresh(this);
                },

                /**
                 * 选中工作日的时间
                 *
                 * @private
                 * @param {Object} modName 模块名.
                 */
                selSelectWorkTime: function(modName) {
                    var begin,
                        end,
                        checkbox,
                        idPrefix = 'SelWTtimeDayCheckbox';


                    for (begin = 0, end = 5; begin < end; begin++) {
                        checkbox = baidu.g(this.getId('SelWTtimeDayCheckbox' + begin));
                        checkbox.checked = true;
                        this.selSelectTimeDay(modName,
                                              checkbox,
                                              true);
                    }

                    for (begin = 5, end = 7; begin < end; begin++) {
                        checkbox = baidu.g(this.getId('SelWTtimeDayCheckbox' + begin));
                        checkbox.checked = false;
                        this.selSelectTimeDay(modName,
                                              checkbox,
                                              true);
                    }

                    this.getSelectorModule(modName).refresh(this);
                },

                /**
                 * 选中周末的时间
                 *
                 * @private
                 * @param {Object} modName 模块名.
                 */
                selSelectWeekendTime: function(modName) {
                    var begin,
                        end,
                        checkbox,
                        idPrefix = 'SelWTtimeDayCheckbox';


                    for (begin = 0, end = 5; begin < end; begin++) {
                        checkbox = baidu.g(this.getId('SelWTtimeDayCheckbox' + begin));
                        checkbox.checked = false;
                        this.selSelectTimeDay(modName,
                                              checkbox,
                                              true);
                    }

                    for (begin = 5, end = 7; begin < end; begin++) {
                        checkbox = baidu.g(this.getId('SelWTtimeDayCheckbox' + begin));
                        checkbox.checked = true;
                        this.selSelectTimeDay(modName,
                                              checkbox,
                                              true);
                    }

                    this.getSelectorModule(modName).refresh(this);
                },

                /**
                 * 时间dom元素的点击行为
                 *
                 * @private
                 * @param {Object} modName 模块名.
                 * @param {Object} dom 时间dom元素.
                 */
                selWTtimeClick: function(modName, dom) {
                    var day = parseInt(dom.getAttribute('day'), 10),
                        time = parseInt(dom.getAttribute('time'), 10),
                        isSelected = true;

                    if (dom.className.indexOf(this.getClass('sel-wktimesel')) >= 0) {
                        isSelected = false;
                    }

                    this.selSelectTime(modName, day, time, isSelected);
                },

                /**
                 * 时间区块dom元素的鼠标移入移出行为处理
                 *
                 * @private
                 * @param {Object} dom 时间区块dom元素.
                 * @param {Object} isOver 是否移入行为.
                 */
                selTimeHeadOverOut: function(dom, isOver) {
                    var time = dom.getAttribute('time'),
                        divs = baidu.g(this.getId('WeektimeBody')).getElementsByTagName('div'),
                        len = divs.length,
                        wttime;

                    while (len--) {
                        wttime = divs[len];
                        if (this.selIsWTtime(wttime)
                            && wttime.getAttribute('time') == time) {
                            this.selTimeOverOut(wttime, isOver);
                        }
                    }
                },

                /**
                 * 判断dom元素是否时间元素
                 *
                 * @param {Object} dom
                 */
                selIsWTtime: function(dom) {
                    return !!dom.getAttribute('timeitem');
                },

                /**
                 * 时间dom元素的鼠标移入移出行为处理
                 *
                 * @private
                 * @param {Object} dom 时间dom元素.
                 * @param {Object} isOver 是否移入行为.
                 */
                selTimeOverOut: function(dom, isOver) {
                    var className = this.getClass('sel-wktimehover');
                    if (isOver) {
                        baidu.addClass(dom, className);
                    } else {
                        baidu.removeClass(dom, className);
                    }
                }
            }
        },


        /**
         * 被访url选择功能
         */
        keywords: {
            relative: ['eq', 'ne'],
            init: inputSelectorIniter,
            refresh: inputSelectorRefresher,
            extendToControl: inputExtendToControl,
            ignoreExtendExist: 1,
            getParamString: inputGetParamString,
            getValueString: inputGetValueString,
            validate: function(value, modName, control) {
                var i, len = value.length,
                    errEl = baidu.g(idMgr.orientInputKeywordsErr),
                    hasValue,
                    item, itemLen;

                for (i = 0; i < len; i++) {
                    item = value[i];
                    itemLen = item.length;

                    if (itemLen == 0) {
                        continue;
                    }

                    hasValue = true;
                    if (item.length > 100) {
                        errEl.innerHTML = '每行请勿超过100个字符';
                        return false;
                    }
                }

                if (!hasValue) {
                    errEl.innerHTML = '请至少输入一个值';
                    return false;
                }
            }
        }
    };

    /**
     * 是否打开结果区域
     * TBD：是否打开取决于是否有值
     */
    var resultPanel = {
    		OPEN:1,
    		CLOSE:2,
    		TBD:3
    }

    // 返回控件的prototype对象
    return {
        bindModel: function(model) {
            ui.Orientation.superClass.bindModel.call(this, model);
            this.initSelectorList();
        },


        /**
         * 绘制控件
         *
         * @public
         * @param {HTMLElement} main 控件的容器元素.
         */
        render: function(main) {
            var me = this;
            
            ui.Orientation.superClass.render.call(me, main);

            if (!me.isRender) {
                me.renderResultPanel();
                if(true === this.showEntryButton){
                	me.renderEntry();                	
                }
                
                me.renderSelector();
                me.isRender = true;
            }

            me.refreshResultPanel(resultPanel.TBD);
        },

        /**
         * 初始化选择器列表
         *
         * @private
         */
        initSelectorList: function() {
            var selectorList = [], selectorName, selectorModule, selector,
                list = [], item,
                i,
                key,
                extend = 'extendToControl', extendObj,
                modules = {
            		region: { l: '地域', v: 'region', i: 1},
                    weektime: { l: '时间', v: 'weektime', i: 0},
                    keywords: { l: '人群', v: 'keywords', i: 2}
               	};


            list.push(modules[this.orientType]);

            var len = list.length;

            this.relative = this.relative || {};

            for (i = 0; i < len; i++) {
                item = list[i];
                selectorName = item.v;
                selectorModule = selectorModuleMap[selectorName];

                if (!selectorModule) {
                    continue;
                }

                selector = {
                    'name': selectorName,
                    'value': selectorName,
                    'text': item.l,
                    'index': item.i
                };

                if (!this.relative[selectorName]) {
                    this.relative[selectorName] = selectorModule.relative[0];
                }

                // 模块扩展属性的方法
                extendObj = selectorModule[extend];
                if (extendObj) {
                    for (key in extendObj) {
                        if (this.hasOwnProperty(key)) {
                            if (selectorModule['ignoreExtendExist']) {
                                continue;
                            }

                            throw new Error('Method/Property ' + key + ' is Exist');
                        }
                        this[key] = extendObj[key];
                    }
                }

                for (key in selectorModule) {
                    if (key != extend) {
                        selector[key] = selectorModule[key];
                    }
                }

                selectorList.push(selector);
            }

            this.selectorList = selectorList;


            this.value = this.value || {};
            this.viewValue = {};
            for (key in this.value) {
                this.viewValue[key] = baidu.object.clone(this.value[key]);
            }
        },

        /**
         * 绘制入口按钮
         *
         * @private
         */
        renderEntry: function() {
            var me = this,
            	entryId = 'orientButtonEntry',
                div = document.createElement('div'),
                btn;

            div.className = me.getClass('entry');
            div.innerHTML = baidu.format(er.template.get('UIOrientButton'),
                                         me.entryText);

            me.main.appendChild(div);
            me.instChildrenFromMain();
            me.getChild(entryId).onclick = me.getEntryClickHandler();
        },

        /**
         * 获取进入按钮的点击事件handler
         *
         * @private
         * @return {Function}
         */
        getEntryClickHandler: function() {
            var me = this;
            return function() {
                me.toggleSelector();
            };
        },

        /**
         * 获取关闭选择器的handler
         *
         * @private
         * @return {Function}
         */
        getSelectorCloser: function() {
            var me = this;
            return function() {
                me.closeSelector();
                if(true !== this.showEntryButton){
                	me.bindResultData();
                	me.openResultPanel();
                }
            };
        },

        /**
         * 打开选择器
         *
         * @private
         * @param {string} mod 要打开的模块.
         */
        openSelector: function(mod) {
            var me = this,
                selectorId = this.getId('selector');
            baidu.show(selectorId);
            var modName = this.orientType;

            /*
            // 计算最近一个没设置的定位
            if (!mod) {
                //var modName = me.controlMap.selectorModules.getValue(),
            	var modName = me.getChild(idMgr.selectorModules).getValue(),
                    selectorList = me.selectorList,
                    len = selectorList.length,
                    value = me.value,
                    selector,
                    i,
                    key,
                    item;

                for (i = 0; i < len; i++) {
                    selector = selectorList[i];
                    key = selector.name;
                    item = value[key];

                    if (!item) {
                        modName = key;
                        break;
                    }
                }

                me.alterSelectorModule(modName);
            }
            */

            mod = mod || me.getSelectorModule(modName);
            mod.refresh(me);
            baidu.dom.toggleClass(selectorId, me.getClass('noexist'));
        },

        /**
         * 关闭选择器
         *
         * @private
         */
        closeSelector: function() {
             baidu.hide(this.getId('selector'));
        },

        /**
         * 打开/关闭选择器
         *
         * @private
         */
        toggleSelector: function() {
            var isShow = (baidu.g(this.getId('selector')).style.display != 'none');
            if (isShow) {
                this.closeSelector();
            } else {
                this.openSelector();
            }
        },
        
        /**
         * 显示ResultPanel
         */
        openResultPanel: function() {
            var me = this;
            baidu.g(me.getId('result')).style.display = '';
	    },

        /**
         * 绘制结果显示台
         *
         * @private
         */
        renderResultPanel: function() {
            var me = this,
                div = document.createElement('div');

            div.id = me.getId('result');
            div.className = me.getClass('result');
            div.style.display = 'none';

            me.main.appendChild(div);
        },

        /**
         * 绘制定位选择器
         *
         * @private
         */
        renderSelector: function() {
            var me = this,
                div = document.createElement('div'),
                selCtrlMap, key;

            div.id = me.getId('selector');
            div.className = me.getClass('selector');
            var headTitle = me.moduleTitle[this.orientType];
            div.innerHTML = baidu.format(er.template.get('UIOrientSelector'),
                                         me.getId('selectorHead'),
                                         me.getClass('selector-head'),
                                         me.getId('selectorBody'),
                                         me.getClass('selector-body'),
                                         me.getClass('selector-foot'),
                                         me.getClass('tip'),
                                         me.getId('tip'),
                                         headTitle
            							 );

            me.main.appendChild(div);
            me.initSelectorModules();
            
            me.instChildrenFromMain();

            me.getChild(idMgr.btnOrientOK).onclick = me.getSelectorDone();
            me.getChild(idMgr.btnOrientCancel).onclick = me.getSelectorCloser();

            me.alterSelectorModule(me.selectorList[0].value);
            me.closeSelector();
        },

        /**
         * 获取完成选择的动作处理
         *
         * @private
         * @return {Function}
         */
        getSelectorDone: function() {
            var me = this;
            return function() {
                var modName = me.orientType,//me.getChild(idMgr.selectorModules).getValue(),
                    mod = me.getSelectorModule(modName);

                if (
                    (!mod.validate || mod.validate(me.viewValue[modName], modName, me) !== false)
                    && me.onselect({name: modName, value: me.viewValue[modName]}) !== false
                ) {
                    me.value[modName] = baidu.object.clone(me.viewValue[modName]);
                    me.closeSelector();
                    me.refreshResultPanel(resultPanel.OPEN);
                }
            };
        },

        onselect: new Function(),
        
        bindResultData: function(){
        	var panel = baidu.g(this.getId('result')),
	            selectorList = this.selectorList, selector,
	            len = selectorList.length, i,
	            value = this.value,
	            relative = this.relative,
	            tpl = er.template.get('UIOrientResultItem'),
	            tplNull = er.template.get('UIOrientResultNullItem'),
	            html = [],
	            hasValue = false,
	            key, item,
	            relativeMap = {'eq': '=', 'ne': '≠'},
	            me = this;
	
	
	        for (i = 0; i < len; i++) {
	            selector = selectorList[i];
	            key = selector.name;
	            item = value[key];
	
	            if (item && item.length!=0) {
	                hasValue = true;
	                html.push(
	                    baidu.format(
	                        tpl,
	                        me.resultTextTitle?me.resultTextTitle:selector.text,
	                        relativeMap[relative[key]],
	                        selector.getValueString(item),
	                        this.getStrCall('alterSelectorModule', key),
	                        this.getStrCall('deleteValue', key),
	                        this.getId('ItemModify'),
	                        this.getId('ItemDelete')
	                    ));
	            }
	        }
	
	        if(0 === html.length){
	        	html.push(
	                    baidu.format(
	                        tplNull,
	                        me.resultTextTitle,
	                        this.getStrCall('alterSelectorModule', key),
	                        this.getStrCall('deleteValue', key),
	                        this.getId('NoneItemModify'),
	                        this.getId('NoneItemDelete')
	                    ));
	        }
	        
	        panel.innerHTML = html.join('');
	        
	        return hasValue;
        },

        /**
         * 刷新结果面板的视图
         * @note 新增的两个参数opt_panel和opt_tpl是在delivery.model.js里面使用的
         * @param flag true:根据hasValue判断是否显示结果区
         *
         * @private
         */
        refreshResultPanel: function(openFlag) {
            var panel = baidu.g(this.getId('result')),
            	hasValue = this.bindResultData();
            switch(openFlag){
	            case resultPanel.OPEN:
	            	panel.style.display = '';
	            	break;
	            case resultPanel.CLOSE:
	            	panel.style.display = 'none';
	            	break;
	            case resultPanel.TBD:
	            	panel.style.display = (hasValue ? '' : 'none');
	            	break;            	
            }
            
            
            if(!hasValue){
            	this.openSelector();
            }
            
        },

        deleteValue: function(modName) {
            delete this.value[modName];
            
            this.bindResultData();
            //this.closeSelector();
            var mod = this.getSelectorModule(modName);
            if(mod.clearViewValue){
            	mod.clearViewValue(this);
            }
            else{
                this.viewValue[modName] = [];
            }
            mod.refresh(this);
        },

        /**
         * 初始化选择器模块
         *
         * @private
         * @param {Object} mod
         */
        initSelectorModule: function(mod) {
            var me = this,
                id = me.getId('selectorModule') + mod.value,
                div = document.createElement('div'),
                className = me.getClass('selector-module'),
                body = baidu.g(me.getId('selectorBody'));

            div.id = id;
            div.className = className;
            body.appendChild(div);
            mod.init(div, me);
            if('all' === me.defaultValue){
            	me.closeSelector();
                me.refreshResultPanel(resultPanel.OPEN);
            }
        },

        /**
         * 初始化选择器的模块
         *
         * @private
         */
        initSelectorModules: function() {
            var me = this,
                modules = me.selectorList,
                len = modules.length, i, mod,
                methods = [],
                head = baidu.g(me.getId('selectorHead')),
                body = baidu.g(me.getId('selectorBody'));

            for (i = 0; i < len; i++) {
                mod = modules[i];

                methods.push({
                    text: mod.text,
                    value: mod.value
                });

                me.initSelectorModule(mod);
            }

            /*隐藏2个选择框，当需求要求合并定向控件时恢复之
            var modulesCombobox = ui.util.create('ComboBox', {
                id: idMgr.selectorModules,
                width: 120,
                datasource: methods
            }),
            relativeCombobox = ui.util.create('ComboBox', {
                id: idMgr.selectorRelative,
                width: 120,
                datasource: [
                    {
                        'text': '等于',
                        'value': 'eq'
                    },
                    {
                        'text': '不等于',
                        'value': 'ne'
                    }
                ]
            });


            modulesCombobox.onselect = me.getAlterSelectorModuleHandler();
            relativeCombobox.onselect = me.getRelativeSelectHandler();
            modulesCombobox.appendTo(head);
            relativeCombobox.appendTo(head);

            me.addChild(modulesCombobox);
            me.addChild(relativeCombobox);
            */

            body.style.height = '';
        },

        /**
         * 获取relative选中的处理函数
         *
         * @private
         * @return {Function}
         */
        getRelativeSelectHandler: function() {
            var me = this;
            return function(value) {
                var modName = me.orientType;//me.getChild(idMgr.selectorModules).getValue();
                me.setRelative(modName, value);
            };
        },

        /**
         * 设置关系信息
         *
         * @private
         * @param {Object} modName 模块名.
         * @param {Object} value 关系值.
         */
        setRelative: function(modName, value) {
            this.relative[modName] = value;
        },

        /**
         * 获取切换选择模块的处理器
         *
         * @private
         */
        getAlterSelectorModuleHandler: function() {
            var me = this;
            return function(value) {
                me.alterSelectorModule(value);
            };
        },

        /**
         * 切换选择模块
         *
         * @private
         * @param {string} value 模块名.
         */
        alterSelectorModule: function(value) {
            var me = this,
                mod = me.getSelectorModule(value),
                body = baidu.g(me.getId('selectorBody')),
                id = me.getId('selectorModule') + value,
                el = body.firstChild;
            //relative = me.getChild(idMgr.selectorRelative)

            //me.getChild(idMgr.selectorModules).setValue(value);

            /*
            while (el) {
                if (el.id === id) {
                    baidu.show(el);
                    if (mod.relative.length <= 1) {
                        baidu.hide(relative.main);
                    } else {
                        baidu.show(relative.main);
                    }
                    relative.setValue(me.relative[mod.name]);
                } else {
                    baidu.hide(el);
                }
                baidu.dom.toggleClass(el, this.getClass('noexist'));
                el = el.nextSibling;
            }
            */
            baidu.show(this.getId('selector'));
            baidu.dom.toggleClass(body, me.getClass('noexist'));
            mod.refresh(this);

            setTimeout(function() {
                    me.refreshView();
                }, 0);

        },

        refreshView: function() {
            var me = this,
                noexistClass = me.getClass('noexist'),
                selectorList = me.selectorList,
                len = selectorList.length,
                value = me.value,
                i,
                selector;

            for (i = 0; i < len; i++) {
                selector = selectorList[i];
                (typeof selector.refreshView == 'function') && selector.refreshView(me);
            }

            baidu.dom.toggleClass(me.getChild(idMgr.btnOrientOK).main, noexistClass);
            baidu.dom.toggleClass(me.getChild(idMgr.btnOrientCancel).main, noexistClass);
        },

        /**
         * 获取选择模块
         *
         * @protected
         * @param {Object} name 选择模块的名称.
         */
        getSelectorModule: function(name) {
            var list = this.selectorList,
                len = list.length,
                mod;

            while (len--) {
                mod = list[len];
                if (mod.value === name) {
                    return mod;
                }
            }

            return null;
        },

        showTip: function(tip) {
            var tipEl = baidu.g(this.getId('tip'));
            tipEl.innerHTML = tip;
            tipEl.style.display = '';
            setTimeout(function() {
                tipEl.style.display = 'none';
                tipEl = null;
            }, 3000);
        },

        /**
         * 释放控件
         *
         * @protected
         */
        dispose: function() {
            var me = this,
            	entryId = 'orientButtonEntry',
                modules = me.selectorList,
                len = modules.length, mod;

            // dispose选择器模块
            while (len--) {
                mod = modules[len];
                if ('function' == typeof mod.dispose) {
                    mod.dispose(me);
                }
                modules.splice(len, 1);
            }
            me.selectorList = null;

            // dispose控件本身特殊需要释放的东西
            if(me.c(entryId)){
            	me.c(entryId).onclick = null;
            }

            // base dispose
            //ui.Base.dispose.call(this);
            ui.Orientation.superClass.dispose.call(me);
        },

        getValue: function() {
            return this.value;
        },

        /**
         * 获取参数字符串
         *
         * @public
         * @return {string}
         */
        getParamString: function() {
            var list = this.selectorList,
                len = list.length, i, selector, name,
                value = this.value,
                relative = this.relative, relativeValue,
                relativeMap = {'eq': 0, 'ne': 1},
                paramStr = [],
                prefix, paramIndex = 0,
                key;

            for (i = 0; i < len; i++) {
                selector = list[i];
                name = selector.name;

                if (value[name]) {
                    relativeValue = relativeMap[relative[name]];

                    prefix = 'locateInfos[' + paramIndex + '].';
                    paramIndex++;

                    paramStr.push(
                        prefix + 'orientId=' + selector.index,
                        prefix + 'orientOp=' + relativeValue,
                        prefix + 'orientValue=' + (selector.getParamString(value[name]) || ''),
                        prefix + 'orientEName=' + name);

                }
            }

            return paramStr.join('&');
        },

        /**
         * 获取orientValue
         */
        getOrientValue: function() {
        	var selector = this.selectorList[0],
        		name = selector.name,
	            value = this.value,
	            rtn = [];

        	/*
        	if('weektime' == name.toLowerCase()){
        		if(value[name]){
        			baidu.array.each(value[name],function(item,i){
        				rtn = rtn.concat(item);
        			});
        			return rtn.join('');
        		}
        		else{
        			return '';
        		}
        	}
        	*/

        	if (!value[name]) return '';

	        return (selector.getParamString(value[name]) || '');
        }
    };
})();

//ui.Base.derive(ui.Orientation);
baidu.inherits(ui.Orientation, ui.Control);

