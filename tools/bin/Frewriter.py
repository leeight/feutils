#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id: rewriter.py 5846 2011-09-22 08:18:11Z songao $ 
# 
# **************************************************************************/



import os
import sys
import cStringIO
from optparse import OptionParser
import codecs
import logging
import traceback

__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/08/21 17:07:55'
__revision = '$Revision: 5846 $'

LIB_HOME = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib')
sys.path.insert(0, os.path.join(LIB_HOME, 'google-closure-linter'))
sys.path.insert(0, os.path.join(LIB_HOME, 'cssutils'))

from closure_linter import ecmametadatapass
from closure_linter import javascripttokenizer
from closure_linter import javascripttokens
from closure_linter import tokenutil

Token = javascripttokens.JavaScriptToken
TokenType = javascripttokens.JavaScriptTokenType


def delete_fn(token):
  first_token = token
  while token.type != TokenType.START_BLOCK:
    tokenutil.DeleteToken(token)
    token = token.next

  tokenutil.DeleteToken(token)
  token = token.next
  stack_depth = 1

  while stack_depth > 0:
    if token.type == TokenType.START_BLOCK:
      stack_depth += 1
    elif token.type == TokenType.END_BLOCK:
      stack_depth -= 1
    tokenutil.DeleteToken(token)
    token = token.next

  if token.type == TokenType.SEMICOLON:
    tokenutil.DeleteToken(token)

  return first_token.previous

def delete_fn_call(token):
  first_token = token
  
  while token.type != TokenType.END_PAREN:
    tokenutil.DeleteToken(token)
    token = token.next
  tokenutil.DeleteToken(token)
  
  next_token = token.next
  if next_token.type == TokenType.SEMICOLON:
    tokenutil.DeleteToken(next_token)
  return first_token.previous

def rewrite_id(token, w_id):
  first_token = token

  id_s = None
  while token.type != TokenType.END_PAREN:
    if token.type == TokenType.STRING_TEXT:
      id_s = token.string
    token = token.next

  # 插入新的标示
  string_start = Token('"', TokenType.SINGLE_QUOTE_STRING_START,
      token.line, token.line_number)
  tokenutil.InsertTokenAfter(string_start, first_token.previous)
  w_id_token = Token('%s_%s' % (w_id, id_s), TokenType.STRING_TEXT,
      token.line, token.line_number)
  tokenutil.InsertTokenAfter(w_id_token, string_start)
  string_end = Token('"', TokenType.SINGLE_QUOTE_STRING_END,
      token.line, token.line_number)
  tokenutil.InsertTokenAfter(string_end, w_id_token)

  # 删掉对ID('xxx')的调用
  token = first_token
  while token.type != TokenType.END_PAREN:
    tokenutil.DeleteToken(token)
    token = token.next
  tokenutil.DeleteToken(token)

  return string_end

def rewrite_get_prefs(token, w_id, name):
  bd_w_prefs = Token('BD_W_PREFS', TokenType.IDENTIFIER, 
      token.line, token.line_number)
  tokenutil.InsertTokenAfter(bd_w_prefs, token.previous)
  start_bracket = Token('[', TokenType.START_BRACKET,
      token.line, token.line_number)
  tokenutil.InsertTokenAfter(start_bracket, bd_w_prefs)
  string_start = Token('"', TokenType.SINGLE_QUOTE_STRING_START,
      token.line, token.line_number)
  tokenutil.InsertTokenAfter(string_start, start_bracket)
  string_text = Token(name, TokenType.STRING_TEXT,
      token.line, token.line_number)
  tokenutil.InsertTokenAfter(string_text, string_start)
  string_end = Token('"', TokenType.SINGLE_QUOTE_STRING_END,
      token.line, token.line_number)
  tokenutil.InsertTokenAfter(string_end, string_text)
  end_bracket = Token(']', TokenType.END_BRACKET,
      token.line, token.line_number)
  tokenutil.InsertTokenAfter(end_bracket, string_end)
  while token.type != TokenType.END_PAREN:
    tokenutil.DeleteToken(token);
    token = token.next
  tokenutil.DeleteToken(token)
  return end_bracket;

def find_token(start_token, identifier, type = TokenType.SIMPLE_LVALUE):
  """ 从token stream中找到合适的 """
  token = start_token
  while token:
    if type == TokenType.SIMPLE_LVALUE:
      if token.IsType(type) and \
          token.values and \
          identifier == token.values['identifier']:
        return token
    else:
      if token.IsType(type):
        return token
    token = token.next
  return None

def find_end_token(start_token):
  """ 找到匹配的}标签 """
  token = start_token
  stack_depth = 1

  while token and stack_depth > 0:
    if token.type == TokenType.START_BLOCK:
      stack_depth += 1
    elif token.type == TokenType.END_BLOCK:
      stack_depth -= 1
    token = token.next

  if token and token.type == TokenType.SEMICOLON:
    token = token.next

  return token

def tokenizer(code):
  tokenizer = javascripttokenizer.JavaScriptTokenizer()
  lines_iter = iter(code.splitlines())
  first_token = tokenizer.TokenizeFile(lines_iter)

  try:
    metadata_pass = ecmametadatapass.EcmaMetaDataPass()
    metadata_pass.Reset()
    metadata_pass.Process(first_token)
  except ecmametadatapass.ParseError, caught_parse_error:
    traceback.print_exc()
    return None
  except Exception:
    traceback.print_exc()
    return None

  return first_token

def append_code(start_token, token_stream):
  """ token_stream从start_token的位置插入到原始的token_stream """
  token = token_stream
  previous_token = start_token
  line_number = start_token.line_number
  while token:
    # print 'type: [%s]  string: [%s]' % (token.type, token.string)
    new_token = Token(token.string, token.type, token.line,
        line_number, token.values)
    if token.type == TokenType.BLANK_LINE or \
       token.type == TokenType.COMMENT:
      line_number += 1
    tokenutil.InsertTokenAfter(new_token, previous_token)
    previous_token = new_token
    token = token.next

  # 更新后续token的line_number
  if line_number > start_token.line_number:
    delta = line_number - start_token.line_number
    token = previous_token.next
    while token:
      token.line_number += delta
      token = token.next

def rewrite(code, id_prefix, name):
  """
  找到a.this_is_a_module.config的结束位置，后面插入一段儿代码：
  a.this_is_a_module.config['action'].push({'location':'','action':''});
  """
  first_token = tokenizer(code)

  #token = find_token(first_token, "a.this_is_a_module.config")
  #print 'type: [%s]  string: [%s]' % (token.type, token.string)
  token = first_token
  while token:
    print 'type: [%s]  string: [%s]' % (token.type, token.string)
    token = token.next
  return dump_source(first_token)

  token = first_token
  while token:
    #print 'type: [%s]  string: [%s]' % (token.type, token.string)
    if token.type == TokenType.SIMPLE_LVALUE:
      identifier = token.values['identifier']
      if identifier == 'baidu.gadgets.render':
        token = delete_fn(token)
    elif token.type == TokenType.IDENTIFIER and \
         token.string == 'baidu.gadgets.getPrefs':
      token = rewrite_get_prefs(token, id_prefix, name)
    elif token.type == TokenType.IDENTIFIER and \
         token.string == 'ID':
      token = rewrite_id(token, id_prefix)
    elif token.type == TokenType.IDENTIFIER and \
         token.string == 'baidu.gadgets.render':
      token = delete_fn_call(token)
    elif token.type == TokenType.IDENTIFIER and \
         token.string == 'baidu.gadgets.runOnLoadHandlers':
      token = delete_fn_call(token)
      # print identifier
    token = token.next

  return dump_source(first_token)

def dump_source(token):
  buffer = cStringIO.StringIO()
  while token:
    buffer.write(token.string)
    if token.IsLastInLine():
      buffer.write("\n")
    token = token.next

  return buffer.getvalue()

def rewrite_css(css_code, prefix):
  import cssutils
  cssutils.ser.prefs.useMinified()
  parser = cssutils.CSSParser()
  sheet = parser.parseString(css_code)
  for rule in sheet.cssRules:
    if rule.type == cssutils.css.CSSRule.STYLE_RULE:
      for selector in rule.selectorList:
        selector.selectorText = '%s %s' % (prefix, selector.selectorText)
  return sheet.cssText

def launch_rewriter(files, options, unique_id=''):
  for filename in files:
    if not os.path.exists(filename):
      logging.warning("%s not exists" % filename)
      continue

    name, ext = os.path.splitext(os.path.basename(filename))

    # rewrite js and css
    if filename.endswith(".js"):
      code = rewrite(codecs.open(filename, 'r', options.charset).read(), "%s_%s" % (unique_id, name), name)
    elif filename.endswith(".css"):
      code = rewrite_css(codecs.open(filename, 'r', options.charset).read(), "#%s_%s_wrap_canvas" % (unique_id, name))
    else:
      logging.warning("only support javascript/css file currently")
      continue

    if code is not False:
      if not os.path.exists('output'):
        os.makedirs('output')
      open("output/%s.compiled%s" % (name, ext), "w").write(code)

def main():
  logging.basicConfig(format='Frewriter.py: %(message)s', level=logging.INFO)

  parser = OptionParser("Usage: Frewriter.py [options] file")
  parser.add_option("-c", "--charset", dest="charset", default="utf-8")

  (options, args) = parser.parse_args()

  if len(args) <= 0:
    parser.print_help()
  else:
    launch_rewriter(args, options)

if __name__ == "__main__":
  main()


