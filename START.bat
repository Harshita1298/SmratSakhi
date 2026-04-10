@echo off
color 0D
echo.
echo  ==========================================
echo    SAKHI BEAUTY PARLOUR APP
echo    Ranjana Ji - Gorakhpur
echo  ==========================================
echo.
echo  [1] Pehli baar ke liye setup ho raha hai...
echo.
cd backend
echo  Backend packages install ho rahe hain...
call npm install
echo.
echo  Database mein data add ho raha hai...
call npm run seed
echo.
echo  Backend start ho raha hai...
start "Sakhi Backend" cmd /k "npm run dev"
echo.
timeout /t 4 /nobreak > nul
cd ../frontend
echo  Frontend packages install ho rahe hain...
call npm install
echo.
echo  Frontend start ho raha hai...
start "Sakhi Frontend" cmd /k "npm run dev"
echo.
timeout /t 3 /nobreak > nul
echo.
echo  ==========================================
echo    APP TAIYAAR HAI!
echo.
echo    Browser mein kholiye:
echo    http://localhost:5173
echo.
echo    ADMIN LOGIN:
echo    Ranjana Ji: 9936657399 / sakhi@2025
echo    Default:    9999999999 / admin123
echo  ==========================================
echo.
start http://localhost:5173
pause
