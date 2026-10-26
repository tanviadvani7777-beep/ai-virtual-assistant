@echo off
title AI Virtual Assistant Launcher
echo ========================================================
echo        Starting AI Virtual Assistant (MERN Stack)
echo ========================================================
echo.

set "ROOT=%~dp0"

echo [1/2] Launching Backend on Port 8000...
start "AI Assistant - Backend" "%ROOT%run-backend.bat"

rem Wait 3 seconds
ping 127.0.0.1 -n 4 >nul

echo [2/2] Launching Frontend on Port 5173...
start "AI Assistant - Frontend" "%ROOT%run-frontend.bat"

rem Wait 3 seconds
ping 127.0.0.1 -n 4 >nul

echo Opening browser...
start http://localhost:5173

echo.
echo ========================================================
echo Both Backend and Frontend are running in separate windows!
echo If your browser did not open automatically, visit:
echo http://localhost:5173
echo ========================================================
echo.
