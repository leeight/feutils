/*
 * dn-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/UrlMaker.js
 * desc:    广告物料富媒体代码帮助生成URL的控件
 * author:  zhaolei,erik
 * date:    $Date: 2011-04-27 12:15:29 +0800 (周三, 27 四月 2011) $
 */

/**
 * 文本输入框组件
 * @constructor
 * @extends {ui.Control}
 * @param {Object} options 控件初始化参数.
 */
ui.UrlMaker = function(options) {
    ui.Control.call(this, options);

    this.type = 'urlmaker';
    this.flashSrc = this.flashSrc || '/img/clipboard_s.swf';
    this.successText = this.successText || '复制成功！';

    var id = this.id,
        uploadMedia = ui.util.create('Button', {
            'id': 'uploadMedia',
            'content': '上传图片或Flash'
        }),
        clickStatic = ui.util.create('Button', {
            'id': 'clickStatic',
            'content': '统计点击量'
        }),
        linkUrl = ui.util.create('TextInput', {
            'id': 'linkUrl',
            'width': 220,
            'rule' : 'link'
        }),
        makeLinkBtn = ui.util.create('Button', {
            'id': 'makeLinkBtn',
            'content': '生成新链接'
        }),
        copyTransformedLink = ui.util.create('CopyableArea', {
            'id': 'copyTransformedLink',
            'flashSrc' : '/img/clipboard_s.swf',
            'textInput': true
        }),
        mediaUploader = ui.util.create('Uploader', {
            'id': 'mediaUploader',
            'datakey': 'filedata',
            'token' : this.getToken_(),
            'text': '上传',
            'url' : this.uploadUrl,
            'func': this.getStrCall('mediaUpload'),
            'mediatype' : 'media',
            'rule': 'mediaUploader,this'
        }),
        getMcUrl = ui.util.create('Button', {
            'id': 'getMcUrl',
            'content': '获取链接'
        }),
        copyMcUrl = ui.util.create('CopyableArea', {
            'id': 'copyMcUrl',
            'flashSrc': '/img/clipboard_s.swf',
            'textInput': true
        });

    this.addChild(uploadMedia);
    this.addChild(clickStatic);
    this.addChild(linkUrl);
    this.addChild(makeLinkBtn);
    this.addChild(copyTransformedLink);
    this.addChild(mediaUploader);
    this.addChild(getMcUrl);
    this.addChild(copyMcUrl);
};

ui.UrlMaker.prototype = {

    /**
     * 获取用户的唯一标示，避免对资源访问控制器的影响
     * @private
     * @see http://icafe.baidu.com:8100/jtrac/app/item/COLUMBUS-937/
     * @return {string} 一个用户的唯一标示.
     */
    getToken_: function() {
        return this.token || '';
    },

    refreshView: function() {
        // 通过更改className刷新视图
        // ie6下显示隐藏不会触发某些控件的重绘
        baidu.dom.toggleClass(this.main, 'ui-noexist');
    },

    render: function(main) {
        var me = this,
            value = me.value;
        main = main || me.main;

        main.innerHTML = me.getFunctionHTML()
                            + me.getUploadHtml()
                            + me.getLinkUrlHtml();
        if (value) {
            me.setValue(value);
        }
        me.initControls();
        ui.UrlMaker.superClass.render.call(me, main);
    },

    initControls: function() {
        var me = this,
        uploadMedia = baidu.g(me.getId('uploadMedia')),
        clickStatic = baidu.g(me.getId('clickStatic')),
        linkUrl = baidu.g(me.getId('linkUrl')),
        makeLinkBtn = baidu.g(me.getId('makeLinkBtn')),
        copyTransformedLink = baidu.g(me.getId('copyTransformedLink')),
        mediaUploader = baidu.g(me.getId('mediaUploader')),
        getMcUrl = baidu.g(me.getId('getMcUrl')),
        copyMcUrl = baidu.g(me.getId('copyMcUrl'));

        me.getChild('uploadMedia').main = uploadMedia;
        me.getChild('clickStatic').main = clickStatic;
        me.getChild('linkUrl').main = linkUrl;
        me.getChild('makeLinkBtn').main = makeLinkBtn;
        me.getChild('copyTransformedLink').main = copyTransformedLink;
        me.getChild('mediaUploader').main = mediaUploader;
        me.getChild('getMcUrl').main = getMcUrl;
        me.getChild('copyMcUrl').main = copyMcUrl;

        me.getChild('uploadMedia').onclick = me.getUploadMediaHandler();
        me.getChild('clickStatic').onclick = me.getClickStaticHandler();
        me.getChild('makeLinkBtn').onclick = function() {
            me.generateStaticLink();
        };
        me.getChild('mediaUploader').getValue = me.mediaUploaderGetValue;
        me.getChild('mediaUploader').onchange = me.mediaUploaderSubmit;

    },
    mediaUploaderGetValue: function() {
        return this.getChild('localPath').getValue();
    },
    getUploadMediaHandler: function() {
        var me = this;
        return function() {
            me.toggleUploadArea();
        };
    },

    getClickStaticHandler: function() {
        var me = this;
        return function() {
            me.toggleClickArea();
        };
    },

    toggleUploadArea: function() {
        (baidu.g('urlMakerUpload').style.display == 'none') ? baidu.show('urlMakerUpload') : baidu.hide('urlMakerUpload');
        baidu.hide('urlMakerLink');

        this.refreshView();
    },
    toggleClickArea: function() {
        (baidu.g('urlMakerLink').style.display == 'none') ? baidu.show('urlMakerLink') : baidu.hide('urlMakerLink');
        baidu.hide('urlMakerUpload');

        this.refreshView();
    },
    mediaUploaderSubmit: function() {
        if (this.validate()) {
            this.submit();
        }
    },
    generateStaticLink: function() {
        var me = this;
        var linkUrl = me.getChild('linkUrl');
        if (linkUrl.validate()) {
            var url = linkUrl.getValue();
            if (!dn.util.regexp.urlStrict.test(url)) {
                url = 'http://' + url;
            }
            url = '%%BEGIN_LINK%%' + url + '%%END_LINK%%';

            baidu.g(me.getChild('copyTransformedLink').getId('text')).value = url;
            baidu.show('urlMakerLinkCopyArea');
        }else {
            baidu.hide('urlMakerLinkCopyArea');
        }

    },
    setValue: function(value) {
        baidu.g(this.getId('text')).value = value;
    },
    getFunctionHTML: function() {
        return baidu.format(
                    er.template.get('urlMakerFunction'),
                    this.getId('uploadMedia'),
                    this.getId('clickStatic')
                );
    },
    getUploadHtml: function() {
        return baidu.format(
                    er.template.get('urlMakerUpload'),
                    this.getId('mediaUploader'),
                    this.getId('getMcUrl'),
                    this.getId('copyMcUrl')
                    );
    },
    getLinkUrlHtml: function() {
        return baidu.format(
                    er.template.get('urlMakerLink'),
                    this.getId('linkUrl'),
                    this.getId('makeLinkBtn'),
                    this.getId('transformedLink'),
                    this.getId('copyTransformedLink')
                    );
    },

    /**
     * @param {Object} data 后端返回的数据.
     */
    mediaUpload: function(data) {
        if (data.success == 'true') {
            if (baidu.g('mediaCodeUploadBackEndErrorWrapper')) {
                baidu.dom.remove(baidu.g('mediaCodeUploadBackEndErrorWrapper'));
            }
            var ma = data.material,
                getMcUrl = this.getChild('getMcUrl');
            getMcUrl.show();
            getMcUrl.onclick = function() {
                material.data.getUploadRichMediaUrl(
                    'materialUrl=' + ma.previewUrl, this.displayMcUrl
                );
            };
            //隐藏copyArea
            baidu.hide('mcUrlCopyArea');
            //preview the picture or flash
            //如果是flash类型的物料，设置flash预览
            baidu.g('urlMakerPicPreviewValue').innerHTML = '';
            var url = ma.previewUrl;
            var s1 = url.substring(url.length - 4, url.length).toLowerCase();
            var s2 = url.substring(url.length - 5, url.length - 4);
            var dimension = material.form.getFitSize({'width': ma.width, 'height': ma.height},400);
            if (s1 == '.swf' && s2 != '/') {
                baidu.g('urlMakerPicPreviewValue').innerHTML = baidu.swf.createHTML({
                    id: 'urlMakerPicPreviewValue',
                    url: url,
                    width: dimension.width,
                    height: dimension.height
                });
            }else {
                var img = document.createElement('img');
                img.src = ma.previewUrl;
                img.width = dimension.width;
                img.height = dimension.height;
                baidu.g('urlMakerPicPreviewValue').appendChild(img);

            }
            baidu.show('urlMakerPicPreview');
        }else {
            var errorHtml = '<div id="mediaCodeUploadBackEndErrorWrapper" class="validate"><div id="mediaCodeUploadBackEndErrorWrapperIcon" class="validate-icon"></div><div id="mediaCodeUploadBackEndErrorWrapperText" class="validate-text"></div></div>';

            var uploader = this.getChild('mediaUploader');

            var errWrapper = document.createElement('div');
            errWrapper.innerHTML = errorHtml;
            uploader.main.parentNode.appendChild(errWrapper);
            baidu.removeClass(uploader.main.parentNode, 'validate-error');
            baidu.addClass(uploader.main.parentNode, 'validate-error');
            baidu.hide('mediaCodeUploadBackEndErrorWrapper');
            baidu.show('mediaCodeUploadBackEndErrorWrapper');
            baidu.g('mediaCodeUploadBackEndErrorWrapperText').innerHTML = data.message.field.filedata;
        }
    },

    /**
     * @param {Object} data 后端返回的内容.
     */
    displayMcUrl: function(data) {
        if (data.success == 'true') {
            // FIXME 不应该直接用这个ID
            baidu.g(this.getChild('copyMcUrl').getId('text')).value = data.mcMaterialUrl;
            baidu.show('mcUrlCopyArea');
        }
    }
};
baidu.inherits(ui.UrlMaker, ui.Control);
