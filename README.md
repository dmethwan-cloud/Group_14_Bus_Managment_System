# 🚌 Smart Bus E-Ticketing System

[![Python](https://img.shields.io/badge/Python-3.13.5-blue)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.x-green)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)](https://neon.tech)

A full-stack bus e-ticketing platform developed as a university group project (Group 14).
Passengers can search routes, book seats, and purchase tickets online.
Operators manage buses and routes. Conductors validate tickets. Admins oversee the system.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [System Actors](#system-actors)
- [System Features](#system-features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Run Instructions](#run-instructions)
- [API Endpoints](#api-endpoints)
- [Team Responsibilities](#team-responsibilities)
- [Git Workflow](#git-workflow)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Django 5, Django REST Framework |
| **Frontend** | React 18, Vite |
| **Styling** | Tailwind CSS |
| **Database** | Neon PostgreSQL (cloud) |
| **Authentication** | JWT (djangorestframework-simplejwt) |
| **Email Verification** | 6-Digit OTP via Gmail SMTP |
| **Version Control** | Git + GitHub |

---

## 👥 System Actors

| Actor | Role |
|---|---|
| **System Admin** | Manages users, operators, routes, buses, and system settings |
| **Bus Operator** | Manages buses, routes, seat layouts, and views bookings |
| **Passenger** | Registers, books tickets, downloads tickets, views history |
| **Conductor** | Validates tickets, views assigned bus and passenger list |

---

## ✨ System Features

### Admin
- Add and approve bus operators & conductors
- Manage all users and roles (View status, Delete users)
- Monitor bookings system-wide
- Manage routes and buses
- Send system notifications

### Bus Operator **(Requires Admin Approval)**
- Add / update / delete buses
- Set seat layouts and bus rates
- Assign conductors to buses
- View bookings and passenger lists

### Passenger
- Register securely with 6-Digit Email OTP verification
- Search buses by route
- Select and book seats
- Purchase and download tickets
- Cancel bookings and view history
- Receive email confirmations

### Conductor **(Requires Admin Approval)**
- View assigned bus information
- View passenger list
- Validate and mark tickets as used
- Report issues

---

## 📁 Project Structure

```
Group_14_Bus_Managment_System/
├── .gitignore
├── README.md
│
├── backend/                        # Django backend
│   ├── venv/                       # Python virtual environment (not committed)
│   ├── .env                        # Environment variables (not committed)
│   ├── .env.example                # Environment variable template
│   ├── requirements.txt            # Python dependencies
│   ├── manage.py                   # Django management script
│   │
│   ├── config/                     # Django project settings package
│   │   ├── __init__.py
│   │   ├── settings.py             # All Django settings
│   │   ├── urls.py                 # Root URL configuration
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   └── apps/                       # Django application modules
│       ├── users/                  # Custom Auth, OTP, User management (DINULAKA)
│       ├── common/                 # Shared utilities, permissions, email utilities (DINULAKA)
│       ├── buses/                  # Bus management (teammate placeholder)
│       ├── routes/                 # Route management (teammate placeholder)
│       ├── bookings/               # Booking system (teammate placeholder)
│       ├── tickets/                # Ticket system (teammate placeholder)
│       └── payments/               # Payment system (teammate placeholder)
│
└── frontend/                       # React + Vite frontend
    ├── .env                        # Frontend environment variables
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    │
    └── src/
        ├── main.jsx                # React entry point
        ├── App.jsx                 # Router configuration
        ├── index.css               # Global styles + Tailwind
        │
        ├── api/
        │   └── axiosInstance.js    # Axios with JWT & 401 Bypass interceptor
        │
        ├── utils/
        │   └── auth.js             # Token helpers + role utilities
        │
        ├── components/
        │   └── ProtectedRoute.jsx  # Route guard component
        │
        ├── layouts/                # Dashboard shell layouts
        │   ├── AdminLayout.jsx
        │   ├── OperatorLayout.jsx
        │   ├── PassengerLayout.jsx
        │   └── ConductorLayout.jsx
        │
        └── pages/
            ├── LandingPage.jsx     # Public facing landing template
            ├── auth/
            │   ├── LoginPage.jsx
            │   ├── RegisterPage.jsx
            │   └── VerifyEmailPage.jsx
            └── dashboards/
                ├── AdminDashboard.jsx
                ├── AdminUsers.jsx  # Admin Management Table
                ├── OperatorDashboard.jsx
                ├── PassengerDashboard.jsx
                └── ConductorDashboard.jsx
```

---

## ⚙️ Installation

### Prerequisites

- Python 3.13+
- Node.js 18+
- npm 9+
- Git

---

## 🔧 Backend Setup (Windows)

> [!NOTE] 
> If you are using **PowerShell**, Windows may block Python/Node activation scripts. It is highly recommended to use **Command Prompt** (cmd) to bypass Windows Execution Policies.

```cmd
# 1. Navigate to backend folder
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment (must be using Command Prompt)
venv\Scripts\activate.bat

# 4. Install dependencies
pip install -r requirements.txt

# 5. Connect the Database & Setup Email Variables
copy .env.example .env
# Edit .env and enter the Neon DB URL and Gmail App Password!

# 6. Apply database schema
python manage.py migrate

# 7. Start development server
python manage.py runserver
```

---

## 🎨 Frontend Setup (Windows)

```cmd
# 1. Navigate to frontend folder in a new Command Prompt terminal
cd frontend

# 2. Install dependencies
npm install

# 3. Copy environment file
copy .env.example .env

# 4. Start development server
npm run dev
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | True for development |
| `DATABASE_URL` | Neon PostgreSQL connection string (Provided by DB admin) |
| `EMAIL_HOST_USER` | Gmail address for sending OTP emails |
| `EMAIL_HOST_PASSWORD` | Gmail App Password (Required for OTPs to send properly) |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (Default http://localhost:8000/api) |

---

## 🚀 Run Instructions (Daily Use)

To start the project daily, open two generic Command Prompts inside VS Code:

**Terminal 1 — Backend:**
```cmd
cd backend
venv\Scripts\activate.bat
python manage.py runserver
```

**Terminal 2 — Frontend:**
```cmd
cd frontend
npm run dev
```

- **Landing Page:** http://localhost:5173
- **Test Admin Login:** `admin@smartbus.com` | `adminpass123`

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register/` | Register new user, generate 6-Digit OTP | No |
| POST | `/api/auth/verify-otp/` | Submits the OTP code and activates the account | No |
| POST | `/api/auth/login/` | Login, get JWT tokens (Rejects unverified or inactive users) | No |
| POST | `/api/auth/token/refresh/` | Refresh access token | No |
| GET | `/api/auth/me/` | Get current user profile | JWT |
| POST | `/api/auth/logout/` | Blacklist refresh token | JWT |
| GET | `/api/auth/users/` | (Admin) Get list of all users | JWT |
| PATCH | `/api/auth/users/<id>/`| (Admin) Approve a pending Operator/Conductor | JWT |
| DELETE| `/api/auth/users/<id>/`| (Admin) Delete a user from the system | JWT |

---

## 👨‍💻 Team Responsibilities

| Member | Module |
|---|---|
| **Dinulaka (You)** | Project foundation, Custom Auth, OTP flow, User management, Nav Dashboards |
| **Teammate 2** | Bus management, Seat layout |
| **Teammate 3** | Route management |
| **Teammate 4** | Booking system, Ticket system |
| **Teammate 5** | Payment system, Ticket validation |

---

## 🌿 Git Workflow

1. Always work on a feature branch (`git checkout -b feature/name`)
2. Make your updates in your specific application folders.
3. Commit often with clean messages (`git commit -m "feat: added basic bus model"`)
4. Push and create a Pull Request to merge your work back into the combined repository.

---

## 📜 License

This project is developed for academic purposes as part of a university group project. *Group 14 — Smart Bus E-Ticketing System (2026).*
