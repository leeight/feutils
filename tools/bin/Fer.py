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
import logging
import optparse
from calcdeps import GetPathsFromOptions, PrintDeps, ExpandDirectories


__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/07/28 18:07:16'
__revision = '$Revision$'


def gen_deps(options, args):
  search_paths = GetPathsFromOptions(options)

  if options.output_file:
    out = open(options.output_file, 'w')
  else:
    out = sys.stdout

  result = PrintDeps(search_paths, ExpandDirectories(options.deps or []), out)
  if not result:
    logging.error('Could not find Closure Library in the specified paths')
    sys.exit(1)

def main():
  logging.basicConfig(format='Fer: %(message)s', level=logging.DEBUG)
  
  usage = 'usage: %prog [options] arg'
  parser = optparse.OptionParser(usage)
  parser.add_option('--gen_deps',
                    dest='gen_deps',
                    default=False,
                    action="store_true",
                    help='generate deps.js')
  parser.add_option('-p',
                    '--path',
                    dest='paths',
                    action='append',
                    help='The paths that should be traversed to build the '
                    'dependencies.')
  parser.add_option('-d',
                    '--dep',
                    dest='deps',
                    action='append',
                    help='Directories or files that should be traversed to '
                    'find required dependencies for the deps file. '
                    'Does not generate dependency information for names '
                    'provided by these files. Only useful in "deps" mode.')
  parser.add_option('-e',
                    '--exclude',
                    dest='excludes',
                    action='append',
                    help='Files or directories to exclude from the --path '
                    'and --input flags')
  parser.add_option('-o',
                    '--output_file',
                    dest='output_file',
                    action='store',
                    help=('If specified, write output to this path instead of '
                          'writing to standard output.'))
  
  (options, args) = parser.parse_args()

  if options.gen_deps:
    gen_deps(options, args)
    return


if __name__ == "__main__":
  main()



