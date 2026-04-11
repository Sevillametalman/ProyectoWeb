import { Router } from "express";
import { getCalculatedDaemon } from "../controllers/calculator.controller.js";

const router = Router();

router.get("/:id/:id", getCalculatedDaemon); //WIP

export default router;
