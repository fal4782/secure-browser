import {
  PrismaClient,
  SessionStatus,
  LogAction,
  SecurityEventType,
  EventSeverity,
} from "@prisma/client";

export class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Container session operations
  async createSession(containerId: string, targetUrl: string, vncPort: string) {
    return await this.prisma.containerSession.create({
      data: {
        containerId,
        targetUrl,
        vncPort,
      },
    });
  }

  async getSession(containerId: string) {
    return await this.prisma.containerSession.findUnique({
      where: { containerId },
      include: { logs: true },
    });
  }

  async endSession(containerId: string) {
    const session = await this.prisma.containerSession.findUnique({
      where: { containerId },
    });

    if (session) {
      const duration = Math.floor(
        (Date.now() - session.createdAt.getTime()) / 1000
      );

      return await this.prisma.containerSession.update({
        where: { containerId },
        data: {
          status: SessionStatus.ENDED,
          endedAt: new Date(),
          duration,
        },
      });
    }
    return null;
  }

  async getActiveSessions() {
    return await this.prisma.containerSession.findMany({
      where: { status: SessionStatus.ACTIVE },
    });
  }

  // Logging operations
  async logAction(sessionId: string, action: LogAction, details?: string) {
    return await this.prisma.containerLog.create({
      data: {
        sessionId,
        action,
        details,
      },
    });
  }

  async getSessionLogs(sessionId: string) {
    return await this.prisma.containerLog.findMany({
      where: { sessionId },
      orderBy: { timestamp: "desc" },
    });
  }

  // Security events
  async logSecurityEvent(
    url: string,
    eventType: SecurityEventType,
    severity: EventSeverity = EventSeverity.LOW,
    description?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    return await this.prisma.securityEvent.create({
      data: {
        url,
        eventType,
        severity,
        description,
        ipAddress,
        userAgent,
      },
    });
  }

  async getSecurityEvents(limit: number = 50) {
    return await this.prisma.securityEvent.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }

  async getSecurityEventsByUrl(url: string) {
    return await this.prisma.securityEvent.findMany({
      where: { url },
      orderBy: { timestamp: "desc" },
    });
  }

  // Analytics
  async getUsageStats() {
    const totalSessions = await this.prisma.containerSession.count();
    const activeSessions = await this.prisma.containerSession.count({
      where: { status: SessionStatus.ACTIVE },
    });
    const securityEvents = await this.prisma.securityEvent.count();

    return {
      totalSessions,
      activeSessions,
      securityEvents,
    };
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
