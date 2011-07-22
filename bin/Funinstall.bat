@echo off

pushd "%~dp0"

:: Install Fzip
echo Uninstalling Fzip...
rundll32 setupapi.dll,InstallHinfSection DefaultUnInstall 128 .\Fzip.install.inf

:: Install Fformat
echo Uninstalling Fformat...
:: rundll32 setupapi.dll,InstallHinfSection DefaultUnInstall 128 .\Fformat.install.inf

popd

echo.
echo Successfully uninstalled.
echo.
pause
