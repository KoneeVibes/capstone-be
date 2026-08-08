import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOption.ts";

const app: Express = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// api routes would go below this line:

// api routes would go above this line.

export { app };
