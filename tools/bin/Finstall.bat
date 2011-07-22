@echo off

pushd "%~dp0"

:: Install Fzip
rundll32 setupapi.dll,InstallHinfSection DefaultInstall 128 .\Fzip.install.inf

:: Install Fformat
:: rundll32 setupapi.dll,InstallHinfSection DefaultInstall 128 .\Fformat.install.inf

popd

echo.
echo Successfully installed.
echo.
pause
