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
 * 打印出一些环境变量的信息，供调试使用.
 */
function echo_env() {
  echo('== ENV ==');
  if (_('env.OS') == 'Windows_NT') {
    echo(_('env.Path'));
  } else {
    echo(_('env.PATH'));
  }
  exec('java', ['-version']);
  echo('== END ==');
}

/**
 * 需要在ant脚本里面添加这句话
 * <property environment="env" />
 * @return {string} null device.
 */
function getNullDevice() {
  if (_('env.OS') == 'Windows_NT') {
    return 'NUL:';
  } else {
    return '/dev/null';
  }
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
 * @return {string} 获取一个临时的文件路径.
 */
function tempfile() {
  var property = uuid();

  var task = createTask('tempfile');
  task.setProperty(property);
  task.setDeleteOnExit(true);
  task.perform();

  return _(property);
}

/**
 * 从一个路径中获取文件的名字.
 *
 * @param {string} path 输入的路径.
 * @return {string} 文件名称.
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
 * @param {boolean=} opt_overwrite 是否覆盖.
 */
function copy(from, to, opt_overwrite) {
  var task = createTask('copy');
  task.setFile(new java.io.File(from));
  task.setTofile(new java.io.File(to));
  if (opt_overwrite) {
    task.setOverwrite(true);
  }
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
 * @param {Array.<string>=} opt_extraflags 命令行参数.
 */
function gcc(input, output, opt_jar, opt_extraflags) {
  var task = createTask('java'),
      jar = opt_jar || (_('tools.dir') + '/lib/google-closure-compiler.jar');

  task.setJar(new java.io.File(jar));
  task.setFork(true);
  task.setFailonerror(true);
  task.setMaxmemory('128m');
  task.createArg().setLine('--js_output_file ' + output);
  if (isString(input)) {
    task.createArg().setLine('--js ' + input);
  } else if (isArray(input)) {
    for (var i = 0, j = input.length; i < j; i++) {
      task.createArg().setLine('--js ' + input[i]);
    }
  }

  var extraflags = opt_extraflags || [];
  if (extraflags.length) {
    for (var i = 0, j = extraflags.length; i < j; i++) {
      task.createArg().setLine(extraflags[i]);
    }
  }

  try {
    task.perform();
  } catch (e) {
    echo('gcc failed');
  }
}


/**
 * 判断目标参数是否Array对象
 *
 * @param {*} source 目标参数.
 * @return {boolean} 类型判断结果.
 */
function isArray(source) {
  return '[object Array]' == Object.prototype.toString.call(
                             /** @type {Object}*/ (source));
}

/**
 * 判断目标参数是否string类型或String对象
 *
 * @param {*} source 目标参数.
 * @return {boolean} 类型判断结果.
 */
function isString(source) {
  return '[object String]' == Object.prototype.toString.call(
                              /** @type {Object}*/ (source));
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

  if (isArray(opt_args)) {
    for (var i = 0, j = opt_args.length; i < j; i++) {
      task.createArg().setLine(opt_args[i]);
    }
  }

  task.perform();
}

// -- 下面的函数是在DAN/CLB里面用到的 --

/**
 * @param {string} input 输入文件.
 * @return {string} 文件的内容.
 */
function readFile(input) {
  var file = new java.io.File(getPath(input));
  if (!file.exists()) {
    return '';
  }

  var content = '';
  var scanner = new java.util.Scanner(file, 'utf-8').useDelimiter('\\Z');
  if (scanner.hasNext()) {
    content = scanner.next();
  }
  scanner.close();

  return content;
}

/**
 * @param {java.io.File|string} input 要写入的文件.
 * @param {string} content 内容.
 */
function writeFile(input, content) {
  var file = input;
  if (isString(input)) {
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
 * @param {string} input 输入的文件.
 * @return {Array.<string>} 需要加载的文件列表.
 */
function getFileSet(input) {
  var fileset = [];

  var lines = readFile(input).split('\n');
  if (lines.length > 0) {
    var line,
        match,
        pattern = /src="\/([^"]+)"/;
    for (var i = 0, j = lines.length; i < j; i++) {
      line = lines[i];
      if (line.indexOf('document.write') != 0) {
        continue;
      }
      match = pattern.exec(line);
      if (match) {
        fileset.push(match[1]);
      }
    }
  }

  return fileset;
}

/**
 * 获取文件的内容
 * @param {string} input 输入的js文件.
 * @return {string} 文件的内容.
 */
function getFileContent(input) {
  var fileset = getFileSet(input);
  if (fileset.length > 0) {
    var merged = [];
    for (var i = 0, j = fileset.length; i < j; i++) {
      merged.push(readFile(fileset[i]));
    }
    return merged.join('\n');
  } else {
    return '';
  }
}

/**
 * 用gcc来检测文件的错误，编译的时候给出的错误太粗略了，不能
 * 确定是哪个文件里面的。
 * @param {Array.<string>|string} input 输入文件.
 */
function gcc_lint(input) {
  var fileset = [];
  if (isString(input)) {
    fileset = getFileSet(input);
  } else if (isArray(input)) {
    for (var i = 0, j = input.length; i < j; i++) {
      fileset = fileset.concat(getFileSet(input[i]));
    }
  } else {
    // ignore
    return;
  }

  var extraflags = [
    '--warning_level=VERBOSE'
  ];
  gcc(fileset, getNullDevice(), null, extraflags);
}

/**
 * @param {Array.<string>|string} input 输入文件.
 * @param {string=} opt_output 输出文件，会添加_("build.dir")前缀的.
 */
function merge_js(input, opt_output) {
  var content = [],
      dest;
  if (isArray(input)) {
    for (var i = 0, j = input.length; i < j; i++) {
      content.push(getFileContent(input[i]));
    }
    dest = opt_output || input[input.length - 1]; // 默认是数组的最后一个.
  } else {
    content.push(getFileContent(input));
    dest = opt_output || input;           // 需要保存的文件名
  }

  var tmp = java.io.File.createTempFile('merged.js', '.tmp');
  writeFile(tmp, content.join('\n'));

  copy(tmp.getAbsolutePath(), _('build.dir') + '/' + dest);
}

/**
 * @param {string} input 输入文件.
 */
function compile_js(input) {
  echo('compiling ' + input + ' ...');
  var extraflags = [
    '--define=\'dn.COMPILED="true"\'',
    '--warning_level=VERBOSE'
  ];

  if (_('env.USER') != 'scmpf') {
    extraflags.push('--formatting PRETTY_PRINT');
  }

  var output = tempfile();
  gcc(input, output, null, extraflags);
  copy(output, input, true);
}

/**
 * @param {string} input 输入文件.
 */
function compile_css(input) {
  echo('compiling ' + input + ' ...');

  var output = tempfile();
  yui(input, output);
  copy(output, input, true);
}

/**
 * @param {string} input 输入文件.
 */
function merge_css(input) {
  var lines = readFile(input).split('\n');
  if (lines.length > 0) {
    var line,
        match,
        merged = [],
        pattern = /@import\s+'\.\.\/\.\.\/([^']+)'/;

    for (var i = 0, j = lines.length; i < j; i++) {
      line = lines[i];
      if (line.indexOf('@import') != 0) {
        continue;
      }

      match = pattern.exec(line);
      if (match) {
        merged.push(readFile(match[1]));
      }
    }

    var tmp = java.io.File.createTempFile('merged.css', '.tmp');
    writeFile(tmp, merged.join(';'));

    copy(tmp.getAbsolutePath(), _('build.dir') + '/' + input);
  }
}

// -- END
















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
