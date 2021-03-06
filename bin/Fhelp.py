#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 
# **************************************************************************/
 
 
 
import os
import sys
import platform
 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/04/17 10:39:46'
__revision = '$Revision$'

FHELP_PY_PATH = os.path.dirname(os.path.abspath(__file__))

def main():
  commands = []
  for entry in os.listdir(FHELP_PY_PATH):
    if os.path.isfile(os.path.join(FHELP_PY_PATH, entry)):
      if entry.startswith('F'):
        if platform.system() == "Windows":
          if entry.endswith(".bat"):
            commands.append(entry.replace(".bat", ""))
        else:
          if entry.find(".") == -1:
            if os.access(os.path.join(FHELP_PY_PATH, entry), os.X_OK):
              commands.append(entry)

  print "Available commands:"
  for command in commands:
    print "  %s" % command

if __name__ == "__main__":
  main()



