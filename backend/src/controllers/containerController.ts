import { Request, Response } from "express";
import { DockerManager } from "../utils/dockerManager";
import { CreateContainerRequest, OpenUrlRequest, ApiResponse } from "../types";

export class ContainerController {
  private dockerManager: DockerManager;

  constructor() {
    this.dockerManager = new DockerManager();
  }

  async createContainer(
    req: Request<{}, ApiResponse, CreateContainerRequest>,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { url } = req.body;

      if (!url) {
        res.status(400).json({ success: false, error: "URL is required" });
        return;
      }

      try {
        new URL(url);
      } catch (error) {
        res.status(400).json({ success: false, error: "Invalid URL format" });
        return;
      }

      const containerInfo = await this.dockerManager.createContainer(url);

      res.json({
        success: true,
        data: containerInfo,
      });
    } catch (error) {
      console.error("Error creating container:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to create container" });
    }
  }

  async stopContainer(
    req: Request<{ containerId: string }>,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { containerId } = req.params;

      const success = await this.dockerManager.stopContainer(containerId);

      if (success) {
        res.json({ success: true, message: "Container stopped" });
      } else {
        res.status(404).json({ success: false, error: "Container not found" });
      }
    } catch (error) {
      console.error("Error stopping container:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to stop container" });
    }
  }

  async getContainerInfo(
    req: Request<{ containerId: string }>,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { containerId } = req.params;

      const containerInfo = this.dockerManager.getContainerInfo(containerId);

      if (containerInfo) {
        res.json({
          success: true,
          data: {
            containerId,
            url: containerInfo.url,
            vncPort: containerInfo.vncPort,
            vncUrl: `http://localhost:${containerInfo.vncPort}/vnc.html`,
            createdAt: containerInfo.createdAt,
          },
        });
      } else {
        res.status(404).json({ success: false, error: "Container not found" });
      }
    } catch (error) {
      console.error("Error getting container info:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to get container info" });
    }
  }

  async listActiveContainers(
    req: Request,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const containers = this.dockerManager.listActiveContainers();
      res.json({
        success: true,
        data: containers,
      });
    } catch (error) {
      console.error("Error listing containers:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to list containers" });
    }
  }

  async openUrl(
    req: Request<{ containerId: string }, ApiResponse, OpenUrlRequest>,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { containerId } = req.params;
      const { url } = req.body;

      if (!url) {
        res.status(400).json({ success: false, error: "URL is required" });
        return;
      }

      try {
        new URL(url);
      } catch (error) {
        res.status(400).json({ success: false, error: "Invalid URL format" });
        return;
      }

      await this.dockerManager.openUrlInContainer(containerId, url);

      res.json({
        success: true,
        message: "URL opened in container",
      });
    } catch (error) {
      console.error("Error opening URL:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to open URL in container" });
    }
  }
}
