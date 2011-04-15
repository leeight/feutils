@echo off
setlocal
:: This is required with cygwin only.
PATH=%~dp0;%PATH%
:: This is required with python module search
PYTHONPATH="%~dp0..\lib\google-closure-linter"
call python "%~dp0..\lib\google-closure-linter\closure_linter\gjslint.py" %*
