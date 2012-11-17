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
import unittest
import Frewriter
import traceback
import cStringIO

from closure_linter import ecmametadatapass
from closure_linter import javascripttokenizer
from closure_linter import javascripttokens
from closure_linter import tokenutil

Token = javascripttokens.JavaScriptToken
TokenType = javascripttokens.JavaScriptTokenType



__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/01/23 10:13:15'
__revision = '$Revision$'

class FrewriterTestCase(unittest.TestCase):
  def setUp(self):
    base, ext = os.path.splitext(__file__)
    code = open(base + '.js').read()
    self.first_token = Frewriter.tokenizer(code)

  def tearDown(self):
    pass

  def _dump_source(self, token):
    buffer = cStringIO.StringIO()
    while token:
      buffer.write(token.string)
      if token.IsLastInLine():
        buffer.write("\n")
      token = token.next

    return buffer.getvalue()

  def testAppendCode(self):
    token_stream1 = Frewriter.tokenizer("var hello = 'world';")
    token_stream2 = Frewriter.tokenizer("var happy = 'new year';\n\n\n\n\n\n//THIS IS COMMENT")
    Frewriter.append_code(token_stream1.next.next.next.next.next.next.next.next.next, token_stream2)
    self.assertEquals("var hello = 'world';var happy = 'new year';\n\n\n\n\n//THIS IS COMMENT\n",
      self._dump_source(token_stream1))

  def testFindToken(self):
    token = Frewriter.find_token(self.first_token, "a.this_is_a_module.config")
    self.assertEquals(token.type, TokenType.SIMPLE_LVALUE)
    self.assertEquals(token.values['identifier'], 'a.this_is_a_module.config')

    token = Frewriter.find_token(self.first_token, "a.this_is_a_module.Fields")
    self.assertEquals(token.type, TokenType.SIMPLE_LVALUE)
    self.assertEquals(token.values['identifier'], 'a.this_is_a_module.Fields')

    token = Frewriter.find_token(self.first_token, "a.this_is_a_module.data")
    self.assertEquals(token.type, TokenType.SIMPLE_LVALUE)
    self.assertEquals(token.values['identifier'], 'a.this_is_a_module.data')
    self.assertEquals(token.string, 'a.this_is_a_module.data')

    token = Frewriter.find_token(self.first_token, "/*", TokenType.START_BLOCK_COMMENT)
    self.assertTrue(token is not None)
    self.assertEquals(token.type, TokenType.START_BLOCK_COMMENT)
    self.assertEquals(token.string, "/*")

    token = Frewriter.find_token(self.first_token, "a.this_is_a_module.NotFound")
    self.assertTrue(token is None)

  def testFindEndToken(self):
    token = Frewriter.find_token(self.first_token, "a.this_is_a_module.config")
    self.assertEquals(token.type, TokenType.SIMPLE_LVALUE)
    self.assertEquals(token.values['identifier'], 'a.this_is_a_module.config')

    start_block = Frewriter.find_token(token, "{", TokenType.START_BLOCK)
    self.assertTrue(start_block is not None)

    end_block = Frewriter.find_end_token(start_block.next)
    self.assertTrue(end_block is not None)

  def testInsertActionConfig(self):
    token = Frewriter.find_token(self.first_token, "a.this_is_a_module.config")
    self.assertEquals(token.type, TokenType.SIMPLE_LVALUE)
    self.assertEquals(token.values['identifier'], 'a.this_is_a_module.config')

    start_block = Frewriter.find_token(token, "{", TokenType.START_BLOCK)
    self.assertTrue(start_block is not None)

    end_block = Frewriter.find_end_token(start_block.next)
    self.assertTrue(end_block is not None)

    # a.this_is_a_module.config['action'].push({'location':'','action':''});
    code = "a.this_is_a_module.config['action'].push({'location':'/jn/demo/xxx','action':'jn.demo.Xxx'});"
    Frewriter.append_code(end_block, Frewriter.tokenizer(code))
    self.assertTrue(self._dump_source(self.first_token).find(code) > 0)

if __name__ == '__main__':
  unittest.main()








