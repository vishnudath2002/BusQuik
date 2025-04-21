import express, { NextFunction, Request, Response , } from "express";
import { connectToDatabase } from "./api/infrastructure/db/database";
import dotenv from "dotenv";
import cors from 'cors';
import userRoutes from "./api/routes/userRoutes";
import authRoutes from "./api/routes/authRoutes"
import postRoutes from "./api/routes/postRoutes"
import adminRoutes from "./api/routes/adminRoutes"
import ownerRoutes from "./api/routes/ownerRoutes";
import operatorRoutes from "./api/routes/operatorRoutes"
import cookieParser from "cookie-parser";
// import logger from './logger';

import morgan from 'morgan';
import logger from "./api/middlewares/logger";

dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.CLIENT_URL, // Frontend URL (React app)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true,
  };

  // Custom logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
  });


app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'))
app.use(cookieParser());

app.use('/', authRoutes);
app.use("/admin",adminRoutes)
app.use("/owner",ownerRoutes)
app.use('/user',userRoutes);
app.use("/operator",operatorRoutes)
app.use("/media",postRoutes)



connectToDatabase();

app.listen(process.env.PORT, () => {
    console.log('\x1b[35m%s\x1b[0m',`Server running on http://localhost:${process.env.PORT}`);
});
