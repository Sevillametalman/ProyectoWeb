import { Router } from "express";
import {getDaemonByUserId, asignDaemonToUser, unasignDaemonToUser} from "../controllers/daemonUsers.controllers.js";

const router = Router();

router.get("/:user_id", getDaemonByUserId);
router.post("/:user_id/:daemon_id", asignDaemonToUser);
router.post("/:user_id/:daemon_id", unasignDaemonToUser);

export default router;
