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
import logging
import Frewriter
import calcdeps
import subprocess
import re
import json
import ConfigParser
from datetime import datetime
from closure_linter import javascripttokens
from widget_config import find_widget_config

TokenType = javascripttokens.JavaScriptTokenType

action_name_regex = re.compile('(?P<package>([a-z\d_]+\.)+)(?P<action_name>[A-Z]\w+)', re.M|re.S)

FER_SKEL_DIR = os.path.join(os.path.dirname(__file__), 'Fer.skel')

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/06/05 11:57:49'
__revision = '$Revision$'


#{{{get_app_cfg_file
def get_app_cfg_file():
  return os.path.expanduser("~/.Fer.ini")
#}}}

#{{{set_user_info
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
#}}}

#{{{has_user_info
def has_user_info():
  app_cfg_file = get_app_cfg_file()
  if not os.path.exists(app_cfg_file):
    return False

  config = ConfigParser.ConfigParser()
  config.read([app_cfg_file])

  if not config.has_section('user'):
    return False

  return True
#}}}

#{{{get_user_info
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
#}}}

#{{{get_date_info
def get_date_info():
  return {
    "app.create.time" : datetime.now().strftime('%Y/%m/%d %H:%M:%S'),
    "app.create.year" : datetime.now().strftime('%Y'),
  }
#}}}

#{{{generate_code
def generate_code(template_name, dst_path, app_cfg):
  """ 根据模板生成代码 """
  try:
    abs_path = os.path.join(FER_SKEL_DIR, template_name)
    if os.path.exists(abs_path):
      template = open(abs_path, 'r').read()
      content = template % app_cfg
      if os.path.exists(dst_path):
        logging.info('M %s' % dst_path)
      else:
        logging.info('+ %s' % dst_path)
      open(dst_path, 'wb').write(content)
  except:
    error_exit('generate_code failed for %s' % dst_path)
#}}}

#{{{create_module
def create_module(module_path, app_cfg):
  """ 生成module相关的代码 """
  if not os.path.exists(module_path):
    os.makedirs(module_path)

  for name in ['module.js', 'module.less', 'mockup.js']:
    abs_path = os.path.join(module_path, name)
    if not os.path.exists(abs_path):
      generate_code(name, abs_path, app_cfg)
#}}}

#{{{create_action
def create_action(path_prefix, action_name, app_cfg):
  """ 生成action相关的代码 """
  _ = lambda k : os.path.normpath(os.path.join(path_prefix, k))
  generate_code('action.js', _(action_name + '.js'), app_cfg)
  generate_code('action.less', _(action_name + '.less'), app_cfg)
  generate_code('action.html', _(action_name + '.html'), app_cfg)
  generate_code('action.app.html', _(action_name + '.app.html'), app_cfg)
#}}}

#{{{create_widget
def create_widget(path_prefix, action_name, app_cfg):
  """ 生成widget相关的代码 """
  _ = lambda k : os.path.normpath(os.path.join(path_prefix, k))
  generate_code('widget.js', _(action_name + '.js'), app_cfg)
  generate_code('widget.less', _(action_name + '.less'), app_cfg)
  generate_code('widget.html', _(action_name + '.html'), app_cfg)
  generate_code('widget.app.html', _(action_name + '.app.html'), app_cfg)
  generate_code('widget.config.js', _(action_name + '.config.js'), app_cfg)
#}}}

#{{{create_material
def create_material(path_prefix, action_name, app_cfg):
  """ 生成widget相关的代码 """
  _ = lambda k : os.path.normpath(os.path.join(path_prefix, k))
  generate_code('material.js', _(action_name + '.js'), app_cfg)
  generate_code('material.less', _(action_name + '.less'), app_cfg)
  generate_code('material.app.html', _(action_name + '.app.html'), app_cfg)
  generate_code('material.config.js', _(action_name + '.config.js'), app_cfg)
#}}}

#{{{create_material_config
def create_material_config(path_prefix, action_name, app_cfg):
  """ 生成widget相关的代码 """
  _ = lambda k : os.path.normpath(os.path.join(path_prefix, k))
  abs_path = _(action_name + '.js')
  first_token = Frewriter.tokenizer(open(abs_path).read())
  """
  token = Frewriter.find_token(first_token, 'material.setWidgets', TokenType.IDENTIFIER)
  start_paren = Frewriter.find_token(token, '(', TokenType.START_PAREN)
  end_paren = Frewriter.find_end_token(start_paren.next, TokenType.START_PAREN, TokenType.END_PAREN)
  """

  widgets = []

  def ignore_whitespace(token):
    while token and token.type == TokenType.WHITESPACE:
      token = token.next
    return token

  token = first_token
  while token:
    if token.type == TokenType.IDENTIFIER:
      next_token = ignore_whitespace(token.next)
      if next_token and \
          next_token.type == TokenType.START_PAREN and \
          token.string.startswith('ad.widget'):   # FIXME(leeight) 检测方式不合理
        widgets.append(token.string)
    token = token.next

  if len(widgets) <= 0:
    logging.error('Can\'t find any widgets in %s.', abs_path)
    return

  # 建立namespace和filename的对应关系
  action_name_regex = re.compile('(?P<package>([a-z\d_]+\.)+)(?P<action_name>[A-Z]\w+)', re.M|re.S)
  pattern = re.compile(r'goog.addDependency\("([^"]+)",\s*\[([^\)]*)\],\s*\[([^\)]*)\]\)')
  deps = {}
  for line in open('src/deps.js').read().splitlines():
    match = pattern.findall(line)
    if match:
      filename = match[0][0]
      provides = match[0][1]
      for item in provides.replace('\'', '').split(','):
        if item.strip():
          deps[item.strip()] = filename

  config = "{\n'id' : 'ec-ma-8964',\n'main_url' : 'http://www.baidu.com'"
  for widget in set(widgets):
    logging.debug("%s => %s" , widget, deps[widget])
    abs_path = os.path.join('src', deps[widget].replace('.js', '.config.js'))
    if os.path.exists(abs_path):
      key = os.path.basename(abs_path).replace(".config.js", "")
      # XXX 不是所有人写的JSON都是那么规范，因此使用json.loads的话，可能
      # 导致很多问题
      config += (",\n'%s' : " % key) 
      xxx = find_widget_config(open(abs_path, 'rb').read())
      if xxx is None:
        logging.error(abs_path)
      else:
        config += xxx
  config += "\n}"

  app_cfg['material.config'] = config
  generate_code('material.config.js', _(action_name + '.config.js'), app_cfg)
#}}}

#{{{register_action
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
#}}}

#{{{update_deps
def update_deps():
  """ 调用ant deps，更新deps.js """
  proc = subprocess.Popen(['ant', 'deps'], stdout = subprocess.PIPE)
  (stdoutdata, stderrdata) = proc.communicate()
  if proc.returncode != 0:
    logging.error('Update deps.js failed.')
    sys.exit(1)
#}}}

#{{{error_exit
def error_exit(msg):
  logging.error(msg)
  sys.exit(1)
#}}}

#{{{_get_cfg
def _get_cfg(options, args):
  logging.getLogger().setLevel(-1)

  """ 创建application """
  if options.name is None:
    error_exit('--name Could not be None.')

  name = options.name
  match = action_name_regex.match(name)
  if match is None:
    error_exit('Invalid action name.')

  # name = "jn.this_is_a_module.ShowCaseDemo"
  package = match.group("package")
  action_name = match.group("action_name")

  # 把ShowCaseDemo转化为show_case_demo的形式
  lowercase_action_name = re.sub(r"\B[A-Z]",\
      lambda z : '_' + chr(ord(z.group(0)) + 32), action_name).lower()

  # ac-jn-this_is_a_module-show-case-demo
  class_name = package.replace('.', '-') + lowercase_action_name.replace('_', '-')

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
    "mod.class_name" : package.replace('.', '-')[:-1],
    "app.view_name" : view_name,
    "app.name" : name,
  }
  app_cfg.update(get_user_info())
  app_cfg.update(get_date_info())

  return (dst_module_path, app_cfg)
#}}}

#{{{gen_widget
def gen_widget(options, args):
  dst_module_path, app_cfg = _get_cfg(options, args)
  action_path = app_cfg['app.action_path']
  lowercase_action_name = app_cfg['app.action_name']
  app_cfg['app.super_class'] = 'ad.widget.Widget'

  if not os.path.exists(dst_module_path):
    os.makedirs(dst_module_path)
  create_widget(dst_module_path, lowercase_action_name, app_cfg)
#}}}

#{{{gen_app
def gen_app(options, args):
  dst_module_path, app_cfg = _get_cfg(options, args)
  action_path = app_cfg['app.action_path']
  lowercase_action_name = app_cfg['app.action_name']

  # TODO 检测dst_module_prefix是否存在，不存在的话，创建新的
  create_module(dst_module_path, app_cfg)
  create_action(dst_module_path, lowercase_action_name, app_cfg)
  register_action(dst_module_path, action_path, app_cfg)
#}}}

#{{{gen_material
def gen_material(options, args):
  dst_module_path, app_cfg = _get_cfg(options, args)
  action_path = app_cfg['app.action_path']
  lowercase_action_name = app_cfg['app.action_name']
  app_cfg['app.super_class'] = 'ad.widget.Widget'
  app_cfg['material.config'] = json.dumps({
    'id' : 'ec-ma-8964',
    'main_url' : 'http://www.baidu.com'
  }, indent = 4)

  if not os.path.exists(dst_module_path):
    os.makedirs(dst_module_path)
  create_material(dst_module_path, lowercase_action_name, app_cfg)
#}}}

#{{{gen_material_config
def gen_material_config(options, args):
  dst_module_path, app_cfg = _get_cfg(options, args)
  action_path = app_cfg['app.action_path']
  lowercase_action_name = app_cfg['app.action_name']
  app_cfg['app.super_class'] = 'ad.widget.Widget'

  if not os.path.exists(dst_module_path):
    os.makedirs(dst_module_path)
  create_material_config(dst_module_path, lowercase_action_name, app_cfg)
#}}}





