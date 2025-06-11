#!/bin/bash

# NBA Analytics - Server Restart Script
echo "🏀 NBA Analytics Server Restart Script"
echo "======================================"

# Function to kill processes gracefully
kill_processes() {
    echo "🔄 Stopping existing processes..."
    
    # Kill Python processes
    pkill -f "python3 main.py" 2>/dev/null
    pkill -f "uvicorn" 2>/dev/null
    
    # Kill Node/React processes
    pkill -f "react-scripts start" 2>/dev/null  
    pkill -f "node.*react-scripts" 2>/dev/null
    
    # Wait for graceful shutdown
    sleep 3
    
    # Force kill if still running
    echo "🔍 Force killing processes on ports 8000 and 3000..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    
    sleep 2
}

# Call the kill function
kill_processes

# Start backend server
echo "🚀 Starting backend server..."
cd /Users/davidobaro/Documents/Sports-Analytics/backend

# Check if Python3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python3."
    exit 1
fi

# Start backend in background
python3 main.py &
BACKEND_PID=$!
echo "✅ Backend server started with PID: $BACKEND_PID"

# Wait for backend to initialize
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend server is responding on port 8000"
else
    echo "⚠️  Backend server may still be starting up..."
fi

# Start frontend server
echo "🚀 Starting frontend server..."
cd /Users/davidobaro/Documents/Sports-Analytics/frontend

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and npm."
    exit 1
fi

# Start frontend in background
npm start &
FRONTEND_PID=$!
echo "✅ Frontend server started with PID: $FRONTEND_PID"

echo ""
echo "🎉 Both servers are starting up!"
echo "📊 Backend API: http://localhost:8000"
echo "🌐 Frontend App: http://localhost:3000"
echo ""
echo "📝 Process IDs:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "🛑 To stop servers, run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   or use: pkill -f 'python3 main.py' && pkill -f 'react-scripts start'"
echo ""
echo "⏳ Waiting for frontend to compile..."
echo "   This may take 30-60 seconds..."

# Wait and show status
sleep 10
echo ""
echo "🔍 Server Status Check:"

# Check backend
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend: Running and responding"
else
    echo "❌ Backend: Not responding (may still be starting)"
fi

# Check frontend (this is harder to test automatically)
if lsof -i:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Process running on port 3000"
else
    echo "❌ Frontend: Not detected on port 3000"
fi

echo ""
echo "🏀 Ready to test your NBA Analytics app!"
