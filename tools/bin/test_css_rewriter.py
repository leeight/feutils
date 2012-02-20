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
import css_rewriter

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/01/26 17:32:58'
__revision = '$Revision$'

class CssRewriterTestCase(unittest.TestCase):
  def setUp(self):
    self._cr = css_rewriter.CssRewriter(None, None)

  def tearDown(self):
    pass

  def testRewrite(self):
    self._cr.rewrite("/tmp/output/landmark.app.css")
    pass

if __name__ == '__main__':
  unittest.main()





