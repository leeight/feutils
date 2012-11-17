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
import codecs
from HTMLParser import HTMLParser

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/01/24 21:49:54'
__revision = '$Revision$'

def utf8(s):
  if isinstance(s, unicode):
    return s.encode("utf-8")
  assert isinstance(s, str)
  return s

class HTMLProcessor(HTMLParser):
  def __init__(self, extern_js_files):
    HTMLParser.__init__(self)
    self.extern_js_files = extern_js_files
    self._indent_size = 4
    self._previous_tag_was_removed = False
    self._in_script = False
    self._in_external_script = False
    self._script_text = cStringIO.StringIO()
    self._main_text = cStringIO.StringIO()
    self._external_scripts = []
    self._external_styles = []

  def _get_buffer(self):
    if self._in_script:
      if self._in_external_script:
        return cStringIO.StringIO()
      else:
        return self._script_text
    else:
      return self._main_text

  def _handle_tag(self, tag, attrs, self_close = False):
    attr_dict = dict(attrs)     # 把attrs转化为dict
    if tag == 'script':
      self._in_script = True
      if attr_dict.get('src') is not None:
        self._in_external_script = True
        self._external_scripts.append(attr_dict.get('src'))
      self._previous_tag_was_removed = True
      return
    else:
      if tag == 'link':
        if attr_dict.get('rel') == 'stylesheet' and\
            attr_dict.get('type') == 'text/css':
          self._external_styles.append(attr_dict.get('href'))
          self._previous_tag_was_removed = True
          return

      buffer = self._get_buffer()
      buffer.write('<%s' % tag)
      for k, v in attrs:
        if v is None:
          buffer.write(' %s' % utf8(k))
        else:
          buffer.write(' %s="%s"' % (utf8(k), utf8(v).replace('"', '&quot;')))

      if self_close:
        buffer.write(' />')
      else:
        buffer.write('>')

  def handle_startendtag(self, tag, attrs):
    self._handle_tag(tag, attrs, True)

  def handle_starttag(self, tag, attrs):
    self._handle_tag(tag, attrs, False)

  def handle_endtag(self, tag):
    if tag == 'script':
      self._in_script = False
      self._in_external_script = False
    else:
      buffer = self._get_buffer()
      indent = ' ' * self._indent_size
      if tag == 'head':
        for file in self.extern_js_files:
          buffer.write('%s<script src="%s"></script>\n' % (indent, file))
        # FIXME 貌似这里的命名有些问题...
        # buffer.write('%s<script src="%s"></script>\n' % (indent, 'assets/js/core.js'))
        # buffer.write('%s<link rel="stylesheet" type="text/css" href="%s" />\n' % (indent, 'assets/css/core.css'))
        buffer.write('%s<script src="%s"></script>\n' % (indent, '%(app.js.path)s'))
        buffer.write('%s<link rel="stylesheet" type="text/css" href="%s" />\n' % (indent, '%(app.css.path)s'))

      buffer.write("</%s>" % tag)
      self._previous_tag_was_removed = False

  def handle_charref(self, name):
    self._get_buffer().write('&#%s;' % name)

  def handle_entityref(self, name):
    # FIXME 测试用例没问题，真正的页面a.html跑不过，奇怪.
    if self._in_script:
      self._get_buffer().write('&%s' % name)
    else:
      self._get_buffer().write('&%s;' % name)

  def handle_comment(self, data):
    if data.startswith("[if ") and data.endswith("<![endif]"):
      # 保留条件注释
      self._get_buffer().write("<!--%s-->" % utf8(data))

  def handle_decl(self, decl):
    self._get_buffer().write("<!%s>" % utf8(decl))

  def handle_data(self, data):
    self._get_buffer().write(utf8(data))

  def get_script(self):
    return self._script_text.getvalue()

  def get_main(self):
    return self._main_text.getvalue()

  def get_external_scripts(self):
    return self._external_scripts

  def get_external_styles(self):
    return self._external_styles

def get_html_processor(f, extern_js_files=[], charset="utf-8"):
  compiler = HTMLProcessor(extern_js_files)
  contents = codecs.open(f, 'r', charset).read()
  compiler.feed(contents)
  return compiler


