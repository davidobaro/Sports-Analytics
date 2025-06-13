#!/bin/bash

# NBA Analytics - Kill All Processes Script
# This script kills all frontend and backend processes

echo "🛑 NBA Analytics - Killing All Processes..."
echo "============================================="

# Kill React development server (npm start)
echo "📱 Killing React frontend (npm start)..."
pkill -f "npm start" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ React frontend processes killed"
else
    echo "ℹ️  No React frontend processes found"
fi

# Kill Python backend servers
echo "🐍 Killing Python backend servers..."
pkill -f "python3 main.py" 2>/dev/null
pkill -f "python main.py" 2>/dev/null
pkill -f "uvicorn" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Python backend processes killed"
else
    echo "ℹ️  No Python backend processes found"
fi

# Force kill anything on port 3000 (frontend)
echo "🔌 Checking port 3000 (frontend)..."
PORT_3000_PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PORT_3000_PID" ]; then
    echo "🔥 Force killing processes on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    echo "✅ Port 3000 cleared"
else
    echo "✅ Port 3000 is free"
fi

# Force kill anything on port 8000 (backend)
echo "🔌 Checking port 8000 (backend)..."
PORT_8000_PID=$(lsof -ti:8000 2>/dev/null)
if [ ! -z "$PORT_8000_PID" ]; then
    echo "🔥 Force killing processes on port 8000..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    echo "✅ Port 8000 cleared"
else
    echo "✅ Port 8000 is free"
fi

# Kill any remaining Node.js processes related to the project
echo "📦 Killing remaining Node.js processes..."
pkill -f "react-scripts" 2>/dev/null
pkill -f "webpack" 2>/dev/null

# Final verification
echo ""
echo "🔍 Final verification..."
REMAINING_PROCESSES=$(ps aux | grep -E "(npm|node|python|uvicorn)" | grep -E "(Sports-Analytics|main\.py|react-scripts)" | grep -v grep)

if [ ! -z "$REMAINING_PROCESSES" ]; then
    echo "⚠️  Some processes may still be running:"
    echo "$REMAINING_PROCESSES"
else
    echo "✅ All NBA Analytics processes have been terminated"
fi

echo ""
echo "🏁 Process cleanup complete!"
echo "✅ Frontend (port 3000): Available"
echo "✅ Backend (port 8000): Available"
echo ""
echo "You can now restart the servers with:"
echo "  Frontend: cd frontend && npm start"
echo "  Backend:  cd backend && python3 main.py"
