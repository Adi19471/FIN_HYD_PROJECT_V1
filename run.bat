@echo off
echo ===============================
echo FULL STACK PROJECT STARTING...
echo ===============================

REM ---- START XAMPP ----
echo Starting XAMPP...
start "" "C:\xampp\xampp-control.exe"

REM ---- WAIT FOR MYSQL ----
echo Waiting for MySQL...
timeout /t 5

REM ---- START SPRING BOOT BACKEND ----
echo Starting Spring Boot Backend...
start cmd /k "cd Spring_Boot_Balaji_FInance/sri-balaji-finance && mvnw.cmd spring-boot:run"

REM ---- WAIT FOR BACKEND ----
timeout /t 5

REM ---- START REACT VITE FRONTEND ----
echo Starting React Frontend...
start cmd /k "cd FIN_FRENTEND/Frentned_main && npm install && npm run dev"

echo ===============================
echo ALL SERVICES STARTED
echo ===============================
pause
