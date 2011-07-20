/**
 * 广告编辑页
 * @constructor
 * @extends {er.FormAction}
 */
video.UploadForm = function() {
    er.FormAction.call(this);
    this.model = new base.BaseModel({
      'title' : '第一步：上传视频'
    });
    this.view = 'videoUpload';
};

video.UploadForm.prototype = {
    BACK_LOCATION: '/ad/list'

   
};
baidu.inherits(video.UploadForm, er.FormAction);
