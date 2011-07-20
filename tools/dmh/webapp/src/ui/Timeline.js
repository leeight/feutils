/**
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/Timeline.js
 * desc:    时间线控件
 * author:  maoquan
 * date:    $Date: 2011-07-7 17:11:50 +0800 (周日, 12 六月 2011) $
 */

goog.require('er.template');
goog.require('ui.Control');

goog.include('css/ui-timeline.css');
goog.include('ui/Timeline.html');

goog.provide('ui.Timeline');



/**
 * ui.Timeline
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.Timeline = function(options) {
  ui.Control.call(this, options);
};

ui.Timeline.prototype = (function(){
  
  
  function getTimelinePosition(me){
    var timelineDom = baidu.g(me.timelineId);
    if(baidu.browser.ie){
        return baidu.dom.getStyle(timelineDom,'backgroundPositionX') + ' ' +  baidu.dom.getStyle(timelineDom,'backgroundPositionY');
    }
    return baidu.dom.getStyle(timelineDom,'background-position');
  }
  
  function setPositionLeft(me, posLeft){
    //设置进度条
    if(baidu.browser.ie){
        //IE下只需单独设置left值
        baidu.dom.setStyle(baidu.g(me.timelineId),'backgroundPositionX', posLeft + 'px');
    }else {
        baidu.dom.setStyle(baidu.g(me.timelineId),'background-position', posLeft + 'px ' + me.initPositionTop + 'px');
    }
    //设置拖拽手柄
    baidu.dom.setStyle(baidu.g(me.dragHanderId),'left', posLeft + Math.abs(me.initPositionLeft) + 'px');
    
  }
  
  return {
    
    type : 'timeline',
    
    //播放按钮ID
    btnPlayId : 'timelineBtnPlay',
    //暂停按钮ID
    btnPauseId : 'timelineBtnPause',
   //上一帧按钮ID
    btnPreId : 'timelineBtnPre',
    //下一帧按钮ID
    btnNextId : 'timelineBtnNext',
    //时间轴ID
    timelineId : 'timelineshow',
    //拖拽时间轴的控件ID
    dragHanderId : 'btnDragHander',
    //右键上下文菜单
    contextmenuId : 'timelineContextmenu',
    //显示图片信息的容器ID
    videoInfoId : 'videoInfo',
    //图片播放器ID
    picBoxId : 'picBox',
    //当前视频播放信息容器ID
    operateInfoId : 'curFrame',
    //图片路径
    picPath : '',
    //时间线的容器宽度
    tlWidth : 0,
    //步进长度
    stepWidth : 0,
    //帧宽度
    frameWidth : 0,
    //帧宽度
    frameHeight : 0,
    //初始时间线的position left位置
    initPositionLeft : 0,
    //初始时间线的position top位置
    initPositionTop : 0,
    //当前所在帧
    curPos : 1,
    //播放器状态 start / playing / pause
    status : 'start',
    //当前控件容器在文档中的位置，用于定位右键菜单,包含left和top属性
    position : {},
    //片头截断帧数
    headFrameCount : 0,
    //片尾截断帧数
    tailFrameCount : 0,
    //片头截断帧数对应表单控件
    headFrameCountControlId : 'formVideoEdit_convertForm_txtVideoStartFrameCount',
    //片尾截断帧数对应表单控件
    tailFrameCountControlId : 'formVideoEdit_convertForm_txtVideoEndFrameCount',

    onNext : function(){
    },
    
    onPre : function(){
    },
    
    onChange : function(){
      //同步图片播放器的进度
      this.setCurPic();
    },
    
    init : function(){
	    var me = this;
	    
	    ui.Timeline.superClass.render.call(me);
	},
  
    render : function(opt_main) {
            
	    var me = this;
	    var main = opt_main || me.main;
	
	    main.innerHTML = me.getHtml();
        
	    ui.Timeline.superClass.render.call(me, main);
        
        //设置播放器容器的宽度、高度
        baidu.dom.setStyle(me.picBoxId, 'width', video.config.size.FIXED_OPERATE_WIDTH + 'px');
        baidu.dom.setStyle(me.picBoxId, 'height', video.config.size.FIXED_OPERATE_WIDTH * me.model.height / me.model.width + 50);
        
        var positionArr = getTimelinePosition(me).split(' ');
        
        me.initPositionLeft = parseInt(positionArr[0]);
        me.initPositionTop = parseInt(positionArr[1]);
        me.stepWidth = Math.abs(me.initPositionLeft) / (me.model.count - 1);
        me.picPath = video.config.FFMPEG_PATH + me.model.target + '/';
        me.position = baidu.dom.getPosition(me.main);
	},
    
    /**
	 * 获取HTML
	 *
	 * @private
	 * @return {string} html代码.
	 */
	getHtml : function() {
	  var me = this,
	      tpl = er.template.get('Timeline');
	
	  return baidu.format(tpl,
	      this.btnPreId,
	      this.btnPlayId,
	      this.btnPauseId,
	      this.btnNextId,
	      this.timelineId,
          this.dragHanderId,
          this.picBoxId,
          this.operateInfoId,
          this.contextmenuId
	  );
	},
    
    bindEvent : function(){
      
      var me = this;
      //播放下一帧按钮事件
      baidu.event.on(baidu.g(me.btnNextId), "click", function(e){
        me.next();
        baidu.event.preventDefault(e);
      });
      //播放上一帧按钮事件
      baidu.event.on(baidu.g(me.btnPreId), "click", function(e){
        me.pre();
        baidu.event.preventDefault(e);
      });
      //播放事件
      baidu.event.on(baidu.g(me.btnPlayId), "click", function(e){
        me.play();
        baidu.event.preventDefault(e);
      });
      
      //暂停播放事件
      baidu.event.on(baidu.g(me.btnPauseId), "click", function(e){
        me.pause();
        baidu.event.preventDefault(e);
      });
      
      //右键菜单事件
      baidu.event.on(baidu.g(me.picBoxId), "contextmenu", baidu.fn.bind(me.showContextMenu, me));
      
      //右键菜单事件
      baidu.event.on(baidu.g(me.picBoxId), "click", function(e){
        //隐藏菜单
        baidu.dom.setStyle(me.contextmenuId, 'display', 'none');
        //阻止浏览器默认事件
        baidu.event.preventDefault(e);
      });
      
      //为菜单各行添加鼠标悬浮变色 / 点击事件
      baidu.array.each(baidu.dom.query('#' + me.contextmenuId + ' .timeline-contextmenu-row'),function(dom){
        
        baidu.event.on(dom, "mouseover", function(e){
          baidu.dom.setStyle(this, 'backgroundColor', '#cdcdcd');
          baidu.event.preventDefault(e);
        });
        
        baidu.event.on(dom, "mouseout", function(e){
          baidu.dom.setStyle(this, 'backgroundColor', '#ffffff');
          baidu.event.preventDefault(e);
        });
        
        baidu.event.on(dom, "click", function(e){
          //视频裁剪操作
          me.cut(this.getAttribute('ref') === 'head-part');
          //隐藏菜单
          baidu.dom.setStyle(me.contextmenuId, 'display', 'none');
          baidu.event.preventDefault(e);
        });
        
      });
      
      baidu.dom.draggable(baidu.g(me.dragHanderId),{
        //限制拖拽范围在进度条上
        range : [0, 15 + Math.abs(me.initPositionLeft), 15, 0],
        //拖拽中同步进度条和拖拽手柄
        ondrag : function(dom, obj){
          me.curPos = parseInt(parseInt(baidu.dom.getStyle(dom, 'left')) / me.stepWidth) + 1 + me.headFrameCount;
          me.slide();
        },
        //拖拽结束后将拖拽手柄与进度条重合
        ondragend : function(dom, obj){
          baidu.dom.setStyle(dom, 'left', parseInt((me.curPos - me.headFrameCount - 1) * me.stepWidth));
          me.slide();
        }
        
      });
      
      me.addListener(ui.events.TIMELINE_NEXT, function() {
        me.onNext(me);
      });
      
      me.addListener(ui.events.TIMELINE_PRE, function() {
        me.onPre(me);
      });
      
      me.addListener(ui.events.TIMELINE_CHANGE, function() {
        me.onChange(me);
      });
      
      me.addListener(ui.events.TIMELINE_FIRST_SHOWPIC, function(img) {
        me.onFirstShowPic(img);
      });
      
      ui.Timeline.superClass.bindEvent.call(me);
    },
    /**
     * 帧上的右键菜单事件
     */
    showContextMenu : function(e){
        
        var me = this;
        
        var positionLeft, positionTop;
        
        if(baidu.browser.ie){
            positionLeft = e.offsetX + 15;
            positionTop = e.offsetY + 15;
        }else {
            positionLeft = e.pageX - me.position.left + 15;
            positionTop = e.pageY - me.position.top + 15;
        }
        
	    //设置菜单显示位置
	    baidu.dom.setPosition(me.contextmenuId, {left : positionLeft, top : positionTop});
	    
	    baidu.array.each(baidu.dom.query('.timeline-contextmenu-row'),function(dom){
	      var tpl = er.template.get('TimelineContextmenuCutContent');
	      if(dom.getAttribute('ref') === 'head-part'){
	        dom.innerHTML = baidu.format(tpl, 1, me.curPos);
	      }else if(dom.getAttribute('ref') === 'tail-part'){
	        dom.innerHTML = baidu.format(tpl, me.curPos, me.model.count);
	      }
	    });
	    //显示菜单
	    baidu.dom.setStyle(me.contextmenuId, 'display', 'block');
	    //阻止浏览器默认事件
	    baidu.event.preventDefault(e);
	  },
    
    /**
     * 设置该控件的响应函数
     */
    setListeners : function(listeners){
        
        var me = this;
        
        if(baidu.lang.isObject(listeners)){
            baidu.object.each(listeners, function(listener, eventName){
                if(baidu.lang.isFunction(listener)){
                    //事件名称转为onXxxx格式
                    eventName = 'on' + eventName.slice(0,1).toUpperCase() + eventName.slice(1);
                    me[eventName] = listener;
                }
            });
        }
    },
    
    /**
     * @param {Boolean=(true|false)} action 控制时间线 前进/后退 的参数
     */
    slide : function(action){
      
      var me = this;
      
      var curPositionLeft = me.initPositionLeft + (me.curPos - me.headFrameCount - 1) * me.stepWidth;
      
      if(action){
        curPositionLeft = Math.min(curPositionLeft, 0);
      }else {
        curPositionLeft = Math.max(curPositionLeft, me.initPositionLeft);
      }  
      
      setPositionLeft(me, curPositionLeft);
      
      //触发onChange事件
      me.trigger(ui.events.TIMELINE_CHANGE);
    },
    /**
     * 后退一帧
     */
    pre : function(){
      if(this.curPos <= this.headFrameCount + 1){
        this.curPos = this.headFrameCount + 1;
        setPositionLeft(this, this.initPositionLeft);
        return false;
      }
      this.curPos--;
      this.slide(false);
      return true;
    },
    /**
     * 前进一帧
     */
    next : function(){
      
      var me = this;
      
      if(me.curPos >= me.getCurplusFrameCount() + me.headFrameCount){
        me.curPos = me.getCurplusFrameCount() + me.headFrameCount;
        setPositionLeft(me, 0);
        //如果当前为播放模式，且播放到最后一帧，则切换状态
        me.status === 'playing' && me.toggle();
        return false;//通知停止播放
      }
      me.curPos++;
      me.slide(true);
      return true;
    },
    /**
     * 播放预览
     */
    play : function(){
      
      var me = this;
      
      //支持重播
      if(me.curPos >= me.getCurplusFrameCount() + me.headFrameCount){
        me.curPos = me.headFrameCount;
      }

      me.toggle();
      
      function go(){
		if(me.next() && me.status === 'playing'){
			setTimeout(arguments.callee, me.model.timePerFrame || 40);
		}
      }
      go();
    },
    
    /**
     * 暂停播放
     */
    pause : function(){
      this.toggle();
    },
    
    /**
     * 播放/暂停 切换
     */
    toggle : function(){
      
      var me = this;
      if(me.status === 'playing'){
        //设置状态
		me.status = 'pause';
		//按钮切换
		baidu.dom.setStyle(me.btnPlayId, 'display', 'inline');
		baidu.dom.setStyle(me.btnPauseId, 'display', 'none');
      }else {
        //设置播放器状态
        me.status = 'playing';
        //按钮切换
        baidu.dom.setStyle(me.btnPlayId, 'display', 'none');
        baidu.dom.setStyle(me.btnPauseId, 'display', 'inline');
      }
      
    },
    
    /**
     * 根据进度条的位置来设置当前播放器显示的图片
     */
    setCurPic : function(){
      
      var me = this;
      
      var imgArr = baidu.dom.query('#' + me.picBoxId + ' img');
      if(imgArr.length){
        imgArr[0].src = me.picPath + me.curPos + '.jpg';
      }else {
        
        //计算帧尺寸
        me.frameWidth = video.config.size.FIXED_OPERATE_WIDTH;
        me.frameHeight = video.config.size.FIXED_OPERATE_WIDTH * me.model.height / me.model.width;
        
        var imgObj = baidu.dom.create('img', {src : me.picPath + me.curPos + '.jpg', width: me.frameWidth, height : me.frameHeight});
        baidu.dom.insertBefore(imgObj, baidu.g(me.picBoxId).firstChild);
        
        //触发视频载入首帧事件
        me.trigger(ui.events.TIMELINE_FIRST_SHOWPIC, imgObj);
      }
      
      //在ui上更新当前进度信息 如：当前播放第xx帧
      baidu.g(me.operateInfoId).innerHTML = baidu.format(er.template.get('TimelineOperateInfo'), me.headFrameCount, me.tailFrameCount, me.curPos);
    },
    
    /**
     * 视频裁剪
     */
    cut : function(isHead){
      
      var me = this;
      
      if(isHead) {
        
        me.headFrameCount = me.curPos;
        baidu.g(me.headFrameCountControlId).value = me.headFrameCount;
        
      }else {
        me.tailFrameCount = me.model.count - me.curPos + 1;
        baidu.g(me.tailFrameCountControlId).value = me.tailFrameCount;
      }
      //更新每帧步进长度
      me.stepWidth = Math.abs(me.initPositionLeft) / (me.getCurplusFrameCount() - 1);
      //裁剪之前的当前帧已经被裁剪，应播放下一帧
      me.next();
    },
    
    /**
     * 获取剩余帧数
     */
    getCurplusFrameCount : function(){
      return this.model.count - this.headFrameCount - this.tailFrameCount;
    },
    
    /**
     * 获取当前显示的帧
     */
    getCurFrame : function(){
        return baidu.dom.query('#' + this.picBoxId + ' img')[0];
    }
  };//return prototype
  
  

})();

baidu.inherits(ui.Timeline, ui.Control);

