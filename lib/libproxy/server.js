/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id: server.js 93101 2011-10-19 12:47:34Z  $ 
 * 
 **************************************************************************/
 
 
 
/**
 * server3.js ~ 2011/10/19 17:32:10
 * @author leeight(liyubei@baidu.com)
 * @version $Revision: 93101 $ 
 * @description 
 *  
 **/

var static = require('node-static'),
    fs = require('fs'),
    url = require('url'),
    util = require('util'),
    colors = require('colors'),
    http = require('http');

var argv = require('optimist')
           .demand(['root', 'port'])
           .describe('root', '服务器根目录')
           .describe('port', '服务器运行端口')
           .describe('config', '路由配置JSON格式文件')
           .argv;

var proxyMap = null;
if (argv.config) {
  proxyMap = JSON.parse(fs.readFileSync(argv.config));
  log('proxyMap = ' + JSON.stringify(proxyMap));
}

function getMatchedHost(host) {
  if (proxyMap[host]) {
    var matched = proxyMap[host];
    return matched.split(':');    // XXX 不做合法性校验.
  }
}

function log(message) {
  util.puts('[' + new Date() + '] ' + message);
}

function proxyRequest(request, response, chunks) {
  var host = getMatchedHost(request.headers['host']);
  if (!host) {
    // TODO 404 error.
    response.end();
  } else {
    log('forward request ' + (request.headers['host'] + request.url).blue + 
        ' to ' + (host[0] + ':' + host[1] + request.url).blue);
    var proxy = http.createClient(parseInt(host[1], 10), host[0]);
    var proxy_request = proxy.request(request.method, request.url, request.headers);
    proxy_request.addListener('response', function (proxy_response) {
      proxy_response.addListener('data', function(chunk) {
        response.write(chunk, 'binary');
      });
      proxy_response.addListener('end', function() {
        response.end();
      });
      response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });
    proxy_request.write(chunks.join(''), 'binary');
    proxy_request.end();
  }
}

function startServer() {
  var file = new(static.Server)(argv.root);
  require('http').createServer(function(request, response){
    var chunks = [];
    request.addListener('data', function(chunk){
      chunks.push(chunk);
    });

    request.addListener('end', function (){
      var pathname = file.resolve(decodeURI(url.parse(request.url).pathname));
      fs.stat(pathname, function(error, stats){
        if (stats) {
          file.serve(request, response);
        } else {
          // 静态文件不存在，去请求proxyMap里面的数据.
          proxyRequest(request, response, chunks);
        }
      });
    });
  }).listen(parseInt(argv.port, 10));
}
startServer();




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
