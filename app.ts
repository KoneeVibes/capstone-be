import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOption.ts";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./doc/swagger.ts";
import staffRoutes from "./route/staff.ts";

// app instance
const app: Express = express();

// middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// docs
app.disable("x-powered-by");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// api routes:
app.use("/api/v1/staff", staffRoutes);

export { app };
