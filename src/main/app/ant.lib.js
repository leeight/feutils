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
 * @return {string} 环境变量的值.
 */
function _(name) {
  return self.getProject().getProperty(name);
}

/**
 * @param {string} name task的名字.
 * @return {*} Task.
 */
function createTask(name) {
  return self.getProject().createTask(name);
}

/**
 * @param {string} msg 需要输出的信息.
 */
function echo(msg) {
  var task = createTask('echo');
  task.setMessage(msg);
  task.perform();
}

/**
 * @param {string} dir 需要创建的目录.
 */
function mkdir(dir) {
  var task = createTask('mkdir');
  task.setDir(new java.io.File(dir));
  task.perform();
}

/**
 * @return {string} uuid.
 */
function uuid() {
  return Math.floor(Math.random() * 2147483648).toString(36);
}

/**
 * 获取一个文件的目录名
 * @param {string} file 输入文件.
 * @return {string} 目录名称.
 */
function dirname(file) {
  var property = uuid();

  var task = createTask('dirname');
  task.setFile(new java.io.File(file));
  task.setProperty(property);
  task.perform();

  return _(property);
}

/**
 * 从一个路径中获取文件的名字.
 *
 * @param {string} path 输入的路径.
 * @param {string} 文件名称.
 */
function basename(path) {
  var property = uuid();

  var task = createTask('basename');
  task.setFile(new java.io.File(path));
  task.setProperty(property);
  task.perform();

  return _(property);
}

/**
 * @param {string} from 源文件.
 * @param {string} to 目标文件.
 */
function copy(from, to) {
  var task = createTask('copy');
  task.setFile(new java.io.File(from));
  task.setTofile(new java.io.File(to));
  task.perform();
}

/**
 * @param {string} inputfile 输入文件.
 */
function gen_checksum(inputfile) {
  var file = new java.io.File(inputfile);
  if (!file.exists()) {
    return;
  }

  var property = uuid();

  var checksum = createTask('checksum');
  checksum.setFile(file);
  checksum.setProperty(property);
  checksum.perform();

  var destfile = '',
      last_dot_pos = inputfile.lastIndexOf('.');
  if (last_dot_pos == -1) {
    destfile = inputfile + '-' + _(property);
  } else {
    destfile = inputfile.substring(0, last_dot_pos) + '-' +
                _(property) + inputfile.substring(last_dot_pos);
  }

  echo(file.getName() + ' -> ' + _(property));
  copy(inputfile, destfile);
}

/**
 * @param {string} input 输入文件.
 * @param {string} output 输出文件.
 * @param {string=} opt_jar yui的jar文件.
 */
function yui(input, output, opt_jar) {
  var task = createTask('java'),
      jar = opt_jar || (_('tools.dir') + '/lib/yui-compressor.jar');

  task.setJar(new java.io.File(jar));
  task.setFork(true);
  task.setFailonerror(true);
  task.setMaxmemory('128m');
  task.createArg().setLine('--line-break 800');
  task.createArg().setLine('-o ' + output);
  task.createArg().setLine(input);
  task.perform();
}

/**
 * @param {string|Array.<string>} input 输入文件，可以是一个，也可以是一个数组.
 * @param {string} output 输出文件.
 * @param {string=} opt_jar gcc的jar文件.
 */
function gcc(input, output, opt_jar) {
  var task = createTask('java'),
      jar = opt_jar || (_('tools.dir') + '/lib/google-closure-compiler.jar');

  var type = Object.prototype.toString.call(input);

  task.setJar(new java.io.File(jar));
  task.setFork(true);
  task.setFailonerror(true);
  task.setMaxmemory('128m');
  task.createArg().setLine('--js_output_file ' + output);
  if (type == '[object String]') {
    task.createArg().setLine('--js ' + input);
  } else if (type == '[object Array]') {
    for (var i = 0, j = input.length; i < j; i++) {
      task.createArg().setLine('--js ' + input[i]);
    }
  }
  task.perform();
}

/**
 * 将源对象的所有属性拷贝到目标对象中
 *
 * @param {Object} target 目标对象.
 * @param {Object} source 源对象.
 * @return {Object} 目标对象.
 */
function extend(target, source) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p];
        }
    }
    return target;
}

/**
 * @param {string} input 输入文件.
 * @param {Object=} opt_options 参数选项.
 */
function calcdeps(input, opt_options) {
  var defaultOptions = {
        'output' : _('build.dir') + '/app.js',
        'jar' : _('tools.dir') + '/lib/google-closure-compiler.jar',
        'level' : 'ADVANCED_OPTIMIZATIONS',
        'mode' : 'compiled',
        'formatting' : 'PRETTY_PRINT',
        'cssoutputfile' : _('build.dir') + '/app.css',
        'tploutputfile' : _('build.dir') + '/tpl.html',
        'extraflags' : []
      },
      options = extend(defaultOptions, opt_options || {});

  // 两个task，需要sequential保证串行
  var sequential = createTask('sequential');

  var mkdir = createTask('mkdir');
  mkdir.setDir(new java.io.File(_('build.dir')));

  var exec = createTask('exec');
  exec.setExecutable('python');
  exec.setFailonerror(true);
  exec.setLogError(true);
  exec.setOutput(new java.io.File(options['output']));

  exec.createArg().setValue(_('tools.dir') + '/lib/calcdeps.py');
  exec.createArg().setLine('-i "' + input + '"');
  exec.createArg().setLine('-p "."');
  exec.createArg().setLine('-o "' + options['mode'] + '"');
  exec.createArg().setLine('-c "' + options['jar'] + '"');
  exec.createArg().setLine('-f "--compilation_level=' + options['level'] + '"');
  exec.createArg().setLine('-f "--summary_detail_level=3"');
  exec.createArg().setLine('-f "--generate_exports"');
  exec.createArg().setLine('-f "--warning_level=VERBOSE"');
  exec.createArg().setLine('-f "--css_output_file=' + options['cssoutputfile'] + '"');
  exec.createArg().setLine('-f "--tpl_output_file=' + options['tploutputfile'] + '"');
  exec.createArg().setLine('-f "--output_wrapper=(function(){%output%})();"');

  var extraflags = options['extraflags'];
  if (extraflags) {
    for (var i = 0, j = extraflags.length; i < j; i++) {
      exec.createArg().setLine(extraflags[i]);
    }
  }

  sequential.addTask(mkdir);
  sequential.addTask(exec);
  sequential.perform();
}

/**
 * @param {string} command 要执行的命令.
 * @param {Array.<string>=} opt_args 命令参数，可选.
 */
function exec(command, opt_args) {
  var task = createTask('exec');
  task.setExecutable(command);
  task.setFailonerror(true);
  task.setLogError(true);

  if (Object.prototype.toString.call(opt_args) == "[object Array]") {
    for(var i = 0, j = opt_args.length; i < j; i ++) {
      task.createArg().setLine(opt_args[i]);
    } 
  }

  task.perform();
}

// -- 下面的函数是在DAN/CLB里面用到的 --

// document.write('<script type="text/javascript" src="/src/tangram.js"></script>');

/**
 * @param {string} input 输入文件.
 * @return {string} 文件的内容.
 */
function readFile(input) {
  var file = new java.io.File(getPath(input));
  if (!file.exists()) {
    return '';
  }

  var scanner = new java.util.Scanner(file, "utf-8").useDelimiter("\\Z");
  var content = scanner.next();
  scanner.close();

  return content.toString();
}

/**
 * @param {java.io.File|string} input 要写入的文件.
 * @param {string} content 内容.
 */
function writeFile(input, content) {
  var file = input;
  if (Object.prototype.toString.call(input) == '[object String]') {
    file = new java.io.File(input);
  }
  
  var writer = new java.io.BufferedWriter(new java.io.FileWriter(file));
  writer.write(content);
  writer.close();
}

/**
 * @param {string} input 归一化文件的路径.
 * @return {string} 归一化之后的路径.
 */
function getPath(input) {
  return input.replace('/', java.io.File.separator);
}

/**
 * @param {string} input 输入文件
 */
function merge_js(input) {
  var lines = readFile(input).split("\n");
  if (lines.length > 0) {
    var line,
        match,
        merged = [],
        pattern = /src="\/([^"]+)"/;
    for (var i = 0, j = lines.length; i < j; i ++) {
      line = lines[i];
      if (line.indexOf('document.write') != 0) {
        continue;
      }
      match = pattern.exec(line);
      if (match) {
        merged.push(readFile(match[1]));
      }
    }

    var tmp = java.io.File.createTempFile("merged.js", ".tmp");
    writeFile(tmp, merged.join('\n'));

    copy(tmp.getAbsolutePath(), _("build.dir") + '/' + input);
  }
}

/**
 * @param {string} input 输入文件.
 */
function compile_js(input) {

}

/**
 * @import '../../src/css/base.css';
 * @param {string} input 输入文件.
 */
function merge_css(input) {
  var lines = readFile(input).split('\n');
  if (lines.length > 0) {
    var line,
        match,
        merged = [],
        pattern = /@import\s+'\.\.\/\.\.\/([^']+)'/;

    for (var i = 0, j = lines.length; i < j; i ++) {
      line = lines[i];
      if (line.indexOf('@import') != 0) {
        continue;
      }

      match = pattern.exec(line);
      if (match) {
        merged.push(readFile(match[1]));
      }
    }

    var tmp = java.io.File.createTempFile("merged.css", ".tmp");
    writeFile(tmp, merged.join(';'));
    
    copy(tmp.getAbsolutePath(), _("build.dir") + '/' + input);
  }
}

// -- END
















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
