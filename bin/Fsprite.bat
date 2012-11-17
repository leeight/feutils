@echo off
setlocal
:: This is required with cygwin only.
set PATH=%~dp0;%PATH%
:: This is required with python module search
set PYTHONPATH=%~dp0..\lib\spritemapper
call python -S "%~dp0..\lib\spritemapper\spritecss\main.py" %*
