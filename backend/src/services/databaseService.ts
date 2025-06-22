import {
  PrismaClient,
  SessionStatus,
  LogAction,
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
      // Calculate duration in seconds
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

}
