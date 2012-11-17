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
import unittest
import tempfile
import logging

from assets_manager import AssetsManager
import html_rewriter

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/01/26 17:32:58'
__revision = '$Revision$'

class HtmlRewriterTestCase(unittest.TestCase):
  def setUp(self):
    self.root = os.path.join(os.path.dirname(__file__), '../../../../')
    self.output_dir = os.path.join(tempfile.gettempdir(), 'output')
    am = AssetsManager(self.output_dir)
    self._hr = html_rewriter.HtmlRewriter(self.root, am)

  def tearDown(self):
    pass

  def testRewriteOnelineTemplate(self):
    """
    拿线上的模板进行测试，保证处理之后不会出现大的问题
    wget http://jn.baidu.com/assets/tpl-e6474c5758caf65c64ca75bf28f1ea80.html
    *.expected.html进行过一些小的调整：
    1. 把属性值的'修改为"
    2. 把属性值中的&amp;修改为&
    3. 自闭合标签的/前面加一个空格
    """
    base, ext = os.path.splitext(__file__)
    new_code = self._hr.rewrite(base + '.html')
    self.assertEquals(open(base + '.expected.html').read(), new_code)

  def testRewriteStyle(self):
    base, ext = os.path.splitext(__file__)
    new_code = self._hr.rewrite(base + '.style.html')
    self.assertEquals(open(base + '.style.expected.html').read(), new_code)

if __name__ == '__main__':
  logging.basicConfig(format="%(levelname)-5s:%(name)s:%(message)s", level=logging.DEBUG)
  unittest.main()





