@echo off
setlocal
:: This is required with cygwin only.
set PATH=%~dp0;%PATH%
set NODE_PATH=%NODE_PATH%;%~dp0..\lib

IF NOT EXIST "build.js" GOTO NOBUILDFILE
call node "build.js" %*
GOTO EXIT

:NOBUILDFILE
echo Can't find build.js in current directory

:EXIT
