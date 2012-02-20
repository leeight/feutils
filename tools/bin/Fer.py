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
import re
import cStringIO
import codecs
import shutil
import tempfile
import subprocess
import ConfigParser
import Frewriter
import calcdeps
from datetime import datetime
from closure_linter import javascripttokens

TokenType = javascripttokens.JavaScriptTokenType

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/07/28 18:07:16'
__revision = '$Revision$'

req_regex = re.compile('goog\.require\s*\(\s*[\'\"]([^\)]+)[\'\"]\s*\);?', re.M|re.S)
prov_regex = re.compile('goog\.provide\s*\(\s*[\'\"]([^\)]+)[\'\"]\s*\);?', re.M|re.S)
include_regex = re.compile('goog\.include\s*\(\s*[\'\"]([^\)]+)[\'\"]\s*\);?', re.M|re.S)
line_sep_regex = re.compile('\r?\n', re.M|re.S)
action_name_regex = re.compile('(?P<package>([a-z\d_]+\.)+)(?P<action_name>[A-Z]\w+)', re.M|re.S)

FER_SKEL_DIR = os.path.join(os.path.dirname(__file__), 'Fer.skel')


def get_html_processor(file, options):
  from html_processor import HTMLProcessor
  compiler = HTMLProcessor(options.extern_js_files)
  contents = codecs.open(file, 'r', options.charset).read()
  compiler.feed(contents)
  return compiler

def find_include(line, css_includes, html_includes, base_path):
  line = line.strip()
  if re.match(include_regex, line):
    include_file = re.search(include_regex, line).group(1)
    include_file = os.path.join(os.path.dirname(base_path), include_file)
    if include_file.endswith(".html") or include_file.endswith(".htm"):
      if not include_file in html_includes:
        html_includes.append(include_file)
    else:
      if not include_file in css_includes:
        css_includes.append(include_file)

def merge_files(files, out):
  try:
    for file in files:
      sfile = file.strip()
      f = open(sfile)
      out.write(f.read())
      out.write('\n')
      f.close()
  finally:
    out.close()

#{{{gen_deps
def gen_deps(options, args):
  search_paths = calcdeps.GetPathsFromOptions(options)

  if options.output_file:
    out = open(options.output_file, 'wb')
  else:
    out = sys.stdout

  result = calcdeps.PrintDeps(search_paths, calcdeps.ExpandDirectories(options.deps or []), out)
  if not result:
    logging.error('Could not find Closure Library in the specified paths')
    sys.exit(1)
#}}}

#{{{pl_build
def pl_build(options, args):
  #prepareing: create folders, copy the main.html to output directory
  if(not options.output_dir):
    tmp_dir = 'tmp'
  else:
    tmp_dir = options.output_dir + '/tmp'
  if os.path.exists(tmp_dir):
    shutil.rmtree(tmp_dir)
  os.makedirs(tmp_dir)
  if not options.main_html:
    logging.error('Could not find the html file to build')
    sys.exit(1)
  dir, filename = os.path.split(options.main_html)
  main_path = os.path.join(tmp_dir, filename)
  shutil.copy2(options.main_html, main_path)
  # get some variables
  search_paths = calcdeps.GetPathsFromOptions(options)
  base_path = calcdeps.FindClosureBasePath(search_paths)
  # fetch javascript code from main.html
  compiler = get_html_processor(options.main_html, options)
  main_js = compiler.get_script()
  open(tmp_dir + '/main_js.js', 'w').write(main_js)
  ext_scripts = compiler.get_external_scripts()
  deps = calcdeps.CalculateDependencies(search_paths, [tmp_dir + '/main_js.js'])
  arr = []
  for dep in deps:
    if dep.endswith('main_js.js') or dep.endswith('base.js'):
      print(dep)
    else:
      arr.append(dep)
  out = open(tmp_dir + '/merged_js.js', 'w')
  files = arr
  if ext_scripts:
    files = files + ext_scripts
  if options.extern_js_files:
    files = files + options.extern_js_files
  print(files)
  merge_files(files, out)
  # remove all goog.require('xx')
  merged_file = open(tmp_dir + '/merged_js.js', 'r')
  merged_content = merged_file.read()
  merged_file.close()
  merged_content = re.sub(req_regex, '', merged_content)
  merged_content = re.sub(prov_regex, '', merged_content)
  # create pl.compiled.js and remove merged_js.js, main_js.js
  output_file_path = '';
  if options.output_file:
    output_file_path = os.path.join(tmp_dir,options.output_file)
    open(os.path.join(tmp_dir,options.output_file), 'w').write(merged_content)
  else:
    output_file_path = tmp_dir + '/pl.compiled.js'
    open(tmp_dir + '/pl.compiled.js', 'w').write(merged_content)
  os.remove(tmp_dir + '/merged_js.js')
  os.remove(tmp_dir + '/main_js.js')
  # add compiled js in main.html
  jsPath, jsFilename = os.path.split(output_file_path)
  open(main_path, 'w').write('<!doctype html>\n' + '<html>\n<head><title>test '+ jsFilename +'</title></head>\n<body>\n' + '<script type="text/javascript" src="'+ jsFilename +'"></script>\n</body>\n</html>')
#}}}

#{{{build
def build(options, args):
  # prepareing: create folders, copy the main.html to output directory
  if(os.path.exists(options.output_dir)):
    shutil.rmtree(options.output_dir)
  tmp_dir = options.output_dir + '/tmp'
  os.makedirs(tmp_dir)
  dir, filename = os.path.split(options.main_html)
  main_path = os.path.join(options.output_dir, filename)
  shutil.copy2(options.main_html, main_path)
  # get some variables
  search_paths = calcdeps.GetPathsFromOptions(options)
  base_path = calcdeps.FindClosureBasePath(search_paths)
  # fetch javascript code from main.html, and store it in [%ouput_dir%/main_js.js]
  compiler = get_html_processor(main_path, options)
  main_js = compiler.get_script()
  open(tmp_dir + '/main_js.js', 'wb').write(main_js)
  open(main_path, 'wb').write(re.sub('(\r?\n+)+', '\n', compiler.get_main()))
  ext_scripts = compiler.get_external_scripts()
  ext_styles = compiler.get_external_styles()
  # get the dependency list of js files, and put it in [%ouput_dir%/deps_list.js]
  deps = calcdeps.CalculateDependencies(search_paths, [tmp_dir + '/main_js.js'])
  out = open(tmp_dir + '/deps_list.js', 'w')
  for dep in deps:
    if not dep.endswith('main_js.js'):
      out.write(dep)
      out.write('\n')
  out.close();
  # merge the js files in dependency list, and put it in [%ouput_dir%/merged_js.js]
  out = open(tmp_dir + '/merged_js.js', 'w')
  file_handle = open(tmp_dir + '/deps_list.js', 'r')
  try:
    merge_files(file_handle, out)
  finally:
    file_handle.close()
  # get all goog.include('xx'), and put all css in core.css, put all html in tpl.html
  merged_file = open(tmp_dir + '/merged_js.js', 'r')
  css_output = open(tmp_dir + '/core.css', 'w')
  html_output = open(tmp_dir + '/tpl.html', 'w')
  try:
    css_includes = []
    html_includes = []
    for line in re.split(line_sep_regex, main_js):
      find_include(line, css_includes, html_includes, base_path)
    for line in merged_file:
      find_include(line, css_includes, html_includes, base_path)
    merge_files(css_includes, css_output)
    merge_files(html_includes, html_output)
  finally:
    merged_file.close()
  # remove all goog.include('xx')
  merged_file = open(tmp_dir + '/merged_js.js', 'r')
  merged_content = merged_file.read()
  merged_file.close()
  merged_content = re.sub(include_regex, '', merged_content)
  js_output = open(tmp_dir + '/core.js', 'w')
  js_output.write(merged_content)
  js_output.close()
  # move output files to their destination directory
  for dir in ['/assets', '/assets/js', '/assets/css']:
    abs_dir = options.output_dir + dir
    if not os.path.exists(abs_dir):
      os.makedirs(abs_dir)
  dir_dic = {'/core.js' : '/assets/js', '/core.css' : '/assets/css', '/tpl.html' : '/assets'}
  for k,v in dir_dic.iteritems():
    shutil.move(tmp_dir + k, options.output_dir + v + k)
  # clear tmp files
  shutil.rmtree(tmp_dir)
#}}}

#{{{gcc_lint
def gcc_lint(options, args):
  # get some variables
  search_paths = calcdeps.GetPathsFromOptions(options)

  # fetch javascript code from main.html, and write it to a temp file
  compiler = get_html_processor(options.main_html, options)
  main_js = compiler.get_script()
  (code, tmpfile) = tempfile.mkstemp(suffix='.js', prefix='gcc-lint-')
  open(tmpfile, 'w').write(main_js)

  # get the dependency list of js files
  deps = calcdeps.CalculateDependencies(search_paths, [tmpfile])
  out = open(os.path.devnull, 'w')
  calcdeps.Compile(options.compiler_jar, deps, out, options.compiler_flags)

  # 清理工作
  os.remove(tmpfile)
#}}}

#{{{gen_app
def get_app_cfg_file():
  return os.path.expanduser("~/.Fer.ini")

def set_user_info():
  """ 设置用户的信息app.user.name & app.user.email """
  app_cfg_file = get_app_cfg_file()

  try:
    app_user_name = raw_input("app.user.name: ").strip()
    app_user_email = raw_input("app.user.email: ").strip()

    config = ConfigParser.ConfigParser()
    config.read([app_cfg_file])

    if not config.has_section('user'):
      config.add_section('user')

    config.set('user', 'name', app_user_name)
    config.set('user', 'email', app_user_email)

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
    "app.user.name": config.get('user', 'name'),
    "app.user.email" : config.get('user', 'email')
  }

def get_date_info():
  return {
    "app.create.time" : datetime.now().strftime('%Y/%m/%d %H:%M:%S'),
    "app.create.year" : datetime.now().strftime('%Y'),
  }

def generate_code(template_name, dst_path, app_cfg):
  """ 根据模板生成代码 """
  abs_path = os.path.join(FER_SKEL_DIR, template_name)
  if os.path.exists(abs_path):
    template = open(abs_path, 'r').read()
    content = template % app_cfg
    if os.path.exists(dst_path):
      logging.info('M %s' % dst_path)
    else:
      logging.info('+ %s' % dst_path)
    open(dst_path, 'wb').write(content)

def create_module(module_path, app_cfg):
  """ 生成module相关的代码 """
  if not os.path.exists(module_path):
    os.makedirs(module_path)

  for name in ['module.js', 'mockup.js']:
    abs_path = os.path.join(module_path, name)
    if not os.path.exists(abs_path):
      generate_code(name, abs_path, app_cfg)


def create_action(path_prefix, action_name, app_cfg):
  """ 生成action相关的代码 """
  _ = lambda k : os.path.normpath(os.path.join(path_prefix, k))
  generate_code('action.js', _(action_name + '.js'), app_cfg)
  generate_code('action.css', _(action_name + '.css'), app_cfg)
  generate_code('action.html', _(action_name + '.html'), app_cfg)
  generate_code('action.app.html', _(action_name + '.app.html'), app_cfg)

def register_action(module_path, action_path, app_cfg):
  # 修改module.js，添加path和action关系
  abs_path = os.path.join(module_path, 'module.js')
  module_config_identifier = "%s.config" % app_cfg["app.module"]
  first_token = Frewriter.tokenizer(open(abs_path).read())
  token = Frewriter.find_token(first_token, module_config_identifier)
  start_block = Frewriter.find_token(token, "{", TokenType.START_BLOCK)
  end_block = Frewriter.find_end_token(start_block.next)
  map_code = "\n// Autogenerated at %s\n%s['action'].push({'location':'%s','action':'%s'});" % (
    datetime.now().strftime('%Y/%m/%d %H:%M:%S'), module_config_identifier,
    action_path, app_cfg['app.name'])
  Frewriter.append_code(end_block.previous, Frewriter.tokenizer(map_code))
  open(abs_path, 'wb').write(Frewriter.dump_source(first_token))
  logging.info('M %s' % abs_path)

def update_deps():
  """ 调用ant deps，更新deps.js """
  proc = subprocess.Popen(['ant', 'deps'], stdout = subprocess.PIPE)
  (stdoutdata, stderrdata) = proc.communicate()
  if proc.returncode != 0:
    logging.error('Update deps.js failed.')
    sys.exit(1)

def gen_app(options, args):
  """ 创建application """
  if options.name is None:
    logging.error('--name Could not be None.')
    sys.exit(1)

  name = options.name
  match = action_name_regex.match(name)
  if match is None:
    logging.error('Invalid action name.')
    sys.exit(1)

  # name = "jn.this_is_a_module.ShowCaseDemo"
  package = match.group("package")
  action_name = match.group("action_name")

  # 把ShowCaseDemo转化为show_case_demo的形式
  lowercase_action_name = re.sub(r"\B[A-Z]",\
      lambda z : '_' + chr(ord(z.group(0)) + 32), action_name).lower()

  # ac-jn-this_is_a_module-show-case-demo
  class_name = 'ac-' + package.replace('.', '-') + lowercase_action_name.replace('_', '-')

  # jn_this_is_a_module_show_case_demo
  view_name = package.replace('.', '_') + lowercase_action_name

  # src/jn/this_is_a_module/show_case_demo
  dst_module_path = os.path.join('src', *package.split('.'))
  dst_path_prefix = os.path.join(dst_module_path, lowercase_action_name).replace('\\', '/')
  action_path = options.action_path or dst_path_prefix[3:]   # /jn/this_is_a_module/show_case_demo

  # 计算action.app.html跟src目录的相对路径../../
  rel_path = os.path.relpath(os.path.abspath('src'), os.path.abspath(dst_module_path)).replace('\\', '/')

  app_cfg = {
    "app.module" : package[:-1],
    "app.package.path" : package.replace('.', '/')[:-1],
    "app.super_class" : options.super_class,
    "app.rel_path" : rel_path,
    "app.action_path" : action_path,
    "app.action_name" : lowercase_action_name,
    "app.class_name" : class_name,
    "app.view_name" : view_name,
    "app.name" : name,
  }
  app_cfg.update(get_user_info())
  app_cfg.update(get_date_info())

  # TODO 检测dst_module_prefix是否存在，不存在的话，创建新的
  create_module(dst_module_path, app_cfg)
  create_action(dst_module_path, lowercase_action_name, app_cfg)
  register_action(dst_module_path, action_path, app_cfg)
  # update_deps()
#}}}

#{{{gen_deploy
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

def gen_deploy(options, args):
  if not options.entry_point:
    logging.error('--entry_point must be specified.')
    sys.exit(1)

  output_dir = options.output_dir
  if os.path.exists(output_dir):
    shutil.rmtree(output_dir)
  os.makedirs(output_dir)

  from assets_manager import AssetsManager
  am = AssetsManager(output_dir)
  extern_js_files = []
  for asset in options.extern_js_files:
    if os.path.exists(asset):
      extern_js_files.append(am.add(asset))
  options.extern_js_files = extern_js_files

  compiler = get_html_processor(options.entry_point, options)
  ep_content = compiler.get_main()
  ep_code = compiler.get_script()

  import tempfile
  fd, ep_code_file = tempfile.mkstemp('.js')
  open(ep_code_file, 'wb').write(ep_code)

  search_paths = calcdeps.GetPathsFromOptions(options)
  base_path = calcdeps.FindClosureBasePath(search_paths)
  deps = calcdeps.CalculateDependencies(search_paths, [ep_code_file])
  # print deps

  # XXX [ep_code_file]放到第一位是保证css的顺序符合debug的预期
  includes = get_include_files([ep_code_file] + deps)
  # print includes

  from css_rewriter import CssRewriter
  rewriter = CssRewriter(".", am)
  ep_css_code = []
  ep_tpl_code = []
  for input_file in includes:
    input_file_path = os.path.join(os.path.dirname(base_path), input_file)
    if not os.path.exists(input_file_path):
      continue
    code_content = open(input_file_path, 'rb').read()
    if input_file.endswith(".css"):
      ep_css_code.append(rewriter.rewrite(input_file_path))
    else:
      ep_tpl_code.append(code_content)

  # 输出最终的entry_point_html文件
  ep_file = os.path.basename(options.entry_point)
  ep_css_file = os.path.splitext(ep_file)[0] + '.css'
  ep_tpl_file = 'tpl.html'
  ep_js_file = os.path.splitext(ep_file)[0] + '.js'

  _ = lambda k : os.path.normpath(os.path.join(output_dir, k))
  app_cfg = {
    "app.js.path" : ep_js_file,
    "app.css.path" : ep_css_file
  }
  open(_(ep_file), 'wb').write(re.sub('(\s*\r?\n)+', '\n', ep_content % app_cfg))
  open(_(ep_css_file), 'wb').write(re.sub('\r\n', '\n', "\n".join(ep_css_code)))
  open(_(ep_tpl_file), 'wb').write(re.sub('\r\n', '\n', "\n".join(ep_tpl_code)))
  logging.info('+ %s' % _(ep_file))
  logging.info('+ %s' % _(ep_css_file))
  logging.info('+ %s' % _(ep_tpl_file))

  # 生成helloworld.app.js文件
  out = open(_(ep_js_file), 'wb')
  define_flags = [
    '--define="app.asyncResource=\'%s\'"' % ep_tpl_file,
    '--define="er.config.CONTROL_IFRAME_URL=\'history.html\'"'
  ]
  calcdeps.Compile(options.compiler_jar, deps, out,
    options.compiler_flags + define_flags)
  logging.info('+ %s' % _(ep_js_file))

  # 生成history.html
  if os.path.exists(options.history_html_path):
    shutil.copy(options.history_html_path, _('history.html'))
    logging.info('+ %s' % _('history.html'))
  else:
    logging.error("%s not exists.", options.history_html_path)

  # 清理工作
  os.remove(ep_code_file)
#}}}

def main():
  logging.basicConfig(format="%(levelname)-5s:%(name)s:%(message)s", level=logging.DEBUG)

  usage = 'usage: %prog [options] arg'
  parser = optparse.OptionParser(usage)

#{{{
  gen_deps_og = parser.add_option_group("Generate dependencies")
  gen_deps_og.add_option('--gen_deps',
                         dest='gen_deps',
                         default=False,
                         action="store_true",
                         help='Generate deps.js.')

  build_og = parser.add_option_group("Fer build process")
  build_og.add_option('--build',
                      dest='build',
                      default=False,
                      action="store_true",
                      help='Build project.')

  pl_build_og = parser.add_option_group("Build pl process")
  pl_build_og.add_option('--pl_build',
                         dest='pl_build',
                         default=False,
                         action="store_true",
                         help='Build pl project.')

  gcc_lint_og = parser.add_option_group("Goolge closure compiler lint")
  gcc_lint_og.add_option('--gcc_lint',
                         dest='gcc_lint',
                         default=False,
                         action="store_true",
                         help='Run gcc lint.')

  app_og = parser.add_option_group("Generate application code")
  app_og.add_option('--gen_app',
                    dest='gen_app',
                    default=False,
                    action='store_true',
                    help="Generate application code.")
  app_og.add_option('--name',
                    dest='name',
                    action='store',
                    help="Action's full name. such as jn.this_is_a_module.ShowCase")
  app_og.add_option('--action_path',
                    dest='action_path',
                    action='store',
                    help="Set the action's path.")
  app_og.add_option('--super_class',
                    dest='super_class',
                    default="er.ListAction",
                    action="store",
                    help="Set application super class, default is `er.ListAction`.")
  app_og.add_option('--force',
                    dest='force',
                    default=False,
                    action='store_true',
                    help="Force overwrite the existed file.")

  deploy_og = parser.add_option_group("Generate deployable code")
  deploy_og.add_option('--gen_deploy',
                       dest='gen_deploy',
                       default=False,
                       action='store_true',
                       help="Generate deployable code.")
  deploy_og.add_option('--entry_point',
                       dest='entry_point',
                       action='store',
                       help="The application entry point.")
  deploy_og.add_option('--history_html_path',
                       dest='history_html_path',
                       default='assets/history.html',
                       action='store',
                       help='The history.html path, default is assets/history.html.')

  common_og = parser.add_option_group("Common options")
  common_og.add_option('-p',
                       '--path',
                       dest='paths',
                       action='append',
                       help='The paths that should be traversed to build the dependencies.')
  common_og.add_option('-d',
                       '--dep',
                       dest='deps',
                       action='append',
                       help='Directories or files that should be traversed to '
                       'find required dependencies for the deps file. '
                       'Does not generate dependency information for names '
                       'provided by these files. Only useful in "deps" mode.')
  common_og.add_option('-e',
                       '--exclude',
                       dest='excludes',
                       action='append',
                       help='Files or directories to exclude from the --path '
                       'and --input flags')
  common_og.add_option('-o',
                       '--output_file',
                       dest='output_file',
                       action='store',
                       help='If specified, write output to this path instead of '
                       'writing to standard output.')
  common_og.add_option('-m',
                       '--main_html',
                       dest='main_html',
                       action='store',
                       help='The html file to build.')
  common_og.add_option('-r',
                       '--output_dir',
                       dest='output_dir',
                       default='output',
                       action='store',
                       help='The output directory for build.')
  common_og.add_option("-c",
                       "--charset",
                       dest="charset",
                       default="utf-8",
                       help='Specify the charset of main_html.')
  common_og.add_option("-j",
                       "--extern_js_file",
                       dest="extern_js_files",
                       action='append',
                       default=[],
                       help='External js files which will put in the final ouput when build.'
                       'html code.')
  common_og.add_option('-a',
                       '--compiler_jar',
                       dest='compiler_jar',
                       default=os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'lib', 'google-closure-compiler.jar')),
                       action='store',
                       help='The location of the Closure compiler .jar file.')
  common_og.add_option('-f',
                       '--compiler_flag',
                       '--compiler_flags', # for backwards compatability
                       dest='compiler_flags',
                       action='append',
                       help='Additional flag to pass to the Closure compiler. '
                       'May be specified multiple times to pass multiple flags.')
#}}}

  (options, args) = parser.parse_args()

  if options.gen_deps:
    gen_deps(options, args)
  elif options.build:
    build(options, args)
  elif options.gcc_lint:
    gcc_lint(options, args)
  elif options.pl_build:
    pl_build(options, args)
  elif options.gen_app:
    gen_app(options, args)
  elif options.gen_deploy:
    gen_deploy(options, args)
  else:
    parser.print_help()

if __name__ == "__main__":
  main()



