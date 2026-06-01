@echo off
setlocal

cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:4173"
  py -m http.server 4173
  goto :end
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:4173"
  python -m http.server 4173
  goto :end
)

echo Python is required to run the local web server.
echo Install Python, then run START_GAME.bat again.
pause

:end
endlocal
