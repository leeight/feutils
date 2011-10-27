/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * server.js ~ 2011/10/20 16:23:32
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/

var fs = require('fs'),
    er = require('er-server');

function batchRequest(urls) {
  var chunks = [];
  for(var i = 0; i < urls.length; i ++) {
    try {
      if (urls[i]) {
        chunks.push(fs.readFileSync(server.getAbsPath(urls[i])).toString());
      }
    } catch(e){}
  }
  return chunks.join("\n");
}

function mergeJavaScript(path) {
  var abspath = server.getAbsPath(path);
  var content = fs.readFileSync(abspath, "utf8").toString();
  var match = content.match(/(src="([^"]+)")/gi);
  if (match) {
    var urls = [];
    for(var i = 0; i < match.length; i ++) {
      urls.push(match[i].split('"')[1]);
    }
    return batchRequest(urls);
  } else {
    return content;
  }
}

function mergeStyleSheets(path) {
  var abspath = server.getAbsPath(path);
  var content = fs.readFileSync(abspath, "utf8").toString();
  // @import '../../src/css/base.css';
  var matches = content.match(/'([^']+)'/gi);
  if (matches) {
    var urls = [];
    matches.forEach(function(match){
      urls.push(match.split(/['"]/)[1].replace("../..", ""));
    });
    return batchRequest(urls);
  } else {
    return content;
  }
}

function mergeTemplate(path) {
  var abspath = server.getAbsPath(path);
  var content = fs.readFileSync(abspath, "utf8").toString();
  var urls = content.split(/\r?\n/gi);
  return batchRequest(urls);
}

var server = new er.ErServer();

var ignoreUrls = ["/assets/js/deps.js", "/assets/js/tangram.patch.js"];
var jsUrls = ["/assets/js/base.js", "/assets/js/coup.js"];
var cssUrls = ["/assets/css/coup.css"];
var tplUrls = ["/assets/tpl.html"];

ignoreUrls.forEach(function(url){
  server.addHandler(url, function(){ return ""; });
});
jsUrls.forEach(function(url){
  server.addHandler(url, function(){ return mergeJavaScript(url); });
});
cssUrls.forEach(function(url){
  server.addHandler(url, function(){ return mergeStyleSheets(url); });
});
tplUrls.forEach(function(url){
  server.addHandler(url, function(){ return mergeTemplate(url); });
});


server.addHandler("/helloworld.js", function(){
  return "HELLO WORLD";
});
server.start();



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
