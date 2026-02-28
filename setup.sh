#!/bin/bash
# GlowUp Quick Setup Script
echo "🌸 Setting up GlowUp Hairstyle App..."

# Backend Setup
echo ""
echo "📦 Setting up Django backend..."
cd backend
python3 -m venv venv
source venv/bin/activate || source venv/Scripts/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
echo "✅ Backend ready!"

# Instructions for frontend
echo ""
echo "📦 To start the frontend:"
echo "   cd ../frontend"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "🚀 To start the backend server:"
echo "   cd backend && source venv/bin/activate && python manage.py runserver"
echo ""
echo "🌐 App URL: http://localhost:3000"
echo "🔧 API URL: http://localhost:8000"
echo "👨‍💼 Admin:   http://localhost:8000/admin"
