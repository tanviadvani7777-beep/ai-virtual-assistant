@echo off
title AI Assistant - Frontend
cd /d "%~dp0frontend"
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting Frontend server on port 5173...
npm.cmd run dev -- --port 5173
pause
