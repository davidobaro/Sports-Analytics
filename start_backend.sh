#!/bin/bash

# NBA Analytics Backend Startup Script
# This script starts the FastAPI backend server

echo "🚀 Starting NBA Analytics Backend Server..."
echo "============================================"

# Navigate to the backend directory
cd "$(dirname "$0")/backend"

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: main.py not found in backend directory"
    echo "Please make sure you're running this script from the Sports-Analytics root directory"
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3 to run the backend server"
    exit 1
fi

# Check if required packages are installed
echo "📦 Checking dependencies..."
python3 -c "import fastapi, uvicorn, nba_api" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Some dependencies may be missing. Installing from requirements.txt..."
    if [ -f "../requirements.txt" ]; then
        pip3 install -r ../requirements.txt
    else
        echo "Installing basic dependencies..."
        pip3 install fastapi uvicorn nba-api pandas numpy scikit-learn
    fi
fi

echo ""
echo "🔧 Starting FastAPI server with uvicorn..."
echo "📍 Server will be available at: http://localhost:8000"
echo "📊 API Documentation at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo "============================================"

# Start the backend server
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

echo ""
echo "🛑 Backend server stopped"
