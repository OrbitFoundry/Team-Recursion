# Staging & Production Deployment Guide

This guide details how to set up, run, and deploy the **Team Recursion Authentication Template System** locally for development and staging, as well as deploy to production environments.

---

## 🏗 System Architecture Overview

The system consists of two main modules:

1. **Backend API (`/backend`)**: Built with Node.js, Express, TypeScript, Passport.js, JWT, Bcrypt, and Mongoose.
2. **Frontend App (`/frontend`)**: Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, Axios, and Tailwind CSS.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB** *(Optional)*: The backend features an **automatic in-memory MongoDB fallback** for instant local staging without needing a local MongoDB daemon installed!

---

### 2. Backend Setup & Configuration

Navigate to the `backend` directory:

```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create or verify `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/auth-app
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars_long
SESSION_SECRET=your_super_secret_session_key_32_chars_long
FRONTEND_URL=http://localhost:3000

# Optional Email Configuration (Password Reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@yourapp.com

# Optional Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

#### Build & Run Backend
```bash
# Build TypeScript
npm run build

# Start Development Server with hot reloading
npm run dev
```

> **Note**: If your `MONGODB_URI` connection is unreachable, the system will automatically initialize an **in-memory MongoDB instance** so you can develop immediately!

---

### 3. Frontend Setup & Configuration

Navigate to the `frontend` directory:

```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create or verify `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional Google OAuth (leave empty to use standard email/password)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

#### Build & Run Frontend
```bash
# Verify TypeScript build
npm run build

# Start Next.js Development Server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🧪 Core API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server and Database Health Status | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user session | Yes (`Bearer Token`) |
| `PUT` | `/api/auth/me` | Update user profile (Name/Email) | Yes (`Bearer Token`) |
| `POST` | `/api/auth/forgot-password` | Request password reset token | No |
| `POST` | `/api/auth/reset-password` | Complete password reset | No |
| `GET` | `/api/auth/google` | Google OAuth Login | No |

---

## 🌐 Production Deployment Steps

### 1. Database (MongoDB Atlas)
1. Provision a MongoDB Cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User and whitelist `0.0.0.0/0` (or your host IP).
3. Copy your connection string into the `MONGODB_URI` environment variable.

### 2. Backend Deployment (e.g. Render / Heroku / Railway)
- **Build Command**: `npm run build`
- **Start Command**: `npm start` (Runs `node dist/index.js`)
- Set environment variables (`NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `PORT`).

### 3. Frontend Deployment (e.g. Vercel / Netlify)
- **Build Command**: `npm run build`
- Set `NEXT_PUBLIC_API_URL` to your production backend URL (e.g. `https://api.yourdomain.com`).
