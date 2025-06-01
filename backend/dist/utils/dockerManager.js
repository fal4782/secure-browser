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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerManager = void 0;
const dockerode_1 = __importDefault(require("dockerode"));
const uuid_1 = require("uuid");
const databaseService_1 = require("../services/databaseService");
const client_1 = require("@prisma/client");
class DockerManager {
    constructor() {
        this.docker = new dockerode_1.default();
        this.activeContainers = new Map();
        this.db = new databaseService_1.DatabaseService();
        this.cleanupOrphanedContainers();
    }
    createContainer(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const containerId = (0, uuid_1.v4)();
            try {
                const container = yield this.docker.createContainer({
                    Image: "vnc-browser-chrome:latest",
                    name: `vnc-browser-${containerId}`,
                    HostConfig: {
                        Memory: 512 * 1024 * 1024, // 512MB
                        CpuShares: 512, // Half CPU
                        NetworkMode: "bridge",
                        PortBindings: {
                            "6080/tcp": [{ HostPort: "0" }], // Random port for noVNC
                            "5900/tcp": [{ HostPort: "0" }], // Random port for VNC
                        },
                        AutoRemove: true,
                    },
                    Env: [`TARGET_URL=${url}`],
                    StopTimeout: 10,
                });
                yield container.start();
                // Simple wait for container to be fully ready
                yield new Promise((resolve) => setTimeout(resolve, 8000)); // Wait 8 seconds
                const containerInfo = yield container.inspect();
                const vncPort = containerInfo === null || containerInfo === void 0 ? void 0 : containerInfo.NetworkSettings.Ports["6080/tcp"][0].HostPort;
                if (!vncPort) {
                    throw new Error("Failed to get VNC port");
                }
                // Create database session
                const session = yield this.db.createSession(containerId, url, vncPort);
                yield this.db.logAction(session.id, client_1.LogAction.CONTAINER_CREATED, `Container created for URL: ${url}`);
                yield this.db.logAction(session.id, client_1.LogAction.CONTAINER_STARTED, `VNC available on port ${vncPort}`);
                const timeoutId = setTimeout(() => {
                    this.stopContainer(containerId);
                }, 10 * 60 * 1000); // 10 minutes
                this.activeContainers.set(containerId, {
                    container,
                    vncPort,
                    url,
                    createdAt: new Date(),
                    timeoutId,
                });
                return {
                    containerId,
                    vncPort,
                    // Use auto-connect URL instead of default vnc.html
                    vncUrl: this.getDirectConnectUrl(vncPort, true),
                };
            }
            catch (error) {
                console.error("Error creating container:", error);
                throw error;
            }
        });
    }
    //Create a direct connection URL with parameters
    getDirectConnectUrl(vncPort, autoConnect = true) {
        if (autoConnect) {
            // Use URL parameters to auto-connect
            return `http://localhost:${vncPort}/vnc.html?autoconnect=true&reconnect=true&reconnect_delay=2000`;
        }
        return `http://localhost:${vncPort}/vnc.html`;
    }
    stopContainer(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const containerInfo = this.activeContainers.get(containerId);
            if (!containerInfo) {
                return false;
            }
            try {
                clearTimeout(containerInfo.timeoutId);
                yield containerInfo.container.stop();
                // Update database
                const session = yield this.db.getSession(containerId);
                if (session) {
                    yield this.db.endSession(containerId);
                    yield this.db.logAction(session.id, client_1.LogAction.CONTAINER_STOPPED, "Container stopped by user or timeout");
                }
                this.activeContainers.delete(containerId);
                return true;
            }
            catch (error) {
                console.error("Error stopping container:", error);
                return false;
            }
        });
    }
    getContainerInfo(containerId) {
        return this.activeContainers.get(containerId);
    }
    listActiveContainers() {
        return Array.from(this.activeContainers.entries()).map(([id, info]) => ({
            containerId: id,
            url: info.url,
            vncPort: info.vncPort,
            createdAt: info.createdAt,
        }));
    }
    openUrlInContainer(containerId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const containerInfo = this.activeContainers.get(containerId);
            if (!containerInfo) {
                throw new Error("Container not found");
            }
            try {
                const exec = yield containerInfo.container.exec({
                    Cmd: [
                        "google-chrome",
                        "--no-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                        "--disable-software-rasterizer",
                        "--disable-background-timer-throttling",
                        "--disable-backgrounding-occluded-windows",
                        "--disable-renderer-backgrounding",
                        "--no-first-run",
                        "--disable-default-apps",
                        "--disable-extensions",
                        "--disable-plugins",
                        "--disable-translate",
                        "--disable-background-networking",
                        "--disable-sync",
                        "--disable-web-security",
                        "--user-data-dir=/tmp/chrome-data-new",
                        url,
                    ],
                    Env: ["DISPLAY=:1"],
                    AttachStdout: true,
                    AttachStderr: true,
                });
                yield exec.start({ Detach: false, Tty: true });
                // Log URL access
                const session = yield this.db.getSession(containerId);
                if (session) {
                    yield this.db.logAction(session.id, client_1.LogAction.URL_OPENED, `Opened URL: ${url}`);
                }
                return true;
            }
            catch (error) {
                console.error("Error opening URL in container:", error);
                throw error;
            }
        });
    }
    cleanupOrphanedContainers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const containers = yield this.docker.listContainers({
                    all: true,
                    filters: {
                        name: ["vnc-browser-"], // Match your naming pattern
                    },
                });
                for (const container of containers) {
                    const containerObj = this.docker.getContainer(container.Id);
                    yield containerObj.remove({ force: true });
                    console.log(`Cleaned up orphaned container: ${container.Names[0]}`);
                }
            }
            catch (error) {
                console.error("Container cleanup failed:", error);
            }
        });
    }
}
exports.DockerManager = DockerManager;
