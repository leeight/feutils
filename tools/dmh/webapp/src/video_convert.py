#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id: video_convert.py 6875 2011-06-23 10:52:34Z liyubei $ 
# 压缩视频，转化视频的格式和大小 
# **************************************************************************/
 
 
 
import re
import os
import sys
import optparse
import subprocess
import logging
import platform
 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/05/26 22:13:58'
__revision = '$Revision: 6875 $'


def run_command(args):
  logging.info('command: %s', ' '.join(args))
  proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  return proc

def get_video_size(options, filename):
  """
  获取视频的原始大小(width, height)
  """
  args = [
    options.bin,
    '-i', filename,
    '-vframes', '1',
    '-f', 'null',
    os.path.devnull
  ]
  
  proc = run_command(args)
  stdoutdata, stderrdata = proc.communicate()

  if proc.returncode != 0:
    return (0, 0)
  
  width = 0
  height = 0

  wp = re.compile('\s*width\s*:\s*(\d+)\s*')
  hp = re.compile('\s*height\s*:\s*(\d+)\s*')
  ap = re.compile(r'(\d+)x(\d+)', re.M | re.I)
  
  for line in stderrdata.split('\n'):
    if width > 0 and height > 0:
      break

    if width == 0:
      match = wp.match(line)
      if match != None:
        width = int(match.group(1))
        continue

    if height == 0:
      match = hp.match(line)
      if match != None:
        height = int(match.group(1))
        continue

    match = ap.search(line)
    if match != None:
      width = int(match.group(1))
      height = int(match.group(2))

  return (width, height)

def get_zoom_size(v_width, v_height,
                  p_width, p_height):
  factor = p_width * 1.0 / v_width
  height = int(factor * v_height)
  if height % 2 == 1:
    height += 1

  return (p_width, height)

def run(options, filename, bps):
  name, ext = os.path.splitext(filename)
  output = name + '.' + bps + '.flv'

  # XXX 参数的顺序对结果有影响，不要随意调整参数的顺序.
  args = [
    options.bin,
    '-i', filename,
    '-ar', '22050',
    '-ac', '1',
    '-ab', '8k',
    '-vcodec', 'libx264',
    '-acodec', 'libfaac',
    '-b', bps
  ]

  if platform.system() == 'Linux':
    args += [
      '-vpre', 'hq'    
    ]
  elif platform.system() == 'Windows':
    hq = os.path.join(os.path.dirname(options.bin), '..', 'presets', 'libx264-hq.ffpreset')
    hq = os.path.normpath(hq)
    if os.path.exists(hq):
      args += [
        '-fpre', hq
      ]
    else:
      logging.error('[' + hq + '] doesn\'t exists')

  if options.frames != None:
    args += ['-vframes', options.frames]
  
  crop = [0, 0, 0, 0]
  if options.crop != None:
    crop = map(lambda i:int(i, 10), options.crop.split('x'))

  # 计算最终的大小
  v_width, v_height = get_video_size(options, filename)
  v_width  -= (crop[1] + crop[3])
  v_height -= (crop[0] + crop[2])

  p_width, p_height = tuple(map(lambda i:int(i), options.size.split('x')))

  s_width, s_height = get_zoom_size(v_width, v_height, p_width, p_height)
  s_width  += (crop[1] + crop[3])
  s_height += (crop[0] + crop[2])
  
  args += [
    '-s', '%sx%s' % (s_width, s_height)
  ]
  if platform.system() == 'Linux':
    for key, value in [('-croptop', crop[0]), 
                       ('-cropright', crop[1]), 
                       ('-cropbottom', crop[2]), 
                       ('-cropleft', crop[3])]:
      if value > 0:
        args += [
          key, str(value)    
        ]
  elif platform.system() == 'Windows':
    vf = 'crop=%s:%s:%s:%s' % (s_width, s_height, crop[0], crop[3])
    args += [
      '-vf', vf
    ]
  
  args += [
    '-y', output
  ]
  proc = run_command(args)
  stdoutdata, stderrdata = proc.communicate()

  if proc.returncode != 0:
    logging.error('failed to launch the previous command')
  else:
    logging.info('OK')

def print_video_meta_info(options, filename):
  """
  获取视频的元信息，例如帧数，时长等等
  """
  args = [
    options.bin,
    '-i', filename,
    '-f', 'null',
    os.path.devnull
  ]
  
  proc = run_command(args)
  stdoutdata, stderrdata = proc.communicate()

  if proc.returncode == 0:
    index = stderrdata.find('Input #0')
    if index != -1:
      print stderrdata[index:]
 
def install_ffmpeg_help():
  print """
Can't find `ffmpeg` command, please install it first.
Ubunt Linux:
  sudo apt-get install ffmpeg
Windows:
  svn checkout http://fe.baidu.com/repos/sdcfe/tools
  """
  pass

def main():
  parser = optparse.OptionParser()
  
  # 播放器播放区域的默认大小
  parser.add_option('-s', '--size', dest='size', action='store', 
                    default='306x228', help='default is 306x228')
  
  # 黑边的处理，格式是{top}x{right}x{bottom}x{left}
  parser.add_option('-c', '--crop', dest='crop', action='store',
                    help='format is 10x9x8x7')

  # 需要处理的帧数
  parser.add_option('-f', '--frames', dest='frames', action='store')

  # bps
  parser.add_option('-b', '--bps', dest='bps', action='store',
                    default='256k, 384k', help='default is 256k, 384k')

  parser.add_option('-e', '--ffmpeg-bin', dest='bin', action='store',
                    default='ffmpeg', help='default is ffmpeg')

  (options, args) = parser.parse_args()

  if len(args) <= 0:
    parser.print_help()
    return

  try:
    proc = run_command([options.bin])
  except:
    install_ffmpeg_help()
    return

  print_video_meta_info(options, args[0])
  for bps in options.bps.split(','):
    run(options, args[0], bps.strip())

if __name__ == "__main__":
  logging.basicConfig(level=0)
  main()




