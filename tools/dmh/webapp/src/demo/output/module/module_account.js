function account$List() {
  er$ListAction.call(this)
}
goog$exportSymbol("account.List", account$List);
account$List.prototype = {view:"accountList", initModel:function(argMap, callback) {
  this.model.fields = account.config.listFields;
  this.model.roles = [{text:"\u5168\u90e8", value:""}];
  for(var rolesList = er$context.get("rolesList"), i = 0;i < rolesList.length;i++) {
    this.model.roles.push(rolesList[i])
  }
  callback()
}, afterInit:function(page) {
  this.formSearch = JSCompiler_StaticMethods_getChild(page, "formSearch");
  this.pnlBatch = JSCompiler_StaticMethods_getChild(page, "pnlOperation");
  this.list = JSCompiler_StaticMethods_getChild(page, "list");
  this.requesterList = account.data.list;
  this.requesterBatch = account.data.batch_delete
}, initBehaviorInternal:function() {
  var me = this;
  JSCompiler_StaticMethods_getChild(me.pnlBatch, "batch-delete-button").onclick = function() {
    JSCompiler_StaticMethods_batchUpdate(me)
  }
}};
baidu$inherits(account$List, er$ListAction);
function ui$RadioBox(options) {
  ui$Control.call(this, options);
  this.form = 1;
  this.boxType = "RadioBox";
  this.type = "radiobox";
  this.wrapTag = "INPUT";
  this.wrapType = "radio"
}
baidu$inherits(ui$RadioBox, ui$BaseBox);
goog$exportSymbol("ui.RadioBox", ui$RadioBox);
function ui$RadioBoxGroup(options) {
  ui$Control.call(this, options);
  this.datasource = this.value = JSCompiler_alias_NULL
}
goog$exportSymbol("ui.RadioBoxGroup", ui$RadioBoxGroup);
ui$RadioBoxGroup.prototype = function() {
  function onRadioBoxClick(rb) {
    this.onselect(rb.main.value)
  }
  return{onselect:JSCompiler_emptyFn(), render:function(main) {
    ui$RadioBoxGroup.superClass.render.call(this, main);
    JSCompiler_StaticMethods_clearChildren(this);
    this.main.innerHTML = "";
    var main = this.datasource, name, value, rb;
    if(main && main.length) {
      name = this.formName + (new Date).getTime().toString(32);
      value = this.value == JSCompiler_alias_NULL ? this.defaultFirst && main[0].value : this.value;
      if(!name) {
        throw Error("can't find name");
      }
      for(var i = 0;i < main.length;i++) {
        if(baidu$ie == 6 ? rb = document.createElement('<input name = "' + name + '"/>') : (rb = document.createElement("input"), rb.name = name), rb.type = "radio", rb.value = main[i].value, rb.title = main[i].text, this.main.appendChild(rb), rb = new ui$RadioBox({main:rb, type:"RadioBox", id:"rb" + i, datasource:value}), this.addChild(rb), main[i].value === value) {
          this.onselect(value)
        }
      }
    }
  }, bindEvent:function() {
    ui$RadioBoxGroup.superClass.bindEvent.call(this);
    for(var i = 0;i < this.children.length;i++) {
      this.children[i].onclick = baidu$fn$bind(onRadioBoxClick, this, this.children[i])
    }
  }, dispose:function() {
    for(var i = 0;i < this.children.length;i++) {
      this.children[i].onclick = JSCompiler_alias_NULL
    }
    ui$RadioBoxGroup.superClass.dispose.call(this)
  }, getValue:function() {
    for(var i = 0;i < this.children.length;i++) {
      if(this.children[i].getDOM().checked) {
        return this.children[i].getValue()
      }
    }
    return""
  }}
}();
baidu$inherits(ui$RadioBoxGroup, ui$InputControl);
account.Form = function() {
  er$FormAction.call(this)
};
account.Form.prototype = {view:"createRoles", initModel:function(argMap, callback) {
  this.model.title = "\u65b0\u5efa\u8d26\u6237";
  this.model.roles = [];
  for(var rolesList = er$context.get("rolesList"), i = 0;i < rolesList.length;i++) {
    this.model.roles.push(rolesList[i])
  }
  callback()
}, afterInit:function(page) {
  this.form = JSCompiler_StaticMethods_getChild(page, "form");
  this.btnSubmit = JSCompiler_StaticMethods_getChild(JSCompiler_StaticMethods_getChild(page, "form"), "btnSubmit");
  this.btnCancel = JSCompiler_StaticMethods_getChild(JSCompiler_StaticMethods_getChild(page, "form"), "btnCancel");
  this.requester = JSCompiler_StaticMethods_isModify(this) ? account.data.update : account.data.create
}};
baidu$inherits(account.Form, er$FormAction);
account.mockup = {};
JSCompiler_StaticMethods_register("/account/list", {success:"true", message:{}, page:{pageNo:1, pageSize:15, orderBy:"id", order:"desc", totalCount:3, result:[{id:2902672, name:"danadmin", role_id:1, active_time:"20110331152700"}, {id:1793135, name:"\u767d\u4e91\u6d77", role_id:1, active_time:"20110427101618"}, {id:1792586, name:"chengxi-ALB", role_id:4, active_time:"20110331182800"}]}});
er$context.set("rolesList", [{text:"\u7ba1\u7406\u5458", value:"1"}, {text:"\u9500\u552e", value:"2"}, {text:"\u5ba2\u670d", value:"3"}, {text:"\u5ba2\u6237", value:"4"}]);
er$context.set("rolesMap", {1:"\u7ba1\u7406\u5458", 2:"\u9500\u552e", 3:"\u5ba2\u670d", 4:"\u5ba2\u6237"});
app$module$ModuleManager.getInstance()._modules.account = !0;

//@ sourceURL=module/module_account.js