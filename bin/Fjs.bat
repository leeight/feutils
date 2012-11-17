@echo off
setlocal
:: This is required with cygwin only.
PATH=%~dp0;%PATH%
call java -jar "%~dp0..\lib\js.jar" %*
