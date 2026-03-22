@echo off
title Birthday Surprise Runner
color 0D
echo ==========================================
echo    BIRTHDAY SURPRISE WEBSITE RUNNER
echo ==========================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    echo Please install Python from https://www.python.org/
    pause
    exit /b
)

:: Install dependencies
echo [1/3] Installing/Updating dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [WARNING] Dependency installation failed. Trying to run anyway...
)

:: Launch the browser automatically
echo [2/3] Preparing to launch browser...
timeout /t 2 /nobreak >nul
start http://127.0.0.1:5000

:: Run the Flask App
echo [3/3] Starting the Flask server...
echo.
echo ==========================================
echo    WEBSITE IS NOW RUNNING! 
echo    Keep this window open to browse.
echo ==========================================
echo.
python app.py

pause
