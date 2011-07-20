document.write('<script type="text/javascript" src="../qunit/qunit.js"></script>');

(function(){
// 添加样式
var scripts = document.getElementsByTagName('SCRIPT');
var qunit = scripts[scripts.length - 1];
var qunit_css = qunit.src.replace(".js", ".css");

var element = document.createElement("link");
element.setAttribute("rel", "stylesheet");
element.setAttribute("type", "text/css");
element.setAttribute("href", qunit_css);

document.getElementsByTagName("head")[0].appendChild(element);
})();

var fet = {};
fet.describe = function(module_name, test_cases){
  module(module_name);
  if(typeof test_cases['setup'] == 'function'){
    test_cases['setup']();
  }

  for(var key in test_cases){
    if(test_cases.hasOwnProperty(key)){
      if(key == 'setup' || key == 'teardown'){
        continue;
      }
      test(key, test_cases[key]);
    }
  }

  if(typeof test_cases['teardown'] == 'function'){
    test_cases['teardown']();
  }
}

/**
 * 获取一个唯一的ID
 * @return {string} 唯一ID
 */
fet.uid = function(){
  return Math.floor(Math.random() * 2147483648).toString(36);
}

fet.value_of = function(v){
  return new fet.Assertion(v);
}

fet.Assertion = function(value) {
  this.value_ = value;
};

fet.Assertion.prototype.getType = function(){
  var type = typeof this.value_;
  if(Object.prototype.toString.call(this.value_) == '[object Array]'){
    return 'array';
  }else if(type == 'string' || this.value_ instanceof String){
    return 'string';
  }else if('[object Function]' == Object.prototype.toString.call(source)){
    return 'function';
  }else if(type == 'function' || !!(this.value_ && type == 'object')){
    return 'object';
  }else{
    return 'undefined';
  }
}

fet.Assertion.prototype.should_be = function(expected, description){
  QUnit.deepEqual(this.value_, expected, description);
}

fet.Assertion.prototype.should_not_be = function(expected, description){
  QUnit.notDeepEqual(this.value_, expected, description);
}

fet.Assertion.prototype.should_be_true = function(description){
  QUnit.equal(this.value_, true, description);
}

fet.Assertion.prototype.should_be_false = function(description){
  QUnit.equal(this.value_, false, description);
}

fet.Assertion.prototype.should_be_empty = function(description){
  var type = this.getType();
  if(type == 'array' || type == 'string'){
    QUnit.equal(this.value_.length, 0, description);
  }else if(type == 'object'){
    var isEmpty = true;
    for(var key in this.value_){
      if(this.value_.hasOwnProperty(key)){
        isEmpty = false;
        break;
      }
    }
    QUnit.equal(isEmpty, true, description);
  }else{
    // ???
  }
}


fet.triggerClickEvent = function(element) {
  if (document.createEvent) {
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, true, window,
        0, 0, 0, 0, 0, false, false, false, false, 0, null);
    element.dispatchEvent(event);
  } else {
    element.fireEvent('onclick', element.ownerDocument.createEventObject());
  }
}

// hook
ui.Page.prototype.instChildrenFromTpl = function() {
  // this.main的已经有内容了，不需要改变什么了
  // 此时已经没有 er.template.get 的事情了
  ui.util.buildControlTree(this.main, this);
}

fet.testControl = function(model) {
  var main = document.getElementById('Main'),
      page = ui.util.createPage('MAIN_PAGE', main, false);

  page.init();
  page.bindModel(model);
  page.render();
  page.bindEvent();

  return page;
}

fet.getTemplate = function(path) {
    var xhr = window.ActiveXObject ? 
        new window.ActiveXObject("Microsoft.XMLHTTP") : 
        new XMLHttpRequest();
    xhr.open('get', '/src/' + path, false);
    xhr.send(null);
    var tpl = xhr.responseText;            

    er.template.parse(tpl);
};
