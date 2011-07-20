/*
 * imgAreaSelect jQuery plugin
 * version 0.9.8
 *
 * Copyright (c) 2008-2011 Michal Wojciechowski (odyniec.net)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://odyniec.net/projects/imgareaselect/
 *
 */

goog.require('er.template');

goog.provide('baidu.imgselect');

(function() {
  
var abs = Math.abs,
    max = Math.max,
    min = Math.min,
    round = Math.round;
    
var getStyle = baidu.dom.getStyle;
    setStyle = baidu.dom.setStyle;

baidu.imgselect = function (img, options) {
    var

        $img = img,

        imgLoaded,

        $box = baidu.g(options.boxId),
        $area = baidu.g(options.areaId),
        $border = baidu.dom.query('[class^=' + options.borderClassPrefix + ']'),
        $outer = baidu.dom.q(options.outerClassName),

        left, top,

        imgOfs = { left: 0, top: 0 },

        imgWidth, imgHeight,

        $parent,

        parOfs = { left: 0, top: 0 },

        zIndex = 0,

        position = 'absolute',

        startX, startY,

        scaleX, scaleY,

        resize,

        minWidth, minHeight, maxWidth, maxHeight,

        shown,

        x1, y1, x2, y2,

        selection = { x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0 },

        docElem = document.documentElement,
        //临时变量，遍历img dom对象及path路径上的所有祖先对象时暂存当前节点对象
        $p, 
        d, 
        i, 
        o, 
        w, 
        h, 
        adjusted;

    function viewX(x) {
        return x + imgOfs.left - parOfs.left;
    }

    function viewY(y) {
        return y + imgOfs.top - parOfs.top;
    }

    function selX(x) {
        return x - imgOfs.left + parOfs.left;
    }

    function selY(y) {
        return y - imgOfs.top + parOfs.top;
    }

    function evX(event) {
        return event.pageX - parOfs.left;
    }

    function evY(event) {
        return event.pageY - parOfs.top;
    }

    function getSelection(noScale) {
        var sx = noScale || scaleX, sy = noScale || scaleY;

        return { x1: round(selection.x1 * sx),
            y1: round(selection.y1 * sy),
            x2: round(selection.x2 * sx),
            y2: round(selection.y2 * sy),
            width: round(selection.x2 * sx) - round(selection.x1 * sx),
            height: round(selection.y2 * sy) - round(selection.y1 * sy) };
    }

    function setSelection(x1, y1, x2, y2, noScale) {
        var sx = noScale || scaleX, sy = noScale || scaleY;

        selection = {
            x1: round(x1 / sx || 0),
            y1: round(y1 / sy || 0),
            x2: round(x2 / sx || 0),
            y2: round(y2 / sy || 0)
        };

        selection.width = selection.x2 - selection.x1;
        selection.height = selection.y2 - selection.y1;
    }

    function fadeIn(elem, speed){
        
        baidu.dom.setStyle(elem, 'opacity', 0);
        
        var opacity = 0, step = 0.05;
        
        speed = !isNaN(speed) ? speed : 600;
        
        function go(){
            opacity = opacity + step;
            baidu.dom.setStyle(elem, 'opacity', opacity);
            if(opacity < 1){
                setTimeout(go, speed / (1 / step));
            }
        }
        go();
        
    }
    
    
    function adjust() {
        if (!baidu.dom.getStyle($img, 'width'))
            return;
        
        imgOfs = baidu.dom.getPosition($img);

        imgWidth = parseInt(baidu.dom.getStyle($img, 'width'));
        imgHeight = parseInt(baidu.dom.getStyle($img, 'height'));

        imgOfs.top += (parseInt(getStyle($img, 'border-top-width')) + parseInt(getStyle($img, 'border-bottom-width'))) >> 1;
        imgOfs.left += (parseInt(getStyle($img, 'border-left-width')) + parseInt(getStyle($img, 'border-right-width'))) >> 1;
        
        parOfs = baidu.dom.getPosition($parent);
            
        parOfs = /absolute|relative/.test(baidu.dom.getStyle($parent, 'position')) ?
            { left: parOfs.left - $parent.scrollLeft,
                top: parOfs.top - $parent.scrollTop } :
            position == 'fixed' ?
                { left: document.body.scrollLeft, top: document.body.scrollTop } :
                { left: 0, top: 0 };

        left = viewX(0);
        top = viewY(0);

        if (selection.x2 > imgWidth || selection.y2 > imgHeight)
            doResize();
    }

    function update(resetKeyPress) {
        if (!shown) return;
        
        w = selection.width;
        h = selection.height; 
        
        //设置box容器
        baidu.dom.setStyles($box, {
            left: viewX(selection.x1), 
            top: viewY(selection.y1),
            width: w,
            height: h
        });
        
        baidu.dom.setStyles($area, {
            left: 0,
            top: 0,
            width: w,
            height: h
        });
        
        baidu.array.each($border, function(dom){
            baidu.dom.setStyles(dom, {
	            left: 0,
	            top: 0,
                width: max(w - parseInt(getStyle(dom, 'border-left-width')) - parseInt(getStyle(dom, 'border-right-width')), 0),
                height: max(h - parseInt(getStyle(dom, 'border-top-width')) - parseInt(getStyle(dom, 'border-bottom-width')), 0)
	        });
        });
        
        baidu.dom.setStyles($outer[0], {
            left: left,
            top: top,
            width: selection.x1,
            height: imgHeight
        });
        
        baidu.dom.setStyles($outer[1], {
            left: left + selection.x1,
            top: top,
            width: w,
            height: selection.y1
        });
        
        baidu.dom.setStyles($outer[2], {
            left: left + selection.x2,
            top: top,
            width: imgWidth - selection.x2,
            height: imgHeight
        });
        
        baidu.dom.setStyles($outer[3], {
            left: left + selection.x1,
            top: top + selection.y2,
            width: w,
            height: imgHeight - selection.y2
        });
        
        if (baidu.browser.ie && (getStyle(dom, 'border-left-width') + getStyle(dom, 'border-right-width') == 2)) {
            baidu.array.each($border, function(dom){
	            baidu.dom.setStyles(dom, {
	                margin: 0
	            });
	        });
            setTimeout(function () {
                baidu.array.each($border, function(dom){
	                baidu.dom.setStyles(dom, {
	                    margin: 'auto'
	                });
	            });
            }, 0);
        }
    }

    function doUpdate() {
        adjust();
        update();
        x1 = viewX(selection.x1); y1 = viewY(selection.y1);
        x2 = viewX(selection.x2); y2 = viewY(selection.y2);
    }

    function hide($elem) {
        
        if(!baidu.lang.isArray($elem)){
            $elem = [$elem];
        }
        
        baidu.array.each(function(elem){
            setStyle(elem, 'display', 'none');
        });

    }

    
    function areaMouseMove(event) {
      
      console.log(arguments.callee);
        var x = selX(evX(event)) - selection.x1,
            y = selY(evY(event)) - selection.y1;

        if (!adjusted) {
            adjust();
            adjusted = true;

            baidu.event.once($box, 'mouseout', function () { adjusted = false; });
        }

        resize = '';

        if (options.resizable) {
            if (y <= options.resizeMargin)
                resize = 'n';
            else if (y >= selection.height - options.resizeMargin)
                resize = 's';
            if (x <= options.resizeMargin)
                resize += 'w';
            else if (x >= selection.width - options.resizeMargin)
                resize += 'e';
        }

        setStyle($box, 'cursor', resize ? resize + '-resize' :
            options.movable ? 'move' : '');
    }
    
    //裁剪结束后，鼠标松开时触发的事件
    function docMouseUp(event) {
        console.log(arguments.callee);
        setStyle(document.body, 'cursor', '')
        
        if (options.autoHide || selection.width * selection.height == 0){
            hide($box);
            hide($outer);
        }
        
        baidu.event.un(document, 'mousemove', selectingMouseMove);
        
        baidu.event.on($box, 'mousemove', areaMouseMove)
        
        options.onSelectEnd(img, getSelection());
    }
    //对已裁剪图片进行移动或者缩放开始时的响应handle
    function areaMouseDown(event) {
      
      console.log(arguments.callee);
      
        if (event.which != 1) return false;

        adjust();

        if (resize) {
            
            setStyle(document.body, 'cursor', resize + '-resize');

            x1 = viewX(selection[/w/.test(resize) ? 'x2' : 'x1']);
            y1 = viewY(selection[/n/.test(resize) ? 'y2' : 'y1']);

            baidu.event.on(document, 'mousemove', selectingMouseMove);
            baidu.event.once(document, 'mouseup', docMouseUp);
            baidu.event.un($box, 'mousemove', areaMouseMove);
            
        }
        else if (options.movable) {
            startX = left + selection.x1 - evX(event);
            startY = top + selection.y1 - evY(event);

            baidu.event.un($box, 'mousemove', areaMouseMove);

            baidu.event.on(document, 'mousemove', movingMouseMove);
            baidu.event.once(document, 'mouseup', function () {
                options.onSelectEnd(img, getSelection());
                
                baidu.event.un(document, 'mousemove', movingMouseMove);
                baidu.event.on($box, 'mousemove', areaMouseMove);
            });
            
        }
        else
            $img.mousedown(event);

        return false;
    }
    
    //检查选择区域的长宽比、最大、最小宽度/高度约束
    function doResize() {
        x1 = min(x1, left + imgWidth);
        y1 = min(y1, top + imgHeight);

        if (abs(x2 - x1) < minWidth) {
            x2 = x1 - minWidth * (x2 < x1 || -1);

            if (x2 < left)
                x1 = left + minWidth;
            else if (x2 > left + imgWidth)
                x1 = left + imgWidth - minWidth;
        }

        if (abs(y2 - y1) < minHeight) {
            y2 = y1 - minHeight * (y2 < y1 || -1);

            if (y2 < top)
                y1 = top + minHeight;
            else if (y2 > top + imgHeight)
                y1 = top + imgHeight - minHeight;
        }

        x2 = max(left, min(x2, left + imgWidth));
        y2 = max(top, min(y2, top + imgHeight));

        selection = { x1: selX(min(x1, x2)), x2: selX(max(x1, x2)),
            y1: selY(min(y1, y2)), y2: selY(max(y1, y2)),
            width: abs(x2 - x1), height: abs(y2 - y1) };

        update();

        options.onSelectChange(img, getSelection());
    }
    
    //通过鼠标拖拽进行选择时的鼠标事件
    function selectingMouseMove(event) {
        console.log(arguments.callee);
        x2 = /w|e|^$/.test(resize) ? evX(event) : viewX(selection.x2);
        y2 = /n|s|^$/.test(resize) ? evY(event) : viewY(selection.y2);

        doResize();

        return false;

    }

    //移动已选择区域
    function doMove(newX1, newY1) {
        x2 = (x1 = newX1) + selection.width;
        y2 = (y1 = newY1) + selection.height;

        baidu.object.extend(selection, { x1: selX(x1), y1: selY(y1), x2: selX(x2),
            y2: selY(y2) });

        update();

        options.onSelectChange(img, getSelection());
    }
    //移动已选择区域事件handle
    function movingMouseMove(event) {
        console.log(arguments.callee);
        x1 = max(left, min(startX + evX(event), left + imgWidth - selection.width));
        y1 = max(top, min(startY + evY(event), top + imgHeight - selection.height));

        doMove(x1, y1);
    
        event.preventDefault();

        return false;
    }
    //裁剪图片时候，首先由image的click事件响应，在click事件中注册document的mousemove事件和mouseup事件，其中
    //mousemove对应startSelection，在startSelection中改变mousemove的响应函数为selectingMouseMove
    function startSelection() {
        console.log(arguments.callee);
        baidu.event.un(document, 'mousemove', startSelection);
        adjust();

        x2 = x1;
        y2 = y1;

        doResize();

        resize = '';
        
        if (baidu.dom.getStyle($outer[0], 'visibility') !== 'visible') {
            
            hide($box);
            fadeIn($box);
            
            baidu.array.each($outer, function(elem){
                hide(elem);
                fadeIn(elem);
            });
            
        }

        shown = true;
        
        baidu.event.un(document, 'mouseup', cancelSelection);
        baidu.event.on(document, 'mousemove', selectingMouseMove);
        baidu.event.once(document, 'mouseup', docMouseUp);
        baidu.event.un($box, 'mousemove', areaMouseMove);

        options.onSelectStart(img, getSelection());
    }
    
    //mouseup对应cancelSelection
    function cancelSelection() {
        console.log(arguments.callee);
        baidu.event.un(document, 'mousemove', startSelection);
        baidu.event.un(document, 'mouseup', cancelSelection);
        hide($box);
        hide($outer);

        setSelection(selX(x1), selY(y1), selX(x1), selY(y1));

        if (!this instanceof baidu.imgselect) {
            options.onSelectChange(img, getSelection());
            options.onSelectEnd(img, getSelection());
        }
    }
    //对图片进行选择、拖拽等入口事件
    function imgMouseDown(event) {
        
        console.log(arguments.callee);
        
        if (event.which != 1) return false; // || $outer.is(':animated')

        adjust();
        startX = x1 = evX(event);
        startY = y1 = evY(event);

        baidu.event.on(document, 'mousemove', startSelection);
        baidu.event.on(document, 'mouseup', cancelSelection);

        return false;
    }

    function windowResize() {
        doUpdate(false);
    }

    function imgLoad() {
        imgLoaded = true;

        setOptions(options = baidu.object.extend({
            classPrefix: 'imgareaselect',
            movable: true,
            parent: document.body,
            resizable: true,
            resizeMargin: 10,
            onInit: function () {},
            onSelectStart: function () {},
            onSelectChange: function () {},
            onSelectEnd: function () {}
        }, options));
        
        setStyle($box, 'visibility', '');
        
        baidu.array.each($outer, function(elem){
            setStyle(elem, 'visibility', '');
        });

        if (options.show) {
            shown = true;
            adjust();
            update();
            
            
            hide($box);
            fadeIn($box);
            
            baidu.array.each($outer, function(elem){
                hide(elem);
                fadeIn(elem);
            });
            //$box.add($outer).hide().fadeIn(options.fadeSpeed||0);
        }

        setTimeout(function () { options.onInit(img, getSelection()); }, 0);
    }
    
    
    function styleOptions($elem, props) {
        
        $elem = baidu.lang.isArray($elem) ? $elem : [$elem];
        
        for (option in props)
            if (options[option] !== undefined){
                baidu.array.each($elem, function(elem){
                    setStyle(elem, props[option], options[option]);
                });
            }
    }

    function setOptions(newOptions) {
        if (newOptions.parent){
            $parent = newOptions.parent;
            $parent.appendChild($box);
            baidu.array.each($outer, function(elem){
                $parent.appendChild(elem);
            });
        }
        
        if (options.enable === undefined && options.disable === undefined)
            options.enable = true;
        
        baidu.object.extend(options, newOptions);

        adjust();

        scaleX = options.imageWidth / imgWidth || 1;
        scaleY = options.imageHeight / imgHeight || 1;

        if (newOptions.x1 != null) {
            setSelection(newOptions.x1, newOptions.y1, newOptions.x2,
                newOptions.y2);
            newOptions.show = !newOptions.hide;
        }
        
        baidu.array.each($outer, function(elem){
            baidu.dom.addClass(elem, options.classPrefix + '-outer');
        });
        baidu.dom.addClass($area, options.classPrefix + '-selection');
        
        for (i = 0; i++ < 4;){
            baidu.dom.addClass($border[i-1], options.classPrefix + '-border' + i);
        }

        styleOptions($area, { selectionColor: 'background-color',
            selectionOpacity: 'opacity' });
        styleOptions($border, { borderOpacity: 'opacity',
            borderWidth: 'border-width' });
        styleOptions($outer, { outerColor: 'background-color',
            outerOpacity: 'opacity' });
        if (o = options.borderColor1){
            baidu.dom.setStyles($border[0], { borderStyle: 'solid', borderColor: o });
        }
        if (o = options.borderColor2){
            baidu.dom.setStyles($border[1], { borderStyle: 'dashed', borderColor: o });
        }

        $box.appendChild($area);
        baidu.array.each($border, function(elem){
            $box.appendChild(elem);
        });
        
        if (baidu.browser.ie) {
            if (o = baidu.dom.getStyle($outer[0], 'filter').match(/opacity=(\d+)/)){
                baidu.array.each($outer, function(elem){
                    baidu.dom.setStyle(elem, 'opacity', o[1]/100);
                });
            }
            if (o = $border.css('filter').match(/opacity=(\d+)/)){
                baidu.array.each($border, function(elem){
                    baidu.dom.setStyle(elem, 'opacity', o[1]/100);
                });
            }
        }

        if (newOptions.hide){
            hide($box);
            hide($outer);
        }
        else if (newOptions.show && imgLoaded) {
            shown = true;
            
            fadeIn($box);
            
            baidu.array.each($outer, function(elem){
                fadeIn(elem);
            });
            //$box.add($outer).fadeIn(options.fadeSpeed||0);
            doUpdate();
        }

        baidu.event.un($img, 'mousedown', imgMouseDown);
        baidu.array.each($outer, function(elem){
            baidu.event.un(elem, 'mousedown', imgMouseDown);
        });

        if (options.disable || options.enable === false) {
            baidu.event.un($box, 'mousemove', areaMouseMove);
            baidu.event.un($box, 'mousedown', areaMouseDown);
            baidu.event.un(window, 'resize', windowResize);
        }
        else {
            if (options.enable || options.disable === false) {
                if (options.resizable || options.movable){
                    baidu.event.on($box, 'mousemove', areaMouseMove);
                    baidu.event.on($box, 'mousedown', areaMouseDown);
                }
                baidu.event.on(window, 'resize', windowResize);
            }

            if (!options.persistent){
                
                baidu.event.on($img, 'mousedown', imgMouseDown);
                baidu.event.on($outer, 'mousedown', imgMouseDown);
            }
        }

        options.enable = options.disable = undefined;
    }

    this.remove = function () {
        setOptions({ disable: true });
        baidu.dom.remove($box);
        baidu.dom.remove($outer);
    };

    this.getOptions = function () { return options; };

    this.setOptions = setOptions;

    this.getSelection = getSelection;

    this.setSelection = setSelection;

    this.cancelSelection = cancelSelection;

    this.update = doUpdate;

    $p = $img;

    while ($p && $p.tagName.toLowerCase() !== 'body') {
        zIndex = max(zIndex,
            !isNaN(baidu.dom.getStyle($p, 'z-index')) ? baidu.dom.getStyle($p, 'z-index') : zIndex);
        if (baidu.dom.getStyle($p, 'position') == 'fixed')
            position = 'fixed';

        $p = $p.parentNode;
    }

    zIndex = options.zIndex || zIndex;

    if (baidu.browser.ie){
        baidu.dom.setAttr('unselectable', 'on');
    }

    baidu.imgselect.keyPress = baidu.browser.ie ||
        baidu.browser.safari ? 'keydown' : 'keypress';
    
    baidu.dom.setStyles($box, { visibility: 'hidden', position: position,
        overflow: 'hidden', zIndex: zIndex + 2 || 2 });
    
    baidu.array.each($outer, function(elem){
        baidu.dom.setStyles(elem, { visibility: 'hidden', position: position,
            overflow: 'hidden', zIndex: zIndex || '0' });
    });
        
    baidu.dom.setStyles($area, { position: 'absolute', fontSize: 0 });
    
    baidu.array.each($border, function(elem){
        baidu.dom.setStyles(elem, { position: 'absolute', fontSize: 0 });
    });
   
    img.complete || img.readyState == 'complete' || ($img.tagName === 'img') ?
        imgLoad() : baidu.event.once($img, 'load', imgLoad);

   if (baidu.browser.ie && baidu.browser.ie >= 7)
        img.src = img.src;
};

})();
