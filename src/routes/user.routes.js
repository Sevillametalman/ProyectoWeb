import { Router } from "express";
import {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  deleteAllUsers,
} from "../controllers/user.controllers.js";

const router = Router();

router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/", createUser);

router.delete("/", deleteAllUsers);

router.delete("/:id", deleteUser);

router.put("/:id", updateUser);

export default router;
