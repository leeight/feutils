/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * ant.lib.js ~ 2011/04/18 23:54:59
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * self是关键字
 **/

/**
 * @param {string} name 属性的名字.
 */
function _(name) {
  return self.getProject().getProperty(name);
}

/**
 * @param {string} name task的名字.
 */
function createTask(name) {
  return self.getProject().createTask(name);
}

/**
 * @param {string} inputfile 输入文件
 */
function gen_checksum(inputfile) {
  var file = new java.io.File(inputfile);
  if (!file.exists()) {
    return;
  }

  var property = Math.floor(Math.random() * 2147483648).toString(36);

  var checksum = createTask("checksum");
  checksum.setFile(file);
  checksum.setProperty(property);
  checksum.perform();

  var destfile = "",
      last_dot_pos = inputfile.lastIndexOf(".");
  if (last_dot_pos == -1) {
    destfile = inputfile + '-' + _(property);
  } else {
    destfile = inputfile.substring(0, last_dot_pos) + '-' + 
                _(property) + inputfile.substring(last_dot_pos);
  }

  var echo = createTask("echo");
  echo.setMessage(file.getName() + " -> " + _(property));
  echo.perform();

  var copy = createTask("copy");
  copy.setFile(file);
  copy.setTofile(new java.io.File(destfile));
  copy.perform();
}

/**
 * @param {string} input 输入文件
 * @param {string} output 输出文件
 * @param {string=} opt_jar yui的jar文件.
 */
function yui(input, output, opt_jar) {
  var task = createTask("java"),
      jar = opt_jar || (_("tools.dir") + "/lib/yui-compressor.jar");

  task.setJar(new java.io.File(jar));
  task.setFork(true);
  task.setFailonerror(true);
  task.setMaxmemory("128m");
  task.createArg().setLine("--line-break 800");
  task.createArg().setLine("-o " + output);
  task.createArg().setLine(input);
  task.perform();
}




















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
