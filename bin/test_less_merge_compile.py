#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 :
# ***************************************************************************
# 
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$
# 测试Fer中合并和编译less部分的代码
# 说明：请在webapp目录运行此脚本，否则会有问题
# **************************************************************************/
 
 
 
import os
import sys
import unittest
import logging
import tempfile
from gen_deploy import merge_compile_rewrite
from assets_manager import AssetsManager


__author__ = 'songao <songao@baidu.com>'
__date__ = '2012/04/21 10:39:46'
__revision = '$Revision$'


class LessMergeCompileTestCase(unittest.TestCase):
  def setUp(self):
    self._output_dir = tempfile.mkdtemp()
    self._am = AssetsManager(self._output_dir)
    self._less_include_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'test_less'))
    self._css_1 = """
.s1 {
    color: red;
    background: url(../assets/img/loading.gif);
}
"""
    self._css_2 = """
.s2 {
    font-size: 12px;
    background: url(../../assets/img/esui.png);
}
"""
    self._less_1 = """
@orange: #FF9A00;
.jn-font() {
    font-size: 12px;
}
.jn-warning {
    color: @orange;
    .jn-font();
}
"""
    self._less_2 = """
.jn-row {
    line-height: 24px;
    span,
    .ui-text {
        float: left;
        margin-right: 10px;
    }
}
"""
    self._less_with_import_1 = """
@import-once "system.less";
@import-once "base.less";
.ls1 {
    .base-color();
}
"""
    self._less_with_import_2 = """
@import-once "system.less";
@import-once "common.less";
.ls2 {
    .base-color();
    .common-opacity();
}
"""

  def tearDown(self):
    pass

  # case1: pure css merge
  def testCase1(self):
    input_arr = [('', self._css_1), ('', self._css_2)]
    expected = """
/*Not Empty*/
.s1 {
    color: red;
    background: url(assets/image/loading-32c198278c026985bc8ece35bf38546f.gif)
    }
.s2 {
    font-size: 12px;
    background: url(assets/image/esui-9eefceb966b0922c9b22526bb8555f21.png)
    }
"""
    new_code = merge_compile_rewrite(input_arr, self._less_include_path, self._am)
    self.assertEquals(expected.strip(), new_code.strip())
    self.assertTrue(os.path.exists(os.path.join(self._output_dir, "assets/image/loading-32c198278c026985bc8ece35bf38546f.gif")))
    self.assertTrue(os.path.exists(os.path.join(self._output_dir, "assets/image/esui-9eefceb966b0922c9b22526bb8555f21.png")))

  # case2: pure less merge
  def testCase2(self):
    input_arr = [('', self._less_1), ('', self._less_2)]
    expected = """
/*Not Empty*/
.jn-warning {
    color: #ff9a00;
    font-size: 12px
    }
.jn-row {
    line-height: 24px
    }
.jn-row span, .jn-row .ui-text {
    float: left;
    margin-right: 10px
    }
"""
    new_code = merge_compile_rewrite(input_arr, self._less_include_path, self._am)
    self.assertEquals(expected.strip(), new_code.strip())

  # case3: merge less files with duplicate import
  # the importing relation shows below:
  # --------------------------------------
  # less1 | <-- system.less
  #       | <-- base.less
  # --------------------------------------
  # less2 | <-- system.less
  #       | <-- common.less  <-- base.less
  # --------------------------------------
  # so, there are two duplicated files, system.less and base.less
  # the difference is that:
  # system.less is duplicated in the same importing level
  # while base.less is duplicated in different importing level
  def testCase3(self):
    input_arr = [('', self._less_with_import_1), ('', self._less_with_import_2)]
    expected = """
/*Not Empty*/
.system-s1 {
    font-family: Arial
    }
.base-s1 {
    height: 100px
    }
.ls1 {
    color: #333
    }
.common-s1 {
    font-weight: bold
    }
.ls2 {
    color: #333;
    opacity: 0.9
    }
"""
    new_code = merge_compile_rewrite(input_arr, self._less_include_path, self._am)
    self.assertEquals(expected.strip(), new_code.strip())


if __name__ == '__main__':
  logging.basicConfig(format="%(levelname)-5s:%(name)s:%(message)s", level=logging.DEBUG)
  unittest.main()









