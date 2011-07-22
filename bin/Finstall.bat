@echo off

pushd "%~dp0"

:: Install Fzip
echo Installing Fzip...
rundll32 setupapi.dll,InstallHinfSection DefaultInstall 128 .\Fzip.install.inf

:: Install Fformat
echo Installing Fformat...
rundll32 setupapi.dll,InstallHinfSection DefaultInstall 128 .\Fformat.install.inf

popd

echo.
echo Successfully installed.
echo.
pause
