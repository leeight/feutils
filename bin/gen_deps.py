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
import logging
import calcdeps

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/06/05 11:55:10'
__revision = '$Revision$'


#{{{gen_deps
def gen_deps(options, args):
  search_paths = calcdeps.GetPathsFromOptions(options)

  if options.output_file:
    out = open(options.output_file, 'wb')
  else:
    out = sys.stdout

  result = calcdeps.PrintDeps(search_paths, calcdeps.ExpandDirectories(options.deps or []), out)
  if not result:
    logging.error('Could not find Closure Library in the specified paths')
    sys.exit(1)
#}}}



