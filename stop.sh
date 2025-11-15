#!/bin/bash

# Stop script for Web Store 449
echo "🛑 Stopping Web Store 449..."

# Kill all development processes
echo "🧹 Stopping all development processes..."
lsof -ti:3000,3001,3002,3003 | xargs kill -9 2>/dev/null || true
pkill -f "nodemon\|vite\|ts-node" 2>/dev/null || true

# Stop Docker containers
echo "🐳 Stopping Docker containers..."
docker compose down

echo "✅ All services stopped!"
