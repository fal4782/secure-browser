import Docker from "dockerode";
import { v4 as uuidv4 } from "uuid";
import {
  ContainerInfo,
  CreateContainerResponse,
  ContainerSummary,
} from "../types/index";
import { DatabaseService } from "../services/databaseService";
import { LogAction } from "@prisma/client";

export class DockerManager {
  private docker: Docker;
  private activeContainers: Map<string, ContainerInfo>;
  private db: DatabaseService;

  constructor() {
    this.docker = new Docker();
    this.activeContainers = new Map();
    this.db = new DatabaseService();
    this.cleanupOrphanedContainers();
  }

  private isMobileUserAgent(userAgent: string): boolean {
    if (!userAgent) return false;

    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  }

  private getChromeUserAgent(isMobile: boolean): string {
    if (isMobile) {
      return "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36";
    } else {
      return "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36";
    }
  }

  async createContainer(
    url: string,
    userAgent?: string
  ): Promise<CreateContainerResponse> {
    const containerId = uuidv4();
    const isMobile = this.isMobileUserAgent(userAgent || "");
    const chromeUserAgent = this.getChromeUserAgent(isMobile);

    try {
      const container = await this.docker.createContainer({
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
        Env: [
          `TARGET_URL=${url}`,
          `USER_AGENT=${chromeUserAgent}`,
          `IS_MOBILE=${isMobile ? "true" : "false"}`,
          `VIEWPORT_WIDTH=${isMobile ? "375" : "1280"}`,
          `VIEWPORT_HEIGHT=${isMobile ? "667" : "720"}`,
        ],
        StopTimeout: 10,
      });

      await container.start();

      // Wait for container to be fully ready
      await new Promise((resolve) => setTimeout(resolve, 8000));

      const containerInfo = await container.inspect();
      const vncPort =
        containerInfo?.NetworkSettings.Ports["6080/tcp"][0].HostPort;

      if (!vncPort) {
        throw new Error("Failed to get VNC port");
      }

      // Create database session
      const session = await this.db.createSession(containerId, url, vncPort);
      await this.db.logAction(
        session.id,
        LogAction.CONTAINER_CREATED,
        `Container created for URL: ${url} (${
          isMobile ? "Mobile" : "Desktop"
        } mode)`
      );
      await this.db.logAction(
        session.id,
        LogAction.CONTAINER_STARTED,
        `VNC available on port ${vncPort}`
      );

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

      const hostIP = process.env.HOST_IP || "localhost";
      const vncUrl = `http://${hostIP}:${vncPort}/vnc_lite.html`; // Lite version that auto-connects

      return {
        containerId,
        vncPort,
        vncUrl,
      };
    } catch (error) {
      console.error("Error creating container:", error);
      throw error;
    }
  }

  async stopContainer(containerId: string): Promise<boolean> {
    const containerInfo = this.activeContainers.get(containerId);
    if (!containerInfo) {
      return false;
    }

    try {
      clearTimeout(containerInfo.timeoutId);
      await containerInfo.container.stop();

      // Update database
      const session = await this.db.getSession(containerId);
      if (session) {
        await this.db.endSession(containerId);
        await this.db.logAction(
          session.id,
          LogAction.CONTAINER_STOPPED,
          "Container stopped by user or timeout"
        );
      }

      this.activeContainers.delete(containerId);
      return true;
    } catch (error) {
      console.error("Error stopping container:", error);
      return false;
    }
  }

  getContainerInfo(containerId: string): ContainerInfo | undefined {
    return this.activeContainers.get(containerId);
  }

  listActiveContainers(): ContainerSummary[] {
    return Array.from(this.activeContainers.entries()).map(([id, info]) => ({
      containerId: id,
      url: info.url,
      vncPort: info.vncPort,
      createdAt: info.createdAt,
    }));
  }

  private async cleanupOrphanedContainers() {
    try {
      const containers = await this.docker.listContainers({
        all: true,
        filters: {
          name: ["vnc-browser-"],
        },
      });

      for (const container of containers) {
        const containerObj = this.docker.getContainer(container.Id);
        await containerObj.remove({ force: true });
        console.log(`Cleaned up orphaned container: ${container.Names[0]}`);
      }
    } catch (error) {
      console.error("Container cleanup failed:", error);
    }
  }
}
