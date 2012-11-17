#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
#
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 一般来说，生成的广告代码是
# <script charset="utf-8" src="ad.js"></script>
# 但是为了能够生成RCV地址，需要从ad.js中提取出AD_CONFIG，也就是如下格式的投放代码
# <script>var AD_CONFIG_$$$$ = {};<script>
# <script charset="utf-8" src="ad.js"></script>
# 然后将AD_CONFIG中符合url的地址替换成RCV的格式，对于图片或者swf后缀的内容我们就忽略掉不要替换
# **************************************************************************/



import os
import sys
import logging
import json
import re
import mimetypes
import lib
from widget_config import find_ad_config
from lib import error_exit

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/09/21 12:31:04'
__revision = '$Revision$'

def RCV(url = None, link_id = 0):
  return "%%%%BEGIN_LINK%%%%url=%s\x01urlid=%s%%%%END_LINK%%%%" % (url or "http://www.baidu.com/", link_id)

def _generate_rcv_link(config, link_id, only_dump_links):
  # FIXME 这个规则很有意思，如何处理呢？
  pattern = re.compile(r"([\"'])(https?://([^\"']+))\1")

  # http://stackoverflow.com/questions/11057432/need-help-understanding-python-closures
  links = []
  i = [link_id]
  def repl(match):
    mt, _ = mimetypes.guess_type(match.group(2))
    if mt and (mt.startswith("image/") or mt.startswith("application/")):
      return match.group(0)
    else:
      if i[0] <= 0:
        # 没有设置link_id参数，忽略之
        return "\"%s\"" % (match.group(2))
      else:
        if only_dump_links:
          links.append(RCV(match.group(2), i[0]))
          v = "LINKS[%s]" % (len(links) - 1)
        else:
          v = "\"%s\"" % (RCV(match.group(2), i[0]))

        i[0] += 1
        return v

  new_config = pattern.sub(repl, config)

  return (new_config, links)

def zip_ad_config(config):
  json_object = lib.json_loads(config)
  if json_object is None:
    return config
    """
    from Fzip import zip_js_string
    json_string = zip_js_string('var A=' + config)
    # 53是/** Copyright的长度 */
    return json_string[(53 + 7):]
    """

  return json.dumps(json_object).replace('\\u0001', '\x01')

def _get_final_html_code(ad_canvas_id, inline_script_code, external_script_src, async = False):
  """
  用来展示广告的html代码
  """

  if async:
    html_code = '\n'.join([
      '<!doctype html><html><head><meta charset="utf-8" /></head>',
      '<body>\n',
      '<!--嵌入代码开始-->',
      '<div id="%(ad_canvas_id)s"></div>',
      '<script type="text/javascript">\n%(inline_script_code)s\n</script>',
      '<script type="text/javascript">',
      '(function(d){var f=d.getElementsByTagName("script")[0],j=d.createElement("script");' +
      'j.async=true;j.src="%(external_script_src)s";f.parentNode.insertBefore(j,f);})(document);',
      '</script>',
      '<!--嵌入代码结束-->\n',
      '</body>',
      '</html>'
    ]);
    if ad_canvas_id is None:
      error_exit("ad_canvas_id should not be None")
  else:
    html_code = '\n'.join([
      '<!doctype html><html><head><meta charset="utf-8" /></head>',
      '<body>\n',
      '<!--嵌入代码开始-->',
      '<script type="text/javascript">\n%(inline_script_code)s\n</script>',
      '<script charset="utf-8" type="text/javascript" src="%(external_script_src)s"></script>',
      '<!--嵌入代码结束-->\n',
      '</body>',
      '</html>'
    ]);

  app_config = {
    'ad_canvas_id' : ad_canvas_id,
    'inline_script_code' : inline_script_code,
    'external_script_src' : external_script_src
  }

  return html_code % app_config

def rewrite_deploy_code(options, args):
  logging.getLogger().setLevel(-1)

  if options.name is None:
    error_exit('--name Could not be None.')

  if not os.path.exists(options.name):
    error_exit('no such file')

  name = options.name
  code, config = find_ad_config(open(name, 'rb').read())
  if code is None:
    error_exit('invalid file format, can not find var AD_CONFIG');

  only_dump_links = (options.stage == 2)
  config, links = _generate_rcv_link(config, options.link_id, only_dump_links)
  json_object = lib.json_loads(config)

  ad_canvas_id = None
  if json_object:
    ad_canvas_id = json_object.get('id')
    config = json.dumps(json_object, indent = 2).replace('\\u0001', '\x01')
  # config = zip_ad_config(config)

  # inline_script_code
  if options.stage == 2:
    # <script type="text/javascript">var LINKS_foobar12 = [...];</script>
    # <script type="text/javascript" src="ad.js"></script>
    # -- ad.js --
    # (function(){
    # var AD_CONFIG = {rcv_url:LINKS_foobar12[0], name:"HELLO"};
    # ...
    # ...
    # })();
    links_name = 'LINKS_' + lib.md5_sign(str(links))[0:8]
    code = code.replace('%AD_CONFIG%', config).replace('/** LINKS */[]', links_name)
    inline_script_code = 'var %s = %s;' % (links_name, str(links).replace('\\x01', '\x01'))
  elif options.stage == 3:
    # <script type="text/javascript">var AD_CONFIG_foobar12 = {};</script>
    # <script type="text/javascript" src="ad.js"></script>
    # -- ad.js --
    # (function(){
    # var AD_CONFIG = AD_CONFIG_foobar12;
    # ...
    # ...
    # })();
    ad_config_name = 'AD_CONFIG_' + lib.md5_sign(config)[0:8]
    code = code.replace('var AD_CONFIG = %AD_CONFIG%;', '').replace('/** AD_CONFIG */{}', ad_config_name)
    inline_script_code = 'var %s = %s;' % (ad_config_name, config)

  # external_script_src
  fp, fn = os.path.split(name)
  bcs_url = lib.upload_assets_raw(code, ".js")
  external_script_src = bcs_url if bcs_url else fn

  html_code = _get_final_html_code(ad_canvas_id, inline_script_code, external_script_src, options.async)

  open(name, 'w').write(code)
  open(os.path.join(fp, 'index.html'), 'w').write(html_code)



