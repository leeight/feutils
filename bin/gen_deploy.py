#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 简化一下Fer的工作，将一些阶段独立出来
# **************************************************************************/



import os
import sys
import logging
import subprocess
import platform
import html_processor
import calcdeps
import re
import shutil
import tempfile
import json
import cStringIO
from datetime import datetime

LIB_HOME = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')
sys.path.insert(0, os.path.join(LIB_HOME, 'spritemapper'))

from spritecss.main import CSSFile
from spritecss.main import spritemap
from spritecss.config import CSSConfig

if platform.system().startswith('Windows'):
  LESSC_FILE = os.path.join(os.path.dirname(__file__), 'lessc.bat')
else:
  LESSC_FILE = os.path.join(os.path.dirname(__file__), 'lessc')

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/06/05 11:37:29'
__revision = '$Revision$'

include_regex = re.compile('goog\.include\s*\(\s*[\'\"]([^\)]+)[\'\"]\s*\);?', re.M|re.S)

#{{{get_include_files
def get_include_files(deps):
  """
  从deps中的文件列表找到所有的goog.include的内容
  经典用法：
  python externs/sdcfe/tools/bin/Fer.py
         --gen_deploy
         -p src
         --entry_point src/jn/dashboard/landmark.app.html
         -f "--compilation_level=BAIDU_OPTIMIZATIONS"
         -f "--formatting=PRETTY_PRINT"
         -f "--warning_level=VERBOSE"
         -f "--externs=src/tangram.externs.js"
         -f "--externs=src/pdc.externs.js"
         -j assets/js/tangram-base-1.3.7.1.js
  """
  includes = []
  for input_file in deps:
    file_handle = open(input_file, 'r')
    try:
      for line in file_handle:
        line = line.strip()
        match = re.match(include_regex, line)
        if match:
          include_file = match.group(1)
          if include_file in includes:
            continue
          else:
            includes.append(include_file)
    finally:
      file_handle.close()

  return includes
#}}}

#{{{write_file
def write_file(path, content, modify = False):
  try:
    fh = open(path, 'wb')
    fh.write(content)
    logging.info('%s %s' % ('M' if modify else '+', path))
  finally:
    fh.close()
#}}}

#{{{merge_compile_rewrite
def merge_compile_rewrite(less_arr, less_include_path, am):
  def cleanup():
    os.close(__f1)
    os.remove(ep_less_tmpfile)

  # rewrite the compile result
  from css_rewriter import CssRewriter
  c_rewriter = CssRewriter(".", am, False)

  less_code = []
  for path, code in less_arr:
    less_code.append(c_rewriter.fast_rewrite(code, path))

  # merge less and css files...
  __f1, ep_less_tmpfile= tempfile.mkstemp('.less')
  less_merged_content = '/*Not Empty*/\n' + re.sub('\r\n', '\n', "\n".join(less_code))
  write_file(ep_less_tmpfile, less_merged_content)

  # compile less with lessc
  cmd = [LESSC_FILE, '--include-path=' + less_include_path, ep_less_tmpfile]
  logging.debug('Compiling with the following command: %s', ' '.join(cmd))
  proc = subprocess.Popen(cmd, stdout = subprocess.PIPE, stderr = subprocess.PIPE)
  (stdoutdata, stderrdata) = proc.communicate()
  if proc.returncode != 0:
    # 如果失败了，再尝试一次，经常遇到因为less文件的内容不完整导致的错误
    proc = subprocess.Popen(cmd, stdout = subprocess.PIPE, stderr = subprocess.PIPE)
    (stdoutdata, stderrdata) = proc.communicate()
    if proc.returncode != 0:
      cleanup()
      logging.error('compile merged-less fail.')
      sys.exit(1)

  # clean up
  cleanup()

  return stdoutdata
#}}}

#{{{gen_sprites
def gen_sprites(am, ep_css_path):
  # spritemapper配置
  spritemapper_comment = """
/*
  spritemapper.output_image = %(sprite_path)s
  spritemapper.output_css = %(css_path)s
*/
"""
  target_dir = os.path.normpath(am.get_dir_from_type('image'))
  ep_sprite_img_file = os.path.basename(ep_css_path).replace('.css', '-sprites.png')
  ep_sprite_img_path = os.path.join(target_dir, ep_sprite_img_file)
  ep_sprite_css_path = ep_css_path.replace('.css', '-sprites.css')
  sprite_cfg = {
    'sprite_path' : ep_sprite_img_path,
    'css_path' : ep_sprite_css_path
  }
  spritemapper_config = spritemapper_comment % sprite_cfg
  # add spritemapper configuration in css file
  write_file(ep_css_path, spritemapper_config + open(ep_css_path, 'r').read())
  base = {
    "sign_output" : True
  }
  conf = CSSConfig(base=base)
  spritemap([CSSFile.open_file(ep_css_path, conf=conf)], conf=conf)
  os.remove(ep_css_path)
  os.rename(ep_sprite_css_path, ep_css_path)
#}}}

#{{{png8_convert
def png8_convert(am, output_dir, ep_css_path):
  # check if PIL exists
  try:
    import PIL
  except:
    logging.warning('module PIL doesn\'t exist in Path, skip png8 converting...')
    return False
  from pngconverter import PngConverter
  pc = PngConverter(output_dir, am, True)
  result = pc.convert(ep_css_path)
  write_file(ep_css_path, result)
#}}}

#{{{gen_deploy
def gen_deploy(options, args):
  if not options.entry_point:
    logging.error('--entry_point must be specified.')
    sys.exit(1)

  ep_tpl_file = 'tpl.html'
  ep_top_file = 'index.html'
  output_dir = options.output_dir
  _ = lambda k : os.path.normpath(os.path.join(output_dir, k))
  if os.path.exists(output_dir):
    shutil.rmtree(output_dir)
  os.makedirs(output_dir)

  # 如果ad_template_wrapper设置过值，那么说明应该将
  # third_party_files，ad_template_wrapper，ep_code_file合并到一起
  # XXX 简单的策略，不想添加更多的参数了.
  all_in_one = options.ad_template_wrapper is not None

  from assets_manager import AssetsManager
  am = AssetsManager(output_dir)

  # third_party_files可能是tangram或者pdc之类的外部文件
  # 可以理解为third_party之类的代码
  third_party_files = []

  for asset in options.extern_js_files:
    if os.path.exists(asset):
      third_party_files.append(am.add(asset))
  if all_in_one:
    # 生成的HTML代码中不要有额外的js了，只需要一个就行了
    options.extern_js_files = []
  else:
    options.extern_js_files = third_party_files

  from html_rewriter import HtmlRewriter
  h_rewriter = HtmlRewriter(".", am)

  # 1. 处理entry.html，解析img中的路径，保留相关的资源
  new_code = h_rewriter.rewrite(options.entry_point)
  write_file(_(ep_top_file), new_code)

  compiler = html_processor.get_html_processor(_(ep_top_file),
      options.extern_js_files, options.charset)
  ep_content = compiler.get_main()
  ep_code = compiler.get_script()

  # save the javascript code parsed from the entry.html
  import tempfile
  __fd, ep_code_file = tempfile.mkstemp('.js')
  write_file(ep_code_file, ep_code)

  search_paths = calcdeps.GetPathsFromOptions(options)
  base_path = calcdeps.FindClosureBasePath(search_paths)
  deps = calcdeps.CalculateDependencies(search_paths, [ep_code_file])
  logging.debug(deps)

  # XXX [ep_code_file]放到第一位是保证css的顺序符合debug的预期
  includes = get_include_files([ep_code_file] + deps)
  logging.debug(includes)

  ep_styles = []
  ep_tpl_code = []
  for input_file in includes:
    input_file_path = os.path.join(os.path.dirname(base_path), input_file)
    if not os.path.exists(input_file_path):
      continue
    code_content = open(input_file_path, 'rb').read()
    if input_file.endswith(".css") or input_file.endswith(".less"):
      ep_styles.append((input_file_path, code_content));
    else:
      ep_tpl_code.append(code_content)

  # merge less and css files...
  ep_css_code_merged = merge_compile_rewrite(ep_styles, options.less_include_path, am)

  # 输出最终的entry_point_html文件
  ep_file = os.path.basename(options.entry_point)
  ep_css_file = os.path.splitext(ep_file)[0] + '.css'
  ep_js_file = os.path.splitext(ep_file)[0] + '.js'

  if not all_in_one:
    from Fzip import zip_css_string
    write_file(_(ep_css_file), zip_css_string(ep_css_code_merged))
    write_file(_(ep_tpl_file), re.sub('\r\n', '\n', "\n".join(ep_tpl_code)))

  # 1. 处理tpl.html，解析style中的代码，保留相关的资源
  if not all_in_one and options.enable_html_rewriter:
    for name in (ep_tpl_file, ):
      new_code = h_rewriter.rewrite(_(name))
      write_file(_(name), new_code, True)

  # 2. 生成helloworld.app.js文件
  try:
    # 开始写文件
    ep_js_fh = open(_(ep_js_file), 'wb')

    # 先获取编译之后的结果
    out = cStringIO.StringIO()
    if not all_in_one:
      ep_signed_tpl_path = am.add(_(ep_tpl_file))
      os.remove(_(ep_tpl_file))
      define_flags = [
        '--define="app.asyncResource=\'%s\'"' % ep_signed_tpl_path,
      ]
    else:
      define_flags = []

    calcdeps.Compile(options.compiler_jar, deps, out,
      options.compiler_flags + define_flags)

    if all_in_one:
      ep_js_fh.write("(function(AD_CONFIG, LINKS, RT_CONFIG){\n")
      ep_js_fh.write("/*! Copyright " + str(datetime.now().year) + " Baidu Inc. All Rights Reserved. */\n")
      from Fzip import zip_js_string, zip_css_string
      config_pattern = re.compile(r'(\.config-[a-f0-9]{8}\.js)$')
      # 输出third_party_files
      for f in third_party_files:
        logging.debug(f)
        # 忽略tangram，最后用Ftangram把缺失的函数补充完毕即可.
        if f.find("tangram") == -1:
          zip_code = zip_js_string(open(_(f)).read())
          if config_pattern.search(f):
            from Fformat import format_js_string
            zip_code = format_js_string(zip_code)
          ep_js_fh.write(zip_code)
          ep_js_fh.write(";\n")

      # 输出模板内容
      ep_js_fh.write(options.ad_template_wrapper.replace('%output%',
          json.dumps("\n".join(ep_tpl_code))))
      ep_js_fh.write(";\n")
      if options.ad_style_wrapper:
        ep_js_fh.write(options.ad_style_wrapper.replace('%output%',
            json.dumps(zip_css_string(ep_css_code_merged))))
      ep_js_fh.write(";\n")

      # 收集tangram的数据，这个必须要等待编译完毕之后进行
      from Ftangram import collect_tokens_from_code, fetch_remote_source
      tokens = collect_tokens_from_code(out.getvalue())
      logging.debug(tokens)
      tangram = fetch_remote_source(list(tokens))
      ep_js_fh.write(zip_js_string(tangram))
      ep_js_fh.write(";\n");

    ep_js_fh.write(out.getvalue())

    if all_in_one:
      ep_js_fh.write("\n})(/** AD_CONFIG */{}, /** LINKS */[], /** RT_CONFIG */{});")

    # 获取tangram的数据.
    logging.info('+ %s' % _(ep_js_file))
  finally:
    out.close()
    ep_js_fh.close()

  # 3. 处理js，解析assets相关的资源
  if options.enable_javascript_rewriter:
    from javascript_rewriter import JavaScriptRewriter
    rewriter = JavaScriptRewriter(".", am)
    new_code = rewriter.rewrite(open(_(ep_js_file)).read())
    write_file(_(ep_js_file), new_code, True)

  # 4. 合并sprites
  if not all_in_one and options.enable_auto_sprite:
    gen_sprites(am, _(ep_css_file))

  # 5. 生成png8图片
  if not all_in_one and options.enable_png8_convert:
    png8_convert(am, output_dir, _(ep_css_file))

  ep_signed_js_file = am.file_sign(_(ep_js_file))
  ep_signed_css_file = "about:blank" if all_in_one else am.file_sign(_(ep_css_file))
  app_cfg = {
    "app.js.path" : ep_signed_js_file,
    "app.css.path" : ep_signed_css_file
  }
  if all_in_one:
    write_file(_(ep_top_file), '<!doctype html>\n' +
        '<html>\n<head>\n<meta charset="utf-8" />\n</head>\n<body>\n' +
        '<!--嵌入代码开始-->\n' +
        '<script charset="utf-8" src="' + ep_signed_js_file + '"></script>\n' +
        '<!--嵌入代码结束-->\n' +
        '</body>\n</html>', True)
  else:
    write_file(_(ep_top_file), re.sub('(\s*\r?\n)+', '\n',
        ep_content.replace('%(app.js.path)s', ep_signed_js_file).replace('%(app.css.path)s', ep_signed_css_file)), True)
  if os.path.exists(_(ep_js_file)):
    os.rename(_(ep_js_file), _(ep_signed_js_file))
  if os.path.exists(_(ep_css_file)):
    os.rename(_(ep_css_file), _(ep_signed_css_file))

  # 清理工作
  # @see http://stackoverflow.com/questions/1470350/why-is-the-windowserror-while-deleting-the-temporary-file
  os.close(__fd)
  os.remove(ep_code_file)
#}}}
