@echo off
setlocal
:: This is required with cygwin only.
PATH=%~dp0;%PATH%
set PYTHONPATH=%~dp0..\lib\landslide\docutils-0.8.1-py2.7.egg
set PYTHONPATH=%PYTHONPATH%;%~dp0..\lib\landslide\Jinja2-2.6-py2.7.egg
set PYTHONPATH=%PYTHONPATH%;%~dp0..\lib\landslide\Markdown-2.0.3-py2.7.egg
set PYTHONPATH=%PYTHONPATH%;%~dp0..\lib\landslide\Pygments-1.4.egg
set PYTHONPATH=%PYTHONPATH%;%~dp0..\lib\landslide\landslide-1.0.0-py2.7.egg
:: call python -S -c "import sys;from pprint import pprint as pp;pp(sys.path)"
call python -S "%~dp0..\lib\landslide\landslide-1.0.0-py2.7.egg\landslide\main.py" %*
