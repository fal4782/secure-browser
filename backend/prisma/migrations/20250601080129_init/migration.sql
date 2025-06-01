-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'ENDED', 'FAILED');

-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('CONTAINER_CREATED', 'CONTAINER_STARTED', 'URL_OPENED', 'CONTAINER_STOPPED', 'CONTAINER_TIMEOUT', 'ERROR_OCCURRED');

-- CreateEnum
CREATE TYPE "SecurityEventType" AS ENUM ('MALICIOUS_URL', 'SUSPICIOUS_ACTIVITY', 'RATE_LIMIT_EXCEEDED', 'INVALID_REQUEST');

-- CreateEnum
CREATE TYPE "EventSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "container_sessions" (
    "id" TEXT NOT NULL,
    "containerId" TEXT NOT NULL,
    "userId" TEXT,
    "targetUrl" TEXT NOT NULL,
    "vncPort" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,

    CONSTRAINT "container_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "container_logs" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "action" "LogAction" NOT NULL,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "container_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "eventType" "SecurityEventType" NOT NULL,
    "severity" "EventSeverity" NOT NULL DEFAULT 'LOW',
    "description" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "container_sessions_containerId_key" ON "container_sessions"("containerId");

-- AddForeignKey
ALTER TABLE "container_sessions" ADD CONSTRAINT "container_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "container_logs" ADD CONSTRAINT "container_logs_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "container_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
