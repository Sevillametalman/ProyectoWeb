import { Router } from "express";
import {asignDaemonToUser, unasignDaemonToUser} from "../controllers/daemonUsers.controllers.js";

const router = Router();

router.post("/:user_id/:daemon_id", asignDaemonToUser);
router.post("/:user_id/:daemon_id", unasignDaemonToUser);

export default router;
