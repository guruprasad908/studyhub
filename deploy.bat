@echo off
title StudyHub Deployment

echo 🚀 Starting StudyHub Deployment Process
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b %errorlevel%
)

REM Build the application
echo 🏗️ Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Check the error messages above.
    pause
    exit /b %errorlevel%
)

echo ✅ Build successful!
echo.
echo ✅ Deployment preparation complete!
echo.
echo Next steps:
echo 1. If deploying to Vercel:
echo    - Push to GitHub and connect to Vercel
echo    - Set environment variables in Vercel dashboard
echo.
echo 2. If deploying manually:
echo    - Run 'npm start' to start the production server
echo    - Make sure environment variables are set
echo.
echo 📄 Check DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause