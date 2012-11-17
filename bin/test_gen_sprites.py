#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 :
# ***************************************************************************
# 
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 测试Fer中合并sprites的部分
# **************************************************************************/
 
 
 
import os
import sys
import unittest
import logging
import shutil
import tempfile
from gen_deploy import gen_sprites
from assets_manager import AssetsManager
 
 
__author__ = 'songao <songao@baidu.com>'
__date__ = '2012/04/26 13:39:32'
__revision = '$Revision$'


class GenSpritesTestCase(unittest.TestCase):
  def setUp(self):
    self._output_dir = tempfile.mkdtemp()
    self._am = AssetsManager(self._output_dir)
    # preparing
    image_root = os.path.join(self._output_dir, 'assets/image')
    base, ext = os.path.splitext(__file__)
    self._testcss1 = base + '.css'
    self._expectcss1 = base + '.expected.css'
    os.makedirs(image_root)
    self.file_copy('loading.png', 'icon-loading.png')
    self.file_copy('lm-round.png', 'icon-lm-round.png')
    self.file_copy('esui.png')
    shutil.copy2(self._testcss1, self._output_dir)

  def file_copy(self, filename, destname = None):
    image_root = os.path.join(self._output_dir, 'assets/image')
    shutil.copy2(os.path.dirname(__file__) + '../../../../assets/img/' + filename, os.path.join(image_root, (destname if destname else filename)))

  def tearDown(self):
    pass

  def testCase1(self):
    expected = """
"""
    io_file = os.path.join(self._output_dir, os.path.basename(self._testcss1))
    ep_sprite_img_file = os.path.basename(io_file).replace('.css', '-sprites.png')
    gen_sprites(self._am, io_file)
    self.assertEquals(open(self._expectcss1).read() % {'output_dir' : self._output_dir}, open(io_file).read())
    #self.assertTrue(os.path.exists(os.path.join(self._output_dir, "assets/image/" + ep_sprite_img_file)))



if __name__ == '__main__':
  logging.basicConfig(format="%(levelname)-5s:%(name)s:%(message)s", level=logging.DEBUG)
  unittest.main()






