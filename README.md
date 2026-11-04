# 🎓 EventEase – Smart Campus Event Discovery & Registration Platform

A full-stack **MERN** web application for colleges to manage events and student registrations — built with a clean **Black & White monochromatic** design.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Git

---

## 1️⃣ MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free account
2. Create a **Free M0 cluster**
3. Under **Database Access** → Add user: `eventease` / `eventease123`
4. Under **Network Access** → Add IP: `0.0.0.0/0` (allow all)
5. Click **Connect** → **Drivers** → Copy the connection string

It looks like:
```
mongodb+srv://eventease:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Replace `<password>` with your password and paste it into `backend/.env`.

---

## 2️⃣ Backend Setup

```bash
cd d:\EventEase\backend

# 1. Open .env and replace MONGO_URI with your Atlas connection string
notepad .env

# 2. Seed the database (creates admin + 7 sample events)
node seed.js

# 3. Start the backend server
npm run dev
```

Backend runs at: **http://localhost:5000**

---

## 3️⃣ Frontend Setup

```bash
cd d:\EventEase\frontend

# Start the frontend dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@eventease.com | admin123 |
| **Student** | rahul@student.edu | student123 |

---

## 📁 Project Structure

```
EventEase/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── middleware/auth.js      # JWT + role guard
│   ├── models/
│   │   ├── User.js             # Student/Admin model
│   │   ├── Event.js            # Event model (auto-status)
│   │   └── Registration.js     # Registration model
│   ├── controllers/            # Business logic
│   ├── routes/                 # API routes
│   ├── seed.js                 # Demo data seeder
│   ├── server.js               # Express entry point
│   └── .env                    # Environment config
│
└── frontend/
    └── src/
        ├── api/axios.js         # Axios + interceptors
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── EventCard.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── StudentDashboard.jsx
            ├── EventDetails.jsx
            ├── MyRegistrations.jsx
            ├── AdminDashboard.jsx
            ├── AdminEvents.jsx
            └── AdminEventForm.jsx
```

---

## 🌐 API Reference

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register student |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Events
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/events` | Get all events (filter by category, search, status) | Public |
| GET | `/api/events/:id` | Get event details | Public |
| POST | `/api/events` | Create event | Admin |
| PUT | `/api/events/:id` | Update event | Admin |
| DELETE | `/api/events/:id` | Delete event | Admin |

### Registrations
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/registrations` | Register for event | Student |
| GET | `/api/registrations/my` | My registrations | Student |
| DELETE | `/api/registrations/:id` | Cancel registration | Student |
| GET | `/api/registrations/event/:id` | Get all participants | Admin |

---

## ✨ Features

### Student
- 🔍 Search + filter events by category
- 📅 View full event details (date, time, venue, eligibility)
- ✅ Register for events with one click
- ⚠️ **Smart schedule conflict detection** – warns if events overlap
- 💺 **Live seat availability bar**
- 🚫 **Duplicate registration prevention**
- 📋 View and cancel registrations in My Registrations

### Admin
- ➕ Create, edit, delete events
- 👥 View registered participants per event
- 📊 Stats dashboard (total, upcoming, full, completed)
- 🔒 Set registration deadlines and seat limits
- 📈 Monitor registration counts live

---

## 🎨 Design

- **Theme**: Monochromatic Black & White
- **Primary**: `#000000` | **Background**: `#fafafa`
- **Font**: Inter (Google Fonts)
- **Components**: Clean cards, pill badges, progress bars

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Toast | react-hot-toast |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Password | bcryptjs |
| CORS | cors middleware |

