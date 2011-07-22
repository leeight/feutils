#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id: Fformat.py 81878 2011-07-22 03:07:02Z  $ 
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
__revision = '$Revision: 81878 $'

def format_js(input, output):
  pass

def format_css(input, output):
  import cssutils
  sheet = cssutils.parseString(input)
  string = sheet.cssText

  if output:
    open(output, "w").write(string)
  else:
    print string

def format_json(input, output):
  import json
  object = json.loads(open(input).read())
  string = json.dumps(object, indent = 4)
  if output:
    open(output, 'w').write(string)
  else:
    print string

def format_html(input, output):
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
    handler = None
    if options.type:
      globals()['format_' + options.type](input, options.output)
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
      handler(input, options.output)



if __name__ == "__main__":
  main()




