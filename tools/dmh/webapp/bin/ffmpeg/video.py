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
import BaseHTTPServer
import SimpleHTTPServer
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2011/05/26 22:13:58'
__revision = '$Revision: 6545 $'

#切换到当前工作目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PATH = ''
PORT = 8999

def run_command(args, videoInfo):
  '''
    ffmpeg参数选项
      -i 输入文件名
      -y 覆盖原文件
      -t
      -vframes
      -fs
      -ss
  '''
  videoInfo['command'] = ' '.join(args)
  print videoInfo['command']
  proc = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  
  return proc

def convert(crop, filename, bin='ffmpeg', start=0, frames=0, size='306x228', bps='384k'):
  
  filename = 'upload/' + filename
  
  name, ext = os.path.splitext(filename)
  file_path,file_pre_name = os.path.split(name)
  
  outputDir = file_path + '/download/'
  
  output = outputDir + file_pre_name + '.' + bps + '.flv'
  
  if not os.path.exists(outputDir):
      os.makedirs(outputDir)
  
  videoInfo = {}
  
  videoInfo['gen_video_path'] = output
  
  if platform.system() == 'Linux':
    bin = '/home/maoquan/local/bin/' + bin
  
  # XXX 参数的顺序对结果有影响，不要随意调整参数的顺序.
  args = [
    bin,
    '-i', filename,
    '-ar', '22050',
    '-ac', '1',
    '-ab', '8k',
#    '-vcodec', 'flv',
#    '-f', 'flv',
#    '-acodec', 'libmp3lame',
    '-b', bps, #比特率
    '-ss', start #开始位置
  ]

  args += ['-vframes', frames]
  
  crop = map(lambda i:int(i, 10), crop.split('x'))

  # 视频尺寸
  width, height = tuple(map(lambda i:int(i), size.split('x')))
  
  crop_width = width + crop[1] + crop[3]
  crop_height = height + crop[0] + crop[2]
  
  args += [
    '-s', '%sx%s' % (crop_width, crop_height)
  ]
  
  vf = 'crop=%s:%s:%s:%s' % (width, height, crop[3], crop[0])
  args += [
    '-vf', vf
  ]
  
  args += [
    '-y', output
  ]
  proc = run_command(args, videoInfo)
  stdoutdata, stderrdata = proc.communicate()

  if proc.returncode != 0:
    logging.error('failed to launch the previous command')
  else:
    logging.info('OK')
    
  return videoInfo


def split_video(video):
  
  """
    将视频按帧分解成多张静态图片
  """
  videoInfo = {}
  
  today = time.strftime('%Y%m%d')
  now = time.strftime('%H%M%S')
  
  dirname, videoName = os.path.split(video)
  videoName, ext = os.path.splitext(videoName)
  
  target = os.path.join(today, videoName, now)
    
  if not os.path.exists(target):
      os.makedirs(target)

  videoInfo['target'] = target.replace('\\', '/')
  
  bin = 'ffmpeg'
  
  if platform.system() == 'Linux':
    bin = '/home/maoquan/local/bin/' + bin
  
  target = os.path.join(target, '%d.jpg')
  args = [
    bin,
    '-i', video,
    target
  ]
  
  proc = run_command(args, videoInfo)
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
    videoInfo['time'] = timeInfoArr[len(timeInfoArr)-1]
  if len(sizeInfoArr) > 0:
    sizeInfoArr = sizeInfoArr[0].strip().split('x');
    videoInfo['width'] = sizeInfoArr[0]
    videoInfo['height'] = sizeInfoArr[1].strip(' ,')
  if len(frameInfoArr) > 0:
    videoInfo['count'] = frameInfoArr[len(frameInfoArr)-1]
  else:
    videoInfo['count'] = '0'

  return videoInfo

def mkdir(dirname):
  videoInfo = {}
  
  if not os.path.exists(dirname):
    videoInfo['createDir'] = 'true'
    os.makedirs(dirname, 0755) #因为上传文件由php负责从临时文件夹移动到目标文件夹，因此设为0755权限
  else:
    videoInfo['createDir'] = 'false'
  return videoInfo

def main(http):
  
  paramArr = http.path.split('?')[1].split('&')
  paramMap = {}
  for param in paramArr:
    name, query = param.split('=')
    paramMap[name] = query
  
  if paramMap['o'] == 'split':
    videoInfo = split_video(paramMap['filename'])
  elif paramMap['o'] == 'mkdir':
    videoInfo = mkdir(paramMap['dirname'])
  else:
    videoInfo = convert(paramMap['crop'], paramMap['filename'], paramMap['bin'], paramMap['start'], paramMap['frames'], paramMap['size'], paramMap['bps'])
#  body = '{';
  body = '';
  for name, value in videoInfo.items():
    body += name + ':\'' + value + '\','
#  body = body.strip(',') + '}'
#  print body
  http.send_response(200)
  http.send_header("Content-Type", 'text/html')
  http.send_header("Content-Length", len(body))
  http.end_headers()
  http.wfile.write(body)
  

class ReHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):        
 
    def do_GET(self):
      main(self)

def run(handler_class = ReHandler):
    httpd = BaseHTTPServer.HTTPServer((PATH, PORT), handler_class)
    httpd.serve_forever()

if __name__ == "__main__":
    if (len(sys.argv) > 1):
        PORT = int(sys.argv[1])         
    run()
#    main('http://localhost:8999/?o=split&filename=300-240.wmv')
#    main('http://localhost:8999/?size=306x228&crop=306x228x0x0&filename=300-240.wmv&frames=300')