#!/bin/bash

# Simple startup script for Web Store 449
echo "🚀 Starting Web Store 449..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Kill any existing processes on ports 3000-3003
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000,3001,3002,3003 | xargs kill -9 2>/dev/null || true
pkill -f "nodemon\|vite\|ts-node" 2>/dev/null || true
sleep 2

# Start PostgreSQL if not running
if ! docker ps | grep -q "web-store-449-postgres-1"; then
    echo "🗄️  Starting PostgreSQL..."
    docker compose up -d postgres
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 5
else
    echo "✅ PostgreSQL is already running"
fi

# Start everything
echo "🎉 Starting full development environment..."
pnpm run dev:full
