# Secure Browser

A secure containerized browser solution that provides isolated web browsing sessions through Docker containers with VNC access.

## What it does

- Browse websites safely in isolated Docker containers
- Each session runs in its own secure environment
- Access browser sessions remotely via VNC
- Track and log all browsing activities for security

## Quick Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/fal4782/secure-browser.git
cd secure-browser/backend
npm install
```

2. Build the Docker image for browser containers:

```bash
docker build -t vnc-browser-chrome:latest .
```

3. Set up your database URL in `backend/.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_db_name"
```

4. Run database migrations:

```bash
npx prisma migrate dev --name init
```

5. Start the server:

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Tech Stack

- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma
- Containers: Docker
- Security: Rate limiting, CORS, Helmet
