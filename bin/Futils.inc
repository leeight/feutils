#!/bin/bash

MOD_HOME=`dirname $0`
MOD_HOME=`readlink -f "${MOD_HOME}"`
MOD_HOME=`dirname "${MOD_HOME}"`
LIB_HOME="${MOD_HOME}/lib"
BIN_HOME="${MOD_HOME}/bin"

YUI_JAR="${LIB_HOME}/yui-compressor.jar"
GCC_JAR="${LIB_HOME}/google-closure-compiler.jar"
JS_BEAUTIFY="${LIB_HOME}/libjavascript-beautifier-perl/bin/js_beautify.pl"
GJSLINT="${LIB_HOME}/google-closure-linter/bin/gjslint"
FIXJSSTYLE="${LIB_HOME}/google-closure-linter/bin/fixjsstyle"
RHINO_JAR="${LIB_HOME}/js.jar"
JSHINT="${LIB_HOME}/jshint/env/rhino.js ${LIB_HOME}/jshint/jshint.js"

# 加载http://code.google.com/p/shflags
. ${LIB_HOME}/shflags

# 定义一些公共的函数
die() {
  [ $# -gt 0 ] && echo "error: $@" >&2
  flags_help
  exit 1
}
