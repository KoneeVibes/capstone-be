import express from "express";
import isAuthorized from "../middleware/authorization.ts";
import search from "../controller/search/index.ts";

const router = express.Router();

// routes open to only authenticated user types
router.get("/", isAuthorized, search);

export default router;
