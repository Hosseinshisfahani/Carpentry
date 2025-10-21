#!/bin/bash

# Django to React Migration - Development Startup Script

echo "🚀 Starting Django to React Migration Development Environment"
echo "=============================================================="

# Check if we're in the right directory
if [ ! -f "carpentary/settings.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "📋 Setup Instructions:"
echo "1. Backend (Django): cd dependencies && python manage.py runserver"
echo "2. Frontend (React): cd frontend && npm run dev"
echo ""
echo "🌐 URLs:"
echo "- Django API: http://localhost:8000/api/"
echo "- React App: http://localhost:5173"
echo ""
echo "📚 API Endpoints:"
echo "- POST /api/auth/register/ - User registration"
echo "- POST /api/auth/login/ - User login"
echo "- GET /api/projects/ - List projects"
echo "- POST /api/projects/ - Create project"
echo ""
echo "✨ Features:"
echo "- RTL support for Persian UI"
echo "- Material-UI components"
echo "- File upload support"
echo "- Protected routes"
echo "- Responsive design"
echo ""
echo "Happy coding! 🎉"
