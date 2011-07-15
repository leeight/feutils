/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * ../lib/Fbuild.js ~ 2011/07/15 19:45:52
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *
 **/

var util  = require('util'),
    fs    = require('fs'),
    spawn = require('child_process').spawn;

/**
 * @param {string} input 归一化文件的路径.
 * @return {string} 归一化之后的路径.
 */
function getPath(input) {
  if (process.platform == 'win32') {
    return input.replace(/\//g, '\\');
  } else {
    return input;
  }
}

/**
 * @param {string} command 要执行的命令.
 * @param {Array.<string>=} opt_args 命令参数，可选.
 * @param {string=} opt_output 日志输出的文件，可选.
 */
function exec(command, opt_args, opt_output) {
  var task = spawn(getPath(command), opt_args || []);

  var output = [];
  if (opt_output) {
    task.stdout.on('data', function (data) {
      output.push(data);
    });
  }

  task.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  task.on('exit', function (code) {
    if (code == 0) {
      if (opt_output) {
        fs.writeFile(opt_output, output.join(''));
      }
    } else {
      console.log('child process exited with code ' + code);
    }
  });
}


exports.exec = exec;
exports.getPath = getPath;



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
