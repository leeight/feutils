@echo off
setlocal
:: This is required with cygwin only.
PATH=%~dp0;%PATH%
NODE_PATH=%NODE_PATH%;%~dp0..\lib

IF NOT EXIST C:\WIN\NUL GOTO NOBUILDFILE
call node "build.js" %*

:NOBUILDFILE
echo Can't find build.js in current directory
