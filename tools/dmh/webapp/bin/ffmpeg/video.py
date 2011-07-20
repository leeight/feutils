#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100 noet:
# ***************************************************************************
# 
# Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
# $Id: video_convert.py 6545 2011-06-09 06:28:54Z liyubei $ 
# 压缩视频，转化视频的格式和大小 
# **************************************************************************/
 
# ffmpeg参数整理
# 
 
 
import re
import os
import sys
import optparse
import subprocess
import logging
import platform
import time
 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/05/26 22:13:58'
__revision = '$Revision: 6545 $'

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
  print 'command:\'' + ' '.join(args) + '\',',
  proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  return proc

def run(options, filename, bps):
  name, ext = os.path.splitext(filename)
  file_path,file_pre_name = os.path.split(name)

  
  output = file_path + '/download/' + file_pre_name + '.' + bps + '.flv'
  
  print 'gen_video_path:\'' + output + '\',',

  # XXX 参数的顺序对结果有影响，不要随意调整参数的顺序.
  args = [
    options.bin,
    '-i', filename,
    '-ar', '22050',
    '-ac', '1',
    '-ab', '8k',
    '-vcodec', 'flv',
    '-f', 'flv',
    '-acodec', 'libmp3lame',
    '-b', bps, #比特率
    '-ss', options.start #开始位置
  ]

  if options.frames != None:
    args += ['-vframes', options.frames]
  
  crop = [0, 0]
  if options.crop != None:
    crop = map(lambda i:int(i, 10), options.crop.split('x'))

  # 视频尺寸
  width, height = tuple(map(lambda i:int(i), options.size.split('x')))
  
  crop_width = width + crop[1] + crop[3]
  crop_height = height + crop[0] + crop[2]
  
  args += [
    '-s', '%sx%s' % (crop_width, crop_height)
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
    vf = 'crop=%s:%s:%s:%s' % (width, height, crop[3], crop[0])
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


def split_video(video):
  
  """
    将视频按帧分解成多张静态图片
  """
  
  
  today = time.strftime('%Y%m%d')
  now = time.strftime('%H%M%S')
  
  dirname, videoName = os.path.split(video)
  videoName, ext = os.path.splitext(videoName)
  
  target = os.path.join(today, videoName, now)
    
  if not os.path.exists(target):
      os.makedirs(target)

  print 'target:\'', target.replace('\\', '/'), '\','
  
  target = os.path.join(target, '%d.jpg')
  args = [
    'ffmpeg',
    '-i', video,
    target
  ]
  
  proc = run_command(args)
  stdoutdata, stderrdata = proc.communicate()
  #获取视频时长
  timePattern = re.compile(r'(?<=time=)[\d:\.]+(?=\s*)', re.IGNORECASE)
  #获取视频尺寸
  sizePattern = re.compile(r'(?<=, )\d{2,4}x\d{2,4}(?=,?\s)', re.IGNORECASE)
  #获取视频帧数
  framePattern = re.compile(r'(?<=frame=)(?:\s*)(\d+)(?=\s*)', re.IGNORECASE)
  
  timeInfoArr = re.findall(timePattern, stderrdata)
  sizeInfoArr = re.findall(sizePattern, stderrdata)
  frameInfoArr = re.findall(framePattern, stderrdata)

  if len(timeInfoArr) > 0:
    print 'time:\'', timeInfoArr[len(timeInfoArr)-1], '\','
  if len(sizeInfoArr) > 0:
    sizeInfoArr = sizeInfoArr[0].strip().split('x');
    print 'width:', sizeInfoArr[0], ','
    print 'height:', sizeInfoArr[1].strip(' ,'), ','
  if len(frameInfoArr) > 0:
    print 'count:', frameInfoArr[len(frameInfoArr)-1], ','
  else:
    print 0

def main():
  
  parser = optparse.OptionParser()
  
  # 操作选项  视频按帧分解 / 视频转换
  parser.add_option('-o', '--operate', dest='operate', action='store', 
                    default='convert', help='convert / split / info, default is convert')
  
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
                    default='384k', help='default is 256k, 384k')

  parser.add_option('-e', '--ffmpeg-bin', dest='bin', action='store',
                    default='ffmpeg', help='default is ffmpeg')
  
  parser.add_option('-p', '--start-time', dest='start', action='store',
                    default='0', help='default is 0')

  (options, args) = parser.parse_args()

  if len(args) <= 0:
    parser.print_help()
    return
  if options.operate == 'split':
    split_video(args[0]);
  else:
    # print_video_meta_info(options, args[0])
    run(options, args[0], options.bps.strip())

if __name__ == "__main__":
  #logging.basicConfig(level=0)
  main()




