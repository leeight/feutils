goog.require('dn');
goog.require('Requester');

goog.provide('dn.util');

/**
 * 常用的工具函数集合.
 */
dn.util = {

    /**
     * 在dom元素旁显示提示信息，3秒后消失
     *
     * @return {function(HTMLElement, string)} 回调函数.
     */
    showTip: function() {
        var timeout;

        return function(dom, tip) {
            if (!dom) {
                return;
            }

            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            var id = 'dnDomTip',
                el = baidu.g(id),
                pos = baidu.dom.getPosition(dom),
                width = dom.offsetWidth;

            if (!el) {
                el = document.createElement('div');
                el.className = 'dn-domtip';
                el.id = id;
                document.body.appendChild(el);
            }

            el.innerHTML = tip;
            el.style.left = pos.left + width + 10 + 'px';
            el.style.top = pos.top + 'px';
            el = null;

            timeout = setTimeout(function() {
                baidu.g(id).style.left = '-10000px';
            }, 2500);
        };
    } (),

    stringToDate: function(source) {
        var matches = source.match(/^(\d{4})(\d{2})(\d{2})(\d{2})*$/),
      len = matches.length;
        while (len--) {
            matches[len] = parseInt(matches[len], 10);
        }
        return new Date(matches[1], matches[2] - 1, matches[3]);
    },

    listItemParse: function(source) {
        return {
            value: source['v'],
            text: source['l']
        };
    },

    encodeJsonString: function(str) {
        var a = [[/"/g, '\"'], [/</g, '&lt;'], [/>/g, '&gt;'], [/'/g, "\'"], [/\//g, '/'], [/\\/g, '\\']];
        var s = str;
        if (typeof str == 'string') {
            for (var i = 0; i < a.length; i++) {
                s = s.replace(a[i][0], a[i][1]);
            }
        }
        return s;
    },

    decodeString: function(str) {
        var a = [[/&#34;/g, '\"'], [/&#38;/g, '&'], [/&#60;/g, '<'], [/&#62;/g, '>'], [/&#39;/g, "\'"], [/&#47;/g, '/'], [/&#92;/g, '\\']];
        var s = str;
        if (typeof s == 'string') {
            for (var i = 0, l = a.length; i < l; i++) {
                s = s.replace(a[i][0], a[i][1]);
            }
        }
        return s;
    },

    showInviteMsg: function(msg, position) {
        baidu.g('reinviteMsg').innerHTML = msg;
        var e = baidu.g('reinviteWrapper');

        var sTop = 0;
        var sLeft = 0;

        if (window.innerWidth) {
            sLeft = window.pageXOffset;
            sTop = window.pageYOffset;
        } else if (document.documentElement && document.documentElement.clientWidth) {
            sLeft = document.documentElement.scrollLeft;
            sTop = document.documentElement.scrollTop;
        } else if (document.body.clientWidth) {
            sLeft = document.body.scrollLeft;
            sTop = document.body.scrollTop;
        }

        e.style.left = (position.left + sLeft + 35) + 'px';
        e.style.top = (position.top + sTop - 150) + 'px';

        window.setTimeout(function() {
            e.style.left = '-10000px';
            e.style.top = '-10000px';
        }, 2500);
    },

    autoEllipseText: function(text, width) {
        var el = baidu.g('autoEllipseWrapper');
        if (!el) {
            el = document.createElement('div');
            el.id = 'autoEllipseWrapper';
            el.style.position = 'absolute';
            el.style.left = '-10000px';
            el.style.top = '-10000px';
            document.body.appendChild(el);
        }
        el.innerHTML = '<span id=\"ellipsisSpan\" style=\"white-space:nowrap;\"></span>';

        var inSpan = document.getElementById('ellipsisSpan');
        inSpan.appendChild(document.createTextNode(text));
        if (inSpan.offsetWidth > width) {
            var i = text.length;
            //inSpan.innerHTML = "";
            while (inSpan.offsetWidth > (width)) {
                inSpan.innerHTML = '';
                inSpan.appendChild(document.createTextNode(text.substr(0, i) + '...'));
                i--;
            }
            var returnText = dn.util.encodeJsonString(text.substr(0, i + 1)) + '...';
            el.innerHTML = '';
            return returnText;
        }
        return dn.util.encodeJsonString(text);
    },

    truncate: function(string, opt_max_length) {
        // 对字符串进行截断
        var max_length = opt_max_length || 100;
        var length = string.length;
        if (length <= max_length) {
            return string;
        }

        var head = string.substr(0, max_length / 2);
        var tail = string.substr(length - head.length);

        return head + '...' + tail;
    },

    regexp: {
        urlLoose: /^((http|https|ftp|ftps):\/\/)?[A-Za-z0-9][A-Za-z0-9-]{0,}[A-Za-z0-9]?(\.[A-Za-z0-9]+)+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/i,
        urlStrict: /^(http|https|ftp|ftps):\/\/[A-Za-z0-9][A-Za-z0-9-]{0,}[A-Za-z0-9]?(\.[A-Za-z0-9]+)+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/i
    },

    /**
     * 好多模块都有${module}.data，里面的内容很重复，这里提供
     * 一个生成器，自动的生成所需要的对象，只需要传人一些配置而已
     *
     * FIXME
     * @param {Array.<Object>} cfg 根据这个配置来生成对象.
     * @return {Object.<string, function(string, Function, Function)>} 函数的集合.
     */
    da_generator: function(cfg) {
        var obj = {};
        for (var i = 0, j = cfg.length, k = null; i < j; i++) {
            obj[cfg[i]['name']] = function() {
                var url = cfg[i]['url'];
                // var parser = cfg[i]['parser'] || null;
                // var retry = cfg[i]['retry'] || false;
                return function(params, onsuccess, onfailure) {
                    if (typeof params == 'function') {
                        Requester.post(url, null, params, onfailure);
                    } else {
                        Requester.post(url, params, onsuccess, onfailure);
                    }
                };
            } ();
        }
        return obj;
    },

    next_id_: 0,
    id_generator: function() {
        return 'dn' + (dn.util.next_id_++).toString(36);
    },

    /**
     * 获取Loading的html
     *
     * @return {string} html.
     */
    getLoadingHtml: function() {
        return baidu.format('<div class="list-loading"><span>{0}</span></div>', dn.lang.dataLoading);
    },

    /**
     * 将数组中的某一字段抽出组成一个新数组
     *
     * @param {Array} array 数组.
     * @param {string} field 字段名.
     * @return {Array} 新的数组.
     */
    extractField: function(array, field) {
        if (!baidu.lang.isArray(array)) {
            return null;
        }
        var result = [];
        baidu.each(array, function(item) {
            result.push(item[field]);
        });
        return result;
    },

    /**
     * 获取状态html
     *
     * @param {string} statusText 状态文字.
     * @param {Object} map status和className的映射对象.
     * @return {string} html片段.
     */
    getStatusHtml: function(statusText, map) {
        return baidu.format('<span class="{1}">{0}</span>', statusText, map[statusText]);
    },

    /**
     * 获取状态html
     *
     * @param {string} statusText 状态文字.
     * @param {string} color 颜色值.
     * @return {string} html片段.
     */
    getStatusHtmlbyColor: function(statusText, color) {
        return baidu.format('<span style="color:{1}">{0}</span>', statusText, color);
    },

    /**
     * 把20110102235959 14位数字转为DATE对象
     * @param {string} num 需要转化的数字.
     * @return {Date} 日期对象.
     */
    parseToDate: function(num) {
      function parse(source) {
        var match = null;
        if (match = /^(\d{4})[-\/]?([01]\d)[-\/]?([0-3]\d)$/.exec(source)) {
           return new Date(
            parseInt(match[1], 10),
            parseInt(match[2], 10) - 1,
            parseInt(match[3], 10)
           );
        }
        return null;
      };

      num = num + '';
      var date = parse(num.substring(0, 8));
      if (num.substring(8, 10)) date.setHours(num.substring(8, 10));
      if (num.substring(10, 12)) date.setMinutes(num.substring(10, 12));
      if (num.substring(12)) date.setSeconds(num.substring(12));
      return date;
    },
    
    /**
     * 截取日期的日期部分，去除时分秒
     */
    getDatePart: function(date){
        if(baidu.lang.isDate(date) === false) return;
        return new Date(date.getFullYear(),date.getMonth(),date.getDate())
    },
    
    /**
     * 加载popup
     * @param {ui.Page} page popup所在page.
     * @param {string} actionName 要载入的action名称.
     * @param {Object} option Dialog的配置参数{width, title}.
     * @param {Object} opt_argMap action的配置可选参数.
     * @return {?er.Action} 对应的Action实例.
     */
    loadPopup: function(page, actionName, option, opt_argMap) {
        var dialog = page.c('popup'),
            action;
    
        if (!dialog) {
            dialog = ui.util.createControl({
                type: 'Dialog',
                id: 'popup',
                skin: 'form-container'
            });
            page.addChild(dialog);
        }
        dialog.setWidth(option.width || 600);
        dialog.show();
        dialog.setTitle(option.title || '');
    
        action = er.controller.loadAction(dialog.getBody(), actionName, opt_argMap);
    
        dialog.onclose = function() {
            action.leave();
        };
    
        return action;
    },

    /**
     * 卸载page中的popup
     * @param {ui.Page} page popup所在的page
     */
    unloadPopup: function(page) {
        var dialog = /** @type {ui.Dialog} */ (page.c('popup'));
        if (dialog) {
            dialog.close();
        }
    },
    
    /**
     * 画报表中的比例图
     * @param {string} percent like:85%.
     */
    drawGraph: function(percent){
        var widthPercent = parseInt(percent*100,10),
            html = [];
      
        if(widthPercent > 90) {
            widthPercent = 90;
        }
      
        html.push('<table cellspacing="0" cellpadding="0" border="0" style="height: 16px;line-height: 16px;width:98%">');
        html.push('<tr>');
        html.push('<td style="width:'+widthPercent+'%;background-color: #1290BF; "></td>');
        html.push('<td style="width:'+(100-widthPercent)+'%;align:left">');
        html.push('&nbsp;&nbsp;' + (percent*100).toFixed(2)+'%');
        html.push('</td>');
        html.push('</tr>');
        html.push('</table>');
    
        return html.join('');
    },

    /**
     * 保留小数点后面2位，同时四舍五入
     * @param {number} value 需要处理的值.
     * @param {number=} opt_n 需要保留的小数点位数.
     * @return {string}
     */
    getFixed : function(value, opt_n) {
      var n = opt_n || 2,
          t = 1 / Math.pow(10, n + 1);
          
      t = t / 2;
      
      value = parseFloat(value);
      if (value > 0){
        return parseFloat(value + t).toFixed(n);
      } else if (value < 0) {
        return parseFloat(value - t).toFixed(n);
      } else {
        return '0.' + new Array(n + 1).join('0');
      }
    },
    
    
    /**
     * 画报表中的窄条比例图
     * @param {string} percent like:85%.
     */
    drawNarrowGraph: function(percent){
        var widthPercent = parseInt(percent*100,10),
            html = [];
      
        if(widthPercent > 90) {
            widthPercent = 90;
        }
      
        html.push('<table cellspacing="0" cellpadding="0" border="0" style="height: 16px;line-height: 16px;width:98%">');
        html.push('<tr>');
        html.push('<td style="width: 10%;align:left">');
        html.push('&nbsp;&nbsp;' + (percent*100).toFixed(2)+'%');
        html.push('</td>');
        html.push('<td style="width: 90%;"><div class="orangeBar" style="height: 5px; width: ' +
        		   widthPercent + '%;"></div></td>');
        html.push('</tr>');
        html.push('</table>');
    
        return html.join('');
    },
    
    
    
    /**
     * 比较两个日期是否同一天
     *
     * @param {Date} date1 日期.
     * @param {Date} date2 日期.
     * @return {boolean}
     */
    isSameDate: function(date1, date2) {
        if (date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()) {
            return true;
        }

        return false;
    },
    
    getReportDateText: function(dateSpan) {
        var beginTime = dateSpan.begin,
            endTime = dateSpan.end,
            date = new Date();
        
        if (dn.util.isSameDate(beginTime, endTime) &&
            dn.util.isSameDate(beginTime, date)) {
            return '今天';
        }
        
        date.setDate(date.getDate() - 1);
        if (dn.util.isSameDate(beginTime, endTime) &&
            dn.util.isSameDate(beginTime, date)) {
            return '昨天';
        }
        
        if (dn.util.isSameDate(endTime, date)) {
            date.setDate(date.getDate() - 6);
            if (dn.util.isSameDate(beginTime, date)) {
                return '前七天';
            }
        }
        
        return baidu.format('{0} 至 {1}',
            baidu.date.format(beginTime, 'yyyy-MM-dd'),
            baidu.date.format(endTime, 'yyyy-MM-dd'));
    },
    
    getFlashAreaId: function(xmlid){
      xmlid = parseInt(xmlid, 10);

      var map = er.context.get('regionXmlFlashMap');
      var rtn = baidu.array.find(/** @type {Array} */(map),function(item,i){
        return xmlid === item['xml'];
      });
      return rtn?rtn['flash']:null;
    },
    
    getXmlAreaId: function(flashid){
      flashid = parseInt(flashid, 10);
      
      var map = er.context.get('regionXmlFlashMap');
      var rtn = baidu.array.find(/** @type {Array} */(map),function(item,i){
        return flashid === item['flash'];
      });
      return rtn?rtn['xml']:null;
    },
    
    getPercent: function(num){
        return parseFloat(num*100).toFixed(2) + '%';
    },
    
    getRMB: function(num){
        return '¥ ' + dn.util.getFixed(num);
    },
    
    /**
     * 数字显示加逗号，把1323 转为1,323 的格式
     */
    getCommaFormat: function(num){
        var arr = (num+'').split('').reverse(),
            rtn = [],
            i;
        
        if(!/^\d*$/.test(num+'')){
            return num;
        }
        
        for(i=0;i<arr.length;i++){
            rtn.push(arr[i]);
            if((i+1)%3==0 && i!=arr.length-1 ){
                rtn.push(',');
            }
        }
        
        return rtn.reverse().join('');
    },
    
    /**
     * 0%的显示方式
     */
    getZeroPercent: function(num){
        if('0.00%' === num){
            return '--';
        }
        return num;
    }
};

