import { Router } from "express";
import {} from "../controllers/daemonUsers.controllers.js";

const router = Router();

router.post("/:user_id/:daemon_id", asignDaemonToUser);

export default router;
