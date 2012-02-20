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

LIB_HOME = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')
sys.path.insert(0, os.path.join(LIB_HOME, 'google-closure-linter'))
sys.path.insert(0, os.path.join(LIB_HOME, 'cssutils'))

import cssutils
cssutils.log.setLevel(logging.ERROR)
from cssutils import settings
settings.set('DXImageTransform.Microsoft', True)

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/01/26 11:05:14'
__revision = '$Revision$'

class CssRewriter(object):
  def __init__(self, root, assets_manager):
    """
    root是服务器的根目录路径，用来处理background:url(/assets/img/a.png)的情况
    deploy_root是app需要部署到的路径，用来把文件拷贝过去.
    """
    self._root = root
    self._am = assets_manager

  def _found_resource(self, resource, uri_path):
    if uri_path.startswith("/"):
      uri_path = os.path.join(self._root, uri_path[1:])
    else:
      uri_path = os.path.normpath(os.path.join(os.path.dirname(resource), uri_path))
    if os.path.exists(uri_path):
      return self._am.add(uri_path)
    else:
      logging.error("%s not exists.", uri_path)
      return None

  def rewrite(self, resource):
    # CSS Style Sheet
    cssss = cssutils.parseFile(resource)
    # CSS Rule List
    cssrl = cssss.cssRules
    # 遍历各个Rule
    for rule in cssss.cssRules:
      if rule.type != 1:
        continue
      # rule的类型是CSSStyleRule
      style = rule.style                  # CSSStyleDeclaration
      properties = style.getProperties()  # list<cssutils.css.Property>
      for p in properties:
        key = p.name
        value = p.cssValue
        if key.endswith('background') or \
           key.endswith('background-image'):
          if value.cssValueType == value.CSS_VALUE_LIST:
            for k in value:
              if k.primitiveType == k.CSS_URI:
                uri_path = self._found_resource(resource, k.getStringValue())
                if uri_path:
                  k.setStringValue(k.CSS_URI, uri_path)
          elif value.cssValueType == value.CSS_PRIMITIVE_VALUE and \
               value.primitiveType == value.CSS_URI:
            uri_path = self._found_resource(resource, value.getStringValue())
            if uri_path:
              value.setStringValue(value.CSS_URI, uri_path)
    return cssss.cssText


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
  rewriter = CssRewriter(".", am)
  output = rewriter.rewrite(args[0])
  if options.output:
    open(options.output, 'wb').write(output)

if __name__ == "__main__":
  main()



