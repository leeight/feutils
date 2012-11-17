#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 格式化一些文件，比如js,css,json等等
# **************************************************************************/
 
 
 
import os
import sys
import logging
from optparse import OptionParser
 
LIB_HOME = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'lib'))
sys.path.insert(0, os.path.join(LIB_HOME, 'cssutils'))

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/07/21 23:40:46'
__revision = '$Revision$'

def format_js_string(code, options = None):
  import jsbeautifier
  return jsbeautifier.beautify(code)

def format_js(input, options):
  import jsbeautifier
  string = jsbeautifier.beautify_file(input)
  options.output.write(string)

def format_css(input, options):
  import cssutils
  sheet = cssutils.parseFile(input)
  string = sheet.cssText
  options.output.write(string)

def format_json(input, options):
  import json
  object = json.loads(open(input).read())
  string = json.dumps(object, indent = 4)
  options.output.write(string)

def format_html(input, options):
  pass

def main():
  logging.basicConfig(format='Fformat.py: %(message)s', level=logging.INFO)

  parser = OptionParser("Fformat.py [options] input")
  parser.add_option("-t", "--type", dest="type",
      choices=["js", "json", "css", "html"],
      help="input type")
  parser.add_option("-o", "--output", dest="output", 
      help="output file")

  (options, args) = parser.parse_args()
  if len(args) <= 0:
    parser.print_help()
  else:
    input = args[0]
    if options.output == "DEFAULT_NAME":
      fpath, fname = os.path.split(input)
      options.output = os.path.join(fpath, 'formated.' + fname)
    options.output = open(options.output, 'w') if \
                     options.output else sys.stdout
    handler = None
    if options.type:
      globals()['format_' + options.type](input, options)
    else:
      if input.endswith(".js"):
        handler = format_js
      elif input.endswith(".css"):
        handler = format_css
      elif input.endswith(".json"):
        handler = format_json
      elif input.endswith(".html") or input.endswith(".htm"):
        handler = format_html
      else:
        logging.error("unsupport format")

    if handler:
      handler(input, options)



if __name__ == "__main__":
  main()




