#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id: Fuilist.py 5296 2011-05-06 13:45:10Z liyubei $ 
# 
# **************************************************************************/
 
 
 
import os
import sys
import re 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/05/06 19:29:21'
__revision = '$Revision: 5296 $'


from HTMLParser import HTMLParser

class CollectUIParser(HTMLParser):
  def handle_starttag(self, tag, attrs):
    attrs_dict = dict(attrs)
    if attrs_dict.has_key('ui'):
      ui = attrs_dict['ui']
      for token in ui.split(';'):
        if len(token) > 0:
          key, value = token.split(':')
          if key == 'type' and len(value) > 0:
            if value.find('.') == -1:
              print 'goog.require(\'ui.' + value + '\');'
            else:
              print 'goog.require(\'' + value + '\');';

  def handle_endtag(self, tag):
    pass

def main(file_name):
  parser = CollectUIParser();
  parser.feed(file(file_name).read())

if __name__ == "__main__":
  main(sys.argv[1])



