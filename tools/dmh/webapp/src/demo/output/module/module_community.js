function dn$ConstMap(map) {
  for(var key in map) {
    this[key] = map[key]
  }
}
function JSCompiler_StaticMethods_getKey(JSCompiler_StaticMethods_getKey$self, value) {
  for(var key in JSCompiler_StaticMethods_getKey$self) {
    if(JSCompiler_StaticMethods_getKey$self[key] === value) {
      return key
    }
  }
  return JSCompiler_alias_NULL
}
function base$RequestWorker() {
  base$AbstractWorker.call(this);
  var me = this;
  me.callback = arguments[arguments.length - 1];
  me.args = [];
  for(var i = 0;i < arguments.length - 1;i++) {
    me.args.push(arguments[i])
  }
  arguments.length === 2 && me.args.push(JSCompiler_alias_NULL);
  me.args.push(function() {
    me.callback.apply(window, arguments);
    me.done()
  })
}
baidu$inherits(base$RequestWorker, base$AbstractWorker);
base$RequestWorker.prototype.start = function() {
  Requester.post.apply(Requester, this.args)
};
function baidu$array$filter(iterator) {
  var source = er$context.get("productTypeList"), result = [], resultIndex = 0, len = source.length, item, i;
  if("function" == typeof iterator) {
    for(i = 0;i < len;i++) {
      item = source[i], !0 === iterator.call(source, item, i) && (result[resultIndex++] = item)
    }
  }
  return result
}
function community$List() {
  er$ListAction.call(this);
  this.model = new base$BaseModel({fields:community.config.listFields, selectedItems:JSCompiler_alias_NULL, searchParams:JSCompiler_alias_NULL, listState:JSCompiler_alias_NULL});
  this.view = "communityList"
}
baidu$inherits(community$List, er$ListAction);
goog$exportSymbol("community.List", community$List);
community$List.prototype.afterInit = function(page) {
  this.formSearch = JSCompiler_StaticMethods_getChild(page, "formSearch");
  this.pnlBatch = JSCompiler_StaticMethods_getChild(page, "pnlOperation");
  this.list = JSCompiler_StaticMethods_getChild(page, "list");
  this.requesterList = community.data.list;
  this.requesterBatch = community.data.status_update
};
community$List.prototype.initBehaviorInternal = function() {
  var me = this, archiveButton = JSCompiler_StaticMethods_getChild(this.pnlBatch, "batch-archive-button"), archiveStatus = JSCompiler_StaticMethods_getKey(er$context.get("communityStatusMap"), baidu$G(JSCompiler_StaticMethods_getId(archiveButton, "label")).innerHTML);
  if(baidu$lang$hasValue(archiveStatus)) {
    archiveButton.onclick = function() {
      JSCompiler_StaticMethods_batchUpdate(me, "status", archiveStatus)
    }
  }
};
function ui$Repeater(options) {
  this.datasource = JSCompiler_alias_NULL;
  this._html = this.tpl = "";
  this.type = "repeater";
  ui$Control.call(this, options)
}
baidu$inherits(ui$Repeater, ui$Control);
goog$exportSymbol("ui.Repeater", ui$Repeater);
ui$Repeater.prototype.getMainHtml = function() {
  if(!this._html) {
    var tpl = this.tpl, html = [];
    baidu$array$each(this.datasource, function(item) {
      html.push(baidu$format(tpl, item))
    });
    this._html = html.join("")
  }
  return this._html
};
ui$Repeater.prototype.bindModel = function(model) {
  ui$Repeater.superClass.bindModel.call(this, model);
  var main = this.main, html = this.getMainHtml();
  JSCompiler_StaticMethods_clearChildren(this);
  main.innerHTML = html;
  JSCompiler_StaticMethods_buildControlTree(ui.util, main, this);
  ui$Repeater.superClass.bindModel.call(this, model)
};
ui$Repeater.prototype.render = function() {
  ui$Repeater.superClass.render.call(this)
};
ui$Repeater.prototype.dispose = function() {
  if(this.main) {
    var element = this.main, element = baidu$dom$g(element), tmpEl = element.parentNode;
    tmpEl && tmpEl.removeChild(element)
  }
  ui$Repeater.superClass.dispose.call(this)
};
function community$Form() {
  er$FormAction.call(this);
  this.model = new base$BaseModel({});
  this.view = "communityForm"
}
baidu$inherits(community$Form, er$FormAction);
goog$exportSymbol("community.Form", community$Form);
JSCompiler_prototypeAlias = community$Form.prototype;
JSCompiler_prototypeAlias.BACK_LOCATION = "/community/list";
JSCompiler_prototypeAlias.initModel = function(argMap, callback) {
  var me = this, pwm = new base$ParallelWorkerManager;
  me.model["repeater.ds"] = baidu$array$filter(function(item) {
    return item.value.indexOf(",") == -1
  });
  me.model["repeater.tpl"] = er$template.get("communityPriceTpl");
  if(JSCompiler_StaticMethods_isModify(this)) {
    var worker = new base$RequestWorker("/community/read", "id=" + argMap.paramMap.id, function(data) {
      data.success == "true" && JSCompiler_StaticMethods__initModelImpl(me, data.result)
    });
    JSCompiler_StaticMethods_addWorker(pwm, worker)
  }
  this.model.formHeaderText = JSCompiler_StaticMethods_isModify(this) ? "\u4fee\u6539\u751f\u6d3b\u5708" : "\u6dfb\u52a0\u751f\u6d3b\u5708";
  this.model.formBlockTitle = this.model.formHeaderText;
  JSCompiler_StaticMethods_addDoneListener(pwm, callback);
  pwm.start()
};
function JSCompiler_StaticMethods__initModelImpl(JSCompiler_StaticMethods__initModelImpl$self, data) {
  baidu$object$each(data.sale_price, function(value, key) {
    JSCompiler_StaticMethods__initModelImpl$self.model["sale_price[" + key + "]"] = value
  });
  JSCompiler_StaticMethods__initModelImpl$self.model.name = data.name
}
JSCompiler_prototypeAlias.enterDocument = JSCompiler_emptyFn();
JSCompiler_prototypeAlias.afterInit = function() {
  this.form = JSCompiler_StaticMethods_getChild(this.page, "form");
  this.btnSubmit = JSCompiler_StaticMethods_getChild(this.form, "btnSubmit");
  this.btnCancel = JSCompiler_StaticMethods_getChild(this.form, "btnCancel");
  this.requester = JSCompiler_StaticMethods_isModify(this) ? community.data.update : community.data.create
};
JSCompiler_prototypeAlias.initBehaviorInternal = JSCompiler_emptyFn();
JSCompiler_prototypeAlias.getExtraParam = function() {
  if(JSCompiler_StaticMethods_isModify(this)) {
    return"id=" + this.argMap.paramMap.id
  }
  return""
};
community.mockup = {};
JSCompiler_StaticMethods_register("/community/read", {success:"true", message:{}, result:{id:"123", name:"i'm mockup", sale_price:{1:"1000", 2:"2000", 3:"3999", 4:"4900", 5:"5000", 6:"6000"}}});
JSCompiler_StaticMethods_register("/community/list", {success:"true", message:{}, page:{pageNo:1, pageSize:120, orderBy:"", order:"desc", totalCount:4, result:[{id:1, name:"\u751f\u6d3b\u57081", status:1, sale_price:{1:1E3, 2:2E3, 3:3E3, 4:4E3, 5:5E3, 6:6E3}}, {id:2, name:"\u751f\u6d3b\u57082", status:1, sale_price:{1:1E3, 2:2E3, 3:3E3, 4:4E3, 5:5E3, 6:6E3}}, {id:3, name:"\u751f\u6d3b\u57083", status:1, sale_price:{1:1E3, 2:2E3, 3:3E3, 4:4E3, 5:5E3, 6:6E3}}, {id:4, name:"\u751f\u6d3b\u57084", status:2, 
sale_price:{1:1E3, 2:2E3, 3:3E3, 4:4E3, 5:5E3, 6:6E3}}]}});
er$context.set("communityStatusMap", new dn$ConstMap({0:"\u6b63\u5e38", 1:"\u5b58\u6863"}));
er$context.set("productTypeMap", new dn$ConstMap({0:"\u89c6\u9891", 1:"\u6d6e\u7a97", 2:"\u8def\u969c", 3:"\u6cf0\u5c71\u538b\u9876", 4:"\u901a\u680f", 5:"\u753b\u4e2d\u753b"}));
er$context.set("productTypeList", [{text:"\u89c6\u9891", value:"0"}, {text:"\u6d6e\u7a97", value:"1"}, {text:"\u8def\u969c", value:"2"}, {text:"\u6cf0\u5c71\u538b\u9876", value:"3"}, {text:"\u901a\u680f", value:"4"}, {text:"\u753b\u4e2d\u753b", value:"5"}]);
app$module$ModuleManager.getInstance()._modules.community = !0;

//@ sourceURL=module/module_community.js