#!/bin/bash

# Database setup script
echo "🗄️  Setting up PostgreSQL database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if PostgreSQL container is running
if ! docker ps | grep -q "web-store-449-postgres-1"; then
    echo "🚀 Starting PostgreSQL container..."
    docker compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 5
    
    # Test connection
    until docker exec web-store-449-postgres-1 pg_isready -U webstore_user -d webstore_449; do
        echo "⏳ Waiting for PostgreSQL..."
        sleep 2
    done
    
    echo "✅ PostgreSQL is ready!"
else
    echo "✅ PostgreSQL container is already running"
fi

echo "🎉 Database setup complete!"
