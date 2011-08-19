#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 
# **************************************************************************/
 
 
 
import os
import sys
import logging
import urllib2
import urllib
from optparse import OptionParser
 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/08/19 13:42:18'
__revision = '$Revision$'


from closure_linter import javascripttokenizer
from closure_linter import javascripttokens
from closure_linter import tokenutil

TokenType = javascripttokens.JavaScriptTokenType

def tangram_compile(args, output):
  tokens = set()
  for filename in args:
    tokens.update(collect_tokens(filename))
  fetch_remote_source(list(tokens))

def fetch_remote_source(tokens):
  """
  发起HTTP请求，获取代码
  """

  src = "\n".join(map(lambda x : "///import %s;" % x, tokens))
  request = urllib2.Request("http://tangram.baidu.com/codesearch/script/code.php")
  request.add_data(urllib.urlencode({
    "compress" : "yui",
    "isLite" : "0",
    "nobase" : "false",
    "nouibase" : "false",
    "short_key" : "",
    "short_value" : "",
    "src" : src,
    "tag" : "src",
    "version" : "tangram-component_stable",
    "viewSource" : "0"
  }))
  handler = urllib2.urlopen(request)
  print handler.read()

def collect_tokens(filename):
  tokens = set()
  if not os.path.exists(filename):
    return tokens

  tokenizer = javascripttokenizer.JavaScriptTokenizer()
  lines_iter = file(filename)
  token = tokenizer.TokenizeFile(lines_iter)
  while token:
    if token.type == TokenType.IDENTIFIER:
      value = token.string
      if value.startswith("baidu."):
        tokens.add(value)
    token = token.next
  return tokens

def main():
  logging.basicConfig(format='Ftangram.py: %(message)s', level=logging.INFO)

  parser = OptionParser("Usage: Ftangram.py [options] file1 [file2 [file3] ... ]")
  parser.add_option("-o", "--output", dest="output", help="output file")
  parser.add_option("-f", "--functions", dest="functions", action="append")
 
  (options, args) = parser.parse_args()

  if options.functions:
    fetch_remote_source(filter(lambda x : x.startswith("baidu"), options.functions))
  elif len(args) <= 0:
    parser.print_help()
  else:
    options.output = open(options.output, 'w') if options.output else sys.stdout
    tangram_compile(args, options.output)

if __name__ == "__main__":
  main()



