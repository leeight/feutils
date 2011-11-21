#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id: Fer.py 96743 2011-11-14 09:30:12Z  $ 
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
from HTMLParser import HTMLParser
from calcdeps import GetPathsFromOptions, PrintDeps, ExpandDirectories, CalculateDependencies, FindClosureBasePath


__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/07/28 18:07:16'
__revision = '$Revision: 96743 $'

req_regex = re.compile('goog\.require\s*\(\s*[\'\"]([^\)]+)[\'\"]\s*\);?', re.M|re.S)
prov_regex = re.compile('goog\.provide\s*\(\s*[\'\"]([^\)]+)[\'\"]\s*\);?', re.M|re.S)
include_regex = re.compile('goog\.include\s*\(\s*[\'\"]([^\)]+)[\'\"]\s*\);?', re.M|re.S)
line_sep_regex = re.compile('\r?\n', re.M|re.S)

def utf8(s):
  if isinstance(s, unicode):
    return s.encode("utf-8")
  assert isinstance(s, str)
  return s

class HTMLProcessor(HTMLParser):
  def __init__(self, extern_js_files):
    HTMLParser.__init__(self)
    self.extern_js_files = extern_js_files
    self._in_script = False
    self._in_external_script = False
    self._script_text = cStringIO.StringIO()
    self._main_text = cStringIO.StringIO()
    self._external_scripts = []
    self._external_styles = []

  def _get_buffer(self):
    if self._in_script:
      if self._in_external_script:
        return cStringIO.StringIO()
      else:
        return self._script_text
    else:
      return self._main_text

  def _handle_tag(self, tag, attrs, self_close = False):
    attr_dict = dict(attrs)     # 把attrs转化为dict
    if tag == 'script':
      self._in_script = True
      if attr_dict.get('src') is not None:
        self._in_external_script = True
        self._external_scripts.append(attr_dict.get('src'))
      return
    else:
      if tag == 'link':
        if attr_dict.get('rel') == 'stylesheet' and\
            attr_dict.get('type') == 'text/css':
          self._external_styles.append(attr_dict.get('href'))
          return
      
      buffer = self._get_buffer()
      buffer.write('<%s' % tag)
      for k, v in attrs:
        if v is None:
          buffer.write(' %s' % utf8(k))
        else:
          buffer.write(' %s="%s"' % (utf8(k), utf8(v).replace('"', '&quot;')))

      if self_close:
        buffer.write(' />')
      else:
        buffer.write('>')

  def handle_startendtag(self, tag, attrs):
    self._handle_tag(tag, attrs, True)

  def handle_starttag(self, tag, attrs):
    self._handle_tag(tag, attrs, False)

  def handle_endtag(self, tag):
    if tag == 'script':
      self._in_script = False
      self._in_external_script = False
    else:
      if tag == 'head':
        for file in self.extern_js_files:
          self._get_buffer().write('<script type="text/javascript" src="' + file + '"></script>\n')
        self._get_buffer().write('<script type="text/javascript" src="assets/js/core.js"></script>\n')
        self._get_buffer().write('<link rel="stylesheet" type="text/css" href="assets/css/core.css" />\n')
      
      self._get_buffer().write("</%s>" % tag)
    
  def handle_charref(self, name):
    self._get_buffer().write('&#%s;' % name)

  def handle_entityref(self, name):
    # FIXME 测试用例没问题，真正的页面a.html跑不过，奇怪.
    if self._in_script:
      self._get_buffer().write('&%s' % name)
    else:
      self._get_buffer().write('&%s;' % name)

  def handle_comment(self, data):
    if data.startswith("[if ") and data.endswith("<![endif]"):
      # 保留条件注释
      self._get_buffer().write("<!--%s-->" % utf8(data))

  def handle_decl(self, decl):
    self._get_buffer().write("<!%s>" % utf8(decl))

  def handle_data(self, data):
    self._get_buffer().write(utf8(data))

  def get_script(self):
    return self._script_text.getvalue()

  def get_main(self):
    return self._main_text.getvalue()
  
  def get_external_scripts(self):
    return self._external_scripts

  def get_external_styles(self):
    return self._external_styles

def get_html_processor(file, options):
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
      html_includes.append(include_file)
    else:
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

def gen_deps(options, args):
  search_paths = GetPathsFromOptions(options)

  if options.output_file:
    out = open(options.output_file, 'w')
  else:
    out = sys.stdout

  result = PrintDeps(search_paths, ExpandDirectories(options.deps or []), out)
  if not result:
    logging.error('Could not find Closure Library in the specified paths')
    sys.exit(1)

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
  search_paths = GetPathsFromOptions(options)
  base_path = FindClosureBasePath(search_paths)
  # fetch javascript code from main.html, and store it in [%ouput_dir%/main_js.js]
  compiler = get_html_processor(main_path, options)
  main_js = compiler.get_script()
  open(tmp_dir + '/main_js.js', 'w').write(main_js)
  open(main_path, 'w').write(re.sub('(\r?\n+)+', '\n', compiler.get_main()))
  ext_scripts = compiler.get_external_scripts()
  ext_styles = compiler.get_external_styles()
  # get the dependency list of js files, and put it in [%ouput_dir%/deps_list.js]
  deps = CalculateDependencies(search_paths, [tmp_dir + '/main_js.js'])
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

def gcc_lint(options, args):
  main_path = options.main_html
  # get some variables
  search_paths = GetPathsFromOptions(options)
  base_path = FindClosureBasePath(search_paths)
  # fetch javascript code from main.html, and write it to a temp file
  compiler = get_html_processor(main_path, options)
  main_js = compiler.get_script()
  (code, tmpfile) = tempfile.mkstemp(suffix='.js', prefix='gcc-lint-')
  open(tmpfile, 'w').write(main_js)
  # get the dependency list of js files
  deps = CalculateDependencies(search_paths, [tmpfile])
  deps_list = []
  for dep in deps:
    if not dep.endswith(tmpfile):
      deps_list.append(dep)
  # run google closure compiler to check javascript files in deps list
  args = ['java', '-jar', options.compiler_jar]
  for path in deps_list:
    args += ['--js', path]

  if options.compiler_flags:
    args += options.compiler_flags

  logging.info('Checking javascript with the following command: %s', ' '.join(args))
  proc = subprocess.Popen(args, stdout=subprocess.PIPE)
  (stdoutdata, stderrdata) = proc.communicate()
  if proc.returncode != 0:
    logging.error('gcc-lint failed.')
    sys.exit(1)

def main():
  logging.basicConfig(format='Fer: %(message)s', level=logging.DEBUG)
  
  usage = 'usage: %prog [options] arg'
  parser = optparse.OptionParser(usage)
  parser.add_option('--gen_deps',
                    dest='gen_deps',
                    default=False,
                    action="store_true",
                    help='generate deps.js')
  parser.add_option('--build',
                    dest='build',
                    default=False,
                    action="store_true",
                    help='build project')
  parser.add_option('--gcc_lint',
                    dest='gcc_lint',
                    default=False,
                    action="store_true",
                    help='run gcc lint')
  parser.add_option('-p',
                    '--path',
                    dest='paths',
                    action='append',
                    help='The paths that should be traversed to build the '
                    'dependencies.')
  parser.add_option('-d',
                    '--dep',
                    dest='deps',
                    action='append',
                    help='Directories or files that should be traversed to '
                    'find required dependencies for the deps file. '
                    'Does not generate dependency information for names '
                    'provided by these files. Only useful in "deps" mode.')
  parser.add_option('-e',
                    '--exclude',
                    dest='excludes',
                    action='append',
                    help='Files or directories to exclude from the --path '
                    'and --input flags')
  parser.add_option('-o',
                    '--output_file',
                    dest='output_file',
                    action='store',
                    help=('If specified, write output to this path instead of '
                          'writing to standard output.'))
  parser.add_option('-m',
                    '--main_html',
                    dest='main_html',
                    action='store',
                    help=('the html file to build'))
  parser.add_option('-r',
                    '--output_dir',
                    dest='output_dir',
                    action='store',
                    help=('the output directory for build.'))
  parser.add_option("-c",
                    "--charset",
                    dest="charset",
                    default="utf-8",
                    help=('specify the charset of main_html.'))
  parser.add_option("-j",
                    "--extern_js_file",
                    dest="extern_js_files",
                    action='append',
                    default=[],
                    help=('external js files which will put in the final ouput when build.'
                          'html code.'))
  parser.add_option('-a',
                    '--compiler_jar',
                    dest='compiler_jar',
                    action='store',
                    help='The location of the Closure compiler .jar file.')
  parser.add_option('-f',
                    '--compiler_flag',
                    '--compiler_flags', # for backwards compatability
                    dest='compiler_flags',
                    action='append',
                    help='Additional flag to pass to the Closure compiler. '
                    'May be specified multiple times to pass multiple flags.')
  
  (options, args) = parser.parse_args()

  if options.gen_deps:
    gen_deps(options, args)
    return

  if options.build:
    build(options, args)
    return

  if options.gcc_lint:
    gcc_lint(options, args)
    return

if __name__ == "__main__":
  main()



