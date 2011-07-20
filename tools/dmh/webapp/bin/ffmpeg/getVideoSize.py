#!-*- coding:utf-8 -*-

from optparse import OptionParser
import os
import logging
import subprocess
import platform
import re

def run_command(args):
  '''
    ffmpeg参数选项
      -i 输入文件名
      -y 覆盖原文件
      -t
      -vframes
      -fs
      -ss
  '''
  logging.info('command: %s', ' '.join(args))
  proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  return proc

def main():
  
  parser = OptionParser()
  
  (options, args) = parser.parse_args()
  
  """
  获取视频的原始大小(width, height)
  """
  args = [
    'ffmpeg',
    '-i', args[0],
    '-vframes', '1',
    '-f', 'null',
    os.path.devnull
  ]
  
  proc = run_command(args)
  stdoutdata, stderrdata = proc.communicate()
  print stderrdata;
  if proc.returncode != 0:
    return (0, 0)
  
  width = 0
  height = 0

  if platform.system() == 'Linux':
    wp = re.compile('\s*width\s*:\s*(\d+)\s*')
    hp = re.compile('\s*height\s*:\s*(\d+)\s*')
  elif platform.system() == 'Windows':
    wp = re.compile('.*?\s+w:(\d+)\s*')
    hp = re.compile('.*?\s+h:(\d+)\s*')
  
  for line in stderrdata.split('\n'):
    if width > 0 and height > 0:
      break
    if width == 0:
      match = wp.match(line)
      if match != None:
        width = int(match.group(1))
    if height == 0:
      match = hp.match(line)
      if match != None:
        height = int(match.group(1))

  print width, 'x', height

if __name__ == "__main__":
  main()