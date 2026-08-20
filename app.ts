import express, { type Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./helper/corsOption.ts";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./doc/swagger.ts";
import staffRoutes from "./route/staff.ts";
import caseRoutes from "./route/case.ts";
import miscRoutes from "./route/misc.ts";
import invoiceRoutes from "./route/invoice.ts";

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
app.use("/api/v1/case", caseRoutes);
app.use("/api/v1/misc", miscRoutes);
app.use("/api/v1/invoice", invoiceRoutes);

export { app };
