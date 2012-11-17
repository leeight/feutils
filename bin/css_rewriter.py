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

url_regex = re.compile(r'url\s*\(\s*([\'\"]?)([^\)\'\"]+)(\1)\s*\)')

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
  def __init__(self, root, assets_manager, ignore_depth = False):
    """
    root是服务器的根目录路径，用来处理background:url(/assets/img/a.png)的情况
    assets_manager是资源管理器，用开拷贝文件.
    ignore_depth忽略资源URI前面的../和./
    """
    self._root = root
    self._am = assets_manager
    self._ignore_depth = ignore_depth

  def _found_resource(self, resource, uri_path):
    if uri_path.startswith('http://') or \
       uri_path.startswith('https://') or \
       uri_path.startswith('//'):
        return uri_path

    if self._ignore_depth:
      """
      原来_ignore_depth就是给*.less用的，现在又hard在这里了。
      举个例子：
      src/jn/gold/product/upload/excelList/list.less
      中引用了资源../../assets/img/coupui.png
      虽然从list.less无法找到coupui.png，但是我们能够从entry_point中的css找到，因为
      在combine_css=1的情况下，我们并不是直接引用list.less，而是通过/combine/all.css
      这个请求来自动合并所有的*.less，因此刚好可以找到/assets/img/coupui.png
      不过这个假设貌似是错误的，不然编译出来的*.compiled.css是不对的，那么在svn.baidu.com并且nc=1的时候
      是不找不到coupui.png这个图片的
      """
      root_path = os.path.normpath(os.path.join('/', uri_path))
      uri_path = os.path.join(self._root, root_path[1:])
    elif uri_path.startswith("/"):
      uri_path = os.path.join(self._root, uri_path[1:])
    else:
      uri_path = os.path.normpath(os.path.join(os.path.dirname(resource), uri_path))

    logging.debug('uri_path = [%s]', uri_path)
    if os.path.exists(uri_path):
      return self._am.add(uri_path)
    else:
      logging.error("%s not exists. resource = [%s]", uri_path, resource)
      sys.exit(2)
      return None

  def rewrite_code(self, css_code):
    cssutils.ser.prefs.useMinified()
    cssss = cssutils.parseString("div{%s}" % css_code)
    new_code = self._rewrite_impl(cssss, lambda x : self._found_resource(".", x))
    return new_code[4:-1]

  def rewrite(self, resource):
    # CSS Style Sheet
    cssss = cssutils.parseFile(resource)
    return self._rewrite_impl(cssss, lambda x : self._found_resource(resource, x))

  def fast_rewrite(self, code, resource):
    return url_regex.sub(lambda m : 'url(' + self._found_resource(resource, m.group(2)) + ')', code)

  def _rewrite_impl(self, cssss, new_uri_path_callback):
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
                # logging.warning(k.getStringValue())
                uri_path = new_uri_path_callback(k.getStringValue())
                if uri_path:
                  k.setStringValue(k.CSS_URI, uri_path)
          elif value.cssValueType == value.CSS_PRIMITIVE_VALUE and \
               value.primitiveType == value.CSS_URI:
            uri_path = new_uri_path_callback(value.getStringValue())
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



