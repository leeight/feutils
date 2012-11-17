#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 :
# ***************************************************************************
# 
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 
# **************************************************************************/
 
 
 
import os
import sys
import logging
import optparse

LIB_HOME = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')
sys.path.insert(0, os.path.join(LIB_HOME, 'cssutils'))

from PIL import Image
import cssutils
cssutils.log.setLevel(logging.ERROR)
from cssutils import settings
settings.set('DXImageTransform.Microsoft', True)
from cssutils.css.property import Property

__author__ = 'songao <songao@baidu.com>'
__date__ = '2012/05/17 19:05:34'
__revision = '$Revision$'


class PngConverter(object):
  def __init__(self, root, assets_manager, ignore_depth = False):
    """
    root是服务器的根目录路径，用来处理background:url(/assets/img/a.png)的情况
    assets_manager是资源管理器，用开拷贝文件.
    ignore_depth忽略资源URI前面的../和./
    """
    self._root = root
    self._am = assets_manager
    self._ignore_depth = ignore_depth

  def _get_image_path(self, resource, uri_path):
    if self._ignore_depth:
      root_path = os.path.normpath(os.path.join('/', uri_path))
      uri_path = os.path.join(self._root, root_path[1:])
    elif uri_path.startswith("/"):
      uri_path = os.path.join(self._root, uri_path[1:])
    else:
      uri_path = os.path.normpath(os.path.join(os.path.dirname(resource), uri_path))
    if os.path.exists(uri_path):
      return uri_path
    else:
      logging.error("%s not exists.", uri_path)
      sys.exit(2)
      return None

  def convert_code(self, css_code):
    cssutils.ser.prefs.useMinified()
    cssss = cssutils.parseString("div{%s}" % css_code)
    new_code = self._convert_impl(cssss, '.')
    return new_code[4:-1]

  def convert(self, resource):
    # CSS Style Sheet
    cssss = cssutils.parseFile(resource)
    return self._convert_impl(cssss, resource)

  def _convert_image(self, resource, uri):
    real_path = self._get_image_path(resource, uri)
    if not real_path:
      return None
    new_real_path = real_path.replace('.png', '-fs8.png')
    self.convert_8bit(real_path, new_real_path)
    self._am.add(new_real_path)
    return self._am.add(new_real_path)

  def _convert_impl(self, cssss, resource):
    # CSS Rule List
    cssrl = cssss.cssRules
    # 遍历各个Rule
    for rule in cssss.cssRules:
      if rule.type != 1:
        continue
      # rule的类型是CSSStyleRule
      style = rule.style                  # CSSStyleDeclaration
      properties = style.getProperties()  # list<cssutils.css.Property>
      new_props = []
      for p in properties:
        key = p.name
        value = p.cssValue
        new_prop = None
        if key.endswith('background') or \
           key.endswith('background-image'):
          if value.cssValueType == value.CSS_VALUE_LIST:
            for k in value:
              if k.primitiveType == k.CSS_URI:
                # logging.warning(k.getStringValue())
                uri_path = k.getStringValue()
                # 如果图片时png，且该png不是png8格式（通过命名区分），则进行转换并加上ie6的css hack
                if uri_path.endswith('.png') and not uri_path.endswith('-fs8.png'):
                  # create property _background or _background-image
                  new_uri = self._convert_image(resource, uri_path)
                  if new_uri:
                    new_prop = Property()
                    new_prop.cssText = p.cssText.replace('background', '_background').replace(uri_path, new_uri)
          elif value.cssValueType == value.CSS_PRIMITIVE_VALUE and \
               value.primitiveType == value.CSS_URI:
            uri_path = value.getStringValue()
            # 如果图片时png，且该png不是png8格式（通过命名区分），则进行转换并加上ie6的css hack
            if uri_path.endswith('.png') and not uri_path.endswith('-fs8.png'):
              # create property _background or _background-image
              new_uri = self._convert_image(resource, uri_path)
              if new_uri:
                new_prop = Property('_' + key, cssutils.helper.uri(new_uri))
        if new_prop:
          new_props.append(new_prop)
      # 往rule.style里面添加hack的property
      for x in new_props:
        style.setProperty(x)
    return cssss.cssText

  def convert_8bit(self, src, dest):
    """
    convert_8bit: String, String -> void.
    Converts the input image file into 8bit depth.
    """
    im = Image.open(src)
    # PIL complains if you don't load explicitly
    im.load()
    # Get the alpha band
    alpha = im.split()[-1]
    im = im.convert('RGB').convert('P', palette=Image.ADAPTIVE, colors=255)
    # Set all pixel values below 128 to 255,
    # and the rest to 0
    mask = Image.eval(alpha, lambda a: 255 if a <=128 else 0)
    # Paste the color of index 255 and use alpha as a mask
    im.paste(255, mask)
    # The transparency index is 255
    im.save(dest, transparency=255)

def main():
  parser = optparse.OptionParser()
  parser.add_option('-o', '--output',
                    dest='output',
                    action="store",
                    help='Output file.')
  (options, args) = parser.parse_args()

  if not len(args):
    parser.print_help()
    sys.exit(1)

  from assets_manager import AssetsManager

  am = AssetsManager("/tmp/output")
  converter = PngConverter('.', am)
  output = converter.convert(args[0])
  if options.output:
    open(options.output, 'wb').write(output)

if __name__ == "__main__":
  main()






