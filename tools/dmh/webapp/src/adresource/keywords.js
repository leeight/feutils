/**
 * 关键词工具
 * @author zhoulianjie@baidu.com
 * @constructor
 * @extends {er.Action}
 * @export
 */
adresource.Keywords = function() {
  er.Action.call(this);
  this.model = new base.BaseModel({});
  this.view = 'keywordsView';
};

adresource.Keywords.prototype = {
  initModel: function(query, callback) {
    this.model.keywords_fields = [
      {
        title: '关键词',
        field: 'query',
        breakLine: true,
        width: 300,
        content: function(item) {
          return item.query;
        }
      }
    ];
    this.model.keywords_datasource = [];
    callback();
  },

  initBehavior: function() {
    this.page.c('formKeywords').c('btnKeywords').onclick =
      baidu.fn.bind(this.requestQuery, this);
  },

  requestQuery: function() {
    var form = this.page.c('formKeywords'),
        txtKeywords = form.c('orientKeywords'),
        val = txtKeywords.getOrientValue(),
        param = 'status=0&keywords=' + val,
        len = '' === val ? 0 : val.split(',').length,
        tbl = form.c('tblKeywords'),
        me = this;

    adresource.data.keywords(param, function(data) {
      baidu.show('wrapperResult');

      var result = [];
      if (data.success == 'true') {
        result = data.page.result;
      } else {
        // FIXME ui.Orientation应该升级为ui.InputControl类型的控件
        var errorMap = data['message']['field'];
        if (errorMap) {
          var keywords = errorMap['keywords'];
          if (keywords) {
            txtKeywords['errorMessage'] = keywords;
            ui.util.validate(txtKeywords, 'backendError,this');
            txtKeywords['errorMessage'] = null;
          }
        }
      }

      baidu.g('lblKeywordsAll').innerHTML = len;
      baidu.g('lblKeywordsNone').innerHTML = result.length;
      tbl.rebindModel({
        keywords_datasource: result
      });
    });
  }
};

baidu.inherits(adresource.Keywords, er.Action);
