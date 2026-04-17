# User Management System (MERN, JavaScript)

MERN app with **cookie-based JWT auth** and **RBAC** (Admin/Manager/User).

## Tech stack
- **Frontend**: React (Vite) + React Router + Axios (JavaScript)
- **Backend**: Node.js + Express (JavaScript)
- **Database**: MongoDB

## Prerequisites
- Node.js (18+ recommended)
- MongoDB running locally

## Setup

### 1) Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set `JWT_SECRET`.

Install and run:

```bash
npm install
npm run seed
npm run dev
```

Backend runs at `http://localhost:5001`.

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Demo credentials (seeded)
Running `npm run seed` in `backend/` creates/updates these users:
- **Admin**: `admin@example.com` / `Password@123`
- **Manager**: `manager@example.com` / `Password@123`
- **User**: `user@example.com` / `Password@123`

## Roles & permissions (RBAC)
- **Admin**: full user management (create, edit, change role, activate/deactivate)
- **Manager**: view users; update **non-admin** user `name/status` (no role/email changes)
- **User**: can view/update their own profile only

## API (high level)
- **Auth**: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- **Users**: `GET /api/users`, `GET /api/users/:id`, `POST /api/users`, `PATCH /api/users/:id`, `PATCH /api/users/:id/status`, `DELETE /api/users/:id`
- **Profile**: `GET /api/profile`, `PATCH /api/profile`

## Notes
- JWT is stored in an **httpOnly cookie** (frontend uses `withCredentials: true`).
- MongoDB default URI is `mongodb://localhost:27017/user_management` (override via `MONGODB_URI`).
- Admin UI supports creating users (optional password). If password is omitted, the API returns `generatedPassword` which is shown once in the UI.
- User details include basic audit fields (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`).
- Hard delete (`DELETE /api/users/:id`) is **admin-only** and blocks deleting yourself and deleting the last active admin.

