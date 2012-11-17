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
import cStringIO
import optparse
import logging
from HTMLParser import HTMLParser
import css_rewriter


__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/02/14 14:53:13'
__revision = '$Revision$'

def utf8(s):
  if isinstance(s, unicode):
    return s.encode("utf-8")
  assert isinstance(s, str)
  return s

class HtmlTraversal(HTMLParser):
  def __init__(self, new_path_callback, new_style_callback):
    HTMLParser.__init__(self)
    self.buffer = cStringIO.StringIO()
    self.get_new_path = new_path_callback
    self.get_new_style = new_style_callback

  def _add_attr(self, k, v):
    self.buffer.write(' %s="%s"' % (utf8(k), utf8(v).replace('"', '&quot;')))

  def _handle_tag(self, tag, attrs, self_close = False):
    self.buffer.write('<%s' % tag)
    for k, v in attrs:
      if v is None:
        self.buffer.write(' %s' % utf8(k))
      elif k == 'src':
        if tag in ('img'):
          self._add_attr(k, self.get_new_path(v))
        else:
          self._add_attr(k, v)
      elif k == 'style':
        if len(v) > 0:
          self._add_attr(k, self.get_new_style(v))
        else:
          # TODO 不应该加了吧，没有意义
          self._add_attr(k, v)
      else:
        self._add_attr(k, v)

    self.buffer.write(' />' if self_close else '>')

  def handle_startendtag(self, tag, attrs):
    self._handle_tag(tag, attrs, True)

  def handle_starttag(self, tag, attrs):
    self._handle_tag(tag, attrs, False)

  def handle_endtag(self, tag):
    self.buffer.write("</%s>" % tag)

  def handle_charref(self, name):
    self.buffer.write('&#%s;' % name)

  def handle_entityref(self, name):
    self.buffer.write('&%s;' % name)

  def handle_comment(self, data):
    self.buffer.write("<!--%s-->" % utf8(data))

  def handle_decl(self, decl):
    self.buffer.write("<!%s>" % utf8(decl))

  def handle_data(self, data):
    self.buffer.write(utf8(data))

  def get_main(self):
    return self.buffer.getvalue()

class HtmlRewriter(object):
  def __init__(self, root, assets_manager):
    """
    root是服务器的根目录路径用来处理<img src='...'>和<div style='...'></div>的情况
    assets_manager是资源管理器，用开拷贝文件.
    """
    self._root = root
    self._am = assets_manager

  def _found_resource(self, resource, uri_path):
    if uri_path.startswith("{") or \
       uri_path.startswith("javascript:") or \
       len(uri_path) == 0:
      logging.warning("Invalid src = [%s] for img", uri_path)
      # 兼容如下的情况
      # <img src="{1}">
      # <img src="javascript:void(0)">
      # <img src="">
      return uri_path

    if uri_path.startswith('http://') or \
       uri_path.startswith('https://') or \
       uri_path.startswith('//'):
        return uri_path
    elif uri_path.startswith("/"):
      uri_path = os.path.join(self._root, uri_path[1:])
    else:
      uri_path = os.path.normpath(os.path.join(os.path.dirname(resource), uri_path))
    if os.path.exists(uri_path):
      return self._am.add(uri_path)
    else:
      logging.error("%s not exists.", uri_path)
      sys.exit(2)
      return None

  def rewrite(self, resource):
    def new_path_callback(path):
      # logging.error(path)
      new_path = self._found_resource(resource, path)
      return path if new_path is None else new_path

    def new_style_callback(style):
      # logging.error(style)
      if style.find("{") > -1 and style.find("}") > -1:
        # 兼容如下的情况
        # <div style="{4}">...</div>
        # <div style="float:left;{1}">...</div>
        # 因此如果存在这样子的情况 XXX
        # <div style="background:url(...);{1}">...</div>
        # 是无法处理的，自己想办法解决去...
        return style
      rewriter = css_rewriter.CssRewriter(self._root, self._am)
      new_style = rewriter.rewrite_code(style)
      return new_style

    traversal = HtmlTraversal(new_path_callback, new_style_callback)
    contents = open(resource, 'r').read()
    traversal.feed(open(resource, 'r').read())
    return traversal.get_main()

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
  rewriter = HtmlRewriter(".", am)
  output = rewriter.rewrite(args[0])
  if options.output:
    open(options.output, 'wb').write(output)
  else:
    print output

if __name__ == "__main__":
  main()



