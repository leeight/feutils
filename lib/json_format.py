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
 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/01/22 23:11:58'
__revision = '$Revision$'

import json

if __name__ == "__main__":
  object = json.loads(open(sys.argv[1]).read())
  print json.dumps(object, indent = 4)


