@echo off
setlocal
:: This is required with cygwin only.
PATH=%~dp0;%PATH%
call node "%~dp0..\..\..\..\tools\node_modules\less\bin\lessc" %*
