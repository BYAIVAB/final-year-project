@echo off
echo Starting Medical RAG Chatbot with Booking...
echo.

REM Check if MongoDB is running
echo Checking services...

REM Start Backend
echo Starting Backend...
cd backend
start "Backend" cmd /k "python -m app.main"

REM Wait for backend to start
timeout /t 5 /nobreak > nul

REM Start Frontend
echo Starting Frontend...
cd ..\frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo =============================================
echo  Medical RAG Chatbot with Booking Started!
echo =============================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo To test booking, type in chat:
echo   "I need to see a cardiologist"
echo.
echo Make sure MongoDB and Ollama are running!
echo =============================================
pause
