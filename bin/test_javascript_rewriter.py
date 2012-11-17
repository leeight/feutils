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
import javascript_rewriter

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/01/26 17:32:58'
__revision = '$Revision$'

class JavaScriptRewriterTestCase(unittest.TestCase):
  def setUp(self):
    self.output_dir = os.path.join(tempfile.gettempdir(), 'output')
    self.root = os.path.join(os.path.dirname(__file__), '../../../../')
    am = AssetsManager(self.output_dir)
    self._jr = javascript_rewriter.JavaScriptRewriter(self.root, am)

  def tearDown(self):
    pass

  def testRewrite(self):
    base, ext = os.path.splitext(__file__)
    code = open(base + '.js').read()
    new_code = self._jr.rewrite(code)
    self.assertEquals(open(base + '.expected.js').read(), new_code)
    self.assertTrue(os.path.exists(self.output_dir + "/assets/image/clock-97271de6f985934636c02365b1c7ef1b.png"))
    self.assertTrue(os.path.exists(self.output_dir + "/assets/application/LineGraph_OK_v3-0bee5fcb0899fb7de9868f1e7158f55b.swf"))
    self.assertTrue(os.path.exists(self.output_dir + "/assets/text/history-f9b3d4dfbaf2a3a45946ef4d93d8067b.html"))

if __name__ == '__main__':
  logging.basicConfig(format="%(levelname)-5s:%(name)s:%(message)s", level=-1)
  unittest.main()





