#!/bin/bash

# Vuets Platform Setup Script
echo "🚀 Setting up Vuets Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    print_warning "MongoDB is not running. Please start MongoDB first."
    print_info "You can start MongoDB with: mongod"
    read -p "Do you want to continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Setup Backend
print_info "Setting up backend..."
cd backend

# Install backend dependencies
print_info "Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating .env file..."
    cp env.example .env
    print_status ".env file created"
else
    print_info ".env file already exists"
fi

# Seed database
print_info "Seeding database with default users..."
npm run seed
if [ $? -eq 0 ]; then
    print_status "Database seeded successfully"
else
    print_warning "Database seeding failed, but continuing..."
fi

# Start backend server in background
print_info "Starting backend server..."
npm run dev &
BACKEND_PID=$!
print_status "Backend server started (PID: $BACKEND_PID)"

# Wait a moment for server to start
sleep 3

# Go back to root directory
cd ..

# Setup Frontend
print_info "Setting up frontend..."

# Install frontend dependencies
print_info "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Build frontend
print_info "Building frontend..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Frontend built successfully"
else
    print_warning "Frontend build failed, but continuing..."
fi

# Final status
echo
print_status "Setup completed successfully!"
echo
print_info "Backend server is running on: http://localhost:3000"
print_info "Frontend will be available on: http://localhost:5173"
echo
print_info "Default login credentials:"
echo "  Admin: admin@anihan.com / admin123"
echo "  Vendor: vendor@anihan.com / vendor123"
echo "  User: user@anihan.com / user123"
echo
print_info "To start the frontend development server, run:"
echo "  npm run dev"
echo
print_info "To stop the backend server, run:"
echo "  kill $BACKEND_PID"
echo
print_status "Happy coding! 🎉"
