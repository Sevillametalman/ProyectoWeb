import express from "express";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { PORT } from "./config.js";
import userRoutes from "./routes/user.routes.js";
import daemonRoutes from "./routes/daemon.routes.js";
import daemonUserRoutes from "./routes/daemon.routes.js";


const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/daemon', daemonRoutes);

app.listen(PORT);
console.log("Server on port", PORT);