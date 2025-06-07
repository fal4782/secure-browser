import { Router } from "express";
import { ContainerController } from "../controllers/containerController";

const router = Router();
const containerController = new ContainerController();

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


export default router;
