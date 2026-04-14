import { Router } from "express";
import { getAllRaces, getRaceById, getRaceByName } from "../controllers/races.controller.js";
const router = Router();

router.get("/", getAllRaces);
router.get("/id/:id", getRaceById);
router.get("/name/:name", getRaceByName);

export default router;
