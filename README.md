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

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Build the Docker image for browser containers:

```bash
cd ../backend
docker build -t vnc-browser-chrome:latest .
```

5. Set up your database URL in `backend/.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_db_name"
```

6. Run database migrations:

```bash
npx prisma migrate dev --name init
```

7. Start the backend server:

```bash
npm run dev
```

8. Start the frontend (in a new terminal):

```bash
cd ../frontend
npm run dev
```

## Access Points

- **Frontend Interface**: `http://localhost:3000` - Main web interface for managing browser sessions
- **Backend API**: `http://localhost:3001` - REST API server
- **VNC Sessions**: Dynamic ports assigned per container for secure browsing

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma
- **Containers**: Docker
- **Security**: Rate limiting, CORS, Helmet
- **Remote Access**: VNC + noVNC web client
