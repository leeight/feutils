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
from gen_app import action_name_regex


__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/08/05 14:25:43'
__revision = '$Revision$'

class GenAppTestCase(unittest.TestCase):
  def testPattern(self):
    _ = lambda x : action_name_regex.match(x) is not None
    self.assertFalse(_("a.b.C"), "a.b.C")
    self.assertFalse(_("a.B.C"), "a.B.C")
    self.assertFalse(_("a.B.Cd"), "a.B.Cd")
    self.assertFalse(_("jn.demo.show_case.show_case"), "jn.demo.show_case.show_case")

    self.assertTrue(_("a.b.CD"), "a.b.CD")
    self.assertTrue(_("a.b.Cd"), "a.b.Cd")
    self.assertTrue(_("jn.demo.show_case.ShowCase"), "jn.demo.show_case.ShowCase")


if __name__ == '__main__':
  logging.basicConfig(format="%(levelname)-5s:%(name)s:%(message)s", level=logging.DEBUG)
  unittest.main()




