/*
 * Display ads network 投放端
 * Copyright 2010 Baidu Inc. All rights reserved.
 * $Id: dfp.js 7013 2011-06-30 09:43:27Z kangyongliang $
 *
 * path:    dn.js
 * desc:    投放端脚本
 * author:  zhanglili01
 * date:    $Date: 2011-06-30 17:43:27 +0800 (周四, 30 六月 2011) $
 * version: $Revision: 7013 $
 */

/**
 * @define {boolean} Overridden to true by the compiler when --closure_pass
 *     or --mark_as_compiled is specified.
 */
var COMPILED = false;

var TOGGLE_STATE_COLLAPSED = '1', //标记当前广告位显示收缩物料
    TOGGLE_STATE_MAIN = '0';//标记当前广告位显示主物料

var doc = document,
    body = doc.body,
    isQuirksMode = doc.compatMode !== 'CSS1Compat', // 是否怪异模式
    root = isQuirksMode ? body : doc.documentElement, // 在标准模式下，scrollTop|scrollLeft|clientWidth|clientHeight都取documentElement，怪异模式下取body
    requirePositionFix = null, // 是否支持position:fix，如果支持则为null，不支持则为对象
    supportOpacity, // 是否支持opacity样式，支持为true，不支持为false
    // IE8的object标签不支持setAttribute
    // 好在IE8弄混了property和attribute，因此用o['xxx'] = yyy;的形式能设置属性，并能使用getAttribute获取
    setAttribute = function(element, name, value) { element.setAttribute(name, value); },
    useObjectForFlash = false, // 是否用object标签载入flash，IE用object，其他浏览器用embed
    store = window['BAIDU_CLB_SLOTS_MAP'],
    globalConfig = window['BAIDU_DAN_config'] || {},
    clbSharingKey = 'BAIDU_DAN_readySlotId', // 需要投放的广告的id
    logBaseUrl = COMPILED ? 'http://gmvl.baidu.com/dan/sp.html' : '', // 日志发送的地址
    standardVideoPlayerSrc = 'http://img.baidu.com/adm/video-player.swf', // 标准视频播放器的swf文件地址
    defaultCollapseSrc = 'http://img.baidu.com/adm/gm-logo-100x100.png', // 默认浮标的图片地址
    materialCallbackKey = 'BAIDU_DAN_materialCallback', // flash物料的回调函数地址
    exportKey = 'BAIDU_DAN_showAd', // 导出到window对象下的创建广告函数的名称
    controlBarHeight = 16, // 控件按钮栏的默认高度
    collapsedMaterialWidth = 100, // 收缩物料的默认宽度
    collapsedMaterialHeight = 100, // 收缩物料的默认高度
    // http://stackoverflow.com/questions/491052/mininum-and-maximum-value-of-z-index
    // http://www.puidokas.com/max-z-index/
    // http://puidokas.com/examples/z-index_max/
    maxZIndex = 2147483647, // 用于保证路障、浮窗、视频物料永远在最上方
    playerProgressCheckInterval = 5000, // 播放器进度检查间隔
    hasOwn = Object.prototype.hasOwnProperty, // 缓存hasOwnProperty函数
    // 几个data-*属性的键名
    idAttributeName = 'data-baidu-dan-id', // 广告id
    typeAttributeName = 'data-baidu-dan-type', // 广告类型
    positionFixAttributeName = 'data-baidu-dan-position-fix', // fixed定位位置
    tickAttributeName = 'data-baidu-dan-tick', // 计时器id
    actionCountAttributeName = 'data-baidu-dan-count', // 用户操作的次数（如视频最小化）
    actionLogPauseAttributeName = 'data-baidu-dan-alp',
    actionLogReplayAttributeName = 'data-baidu-dan-alr',
    actionLogRestoreAttributeName = 'data-baidu-dan-alrs',
    actionLogMuteAttributeName = 'data-baidu-dan-alm',
    actionLogLargeCloseAttributeName = 'data-baidu-dan-allc',
    actionLogSmallCloseAttributeName = 'data-baidu-dan-alsc',
    actionLogSearchAttributeName = 'data-baidu-dan-als',
    playerStateAttributeName = 'data-baidu-dan-player-state', // 播放器的播放状态：playing|paused|stopped
    toggleStateAttributeName = 'data-baidu-dan-player-toggle-state'; //当前广告位显示物料类型：主物料|收缩物料

/* <特性检测> */

/**
 * 检测浏览器是否支持position:fixed
 */
(function() {
    /*
     * 使用如下结构：
     * <div style="position: absolute; top: 200px;"> <== outer
     *     <div style="position: fixed; top: 100px;"></div> <== inner
     * </div>
     *
     * 如果浏览器支持fixed，由于fixed是相对于document定位的，因此无论body样式如何，top始终是100px
     * 如果浏览器不支持fixed，被解释为static，则inner的top是无效的，其top和outer相同
     */
    var outer = doc.createElement('div'),
        inner = doc.createElement('div');

    outer.style.position = 'absolute';
    outer.style.top = '200px';

    inner.style.position = 'fixed';
    inner.style.top = '100px';

    outer.appendChild(inner);
    body.appendChild(outer);

    // element.getBoundingClientRect().top肯定是number，不需要用===
    if (inner.getBoundingClientRect && inner.getBoundingClientRect().top == outer.getBoundingClientRect().top) {
        requirePositionFix = {};
    }

    body.removeChild(outer);
}());

/**
 * 检测2个object标签相关的特性
 */
(function() {
    var o = doc.createElement('object');
    if ('classid' in o) {
        useObjectForFlash = true;

        o.setAttribute('test', 'test');
        if (!o.getAttribute('test')) {
            setAttribute = function(element, name, value) { element[name] = value; };
        }
    }
}());

/**
 * 检测浏览器是否支持opacity样式
 */
(function() {
    // 思想来自司徒的博客
    // http://www.cnblogs.com/rubylouvre/archive/2010/05/16/1736535.html
    var outer = doc.createElement('div');
    outer.innerHTML = '<div style="opacity:.25;"></div>';
    var inner = outer.firstChild;

    supportOpacity = inner.style.opacity == '0.25';
}());

/* <创建广告函数> */

/**
 * 创建广告的入口函数
 *
 * @param {string} id 广告位的id.
 */
function showAd(id) {
    var info = buildInfo(id);

    // 对于富媒体物料特殊处理
    // 无论productType是什么，只要是富媒体，就doc.write
    if (info.materialType == 4) {
        doc.write(info.htmlCode);
        return;
    }

    // 普通广告的投放流程
    var type = info.productType,
        creater = adCreater[type];

    if (creater) {
        creater(info);
    }
}

window[exportKey] = showAd;

/**
 * @param {*} o 需要编码的参数.
 * @return {string} 编码之后的内容.
 */
function E(o) {
  return encodeURIComponent( /** @type {string} */ (o));
}

/**
 * 创建视频广告
 *
 * @param {Object} info 广告的相关信息.
 */
function showVideoAd(info) {
    /*
     * 结构：
     * <ins> <== wrapper
     *     <div> <== container
     *         <embed /> <== player
     *     </div>
     * </ins>
     */

    var id = info.id,
        width = info.width,
        height = info.height,
        container = createContainer(id, width, height),
        wrapper = createWrapper(info, 'video', container);

    // 放置在右下角
    putToBottomRight(wrapper, id, width, height);

    // 设置位置跟随模式
    setPositionTrackingMode(container, 2);

    // 加入DOM
    // 在IE6下，不能用appendChild，因为IE6下document.write脚本有顺序问题
    // 会导致appendChild在</body>未闭合时执行，出现浏览器崩溃
    body.insertBefore(wrapper, body.firstChild);

    // 如果先创建内容，再加入DOM，在部分版本的IE8下，Flash会看不到
    // 所以视频物料先创建内容
    createMaterial(container, info);

    if (requirePositionFix) {
        applyPositionFix();
    }

    // 视频物料不是通过计时器收缩的，需要有onFinish的callback
}

/**
 * 创建泰山压顶广告
 *
 * @param {Object} info 广告的相关信息.
 */
function showTopDownAd(info) {
    var id = info.id,
        width = info.width,
        height = info.height,
        slotHeight = info.slotHeight,
        container = createContainer(id, width, height),
        wrapper = createWrapper(info, 'top-down', container),
        style = wrapper.style,
        body = doc.body;

    // 经测试，由于展现的过程中一般图片没有下载完成，此处使用动画效果不好
    // 为了动画效果，先将height变成0
    style.height = '0';
    // 水平居中
    style.margin = '0 auto';
    // display:block后宽度会撑满，导致居中无效，设置固定的宽度
    style.width = width + 'px';
    // 加入DOM
    body.insertBefore(wrapper, body.firstChild);

    // 创建内容
    createMaterial(container, info);

    // 开场始动画
    // 鉴于动画时可能img|object未加载完，动画效果就是一空白的div不断变高，会很难看
    // 因此出场不使用动画效果 - PM：必须使用
    // 此处也不能使用img|object的onload事件，因为IE7下，如果img|object在缓存中，onload事件不会触发
    // http://msdn.microsoft.com/en-us/library/cc197055(v=vs.85).aspx (WARNING!!!章节)
    // 只按广告位的高度进行动画
    animate(wrapper, 'height', 0, height);

    // 一段时间后消失
    setTimeout(function() { animate(wrapper, 'height', height, 0); }, info.maxImpressionTime);
}

/**
 * 创建路障广告
 *
 * @param {Object} info 广告的相关信息.
 */
function showBarrierAd(info) {
    /*
     * 结构：
     * <ins> <== wrapper
     *     <div> <== mainWrapper
     *         <div> <== mainContainer
     *             <a></a> <== 点击监控
     *             <img> | <object> <== 主物料
     *         </div>
     *         <div class="baidu-dan-control-bar"> <== mainControlBar
     *             <span>关闭</span><span>最小化</span>
     *         </div>
     *     </div>
     *     <div style="display: none;"> <== collapsedWrapper
     *         <div class="baidu-dan-control-bar"> <== collapsedControlBar
     *             <span>关闭</span>
     *         </div>
     *         <div> <== collapsedContainer
     *             <object> <== 收缩物料
     *         </div>
     *     </div>
     * </ins>
     */

    var id = info.id,
        width = info.width,
        height = info.height,
        //主物料块
        mainWrapper = doc.createElement('div'),
        mainContainer = createContainer(id, width, height),
        mainControlBar = createControlBar('minimize', 'close'), // 主物料有最小化和关闭按钮
        //收缩物料块
        collapsedWrapper = doc.createElement('div'),
        collapsedContainer = createCollapsedContainer(id),
        collapsedControlBar = createControlBar('close'), // 收缩物料有关闭按钮
        wrapper = createWrapper(info, 'barrier', [mainWrapper, collapsedWrapper]),
        style = wrapper.style;


    // 刚创建出来的广告不需要收缩状态，因此隐藏
    collapsedWrapper.style.display = 'none';

    // 主物料的按钮在下方
    mainWrapper.appendChild(mainContainer);
    mainWrapper.appendChild(mainControlBar);
    // 收缩物料的按钮在上方
    collapsedWrapper.appendChild(collapsedControlBar);
    collapsedWrapper.appendChild(collapsedContainer);

    style.width = width + 'px';
    style.height = (height + controlBarHeight) + 'px'; // 要计算按钮栏的高度
    style.zIndex = maxZIndex;
    // 放置在窗口居中
    centerToWindow(wrapper, id, width, height + controlBarHeight); // 要计算按钮栏的高度

    // 设置位置跟踪
    setPositionTrackingMode(mainWrapper, 1);
    setPositionTrackingMode(collapsedWrapper, 3);

    // 加入DOM
    body.insertBefore(wrapper, body.firstChild);

    // 创建内容
    createMaterial(mainContainer, info);
    createMaterialOnCollapsed(collapsedContainer, info.collapseType, info.collapseSrc);

    if (requirePositionFix) {
        applyPositionFix();
    }

    // 一段时间后变为收缩物料
    startCollapsingTimer(wrapper, info.maxImpressionTime);
}

/**
 * 创建浮标广告
 * XXX 浮标广告跟浮窗广告不是一个类型
 *
 * @param {Object} info 浮标广告的相关信息.
 */
function showMiniFloatAd(info) {
    /*
     * 结构：
     * <ins> <== wrapper
     *     <ins> <== container
     *         <div class="baidu-dan-control-bar"> <== controlBar
     *            <span>关闭</span>
     *         </div>
     *         <ins> <== materialContainer
     *            <a></a> <== 点击监控
     *            <embed /> <== 物料
     *         </ins>
     *     </ins>
     * </ins>
     */


    var id = info.id,
        width = info.width,
        height = info.height,
        controlBar = createControlBar('close'), // 关闭按钮
        materialContainer = createContainer(id, width, height),
        container = createCollapsedContainer(id, false),
        wrapper = createWrapper(info, 'float', container),
        style = wrapper.style;

    // 设置位置跟随模式
    setPositionTrackingMode(container, 2);

    // 放置在右下角
    putToBottomRight(wrapper, id, width, height);

    // 加入DOM
    style.width = width + 'px';
    style.height = (height + controlBarHeight) + 'px'; // 要计算按钮栏的高度
    style.zIndex = maxZIndex;
    body.insertBefore(wrapper, body.firstChild);

    // 创建内容
    container.appendChild(controlBar);
    container.appendChild(materialContainer);
    createMaterial(materialContainer, info);

    if (requirePositionFix) {
        applyPositionFix();
    }

}

/**
 * 创建浮窗广告
 *
 * @param {Object} info 广告的相关信息.
 */
function showFloatAd(info) {
    /*
     * 结构：
     * <ins> <== wrapper
     *     <div> <== container
     *         <embed /> <== player
     *     </div>
     * </ins>
     */

    var id = info.id,
        width = info.width,
        height = info.height,
        container = createContainer(id, width, height),
        wrapper = createWrapper(info, 'float', container);

    // 浮窗广告的交互由flash处理
    info.flashHosted = true;

    // 设置位置跟随模式
    setPositionTrackingMode(container, 2);

    // 放置在右下角
    putToBottomRight(wrapper, id, width, height);

    // 加入DOM
    body.insertBefore(wrapper, body.firstChild);

    // 创建内容
    createMaterial(container, info);

    if (requirePositionFix) {
        applyPositionFix();
    }
}

/**
 * 创建固定广告，包括了画中画和通栏
 *
 * @param {Object} info 广告的相关信息.
 */
function showStaticAd(info) {
    /*
     * 结构：
     * <ins> <== wrapper
     *     <div> <== container
     *         <a> <== 点击监控
     *         <object> | <img> <== 物料
     *     </div>
     * </ins>
     */

    var id = info.id,
        scripts = document.getElementsByTagName('script'),
        placeholder = scripts[scripts.length - 1], // 最后一个script元素就是点位符
        parent = placeholder.parentNode, //占位符的上层元素
        container = createContainer(id, info.width, info.height),
        wrapper = createWrapper(info, 'static', container);

    // 放到placeholder的位置
    // nextSibling不存在就会是appendChild效果
    parent.insertBefore(wrapper, placeholder.nextSibling);

    // 创建内容
    createMaterial(container, info);
}

/*
 * productType：
 *   0 => 视频
 *   1 => 浮窗
 *   2 => 路障
 *   3 => 泰山压顶
 *   4 => 通栏
 *   5 => 画中画
 *   6 => 浮标视频(视频)
 *   7 => 浮标(小浮窗的效果)
 */
var adCreater = [
    showVideoAd, showFloatAd, showBarrierAd, showTopDownAd, showStaticAd, showStaticAd,
    showVideoAd, showMiniFloatAd
];

/**
 * 销毁广告元素
 *
 * @param {Element|Event} e 广告的wrapper元素，或者事件对象.
 */
function destroyAd(e) {
    e = findWrapperElement(e);

    // 需要清掉原有的max_impression时间后变成收缩物料用的定时器
    stopCollapsingTimer(e);

    // Opera在removeChild之后，flash会有残像，下一次render才会消失
    // 所以使用display:none让其隐藏，然后使用setTimeout让隐藏的指令在DOM中形成render，再remove
    e.style.display = 'none';
    setTimeout(function() {
        // 删除wrapper元素即可
        e.parentNode.removeChild(e);
    }, 0);

    // TODO: 检查是否需要进一步的内存清理

    // 作为事件函数调用时，阻止冒泡
    return false;
}

/* <创建广告相关结构函数> */

/**
 * 创建放置主物料的容器元素
 *
 * @param {string|number} id 广告的id.
 * @param {number} width 广告的宽度.
 * @param {number} height 广告的高度.
 *
 * @return {Element} 放置主物料的容器元素.
 */
function createContainer(id, width, height) {
    var element = doc.createElement('ins'),
        style = element.style;

    element.id = 'baidu_dan_' + id;

    style.display = 'block';
    style.width = width + 'px';
    style.height = height + 'px';
    // 保证点击监控的a元素定位有效
    style.position = 'relative';
    // 保证点击监控用的a元素不会超过该容器
    style.overflow = 'hidden';

    return element;
}

/**
 * 创建收缩物料的容器元素
 *
 * @param {string|number} id 广告的id.
 * @param {boolean=} opt_autoBindEvent 是否支持自动绑定事件.
 *
 * @return {Element} 放置收缩物料的容器元素.
 */
function createCollapsedContainer(id, opt_autoBindEvent) {
    // 使用ins元素作为container
    // 如果使用div的话，因为在IE下，p元素下添加一个div，再对该div设置innerHTML是会报错的
    // http://wjboy49.javaeye.com/blog/654246
    var element = doc.createElement('ins');

    element.id = 'baidu_dan_collapsed_' + id;

    // 修改为display:block
    element.style.display = 'block';

    // 添加事件 - 鼠标移动到收缩物料上时，显示主物料
    if (opt_autoBindEvent !== false) {
        addEvent(element, 'mouseover', toggleToMainMaterial);
    }

    return element;
}

/**
 * 创建放置广告的最外层元素
 *
 * @param {Object} info 广告的信息.
 * @param {string} type 广告的类型.
 * @param {Element|Array} content 已有的放置广告的容器元素.
 *
 * @return {Element} 放置广告的最外层元素.
 */
function createWrapper(info, type, content) {
    content = content instanceof Array ? content : [content];

    var id = info.id,
        element = doc.createElement('ins'),
        style = element.style,
        i = 0, // 循环用
        length = content.length; // 循环用

    element.id = 'baidu_dan_wrapper_' + id;
    element.setAttribute(idAttributeName, id);
    element.setAttribute(typeAttributeName, type);
    element.setAttribute(toggleStateAttributeName, info.initialState); //设置当前广告位的初始物料状态  主物料|收缩物料

    // ins为可变元素，默认display为inline，需要修改为block以便支持width|height的修改
    // http://www.whatwg.org/specs/web-apps/current-work/#the-ins-element
    /*
     * 测试display的脚本(w3c浏览器)
     * var ins = doc.createElement('ins');
     * ins.appendChild(doc.createElement('div'));
     * doc.body.appendChild(ins);
     * alert(window.getComputedStyle(ins, null).display);
     */
    style.display = 'block';
    // 物料的内容可能改变大小（如泰山压顶的动画效果）
    // 但是广告元数据中的width|height是固定的，因此wrapper大小固定
    // 对img或object使用类似动画效果，不断改变大小的话非常消耗渲染资源
    // 因此让wrapper使用overflow:hidden保证内部的物料大小不会改变，减少reflow的开销
    style.overflow = 'hidden';
    // 在IE下，由于内部是relative，此处不设置为relative的话，overflow:hidden无效
    style.position = 'relative';
    // 几乎所有浏览器的UA Style里面ins元素都有text-decoration:underline
    // 这会影响到其内部元素的文字，富媒体物料可能会受到影响，因此要重置
    // http://www.iecss.com/
    style.textDecoration = 'none';
    style.zIndex = maxZIndex;

    // 广告位有大小
    // 部分广告的广告位是0*0，此时不要设置
    if (info.slotWidth) {
        style.width = info.slotWidth + 'px';
    }
    if (info.slotHeight) {
        style.height = info.slotHeight + 'px';
    }

    for (; i < length; i++) {
        element.appendChild(content[i]);
    }

    return element;
}

/**
 * 动画效果，只能处理px为单位的
 *
 * @param {Element} element 应用动画效果的元素.
 * @param {string} name 应用动画效果的样式名称.
 * @param {number} from 样式的起始值.
 * @param {number} to 样式的结束值.
 * @param {number=} opt_time 动画执行的时间，以毫秒为单位，默认为800.
 * @param {number=} opt_interval 动画的刷新间隔，以毫秒为单位，默认为20.
 */
function animate(element, name, from, to, opt_time, opt_interval) {
    var style = element.style,
        time = opt_time || 800, // 默认0.8秒
        latency = opt_interval || 20,
        count = time / latency, //变化的次数
        step = Math.round((to - from) / count), //每一步的变化量
        now = from;

    function go() {
        count--;
        now = count ? now + step : to;
        style[name] = now + 'px';

        if (count) {
            setTimeout(go, latency);
        }
    }

    style[name] = from + 'px';
    setTimeout(go, latency);
}

/* <创建物料相关函数> */

/**
 * 创建物料收缩状态下的内容
 *
 * @param {Element} container 放置收缩的物料的容器元素.
 * @param {number} type 收缩物料的类型.
 * @param {string} src 收缩物料的地址.
 */
function createMaterialOnCollapsed(container, type, src) {
    // 当前全部是flash，且type全为0
    if (type === 0) {
        var info = {
            src: src,
            width: collapsedMaterialWidth,
            height: collapsedMaterialHeight
        };
        createFlashMaterial(container, info);
    }
}

/**
 * 创建物料的入口函数
 *
 * @param {Element} container 放置物料的容器元素.
 * @param {Object} info 广告的相关信息.
 */
function createMaterial(container, info) {
    var creater = contentCreater[info.materialType];
    if (creater) {
        creater(container, info);
    }
}

// TODO: 对于视频播放器，注意低版本flash player下这个问题
// http://popotang.com/blog/index.php/as-js-maxthon-bug/
// 问题仅在flash有缓存的情况下存在，需开web server设定缓存头测试

/**
 * 创建视频物料（标准+非标准）
 *
 * @param {Element} container 放置物料的容器元素.
 * @param {Object} info 广告的相关信息.
 */
function createVideoMaterial(container, info) {
    var options = {
            id: 'baidu_dan_player_' + info.id,
            width: info.width,
            height: info.height,
            src: info.playerUrl || standardVideoPlayerSrc
        },
        params = [
            'player_id=' + E(info.id),
            'play_url=' + E(info.src),
            'target_url=' + E(info.targetUrl),
            'target_window=' + anchorTarget[info.targetWindow],
            'rcv_url=' + info.rcvUrl,
            'effect_time=' + (info.maxImpressionTime / 1000).toFixed(),
            'collapse_src=' + E(info.collapseSrc),
            'initial_state=' + info.initialState,
            'query=' + E(info.rcvQuery),
            'o_mute=' + (globalConfig['videoMute'] ? '1' : '0'),
            'o_volume=' + (typeof globalConfig['videoVolume'] == 'number' ? globalConfig['videoVolume'] : '20') // 默认音量为20
        ];

    createFlashMaterial(container, options, params.join('&'));

    // 默认展示角标，调整位置吧
    if (info.initialState == TOGGLE_STATE_COLLAPSED) {
      // FIXME 这是不正确获取wrapper的方式
      var wrapper = doc.getElementById('baidu_dan_wrapper_' + info.id);
      toggleToCollapsedMaterial(wrapper);
    }
}

/**
 * 创建Flash物料
 *
 * @param {Element} container 放置物料的容器元素.
 * @param {Object} info 广告的相关信息.
 * @param {string=} params 可选的参数.
 */
function createFlashMaterial(container, info, params) {
    // IE使用appendChild添加object标签是没有用的，只能用innerHTML
    // 在Chrome中，如果object标签前面有一个元素有background-image样式，则很有可能该object不显示
    /*
     * 测试代码，保存为html文件，本地Chrome打开，刷新几次会出现该现象
     *
     * <div style="background-image: url(http://www.baidu.com/img/baidu_logo.gif); width: 270px; height: 129px;"></div>
     * <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     *         type="application/x-shockwave-flash"
     *         codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0"
     *         width="600"
     *         height="360">
     *     <param name="allowScriptAccess" value="always" />
     *     <param name="quality" value="high" />
     *     <param name="wmode" value="transparent" />
     *     <param name="movie" value="http://imgc.zol.com.cn/small_flash_channel/donghua/20060803qrj.swf" />
     *     <embed wmode="transparent"
     *            src="http://imgc.zol.com.cn/small_flash_channel/donghua/20060803qrj.swf"
     *            quality="high"
     *            width="600"
     *            height="360"
     *            allowscriptaccess="always"
     *            type="application/x-shockwave-flash"
     *            pluginspage="http://www.macromedia.com/go/getflashplayer" />
     * </object>
     */
    // 只有flash的话，仅使用embed是可以的
    // http://www.w3help.org/zh-cn/causes/HO8001 参见“问题分析”的第4点和“解决方案”
    // 但是要与flash交互（javascript <-> flash相互调用），IE下就必须用object
    // XXX: 需要QA关注

    // 对于由flash负责交互效果的物料，使用默认的交互参数
    // TODO: 确定函数名后删除callback
    if (info.flashHosted) {
        params = 'id=' + info.id + '&target_url=' + E(info.targetUrl) + '&target_window=' + anchorTarget[info.targetWindow];
        /*
        params = 'param={"id":"' + info.id + '","target_url":"' + encodeURIComponent(info.targetUrl) +
            '","target_window":"' + anchorTarget[info.targetWindow] + '","callback":"' + materialCallbackKey + '"}';
        */
    }
    // 由于默认的交互参数是JSON格式，会有双引号，需要转义掉，以免HTML解析出错
    // params = params && params.replace(/"/g, '&quot;');

    var html;
    if (useObjectForFlash) {
        // IE下必须有id属性，不然与javascript交互会报错
        // http://drupal.org/node/319079
        html = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" name="baidu_dan_player" ' +
            (info.id ? 'id="baidu_dan_flash_' + info.id + '" ' : '') +
            'width="' + info.width + '" height="' + info.height + '" ' +
            'codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0">' +
                '<param name="allowScriptAccess" value="always" />' +
                '<param name="quality" value="high" />' +
                '<param name="wmode" value="transparent" />' +
                '<param name="movie" value="' + info.src + '" />' +
                (params ? '<param name="flashvars" value="' + params + '" />' : '') +
            '</object>';

    }
    else {
        html = '<embed wmode="transparent" src="' + info.src + '" quality="high" name="baidu_dan_player" ' +
            (info.id ? 'id="' + info.id + '" ' : '') +
            (params ? 'flashVars="' + params + '" ' : '') +
            'width="' + info.width + '" height="' + info.height + '"allowScriptAccess="always" ' +
            'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
    }

    // 没有setTimeout的情况下，部分版本的IE8不会显示
    // setTimeout(function() { container.innerHTML = html; }, 0);
    container.innerHTML = html;

    // 如果交互由flash完成，就不要加点击监控层
    if (!info.flashHosted) {
        createOverlayAnchor(container, info.targetUrl, info.targetWindow);
    }
}

/**
 * 创建图片物料
 *
 * @param {Element} container 放置物料的容器元素.
 * @param {Object} info 广告的相关信息.
 */
function createImageMaterial(container, info) {
    var img = doc.createElement('img');

    img.width = info.width;
    img.height = info.height;
    img.src = info.src;

    // IE6下不改为blcok会有边上的空白
    img.style.display = 'block';

    container.appendChild(img);
    createOverlayAnchor(container, info.targetUrl, info.targetWindow);
}

/**
 * 创建点击监控用的覆盖在物料上的链接元素
 *
 * @param {Element} container 放置物料的容器元素.
 * @param {string} href 点击后打开的URL.
 * @param {string|number} target 打开方式，为数字时0表示原窗口，1表示新窗口.
 */
function createOverlayAnchor(container, href, target) {
    // 收缩的物料是没有点击监控的
    if (!href) {
        return;
    }

    target = anchorTarget[target] || target;

    var anchor = doc.createElement('a'),
        style = anchor.style;

    anchor.href = href;
    anchor.target = target;

    style.position = 'absolute';
    style.zIndex = 999;
    style.top = 0;
    style.width = '100%';
    style.height = '2000px'; // 超大值，依赖于外部的overflow:hidden
    // 在IE和Opera下，如果a元素没有背景色，是无法点击的
    style.backgroundColor = '#fff';
    // Firefox 4.0和Chrome下都有filter样式，虽然不知道什么用的
    // 因此这里最好就是用特性检测
    if (supportOpacity) {
        style.opacity = 0;
    }
    else {
        style.filter = 'alpha(opacity=0)';
        // 在IE下，必须hasLayout才可以使用alhpa filter
        style.zoom = 1;
    }
    // 取消掉点击时的细线
    if ('outline' in style) {
        // 使用outline:0;会略微影响性能，所以使用outline:none;
        style.outline = 'none';
    }
    else {
        // IE用hideFocus
        anchor.hideFocus = true;
    }

    container.insertBefore(anchor, container.firstChild);
}

/**
 * 各控制按钮的配置
 */
var controlConfig = {
    'close': {
        text: '关闭',
        width: 16,
        height: 16,
        offsetX: 0,
        offsetY: 0,
        image: 'http://img.baidu.com/adm/control.gif',
        handler: destroyAd
    },
    'minimize': {
        text: '最小化',
        width: 16,
        height: 16,
        offsetX: -16,
        offsetY: 0,
        image: 'http://img.baidu.com/adm/control.gif',
        handler: toggleToCollapsedMaterial
    }
};

/**
 * 创建物料上的相关控件按钮
 *
 * @param {...string} controls 需要创建的按钮类型（'minimize', 'close'）.
 */
function createControlBar(controls) {
    var i = 0,
        length = arguments.length,
        control,
        element,
        style,
        bar = doc.createElement('div');

    bar.className = 'baidu-dan-control-bar';

    bar.style.overflow = 'hidden'; // 清内部浮动

    for (; i < length; i++) {
        control = arguments[i];
        /*
         * config = {
         *     text: {string},
         *     width: {number},
         *     height: {number},
         *     image: {string},
         *     handler: {function}
         * }
         */
        control = controlConfig[control];
        element = doc.createElement('span');
        style = element.style;

        element.innerHTML = control.text;

        style.width = control.width + 'px';
        style.height = control.height + 'px';
        style.backgroundImage = 'url(' + control.image + ')';
        style.backgroundPosition = control.offsetX + 'px ' + control.offsetY + 'px';
        style.textIndent = '-2000px'; // 大值，保证看不到
        style.overflow = 'hidden'; // 避免字体大小影响撑开width|height
        // IE是styleFloat，w3c浏览器是cssFloat
        if ('cssFloat' in style) {
            style.cssFloat = 'right';
        }
        else {
            style.styleFloat = 'right';
        }

        addEvent(element, 'click', control.handler);

        bar.insertBefore(element, bar.firstChild);
    }

    return bar;
}

var anchorTarget = ['_self', '_blank'];

/*
 * XXX 这个需要跟./core/src/main/java/com/baidu/dan/template/system/constants.vm
 * 保持一致，如果有调整，就需要在这里进行处理
 * materialType：
 *   0 => 标准视频
 *   1 => 非标准视频
 *   2 => Flash
 *   3 => 图片
 *   4 => 富媒体
 *   5 => 带搜索框的标准视频
 *   6 => 角标视频
 */
var contentCreater = [
    // 富媒体物料没有创建函数
    createVideoMaterial, createVideoMaterial, createFlashMaterial,
    createImageMaterial, null, createVideoMaterial, createVideoMaterial
];

/* <物料相关辅助函数> */

/**
 * <p>不同类型创意的toggle相关处理函数</p>
 * <p>每个配置项以创意的类型为键，值包括toMain和toCollapsed这2个函数</p>
 * <p>函数接受4个参数，wrapper为最外层元素，main为主物料的容器元素，collapsed为收缩物料的容器元素，info为广告信息</p>
 * <p>当函数返回falsy值（包括无返回值）时，外部函数会使用display样式进行2个物料间的切换，要阻止这一行为，return true即可</p>
 * <p>当变为收缩物料时，会调用toCollapsed函数；当变为主物料时，会调用toMain函数</p>
 */
var toggler = {
    // 路障相关函数
    // 路障的主物料是居中的，收缩物料是在右下角的，因此切换时需要调整位置
    barrier: {
        toMain: function(wrapper, main, collapsed, info) {
            // 路障的主物料有按钮栏
            wrapper.style.height = (getAdInfo(wrapper).height + controlBarHeight) + 'px';

            // 清理缩放至右下角时的bottom和right
            // 不支持position:fixed的情况下，还是用的top和left，就不用清理了
            if (!requirePositionFix) {
                var style = wrapper.style;

                style.bottom = 'auto';
                style.right = 'auto';
            }

            // 放置在窗口居中
            // id传undefined，避免centerToWindow里添加requirePositionFix的逻辑
            centerToWindow(wrapper, undefined, info.width, info.height);
        },
        toCollapsed: function(wrapper, main, collapsed) {
            var style = wrapper.style;

            // 路障为了居中定位，有margin-top和margin-left
            style.marginTop = 0;
            style.marginLeft = 0;

            // 路障的收缩物料有按钮栏
            style.height = (collapsedMaterialHeight + controlBarHeight) + 'px';

            // 路障居中定位时使用了top和left，要清理掉
            style.top = 'auto';
            style.left = 'auto';
        }
    },

    // 视频相关函数
    // 视频由于收缩时不能取消主物料内的视频，因此不能使用display:none的方式隐藏主物料
    video: {
        toMain: function(wrapper, main, collapsed) {
            var nodeName = useObjectForFlash ? 'object' : 'embed',
                player = main.getElementsByTagName(nodeName)[0];

            putToBottomRight(wrapper);

            // 视频会自动恢复播放，不需要javascript作额外处理
            // 同时开始统计播放时长
            notifyPlayerProgress(player, 'start');

            // 通知外部函数不要再修改display
            return true;
        },
        toCollapsed: function(wrapper, main, collapsed) {
            var nodeName = useObjectForFlash ? 'object' : 'embed',
                player = main.getElementsByTagName(nodeName)[0],
                count = +player.getAttribute(actionCountAttributeName) || 0; // 最小化次数

            // 视频会自己暂停播放，不需要javascript作额外处理
            // 记录最小化次数并发送日志，同时停止播放时长统计
            count++;
            setAttribute(player, actionCountAttributeName, count);
            notifyPlayerProgress(player, 'stop');

            // 通知外部函数不要再修改display
            return true;
        }
    }
};

/**
 * 在主物料显示的状态下，显示为收缩物料
 *
 * @param {Event|Element} e 物料的wrapper元素，或者事件触发的事件对象.
 */
function toggleToCollapsedMaterial(e) {
    e = findWrapperElement(e);

    var type = e.getAttribute(typeAttributeName),
        info = getAdInfo(e),
        // wrapper下一共2个元素，第1个为主物料容器，第2个为收缩物料容器
        main = e.firstChild,
        collapsed = e.lastChild,
        style = e.style;

    // 必须使用setTimeout，不然修改了窗口的width|height后，flash不会有收缩的效果
    setTimeout(function() {
        // 收缩状态的元素默认为collapsedMaterialWidth*collapsedMaterialHeight
        style.width = collapsedMaterialWidth + 'px';
        style.height = collapsedMaterialHeight + 'px';

        //给广告位添加状态属性，标识当前显示收缩物料
        // toggler[type].toCollapsed之前调用，保证发送日志中的tgs参数正确
        e.setAttribute(toggleStateAttributeName, TOGGLE_STATE_COLLAPSED);

        var handled = toggler[type] && toggler[type].toCollapsed(e, main, collapsed, info);

        // 收缩物料统一在右下角（路障除外）
        if (info.productType == 2) {
            putToCenterRight(e, e.getAttribute(idAttributeName));
        } else {
            putToBottomRight(e, e.getAttribute(idAttributeName));
        }

        // 如果主物料和收缩物料是一个，就不用控制了
        if (!handled && main !== collapsed) {
            // 默认使用display来进行隐藏、显示
            main.style.display = 'none';
            collapsed.style.display = 'block';
        }
    }, 0);

    // 作为事件函数调用时，阻止冒泡
    return false;
}

/**
 * 在收缩物料显示的状态下，显示主物料
 *
 * @param {Event|Element} e 物料的wrapper元素，或者事件触发的事件对象.
 */
function toggleToMainMaterial(e) {
    e = findWrapperElement(e);

    var style = e.style,
        info = getAdInfo(e),
        width = info.width,
        height = info.height,
        // wrapper下一共2个元素，第1个为主物料容器，第2个为收缩物料容器
        main = e.firstChild,
        collapsed = e.lastChild,
        type = e.getAttribute(typeAttributeName); // 创意类型

    stopCollapsingTimer(e);

    // 变回主物料大小
    style.width = width + 'px';
    style.height = height + 'px';

    //给广告位添加状态属性，标识当前显示主物料
    // toggler[type].toMain之前调用，保证发送日志中的tgs参数正确
    e.setAttribute(toggleStateAttributeName, TOGGLE_STATE_MAIN);

    var handled = toggler[type] && toggler[type].toMain(e, main, collapsed, info);

    // 如果主物料和收缩物料是一个，就不用控制了
    if (!handled && main !== collapsed) {
        // 默认使用display来进行隐藏、显示
        collapsed.style.display = 'none';
        main.style.display = 'block';
    }

    // 对于不支持position:fixed的浏览器，从scroll事件中去掉对他的判断
    if (requirePositionFix) {
        // 收缩物料肯定是position:fixed的
        // 因此只当主物料不需要position:fixed的时候，删掉对该元素的跟踪即可
        if (!main.getAttribute(positionFixAttributeName)) {
            delete requirePositionFix[info.id];
        }
        applyPositionFix();
    }

    // 一段时间后变为收缩物料
    // 仅对有定时id的用
    if (e.getAttribute(tickAttributeName)) {
        startCollapsingTimer(e, info.maxImpressionTime);
    }

    // 作为事件函数调用时，阻止冒泡
    return false;
}

/**
 * 打开物料收缩用的计时器
 *
 * @param {Element} wrapper 物料的容器元素.
 * @param {number} latency 物料保持时间，以毫秒为单位.
 */
function startCollapsingTimer(wrapper, latency) {
    wrapper.setAttribute(tickAttributeName, setTimeout(function() { toggleToCollapsedMaterial(wrapper); }, latency));
}

/**
 * 关闭物料收缩用的计时器
 *
 * @param {Element} wrapper 物料的容器元素.
 */
function stopCollapsingTimer(wrapper) {
    var tick = +wrapper.getAttribute(tickAttributeName);

    if (tick) {
        clearTimeout(tick);
    }
}

/* <辅助函数区> */

var addEvent = window.addEventListener ?
    function(element, type, fn) { element.addEventListener(type, fn, false); } :
    function(element, type, fn) { element.attachEvent('on' + type, fn); };

var removeEvent = window.removeEventListener ?
    function(element, type, fn) { element.removeEventListener(type, fn, false); } :
    function(element, type, fn) { element.detachEvent('on' + type, fn); };

/**
 * 根据元素上的属性获取对应的广告信息
 *
 * @param {Element} element 广告的wrapper元素.
 *
 * @return {?Object} 对应的广告信息，如果没有找到则返回null.
 */
function getAdInfo(element) {
    // cbbs返回模板中，dan的物料会将相关信息以JSON格式存放在_html属性中
    return buildInfo(element.getAttribute(idAttributeName));
}

/**
 * @param {Object} info 广告的信息
 *
 * @return {string}
 */
function getInitialState(info) {
    if (info['product_type'] == 6) {
        return TOGGLE_STATE_COLLAPSED;
    } else if (info['initial_state']) {
        return info['initial_state'];
    } else {
        return TOGGLE_STATE_MAIN;
    }
}

/**
 * 根据哥伦布广告位的检索结果，组装出display需要的内容
 *
 * @param {string} id 广告位的id.
 * @param {Object=} opt_raw 哥伦布广告位的检索结果对象.
 *
 * @return {Object} display需要的内容.
 */
function buildInfo(id, opt_raw) {
    var raw = opt_raw || store[id];

    // 具体有哪些属性可直接看代码
    var info = raw['_html'];
    return {
        id: id,
        slotWidth: raw['_w'],
        slotHeight: raw['_h'],
        urlParameter: info['url_parameter'],
        productType: info['product_type'],
        materialType: info['material_type'],
        src: info['src'],
        width: info['width'],
        height: info['height'],
        playerUrl: info['player_url'],
        collapseType: info['collapse_type'],
        // XXX defaultCollapseSrc是用来处理非标准视频暂时不支持设置角标的问题，这是
        // 一个临时的解决方案，后续要去掉。
        collapseSrc: (info['collapse_src'] || defaultCollapseSrc),
        //设置播放器初始状态 收缩物料|主物料
        initialState: getInitialState(info),
        targetUrl: info['target_url'],
        targetWindow: info['target_window'],
        htmlCode: info['html_code'],
        maxImpressionTime: (info['max_impression_time'] * 1000) || 5000,
        rcvUrl: info['rcv_url'],
        rcvQuery: info['query']
    };
}

/**
 * 获取页面尺寸
 *
 * @param {Element} junk 有可能会影响到计算的元素.
 *
 * @return {Object} 含有width、height、scrollTop、scrollLeft属性的对象.
 */
function getDimension(junk) {
    var style = junk && junk.style;

    // 由于物料可能放在右下角，这种情况下，如果物料大小变化，可能会出现横、竖向滚动条
    // 滚动条会导致clientHeight|clientWidth变小，再导致位置的计算有错误
    // 因此这里不能单纯地来取clientWidth|clientHeight
    // 事先把元素移到左上角，保证不会出滚动条
    if (style) {
        style.top = '0';
        style.left = '0';
    }

    // 然后计算窗口大小和滚动条
    var dimension = {
        width: root.clientWidth,
        height: root.clientHeight,
        scrollLeft: window.pageXOffset || root.scrollLeft,
        scrollTop: window.pageYOffset || root.scrollTop
    };

    // left和top不需要改回来，因为这个函数调完以后会立刻有定位的逻辑

    return dimension;
}

/**
 * 使元素基于窗口放置到右中，不会调用applyPositionFix，需将元素加入到DOM后手工调用
 *
 * @param {Element} element 需要放置的元素.
 * @param {string} [id] 广告的id.
 * @param {number} [width] 元素的宽度.
 * @param {number} [height] 元素的高度.
 */
function putToCenterRight(element, id, width, height) {
    var style = element.style;

    if (width) {
        style.width = width + 'px';
        style.height = height + 'px';
    }
    else {
        width = element.offsetWidth;
        height = element.offsetHeight;
    }

    if (requirePositionFix) {
        absoluteToCenterRight(element, width, height);

        // 加入跟踪
        if (id) {
            requirePositionFix[id] = element;
        }
    }
    else {
        style.position = 'fixed';
        style.top = '50%';
        style.right = 0;
        style.marginTop = (-(height / 2)).toFixed() + 'px';
    }
}


/**
 * 使元素基于窗口放置到右下角，不会调用applyPositionFix，需将元素加入到DOM后手工调用
 *
 * @param {Element} element 需要放置的元素.
 * @param {string} [id] 广告的id.
 * @param {number} [width] 元素的宽度.
 * @param {number} [height] 元素的高度.
 */
function putToBottomRight(element, id, width, height) {
    var style = element.style;

    if (width) {
        style.width = width + 'px';
        style.height = height + 'px';
    }
    else {
        width = element.offsetWidth;
        height = element.offsetHeight;
    }

    if (requirePositionFix) {
        absoluteToBottomRight(element, width, height);

        // 加入跟踪
        if (id) {
            requirePositionFix[id] = element;
        }
    }
    else {
        style.position = 'fixed';
        style.bottom = 0;
        style.right = 0;
    }
}

/**
 * 使元素基于窗口居中
 *
 * @param {Element} element 需要居中的元素.
 * @param {string} [id] 广告的id.
 * @param {number} [width] 元素的宽度.
 * @param {number} [height] 元素的高度.
 */
function centerToWindow(element, id, width, height) {
    if (requirePositionFix) {
        absoluteToCenter(element, width, height);

        // 加入跟踪
        if (id) {
            requirePositionFix[id] = element;
        }
    }
    else {
        var style = element.style;

        // 标准居中定位
        style.position = 'fixed';
        style.top = '50%';
        style.left = '50%';
        style.marginLeft = (-(width / 2)).toFixed() + 'px';
        style.marginTop = (-(height / 2)).toFixed() + 'px';
    }
}

/**
 * 设置元素位置跟踪模式
 *
 * @param {Element} element 需要设置的元素.
 * @param {number} mode 位置模式，1为居中，2为右下角，3为右中.
 */
function setPositionTrackingMode(element, mode) {
    if (requirePositionFix) {
        setAttribute(element, positionFixAttributeName, mode);
    }
}

/**
 * 从任意元素开始向上查找到广告的wrapper元素
 *
 * @param {Element|Event} e 开始查找的元素，或者事件对象.
 *
 * @return {Element} 查找到的wrapper元素
 */
function findWrapperElement(e) {
    e = e || window.event;

    // Element对象有nodeName属性，用于区别Event和Element
    // Event对象因为浏览器兼容性问题，兼容的属性只有type
    // 但是object和embed元素也有type属性，所以不能检测Event
    if (!('nodeName' in e)) {
        e = e.target || e.srcElement;
    }

    // wrapper的特征就是有data-baidu-dan-id属性
    // 我们认为在自己控制下的广告，一定能找到这个wrapper
    // 因此寄希望于调用者给定的参数是合理的，所以不检查e是否到document不能再向上的问题
    while (e && !e.getAttribute(idAttributeName)) {
        e = e.parentNode;
    }

    return e;
}

/**
 * 在不支持position:fix的情况下放置在相对窗口居中
 *
 * @param {Element} element 需要居中的元素.
 * @param {number} [width] 元素的宽度.
 * @param {number} [height] 元素的高度.
 */
function absoluteToCenter(element, width, height) {
    width = width || element.offsetWidth;
    height = height || element.offsetHeight;

    var style = element.style,
        dimension = getDimension(element);

    // 标准居中法
    style.position = 'absolute';
    style.left = (dimension.scrollLeft + dimension.width / 2) + 'px';
    style.top = (dimension.scrollTop + dimension.height / 2) + 'px';
    style.marginLeft = (-(width / 2)).toFixed() + 'px';
    style.marginTop = (-(height / 2)).toFixed() + 'px';
}

/**
 * 在不支持position:fix的情况下放置在相对窗口右下角
 *
 * @param {Element} element 需要放置在右下角的元素.
 * @param {number} [width] 元素的宽度.
 * @param {number} [height] 元素的高度.
 */
function absoluteToBottomRight(element, width, height) {
    width = width || element.offsetWidth;
    height = height || element.offsetHeight;

    var style = element.style,
        dimension = getDimension(element);

    // 随滚动条右下角
    style.position = 'absolute';
    style.left = (dimension.scrollLeft + dimension.width - width) + 'px';
    style.top = (dimension.scrollTop + dimension.height - height) + 'px';
}

/**
 * 在不支持position:fix的情况下放置在相对窗口右中
 *
 * @param {Element} element 需要放置在右中的元素.
 * @param {number} [width] 元素的宽度.
 * @param {number} [height] 元素的高度.
 */
function absoluteToCenterRight(element, width, height) {
    width = width || element.offsetWidth;
    height = height || element.offsetHeight;

    var style = element.style,
        dimension = getDimension(element);

    // 随滚动条右中
    style.position = 'absolute';
    style.left = (dimension.scrollLeft + dimension.width - width) + 'px';
    style.top = (dimension.scrollTop + ((dimension.height - height) / 2)) + 'px';
}

/**
 * 位置修正的函数
 */
var positionTracker = [null, absoluteToCenter, absoluteToBottomRight, absoluteToCenterRight];

/**
 * 修复IE6不支持position:fixed问题
 */
function applyPositionFix() {
    var id, // 遍历用的key
        element, // 遍历中的HTML元素
        count = 0, // 计算本次修正了多少个元素
        activeElement, // 当前广告容器内处于可见状态的元素
        trackingMode; // 位置模式

    // 根据预先设置的位置模式来摆放元素
    for (id in requirePositionFix) {
        if (hasOwn.call(requirePositionFix, id)) {
            count++;
            element = requirePositionFix[id];
            // 视频物料的主物料隐藏方式不是使用display:none
            // 因此主物料隐藏时，主物料的offsetWidth依旧是有的
            // 所以要从收缩物料开始判断
            activeElement = element.lastChild.offsetWidth ? element.lastChild : element.firstChild;
            trackingMode = activeElement.getAttribute(positionFixAttributeName);

            positionTracker[trackingMode](element);
        }
    }

    // 如果没有需要处理的元素，干脆取消掉事件
    // count是局部变量，保证是number，不用===了
    if (count == 0) {
        scrollEventRegistered = false;
        removeEvent(window, 'scroll', applyPositionFix);
        removeEvent(window, 'resize', applyPositionFix);
    }
    // 如果有需要处理的元素，但scroll事件没注册，则注册一下
    else if (!scrollEventRegistered) {
        scrollEventRegistered = true;
        addEvent(window, 'scroll', applyPositionFix);
        addEvent(window, 'resize', applyPositionFix);
    }
}
var scrollEventRegistered = false;

/* <flash物料回调函数> */
/**
 * 提供给flash物料调用的javascript函数
 *
 * @param {string} id 广告的id.
 * @param {string} type 发生的事件的类型.
 */
function materialCallback(id, type) {
    var wrapper = doc.getElementById('baidu_dan_wrapper_' + id),
        fn = materialCallback[type],
        nodeName = useObjectForFlash ? 'object' : 'embed',
        // wrapper下第一个元素是mainWrapper，里面的flash就是主播放器
        // 仅视频物料使用
        player = wrapper && wrapper.firstChild.getElementsByTagName(nodeName)[0];

    // 视频物料，且需要转换视频的状态
    if (playerStateMovement[type] && wrapper.getAttribute(typeAttributeName) == 'video') {
        setAttribute(player, playerStateAttributeName, playerStateMovement[type]);
    }

    // 找得到wrapper元素 - 广告没被关闭
    // 找得到fn函数 - 回调给定的type是有注册的
    if (wrapper && fn) {
        fn(wrapper, player, id);
    }
}
//注册到全局
window[materialCallbackKey] = materialCallback;

materialCallback['onMinimize'] = toggleToCollapsedMaterial;

materialCallback['onRestore'] = toggleToMainMaterial;

/**
 * 广告被关闭时的事件
 *
 * @param {Element} wrapper 广告的容器元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['onClose'] = function(wrapper, player) {
    // 对标准视频、非标准视频有特殊处理
    if (wrapper.getAttribute(typeAttributeName) === 'video') {
        // 停止进度检测
        notifyPlayerProgress(player, 'stop');
    }

    // 销毁广告
    destroyAd(wrapper);
};

/**
 * 视频加载完毕时的事件
 *
 * @param {Element} wrapper 广告的容器元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['onLoad'] = function(wrapper, player) {
    //判断如果当前显示主物料，则启动定时器定时发送日志
    if (wrapper.getAttribute(toggleStateAttributeName) === TOGGLE_STATE_MAIN) {
        // 发送一次日志
        notifyPlayerProgress(player, 'start');
    } else {
        sendPlayerLog(player);
    }
};

/**
 * 视频播放完毕时的事件
 *
 * @param {Element} wrapper 广告的容器元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['onFinish'] = function(wrapper, player) {
    // 发送一次日志
    notifyPlayerProgress(player, 'stop');
};

/**
 * 视频暂停时的事件
 *
 * @param {Element} wrapper 广告的容器元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['onPause'] = function(wrapper, player) {
    notifyPlayerProgress(player, 'stop');
};

/**
 * 视频恢复播放时的事件
 *
 * @param {Element} wrapper 广告的容器元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['onResume'] = function(wrapper, player) {
    // 开始进度计时
    //判断如果当前显示主物料，则启动定时器定时发送日志
    if (wrapper.getAttribute(toggleStateAttributeName) === TOGGLE_STATE_MAIN) {
        // 发送一次日志
        notifyPlayerProgress(player, 'start');
    } else {
        sendPlayerLog(player);
    }
};

/**
 * 点击暂停的播放按钮
 *
 * @param {Element} wrapper 广告的容器元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['logMousePause'] = function(wrapper, player) {
  var alp = +player.getAttribute(actionLogPauseAttributeName) || 0;
  setAttribute(player, actionLogPauseAttributeName, ++alp);
  sendPlayerLog(player);
};

/**
 * 视频播放完之后用户点击重播的数量
 *
 * @param {Element} wrapper 广告的容器元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['logMouseReplay'] = function(wrapper, player) {
  var alr = +player.getAttribute(actionLogReplayAttributeName) || 0;
  setAttribute(player, actionLogReplayAttributeName, ++alr);
  sendPlayerLog(player);
};

/**
 * 鼠标移动到浮标上面，触发其变成大框的数量
 *
 * @param {Element} wrapper 广告的内容元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['logMouseRestore'] = function(wrapper, player) {
  var alrs = +player.getAttribute(actionLogRestoreAttributeName) || 0;
  setAttribute(player, actionLogRestoreAttributeName, ++alrs);
  sendPlayerLog(player);
};

/**
 * 点击静音按钮的数量
 *
 * @param {Element} wrapper 广告的内容元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['logMouseMute'] = function(wrapper, player) {
  var alm = +player.getAttribute(actionLogMuteAttributeName) || 0;
  setAttribute(player, actionLogMuteAttributeName, ++alm);
  sendPlayerLog(player);
};

/**
 * 点击大框关闭按钮的数量
 *
 * @param {Element} wrapper 广告的内容元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['logMouseMinimize'] = function(wrapper, player) {
  var allc = +player.getAttribute(actionLogLargeCloseAttributeName) || 0;
  setAttribute(player, actionLogLargeCloseAttributeName, ++allc);
  sendPlayerLog(player);
};

/**
 * 点击小框关闭按钮的数量
 *
 * @param {Element} wrapper 广告的内容元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['logMouseClose'] = function(wrapper, player) {
  var alsc = +player.getAttribute(actionLogSmallCloseAttributeName) || 0;
  setAttribute(player, actionLogSmallCloseAttributeName, ++alsc);
  sendPlayerLog(player);
};

/**
 * 点击搜索按钮的数量
 *
 * @param {Element} wrapper 广告的内容元素.
 * @param {Element} player 播放视频的embed元素.
 */
materialCallback['logMouseSearch'] = function(wrapper, player) {
  var als = +player.getAttribute(actionLogSearchAttributeName) || 0;
  setAttribute(player, actionLogSearchAttributeName, ++als);
  sendPlayerLog(player);
};

/**
 * 接口里面定义了，但是不支持哈
 * 要统计搜索日志的次数，从rcv日志里面去拿吧
 * materialCallback['logMouseSearch'] = function(wrapper, player) {
 * }
 */

// 控制相关事件对应的播放器状态转换
var playerStateMovement = {
    onLoad: 'playing',
    onResume: 'playing',
    onPause: 'paused',
    onFinish: 'stopped'
};

/* <标准视频|非标准视频的统计用函数> */

// 生成guid的计数器
var logCounter = 1;

/**
 * 发送视频播放器相关日志
 *
 * @param {Element} player 播放器的元素.
 */
function sendPlayerLog(player) {
    /*
     * 日志参数：
     *   tm - 客户端的时间
     *   l - 播放的时长
     *   m - 用户最小化播放器的次数
     *   s - 检索ID
     *
     *   == al 是 action log的缩写 ==
     *   alp - 点击暂停按钮的数量
     *   alr - 点击重播按钮的数量
     *   alrs - 浮标触发的数量
     *   alm - 点击静音按钮的数量
     *   allc - 点击大框关闭的数量
     *   alsc - 点击小框关闭的数量
     *
     *   以下由urlParameter提供
     *   sid - dn广告位ID
     *   t - 触发形式
     *   aid - dn广告ID
     *   name - 计费名
     *   mid - 物料ID
     */

    var progress = 0,
        //广告位容器
        wrapper = findWrapperElement(player);

    /** @preserveTry */
    try {
      // 默认直接展示角标的时候，播放器还没有初始化完毕，就开始调整位置到
      // 右下角了，此时如果请求播放器的接口，程序就挂了。
      progress = player.prototype_getTime() || 0;
    } catch (e) {
      return false;
    }

    var time = +new Date(), // 客户端时间
        count = +player.getAttribute(actionCountAttributeName) || 0, // 最小化次数
        extra = getAdInfo(wrapper).urlParameter, // 后端给的其他参数
        alp = +player.getAttribute(actionLogPauseAttributeName) || 0,
        alr = +player.getAttribute(actionLogReplayAttributeName) || 0,
        alrs = +player.getAttribute(actionLogRestoreAttributeName) || 0,
        alm = +player.getAttribute(actionLogMuteAttributeName) || 0,
        allc = + player.getAttribute(actionLogLargeCloseAttributeName) || 0,
        alsc = +player.getAttribute(actionLogSmallCloseAttributeName) || 0,
        als = +player.getAttribute(actionLogSearchAttributeName) || 0,
        tgs = wrapper.getAttribute(toggleStateAttributeName) || TOGGLE_STATE_MAIN, //当前广告容器显示的物料类型 主物料/收缩物料
        url = logBaseUrl + '?' + extra + '&tm=' + E(time) +
            '&l=' + E(progress) + '&m=' + E(count) +
            '&alp=' + E(alp) + '&alr=' + E(alr) +
            '&alrs=' + E(alrs) + '&alm=' + E(alm) +
            '&allc=' + E(allc) + '&alsc=' + E(alsc) +
            '&als=' + E(als) +
            '&tgs=' + E(tgs) +
            '&.stamp=' + Math.random(), // 必须添加一个随机数，才能保证IE下面如果同时发起两个请求，这两个是都能发起的。
        img = new Image(),
        key = 'baidu_dan_log_' + (logCounter++) + '_' + time;

    // 利用img标签发送请求
    // img必须挂在window下，不然被垃圾回收的话会产生abort
    // http://hi.baidu.com/meizz/blog/item/a0f4fc0ae9d8be1694ca6b05.html
    window[key] = img;
    img.onload = img.onerror = img.onabort = function() { window[key] = undefined; img = null; };
    img.src = url;

    return true;
}

/**
 * 发送信息通知后端播放器播放进度
 *
 * @param {Element} player 播放器元素.
 * @param {string=} opt_mode 逻辑模式，为'start'时会打开计时器，为'stop'时会关闭定时器，为undefined时则无额外逻辑.
 */
function notifyPlayerProgress(player, opt_mode) {
    sendPlayerLog(player);

    switch (opt_mode) {
        case 'start':
            // 安全些，无论如何都先停止一下
            clearInterval(+player.getAttribute(tickAttributeName));

            // 开始进度计时
            // tick加在player上，在toggleToMainMaterial时取的是wrapper上的，不会受影响
            // 确保只在在播放的情况下才会开定时器
            if (player.getAttribute(playerStateAttributeName) == 'playing') {
                setAttribute(
                    player,
                    tickAttributeName,
                    setInterval(function() { notifyPlayerProgress(player); }, playerProgressCheckInterval)
                );
            }
            break;
        case 'stop':
            // 停止进度检测
            clearInterval(+player.getAttribute(tickAttributeName));
            break;
    }
}

/* <执行区域> */
// 处理需要投放的广告
var readySlotId = window[clbSharingKey];
if (readySlotId) {
    showAd(readySlotId);
    try {
        delete window[clbSharingKey];
    }
    catch (ex) {
        // IE下无法delete
        window[clbSharingKey] = undefined;
    }
}
