import express from "express";
import isAuthorized from "../middleware/authorization.ts";
import retrieveMetrics from "../controller/dashboard/retrieveMetrics.ts";

const router = express.Router();

// routes open to only authenticated user types
router.get("/metrics", isAuthorized, retrieveMetrics);

export default router;
