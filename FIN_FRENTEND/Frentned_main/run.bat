@echo off
title FINANCE APP START

start "" "C:\xampp\xampp-control.exe"
timeout /t 10

start "" cmd /k "cd /d \"C:\Users\infyz\Desktop\Fast_API_Python\FIN_FRENTEND\Frentned_main\" && java -jar \"sri-balaji-finance-0.0.1-SNAPSHOT.jar\""

timeout /t 5

start "" cmd /k "cd /d \"C:\Users\infyz\Desktop\Fast_API_Python\FIN_FRENTEND\Frentned_main\" && npm run dev"

pause
