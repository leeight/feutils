@echo off
setlocal
:: This is required with cygwin only.
PATH=%~dp0;%PATH%
call python "%~dp0..\..\tools\lib\calcdeps.py" -o deps -p . -p ..\test\app --output_file=deps.js
