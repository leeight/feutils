#!/usr/bin/python


import os
import sys
import re
import stat
import time
import mimetypes
import urllib2
import socket
import json
import string
import BaseHTTPServer
import SimpleHTTPServer
import urlparse


MOD_HOME = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
WEBAPP_HOME = os.path.abspath(os.path.join(MOD_HOME, "..", "..", "..", "..", ".."))

PATH = ''
PORT = 8999

JS_PATTERN = re.compile(r'type="text/javascript" src="([^"]+)"')
CSS_PATTERN = re.compile(r"@import\s+'\.\.\/\.\.\/([^']+)'")

os.chdir(WEBAPP_HOME)

def merge_css(path):
    cbcss = []
    bootstrap = open(path).read()
    match = CSS_PATTERN.findall(bootstrap)
    if len(match) == 0:
        return bootstrap
    for css in match:
        cbcss.append(open(css).read())
    return "\n".join(cbcss)

def merge_js(path):
    cbjs = []
    bootstrap = open(path).read()
    match = JS_PATTERN.findall(bootstrap)
    if len(match) == 0:
        return bootstrap
    for js in match:
        cbjs.append(open("%s%s" % (WEBAPP_HOME, js)).read())
    return "\n".join(cbjs)

class ReHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    
    def sendResponseWithOutput(self, response, contentType, body):
        """
        handles both str and unicode types
        """        
        self.send_response(response)
        self.send_header("Content-Type", contentType)
        self.send_header("Content-Length", len(body))
        if response == 301:
            self.send_header("Location", body)
        self.end_headers()
        if response != 301:
            self.wfile.write(body)
 
    def do_GET(self):
        response = 200
        truncate_path = self.path.split('?')[0].split('#')[0]
        file_path = re.sub("^/", "", truncate_path)
        
        if truncate_path.startswith("/assets/js/dn.js"):
            contentType = 'text/javascript; charset=UTF-8'
            body = merge_js("%s%s" % (WEBAPP_HOME, truncate_path))
        elif truncate_path.startswith("/assets/css/dn.css"):
            contentType = 'text/css; charset=UTF-8'
            body = merge_css("%s%s" % (WEBAPP_HOME, truncate_path))
        else:
            response, contentType, body = server_static(file_path, truncate_path)

        self.sendResponseWithOutput(response, contentType, body)

def unicode_str(string, encode):
    if (not isinstance(string, unicode)):
        return unicode(string, encode)
    else:
        return string;

def _path_encode(path):
    sys_encode = sys.getfilesystemencoding()
    return unicode_str(path, 'utf-8').encode(sys_encode)

def unicode_file_name(file_name):
    if (not isinstance(file_name, unicode)):
        return unicode(file_name, sys.getfilesystemencoding())
    else:
        return file_name

def utf8Detect(text):
    """Detect if a string is utf-8 encoding"""
    lastch=0
    begin=0
    BOM=True
    BOMchs=(0xEF, 0xBB, 0xBF)
    good=0
    bad=0
    for char in text:
        ch=ord(char)
        if begin<3:
            BOM=(BOMchs[begin]==ch) and BOM
            begin += 1
            continue
        if (begin==4) and (BOM==True):
            break;
        if (ch & 0xC0) == 0x80:
            if (lastch & 0xC0) == 0xC0:
                good += 1
            elif (lastch &0x80) == 0:
                bad += 1
        elif (lastch & 0xC0) == 0xC0:
            bad += 1

        lastch = ch

    if (((begin == 4) and (BOM == True)) or
        (good >= bad)):
        return True
    else:
        return False

def get_file_encode(file):
    content = open(file).read()
    is_utf8 = utf8Detect(content)
    if is_utf8:
        try:
            unicode(content, 'utf-8')
            return 'utf-8'
        except:
            #todo log
            return 'gbk'
    else:
        return 'gbk'

def file_to_unicode(file):
    return unicode(open(file).read(), get_file_encode(file))

def get_dir_data(cur_dir):
    sys_encode = sys.getfilesystemencoding()
    files = os.listdir(cur_dir.encode(sys_encode))
    
    dir_data = {
        'cur_dir': cur_dir,
        'all_dirs': _get_all_dirs(cur_dir),
        'dirs': [],
        'files': []
    }

    adoc_html_files = set([])

    for afile in files:
        
        if afile[0] == '.':
            continue
            
        file_path = os.path.join(cur_dir.encode(sys_encode), afile)
        
        if (os.path.isdir(file_path)):
            item_num = len(os.listdir(file_path))
            dir_data['dirs'].append({'name':unicode_file_name(afile), 'item_num':item_num})
        else:
            
            size = os.path.getsize(file_path)
            
            mtime = os.path.getmtime(file_path)
            
            modified = mtime
            
            data = {
                'size' : size,
                'modified' : modified,
                'name' : unicode_file_name(afile)
            }
            
            if file_path.split('.')[-1] == 'text':
                file_encode = get_file_encode(file_path)
                file_info = get_file_info(file_path, file_encode)
                data['title'] = file_info['title']
                adoc_html_files.add(afile[:-5] + '.html')
            
            dir_data['files'].append(data)
    
    #remove dup html files
    tmp_files = []
    for afile in dir_data['files']:
        if afile['name'] in adoc_html_files:
            pass
        else:
            tmp_files.append(afile)
    
    dir_data['files'] = tmp_files

    return json.dumps(dir_data)
 
def _get_all_dirs(base_dir):
    all_dirs = []

    for root, dirs, files in os.walk(base_dir): 
        if '.svn' in dirs:
            dirs.remove('.svn')
        
        for d in dirs:
            all_dirs.append(os.path.join(root, d).replace('\\', '/'))
            
    return all_dirs

def list_dir(path):
    sys_encode = sys.getfilesystemencoding()
    cur_dir = unicode_file_name(os.path.dirname(path))
    tpl = string.Template(file_to_unicode(os.path.join(MOD_HOME, 'cfg', 'dir.tpl')))
    dir_data = get_dir_data(cur_dir)
    rel_path = 'http://fe.baidu.com/doc'
    return tpl.substitute(cur_dir=cur_dir, rel_path=rel_path, dir_data=dir_data).encode('utf-8')

def _list_dir(dir_path):
    #path must be a file
    return list_dir(os.path.join(dir_path, 'index.html'))

def server_static(file_path, request_path):
    file_path = _path_encode(urllib2.unquote(file_path))
    print file_path

    if not os.path.exists(file_path):
        return (404, 'text/html', 'no such file, may be your forget add /doc/, for example "/doc/' + file_path + '"')
    
    if os.path.isfile(file_path):
        stat_result = os.stat(file_path)    
        mime_type, encoding = mimetypes.guess_type(file_path)

        file = open(file_path, "rb")
        try:
            return (200, mime_type, file.read())
        finally:
            file.close()
            
    elif os.path.isdir(file_path):
        if request_path.endswith('/'):
            index_file = os.path.join(file_path, 'index.html')
            if os.path.exists(index_file):
                return (200, 'text/html;', open(index_file).read())

            index_text_file = os.path.join(file_path, 'index.text')
            if os.path.exists(index_text_file):
                return (200, 'text/html;', index.build_for_server(index_text_file))
            return (200, 'text/html; charset=UTF8', _list_dir(file_path))
        else:
            return (301, 'text/html', request_path + '/')
    else:
        pass


def run(handler_class = ReHandler):
    try:
        httpd = BaseHTTPServer.HTTPServer((PATH, PORT), handler_class)
        print 'server in http://localhost:' + str(PORT)
        httpd.serve_forever()
    except socket.error:
        print 'may be address already in use'
        print 'you can try another port by use "python local_server.py xxx"'
        sys.exit(1)

if __name__ == "__main__":
    if (len(sys.argv) > 1):
        PORT = int(sys.argv[1])
            
    run()
