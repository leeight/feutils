#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 包装一下svn，提供一些常用的功能。
# Fsvn --add-missing-files，自动添加一批文件，也就是如下脚本的跨平台版
#   svn st | grep "^?" | awk '{print $2}' | xargs -i svn add {}
# Fsvn --refresh-mime-type
#   给静态文件自动设置mime-type，当然也是采用python的mime-type来根据后缀名进行猜测的
# **************************************************************************/
 
 
 
import os
import sys
import logging
import re
from optparse import OptionParser
from upload import RunShellWithReturnCode
 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/05/26 11:20:58'
__revision = '$Revision$'



def check_svn_vcs(fn):
  def wrapped():
    if os.path.isdir('.svn'):
      return fn()
    else:
      logging.error("Can't find .svn in current directory")
      sys.exit(2)
  return wrapped

@check_svn_vcs
def task_add_missing_files():
  try:
    out, returncode = RunShellWithReturnCode(["svn", "status"])
    if returncode == 0:
      missing_files = map(lambda line: re.split(r'\s+', line)[1],
                        filter(lambda line: line.startswith("?"),
                          out.splitlines()))
      if len(missing_files) > 0:
        logging.info(">>>>>>")
        for line in missing_files:
          logging.info("svn add %s" % line)
        logging.info(">>>>>>")

        directive = raw_input("Are you sure to run the previous commands? (y/n): ")
        if directive == 'y':
          for line in missing_files:
            RunShellWithReturnCode(['svn', 'add', line])
          logging.info("Now you can run 'svn commit' to submit your changes.")
          logging.info("You can also run 'svn revert -R .' to revert this changes.")
        elif directive == 'n':
          pass
        else:
          logging.warning("Invalid directive")
      else:
        logging.info("Can't find missing files, i will do nothing.")
  except OSError, (errno, message):
    logging.error(message)
    if errno != 2:
      raise

@check_svn_vcs
def task_refresh_mime_type():
  import mimetypes
  for root, dirs, files in os.walk('.'):
    for f in files:
      t = mimetypes.guess_type(f)[0]
      if t is not None:
        RunShellWithReturnCode(['svn', 'propset', 'svn:mime-type', t, os.path.join(root, f)])
    for d in ['CVS', '.svn', '.git']:
      if d in dirs:
        dirs.remove(d)
  logging.info("Now you can run 'svn commit' to submit your changes.")
  logging.info("You can also run 'svn revert -R .' to revert this changes.")

def main():
  logging.basicConfig(format="%(levelname)s: %(message)s", level=logging.DEBUG)

  parser = OptionParser("Fsvn.py [options]")
  parser.add_option("--add-missing-files",
                    dest="add_missing_files",
                    default=False,
                    action="store_true",
                    help="auto add the new files to svn repos")
  parser.add_option("--refresh-mime-type",
                    dest="refresh_mime_type",
                    default=False,
                    action="store_true",
                    help="auto set the mime-type for all files")
  parser.add_option("--noisy", action="store_const", const=3,
                    dest="verbose", help="Print all logs.")
  (options, args) = parser.parse_args()
  if options.add_missing_files:
    task_add_missing_files()
  elif options.refresh_mime_type:
    task_refresh_mime_type()
  else:
    parser.print_help()

if __name__ == "__main__":
  main()
