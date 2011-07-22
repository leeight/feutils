

goog.require('er.context');
goog.require('ui.Timeline');
goog.require('ui.Form');
goog.require('ui.Label');
goog.require('ui.Timeline');

goog.provide('video.EditForm');

/**
 * 广告编辑页
 * @constructor
 * @extends {er.FormAction}
 */
video.EditForm = function() {
    er.FormAction.call(this);
    
    var me = this;
    //用户上传视频成功后将视频信息写入到er.context,如果用户不是来源自上传页面（如刷新当前页），则尝试获取cookie中的用户上次上传的视频信息
    me.videoInfo = er.context.get('video.info') || baidu.json.parse(baidu.cookie.get('video.info'));
    //测试使用
	me.videoInfo = me.videoInfo || {
		count : 189,
		width : 788,
		height : 588,
		time : '00:00:18.90',
		target : '20110721/test1-1311215197/102637',
        size : '2249kb',
        filename : 'test1.wmv',
        serverVideoFileName : 'test1-1311157707.wmv'
	};
    //如果后端没有返回视频尺寸，则在前端重新获取
    if(!me.videoInfo.width || !me.videoInfo.height){
        //在前端获取视频尺寸
	    var tmpImgDiv = baidu.dom.create('div', {style:'position:absolute;left:-1000px;top:-1000px'});
	    document.body.appendChild(tmpImgDiv);
	    var tmpImgObj = baidu.dom.create('img', {src: video.config.FFMPEG_PATH + me.videoInfo.target + '/' + '1.jpg'});
	    tmpImgDiv.appendChild(tmpImgObj);
	    me.videoInfo.width = parseInt(baidu.dom.getStyle(tmpImgObj, 'width'));
	    me.videoInfo.height = parseInt(baidu.dom.getStyle(tmpImgObj, 'height'));
	    baidu.dom.remove(tmpImgDiv);
    }
    
    var trim = baidu.string.trim;
    //后端返回的视频信息可能包含空格
    baidu.object.each(me.videoInfo, function(value, key){
      if(value && typeof value === 'string'){
        me.videoInfo[key] = trim(value);
      }
    });
    
    er.context.set('video.info', me.videoInfo);
    
    baidu.object.extend(me.videoInfo, {
      //每帧持续时间，该参数决定图片轮转速度
      timePerFrame : Math.round(getMs(me.videoInfo.time) / me.videoInfo.count),
      fps : Math.round(me.videoInfo.count * 1000 / getMs(me.videoInfo.time))
    });
    
    this.model = new base.BaseModel(baidu.object.extend({
      'title' : '第二步：编辑视频'
    }, me.videoInfo));
    
    this.view = 'videoEdit';
    
    //将hh:mm:ss.xxx格式的时间转换为具体的毫秒数
    function getMs(timeStr){
      var timeArr = timeStr.split(':');
      var len = timeArr.length;
      var ms = parseFloat(timeArr[len-1]);
      len = len-1;
      while(len){
        ms += parseInt(timeArr[len-1]) * Math.pow(60, timeArr.length - len);
        len = len - 1;
      }
      return ms * 1000;
    }
};

video.EditForm.prototype = {
    
    BACK_LOCATION: '/video/index',
    //帧播放器控件
    timeline : null,
    //视频转换参数表单
    form : null,
    //用户上传的视频信息
    videoInfo : null,
    //视频裁剪输入控件
    videoCropInputControl : null,
    //视频尺寸输入控件
    videoSizeInputControl : null,
    
    done : function(){
        
        //action载入完成后载入第一帧
        this.timeline.setCurPic();
        //设置form表单高度与左侧播放器高度一致
        baidu.dom.setStyle(
            this.form.main, 
            'height', 
            parseInt(baidu.dom.getStyle(this.timeline.picBoxId, 'height')) +
            parseInt(baidu.dom.getStyle(this.timeline.picBoxId, 'padding-top')) +
            parseInt(baidu.dom.getStyle(this.timeline.picBoxId, 'padding-bottom')) + 'px'
        );
        //视频尺寸初始值设置
        var initWidth = video.config.size.FIXED_WIDTH,
            initHeight = Math.round(initWidth / this.timeline.frameWidth * this.timeline.frameHeight);
        
        this.videoSizeInputControl.setValue(initWidth + 'x' + initHeight);
        
        video.EditForm.superClass.done.call(this); 
    },
    
    /** @inheritDoc */
    afterInit: function(page) {
      //填写视频转换参数的表单
      this.form = page.c('formVideoEdit').c('convertForm');
      //时间线控件
      this.timeline = page.c('formVideoEdit').c('convertVideoTimeline');
      //设置视频裁剪尺寸的输入控件
      this.videoCropInputControl = this.form.c('txtVideoCrop');
      //设置视频尺寸的输入控件
      this.videoSizeInputControl = this.form.c('txtVideoSize');
      //视频转换的后台接口
      this.requester = video.data.convert;
    },
    
    /** @inheritDoc */
    initBehavior: function(page) {
      video.EditForm.superClass.initBehavior.call(this, page);
      
      var me = this;
      //为时间线控件添加事件侦听
      this.timeline.setListeners({
        //视频首帧载入事件
        'firstShowPic' : function(imgObj){
            //首帧载入时添加裁剪功能
            var imgAreaSelectInstance = $(imgObj).imgAreaSelect({
                //为支持图片裁剪的dom元素指定父容器
                parent : me.main,
                //裁剪图片时触发
	            onSelectEnd: function (img, selection) {
                    //裁剪区域小于20x20，不做处理
                    if(selection.width < 20 || selection.height < 20){
                        imgAreaSelectInstance.cancelSelection();
                        return;
                    }
                    //保存裁剪结果
                    var cropResult = {
                        top : selection.y1,
                        left : selection.x1,
                        right : me.timeline.frameWidth - selection.x2,
                        bottom : me.timeline.frameHeight - selection.y2,
                        width : selection.width,
                        height : selection.height
                    };
                    //裁剪区域长宽比例，该比例作为最终视频输出比例
                    var aspect = selection.width / selection.height,
                        //用户操作的播放器界面与真实视频的缩放比例
                        scale = me.videoInfo.width / me.timeline.frameWidth;
                        //将用户裁剪区域映射到真实视频尺寸
                        cropResult.width = cropResult.width * scale;
	                
	                //真实视频裁剪区域与用户指定尺寸的缩放比例
                    var cropScale = video.config.size.FIXED_WIDTH / cropResult.width;
                    //计算视频的输出width，此值作为ffmpeg -s的输入参数，其值等于最终输出视频的width + 被裁剪的left、right值
                    cropResult.width = video.config.size.FIXED_WIDTH;
                    cropResult.height = Math.round(cropResult.width / aspect);
                    
                    //按比例缩放
                    baidu.object.each(cropResult, function(item, key){
                        if(key !== 'width' && key !== 'height') {
                            cropResult[key] = Math.round(cropResult[key] * scale * cropScale);
                            cropResult[key] = cropResult[key] < 0 ? 0 : cropResult[key];
                        }
                    });
                    //将视频输出尺寸输出到对应表单控件
                    me.videoSizeInputControl.setValue(
                        cropResult.width + 'x' +
                        cropResult.height
                    );
                    //ffmpeg中的尺寸设置，该尺寸等于裁剪尺寸+上下/左右区域尺寸
                    cropResult.width += cropResult.left + cropResult.right;
                    cropResult.height += cropResult.top + cropResult.bottom;
                    //设置要裁剪的视频四周的尺寸
	                me.videoCropInputControl.setValue(
	                    cropResult.top + 'x' +
	                    cropResult.right + 'x' +
	                    cropResult.bottom + 'x' +
	                    cropResult.left
	                );
	            },
                //返回裁剪控件的一个实例而不是当前图片
                instance : true
	        });
            
            //为新增的帧裁剪层添加鼠标右击事件
            /*IE8下有bug，暂时不使用
            var outers = baidu.dom.q('imgareaselect-outer');
            var area  = baidu.dom.prev(outers[0]);
            baidu.array.each(outers, function(outer){
                baidu.event.on(outer, 'contextmenu', function(e){
                    imgAreaSelectInstance.cancelSelection();
                    baidu.event.preventDefault(e);
                });
            });
            baidu.event.on(area, 'contextmenu', function(e){
                imgAreaSelectInstance.cancelSelection();
                baidu.event.preventDefault(e);
            });
            */
        }
      });
      
    },
    /** @inherits */
    getExtraParam : function() {
      
      var me = this;
      var extraParam = {
        //要裁剪的视频文件名
        filename : me.model.serverVideoFileName,
        //裁剪前后黑边后剩余帧数
        vframes : me.timeline.getCurplusFrameCount(),
        //每帧切换时间间隔
        timePerFrame : me.model.timePerFrame
      };
      return baidu.url.jsonToQuery(extraParam);
	},
    /**
     * 表单提交前
     */
    onFormSubmit : function(params){
        
        video.EditForm.superClass.onFormSubmit.call(this, params); 
        //loading提示
        dn.loading.show(video.config.loading.convert);
    },
    /**
     * 离开当前action时
     */
    leaveInternal : function(){
        var me = this;
        //如果加载过预览视频，移除之
        me.removePreview();
        //删除选择区域
        baidu.array.each(baidu.dom.q('imgareaselect-selection'), function(dom){
            baidu.dom.remove(baidu.dom.getParent(dom));
        });
        //删除选择区域四周
        baidu.array.each(baidu.dom.q('imgareaselect-outer'), function(dom){
            baidu.dom.remove(dom);
        });
    },
    
    /**@inherits */
    onSubmitFinish : function(data){
      
      dn.loading.hide();
      
      var me = this,
          debugFfmpegDom;
      
      //填充调试信息   
      if(debugFfmpegDom = baidu.g('debug_ffmpeg')){
	      debugFfmpegDom.innerHTML = data.result.command;
      }
      
      //预览的flv地址
      video.config.DAN_AD_CONFIG['_html']['src'] 
        = baidu.string.trim(data.result.gen_video_path) + '?random=' + Math.random();
      //客户下载的flv地址
      video.config.DAN_AD_CONFIG['_html']['target_url'] 
        = video.config.FFMPEG_PATH + baidu.string.trim(data.result.gen_video_path) + '?random=' + Math.random();
      //如果加载过预览视频，移除之
      me.removePreview();
      //裁剪后的视频预览
      window.store = {};
      window.store['123'] = video.config.DAN_AD_CONFIG;
      BAIDU_DAN_showAd("123"); 
    },
    /**
     * 移除预览
     */
    removePreview : function(){
      var ins = baidu.dom.query('body > ins:first');
      if(ins.length){
        baidu.dom.remove(ins[0]);
      }
    }
};
baidu.inherits(video.EditForm, er.FormAction);
