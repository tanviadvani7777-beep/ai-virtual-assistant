@echo off
title AI Assistant - Backend
cd /d "%~dp0backend"
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting Backend server on port 8000...
node index.js
pause
