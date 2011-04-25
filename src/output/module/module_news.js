baidu$mockup$register("/news/list");
var news$config$listFields = [{width:200, title:"\u751f\u6d3b\u5708\u540d\u79f0", field:"name", subEntry:!1, content:function(item) {
  return item.name
}}, {width:50, title:"\u72b6\u6001", field:"status", subEntry:!1, content:function(item) {
  return item.status
}}, {width:300, title:"\u520a\u4f8b\u4ef7", field:"sale_price", breakLine:!0, content:function(item) {
  return item.sale_price
}}, {width:100, title:"\u64cd\u4f5c", content:function(item) {
  return baidu$format('<a href="#/news/update~id={0}">\u4fee\u6539</a>', item.id)
}}];
goog$exportSymbol("news.app.start", function() {
  app$Launch(function() {
    var model = {fields:news$config$listFields};
    app$Init("MAIN_PAGE_news", baidu$g("Main"), model);
    model = ui$util.get("news-list");
    model.datasource = new base$RemoteListDataSource(function(params, callback) {
      baidu$ajax.get("/news/list", function(xhr) {
        callback(app$json$parse(xhr.responseText))
      })
    });
    model.getData()
  });
  JSCompiler_StaticMethods_setLoaded(app$module$ModuleManager.getInstance(), "news")
});

//@ sourceURL=../output/module/module_news.js