#!/bin/bash

# Full development setup script
echo "🚀 Setting up Web Store 449 development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed and running
print_status "Checking Docker..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi
print_success "Docker is running"

# Check if pnpm is installed
print_status "Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi
print_success "pnpm is available"

# Start PostgreSQL container
print_status "Starting PostgreSQL container..."
if docker ps | grep -q "web-store-449-postgres-1"; then
    print_success "PostgreSQL container is already running"
else
    docker compose up -d postgres
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 5
    
    # Wait for PostgreSQL to be ready
    until docker exec web-store-449-postgres-1 pg_isready -U webstore_user -d webstore_449 2>/dev/null; do
        print_status "Waiting for PostgreSQL to be ready..."
        sleep 2
    done
    print_success "PostgreSQL is ready!"
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
pnpm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
pnpm install

# Build backend
print_status "Building backend..."
pnpm run build

# Run database migrations
print_status "Running database migrations..."
pnpm run db:migrate

cd ..

print_success "🎉 Development environment is ready!"
print_status "You can now run:"
print_status "  pnpm run dev:full  - Start everything (database + backend + frontend)"
print_status "  pnpm run dev       - Start only frontend"
print_status "  pnpm run db:start  - Start only database"
print_status "  pnpm run backend:dev - Start only backend"
