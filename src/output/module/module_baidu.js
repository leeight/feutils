function ui$Button(options) {
  ui$Control.call(this, options);
  this.type = "button"
}
baidu$inherits(ui$Button, ui$Control);
goog$exportSymbol("ui.Button", ui$Button);
JSCompiler_prototypeAlias = ui$Button.prototype;
JSCompiler_prototypeAlias.tplButton = '<div class="ui-button-bg-left"></div><div id="{2}" class="{1}">{0}</div>';
JSCompiler_prototypeAlias.content = "button";
JSCompiler_prototypeAlias.getMainHtml = function() {
  return baidu$format(this.tplButton, this.content, JSCompiler_StaticMethods_getClass(this, "label"), JSCompiler_StaticMethods_getId(this, "label"))
};
JSCompiler_prototypeAlias.render = function(opt_main) {
  ui$Button.superClass.render.call(this, opt_main);
  opt_main = this.main;
  if(opt_main.tagName == "DIV") {
    var innerDiv = opt_main.firstChild;
    if(innerDiv && innerDiv.tagName != "DIV") {
      this.content = opt_main.innerHTML
    }
    opt_main.innerHTML = this.getMainHtml();
    if(opt_main.offsetWidth < 60 && opt_main.offsetWidth > 0) {
      baidu$G(JSCompiler_StaticMethods_getId(this, "label")).style.width = "40px"
    }
    opt_main.onclick = baidu$fn$bind(this.clickHandler, this)
  }
};
JSCompiler_prototypeAlias.clickHandler = function() {
  if(!JSCompiler_StaticMethods_getState(this) && "function" == typeof this.onclick) {
    this.onclick()
  }
};
JSCompiler_prototypeAlias.dispose = function() {
  this.onclick = this.main.onclick = JSCompiler_alias_NULL;
  ui$Button.superClass.dispose.call(this)
};
goog$exportSymbol("baidu.app.start", function() {
  app$Launch(function() {
    app$Init("MAIN_PAGE_BAIDU", baidu$g("Main"))
  });
  JSCompiler_StaticMethods_setLoaded(app$module$ModuleManager.getInstance(), "baidu")
});

//@ sourceURL=../output/module/module_baidu.js