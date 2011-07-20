/**
 * 广告编辑页
 * @constructor
 * @extends {er.FormAction}
 */
video.Preview = function() {
    er.FormAction.call(this);
    
    this.model = new base.BaseModel({
      'title' : '视频预览'
    });
    
    
    this.view = 'videoPreview';
};

//flv地址
video.Preview.prototype.url;


baidu.inherits(video.Preview, er.FormAction);
