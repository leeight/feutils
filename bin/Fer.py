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

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/07/28 18:07:16'
__revision = '$Revision$'

def main():
  logging.basicConfig(format="%(levelname)-5s:%(name)s:%(message)s", level=logging.WARN)

  usage = 'usage: %prog [options] arg'
  parser = optparse.OptionParser(usage)

#{{{
  gen_deps_og = parser.add_option_group("Generate dependencies")
  gen_deps_og.add_option('--gen_deps',
                         dest='gen_deps',
                         default=False,
                         action="store_true",
                         help='Generate deps.js.')


  ad_rewrite_og = parser.add_option_group("Rewrite ad deployable code")
  ad_rewrite_og.add_option('--rewrite_deploy_code',
                           dest='rewrite_deploy_code',
                           default=False,
                           action='store_true',
                           help="Rewrite the generated code.")
  ad_rewrite_og.add_option('--async',
                           dest='async',
                           default=False,
                           action='store_true',
                           help="Load ad code asynchronous.")
  ad_rewrite_og.add_option('--link_id',
                           default=0,
                           dest='link_id',
                           type='int',
                           help="the link_id start index.")
  ad_rewrite_og.add_option('--stage',
                           default=0,
                           dest='stage',
                           type='int',
                           help="the RELEASE_stage.")

  app_og = parser.add_option_group("Generate application code")
  app_og.add_option('--gen_app',
                    dest='gen_app',
                    default=False,
                    action='store_true',
                    help="Generate application code.")
  app_og.add_option('--gen_widget',
                    dest='gen_widget',
                    default=False,
                    action='store_true',
                    help="Generate widget code.")
  app_og.add_option('--gen_material',
                    dest='gen_material',
                    default=False,
                    action='store_true',
                    help="Generate material code.")
  app_og.add_option('--gen_material_config',
                    dest='gen_material_config',
                    default=False,
                    action='store_true',
                    help="Generate material.config.js code.")
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
                       default='assets/text/history.html',
                       action='store',
                       help='The history.html path, default is assets/text/history.html.')
  deploy_og.add_option('--enable_javascript_rewriter',
                       dest='enable_javascript_rewriter',
                       default=False,
                       action='store_true',
                       help='Enable javascript rewriter.')
  deploy_og.add_option('--enable_html_rewriter',
                       dest='enable_html_rewriter',
                       default=False,
                       action='store_true',
                       help='Enable html rewriter.')
  deploy_og.add_option('--enable_auto_sprite',
                       dest='enable_auto_sprite',
                       default=False,
                       action='store_true',
                       help='Enable auto sprite.')
  deploy_og.add_option('--enable_png8_convert',
                       dest='enable_png8_convert',
                       default=False,
                       action='store_true',
                       help='Enable png8 convert.')
  deploy_og.add_option('--less_include_path',
                       dest='less_include_path',
                       action='store',
                       help="The directory where the less imported from.")

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
  common_og.add_option("--ad_template_wrapper",
                       dest="ad_template_wrapper",
                       default=None,
                       help="Ad template output wrapper, default is None.")
  common_og.add_option("--ad_style_wrapper",
                       dest="ad_style_wrapper",
                       default=None,
                       help="Ad style output wrapper, default is None.")
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
  common_og.add_option("--noisy", action="store_true", default=False,
                       dest="verbose", help="Print all logs.")
#}}}

  (options, args) = parser.parse_args()

  if options.verbose:
    logging.getLogger().setLevel(-1)

  if options.gen_deps:
    from gen_deps import gen_deps
    gen_deps(options, args)
  elif options.gen_app:
    from gen_app import gen_app
    gen_app(options, args)
  elif options.gen_material:
    from gen_app import gen_material
    gen_material(options, args)
  elif options.gen_material_config:
    from gen_app import gen_material_config
    gen_material_config(options, args)
  elif options.rewrite_deploy_code:
    from rewrite_deploy_code import rewrite_deploy_code
    rewrite_deploy_code(options, args)
  elif options.gen_widget:
    from gen_app import gen_widget
    gen_widget(options, args)
  elif options.gen_deploy:
    from gen_deploy import gen_deploy
    gen_deploy(options, args)
  else:
    parser.print_help()

if __name__ == "__main__":
  main()



