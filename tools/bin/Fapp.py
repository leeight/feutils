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
import itertools
import ConfigParser
from shutil import copytree, ignore_patterns
from string import Template
from datetime import datetime
from optparse import OptionParser


__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/04/15 15:32:16'
__revision = '$Revision$'


FAPP_SKEL_DIR = os.path.join(os.path.dirname(__file__), 'Fapp.skel')

def all_equal(elements):
    ''' return True if all the elements are equal, otherwise False. '''
    first_element = elements[0]
    for other_element in elements[1:]:
        if other_element != first_element: return False
    return True

def common_prefix(*sequences):
    ''' return a list of common elements at the start of all sequences,
        then a list of lists that are the unique tails of each sequence. '''
    # if there are no sequences at all, we're done
    if not sequences: return [  ], [  ]
    # loop in parallel on the sequences
    common = [  ]
    for elements in itertools.izip(*sequences):
        # unless all elements are equal, bail out of the loop
        if not all_equal(elements): break
        # got one more common element, append it and keep looping
        common.append(elements[0])
    # return the common prefix and unique tails
    return common, [ sequence[len(common):] for sequence in sequences ]

def relpath(p1, p2, sep=os.path.sep, pardir=os.path.pardir):
    ''' return a relative path from p1 equivalent to path p2.
        In particular: the empty string, if p1 == p2;
                       p2, if p1 and p2 have no common prefix.
    '''
    common, (u1, u2) = common_prefix(p1.split(sep), p2.split(sep))
    if not common:
        return p2      # leave path absolute if nothing at all in common
    return sep.join( [pardir]*len(u1) + u2 )

def get_app_cfg_file():
  return os.path.expanduser("~/.Fapp.ini")

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

def get_href_info(options):
  """ 返回app.base.href & app.tpl.href 的信息"""
  rel_path = relpath(os.path.abspath(os.path.join(options.dir, options.name)), os.path.abspath('.'))
  base_href = os.path.normpath(os.path.join(rel_path, 'base.js'))
  tpl_href = os.path.normpath(os.path.join(options.dir, options.name, 'tpl.html'))

  return {
    "app.base.href" : base_href.replace(os.path.sep, '/'),
    "app.tpl.href" : tpl_href.replace(os.path.sep, '/'),
    "app.create.time" : datetime.now().strftime('%Y/%m/%d %H:%M:%S')
  }

def has_base_js():
  """ 检测当前目录是否存在base.js """
  if os.path.exists('base.js'):
    f = open('base.js')

    is_base = False

    # Sanity check that this is the Closure base file.  Check that this
    # is where goog is defined.
    for line in f:
      if line.startswith('var goog = goog || {};'):
        is_base = True
        break

    f.close()

    if is_base:
      return True
  return False

def generate_app(options, app_cfg):
  """ 生成app """
  dest_dir = os.path.join(options.dir, options.name)
  if os.path.exists(dest_dir):
    logging.warning('%s already exists.', dest_dir)
  else:
    if not os.path.exists(options.dir):
      os.makedirs(options.dir)
    copytree(FAPP_SKEL_DIR, dest_dir, ignore=ignore_patterns('.svn'))
    
    for root, dirs, files in os.walk(dest_dir):
      if 'CVS' in dirs:
        dirs.remove('CVS')  # don't visit CVS directories
      if '.svn' in dirs:
        dirs.remove('.svn') # don't visit .svn directories
      for f in files:
        abs_path = os.path.join(root, f)
        content = open(abs_path).read() % app_cfg
        open(abs_path, 'wb').write(content)

def main():
  logging.basicConfig(format='Fapp.py: %(message)s', level=logging.INFO)

  if not has_base_js():
    logging.warning('Closure Library base.js not found.')
    sys.exit(0)

  parser = OptionParser()
  parser.add_option("-c", "--config", dest="config", default=False,
                    action="store_true", help="start Fapp configuration")
  parser.add_option("-d", "--dir", dest="dir", default=".",
                    help="destination dir, default is .")
  parser.add_option("-n", "--name", dest="name", 
                    help="create an app with the specified name")
  
  (options, args) = parser.parse_args()

  if options.config:
    set_user_info()
  else:
    if options.name is None:
      parser.print_help()
    else:
      app_cfg = {
        "app" : options.name,
      }
      app_cfg.update(get_user_info())
      app_cfg.update(get_href_info(options))

      generate_app(options, app_cfg)


if __name__ == "__main__":
  main()
