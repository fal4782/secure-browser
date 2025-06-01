"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const client_1 = require("@prisma/client");
class DatabaseService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    // Container session operations
    createSession(containerId, targetUrl, vncPort) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.containerSession.create({
                data: {
                    containerId,
                    targetUrl,
                    vncPort,
                },
            });
        });
    }
    getSession(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.containerSession.findUnique({
                where: { containerId },
                include: { logs: true },
            });
        });
    }
    endSession(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.prisma.containerSession.findUnique({
                where: { containerId },
            });
            if (session) {
                const duration = Math.floor((Date.now() - session.createdAt.getTime()) / 1000);
                return yield this.prisma.containerSession.update({
                    where: { containerId },
                    data: {
                        status: client_1.SessionStatus.ENDED,
                        endedAt: new Date(),
                        duration,
                    },
                });
            }
            return null;
        });
    }
    getActiveSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.containerSession.findMany({
                where: { status: client_1.SessionStatus.ACTIVE },
            });
        });
    }
    // Logging operations
    logAction(sessionId, action, details) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.containerLog.create({
                data: {
                    sessionId,
                    action,
                    details,
                },
            });
        });
    }
    getSessionLogs(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.containerLog.findMany({
                where: { sessionId },
                orderBy: { timestamp: "desc" },
            });
        });
    }
    // Security events
    logSecurityEvent(url_1, eventType_1) {
        return __awaiter(this, arguments, void 0, function* (url, eventType, severity = client_1.EventSeverity.LOW, description, ipAddress, userAgent) {
            return yield this.prisma.securityEvent.create({
                data: {
                    url,
                    eventType,
                    severity,
                    description,
                    ipAddress,
                    userAgent,
                },
            });
        });
    }
    getSecurityEvents() {
        return __awaiter(this, arguments, void 0, function* (limit = 50) {
            return yield this.prisma.securityEvent.findMany({
                orderBy: { timestamp: "desc" },
                take: limit,
            });
        });
    }
    getSecurityEventsByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.securityEvent.findMany({
                where: { url },
                orderBy: { timestamp: "desc" },
            });
        });
    }
    // Analytics
    getUsageStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalSessions = yield this.prisma.containerSession.count();
            const activeSessions = yield this.prisma.containerSession.count({
                where: { status: client_1.SessionStatus.ACTIVE },
            });
            const securityEvents = yield this.prisma.securityEvent.count();
            return {
                totalSessions,
                activeSessions,
                securityEvents,
            };
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$disconnect();
        });
    }
}
exports.DatabaseService = DatabaseService;
