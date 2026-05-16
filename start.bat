@echo off
title Home Nurse Care System - Startup
color 0A

echo ==========================================
echo   Home Nurse Care System - Auto Startup
echo ==========================================
echo.

echo [1/4] Installing backend dependencies...
cd /d "%~dp0backend"
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Seeding database...
python seed.py
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Seed may have failed, continuing...
)

echo.
echo [3/4] Starting backend server...
start "Flask Backend" cmd /k "cd /d %~dp0backend && python app.py"

echo.
echo [4/4] Installing frontend and starting dev server...
cd /d "%~dp0frontend"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   Starting Frontend Dev Server...
echo   Open http://localhost:5173 in browser
echo ==========================================
echo.
call npm run dev
pause
