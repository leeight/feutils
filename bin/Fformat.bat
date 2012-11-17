@echo off
setlocal
:: This is required with cygwin only.
PATH=%~dp0;%PATH%
call python "%~dp0Fformat.py" %*
if errorlevel 0 goto exit
pause

:exit
