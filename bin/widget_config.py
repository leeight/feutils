#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
#
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 读取Widget的配置
# **************************************************************************/



import os
import sys
import Frewriter
from closure_linter import javascripttokens
from closure_linter import tokenutil

Token = javascripttokens.JavaScriptToken
TokenType = javascripttokens.JavaScriptTokenType


__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/08/19 00:34:42'
__revision = '$Revision$'


def remove_tokens_between(start_token, end_token):
  token = start_token
  while token != end_token:
    tokenutil.DeleteToken(token)
    token = token.next

def find_ad_config(code):
  first_token = Frewriter.tokenizer(code)
  token = Frewriter.find_token(first_token, 'AD_CONFIG')
  token = Frewriter.find_token(token, 'AD_CONFIG')
  start_block = token.next.next.next.next  # whitespace operator whitespace START_BLOCK
  # start_block = Frewriter.find_token(token, "{", TokenType.START_BLOCK)
  before_start_block = start_block.previous
  if start_block is None or start_block.type != TokenType.START_BLOCK:
    return (None, None)
  end_block = Frewriter.find_end_token(start_block.next)
  config = Frewriter.dump_source(start_block, end_block)

  remove_tokens_between(start_block, end_block)

  # 插入var AD_CONFIG = %AD_CONFIG%;
  # 保证后续如果想把处理之后的AD_CONFIG重新放回到code的时候，有一个
  # 可以确定的位置。
  tokenutil.InsertTokenAfter(Token(';', TokenType.SEMICOLON,
      token.line, token.line_number), before_start_block)
  tokenutil.InsertTokenAfter(Token('%AD_CONFIG%', TokenType.IDENTIFIER,
      token.line, token.line_number), before_start_block)

  code = Frewriter.dump_source(first_token)
  config = config.strip().rstrip(';')

  return (code, config)

def find_widget_config(code):
  first_token = Frewriter.tokenizer(code)
  token = Frewriter.find_token(first_token, 'WIDGET_CONFIG')
  start_block = Frewriter.find_token(token, "{", TokenType.START_BLOCK)
  if start_block is None:
    return None
  end_block = Frewriter.find_end_token(start_block.next)
  config = Frewriter.dump_source(start_block, end_block)
  return config.strip().rstrip(';')

def main(name):
  config, code = find_ad_config(open(name, 'rb').read())
  print config
  print code


if __name__ == "__main__":
  main(sys.argv[1])




