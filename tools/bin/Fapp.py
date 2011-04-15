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
import ConfigParser
from optparse import OptionParser
 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/04/15 15:32:16'
__revision = '$Revision$'




def get_app_cfg_file():
  return os.path.expanduser("~/.Fapp.ini")

def set_user_info():
  """ 设置用户的信息app.user.name & app.user.email """
  app_cfg_file = get_app_cfg_file()

  app_user_name = raw_input("app.user.name: ").strip()
  app_user_email = raw_input("app.user.email: ").strip()

  config = ConfigParser.ConfigParser()
  config.read([app_cfg_file])
  
  if not config.has_section('user'):
    config.add_section('user')

  config.set('user', 'name', app_user_name)
  config.set('user', 'email', app_user_email)

  config.write(open(app_cfg_file, 'wb'))

def has_user_info():
  app_cfg_file = get_app_cfg_file()
  if not os.path.exists(app_cfg_file):
    return False

  config = ConfigParser.ConfigParser()
  config.read([app_cfg_file])

  if not config.has_section('user'):
    return False

  return True

def get_user_info():
  """ 返回用户的信息app.user.name & app.user.email """
  if not has_user_info():
    set_user_info()

  config = ConfigParser.ConfigParser()
  config.read([get_app_cfg_file()])
  
  print config.get('user', 'name')
  print config.get('user', 'email')


def main():
  parser = OptionParser()
  parser.add_option("-c", "--config", dest="config", default=False,
                    action="store_true", help="start Fapp configuration")
  parser.add_option("-n", "--name", dest="name", help="create an app with the specified name")
  
  (options, args) = parser.parse_args()

  if options.config:
    set_user_info()
    sys.exit(0)
  
  if options.name is None:
    parser.print_help()

if __name__ == "__main__":
  main()
