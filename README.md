# WarrantyKeep

## Overview

WarrantyKeep keeps product warranties and receipt links in one place, so purchase records are easier to find when coverage matters. It calculates expiration dates, shows active and expired coverage, and gives administrators an overview of accounts and warranties.

## Features

- Register, sign in, and manage your own warranties with optional HTTPS receipt links.
- View coverage summaries, upcoming expirations, and searchable history with status filters and eight-row pagination.
- Admin dashboards show workspace totals, monthly expirations, and the accounts with the most warranties.
- Admins can review other accounts' warranties, delete warranties, and delete regular users together with their warranties.
- Responsive Tailwind UI with light/dark themes and keyboard-accessible tables and forms.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express, TypeScript, Helmet, express-rate-limit |
| Database | PostgreSQL, `pg`, raw parameterized SQL, node-pg-migrate |
| Authentication | bcryptjs passwords, 30-minute JWTs in localStorage, backend RBAC and ownership checks |
| Deployment | Vercel frontend; Render API; Neon PostgreSQL through `DATABASE_URL` |

## Installation and Local Setup

Prerequisites: Node.js 24.x with npm, Git, and PostgreSQL 13+ locally or in Neon. A local database requires the `createdb` client command and a role allowed to create the database. Neon development uses an existing database on a separate development branch.

```sh
git clone https://github.com/dotjsonn/WarrantyKeep.git
cd WarrantyKeep
npm ci --prefix backend
npm ci --prefix frontend
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env` before continuing:

| Variable | Local value/purpose |
| --- | --- |
| `DATABASE_URL` | Your local PostgreSQL URL, or a direct Neon URL for a development database with `sslmode=verify-full` |
| `JWT_SECRET` | A random secret of at least 32 bytes; generate one with `openssl rand -base64 48` |
| `NODE_ENV` | `development` |
| `FRONTEND_ORIGIN` | `http://localhost:5173` |
| `PORT` | `3000` |

Leave frontend `VITE_API_BASE_URL` blank locally. Vite proxies `/api` to the backend. Never put signing keys or database credentials in frontend variables.

For local PostgreSQL, create the database using your PostgreSQL role:

```sh
createdb -h localhost -p 5432 -U YOUR_DB_USER warrantykeep
```

Skip `createdb` when using an existing Neon database. Apply the existing SQL migrations using a direct connection:

```sh
cd backend
npm run db:migrate
```

Optional: replace **all** `ADMIN_*`, `USER1_*`, and `USER2_*` seed values in `backend/.env`, then run `npm run db:seed:users`. This creates one administrator and two development users; existing email addresses are left unchanged. Passwords need at least 12 characters and at most 72 UTF-8 bytes. You can also register a regular user through the UI.

Run in separate terminals from the repository root:

```sh
npm run dev --prefix backend
```

```sh
npm run dev --prefix frontend
```

Open **http://localhost:5173**. The API runs at **http://localhost:3000**; its health endpoint is `/api/health`. The frontend fails if port 5173 is occupied, keeping its URL aligned with CORS.

## Deployment

PostgreSQL is hosted on Neon, `backend/` runs as a manually configured Node.js web service on Render, and `frontend/` is hosted on Vercel. The existing `pg` driver works with Neon; no additional database SDK is required.

## Checks

In `backend/`: `npm run typeCheck` and `npm run build`. In `frontend/`: `npm run lint` and `npm run build`. Run `npm audit --audit-level=low` in both.

## Documentation

- [System architecture, flows, and deployment](docs/SYSTEM_ARCHITECTURE.md)
- [Technology decisions and security trade-offs](docs/TECH_DECISIONS.md)
