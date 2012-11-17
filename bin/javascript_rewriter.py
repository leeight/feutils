#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
#
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$
#
# **************************************************************************/



import os
import sys
import logging
import optparse
import re
import Frewriter

TokenType = Frewriter.TokenType

LIB_HOME = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')
sys.path.insert(0, os.path.join(LIB_HOME, 'google-closure-linter'))
sys.path.insert(0, os.path.join(LIB_HOME, 'cssutils'))

res_regex = re.compile('RES\s*\(\s*(?P<quote>[\'\"])(?P<uri_path>/[^\)]+)([\'\"])\s*\)')

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/01/26 11:05:14'
__revision = '$Revision$'

class JavaScriptRewriter(object):
  def __init__(self, root, assets_manager):
    """
    root是服务器的根目录路径，用来处理RES(/assets/img/a.png)的情况
    assets_manager是资源管理器，用于拷贝文件.
    """
    self._root = root
    self._am = assets_manager

  def _found_resource(self, resource, uri_path):
    if uri_path.startswith("/"):
      uri_path = os.path.join(self._root, uri_path[1:])
    elif resource:
      uri_path = os.path.normpath(os.path.join(os.path.dirname(resource), uri_path))
    if os.path.exists(uri_path):
      return self._am.add(uri_path)
    else:
      logging.error("%s not exists.", uri_path)
      sys.exit(2)
      return None

  def rewrite(self, javascript_code):
    def repl(match):
      quote = match.group('quote')
      uri_path = match.group('uri_path')
      new_resource = self._found_resource(None, uri_path)
      if new_resource:
        return "RES(%s%s%s)" % (quote, new_resource, quote)
      else:
        # 找不到的话，不要修改原来的内容
        return "RES(%s%s%s)" % (quote, uri_path, quote)

    return res_regex.sub(repl, javascript_code)

  def _rewrite(self, javascript_code):
    first_token = Frewriter.tokenizer(javascript_code)
    token = first_token
    while token:
      if token.type == TokenType.IDENTIFIER and \
        token.string == 'RES':
          start_paren = token.next
          quote = start_paren.next
          # print 'type: [%s]  string: [%s]' % (quote.type, quote.string)
          if quote.type != TokenType.SINGLE_QUOTE_STRING_START and \
              quote.type != TokenType.DOUBLE_QUOTE_STRING_START:
            logging.error('Invalid call RES() function @%s.', token.line_number)
            token = quote
            continue

          resource = quote.next
          if resource.type != TokenType.STRING_TEXT:
            logging.error('RES()\' parameter must be const STRING.')
            token = resource
            continue

          print 'type: [%s]  string: [%s]' % (resource.type, resource.string)
          new_resource = self._found_resource(None, resource.string)
          if new_resource:
            resource.string = new_resource
          token = resource.next
      token = token.next
    return Frewriter.dump_source(first_token)


def main():
  parser = optparse.OptionParser()
  parser.add_option('-o', '--output',
                    dest='output',
                    action="store",
                    help='Output file.')
  (options, args) = parser.parse_args()

  if not len(args):
    parser.print_help()
    sys.exit(1)

  from assets_manager import AssetsManager

  am = AssetsManager("/tmp/output")
  rewriter = JavaScriptRewriter(".", am)
  output = rewriter.rewrite(open(args[0]).read())
  if options.output:
    open(options.output, 'wb').write(output)
  else:
    print output

if __name__ == "__main__":
  main()



