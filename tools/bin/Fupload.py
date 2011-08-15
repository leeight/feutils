#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 上传到cms的文件接口
# **************************************************************************/
 
 
 
import os
import sys
import logging
import getpass
import urllib2
import json
from optparse import OptionParser
import ConfigParser

from MultipartPostHandler import MultipartPostHandler
 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/07/28 17:20:18'
__revision = '$Revision$'

# UPLOAD_ACTION_URL = "http://tc-apptest-cms00.tc.baidu.com:8000/service/app_action/?action=upload"
# LIST_ACTION_URL = "http://tc-apptest-cms00.tc.baidu.com:8000/service/app_action/?action=uploadIndex"
# PREFIX_URL = "http://tc-apptest-cms03.tc.baidu.com:8080/hn01/cms/"
UPLOAD_ACTION_URL = "http://icms.baidu.com:8080/service/app_action/?action=upload"
LIST_ACTION_URL = "http://icms.baidu.com:8080/service/app_action/?action=uploadIndex"
PREFIX_URL = "http://img.baidu.com/adm"

def get_app_cfg_file():
  return os.path.expanduser("~/.Fupload.ini")

def set_user_info():
  """ 设置用户的信息app.user.username & app.user.password """
  app_cfg_file = get_app_cfg_file()

  try:
    app_user_username = raw_input("cms username: ").strip()
    app_user_password = getpass.getpass("cms password: ").strip()

    config = ConfigParser.ConfigParser()
    config.read([app_cfg_file])
    
    if not config.has_section('user'):
      config.add_section('user')

    config.set('user', 'username', app_user_username)
    config.set('user', 'password', app_user_password)

    config.write(open(app_cfg_file, 'wb'))
  except KeyboardInterrupt:
    sys.exit(0)

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
  
  return {
    "app.user.username": config.get('user', 'username'),
    "app.user.password" : config.get('user', 'password')
  }

def upload(filename):
  opener = urllib2.build_opener(MultipartPostHandler)
  user_info = get_user_info()
  params = { 
    "user_name" : user_info["app.user.username"],
    "password" : user_info["app.user.password"],
    "top_ch_spell" : "cbweb",
    "app_id" : "cms_r",
    "group_id" : "7",
    "type" : "11",
    "url" : PREFIX_URL,
    "commonfile" : open(filename, "rb") 
  }
  try:
    response = opener.open(UPLOAD_ACTION_URL, params)
    content = response.read()
    body = json.loads(content)
    if body['success']:
      domain = body['result']['file_domain']
      name = body['result']['file_name']
      ext = body['result']['file_ext']
      if not domain.endswith("/"):
        domain += "/"
      return domain + name + "." + ext
  except:
    logging.warning("Upload [%s] failed" % (filename))
    
  return None

def list_all_files():
  opener = urllib2.build_opener(MultipartPostHandler)
  user_info = get_user_info()
  params = { 
    "user_name" : user_info["app.user.username"],
    "password" : user_info["app.user.password"],
    "top_ch_spell" : "cbweb",
    "app_id" : "cms_r",
    "group_id" : "7",
    "type" : "11",
    "url" : PREFIX_URL 
  }
  try:
    response = opener.open(LIST_ACTION_URL, params)
    content = response.read()
    body = json.loads(content)
    if body["success"]:
      for item in body["page"]["result"]:
        print "%s -> %s" % (item["name"], item["url"])
  except:
    logging.warning("Fetch file list failed")

def main():
  logging.basicConfig(format='Fupload.py: %(message)s', level=logging.INFO)

  parser = OptionParser("Usage: Fupload.py [options] file")
  parser.add_option("-c", "--config", dest="config", default=False,
                    action="store_true", help="start Fupload configuration")
  parser.add_option("-l", "--list", dest="list", default=False,
                    action="store_true", help="list current files in cms system.")
 
  (options, args) = parser.parse_args()

  if options.config:
    set_user_info()
  elif options.list:
    list_all_files()
  else:
    if len(args) <= 0:
      parser.print_help()
    else:
      if not os.path.exists(args[0]):
        logging.warning("File [%s] doesn't exist" % (args[0]))
        sys.exit(1)
      print upload(args[0])

if __name__ == "__main__":
  main()





