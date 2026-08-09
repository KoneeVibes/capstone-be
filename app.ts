import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOption.ts";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./doc/swagger.ts";

// app instance
const app: Express = express();

// middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// docs
app.disable("x-powered-by");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// api routes would go below this line:

// api routes would go above this line.

export { app };
