@echo off
setlocal
:: This is required with cygwin only.
PATH=%~dp0;%PATH%

IF NOT EXIST C:\WIN\NUL GOTO NOBUILDFILE
call node "Fbuild.js" %*

:NOBUILDFILE
echo "Can't find Fbuild.js in current directory"
