# 🏥 Home Nurse Care System

A full-stack healthcare web application connecting patients with qualified home nurses. Built with **React.js** frontend and **Python Flask** REST API backend with **SQLite** database.

## Features

### Patient Portal
- 🔍 Search and filter nurses by specialization, availability, and name
- 📅 Book appointments with preferred date, time, and duration
- 💳 Process payments for completed bookings
- ⭐ Rate and review nurses after service
- 📋 Track booking history and payment records

### Nurse Portal
- 📊 Dashboard with pending requests and earnings overview
- ✅ Accept or reject booking requests
- 📅 Manage schedule and appointments
- 👤 Update professional profile and availability

### Admin Portal
- 📈 System-wide statistics and analytics
- 👥 Manage all users (patients, nurses)
- 📊 Revenue reports and booking breakdowns

---

## Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Frontend | React 18, Vite, Axios, React Router 6 |
| Backend  | Python Flask, Flask-JWT-Extended, Flask-SQLAlchemy |
| Database | SQLite                   |
| Styling  | Vanilla CSS (Custom Design System) |
| Font     | Inter (Google Fonts)     |

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python seed.py          # Populate with sample data
python app.py           # Starts on http://127.0.0.1:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev             # Starts on http://localhost:5173
```

### 3. Demo Credentials

| Role    | Email                | Password   |
|---------|----------------------|------------|
| Admin   | admin@homenurse.com  | admin123   |
| Nurse   | sarah@homenurse.com  | nurse123   |
| Patient | omar@patient.com     | patient123 |

---

## Project Structure

```
home-nurse-care-system/
├── backend/
│   ├── app.py                  # Flask entry point
│   ├── config.py               # DB, JWT, CORS config
│   ├── seed.py                 # Sample data seeder
│   ├── requirements.txt
│   ├── models/                 # SQLAlchemy models
│   ├── controllers/            # API route blueprints
│   └── utils/                  # Auth decorators
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx            # React entry
│       ├── App.jsx             # Router + layouts
│       ├── index.css           # Design system
│       ├── api/axios.js        # HTTP client
│       ├── context/AuthContext.jsx
│       ├── components/         # Reusable UI
│       └── pages/              # Route pages
└── README.md
```

## API Endpoints

| Method | Endpoint                    | Description            |
|--------|----------------------------|------------------------|
| POST   | /api/auth/register          | Register user          |
| POST   | /api/auth/login             | Login & get JWT        |
| GET    | /api/auth/me                | Get current user       |
| GET    | /api/nurses                 | List/search nurses     |
| GET    | /api/nurses/:id             | Get nurse profile      |
| POST   | /api/bookings               | Create booking         |
| GET    | /api/bookings               | List bookings          |
| PUT    | /api/bookings/:id/status    | Update booking status  |
| POST   | /api/payments               | Process payment        |
| GET    | /api/payments               | Payment history        |
| POST   | /api/reviews                | Submit review          |
| GET    | /api/admin/stats            | System statistics      |
| GET    | /api/admin/users            | List all users         |
