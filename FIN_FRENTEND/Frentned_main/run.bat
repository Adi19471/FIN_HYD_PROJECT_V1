@echo off
title FINANCE APP START
color 0A

REM ================================
REM  SET ROOT DIRECTORY
REM ================================
set ROOT_DIR=%~dp0
set ROOT_DIR=%ROOT_DIR:~0,-1%

set BACKEND_DIR=%ROOT_DIR%
set FRONTEND_DIR=%ROOT_DIR%\FIN_FRENTEND\Frentned_main

cls
echo ======================================
echo        SRI BALAJI FINANCE APP
echo ======================================
echo.
echo Backend Dir:
echo %BACKEND_DIR%
echo Frontend Dir:
echo %FRONTEND_DIR%
echo.

REM ================================
REM  START XAMPP
REM ================================
echo [1/3] Starting XAMPP...
start "" "C:\xampp\xampp-control.exe"

timeout /t 3 >nul

REM ================================
REM  START BACKEND (SPRING BOOT)
REM ================================
echo [2/3] Starting Backend Service...
start "FINANCE-BACKEND" cmd /k ^
"cd /d \"%BACKEND_DIR%\" && java -jar sri-balaji-finance-0.0.1-SNAPSHOT.jar"

timeout /t 2 >nul

REM ================================
REM  START FRONTEND (VITE / REACT)
REM ================================
echo [3/3] Starting Frontend...
start "FINANCE-FRONTEND" cmd /k ^
"cd /d \"%FRONTEND_DIR%\" && npm run dev"

echo.
echo ======================================
echo  ALL SERVICES STARTED SUCCESSFULLY
echo ======================================
echo.
pause