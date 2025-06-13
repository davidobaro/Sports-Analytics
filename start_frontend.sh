#!/bin/bash

# NBA Analytics - Frontend Startup Script
# This script starts the React development server

echo "🚀 Starting NBA Analytics Frontend..."
echo "=================================="

# Navigate to frontend directory
cd "$(dirname "$0")/frontend" || {
    echo "❌ Error: Could not navigate to frontend directory"
    exit 1
}

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in frontend directory"
    exit 1
fi

echo "🌐 Starting React development server..."
echo "Frontend will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm start
