#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 一些公共库啦
# **************************************************************************/
 
 
 
import os
import sys
import logging
try:
  import simplejson as json
except ImportError:
  import json

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/09/21 14:36:09'
__revision = '$Revision$'

LIB_HOME = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')
sys.path.insert(0, os.path.join(LIB_HOME, 'libpybcs'))

#{{{error_exit
def error_exit(msg):
  logging.error(msg)
  sys.exit(1)
#}}}

#{{{json_loads
def json_loads(raw):
  try:
    data = json.loads(raw)
  except:
    # bad json format
    try:
      data = eval(raw, type('Dummy', (dict,), dict(__getitem__=lambda s,n:n))())
    except:
      data = None
  return data
#}}}

def json_dumps(obj, indent = 2):
  return json.dumps(obj, indent)

def md5_sign(raw):
  import hashlib
  return hashlib.md5(raw).hexdigest()

def _get_bcs_instance():
  AK = 'your ak'
  SK = 'your sk'
  BUCKET = 'your bucket'
  HOST = 'http://bs.baidu.com'
  return (AK, SK, BUCKET, HOST)

def upload_assets_raw(raw, file_ext):
  import pybcs
  import mimetypes
  pybcs.init_logging(logging.INFO)

  AK, SK, BUCKET, HOST = _get_bcs_instance()

  bcs = pybcs.BCS(HOST, AK, SK)
  b = bcs.bucket(BUCKET)

  content_type, _ = mimetypes.guess_type("HELLO%s" % file_ext)

  headers = {}
  if content_type:
    headers['Content-Type'] = content_type

  file_sign = md5_sign(raw)
  o = b.object('/%s%s' % (file_sign, file_ext))
  r = o.put(raw, headers)
  if r['status'] == 200:
    o.make_public()
    return '%s/%s/%s%s' % (HOST, BUCKET, file_sign, file_ext)

  return None

def upload_assets(file_abs_path):
  """
  将文件放到百度云存储上面去，成功之后返回文件的URL地址，失败
  返回None
  """
  if not os.path.exists(file_abs_path):
    return None

  import pybcs
  import mimetypes
  pybcs.init_logging(logging.INFO)

  AK, SK, BUCKET, HOST = _get_bcs_instance()

  bcs = pybcs.BCS(HOST, AK, SK)
  b = bcs.bucket(BUCKET)

  file_sign = md5_sign(open(file_abs_path, 'rb').read())
  file_ext = os.path.splitext(file_abs_path)[1]

  headers = {
    'X-File-Name' : os.path.basename(file_abs_path)
  }

  content_type, _ = mimetypes.guess_type(file_abs_path)
  if content_type:
    headers['Content-Type'] = content_type

  o = b.object('/%s%s' % (file_sign, file_ext))
  r = o.put_file(file_abs_path, headers)
  if r['status'] == 200:
    o.make_public()
    return '%s/%s/%s%s' % (HOST, BUCKET, file_sign, file_ext)

  return None

if __name__ == '__main__':
  print upload_assets_raw("HELLO", ".html")


