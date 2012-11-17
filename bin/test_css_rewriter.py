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
import logging
import tempfile

import css_rewriter
from assets_manager import AssetsManager

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/01/26 17:32:58'
__revision = '$Revision$'

class CssRewriterTestCase(unittest.TestCase):
  def setUp(self):
    root = os.path.join(os.path.dirname(__file__), '../../../../')
    am = AssetsManager(os.path.join(tempfile.gettempdir(), 'output'))
    self._cr = css_rewriter.CssRewriter(root, am)

  def tearDown(self):
    pass

  def testPattern(self):
    from css_rewriter import url_regex
    def getResource(code):
      match = url_regex.search(code)
      if match is None:
        return None
      return match.group(2)

    expected = 'assets/image/loading-32c198278c026985bc8ece35bf38546f.gif'
    self.assertEquals(getResource('background:url(assets/image/loading-32c198278c026985bc8ece35bf38546f.gif)'), expected)
    self.assertEquals(getResource('background:url("assets/image/loading-32c198278c026985bc8ece35bf38546f.gif")'), expected)
    self.assertEquals(getResource('background:url(\'assets/image/loading-32c198278c026985bc8ece35bf38546f.gif\')'), expected)
    self.assertEquals(getResource('background:url(\'http://www.baidu.com/img/logo.gif\')'), 'http://www.baidu.com/img/logo.gif')
    self.assertEquals(getResource('background:url(\'x\')'), 'x')
    self.assertEquals(getResource('background:url("x\')'), None)

  def testRewrite(self):
    base, ext = os.path.splitext(__file__)
    new_code = self._cr.rewrite(base + '.css')
    self.assertEquals(open(base + '.expected.css').read(), new_code)

  def testRewriteCode(self):
    new_code = self._cr.rewrite_code("background:url(/assets/img/loading.gif)")
    self.assertEquals("background:url(assets/image/loading-32c198278c026985bc8ece35bf38546f.gif)", new_code)
    self.assertTrue(os.path.exists("/tmp/output/assets/image/loading-32c198278c026985bc8ece35bf38546f.gif"))

if __name__ == '__main__':
  logging.basicConfig(format="%(levelname)-5s:%(name)s:%(message)s", level=logging.DEBUG)
  unittest.main()





