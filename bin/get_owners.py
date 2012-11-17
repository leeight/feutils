#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
#
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$
# 扩展一下upload.py的owner.txt的功能
# **************************************************************************/



import os
import sys


__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/06/01 15:40:51'
__revision = '$Revision$'


def get_owners(files):
  """ 首先把文件拆分，拆成（目录，文件名），然后抛弃文件名即可 """
  dirs = set([os.path.split(f)[0] for f in files])
  return dirs

def main():
  files = [
    'src/main/webapp/build.xml',
    'src/main/webapp/build.sh',
    'src/main/build.sh',
    'build.sh',
    'build.xml',
  ]
  print get_owners(files)

if __name__ == "__main__":
  main()


