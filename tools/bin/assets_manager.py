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
  def __init__(self, root):
    self._root = root
    self._prefix = "assets"

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
    return hashlib.md5(open(resource, 'r').read()).hexdigest()

  def add(self, resource):
    """添加一个资源，返回新路径.

    Arguments:

    resource -- 需要添加到AssetsManager中的资源

    Return value:

    AssetsManager所管理的资源路径.
    """

    type = self._get_type(resource)
    sign = self._sign(resource)
    base, ext = os.path.splitext(os.path.basename(resource))
    name = "%s-%s%s" % (base, sign, ext)
    path = os.path.join(self._root, self._prefix, type)

    if not os.path.exists(path):
      os.makedirs(path)

    file_path = os.path.join(path, name)
    if not os.path.exists(file_path):
      shutil.copy(resource, file_path)

    return "%s/%s/%s" % (self._prefix, type, name)





