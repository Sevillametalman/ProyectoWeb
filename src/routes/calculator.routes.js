import { Router } from "express";
import { getCalculatedDaemon } from "../controllers/calculator.controller.js";

const router = Router();

router.get("/:id1/:id2", getCalculatedDaemon);

export default router;
