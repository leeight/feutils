@echo off
setlocal
:: This is required with cygwin only.
set PATH=%~dp0;%PATH%
:: This is required with python module search
set NODE_PATH=%~dp0..\lib\libproxy\node_modules
call node %*
