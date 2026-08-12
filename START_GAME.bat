@echo off
setlocal

cd /d "%~dp0"
set "PORT=4178"
set "BIND_ADDRESS=0.0.0.0"

where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:%PORT%"
  py -m http.server %PORT% --bind %BIND_ADDRESS%
  goto :end
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:%PORT%"
  python -m http.server %PORT% --bind %BIND_ADDRESS%
  goto :end
)

echo Python is required to run the local web server.
echo Install Python, then run START_GAME.bat again.
pause

:end
endlocal
