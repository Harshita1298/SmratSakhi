@echo off
echo.
echo ===================================
echo   SAKHI BEAUTY PARLOUR APP
echo   Ranjana Ji - Gorakhpur
echo ===================================
echo.
echo Step 1: Backend shuru ho raha hai...
cd backend
start cmd /k "npm install && npm run seed && npm run dev"
timeout /t 5 /nobreak > nul
echo.
echo Step 2: Frontend shuru ho raha hai...
cd ../frontend
start cmd /k "npm install && npm run dev"
echo.
echo ===================================
echo   App taiyaar hai!
echo   Browser mein kholiye:
echo   http://localhost:5173
echo.
echo   Admin Login:
echo   Phone: 9999999999
echo   Password: admin123
echo ===================================
pause
