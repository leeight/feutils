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
import assets_manager
import tempfile
import hashlib

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/01/26 11:05:40'
__revision = '$Revision$'

class AssetsManagerTestCase(unittest.TestCase):
  def setUp(self):
    self._root = tempfile.mkdtemp()

    self._sign = hashlib.md5("hello world").hexdigest()
    self._js_file = os.path.join(self._root, 'a.js')
    self._css_file = os.path.join(self._root, 'a.css')
    self._html_file = os.path.join(self._root, 'a.html')
    self._png_file = os.path.join(self._root, 'a.png')

    self._am = assets_manager.AssetsManager(self._root)

    open(self._js_file, 'wb').write('hello world')
    open(self._css_file, 'wb').write('hello world')
    open(self._html_file, 'wb').write('hello world')
    open(self._png_file, 'wb').write('hello world')

  def tearDown(self):
    import shutil
    shutil.rmtree(self._root)

  def testAdd(self):
    self._am.add(self._js_file)
    self._am.add(self._js_file)
    self._am.add(self._css_file)
    self._am.add(self._html_file)
    self._am.add(self._png_file)
    self.assertTrue(os.path.exists(os.path.join(self._root, 'assets', 'js', 'a-%s.js' % self._sign)))
    self.assertTrue(os.path.exists(os.path.join(self._root, 'assets', 'css', 'a-%s.css' % self._sign)))
    self.assertTrue(os.path.exists(os.path.join(self._root, 'assets', 'text', 'a-%s.html' % self._sign)))
    self.assertTrue(os.path.exists(os.path.join(self._root, 'assets', 'image', 'a-%s.png' % self._sign)))

if __name__ == '__main__':
  unittest.main()



