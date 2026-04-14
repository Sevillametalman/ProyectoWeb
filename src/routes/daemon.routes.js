import { Router } from "express";
import {
  getAllDaemons,
  getDaemonById,
  createDemon,
  deleteDaemonByName,
  editDaemonByName,
  getDaemonByName,
  getDaemonRaceById
} from "../controllers/daemon.controllers.js";

const router = Router();

router.get("/", getAllDaemons);
router.get("/name/:name", getDaemonByName);
router.get("/id/:id", getDaemonById);
router.get("/race/:id", getDaemonRaceById);
router.post("/", createDemon);
router.put("/name/:name", editDaemonByName);
router.delete("/name/:name", deleteDaemonByName);

export default router;
