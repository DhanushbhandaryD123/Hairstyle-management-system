# 💇 GlowUp — Hairstyle & Spa Booking System

A full-stack hairstyle management and appointment booking platform built with **Django REST Framework** + **React**.

---

## 🌟 Features

- **User Auth** — Register, Login, Token-based authentication
- **Browse Hairstyles** — Filter by category (Short, Medium, Long, Curly, Color, Special Occasion)
- **Find Nearby Salons & Spas** — Uses browser geolocation to find salons near you, sorted by distance or rating
- **Schedule Appointments** — Pick a date, choose a time slot, add notes
- **Manage Bookings** — View all appointments, cancel upcoming ones
- **Responsive, luxurious UI** — Warm cream & rose design system with Playfair Display typography

---

## 🗂️ Project Structure

```
hairstyle-app/
├── backend/               # Django REST API
│   ├── hairstyle_app/     # Django project settings & URLs
│   ├── api/               # Main app: models, views, serializers, urls
│   │   ├── models.py      # UserProfile, Hairstyle, Salon, Appointment
│   │   ├── views.py       # Auth, CRUD API views
│   │   ├── serializers.py # DRF serializers with distance calculation
│   │   ├── admin.py       # Admin panel registrations
│   │   └── management/commands/seed_data.py  # Sample data seeder
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/              # React + Vite
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx    # Public home page
    │   │   ├── LoginPage.jsx      # Sign in
    │   │   ├── RegisterPage.jsx   # Create account
    │   │   ├── HairstylePage.jsx  # Browse & select hairstyles
    │   │   ├── SalonPage.jsx      # Find nearby salons
    │   │   ├── SchedulePage.jsx   # Pick date & time
    │   │   └── AppointmentsPage.jsx  # My bookings
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── api.js          # API service layer
    │   ├── AuthContext.jsx # React auth state
    │   ├── App.jsx         # Router & protected routes
    │   └── index.css       # Design tokens & animations
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Setup & Installation

### Backend (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed sample data (hairstyles + salons)
python manage.py seed_data

# Create superuser (optional, for admin panel)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Django API will be available at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

---

### Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

React app will be available at: `http://localhost:3000`

> The Vite dev server is configured to proxy `/api/*` requests to Django on port 8000.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/` | Register new user | No |
| POST | `/api/auth/login/` | Login & get token | No |
| POST | `/api/auth/logout/` | Logout | Yes |
| GET | `/api/auth/profile/` | Get current user | Yes |
| GET | `/api/categories/` | List hairstyle categories | No |
| GET | `/api/hairstyles/` | List hairstyles (filter by `?category=id`) | No |
| GET | `/api/hairstyles/{id}/` | Get hairstyle detail | No |
| GET | `/api/salons/` | List salons (filter `?hairstyle=id&lat=x&lng=y`) | No |
| GET | `/api/appointments/` | List user's appointments | Yes |
| POST | `/api/appointments/` | Create appointment | Yes |
| PATCH | `/api/appointments/{id}/` | Update/cancel appointment | Yes |

---

## 🗺️ User Flow

```
Landing Page
    ↓
Register / Login
    ↓
Browse Hairstyles (filter by category, search)
    ↓
Find Nearby Salons (sorted by distance/rating using geolocation)
    ↓
Schedule Appointment (pick date + time slot)
    ↓
Confirmation → My Bookings
```

---

## 🎨 Design System

- **Typography**: Playfair Display (display) + DM Sans (body)
- **Colors**: Cream `#FAF7F2` · Rose `#C97D6E` · Espresso `#2C1810` · Sage `#8B9E7E`
- **UI Style**: Luxury editorial — warm, refined, spa-inspired

---

## 🔧 Environment Notes

- The frontend falls back to mock data if the backend isn't running
- Geolocation requires HTTPS in production (or localhost in development)
- For production, change `SECRET_KEY`, set `DEBUG=False`, configure a proper database
