@echo off
setlocal
:: This is required with cygwin only.
PATH=%~dp0;%PATH%
call python "%~dp0..\..\tools\lib\calcdeps.py" -o deps -p src -p externs\sdcfe\src\main\app --output_file=src\deps.js
