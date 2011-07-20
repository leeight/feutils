@echo off
setlocal
:: This is required with cygwin only.
set PATH=%~dp0;%PATH%
:: This is required with python module search
set PYTHONPATH=%~dp0..\lib\google-closure-linter
call python -S "%~dp0..\lib\google-closure-linter\closure_linter\fixjsstyle.py" %*
