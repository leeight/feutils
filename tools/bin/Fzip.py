#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 对css，js，html进行一些简单的压缩处理
# **************************************************************************/
 
 
 
import re
import os
import sys
import logging
import subprocess
from datetime import datetime
from optparse import OptionParser
try:
  import distutils.version
except ImportError:
  # distutils is not available in all environments
  distutils = None

version_regex = re.compile('[\.0-9]+')
LIB_HOME = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'lib'))
YUI_JAR = os.path.join(LIB_HOME, 'yui-compressor.jar')
GCC_JAR = os.path.join(LIB_HOME, 'google-closure-compiler.jar')
copyleft = "/*! Copyright " + str(datetime.now().year) + " Baidu Inc. All Rights Reserved. */\n"
 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/07/22 11:08:49'
__revision = '$Revision$'


def get_java_version():
  """Returns the string for the current version of Java installed."""
  proc = subprocess.Popen(['java', '-version'], stderr=subprocess.PIPE)
  proc.wait()
  version_line = proc.stderr.read().splitlines()[0]
  return version_regex.search(version_line).group()

def java_verion_check():
  # User friendly version check.
  if distutils and not (distutils.version.LooseVersion(get_java_version()) >
      distutils.version.LooseVersion('1.6')):
    logging.error('Closure Compiler requires Java 1.6 or higher.')
    logging.error('Please visit http://www.java.com/getjava')
    sys.exit(1)

def zip_gcc(input, options):
  return zip_js(input, options)

def zip_yui(input, options):
  return zip_js(input, options)

def zip_js(input, options):
  java_verion_check()
  if options.engine == 'gcc':
    args = ['java', '-jar', GCC_JAR, '--js', input]
    if options.charset:
      args += ['--charset', options.charset]
  else:
    args = ['java', '-jar', YUI_JAR, '--line-break', '800', '--type', 'js']
    if options.charset:
      args += ['--charset', options.charset]
    args += [input]

  logging.info('Compiling with the following command: %s', ' '.join(args))
  proc = subprocess.Popen(args, stdout=subprocess.PIPE)
  (stdoutdata, stderrdata) = proc.communicate()
  if proc.returncode != 0:
    logging.error('Javascript compilation failed.')
    sys.exit(1)
  else:
    options.output.write(copyleft)
    options.output.write(stdoutdata)

def zip_css(input, options):
  java_verion_check()
  args = ['java', '-jar', YUI_JAR, '--line-break', '800', '--type', 'css']
  if options.charset:
    args += ['--charset', options.charset]
  args += [input]

  logging.info('Compiling with the following command: %s', ' '.join(args))
  proc = subprocess.Popen(args, stdout=subprocess.PIPE)
  (stdoutdata, stderrdata) = proc.communicate()
  if proc.returncode != 0:
    logging.error('Css compilation failed.')
    sys.exit(1)
  else:
    options.output.write(copyleft)
    options.output.write(stdoutdata)

def zip_json(input, options):
  import json
  object = json.loads(open(input).read())
  string = json.dumps(object)
  options.output.write(string)

def zip_html(input, options):
  pass

def main():
  logging.basicConfig(format='Fzip.py: %(message)s', level=logging.INFO)

  parser = OptionParser("Fzip.py [options] input")
  parser.add_option("-e", "--engine", dest="engine",
      choices=["yui", "gcc"], help="compressor engine")
  parser.add_option("-c", "--charset", dest="charset",
      help="input charset")
  parser.add_option("-o", "--output", dest="output", 
      help="output file")

  (options, args) = parser.parse_args()
  if len(args) <= 0:
    parser.print_help()
  else:
    input = args[0]
    options.output = open(options.output, 'w') if \
                     options.output else sys.stdout
    handler = None
    if options.engine:
      globals()['zip_' + options.engine](input, options)
    else:
      if input.endswith(".js"):
        handler = zip_js
      elif input.endswith(".css"):
        handler = zip_css
      elif input.endswith(".json"):
        handler = zip_json
      elif input.endswith(".html") or input.endswith(".htm"):
        handler = zip_html
      else:
        logging.error("unsupport format")

    if handler:
      handler(input, options)



if __name__ == "__main__":
  main()




