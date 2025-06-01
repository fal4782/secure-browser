"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const containerController_1 = require("../controllers/containerController");
const router = (0, express_1.Router)();
const containerController = new containerController_1.ContainerController();
// Create a new container
router.post("/create", (req, res) => {
    containerController.createContainer(req, res);
});
// Stop a container
router.delete("/:containerId", (req, res) => {
    containerController.stopContainer(req, res);
});
// Get container info
router.get("/:containerId", (req, res) => {
    containerController.getContainerInfo(req, res);
});
// List all active containers
router.get("/", (req, res) => {
    containerController.listActiveContainers(req, res);
});
// Open URL in existing container
router.post("/:containerId/open", (req, res) => {
    containerController.openUrl(req, res);
});
exports.default = router;
