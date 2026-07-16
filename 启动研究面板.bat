@echo off
rem Start local research dashboard (serves project root on port 8737)
cd /d "%~dp0"
start "" http://localhost:8737/dashboard/
python -m http.server 8737
