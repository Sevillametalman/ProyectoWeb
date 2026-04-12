import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import { PORT } from "./config.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import daemonRoutes from "./routes/daemon.routes.js";
import daemonUserRoutes from "./routes/daemonUsers.routes.js";
import racesRoutes from "./routes/races.routes.js";
import calculatorRouters from "./routes/calculator.routes.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRoutes); // Rutas de login/logout
app.use("/users", userRoutes); // Rutas de usuarios
app.use("/daemon", daemonRoutes); // Rutas de demonios
app.use("/daemonUseers", daemonUserRoutes); //Rutas para asignar/desasignar demonios a usuarios
app.use("/races", racesRoutes); // Rutas para consultar razas
app.use("/calculator", calculatorRouters) //

app.listen(PORT);
console.log("Server on port", PORT);
