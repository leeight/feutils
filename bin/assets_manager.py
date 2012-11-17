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
import shutil

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/01/25 20:37:03'
__revision = '$Revision$'

class AssetsManager(object):
  def __init__(self, root, prefix = 'assets'):
    self._root = root
    self._prefix = prefix

  def _get_type(self, resource):
    if resource.endswith(".js"):
      return "js"
    elif resource.endswith(".css"):
      return "css"
    else:
      import mimetypes
      type, dummy = mimetypes.guess_type(resource)
      if not type:
        return "default"
      else:
        return type.split("/")[0]

  def _sign(self, resource):
    """获取资源的签名.

    Arguments:

    resource - 需要进行签名的资源文件.

    Return value:

    签名之后在字符串
    """
    import hashlib
    # use 'rb' instead of 'r'
    # see http://stackoverflow.com/questions/3390484/python-hashlib-md5-differs-between-linux-windows
    return hashlib.md5(open(resource, 'rb').read()).hexdigest()

  def file_sign(self, resource):
    sign = self._sign(resource)
    # 截取md5的前8位
    sign = sign[0:8]
    base, ext = os.path.splitext(os.path.basename(resource))
    name = "%s-%s%s" % (base, sign, ext)
    return name

  def add(self, resource):
    """添加一个资源，返回新路径.

    Arguments:

    resource -- 需要添加到AssetsManager中的资源

    Return value:

    AssetsManager所管理的资源路径.
    """

    type = self._get_type(resource)
    name = self.file_sign(resource)
    path = self.get_dir_from_type(type)

    file_path = os.path.join(path, name)
    if not os.path.exists(file_path):
      shutil.copy(resource, file_path)

    return "%s/%s/%s" % (self._prefix, type, name)

  def get_dir_from_type(self, type):
    """根据资源类型，返回路径

    Arguments:

    type -- 资源类型

    Return value:

    此类资源所处文件夹路径
    """

    path = os.path.join(self._root, self._prefix, type)

    if not os.path.exists(path):
      os.makedirs(path)

    return path

