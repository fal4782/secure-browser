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
exports.ContainerController = void 0;
const dockerManager_1 = require("../utils/dockerManager");
class ContainerController {
    constructor() {
        this.dockerManager = new dockerManager_1.DockerManager();
    }
    createContainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url } = req.body;
                if (!url) {
                    res.status(400).json({ success: false, error: "URL is required" });
                    return;
                }
                try {
                    new URL(url);
                }
                catch (error) {
                    res.status(400).json({ success: false, error: "Invalid URL format" });
                    return;
                }
                const containerInfo = yield this.dockerManager.createContainer(url);
                res.json({
                    success: true,
                    data: containerInfo,
                });
            }
            catch (error) {
                console.error("Error creating container:", error);
                res
                    .status(500)
                    .json({ success: false, error: "Failed to create container" });
            }
        });
    }
    stopContainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { containerId } = req.params;
                const success = yield this.dockerManager.stopContainer(containerId);
                if (success) {
                    res.json({ success: true, message: "Container stopped" });
                }
                else {
                    res.status(404).json({ success: false, error: "Container not found" });
                }
            }
            catch (error) {
                console.error("Error stopping container:", error);
                res
                    .status(500)
                    .json({ success: false, error: "Failed to stop container" });
            }
        });
    }
    getContainerInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                }
                else {
                    res.status(404).json({ success: false, error: "Container not found" });
                }
            }
            catch (error) {
                console.error("Error getting container info:", error);
                res
                    .status(500)
                    .json({ success: false, error: "Failed to get container info" });
            }
        });
    }
    listActiveContainers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const containers = this.dockerManager.listActiveContainers();
                res.json({
                    success: true,
                    data: containers,
                });
            }
            catch (error) {
                console.error("Error listing containers:", error);
                res
                    .status(500)
                    .json({ success: false, error: "Failed to list containers" });
            }
        });
    }
    openUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { containerId } = req.params;
                const { url } = req.body;
                if (!url) {
                    res.status(400).json({ success: false, error: "URL is required" });
                    return;
                }
                try {
                    new URL(url);
                }
                catch (error) {
                    res.status(400).json({ success: false, error: "Invalid URL format" });
                    return;
                }
                yield this.dockerManager.openUrlInContainer(containerId, url);
                res.json({
                    success: true,
                    message: "URL opened in container",
                });
            }
            catch (error) {
                console.error("Error opening URL:", error);
                res
                    .status(500)
                    .json({ success: false, error: "Failed to open URL in container" });
            }
        });
    }
}
exports.ContainerController = ContainerController;
