@echo off
setlocal
:: This is required with cygwin only.
set PATH=%~dp0;%PATH%
:: This is required with python module search
set NODE_PATH=%~dp0..\lib\libproxy\node_modules
SET /A ARGS_COUNT=0
FOR %%A in (%*) DO SET /A ARGS_COUNT+=1
IF %ARGS_COUNT%==0 GOTO :help
call node %*
GOTO :exit

:help
echo Usage: Fserver server.js [options]

:exit

