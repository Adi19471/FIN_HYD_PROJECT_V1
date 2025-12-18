@echo off
title FINANCE APP START
color 0A

REM ================================
REM  SET APP DIRECTORY
REM ================================
set APP_DIR=%~dp0
set APP_DIR=%APP_DIR:~0,-1%

cls
echo ======================================
echo        SRI BALAJI FINANCE APP
echo ======================================
echo.
echo Working Directory:
echo %APP_DIR%
echo.

REM ================================
REM  START XAMPP
REM ================================
echo [1/3] Starting XAMPP...
start "" "C:\xampp\xampp-control.exe"

REM Short delay only
timeout /t 3 >nul

REM ================================
REM  START BACKEND (SPRING BOOT)
REM ================================
echo [2/3] Starting Backend Service...
start "FINANCE-BACKEND" cmd /k ^
"cd /d \"%APP_DIR%\" && java -jar sri-balaji-finance-0.0.1-SNAPSHOT.jar"

REM Very small delay
timeout /t 2 >nul

REM ================================
REM  START FRONTEND (NPM)
REM ================================
echo [3/3] Starting Frontend (Vite / React)...
start "FINANCE-FRONTEND" cmd /k ^
"cd /d \"%APP_DIR%\" && npm run dev"

echo.
echo ======================================
echo  ALL SERVICES STARTED SUCCESSFULLY
echo ======================================
echo.
pause
